import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, TextField, Box, Typography, InputAdornment } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { useAuthStore, useForm } from '../../hooks';
import logo from "../../../public/logo.png";
import { EmailOutlined, LockOutlined, PersonOutline } from '@mui/icons-material';

const registerFormFields = {
  registerName: "",
  registerApellido: "",
  registerEmail: "",
  registerPassword: "",
  registerPasswordConfirm: "",
};

export const RegisterPage = () => {
  const { startRegister, errorMessage } = useAuthStore();
  const { registerName, registerApellido, registerEmail, registerPassword, registerPasswordConfirm, onInputChange } = useForm(registerFormFields);

  const registerSubmit = (event) => {
    event.preventDefault();
    if (registerPassword !== registerPasswordConfirm) {
      Swal.fire('Error en registro', 'Contraseñas no son iguales', 'info');
      return;
    }
    startRegister({ first_name: registerName, last_name: registerApellido, email: registerEmail, password: registerPassword });
  };

  useEffect(() => {
    if (errorMessage !== undefined) {
      Swal.fire('Error en registro', errorMessage, 'error');
    }
  }, [errorMessage]);

  return (
    <AuthLayout title="Crear Cuenta">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          minHeight: '100vh',
        }}
      >
        {/* Formulario centrado */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            p: 3,
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 2,
          }}
        >
          <form onSubmit={registerSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre"
                  type="text"
                  placeholder="Nombre"
                  name="registerName"
                  value={registerName}
                  onChange={onInputChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Apellido"
                  type="text"
                  placeholder="Apellido"
                  name="registerApellido"
                  value={registerApellido}
                  onChange={onInputChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Correo"
                  type="email"
                  placeholder="correo@google.com"
                  name="registerEmail"
                  value={registerEmail}
                  onChange={onInputChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Contraseña"
                  type="password"
                  placeholder="Contraseña"
                  name="registerPassword"
                  value={registerPassword}
                  onChange={onInputChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Confirmar Contraseña"
                  type="password"
                  placeholder="Confirmar Contraseña"
                  name="registerPasswordConfirm"
                  value={registerPasswordConfirm}
                  onChange={onInputChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    sx={{
                      backgroundColor: "#CC3329",
                      "&:hover": { backgroundColor: "#b32b23" },
                      color: "#FFFFFF",
                      py: 1.5,
                    }}
                  >
                    Crear cuenta
                  </Button>
                </Grid>
              </Grid>

              <Grid container direction="row" justifyContent="end">
                <Typography sx={{ mr: 1 }}>¿Ya tienes cuenta?</Typography>
                <Link component={RouterLink} color="inherit" to="/auth/login" sx={{ color: "#0C1A52", textDecoration: 'underline' }}>
                  Ingresar
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>

        {/* Logo como marca de agua fuera del formulario */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            opacity: 0.1,
          }}
        >
          <img src={logo} alt="Marca de agua" style={{ width: '100px' }} />
        </Box>
      </Box>
    </AuthLayout>
  );
};