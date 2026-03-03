import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="brand">
          Room Reservation
        </Link>
        <nav className="nav">
          <Link to="/">Dashboard</Link>
          <Link to="/rooms">Rooms</Link>
          {user?.role === 'student' && (
            <>
              <Link to="/reservations/new">New Reservation</Link>
              <Link to="/reservations/my">My Reservations</Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link to="/admin">Admin</Link>
              <Link to="/admin/rooms">Manage Rooms</Link>
              <Link to="/admin/reservations">Manage Reservations</Link>
              <Link to="/admin/users">Manage Users</Link>
            </>
          )}
          <button type="button" className="btn-icon" onClick={toggle} aria-label="Toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>
          <span className="user-name">{user?.name}</span>
          <button type="button" className="btn btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
