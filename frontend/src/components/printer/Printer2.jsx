import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ComponentToPrint from './ComponentToPrint';
import PrintIcon from '@material-ui/icons/Print';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const pageStyle = `
footer{
  position: absolute;
  bottom: 0;
}

body{
    margin: 0;
}

@media all {
  hr{
    border-color: #000000; 
   }

  p{
    margin: 2mm;
  }

  body{
    font-size: 12px;
    font-family:Verdana, Geneva, sans-serif; 
  }

  th{
    font-size: 10px;
  }

  td{
    margin: 0;
    font-size: 12px;
  }

  .acaiName{
    font-weight: bold;
    font-size: 13px;
  }

  .tdadditional {
    font-size: 12px;
  }
}

@media all {
    .page-break {
      display: none;
    }
  }
  
  @media print {
    html, body {
      height: initial !important;
      overflow: initial !important;
      -webkit-print-color-adjust: exact;
    }
  }
  
  @media print {
    .page-break {
      margin-top: 1rem;
      display: block;
      page-break-before: auto;
    }
  }
  
  @page {
    size: auto;
    margin-left: 5mm;
    margin-right: 5mm;
    }

`;

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const Example = ({array, onClickClose, submit, onPrint, chamada, onBefore}) => {
    const componentRef = useRef();
    
    const classes = useStyles();

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      onAfterPrint: onClickClose,
      copyStyles: false,
      pageStyle: pageStyle,
      onBeforeGetContent: onBefore
    });

  return (
    <div>
        <div style={{display: 'none'}}>
        <ComponentToPrint ref={componentRef} array={array}/>
        </div>
        <Button
        variant="contained"
        color='#FFF;'
        className={classes.button}
        startIcon={<PrintIcon color="inherit"/>}
        onClick={handlePrint}
      ></Button>
    </div>
  );
};

export default Example