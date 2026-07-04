import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="container">
      <div className="card">
        <h2>Admin Dashboard</h2>
        <p>Manage reservations and tables from one place.</p>
        <div className="row" style={{ marginTop: 16 }}>
          <Link to="/admin/reservations" className="btn btn-primary">All Reservations</Link>
          <Link to="/admin/tables" className="btn btn-secondary">Manage Tables</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
