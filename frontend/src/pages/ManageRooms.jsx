import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { roomsApi } from '../api/axios.js';

export function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', capacity: '', location: '', description: '', isActive: true });

  const fetchRooms = () => {
    setLoading(true);
    roomsApi.getAll({ limit: 100 })
      .then(({ data }) => { if (data.success) setRooms(data.rooms); })
      .catch(() => toast.error('Failed to load rooms'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const openCreate = () => {
    setEditing('new');
    setForm({ name: '', capacity: '', location: '', description: '', isActive: true });
  };

  const openEdit = (room) => {
    setEditing(room._id);
    setForm({
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      description: room.description || '',
      isActive: room.isActive,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      capacity: Number(form.capacity) || 1,
      location: form.location.trim(),
      description: form.description.trim(),
      isActive: !!form.isActive,
    };
    try {
      if (editing && editing !== 'new') {
        await roomsApi.update(editing, payload);
        toast.success('Room updated');
      } else {
        await roomsApi.create(payload);
        toast.success('Room created');
      }
      setEditing(null);
      fetchRooms();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await roomsApi.delete(id);
      toast.success('Room deleted');
      fetchRooms();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="manage-page">
      <Toaster position="top-center" />
      <h1>Manage Rooms</h1>
      <button type="button" className="btn btn-primary" onClick={openCreate}>Add Room</button>
      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Capacity</th>
                  <th>Location</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r._id}>
                    <td>{r.name}</td>
                    <td>{r.capacity}</td>
                    <td>{r.location}</td>
                    <td>{r.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      <button type="button" className="btn btn-sm" onClick={() => openEdit(r)}>Edit</button>
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(r._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editing && (
            <form className="form-card inline-form" onSubmit={handleSubmit}>
              <h3>{editing === 'new' ? 'New Room' : 'Edit Room'}</h3>
              <label>Name <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required /></label>
              <label>Capacity <input type="number" min="1" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} required /></label>
              <label>Location <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} required /></label>
              <label>Description <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></label>
              <label className="checkbox">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                Active
              </label>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
