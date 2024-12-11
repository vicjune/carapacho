import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from './Router.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <CssBaseline />
      <Router />
    </StrictMode>,
  );
} else {
  throw new Error('No root element');
}
