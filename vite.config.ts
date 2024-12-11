import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: { buildMode: true },
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint .',
      },
      overlay: {
        initialIsOpen: false,
        badgeStyle: 'display: none;',
      },
    }),
  ],
});
