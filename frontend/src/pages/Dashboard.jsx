import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Dashboard() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>Welcome, {user?.name}</h1>
      <p className="subtitle">{isAdmin ? 'Admin Dashboard' : 'Student Dashboard'}</p>
      <div className="card-grid">
        <Link to="/rooms" className="card">
          <h3>View Rooms</h3>
          <p>Browse available rooms and capacity</p>
        </Link>
        {user?.role === 'student' && (
          <>
            <Link to="/reservations/new" className="card">
              <h3>New Reservation</h3>
              <p>Request a room booking</p>
            </Link>
            <Link to="/reservations/my" className="card">
              <h3>My Reservations</h3>
              <p>View and manage your bookings</p>
            </Link>
          </>
        )}
        {isAdmin && (
          <>
            <Link to="/admin/rooms" className="card">
              <h3>Manage Rooms</h3>
              <p>Add, edit, or deactivate rooms</p>
            </Link>
            <Link to="/admin/reservations" className="card">
              <h3>Manage Reservations</h3>
              <p>Approve or reject requests</p>
            </Link>
            <Link to="/admin/users" className="card">
              <h3>Manage Users</h3>
              <p>View and manage users</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
