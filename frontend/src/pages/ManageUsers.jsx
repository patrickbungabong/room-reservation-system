import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { usersApi } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user: currentUser } = useAuth();

  const fetchUsers = () => {
    setLoading(true);
    usersApi.getAll({ page, limit: 15 })
      .then(({ data }) => {
        if (data.success) {
          setUsers(data.users);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleDelete = async (id) => {
    if (id === currentUser?.id) {
      toast.error('You cannot delete yourself');
      return;
    }
    if (!window.confirm('Delete this user?')) return;
    try {
      await usersApi.delete(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await usersApi.update(id, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="manage-page">
      <Toaster position="top-center" />
      <h1>Manage Users</h1>
      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u._id === currentUser?.id}
                      >
                        <option value="student">student</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u._id)}
                        disabled={u._id === currentUser?.id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
