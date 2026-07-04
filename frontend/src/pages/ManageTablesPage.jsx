import { useEffect, useState } from 'react';
import api from '../api/axios';

const ManageTablesPage = () => {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ tableNumber: '', capacity: 2, status: 'available' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/tables');
      setTables(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const addTable = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/tables', {
        tableNumber: form.tableNumber,
        capacity: Number(form.capacity),
        status: form.status
      });
      setSuccess(response.data.message);
      setForm({ tableNumber: '', capacity: 2, status: 'available' });
      fetchTables();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add table');
    }
  };

  const deleteTable = async (id) => {
    try {
      await api.delete(`/admin/tables/${id}`);
      fetchTables();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete table');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Manage Tables</h2>
        <form onSubmit={addTable} className="form-grid" style={{ marginBottom: 20 }}>
          {error && <div className="card" style={{ padding: 12, color: '#b91c1c', background: '#fef2f2' }}>{error}</div>}
          {success && <div className="card" style={{ padding: 12, color: '#166534', background: '#f0fdf4' }}>{success}</div>}
          <input value={form.tableNumber} onChange={(e) => setForm({ ...form, tableNumber: e.target.value })} placeholder="Table Number" required />
          <input type="number" min="1" max="12" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button className="btn btn-primary">Add Table</button>
        </form>
        {loading && <div className="spinner" />}
        <div className="grid">
          {tables.map((table) => (
            <div key={table._id} className="card" style={{ padding: 16 }}>
              <h3>Table {table.tableNumber}</h3>
              <p>Capacity: {table.capacity}</p>
              <p>Status: {table.status}</p>
              <button className="btn btn-danger" onClick={() => deleteTable(table._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTablesPage;
