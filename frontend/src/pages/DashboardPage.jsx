import CustomerDashboardPage from './CustomerDashboardPage';
import AdminDashboardPage from './AdminDashboardPage';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <div className="card">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <CustomerDashboardPage />; // fallback for unauthenticated (should be redirected elsewhere)
  }

  return user.role === 'admin' ? <AdminDashboardPage /> : <CustomerDashboardPage />;
};

export default DashboardPage;
