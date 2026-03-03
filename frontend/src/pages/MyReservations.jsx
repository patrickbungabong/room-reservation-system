import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { reservationsApi } from '../api/axios.js';

export function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMy = () => {
    setLoading(true);
    reservationsApi.getMy({ page, limit: 10 })
      .then(({ data }) => {
        if (data.success) {
          setReservations(data.reservations);
          setTotalPages(data.totalPages || 1);
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMy();
  }, [page]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await reservationsApi.cancel(id);
      toast.success('Reservation cancelled');
      fetchMy();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const statusClass = (s) => ({ pending: 'warning', approved: 'success', rejected: 'danger', cancelled: 'muted' }[s] || 'muted');

  return (
    <div className="reservations-page">
      <Toaster position="top-center" />
      <h1>My Reservations</h1>
      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr><td colSpan={6}>No reservations yet.</td></tr>
                ) : (
                  reservations.map((r) => (
                    <tr key={r._id}>
                      <td>{r.room?.name}</td>
                      <td>{new Date(r.date).toLocaleDateString()}</td>
                      <td>{r.startTime} – {r.endTime}</td>
                      <td>{r.purpose}</td>
                      <td><span className={`badge ${statusClass(r.status)}`}>{r.status}</span></td>
                      <td>
                        {r.status === 'pending' && (
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => handleCancel(r._id)}>
                            Cancel
                          </button>
                        )}
                        {r.adminComment && <small title={r.adminComment}>Note: {r.adminComment}</small>}
                      </td>
                    </tr>
                  ))
                )}
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
