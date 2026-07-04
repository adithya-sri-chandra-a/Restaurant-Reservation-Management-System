import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import CreateReservationPage from './pages/CreateReservationPage';
import MyReservationsPage from './pages/MyReservationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminReservationsPage from './pages/AdminReservationsPage';
import ManageTablesPage from './pages/ManageTablesPage';
import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/create-reservation" element={<CreateReservationPage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/reservations" element={<AdminReservationsPage />} />
          <Route path="/admin/tables" element={<ManageTablesPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
