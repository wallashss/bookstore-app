import * as React from 'react';
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
import {useEffect, useState} from "react";
import { closeRequest, getOpenRequest, updateRequest } from '../services/RequestService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { getUserId } from '../services/SessionService';
import AlertPopup from '../components/AlertPopup'

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import NavBar from '../components/NavBar';
import { removeItem } from '../services/RequestItemService';

const theme = createTheme();

const Alert = React.forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CLOSE_SUCCESS_MSG = 'Pedido Fechado com Sucesso!'
const CLOSE_ERROR_MSG = 'Erro ao fechar o pedido!'
const SAVE_SUCCESS_MSG = 'Pedido Salvo com Sucesso!'
const SAVE_ERROR_MSG = 'Erro ao salvar o pedido!'
const LOAD_ERROR_MSG = 'Erro ao carregar o pedido!'
const REMOVE_SUCCESS_MSG = 'Livro removido com sucesso!'
const REMOVE_ERROR_MSG = 'Erro ao remover livro!'

type BookRow = {
  id: number,
  publisherCode: string,
  name: string,
  bookId: number,
  publisherName: string,
  currentPrice: number
}

export default function CurrentRequest() {

  const [rows, setRows] = useState([] as BookRow[])
  const [open, setOpen] = useState(false);
  const [request, setRequest] = useState({} as any)
  const [statusPopup, setStatusPopup] = useState({
    open: false,
    severity: 'error',
    message: ''
  });

  const loadRequest = () => {
    const userId = getUserId();
    getOpenRequest(userId).then(req => {
      setRequest(req)
      setRows(req.books || [])
    })
    .catch(err => {
      setStatusPopup({...statusPopup, 
        open: true, 
        message: LOAD_ERROR_MSG,
        severity: 'error'
      })
      console.log(err);
    })
  }
  useEffect(() => {
    loadRequest()
  }, [])

  const getTotal = () => {
    const sum =  request.books?.reduce((sum : number, b : any) => sum + b.currentPrice , 0) || 0

    return sum + (Number(request.wrapPrice) ?? 0) - (request.discount ?? 0 )
  }
  const handleClickClose = () => {
    setOpen(true);
  };

  const getRequesInfo = () => {
    return  {
      id : request.id,
      sellerId : request.sellerId,
      client : request.client,
      requestDate : request.requestDate,
      clientPhone : request.clientPhone,
      clientEmail : request.clientEmail,
      clientCpf : request.clientCpf,
      clientAddress : request.clientAddress,
      isClosed : request.isClosed,
      notes : request.notes,
      wrapPrice : request.wrapPrice,
      discount : request.discount,
    };
  }

  const handleClickSave = () => {
    const userId = getUserId();

    const requestInfo = getRequesInfo()

    updateRequest(userId, requestInfo).then(() => {
      setStatusPopup({...statusPopup, 
        open: true, 
        message: SAVE_SUCCESS_MSG,
        severity: 'success'
      })
    })
    .catch(err => {
      setStatusPopup({...statusPopup, 
        open: true, 
        message: SAVE_ERROR_MSG,
        severity: 'error'
      })
    })
  };

  const handleCloseCancel = () => {
    setOpen(false); 
  }

  const handleCloseConfirm = () => {
    setOpen(false); 
    const userId = getUserId();

    const requestInfo = getRequesInfo();
    updateRequest(userId, requestInfo).then(() => {
      return closeRequest(userId).then(() => {
        setStatusPopup({...statusPopup, 
          open: true, 
          message: CLOSE_SUCCESS_MSG,
          severity: 'success'
        })
        loadRequest()
      })
      .catch(err => {
        setStatusPopup({...statusPopup, 
          open: true, 
          message: CLOSE_ERROR_MSG,
          severity: 'error'
        })
      })  
    })
    
  }

  const handleSuccessClose = (event : any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setStatusPopup({...statusPopup, open: false});
  };

  const handleRemove = (idx: number) => {
    const bookId = request.books[idx].id
    console.log(bookId);
    removeItem(bookId).then(() => {
      setStatusPopup({...statusPopup, 
        open: true, 
        message: REMOVE_SUCCESS_MSG,
        severity: 'success'
      })
      loadRequest()
    })
    .catch(err => {
      setStatusPopup({...statusPopup, 
        open: true, 
        message: REMOVE_ERROR_MSG,
        severity: 'error'
      })
      console.log(err)
    })
    
  }
  return (
    <div style={{ height: 500, width: '100%' }}>
      <ThemeProvider theme={theme}>
        <NavBar ></NavBar>
        <Container sx={{mb: 4}} >
          <CssBaseline />
          <Typography variant='h4'sx={{mt: 2}} align='left'>Pedido Aberto</Typography>
          <Box component="form" sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField 
                  name='name'
                  fullWidth
                  label="Nome do Cliente" 
                  value={request.client || ""}
                  onChange={e => setRequest({...request, client: e.target.value})}
                  />
              </Grid>
              <Grid item xs={6}>
              <TextField 
                name='cpf'
                fullWidth
                label="CPF" 
                value={request.clientCpf || ""}
                onChange={e => setRequest({...request, clientCpf: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
              <TextField 
                name='phone'
                fullWidth
                label="Telefone" 
                value={request.clientPhone || ""}
                onChange={e => setRequest({...request, clientPhone: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  name='email'
                  fullWidth
                  label="Email"
                  value={request.clientEmail || ""}
                  onChange={e => setRequest({...request, clientEmail: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  name='address'
                  fullWidth
                  label="Endereço" 
                  value={request.clientAddress || ""}
                  onChange={e => setRequest({...request, clientAddress: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
              <TextField 
                name='cover'
                fullWidth
                placeholder='Ex: 10.00'
                label="Preço do Encapamento" 
                value={request.wrapPrice || ""}
                onChange={e => setRequest({...request, wrapPrice: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  name='discount'
                  fullWidth
                  placeholder='Ex: 10.00'
                  label="Desconto" 
                  value={request.discount || ""}
                  onChange={e => setRequest({...request, discount: e.target.value})}
                />
              </Grid>

              {/* Buttons */}
              <Grid item xs={4}>
                <Button 
                  fullWidth
                  variant="outlined"
                  onClick={handleClickSave}
                >Salvar</Button>
              </Grid>
              <Grid item xs={4}>
                <Button 
                  fullWidth
                  href={'/pdf?id=' + request.id}
                  variant="outlined"
                >Gerar PDF</Button>
              </Grid>
              <Grid item xs={4}>
                <Button 
                  fullWidth
                  variant="contained"
                  onClick={handleClickClose}
                >Fechar Pedido</Button>
              </Grid>
            </Grid>
        </Box>
        <TableContainer component={Paper} sx={{mt: 2, mb: 4}}>
          <Table sx={{ minWidth: 650}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align='center'>#</TableCell>
                <TableCell align='center'>ID</TableCell>
                <TableCell align='center'>Código da Editora</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell align='center'>Editora</TableCell>
                <TableCell align='center'>Preço</TableCell>
                <TableCell align='center'>Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow 
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {/* <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell> */}
                  <TableCell align='center'>{idx+1}</TableCell>
                  <TableCell align='center'>{row.bookId}</TableCell>
                  <TableCell align='center'>{row.publisherCode || "--"}</TableCell>
                  <TableCell >{row.name}</TableCell>
                  <TableCell align='center'>{row.publisherName}</TableCell>
                  <TableCell align='center'>{`R$ ${row.currentPrice.toFixed(2)}`}</TableCell>
                  <TableCell align='center'>
                  <Button 
                    variant="outlined"
                    size="small"
                    onClick={e => handleRemove(idx)}
                    sx={{marginLeft: 2}}>
                      Remover
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow
                  key={-1}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell ></TableCell>
                  <TableCell ></TableCell>
                  <TableCell ></TableCell>
                  <TableCell >Encapamento</TableCell>
                  <TableCell ></TableCell>
                  <TableCell align='center'>{`R$ ${(Number(request.wrapPrice) || 0)?.toFixed(2)}`}</TableCell>
                  <TableCell ></TableCell>
              </TableRow>
              <TableRow
                  key={-2}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell ></TableCell>
                  <TableCell ></TableCell>
                  <TableCell ></TableCell>
                  <TableCell >Desconto</TableCell>
                  <TableCell ></TableCell>
                  <TableCell align='center'>{`R$ -${(Number(request.discount) || 0)?.toFixed(2)}`}</TableCell>
                  <TableCell ></TableCell>
              </TableRow>
              <TableRow
                  key={-3}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell ></TableCell>
                  <TableCell ></TableCell>
                  <TableCell ></TableCell>
                  <TableCell ><Typography sx={{fontWeight: 'bold'}}>TOTAL</Typography> </TableCell>
                  <TableCell ></TableCell>
                  <TableCell align='center'><Typography sx={{fontWeight: 'bold'}}>{`R$ ${getTotal().toFixed(2)}`}</Typography> </TableCell>
                  <TableCell ></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        </Container>
        <Box sx={{mt: 4, height: 12}}></Box>
      </ThemeProvider>
      <Snackbar open={statusPopup.open} autoHideDuration={3000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity={statusPopup.severity} sx={{ width: '100%' }}>
          {statusPopup.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={handleCloseCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Fechar Pedido?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          O pedido será fechado não será mais possível editar. Confirma?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancel}>Cancelar</Button>
          <Button onClick={handleCloseConfirm} autoFocus>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}