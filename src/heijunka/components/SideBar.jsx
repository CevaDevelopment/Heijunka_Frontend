import { Dashboard, Group, Assignment } from "@mui/icons-material"; // Cambiar a iconos más apropiados
import {
  Box,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import PropTypes from 'prop-types';

export const SideBar = ({ drawerWidth, onSelectModule }) => {
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="permanent"
        open={true}
        sx={{
          display: { xs: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, backgroundColor: '#2E3B55', color: '#FFFFFF' }, // Cambiar color de fondo y texto
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Jerson Martinez
          </Typography>
        </Toolbar>
        <Divider />

        <List>
          {['Admin', 'Manage', 'Heijunka Box'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => onSelectModule(index)} sx={{ '&:hover': { backgroundColor: '#4C6EF5' } }}>
                <ListItemIcon sx={{ color: '#FFFFFF' }}>
                  {index === 0 && <Dashboard />} {/* Icono para Admin */}
                  {index === 1 && <Group />}    {/* Icono para Manage */}
                  {index === 2 && <Assignment />}
                </ListItemIcon>
                <Grid container>
                  <ListItemText primary={text} sx={{ color: '#FFFFFF' }} />
                  <ListItemText secondary={`Descripción de ${text}`} sx={{ color: '#CCCCCC' }} />
                </Grid>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

// Validación de Propiedades
SideBar.propTypes = {
  drawerWidth: PropTypes.number.isRequired,
  onSelectModule: PropTypes.func.isRequired,
};
