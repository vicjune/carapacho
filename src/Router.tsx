import { BrowserRouter, Route, Routes } from 'react-router';
import { Home } from './pages/Home';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
