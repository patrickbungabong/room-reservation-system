import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { roomsApi } from '../api/axios.js';

export function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [capacityMin, setCapacityMin] = useState('');
  const [activeOnly, setActiveOnly] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (capacityMin) params.capacityMin = capacityMin;
      if (activeOnly) params.isActive = true;
      const { data } = await roomsApi.getAll(params);
      if (data.success) {
        setRooms(data.rooms);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page, capacityMin, activeOnly]);

  return (
    <div className="rooms-page">
      <Toaster position="top-center" />
      <h1>Available Rooms</h1>
      <div className="filters">
        <label>
          Min capacity
          <input
            type="number"
            min="1"
            value={capacityMin}
            onChange={(e) => setCapacityMin(e.target.value)}
            placeholder="Any"
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Active only
        </label>
      </div>
      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : (
        <>
          <div className="room-grid">
            {rooms.map((room) => (
              <div key={room._id} className="room-card">
                <h3>{room.name}</h3>
                <p className="meta">Capacity: {room.capacity} · {room.location}</p>
                {room.description && <p className="desc">{room.description}</p>}
                {!room.isActive && <span className="badge inactive">Inactive</span>}
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
