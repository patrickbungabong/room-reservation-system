import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { roomsApi, reservationsApi } from '../api/axios.js';

export function CreateReservation() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    room: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    purpose: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    roomsApi.getAll({ isActive: true, limit: 100 }).then(({ data }) => {
      if (data.success) setRooms(data.rooms);
    }).catch(() => toast.error('Failed to load rooms'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.room || !form.date || !form.purpose.trim()) {
      toast.error('Room, date and purpose are required');
      return;
    }
    setLoading(true);
    try {
      const { data } = await reservationsApi.create({
        room: form.room,
        date: new Date(form.date).toISOString(),
        startTime: form.startTime,
        endTime: form.endTime,
        purpose: form.purpose.trim(),
      });
      if (data.success) {
        toast.success('Reservation requested');
        navigate('/reservations/my');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="form-page">
      <Toaster position="top-center" />
      <h1>New Reservation</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Room
          <select
            value={form.room}
            onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
            required
          >
            <option value="">Select room</option>
            {rooms.map((r) => (
              <option key={r._id} value={r._id}>{r.name} ({r.capacity})</option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input
            type="date"
            value={form.date}
            min={minDate}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            required
          />
        </label>
        <label>
          Start time
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
          />
        </label>
        <label>
          End time
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
          />
        </label>
        <label>
          Purpose
          <textarea
            value={form.purpose}
            onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}
            placeholder="Brief purpose of booking"
            rows={3}
            required
          />
        </label>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
