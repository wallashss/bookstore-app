import * as React from 'react';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type PropsType = {
  open: boolean,
  message: string,
  severity: string, 
  onClose: any,
  children: never[]
} 
export default function AlertPopup({
    open, 
    message,
    severity,
    onClose
  } : PropsType
  ) {

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}