import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Access denied</h2>
        <p>You do not have permission to view this page.</p>
        <Link to="/" className="btn btn-primary">Go back home</Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
