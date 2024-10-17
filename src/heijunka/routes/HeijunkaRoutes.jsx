import { Navigate, Route, Routes } from "react-router-dom";
import { HeijunkaPage } from "../pages/HeijunkaPage";

export const HeijunkaRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={ <HeijunkaPage /> } />

      {/* Maneja las rutas no definidas que deberían redirigir */}
      <Route path="*" element={ <Navigate to="/" /> } />
    </Routes>
  );
};
