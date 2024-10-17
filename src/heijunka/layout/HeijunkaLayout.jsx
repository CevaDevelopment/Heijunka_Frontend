import { Grid } from "@mui/material";
import PropTypes from "prop-types";
import { Navbar } from "../components/Navbar";


export const HeijunkaLayout = ({ children, onSelectModule }) => {
  return (
    <Grid container direction="column">
      {/* Renderizamos el Navbar y pasamos onSelectModule */}
      <Navbar onSelectModule={onSelectModule} />
      
      {/* Contenido principal */}
      <Grid container component="main" sx={{ mt: 8, p: 3 }}>
        {children}
      </Grid>
    </Grid>
  );
};

// Validación de Propiedades
HeijunkaLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onSelectModule: PropTypes.func.isRequired,  // Validación para la función onSelectModule
};
