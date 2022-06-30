//importacion de dependencias y servicios
import React, { useState, useEffect } from 'react';
import MomentUtils from "@date-io/moment";
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Tooltip from '@material-ui/core/Tooltip';
import Search from '@material-ui/icons/Search';
import FilterList from '@material-ui/icons/FilterList';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import VisibilityIcon from '@material-ui/icons/Visibility';
import moment from "moment";
import "moment/locale/es";

// core components
import { createStyles } from '@material-ui/core';
import GridItem from '../../components/Grid/GridItem';
import GridContainer from '../../components/Grid/GridContainer';
import Table from '../../components/Table/Table';
import Card from '../../components/Card/Card';
import CardHeader from '../../components/Card/CardHeader';
import CardBody from '../../components/Card/CardBody';
import Button from '../../components/CustomButtons/Button';
import TablePagination from '../../components/Pagination/TablePagination';
import ModalLoading from '../../components/ModalLoading/ModalLoading';
import AlertComponent from '../../components/Alert/AlertComponent'

//jss
import { CustomSearchTextField, CustomTextField } from '../../assets/jss/material-dashboard-react/components/customInputStyle'
import cardTabletCustomStyle from '../../assets/jss/material-dashboard-react/components/cardTabletCustomStyle'
import { containerFloatButton } from '../../assets/jss/material-dashboard-react/components/buttonStyle'
import tooltipStyle from '../../assets/jss/material-dashboard-react/tooltipStyle'
import { container, containerFormModal, containerFooterModal, modalForm } from '../../assets/jss/material-dashboard-react'

import { AnythingObject } from '../../constants/generalConstants'
import { getAllProgramasNoToken } from "../../services/programasServices"
import { getPlanesByListIdsNoToken } from "../../services/planesServices"
import { getAreasByListIdsNoToken } from "../../services/areasServices"
import { getAllContenidoByAsignaturaNoToken } from "../../services/contenidosServices"
import { getAsignaturaByListIdsPaginatedNoToken } from "../../services/asignaturasServices"

//Estilos generales usados en el modulo
const styles = createStyles({
  CustomSearchTextFieldStyle: CustomSearchTextField.input,
  CustomTextField: CustomTextField.input,
  container,
  containerFormModal,
  containerFooterModal,
  modalForm,
  ...cardTabletCustomStyle,
  ...tooltipStyle,
  ...containerFloatButton,
});

