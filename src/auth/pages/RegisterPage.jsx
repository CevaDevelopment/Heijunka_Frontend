import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, TextField, Box, Typography } from '@mui/material';
import { AuthLayout } from '../layout/AuthLayout';
import { useAuthStore, useForm } from '../../hooks';
import logo from "../../../public/logo.png"; // Importa el logo

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
    <AuthLayout title="Crear cuenta">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundImage: `url(${logo})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '50%',
          backgroundPosition: 'center',
          opacity: 0.1, // Ajusta la opacidad para crear el efecto de marca de agua
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '400px' }}>
          <form onSubmit={registerSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <TextField
                  label="Nombre"
                  type="text"
                  placeholder='Nombre'
                  name='registerName'
                  value={registerName}
                  onChange={onInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <TextField
                  label="Apellido"
                  type="text"
                  placeholder='Apellido'
                  name='registerApellido'
                  value={registerApellido}
                  onChange={onInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <TextField
                  label="Correo"
                  type="email"
                  placeholder='correo@google.com'
                  name='registerEmail'
                  value={registerEmail}
                  onChange={onInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <TextField
                  label="Contraseña"
                  type="password"
                  placeholder='Contraseña'
                  name='registerPassword'
                  value={registerPassword}
                  onChange={onInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <TextField
                  label="Confirmar Contraseña"
                  type="password"
                  placeholder='Confirmar Contraseña'
                  name='registerPasswordConfirm'
                  value={registerPasswordConfirm}
                  onChange={onInputChange}
                  fullWidth
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
                    }}
                  >
                    Crear cuenta
                  </Button>
                </Grid>
              </Grid>

              <Grid container direction="row" justifyContent="end">
                <Typography sx={{ mr: 1 }}>¿Ya tienes cuenta?</Typography>
                <Link component={RouterLink} color="inherit" to="/auth/login" sx={{ color: "#0C1A52" }}>
                  Ingresar
                </Link>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </AuthLayout>
  );
};