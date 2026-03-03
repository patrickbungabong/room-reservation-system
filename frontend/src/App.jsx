import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { RoomList } from './pages/RoomList.jsx';
import { CreateReservation } from './pages/CreateReservation.jsx';
import { MyReservations } from './pages/MyReservations.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { ManageRooms } from './pages/ManageRooms.jsx';
import { ManageReservations } from './pages/ManageReservations.jsx';
import { ManageUsers } from './pages/ManageUsers.jsx';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <Layout><RoomList /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations/new"
        element={
          <ProtectedRoute>
            <Layout><CreateReservation /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations/my"
        element={
          <ProtectedRoute>
            <Layout><MyReservations /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <Layout><AdminDashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute adminOnly>
            <Layout><ManageRooms /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reservations"
        element={
          <ProtectedRoute adminOnly>
            <Layout><ManageReservations /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <Layout><ManageUsers /></Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-center" />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
