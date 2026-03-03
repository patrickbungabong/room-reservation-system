import { Link } from 'react-router-dom';

export function AdminDashboard() {
  return (
    <div className="dashboard-page">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">Manage rooms, reservations, and users</p>
      <div className="card-grid">
        <Link to="/admin/rooms" className="card">
          <h3>Manage Rooms</h3>
          <p>Create, update, or delete rooms</p>
        </Link>
        <Link to="/admin/reservations" className="card">
          <h3>Manage Reservations</h3>
          <p>Approve or reject student requests</p>
        </Link>
        <Link to="/admin/users" className="card">
          <h3>Manage Users</h3>
          <p>View and manage user accounts</p>
        </Link>
      </div>
    </div>
  );
}
