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
            main: '#2563eb', // Tailwind blue-600 - WCAG AA compliant
            dark: '#1d4ed8', // Tailwind blue-700
            light: '#3b82f6', // Tailwind blue-500
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#4f46e5', // Tailwind indigo-600 - WCAG AA compliant
            dark: '#4338ca', // Tailwind indigo-700
            light: '#6366f1', // Tailwind indigo-500
            contrastText: '#ffffff',
        },
        background: {
            default: '#ffffff',
            paper: '#f8fafc', // Tailwind slate-50
        },
        text: {
            primary: '#0f172a', // Tailwind slate-900 - High contrast
            secondary: '#475569', // Tailwind slate-600 - WCAG AA compliant
        },
        error: {
            main: '#dc2626', // Tailwind red-600 - WCAG AA compliant
            dark: '#b91c1c', // Tailwind red-700
            light: '#ef4444', // Tailwind red-500
            contrastText: '#ffffff',
        },
        warning: {
            main: '#d97706', // Tailwind amber-600 - WCAG AA compliant
            dark: '#b45309', // Tailwind amber-700
            light: '#f59e0b', // Tailwind amber-500
            contrastText: '#ffffff',
        },
        success: {
            main: '#059669', // Tailwind emerald-600 - WCAG AA compliant
            dark: '#047857', // Tailwind emerald-700
            light: '#10b981', // Tailwind emerald-500
            contrastText: '#ffffff',
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        // Improve readability with better line heights
        h1: { lineHeight: 1.2 },
        h2: { lineHeight: 1.25 },
        h3: { lineHeight: 1.3 },
        h4: { lineHeight: 1.35 },
        h5: { lineHeight: 1.4 },
        h6: { lineHeight: 1.4 },
        body1: { lineHeight: 1.6 },
        body2: { lineHeight: 1.6 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '0.5rem', // Tailwind rounded-lg
                    minHeight: '44px', // Accessibility: minimum touch target size
                    minWidth: '44px',
                    fontWeight: 500,
                    // Enhanced focus styles
                    '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: 'secondary.main',
                        outlineOffset: '2px',
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    textDecorationThickness: '2px',
                    textUnderlineOffset: '2px',
                    '&:hover, &:focus': {
                        textDecorationThickness: '3px',
                    },
                    '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: '2px',
                        borderRadius: '2px',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    // Enhanced focus styles for interactive cards
                    '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: '2px',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        minHeight: '44px', // Accessibility: minimum touch target size
                        '&:focus-within': {
                            outline: '2px solid',
                            outlineColor: 'primary.main',
                            outlineOffset: '2px',
                        },
                    },
                },
            },
        },
    },
});

export default theme;
