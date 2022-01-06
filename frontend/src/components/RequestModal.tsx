import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { BookRow } from '../models/BookRow';
import { getRequest } from '../services/RequestService';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 600,
  overflow: 'auto', 
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
} as any;

type PropsType = {
  open: boolean,
  onClose: any,
  requestId: number
}

const columns = [
  { field: 'idx', headerName: '#' },
  { field: 'id', headerName: 'ID' },
  { field: 'publisherCode', headerName: 'Cod. Ed.'},
  { field: 'name', headerName: 'Nome'},
  { field: 'publisherName', headerName: 'Editora' },
  { field: 'currentPrice', headerName: 'Preço' },
];

export default function RequestModal({open, onClose, requestId} : PropsType) {

  const [rows, setRows] = React.useState([] as BookRow[])
  const [request, setRequest] = React.useState({} as any)
  const getTotal = () => {
    const sum =  request.books?.reduce((sum : number, b : any) => sum + b.currentPrice , 0) || 0

    return sum + (Number(request.wrapPrice) ?? 0) - (request.discount ?? 0 )
  }

  React.useEffect(() => {
    getRequest(requestId).then(req => {
      setRequest(req)
      setRows(req.books.map((b : any, idx: number)  => ({idx: idx+1, ...b,}) as any) || [])
    })
    .catch(err => {
      console.log(err);
    })
  }, [requestId])
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField 
                name='name'
                fullWidth
                label="Nome do Cliente" 
                disabled={true}
                value={request.client || ""}
                />
            </Grid>
            <Grid item xs={6}>
            <TextField 
              name='cpf'
              fullWidth
              label="CPF" 
              disabled={true}
              value={request.clientCpf || "--"}
              />
            </Grid>
            <Grid item xs={6}>
            <TextField 
              name='phone'
              fullWidth
              label="Telefone" 
              disabled={true}
              value={request.clientPhone || "--"}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                name='email'
                fullWidth
                label="Email"
                disabled={true}
                value={request.clientEmail || "--"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                name='address'
                fullWidth
                label="Endereço"
                disabled={true} 
                value={request.clientAddress || "--"}
              />
            </Grid>
          </Grid>

          {/* <DataGrid
            rows={rows}
            columns={columns}
            pageSize={3}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          /> */}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow 
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='center'>{idx+1}</TableCell>
                  <TableCell align='center'>{row.bookId}</TableCell>
                  <TableCell align='center'>{row.publisherCode || "--"}</TableCell>
                  <TableCell >{row.name}</TableCell>
                  <TableCell align='center'>{row.publisherName}</TableCell>
                  <TableCell align='center'>{`R$ ${row.currentPrice.toFixed(2)}`}</TableCell>
                  <TableCell align='center'>
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
        </Box>
      </Modal>
    </div>
  );
}
