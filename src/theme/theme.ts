'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2563eb', // Tailwind blue-600
        },
        secondary: {
            main: '#4f46e5', // Tailwind indigo-600
        },
        background: {
            default: '#ffffff',
            paper: '#f8fafc', // Tailwind slate-50
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '0.5rem', // Tailwind rounded-lg
                },
            },
        },
    },
});

export default theme;
