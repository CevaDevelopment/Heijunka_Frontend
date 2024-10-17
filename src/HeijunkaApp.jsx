import React, { useEffect } from 'react'
import { AppRouter } from './router/AppRouter';
import { AppTheme } from './theme';
import { Provider, useDispatch } from 'react-redux';
import { onLogin, onLogout, persistor, store } from './store';
import { heijunkaApi } from './api';
import { PersistGate } from 'redux-persist/integration/react';


const AuthChecker = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuthToken = async () => {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refresh_token');

            if (!token || !refreshToken) {
                dispatch(onLogout());
                return;
            }

            try {
                const { data } = await heijunkaApi.post('/auth/renew/', {
                    refresh: refreshToken,
                });

                // Almacena el nuevo token
                localStorage.setItem('token', data.token);
                localStorage.setItem('token-init-date', new Date().getTime());
                dispatch(onLogin({ name: data.name, id: data.id }));
            } catch (error) {
                console.error('Error al renovar el token:', error.response?.data || error.message);
                localStorage.clear();
                dispatch(onLogout());
            }
        };

        checkAuthToken();
    }, [dispatch]);

    return null; // No renderiza nada, solo ejecuta la verificación
};

export const HeijunkaApp = () => {
  return (
    <>
    <Provider store={ store }>
    <PersistGate loading={null} persistor={persistor}>
      <AppTheme>
        <AuthChecker />
        <AppRouter/>
      </AppTheme>
    </PersistGate>
    </Provider>
   
    </>
  );
};
