import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import  tasksReducer from "./tasks/tasksSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Usa localStorage
import { combineReducers } from "redux";

// Combina los reducers
const rootReducer = combineReducers({
    auth: authSlice.reducer,
    tasks: tasksReducer,
});


const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
});

// Crea el persistor
export const persistor = persistStore(store);