//Inicio componente funcional con sus rescpectivas propiedades si las hubiere
function Micrositios(props: any) {
  
  //Declaración de variables y estados del componente
  const { classes } = props;

  const [showAlert, setShowAlert] = useState(false);
  const [severityAlert, setSeverityAlert] = useState('');
  const [messageAlert, setMessagesAlert] = useState('');
  const [openModalLoading, setOpenModalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);


  const [programasList, setProgramasList] = useState([]);
  const [programaSelected, setProgramaSelected] = useState<AnythingObject>({});
  const [planesList, setPlanesList] = useState([]);
  const [planSelected, setPlanSelected] = useState<AnythingObject>({});
  const [areasList, setAreasList] = useState([]);
  const [areaSelected, setAreaSelected] = useState<AnythingObject>({});
  const [contenidosList, setContenidosList] = useState([]);


  const [asignaturasList, setAsignaturasList] = useState([]);
  const [totalAsignaturas, setTotalAsignaturas] = useState(0);
  const [pagePagination, setPagePagination] = useState(1);

  //Al iniciar el modulo se obtienen los programas para el filtro inicial
  useEffect(() => {
    setOpenModalLoading(true);
    getProgramas(true);
  }, []);

  //Al seleccionar un programa se obtienen los planes
  useEffect(() => {
    if (programaSelected._id) {
      setOpenModalLoading(true);
      getPlanes();
    } else {
      //Inicializacion de objetos
      setPlanSelected({});
      setAreaSelected({});

      //inicializacion de listas
      setPlanesList([]);
      setAreasList([]);
      setAsignaturasList([]);
      setTotalAsignaturas(0);

    }
  }, [programaSelected]);

  //Al seleccionar un plan se obtienen las areas
  useEffect(() => {
    if (planSelected._id) {
      setOpenModalLoading(true);
      getAreas();
    } else {
      //Inicializacion de objetos
      setAreaSelected({});

      //inicializacion de listas
      setAreasList([]);
      setAsignaturasList([]);
      setTotalAsignaturas(0);
    }
  }, [planSelected]);

  //Al seleccionar una area se obtienen las asignaturas
  useEffect(() => {
    if (areaSelected._id) {
      setOpenModalLoading(true);
      getAsignaturas();
    }
  }, [areaSelected]);

  //Metodo para la obtencion de programas
  const getProgramas = async (setByDefault?:boolean) => {
    let response: any = await getAllProgramasNoToken({
      search: '',
    });
    if (response && response.programas) {
      setProgramasList(response.programas);
      if (setByDefault){
        var findIngeniriaProgram = response.programas.find((programa:any) => programa.codigo==="1")
        if (findIngeniriaProgram){
          setProgramaSelected(findIngeniriaProgram)
          getPlanes(setByDefault, findIngeniriaProgram)
        }
      }
    }
    setOpenModalLoading(false);
  }

  //Metodo para la obtencion de planes
  const getPlanes = async (setByDefault?:boolean, programa?:any) => {
    var planIds : any 
    if (!setByDefault){
      planIds = programaSelected.plan.map((option: any) => option._id);
    }else{
      planIds = programa.plan.map((option: any) => option._id);
    }
    
    let response: any = await getPlanesByListIdsNoToken({
      search: '',
      planIds
    });
    if (response && response.planes) {
      setPlanesList(response.planes);
      if (setByDefault){
        var find8210Plan = response.planes.find((plan:any)=> plan.codigo === "8210")
        if (find8210Plan){
          await setPlanSelected(find8210Plan)
          getAreas(setByDefault, find8210Plan)
        }
      }
    }
    setOpenModalLoading(false);
  }

  //Metodo para la obtencion de areas
  const getAreas = async (setByDefault?:boolean, plan?:any) => {
    var areaIds
    if (!setByDefault){
      areaIds = planSelected.area.map((option: any) => option._id);
    }else{
      areaIds = plan.area.map((option: any) => option._id);
    }
    
    let response: any = await getAreasByListIdsNoToken({
      search: '',
      areaIds
    });
    if (response && response.areas) {
      setAreasList(response.areas);
      if (setByDefault){
        var findIngArea = response.areas.find((area:any)=> area.codigo === "1")
        if (findIngArea){
          setAreaSelected(findIngArea)
        }
      }
    }
    setOpenModalLoading(false);
  }

  //Metodo para la obtencion de asignaturas
  const getAsignaturas = async (page?: any) => {
    var asignaturaIds = areaSelected.asignatura.map((option: any) => option._id);
    let response: any = await getAsignaturaByListIdsPaginatedNoToken({
      page: page ? page : 0,
      asignaturaIds
    });
    if (response && response.asignaturas && response.asignaturas.length) {
      //Se recorre respuesta con los datos obtenidos para generar un arreglo en el orden que se muestran los datos en la tabla
      let asignaturas = response.asignaturas.map((data: any) => {
        let arrayData = [
          data.codigo,
          data.nombre,
          data.cantidadCredito,
          data.intensidadHoraria,
          data.semestre,
          moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
          moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a'),
          <Tooltip id='filterTooltip' title="Ver contenidos" placement='top' classes={{ tooltip: classes.tooltip }}>
            <div className={classes.buttonHeaderContainer}>
              <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<VisibilityIcon />}
                onClick={() => {
                  setOpenModalLoading(true);
                  getContenidos(data);
                }} />
            </div>
          </Tooltip>
        ];
        return arrayData;
      });
      setTotalAsignaturas(response.totalAsignaturas);
      setAsignaturasList(asignaturas);
      setOpenModalLoading(false);
    } else {
      setAsignaturasList([]);
      setTotalAsignaturas(0);
      setSeverityAlert('info');
      setShowAlert(true);
      setMessagesAlert('No se encontraron registros en la base de datos, por favor prueba con otros filtros');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
  }

  //Metodo para la obtencion de contenidos segun la asignatura seleccionada
  const getContenidos = async (asignaturaSelected: any) => {
    
    const contenidosIds = asignaturaSelected.contenido.map((option: any) => option._id);
    let response: any = await getAllContenidoByAsignaturaNoToken({
      search: '',
      contenidosIds
    });
    if (response && response.contenidos && response.contenidos.length) {
      let contenidos = response.contenidos.map((data: any) => {
        let arrayData = [
          data.codigo,
          data.nombre,
          data.descripcion,
          moment(data.fechaCreacion).format('D/MM/YYYY, h:mm:ss a'),
          moment(data.fechaActualizacion).format('D/MM/YYYY, h:mm:ss a')
        ];
        return arrayData;
      });
      setContenidosList(contenidos);
      setOpenModal(true)
    }else{
      setContenidosList([]);
      setSeverityAlert('info');
      setShowAlert(true);
      setMessagesAlert('No se encontraron registros en la base de datos, por favor prueba con otros filtros');
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
    setOpenModalLoading(false);
  }

  //Cuando se cambia de pagina se ejecuta el metodo getHomologaciones con la pagina solicitada
  const onChangePage = (page: number) => {
    setOpenModalLoading(true);
    getAsignaturas(page);
  };

  //Retorno con todos la construcción de la interfaz del modulo
  return (
    <div>
      <AlertComponent severity={severityAlert} message={messageAlert} visible={showAlert} />
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="success">
              <div className={classes.TitleFilterContainer}>
                <h4 className={classes.cardTitleWhite}>Micrositios</h4>
              </div>
            </CardHeader>

            <CardBody>

              <GridContainer>
                <GridItem xs={12} sm={12} md={4} >
                  <Autocomplete
                    id="tags-outlined"
                    options={programasList}
                    getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                    filterSelectedOptions
                    onChange={(e, option) => {
                      setProgramaSelected(option || {})
                      //Inicializacion de objetos
                      setPlanSelected({});
                      setAreaSelected({});

                      //inicializacion de listas
                      setPlanesList([]);
                      setAreasList([]);
                      setAsignaturasList([]);
                      setTotalAsignaturas(0);

                    }}
                    value={programaSelected}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="outlined-rol"
                        label="Programa"
                        variant="outlined"
                        margin="dense"
                        error={programaSelected && !programaSelected._id ? true : false}
                        className={classes.CustomTextField}
                      />
                    )}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4} >
                  <Autocomplete
                    id="tags-outlined"
                    options={planesList}
                    getOptionLabel={(option: any) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                    filterSelectedOptions
                    onChange={(e, option) => {
                      setPlanSelected(option || {})
                      //Inicializacion de objetos
                      setAreaSelected({});

                      //inicializacion de listas
                      setAreasList([]);
                      setAsignaturasList([]);
                      setTotalAsignaturas(0);

                    }}
                    value={planSelected}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="outlined-rol"
                        label="Plan"
                        variant="outlined"
                        margin="dense"
                        error={planSelected && !planSelected._id ? true : false}
                        className={classes.CustomTextField}
                      />
                    )}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={4} >
                  <Autocomplete
                    id="tags-outlined"
                    options={areasList}
                    getOptionLabel={(option) => option._id ? `${option.codigo} - ${option.nombre}` : ''}
                    filterSelectedOptions
                    onChange={(e, option) => {
                      setAreaSelected(option || {});
                    }}
                    value={areaSelected}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        id="outlined-rol"
                        label="Área"
                        variant="outlined"
                        margin="dense"
                        error={areaSelected && !areaSelected._id ? true : false}
                        className={classes.CustomTextField}
                      />
                    )}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12} >
                  <hr />
                </GridItem>

              </GridContainer>


              {
                !asignaturasList.length ?
                  <h2 style={{ textAlign: 'center' }}>No se encontraron asignaturas en la base de datos</h2>
                  :
                  <Table
                    tableHeaderColor="success"
                    tableHead={[
                      'Código',
                      'Nombre',
                      'Créditos',
                      'Horas semanales',
                      'Semestre',
                      'Fecha de creación',
                      'Fecha ultima actualización',
                      'Acciones'
                    ]}
                    tableData={asignaturasList}
                  />
              }

            </CardBody>
          </Card>

          <Card className={classes.centerContent}>
            <TablePagination page={pagePagination} onChangePage={onChangePage} totalData={totalAsignaturas} />
          </Card>

        </GridItem>
      </GridContainer>

      {/* Modal listado de contenidos por asignatura */}
      
      <Modal
        open={openModal}
        className={classes.modalForm}
      >
        <div className={classes.centerContent}>
          <GridItem xs={12} sm={8} md={8} >
            <Card className={classes.container}>
              <CardHeader color="success">
                <div className={classes.TitleFilterContainer}>
                  <h4 className={classes.cardTitleWhite}>Contenidos</h4>
                  <div className={classes.headerActions}>
                    <Tooltip id='filterTooltip' title="Cerrar" placement='top' classes={{ tooltip: classes.tooltip }}>
                      <div className={classes.buttonHeaderContainer}>
                        <Button key={'filtersButton'} color={'primary'} size='sm' round variant="outlined" justIcon startIcon={<CloseIcon />}
                          onClick={() => { setOpenModal(false) }} />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader >
              <div className={classes.containerFormModal} >
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12} >
                    {
                      !contenidosList.length ?
                        <h2 style={{ textAlign: 'center' }}>No se encontraron contenidos en la base de datos</h2>
                        :
                        <Table
                          tableHeaderColor="success"
                          tableHead={[
                            'Código',
                            'Nombre',
                            'Descripción',
                            'Fecha de creación',
                            'Fecha ultima actualización'
                          ]}
                          tableData={contenidosList}
                        />
                    }
                  </GridItem>
                </GridContainer>
              </div>
            </Card>
          </GridItem>
        </div>
      </Modal>

      <ModalLoading showModal={openModalLoading} />
    </div>
  );
}

export default withStyles(styles)(Micrositios);
