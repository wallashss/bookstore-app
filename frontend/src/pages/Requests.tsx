import * as React from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState} from "react";
import { getBooks } from '../services/BooksService';
import { getOpenRequest, listRequests } from '../services/RequestService';

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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import RequestModal from '../components/RequestModal';


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


export default function Requests(props : any) {

  let [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState([] as BookRow[])
  const [requests, setRequest] = useState([] as any[])
  const [showAllRequests, setShowAllRequests] = useState(searchParams.get('all') === 'on')
  const [search, setSearch] = useState(searchParams.get('search') as string)
  const [openRequestModel, setOpenRequestModal] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(0)

  useEffect(() => {
    getBooks().then((books) => {
      setRows(books)
    })
  }, [])

  const loadRequestList = () => {
    const userId = getUserId();

    if(userId) {
      console.log(showAllRequests)
      listRequests(userId, showAllRequests, search).then(req => {
        setRequest(req)
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
  useEffect(() => {
    loadRequestList()
  }, [])

  const handleSearch = () => {
    loadRequestList()
  };

  const handleShow = (idx: number) => {
    const request = requests[idx];
    setSelectedRequestId(request.id)
    setOpenRequestModal(true);
  }

  const handleToggleShowAll = () => {
    const userId = getUserId();
    setShowAllRequests(!showAllRequests)
    listRequests(userId, !showAllRequests, search).then(req => {
      setRequest(req)
    })
  }

  const handleCloseRequestModal = () => {
    setOpenRequestModal(false)
  }

  return (
    <div style={{ height: 500, width: '100%' }}>
      <ThemeProvider theme={theme}>
        <NavBar></NavBar>
        <Container>
          <Typography variant='h4'sx={{mt: 2}} align='left'>Pedidos</Typography>
          <CssBaseline />
          <Box
            component="form" 
            onSubmit={handleSearch}
            sx={{
              marginTop: 4,
              marginBottom: 2,
              display: 'flex',
              flexDirection: 'row',
              width: '100%'
            }}
          >
          {/* <FormGroup>
          </FormGroup> */}
          
          
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
            sx={{
                ml: 2,
                mr: 2
              }}>
              Buscar
          </Button>
          <FormControlLabel 
            control={
            <Checkbox name='all' 
              onChange={handleToggleShowAll} 
              checked={showAllRequests} />} 
            label="Mostrar todos" 
          />
          </Box>
          <TableContainer sx={{mb: 2}} component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Atendente</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>Qtde Livros</TableCell>
                  <TableCell>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell >{row.id}</TableCell>
                    <TableCell >{new Date(row.requestDate).toLocaleDateString()}</TableCell>
                    <TableCell >{new Date(row.requestDate).toLocaleTimeString()}</TableCell>
                    <TableCell >{row.sellerName}</TableCell>
                    <TableCell >{row.client}</TableCell>
                    <TableCell >{row.clientCpf}</TableCell>
                    <TableCell >{row.bookCount}</TableCell>
                    <TableCell >
                    <Button 
                      variant="outlined"
                      size="small"
                      onClick={e => handleShow(idx)}
                      sx={{marginLeft: 2}}>
                        Mostrar
                    </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        <RequestModal open={openRequestModel} requestId={selectedRequestId} onClose={handleCloseRequestModal} ></RequestModal>
        </Container>
      </ThemeProvider>
    </div>
  );
}
