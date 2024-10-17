import { LogoutOutlined, MenuOutlined, Dashboard, Group } from "@mui/icons-material";
import { AppBar, Button, Grid, IconButton, Toolbar, Typography, Menu, MenuItem, Box } from "@mui/material";
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuthStore } from "../../hooks";
import logo from "../../../public/logo.png";

export const Navbar = ({ drawerWidth = 0, onSelectModule }) => {
    const { startLogout } = useAuthStore();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedSection, setSelectedSection] = useState(0); // 0 para Admin, 1 para Manager

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectModule = (section) => {
        setSelectedSection(section);
        onSelectModule(section); // Notifica al layout sobre el cambio de sección
        handleClose();
    };

    return (
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#293f8b ",
          boxShadow: "none",
          borderBottom: "2px solid #4C6EF5", // Línea decorativa para mejor estilo
        }}
      >
        <Toolbar>
          {/* Botón Menú en pantallas pequeñas */}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuOutlined />
          </IconButton>

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={logo}
                alt="Heijunka Ceva Logo"
                style={{ width: "140px", height: "auto", marginRight: "10px" }}
              />
              <Typography
                variant="h4"
                noWrap
                component="div"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontFamily: "Roboto, sans-serif", 
                  letterSpacing: "1px", 
                  textTransform: "uppercase", 
                  lineHeight: "1.2", 
                }}
              >
                Heijunka Box
              </Typography>
            </Box>

            {/* Botones de Admin y Manager */}
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
              {/* Botón Admin */}
              <Button
                startIcon={<Dashboard />} // Icono antes del texto
                onClick={() => handleSelectModule(0)}
                sx={{
                  color: selectedSection === 0 ? "#FFFFFF" : "#A0AEC0",
                  backgroundColor:
                    selectedSection === 0 ? "#4C6EF5" : "transparent",
                  borderRadius: "8px",
                  px: 2,
                  py: 1,
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#4C6EF5",
                    color: "#FFFFFF",
                  },
                }}
              >
                Admin
              </Button>

              {/* Botón Manager */}
              <Button
                startIcon={<Group />} // Icono antes del texto
                onClick={() => handleSelectModule(1)}
                sx={{
                  color: selectedSection === 1 ? "#FFFFFF" : "#A0AEC0",
                  backgroundColor:
                    selectedSection === 1 ? "#4C6EF5" : "transparent",
                  borderRadius: "8px",
                  px: 2,
                  py: 1,
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#4C6EF5",
                    color: "#FFFFFF",
                  },
                }}
              >
                Manager
              </Button>
            </Box>

            {/* Menú hamburguesa para pantallas pequeñas */}
            <IconButton
              color="inherit"
              onClick={handleMenuClick}
              sx={{ display: { xs: "block", sm: "none" } }}
            >
              <MenuOutlined />
            </IconButton>

            {/* Menú desplegable */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleSelectModule(0)}>
                <Dashboard sx={{ mr: 1 }} />
                Admin
              </MenuItem>
              <MenuItem onClick={() => handleSelectModule(1)}>
                <Group sx={{ mr: 1 }} />
                Manager
              </MenuItem>
            </Menu>

            {/* Botón de Logout */}
            <Button
              color="error"
              onClick={startLogout}
              sx={{
                color: "#E53E3E",
                "&:hover": {
                  backgroundColor: "#FEB2B2",
                  color: "#1E293B",
                },
                ml: 2,
              }}
            >
              <LogoutOutlined />
              &nbsp; Salir
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
    );
};

Navbar.propTypes = {
    drawerWidth: PropTypes.number,  // drawerWidth debe ser un número
    onSelectModule: PropTypes.func.isRequired,  // Validación para la función onSelectModule
};
