import {
  defaultFont,
  container,
  successColor,
  grayColor
} from '../../material-dashboard-react';

import { createStyles } from '@material-ui/core';

const footerStyle = createStyles({
  block: {
    color: 'inherit',
    padding: '15px',
    textTransform: 'uppercase',
    borderRadius: '3px',
    textDecoration: 'none',
    position: 'relative',
    display: 'block',
    ...defaultFont,
    fontWeight: 500,
    fontSize: '12px'
  },
  left: {
    float: 'left', // "left!important"
    display: 'block'
  },
  right: {
    padding: '15px 0',
    margin: '0',
    fontSize: '14px',
    float: 'right', // float: "right!important"
    fontWeight: 600
  },
  footer: {
    bottom: '0',
    borderTop: '1px solid ' + grayColor[11],
    padding: '15px 0',
    ...defaultFont
  },
  container,
  a: {
    color: successColor[0], // color: primaryColor
    textDecoration: 'none',
    backgroundColor: 'transparent',
    '&:hover': {
      color: successColor[1],
    }
  },
  list: {
    marginBottom: '0',
    padding: '0',
    marginTop: '0'
  },
  inlineBlock: {
    display: 'inline-block',
    padding: '0px',
    width: 'auto'
  }
});

export default footerStyle;
