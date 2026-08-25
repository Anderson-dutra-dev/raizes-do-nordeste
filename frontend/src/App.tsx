import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('@raizes:token');
  return token ? children : <Navigate to="/" />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}