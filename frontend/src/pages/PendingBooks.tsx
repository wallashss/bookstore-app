import * as React from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useEffect, useState} from "react";
import { useSearchParams } from 'react-router-dom'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getUserId } from '../services/SessionService';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { addItem } from '../services/RequestItemService';
import NavBar from '../components/NavBar';
import { Typography } from '@mui/material';
import AlertPopup from '../components/AlertPopup';
import { getPendingBooks, updatePendingBooksStatus } from '../services/PendingService';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';


type BookRow = {
  id: number,
  publisherCode: string,
  name: string,
  publisherName: string,
  currentPrice: number,
  clientName: string, 
  clientCpf: string,
  status: 'P' | 'R' | 'A' | 'D' | 'C'
}

const statusMap : any = {
  'P': 'pendente',
  'R': 'pedido',
  'A': 'chegou', 
  'D': 'entregue',
  'C': 'cancelado'
}
const theme = createTheme();
const Alert = React.forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const LOAD_ERROR_MSG = 'Erro ao carregar a página! Não será possível adicionar itens.'

export default function PendingBooks({all} : {all: boolean}) {

  const [searchParams, setSearchParams] = useSearchParams();
  const [rows, setRows] = useState([] as BookRow[])
  const [rowsLoading, setRowsLoading] = useState([] as boolean[])
  const [search, setSearch] = useState(searchParams.get('search') as string)

  const [statusPopup, setStatusPopup] = useState({
    open: false,
    severity: 'error',
    message: ''
  });

  const loadBooks = () => {
    const userId = getUserId();
    
    getPendingBooks(all ? null : userId).then(pendingBooks => {
      setRows(pendingBooks)
      setRowsLoading(pendingBooks.map(() => false))
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
    loadBooks();
  }, [])

  const handleAlertClose = (event : any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setStatusPopup({...statusPopup, open: false});
  };
  
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userId = getUserId();
    const data = new FormData(event.currentTarget);
    const search = data.get('search') as string
    console.log(search)
    getPendingBooks(all ? null : userId , search).then(pendingBooks => {
      setRows(pendingBooks)
      setRowsLoading(pendingBooks.map(() => false))
    })
    .catch(err => {
      setStatusPopup({...statusPopup, 
        open: true, 
        message: LOAD_ERROR_MSG,
        severity: 'error'
      })
      console.log(err);
    })

  };

  const setStatusForRow = (idx: number, status: boolean) => {
    setRowsLoading([...rowsLoading.slice(0, idx), 
      status, 
      ...rowsLoading.slice(idx+1)]
    )
  }

  const handleChangeStatus = (idx: number, value: string) => {

    setStatusForRow(idx, true)
    const row = rows[idx]
    const pendingBookId = row.id 

    updatePendingBooksStatus(pendingBookId, value).then(() => {

      console.log("ok")

      setRows([...rows.slice(0, idx), 
        {...rows[idx], status: value as any}, 
        ...rows.slice(idx+1)]
      )
      setStatusPopup({...statusPopup, 
        open: true,
        message: `"${row.name}" está como ${statusMap[value]}`,
        severity: 'success'
       });
       setStatusForRow(idx, false)
    })
    .catch(err => {
      console.log(err)
      setStatusPopup({...statusPopup, 
        open: true,
        message: `Error ao atualizar o status de ${row.name}`,
        severity: 'error'
       });
    })

  }

  return (
    <div style={{ height: 500, width: '100%' }}>
      <ThemeProvider theme={theme}>
        <NavBar></NavBar>
        <Container>
        <Typography variant='h4'sx={{mt: 2}} align='left'>Minhas Pendências</Typography>
          <CssBaseline />
          <Box
            component="form" 
            onSubmit={handleSearch}
            sx={{
              mt: 2,
              marginBottom: 2,
              display: 'flex',
              flexDirection: 'row',
            }}
          >
          <TextField 
            sx={{width: '75ch'}}
            id="search2" 
            autoFocus
            name='search'
            value={search}
            onChange={e => setSearch(e.target.value)}
            label="Busca por cliente" 
            variant="standard" />
          <Button 
            type="submit"
            variant="contained"
            sx={{marginLeft: 2}}>
              Buscar
          </Button>
          </Box>
          <TableContainer sx={{mb: 2}} component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align='center'>Código da Editora</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Editora</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>CPF</TableCell>
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
                  <TableCell align='center'>{row.publisherCode}</TableCell>
                  <TableCell >{row.name}</TableCell>
                  <TableCell >{row.publisherName}</TableCell>
                  <TableCell >{row.clientName}</TableCell>
                  <TableCell >{row.clientCpf}</TableCell>
                  <TableCell align='center'>{`R$ ${row.currentPrice.toFixed(2)}`}</TableCell>
                  <TableCell align='center'>
                    <Box  sx={{ position: 'relative' }}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={row.status}
                        disabled={rowsLoading[idx]}
                        label="Age"
                        onChange={e => handleChangeStatus(idx, e.target.value)}
                      >
                        <MenuItem value='P'>Pendente</MenuItem>
                        <MenuItem value='R'>Pedido</MenuItem>
                        <MenuItem value='A'>Chegou</MenuItem>
                        <MenuItem value='D'>Entregue</MenuItem>
                        <MenuItem value='C'>Cancelado</MenuItem>
                      </Select>
                      {
                        rowsLoading[idx] && 
                        <CircularProgress
                          size={24}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                          }}
                        />
                      }
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        </Container>
        <AlertPopup message={statusPopup.message}
          open={statusPopup.open}
          severity={statusPopup.severity}
          onClose={handleAlertClose}
        >
        </AlertPopup>
        
      </ThemeProvider>
    </div>
  );
}
