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
    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3, borderRadius: "12px", overflow: "hidden" }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#0C1A52" }}>
          <TableRow>
            {['Site', 'Cliente', 'Tipo de Cliente', 'Acciones'].map((header) => (
              <TableCell key={header}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                  {header}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} hover sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
              <TableCell>{client.site_name}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.type_name}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditClient(client)} sx={{ color: "#0C1A52" }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClient(client.id)} sx={{ color: "#CC3329" }}>
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
