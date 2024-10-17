import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, selectTasks } from '../../store';

const AssigmentTable = ({ siteName }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm:ss'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = ['7am', '8am', '9am', '10am']; // Define las horas que deseas mostrar
  const collaborators = Object.keys(tasks).flatMap(hour => Object.keys(tasks[hour] || {}));
  const uniqueCollaborators = [...new Set(collaborators)];

  const handleOpen = (task, hour) => {
    setSelectedTask(task);
    setSelectedHour(hour);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedTask(null);
    setSelectedHour(null);
  };

  const handleChangeStatus = (status) => {
    setLoading(true);
    setTimeout(() => {
      dispatch(addTask({ hour: selectedHour, collaboratorId: selectedTask.collaboratorId, task: { ...selectedTask, status } }));
      setLoading(false);
      handleClose();
    }, 500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress':
        return '#FFEB3B'; // Amarillo
      case 'completed':
        return '#4CAF50'; // Verde
      case 'delayed':
        return '#FF9800'; // Naranja
      default:
        return '#F5F5F5'; // Blanco
    }
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#E0F7FA' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>{`Heijunka Box - ${siteName}`}</Typography>
          <Typography variant="h3" style={{ marginLeft: 'auto', fontSize: '36px' }}>
            {currentTime}
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Grid item xs={12}>
          <Typography variant="h5" align="center" style={{ fontWeight: 'bold' }}>Colaboradores</Typography>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={2}>
            <Typography variant="h5" style={{ fontWeight: 'bold', textAlign: 'center' }}>Colaborador</Typography>
            {uniqueCollaborators.map((collaboratorId) => (
              <Typography key={collaboratorId} style={{ textAlign: 'center' }}>{collaboratorId}</Typography>
            ))}
          </Grid>
          {hours.map((hour) => (
            <Grid item xs={2} key={hour}>
              <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: '10px', color: '#1976D2', textAlign: 'center' }}>{hour}</Typography>
              {uniqueCollaborators.map((collaboratorId) => {
                const task = tasks[hour]?.[collaboratorId] || []; // Obtener la tarea correspondiente

                return (
                  <Grid container key={collaboratorId} direction="column" style={{ height: '100%' }}>
                    {task.length > 0 ? (
                      task.map((taskItem) => (
                        <Grid item key={taskItem.id}>
                          <Paper
                            style={{
                              backgroundColor: getStatusColor(taskItem.status),
                              padding: '10px',
                              margin: '5px 0',
                              borderRadius: '8px',
                              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                              cursor: 'pointer',
                              height: '100%',
                            }}
                            onClick={() => handleOpen(taskItem, hour)}
                          >
                            <Typography variant="h6" style={{ fontWeight: 'bold' }}>{taskItem.name}</Typography>
                            <Typography variant="body2">{taskItem.description}</Typography>
                            <Typography variant="body2" style={{ fontStyle: 'italic' }}>{`Cliente: ${taskItem.client}`}</Typography>
                            <Typography variant="body2">{`Estado: ${taskItem.status}`}</Typography>
                          </Paper>
                        </Grid>
                      ))
                    ) : (
                      <Grid item>
                        <Paper style={{ padding: '10px', margin: '5px 0', borderRadius: '8px', backgroundColor: '#F5F5F5', height: '100%' }}>
                          <Typography variant="body2" align="center">Sin Tareas</Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Cambiar Estado de la Tarea</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <div>
              <Button variant="contained" color="primary" onClick={() => handleChangeStatus('in-progress')}>En Progreso</Button>
              <Button variant="contained" color="success" onClick={() => handleChangeStatus('completed')}>Completado</Button>
              <Button variant="contained" color="warning" onClick={() => handleChangeStatus('delayed')}>Atrasado</Button>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssigmentTable;
