import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReservations = async (selectedDate = '') => {
    setLoading(true);
    try {
      const url = selectedDate ? `/admin/reservations/date?date=${selectedDate}` : '/admin/reservations';
      const response = await api.get(url);
      setReservations(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const cancelReservation = async (id) => {
    try {
      await api.delete(`/admin/reservation/${id}`);
      fetchReservations(date);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to cancel reservation');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>All Reservations</h2>
        <div className="row" style={{ marginBottom: 16 }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button className="btn btn-primary" onClick={() => fetchReservations(date)}>Filter</button>
        </div>
        {loading && <div className="spinner" />}
        {error && <div className="card" style={{ padding: 12, color: '#b91c1c', background: '#fef2f2' }}>{error}</div>}
        <div className="grid">
          {reservations.map((item) => (
            <div key={item._id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{item.userId?.name || 'Customer'}</strong>
                <span className={`status-badge status-${item.status}`}>{item.status}</span>
              </div>
              <p>Date: {new Date(item.reservationDate).toLocaleDateString()}</p>
              <p>Time: {item.timeSlot}</p>
              <p>Guests: {item.guestCount}</p>
              <p>Table: {item.tableId?.tableNumber || 'N/A'}</p>
              {item.status !== 'cancelled' && <button className="btn btn-danger" onClick={() => cancelReservation(item._id)}>Cancel</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReservationsPage;
