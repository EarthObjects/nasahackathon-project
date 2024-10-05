import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeContextProvider } from './ThemeContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <ThemeContextProvider>
        <App />
    </ThemeContextProvider>
);