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
import { closeRequest, getOpenRequest, getRequest, updateRequest } from '../services/RequestService';
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
import { useSearchParams } from 'react-router-dom'


const theme = createTheme();

const Alert = React.forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CLOSE_SUCCESS_MSG = 'Pedido Fechado com Sucesso!'
const CLOSE_ERROR_MSG = 'Erro ao fechar o pedido!'
const SAVE_SUCCESS_MSG = 'Pedido Salvo com Sucesso!'
const SAVE_ERROR_MSG = 'Erro ao salvar o pedido!'
const LOAD_ERROR_MSG = 'Erro ao carregar o pedido!'

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

  let [searchParams, setSearchParams] = useSearchParams();

  const loadRequest = () => {
    const requestId = Number(searchParams.get('id') as string)
    getRequest(requestId).then(req => {
      setRequest(req)
      setRows(req.books || [])
      window.print();
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

    console.log(request.wrapPrice)
    return sum + (Number(request.wrapPrice) ?? 0) - (request.discount ?? 0 )
  }

  return (
    <div style={{ height: 500, width: '100%' }}>
      <ThemeProvider theme={theme}>

        <Container >
          <Box sx={{}}>
            <Typography variant='h6'>
              Santos Variedades
              Livraria e Papelaria
            </Typography>
          </Box>
          <Box sx={{}}>
            <Typography variant='subtitle1'>
            Und 205 Rua 205 N 94. Cidade Operária - Fone: 3247-4717
            </Typography>
          </Box>
          <Box sx={{mt: 2}}>
            <Typography variant='h6'>
              Pedido de Livros
            </Typography>
          </Box>
          <CssBaseline />
          <Box component="form" sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={1}>
            <Grid item xs={2}>
                <TextField 
                  name='id'
                  fullWidth
                  size="small"
                  label="Número do Pedido" 
                  value={request.id || "--"}
                  onChange={e => setRequest({...request, client: e.target.value})}
                  />
              </Grid>
              <Grid item xs={4}>
              <TextField 
                name='date'
                fullWidth
                label="Data do Pedido" 
                size="small"
                value={ new Date(request.requestDate).toLocaleString() }
                onChange={e => setRequest({...request, clientCpf: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  name='name'
                  fullWidth
                  size="small"
                  label="Atendente" 
                  value={request.sellerName || "--"}
                  onChange={e => setRequest({...request, client: e.target.value})}
                  />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  name='name'
                  fullWidth
                  size="small"
                  label="Cliente" 
                  value={request.client || "--"}
                  onChange={e => setRequest({...request, client: e.target.value})}
                  />
              </Grid>
            </Grid>
        </Box>
        <TableContainer component={Paper} sx={{mt: 2}}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
            <TableHead>
              <TableRow >
                <TableCell>#</TableCell>
                {/* <TableCell>Código da Editora</TableCell> */}
                <TableCell>Nome</TableCell>
                <TableCell>Editora</TableCell>
                <TableCell>Preço</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell >{idx + 1}</TableCell>
                  {/* <TableCell >{row.publisherCode}</TableCell> */}
                  <TableCell >{row.name}</TableCell>
                  <TableCell >{row.publisherName}</TableCell>
                  <TableCell >{`R$${row.currentPrice.toFixed(2)}`} </TableCell>
                </TableRow>
              ))}
              <TableRow
                  key={-1}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell ></TableCell>
                  {/* <TableCell ></TableCell> */}
                  <TableCell >Encapamento</TableCell>
                  <TableCell ></TableCell>
                  <TableCell >{`R$${(Number(request.wrapPrice) || 0)?.toFixed(2)}`}</TableCell>
                  <TableCell ></TableCell>
              </TableRow>
              <TableRow
                  key={-1}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell ></TableCell>
                  {/* <TableCell ></TableCell> */}
                  <TableCell >Desconto</TableCell>
                  <TableCell ></TableCell>
                  <TableCell >{`R$${(Number(request.discount) || 0)?.toFixed(2)}`}</TableCell>
                  <TableCell ></TableCell>
              </TableRow>
              <TableRow
                  key={-1}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell ></TableCell>
                  {/* <TableCell ></TableCell> */}
                  <TableCell ><Typography sx={{fontWeight: 'bold'}}>TOTAL</Typography></TableCell>
                  <TableCell ></TableCell>
                  <TableCell ><Typography sx={{fontWeight: 'bold'}}>{`R$${getTotal().toFixed(2)}`}</Typography></TableCell>
                  <TableCell ></TableCell>
              </TableRow>
              
            </TableBody>
          </Table>
        </TableContainer>
        <Typography sx={{mt: 1}} variant='body2'>
        Pedidos de livros Prazo de entrega em até 90 dias para livros 
        que estiverem em falta na editora, após este prazo o cliente 
        pode ser reembolsado ou ressacido em espécie ou em mercadoria.
        </Typography>
        </Container>
      </ThemeProvider>
    </div>
  );
}