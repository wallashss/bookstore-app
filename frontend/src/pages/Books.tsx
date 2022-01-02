import * as React from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useEffect, useState} from "react";
import { getBooks } from '../services/BooksService';
import { getOpenRequest } from '../services/RequestService';

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


type BookRow = {
  id: number,
  publisherCode: string,
  name: string,
  publisherName: string,
  price: number
}

const theme = createTheme();
const Alert = React.forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const LOAD_ERROR_MSG = 'Erro ao carregar a página! Não será possível adicionar itens.'

export default function Books() {
  const [rows, setRows] = useState([] as BookRow[])
  const [request, setRequest] = useState({} as any)
  const [disableAdd, setEnableAdd] = useState(true)

  const [statusPopup, setStatusPopup] = useState({
    open: false,
    severity: 'error',
    message: ''
  });

  useEffect(() => {
    getBooks().then((books) => {
      setRows(books)
    })
  }, [])

  useEffect(() => {
    const userId = getUserId();

    if(userId) {
      getOpenRequest(userId).then(req => {
        setRequest(req)
        setEnableAdd(false)
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
    else {
      setEnableAdd(true)
    }
  }, [])

  const handleSuccessClose = (event : any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setStatusPopup({...statusPopup, open: false});
  };

  
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const search = data.get('search') as string
    getBooks(search).then((books) => {
      setRows(books)
    })
  };

  const handleAdd = (idx: number) => {
    const book = rows[idx];

    const item = {
      requestId: request.id,
      bookId: book.id,
      currentPrice: book.price
    }

    console.log(item)
    addItem(item).then(() => {
      console.log("???")
      setStatusPopup({...statusPopup, 
        open: true, 
        message: `Adicionado "${book.name}"`,
        severity: 'success'
      })
    })
    .catch(err => {
      console.log("ERROR")
      console.log(err);
      setStatusPopup({...statusPopup, 
        open: true, 
        message: `Error ao adicionar "${book.name}"`,
        severity: 'error'
      })
    })
  }

  return (
    <div style={{ height: 500, width: '100%' }}>
      <ThemeProvider theme={theme}>
        <NavBar></NavBar>
        <Container>
          <CssBaseline />
          <Box
            component="form" 
            onSubmit={handleSearch}
            sx={{
              marginTop: 8,
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
            label="Busca" 
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
                <TableCell>ID</TableCell>
                <TableCell>Código da Editora</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Editora</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Ação</TableCell>
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
                  <TableCell >{row.id}</TableCell>
                  <TableCell >{row.publisherCode}</TableCell>
                  <TableCell >{row.name}</TableCell>
                  <TableCell >{row.publisherName}</TableCell>
                  <TableCell >{`R$ ${row.price.toFixed(2)}`}</TableCell>
                  <TableCell >
                  <Button 
                    variant="outlined"
                    size="small"
                    disabled={disableAdd}
                    onClick={e => handleAdd(idx)}
                    sx={{marginLeft: 2}}>
                      Adicionar
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Container>
        <Snackbar open={statusPopup.open} autoHideDuration={3000} onClose={handleSuccessClose}>
          <Alert onClose={handleSuccessClose} severity={statusPopup.severity} sx={{ width: '100%' }}>
            {statusPopup.message}
          </Alert>
        </Snackbar>
        
      </ThemeProvider>
    </div>
  );
}
