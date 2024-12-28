import { BrowserRouter, Route, Routes } from 'react-router';
import { GamePage } from './pages/Game';
import { Home } from './pages/Home';
import { Path } from './types/Path';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={Path.HOME} element={<Home />} />
        <Route path={Path.GAME} element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}
