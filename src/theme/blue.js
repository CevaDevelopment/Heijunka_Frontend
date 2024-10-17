import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const blueTheme =  createTheme({
    palette: {
        primary: {
            main: '#0C1A52',
        },
        secondary: {
            main: '#CC3329',
        },
        error: {
            main: red.A400,
        },
    }
})