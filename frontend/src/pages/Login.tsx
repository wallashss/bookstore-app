import * as React from 'react';
import {useState} from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NavBar from '../components/NavBar';
import { login } from '../services/SessionService';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const theme = createTheme();

const Alert = React.forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Login() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    const credentials = {
      username: data.get('username'),
      password: data.get('password'),
    };

    login(credentials).then(() => {
      
      window.location.href = '/'
    })
    .catch(err => {
      setStatusPopup({...statusPopup, 
        open: true, 
        message: 'Usuário ou senha inválidos',
        severity: 'error'
      })
    })
  };

  const [statusPopup, setStatusPopup] = useState({
    open: false,
    severity: 'error',
    message: ''
  });

  const handleSuccessClose = (event : any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setStatusPopup({...statusPopup, open: false});
  };

  return (
    <div>
    <ThemeProvider theme={theme}>
      <NavBar ></NavBar>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Entrar
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuário"
              name="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submeter
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
       <Snackbar open={statusPopup.open} autoHideDuration={3000} onClose={handleSuccessClose}>
       <Alert onClose={handleSuccessClose} severity={statusPopup.severity} sx={{ width: '100%' }}>
         {statusPopup.message}
       </Alert>
     </Snackbar>
     </div>   
  );
}