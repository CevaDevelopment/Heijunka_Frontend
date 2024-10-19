import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const Clients = ({ clients, handleEditClient, handleDeleteClient }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Site
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Cliente
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Tipo de Cliente
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Acciones
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.site_name}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.type_name}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditClient(client)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClient(client.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

Clients.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      site_name: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleEditClient: PropTypes.func.isRequired,
  handleDeleteClient: PropTypes.func.isRequired,
};

export default Clients;
