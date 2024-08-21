// src/theme.js

import { createTheme } from '@mui/material/styles';

// Define your custom theme here
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        h6: {
            fontWeight: 500,
            fontSize: '1.25rem',
            letterSpacing: '0.0075em',
        },
    },
});

export default theme;
