import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
} from '@mui/material';
import dayjs from 'dayjs';

export const HeijunkaFinal = ({ tasks, selectedCollaborators, hours, selectedSite, startTime, endTime }) => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  // Actualizar el reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ width: '100vw', height: '100vh', padding: '20px', backgroundColor: '#fafafa' }}>
      {/* Encabezado superior */}
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        {/* Nombre del sitio y horario */}
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{selectedSite}</Typography>
          <Typography variant="h6">
            Horario: {dayjs(startTime).format('HH:mm')} - {dayjs(endTime).format('HH:mm')}
          </Typography>
        </Grid>

        {/* Reloj digital */}
        <Grid item>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333' }}>
            {currentTime.format('HH:mm:ss')}
          </Typography>
        </Grid>
      </Grid>

      {/* Diseño del Heijunka Box */}
      <Box sx={{ overflow: 'hidden', borderRadius: 4, boxShadow: 3, backgroundColor: '#fff', padding: '20px' }}>
        <Typography variant="h5" align="center" sx={{ mb: 4 }}>
          Estado de Asignaciones - Heijunka Box
        </Typography>

        {/* Tabla de asignación de tareas */}
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '18px' }}>Colaborador</TableCell>
              {hours.map((hour) => (
                <TableCell key={hour} align="center" sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                  {hour}:00
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedCollaborators.map((collaboratorId) => (
              <TableRow key={collaboratorId}>
                <TableCell align="center" sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                  Colaborador {collaboratorId}
                </TableCell>
                {hours.map((hour) => (
                  <TableCell key={hour} align="center" sx={{ padding: '10px', border: '1px solid #ddd' }}>
                    {/* Mostrar tareas del colaborador */}
                    {tasks[hour]?.[collaboratorId]?.map((task, index) => (
                      <Box key={index} sx={{ backgroundColor: '#e0f7fa', padding: '8px', borderRadius: '4px', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {task.description}
                        </Typography>
                        <Typography variant="caption">
                          Clientes: {task.clients.join(', ')}
                        </Typography>
                      </Box>
                    )) || <Typography variant="caption" sx={{ color: '#999' }}>Sin tarea</Typography>}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};
