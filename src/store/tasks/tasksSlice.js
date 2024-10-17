import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: {},
    savedTasks: [],
    savedTime: null,
  },
  reducers: {
    addTask(state, action) {
      const { hour, collaboratorId, task } = action.payload;
      if (!state.tasks[hour]) {
        state.tasks[hour] = {};
      }
      if (!state.tasks[hour][collaboratorId]) {
        state.tasks[hour][collaboratorId] = [];
      }
      state.tasks[hour][collaboratorId].push(task);
    },
    resetTasks(state) {
      state.tasks = {};
    },
    saveTasks(state, action) {
      state.savedTasks = action.payload;
      state.savedTime = Date.now();
    },
    clearExpiredTasks(state) {
      const currentTime = Date.now();
      if (state.savedTime && currentTime - state.savedTime > 86400000) {
        state.savedTasks = [];
        state.savedTime = null;
      }
    },
  },
});

// Exportar las acciones
export const { addTask, resetTasks, saveTasks, clearExpiredTasks } = tasksSlice.actions;

// Selector para obtener las tareas
export const selectTasks = (state) => state.tasks.tasks;

// Selector para obtener las tareas guardadas
export const selectSavedTasks = (state) => state.tasks.savedTasks;

// Selector para verificar si las tareas están expiradas
export const selectIsTasksExpired = (state) => {
  const currentTime = Date.now();
  return state.tasks.savedTime && (currentTime - state.tasks.savedTime > 86400000);
};

// Nuevo selector para obtener `savedTime`
export const selectSavedTime = (state) => state.tasks.savedTime;

// Exporta solo el reducer como predeterminado
export default tasksSlice.reducer;
