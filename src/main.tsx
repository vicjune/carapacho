import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import i18next from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { SnackbarProvider } from 'notistack';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { ModalProvider } from 'react-modal-hook';
import { RecoilRoot } from 'recoil';
import en from '../assets/i18n/en.json';
import fr from '../assets/i18n/fr.json';
import { Router } from './Router.tsx';
import './index.css';
import { theme } from './theme.ts';

i18next
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ThemeProvider theme={theme}>
        <RecoilRoot>
          <SnackbarProvider>
            <ModalProvider>
              <CssBaseline />
              <Router />
            </ModalProvider>
          </SnackbarProvider>
        </RecoilRoot>
      </ThemeProvider>
    </StrictMode>,
  );
} else {
  throw new Error('No root element');
}
