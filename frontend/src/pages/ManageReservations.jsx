import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { reservationsApi, roomsApi } from '../api/axios.js';

export function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [comment, setComment] = useState('');

  const fetchReservations = () => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (filterStatus) params.status = filterStatus;
    reservationsApi.getAll(params)
      .then(({ data }) => {
        if (data.success) {
          setReservations(data.reservations);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReservations(); }, [page, filterStatus]);
  useEffect(() => {
    roomsApi.getAll({ limit: 100 }).then(({ data }) => data.success && setRooms(data.rooms));
  }, []);

  const handleApprove = async (id) => {
    try {
      await reservationsApi.approve(id, { adminComment: comment });
      toast.success('Approved');
      setComment('');
      fetchReservations();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      await reservationsApi.reject(id, { adminComment: comment });
      toast.success('Rejected');
      setComment('');
      fetchReservations();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reservation?')) return;
    try {
      await reservationsApi.delete(id);
      toast.success('Deleted');
      fetchReservations();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const statusClass = (s) => ({ pending: 'warning', approved: 'success', rejected: 'danger', cancelled: 'muted' }[s] || 'muted');

  return (
    <div className="manage-page">
      <Toaster position="top-center" />
      <h1>Manage Reservations</h1>
      <div className="filters">
        <label>
          Status
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>
      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Room</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r._id}>
                    <td>{r.student?.name}<br /><small>{r.student?.email}</small></td>
                    <td>{r.room?.name}</td>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.startTime} – {r.endTime}</td>
                    <td>{r.purpose}</td>
                    <td><span className={`badge ${statusClass(r.status)}`}>{r.status}</span></td>
                    <td>
                      {r.status === 'pending' && (
                        <>
                          <input
                            type="text"
                            placeholder="Comment (optional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="input-sm"
                          />
                          <button type="button" className="btn btn-sm btn-success" onClick={() => handleApprove(r._id)}>Approve</button>
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => handleReject(r._id)}>Reject</button>
                        </>
                      )}
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(r._id)}>Delete</button>
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
