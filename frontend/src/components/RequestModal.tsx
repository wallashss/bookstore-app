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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { updatePendingBooksStatus, } from '../services/PendingService';

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

export default function RequestModal({open, onClose, requestId} : PropsType) {

  const [rows, setRows] = React.useState([] as BookRow[])
  const [request, setRequest] = React.useState({} as any)
  const [rowsLoading, setRowsLoading] = React.useState([] as boolean[])
  const getTotal = () => {
    const sum =  request.books?.reduce((sum : number, b : any) => sum + b.currentPrice , 0) || 0

    return sum + (Number(request.wrapPrice) ?? 0) - (request.discount ?? 0 )
  }


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

      setRows([...rows.slice(0, idx), 
        {...rows[idx], status: value as any}, 
        ...rows.slice(idx+1)]
      )
      // setStatusPopup({...statusPopup, 
      //   open: true,
      //   message: `"${row.name}" está como ${statusMap[value]}`,
      //   severity: 'success'
      //  });
       setStatusForRow(idx, false)
    })
    .catch(err => {
      console.log(err)
      // setStatusPopup({...statusPopup, 
      //   open: true,
      //   message: `Error ao atualizar o status de ${row.name}`,
      //   severity: 'error'
      //  });
    })

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
                  <TableCell align='center'>{idx+1}</TableCell>
                  <TableCell align='center'>{row.bookId}</TableCell>
                  <TableCell align='center'>{row.publisherCode || "--"}</TableCell>
                  <TableCell >{row.name}</TableCell>
                  <TableCell align='center'>{row.publisherName}</TableCell>
                  <TableCell align='center'>{`R$ ${row.currentPrice.toFixed(2)}`}</TableCell>
                  <TableCell align='center'>
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
