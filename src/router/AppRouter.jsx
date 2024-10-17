import { Navigate, Route, Routes } from "react-router-dom";
import { Authroutes } from "../auth/routes/Authroutes";
import { HeijunkaRoutes } from "../heijunka/routes/HeijunkaRoutes";
import React, { useEffect } from "react";
import { useAuthStore } from "../hooks/useAuthstore";

export const AppRouter = () => {
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === 'checking') {
    return <h3>Cargando...</h3>;
  }

  return (
    <Routes>
      {status === 'not-authenticated' ? (
        <>
          {/* Rutas de autenticación */}
          <Route path="/auth/*" element={ <Authroutes /> } />
          {/* Redirigir a la página de login */}
          <Route path="/*" element={ <Navigate to="/auth/login" /> } />
        </>
      ) : (
        <>
          {/* Rutas protegidas */}
          <Route path="/*" element={ <HeijunkaRoutes /> } />
          {/* Redirigir a la raíz si no se encuentra ninguna ruta */}
          <Route path="*" element={ <Navigate to="/" /> } />
        </>
      )}
    </Routes>
  );
};
