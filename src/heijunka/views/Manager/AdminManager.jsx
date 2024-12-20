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
  Menu,
} from "@mui/material";
import { Add, Assignment, ExpandMore, MoreVert } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useSites } from "../../api";
import useUsers from "../../api/useUsers";
import useClients from "../../api/useClients";

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
  const [formVisible, setFormVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [iconStates, setIconStates] = useState({}); // Estado para íconos por celda

  const TIME_LIMIT = 48 * 60 * 60 * 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedTime = localStorage.getItem("tasksSavedTime");

    if (savedTasks && savedTime) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - savedTime;

      if (timeDifference < TIME_LIMIT) {
        setTasks(JSON.parse(savedTasks));

        const savedSite = localStorage.getItem("selectedSite");
        const savedCollaborators = localStorage.getItem(
          "selectedCollaborators"
        );
        const savedStartTime = localStorage.getItem("startTime");
        const savedEndTime = localStorage.getItem("endTime");
        const savedGenerated = localStorage.getItem("generated");

        if (savedSite) setSelectedSite(savedSite);
        if (savedCollaborators)
          setSelectedCollaborators(JSON.parse(savedCollaborators));
        if (savedStartTime) setStartTime(new Date(savedStartTime));
        if (savedEndTime) setEndTime(new Date(savedEndTime));
        if (savedGenerated === "true") {
          setGenerated(true);
          setFormVisible(false);
        }
      } else {
        localStorage.removeItem("tasks");
        localStorage.removeItem("tasksSavedTime");
        localStorage.removeItem("generated");
      }
    }
  }, []);

  const intSite = () => {
    return { MCC1: 1, MCC2: 2, LOGIKA: 3 }[selectedSite] || null;
  };

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
    setFormVisible(!formVisible);
  };

  const handleResetTasks = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esto eliminará todas las tareas generadas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, reiniciar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks({});
        setIconStates({});
        localStorage.removeItem("tasks");
        localStorage.removeItem("tasksSavedTime");
        localStorage.removeItem("generated");
        setFormVisible(true);
        setGenerated(false);
        Swal.fire("Reiniciado", "Las tareas han sido reiniciadas.", "success");
      }
    });
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
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleOpenModal = (hour, collaborator, taskToEdit = null) => {
    setSelectedHour(hour);
    setSelectedCollaborator(collaborator);
    setEditingTask(taskToEdit);

    if (taskToEdit) {
      setTaskDescription(taskToEdit.description);
      setSelectedClientsSites(taskToEdit.clients);
      setQuantity(taskToEdit.quantity);
    } else {
      setTaskDescription("");
      setSelectedClientsSites([]);
      setQuantity("");
    }

    setOpenModal(true);
    handleClientsSites();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTaskDescription("");
    setSelectedClientsSites([]);
    setQuantity("");
    setEditingTask(null);
  };

  const handleAddOrEditTask = () => {
    if (selectedHour && taskDescription && selectedClientsSites.length > 0) {
      const newTask = {
        description: taskDescription,
        clients: selectedClientsSites,
        quantity: +quantity,
        status: "pending",
      };

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };

        if (!updatedTasks[selectedHour]) {
          updatedTasks[selectedHour] = {};
        }

        if (!updatedTasks[selectedHour][selectedCollaborator]) {
          updatedTasks[selectedHour][selectedCollaborator] = [];
        }

        const isDuplicate = updatedTasks[selectedHour][
          selectedCollaborator
        ].some(
          (task) =>
            task.description === newTask.description &&
            JSON.stringify(task.clients) === JSON.stringify(newTask.clients) &&
            task.quantity === newTask.quantity
        );

        if (editingTask) {
          const taskIndex = updatedTasks[selectedHour][
            selectedCollaborator
          ].findIndex((task) => task === editingTask);
          updatedTasks[selectedHour][selectedCollaborator][taskIndex] = newTask;
        } else if (!isDuplicate) {
          updatedTasks[selectedHour][selectedCollaborator].push(newTask);

          // Actualiza el estado del ícono para la celda específica
          setIconStates((prevStates) => ({
            ...prevStates,
            [`${selectedHour}-${selectedCollaborator}`]: true,
          }));
        }

        return updatedTasks;
      });

      handleCloseModal();
    } else {
      console.error("Faltan datos para agregar o editar la tarea.");
    }
  };

  const handleSaveTasks = () => {
    Swal.fire({
      title: "¿Guardar cambios?",
      text: "Esto guardará las tareas en progreso.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const currentTime = new Date().getTime();
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("tasksSavedTime", currentTime);
        localStorage.setItem("selectedSite", selectedSite);
        localStorage.setItem(
          "selectedCollaborators",
          JSON.stringify(selectedCollaborators)
        );
        localStorage.setItem(
          "startTime",
          startTime ? startTime.toISOString() : null
        );
        localStorage.setItem("endTime", endTime ? endTime.toISOString() : null);
        localStorage.setItem("generated", JSON.stringify(generated));
        Swal.fire("Guardado", "Las tareas han sido guardadas.", "success");
      }
    });
  };

  const handleChangeTaskStatus = (hour, collaboratorId, index) => {
    const task = tasks[hour][collaboratorId][index];

    if (task.status === "pending") {
      Swal.fire({
        title: "¿Quieres iniciar esta tarea?",
        text: "Una vez iniciada, la tarea pasará a estar en progreso.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, iniciar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          setTasks((prevTasks) => {
            const updatedTasks = { ...prevTasks };
            updatedTasks[hour][collaboratorId][index].status = "in-progress";
            return updatedTasks;
          });
        }
      });
    } else if (task.status === "in-progress") {
      Swal.fire({
        title: "¿Quieres finalizar esta tarea?",
        text: "Una vez finalizada, no podrás volver a cambiar su estado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, finalizar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          setTasks((prevTasks) => {
            const updatedTasks = { ...prevTasks };
            updatedTasks[hour][collaboratorId][index].status = "completed";
            return updatedTasks;
          });
        }
      });
    } else {
      Swal.fire({
        title: "Esta tarea ya está completada.",
        text: "No puedes cambiar el estado de una tarea completada.",
        icon: "info",
        confirmButtonText: "Entendido",
      });
    }
  };

  const getTaskButtonColor = (task, hour) => {
    const currentHour = currentTime.hour();
    if (task.status === "completed") return "green";
    if (task.status === "in-progress") return "orange";
    if (task.status === "pending" && currentHour > hour) return "red";
    return "gray";
  };

  const handleOpenMenu = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleEditTask = (hour, collaboratorId, task) => {
    handleOpenModal(hour, collaboratorId, task);
    handleCloseMenu();
  };

  const handleDeleteTask = (hour, collaboratorId, index) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      updatedTasks[hour][collaboratorId].splice(index, 1);
      if (updatedTasks[hour][collaboratorId].length === 0) {
        delete updatedTasks[hour][collaboratorId];
      }
      return updatedTasks;
    });
    handleCloseMenu();
  };

  const getFormattedTime = () => {
    return currentTime.format("HH:mm:ss");
  };

  const getFormattedDate = () => {
    return currentTime.format("DD MMMM YYYY");
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
        position: "relative", // Necesario para el reloj
      }}
    >
      {generated && (
        <Box
          sx={{ position: "absolute", top: 20, right: 20, textAlign: "right" }}
        >
          <Typography
            variant="h4"
            sx={{ color: "#0C1A52", fontWeight: "bold" }}
          >
            {getFormattedTime()}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#0C1A52" }}>
            {getFormattedDate()}
          </Typography>
        </Box>
      )}

      <IconButton onClick={toggleFormVisibility}>
        <ExpandMore />
      </IconButton>

      {formVisible && (
        <>
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

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  padding: "8px",
                }}
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
                  customInput={<TextField variant="outlined" fullWidth />}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 2,
                  padding: "8px",
                }}
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
                  customInput={<TextField variant="outlined" fullWidth />}
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={
                !startTime || !endTime || selectedCollaborators.length === 0
              }
              sx={{
                backgroundColor: "#CC3329",
                "&:hover": { backgroundColor: "#b32b23" },
              }}
            >
              Generar Heijunka
            </Button>
          </Box>
        </>
      )}

      {generated && (
        <Box sx={{ marginTop: "60px", width: "100%" }}>
          <Typography
            variant="h4"
            textAlign="center"
            sx={{ mb: 10, color: "#0C1A52", fontWeight: "bold" }}
          >
            Tareas Asignadas
          </Typography>
          <Table
            sx={{
              border: "2px solid #ddd",
              borderCollapse: "separate",
              borderRadius: "15px",
            }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#0C1A52" }}>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#ffffff",
                    padding: "12px 16px",
                  }}
                >
                  Colaboradores
                </TableCell>
                {hours.map((hour) => (
                  <TableCell
                    key={hour}
                    align="center"
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#ffffff",
                      padding: "12px 16px",
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
                          backgroundColor: "#f5f5f5",
                          borderRadius: "12px",
                          position: "relative",
                          maxWidth: "200px",
                        }}
                      >
                        {tasks[hour]?.[collaboratorId]?.map((task, index) => (
                          <Box
                            key={index}
                            sx={{
                              backgroundColor: "white",
                              padding: "12px",
                              display: "flex",
                              flexDirection: "column",
                              border: "1px solid lightgray",
                              borderRadius: "12px",
                              marginTop: "12px",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                              position: "relative",
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold", color: "#0C1A52" }}
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

                            <Button
                              variant="contained"
                              sx={{
                                backgroundColor: getTaskButtonColor(task, hour),
                                color: "white",
                                minWidth: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                alignSelf: "flex-end",
                              }}
                              onClick={() =>
                                handleChangeTaskStatus(
                                  hour,
                                  collaboratorId,
                                  index
                                )
                              }
                            ></Button>

                            <IconButton
                              onClick={(event) => handleOpenMenu(event, task)}
                              sx={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                              }}
                            >
                              <MoreVert />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl) && selectedTask === task}
                              onClose={handleCloseMenu}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleEditTask(hour, collaboratorId, task)
                                }
                              >
                                Editar
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleDeleteTask(hour, collaboratorId, index)
                                }
                              >
                                Eliminar
                              </MenuItem>
                            </Menu>
                          </Box>
                        ))}

                        <IconButton
                          onClick={() => handleOpenModal(hour, collaboratorId)}
                          sx={{
                            color: iconStates[`${hour}-${collaboratorId}`]
                              ? "#0C1A52"
                              : "#CC3329", // Cambia el color basado en el estado
                            position: "absolute",
                            bottom: "8px", // Posición inferior
                            left: "50%", // Posición izquierda
                            "&:hover": {
                              backgroundColor: "rgba(204, 51, 41, 0.1)", // Efecto hover para el ícono
                            },
                            display: "block", // Siempre visible para agregar tarea
                          }}
                        >
                          {iconStates[`${hour}-${collaboratorId}`] ? (
                            <Add />
                          ) : (
                            <Assignment />
                          )}{" "}
                          {/* Muestra Add si hay tarea */}
                        </IconButton>
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
              sx={{
                backgroundColor: "#CC3329",
                "&:hover": { backgroundColor: "#b32b23" },
              }}
              onClick={handleResetTasks}
            >
              Reiniciar Tareas
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0C1A52",
                ml: 2,
                "&:hover": { backgroundColor: "#09123c" },
              }}
              onClick={handleSaveTasks}
            >
              Guardar Tareas
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {editingTask ? "Editar Tarea" : "Agregar Tarea"}
        </DialogTitle>
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
          <Button
            sx={{
              backgroundColor: "#0C1A52",
              "&:hover": { backgroundColor: "#ffff" },
            }}
            onClick={handleAddOrEditTask}
          >
            {editingTask ? "Editar" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
