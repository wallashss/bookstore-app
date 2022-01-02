import * as React from 'react';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {useEffect, useState} from "react";


const Alert = React.forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertPopup(props : any) {

  useEffect(() => {
    console.log("Props", props)
  })

  const [statusPopup, setStatusPopup] = useState({
    open: props.open || false,
    severity: props.severity || 'error',
    message: props.message || ''
  });

  // setStatusPopup({
  //   open: props.open || false,
  //   severity: props.severity || 'error',
  //   message: props.message || ''
  // })

  console.log(statusPopup)
  const handleSuccessClose = (event : any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setStatusPopup({...statusPopup, open: false});
  };

  return (
    <Snackbar open={statusPopup.open} autoHideDuration={3000} onClose={handleSuccessClose}>
      <Alert onClose={handleSuccessClose} severity={statusPopup.severity} sx={{ width: '100%' }}>
        {statusPopup.message}
      </Alert>
    </Snackbar>
  )
}