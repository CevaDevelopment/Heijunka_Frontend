import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Assignment, ExpandMore } from "@mui/icons-material";
import { useSites } from "../../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import useClients from "../../api/useClients";
import useUsers from "../../api/useUsers";



// Constante que define el tiempo límite (48 horas en milisegundos)
const TIME_LIMIT = 48 * 60 * 60 * 1000;


export const AdminManager = () => {
  const { sites, loading: loadingSites, error: errorSites } = useSites();
  const { loading: loadingUsers, filterCollaboratorsBySite } = useUsers();
  const {
    fetchClientsBySite,
    clients,
    loading: loadingClients,
    errorClients,
  } = useClients();
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [tasks, setTasks] = useState({});
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedClientsSites, setSelectedClientsSites] = useState([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState("");
  const [quantity, setQuantity] = useState("");
  const [formVisible, setFormVisible] = useState(true); // Estado para la visibilidad del formulario

  const intSite = () => {
    return { MCC1: 1, MCC2: 2, LOGIKA: 3 }[selectedSite] || null;
  };

  useEffect(() => {
  // Recuperar tareas desde localStorage
  const savedTasks = localStorage.getItem("tasks");
  const savedTime = localStorage.getItem("tasksSavedTime");

  if (savedTasks && savedTime) {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - savedTime;

    // Si han pasado menos de 48 horas, cargamos las tareas
    if (timeDifference < TIME_LIMIT) {
      setTasks(JSON.parse(savedTasks));

      // Carga valores del formulario
      const savedSite = localStorage.getItem("selectedSite");
      const savedCollaborators = localStorage.getItem("selectedCollaborators");
      const savedStartTime = localStorage.getItem("startTime");
      const savedEndTime = localStorage.getItem("endTime");
      const savedGenerated = localStorage.getItem("generated");

      if (savedSite) setSelectedSite(savedSite);
      if (savedCollaborators) setSelectedCollaborators(JSON.parse(savedCollaborators));
      if (savedStartTime) setStartTime(new Date(savedStartTime));
      if (savedEndTime) setEndTime(new Date(savedEndTime));
      if (savedGenerated) setGenerated(JSON.parse(savedGenerated));
      if (savedGenerated === "true") {
        setGenerated(true);
        setFormVisible(false);  // Ocultar el formulario si Heijunka fue generado previamente
      } 

      console.log("Formulario y tareas cargados desde localStorage");
    } else {
      // Si han pasado más de 48 horas, limpiamos el localStorage
      localStorage.removeItem("tasks");
      localStorage.removeItem("tasksSavedTime");
      localStorage.removeItem("generated");
    }
  }
}, []);

  useEffect(() => {
    if (selectedSite) {
      const filteredUsers = filterCollaboratorsBySite(selectedSite);
      setCollaborators(filteredUsers);
    } else {
      setCollaborators([]);
    }
  }, [selectedSite, filterCollaboratorsBySite]);

  const handleGenerate = () => {
    if (selectedCollaborators.length > 0 && startTime && endTime) {
      setGenerated(true);
      setFormVisible(false);
      localStorage.setItem("generated", true);
    } else {
      console.error("No hay colaboradores seleccionados.");
    }
  };

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible); // Cambia la visibilidad del formulario
  };

  const handleResetTasks = () => {
    setTasks({});
    localStorage.removeItem("tasks");
    localStorage.removeItem("tasksSavedTime");
    localStorage.removeItem("generated");
    setFormVisible(true);  // Al resetear, mostrar el formulario de nuevo
    setGenerated(false);    // No mostrar el Heijunka si se resetean las tareas
    console.log("Tareas reiniciadas");
  };

  const calculateHours = () => {
    if (startTime && endTime) {
      const start = dayjs(startTime);
      const end = dayjs(endTime);
      const hours = [];
      for (let i = start.hour(); i <= end.hour(); i++) {
        hours.push(i);
      }
      return hours;
    }
    return [];
  };

  const hours = calculateHours();

  const capitalizeFirstWord = (text) => {
    if (!text) return text; // Verificar que el texto no esté vacío
    return text.charAt(0).toUpperCase() + text.slice(1); // Convertir la primera letra a mayúscula
  };


  const handleOpenModal = (hour, collaborator) => {
    setSelectedHour(hour);
    setSelectedCollaborator(collaborator);
    setOpenModal(true);
    handleClientsSites();
    setSelectedClientsSites([]);
    setTaskDescription("");
    setQuantity("");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTaskDescription("");
    setSelectedClientsSites([]);
    setQuantity("");
  };

  const handleAddTask = () => {
    if (selectedHour && taskDescription && selectedClientsSites.length > 0) {
      const newTask = {
        description: taskDescription,
        clients: selectedClientsSites,
        quantity: +quantity,
        status: "pending", // Estado inicial
      };

      setTasks((prevTasks) => ({
        ...prevTasks,
        [selectedHour]: {
          ...prevTasks[selectedHour],
          [selectedCollaborator]: [
            ...(prevTasks[selectedHour]?.[selectedCollaborator] || []),
            newTask,
          ],
        },
      }));

      handleCloseModal();
    } else {
      console.error(
        "No hay hora seleccionada o descripción vacía para agregar la tarea."
      );
    }
  };

  

  const handleSaveTasks = () => {
    const currentTime = new Date().getTime();

    // Guardar tareas en localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("tasksSavedTime", currentTime);
    localStorage.setItem("selectedSite", selectedSite);
    localStorage.setItem("selectedCollaborators", JSON.stringify(selectedCollaborators));
    localStorage.setItem("startTime", startTime ? startTime.toISOString() : null);
    localStorage.setItem("endTime", endTime ? endTime.toISOString() : null);
    localStorage.setItem("generated", JSON.stringify(generated));

    console.log("Tareas y valores del formulario guardados en localStorage");
  };

  const handleChangeTaskStatus = (hour, collaboratorId, index) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const task = updatedTasks[hour][collaboratorId][index];

      // Cambia el estado cíclicamente
      if (task.status === "pending") {
        task.status = "in-progress";
      } else if (task.status === "in-progress") {
        task.status = "completed";
      } else {
        task.status = "pending";
      }

      return updatedTasks;
    });
  };

  if (loadingSites) {
    return <CircularProgress />;
  }

  if (errorSites) {
    return (
      <Typography color="error">
        Error al cargar los sitios: {errorSites.message}
      </Typography>
    );
  }

  const handleClientsSites = () => fetchClientsBySite(intSite());

  if (loadingClients) {
    return <CircularProgress />;
  }

  if (errorClients) {
    return (
      <Typography color="error">
        Error al cargar clientes: {errorClients.message}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "all 0.3s ease",
      }}
    >
      {/* Botón para desplegar/ocultar el formulario */}
        <IconButton onClick={toggleFormVisibility}>
          <ExpandMore />
        </IconButton>

      {/* Formulario que se esconde al generar Heijunka */}
      {formVisible && (
        <>
      {/* Sitios */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": "Seleccionar Sitio" }}
          sx={{
            mb: 2,
            borderRadius: 2,
            backgroundColor: "#f5f5f5",
            padding: "8px",
          }}
        >
          <MenuItem value="" disabled>
            Seleccionar Sitio
          </MenuItem>
          {sites.map((site) => (
            <MenuItem key={site.id} value={site.name}>
              {site.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Colaboradores */}
      <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedSite}>
        {loadingUsers ? (
          <CircularProgress />
        ) : (
          <Select
            multiple
            value={selectedCollaborators}
            onChange={(e) => setSelectedCollaborators(e.target.value)}
            displayEmpty
            inputProps={{ "aria-label": "Seleccionar Colaborador" }}
            sx={{
              mb: 2,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
              padding: "8px",
            }}
          >
            <MenuItem value="" disabled>
              Seleccionar Colaboradores
            </MenuItem>
            {collaborators.length > 0 ? (
              collaborators.map((collaborator) => (
                <MenuItem key={collaborator.id} value={collaborator.id}>
                  {collaborator.first_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay colaboradores disponibles</MenuItem>
            )}
          </Select>
        )}
      </FormControl>

      {/* Heijunka */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box
            sx={{ backgroundColor: "#f5f5f5", borderRadius: 2, padding: "8px" }}
          >
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={60}
              timeCaption="Inicio"
              dateFormat="HH:mm"
              placeholderText="Hora de Inicio"
              customInput={<input readOnly style={inputStyle} />}
            />
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box
            sx={{ backgroundColor: "#f5f5f5", borderRadius: 2, padding: "8px" }}
          >
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={60}
              timeCaption="Fin"
              dateFormat="HH:mm"
              placeholderText="Hora de Fin"
              customInput={<input readOnly style={inputStyle} />}
            />
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={
            !startTime || !endTime || selectedCollaborators.length === 0
          }
        >
          Generar Heijunka
        </Button>
      </Box>
      </>

      )}

      {generated && (
        <Box sx={{ marginTop: "180px", width: "100%" }}>
          <Typography variant="h4" textAlign="center" sx={{ mb: 10 }}>
            Tareas Asignadas
          </Typography>
          <Table
            sx={{
              border: "4px solid #333", // Borde oscuro por fuera
              borderCollapse: "separate",
              borderRadius: "15px",
            }}
          >
            <TableHead>
              <TableRow style={{ backgroundColor: "#f4f4f4" }}>
                <TableCell
                  align="center"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#333",
                    padding: "12px 16px",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Colaboradores
                </TableCell>
                {hours.map((hour) => (
                  <TableCell
                    key={hour}
                    align="center"
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#333",
                      padding: "12px 16px",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    {hour}:00
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCollaborators.map((collaboratorId) => {
                const collaborator = collaborators.find(
                  (collab) => collab.id === collaboratorId
                );

                return (
                  <TableRow key={collaboratorId}>
                    <TableCell align="center">
                      {collaborator?.first_name}
                    </TableCell>
                    {hours.map((hour) => (
                      <TableCell
                        key={hour}
                        align="left"
                        sx={{
                          padding: "16px",
                          borderRadius: "12px", // Bordes redondeados
                          backgroundColor: "#f9f9f9", // Fondo suave
                          position: "relative", // Permitir posicionamiento absoluto de los botones
                          maxWidth: "140px", // Definir un ancho máximo para hacer la casilla más angosta
                        }}
                      >
                        {/* Mostrar las tareas si existen */}
                        {tasks[hour]?.[collaboratorId]?.map((task, index) => (
                          <Box
                            key={index}
                            sx={{
                              backgroundColor: "white",
                              padding: "16px",
                              flexDirection: "column",
                              display: "flex",
                              justifyContent: "space-between",
                              border: "1px solid lightgray",
                              borderRadius: "12px",
                              marginTop: "12px",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Sombra
                              position: "relative",
                            }}
                          >
                            {/* Descripción y detalles de la tarea */}
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
                              Tarea: {capitalizeFirstWord(task.description)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#666" }}>
                              Cliente:{" "}
                              {task.clients
                                .map(
                                  (clientId) =>
                                    clients.find(
                                      (client) => client.id === clientId
                                    )?.name
                                )
                                .join(", ")}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#666" }}>
                              Cantidad: {task.quantity}
                            </Typography>

                            {/* Botón de estado */}
                            <Button
                              variant="contained"
                              sx={{
                                backgroundColor:
                                  task.status === "pending"
                                    ? "gray"
                                    : task.status === "in-progress"
                                      ? "orange"
                                      : "green",
                                color: "white",
                                minWidth: "30px",
                                height: "30px",
                                position: "absolute",
                                top: "10px", // Colocar en la parte superior
                                right: "10px", // Alineado a la derecha
                                borderRadius: "50%",
                              }}
                              onClick={() =>
                                handleChangeTaskStatus(
                                  hour,
                                  collaboratorId,
                                  index
                                )
                              }
                            ></Button>

                            {/* Icono de agregar tarea */}
                            <IconButton
                              onClick={() =>
                                handleOpenModal(hour, collaboratorId)
                              }
                              sx={{
                                color: "primary.main",
                                position: "absolute",
                                bottom: "10px",
                                right: "10px",
                              }}
                            >
                              <Assignment />
                            </IconButton>
                          </Box>
                        ))}

                        {/* Siempre mostrar el icono de agregar tarea centrado si no hay tareas */}
                        {!tasks[hour]?.[collaboratorId] && (
                          <IconButton
                            onClick={() =>
                              handleOpenModal(hour, collaboratorId)
                            }
                            sx={{
                              color: "primary.main",
                              position: "absolute",
                              bottom: "50%", // Centrar verticalmente
                              left: "50%", // Centrar horizontalmente
                              transform: "translate(-50%, 50%)", // Ajustar el centrado
                            }}
                          >
                            <Assignment />
                          </IconButton>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
              mb: "50px",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleResetTasks}
            >
              Reiniciar Tareas
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveTasks}
              sx={{ ml: 2 }}
            >
              Guardar Tareas
            </Button>
          </Box>
        </Box>
      )}

      {/* Modal para agregar tareas */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Agregar Tarea</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Descripción de la tarea"
            fullWidth
            variant="outlined"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              multiple
              value={selectedClientsSites}
              onChange={(e) => setSelectedClientsSites(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Seleccionar Clientes" }}
              sx={{
                mb: 2,
                borderRadius: 2,
                backgroundColor: "#f5f5f5",
                padding: "8px",
              }}
            >
              <MenuItem value="" disabled>
                Seleccionar Clientes
              </MenuItem>
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Cantidad"
            type="number"
            fullWidth
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleAddTask}>Agregar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  border: "1px solid #007BFF", // Borde azul
  borderRadius: "4px",
  fontSize: "16px",
  color: "#333", // Color del texto
  backgroundColor: "#f8f9fa", // Color de fondo claro
  transition: "border-color 0.3s, box-shadow 0.3s",
  "&:focus": {
    borderColor: "#0056b3", // Cambia el color del borde al enfocar
    boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)", // Sombra al enfocar
    outline: "none", // Quitar el contorno por defecto
  },
  "&:disabled": {
    backgroundColor: "#e9ecef", // Color ide fondo al deshabilitar
    color: "#6c757d", // Color del textoiimport { id, mt } from 'date-fns/locale';
  },
};
