import { BrowserRouter, Route, Routes } from 'react-router';
import { GamePage } from './pages/Game';
import { HomePage } from './pages/HomePage';
import { PrintPage } from './pages/PrintPage';
import { Path } from './types/Path';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={Path.HOME} element={<HomePage />} />
        <Route path={Path.GAME} element={<GamePage />} />
        <Route path={Path.PRINT} element={<PrintPage />} />
      </Routes>
    </BrowserRouter>
  );
}
