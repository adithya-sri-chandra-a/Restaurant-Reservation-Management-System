import { useEffect, useState } from 'react';
import api from '../api/axios';

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservation/my-bookings');
      setReservations(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    setError('');

    try {
      const response = await api.delete(`/reservation/cancel/${id}`);
      const updatedReservation = response.data?.data;

      if (updatedReservation) {
        setReservations((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: updatedReservation.status } : item))
        );
      } else {
        await fetchReservations();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to cancel reservation');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const activeReservations = reservations.filter((item) => item.status !== 'cancelled');
  const cancelledReservations = reservations.filter((item) => item.status === 'cancelled');

  return (
    <div className="container">
      <section className="hero-card compact">
        <div className="hero-copy">
          <p className="eyebrow">Your bookings</p>
          <h2>Keep all your reservations in one place.</h2>
          <p>See what is coming up, update plans, and cancel if needed without any hassle.</p>
        </div>
        <div className="hero-panel">
          <div className="mini-stat">
            <strong>{activeReservations.length}</strong>
            <span>Active reservations</span>
          </div>
          <div className="mini-stat">
            <strong>{cancelledReservations.length}</strong>
            <span>Cancelled reservations</span>
          </div>
        </div>
      </section>

      <div className="card" style={{ marginTop: 18 }}>
        {loading && (
          <div className="loading-card">
            <div className="spinner" />
            <p style={{ marginTop: 10 }}>Loading your bookings...</p>
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        {!loading && reservations.length === 0 && (
          <div className="empty-state">
            <div>
              <h3>No reservations yet</h3>
              <p>Start by booking a table for your next visit.</p>
            </div>
          </div>
        )}
        {!loading && reservations.length > 0 && (
          <div className="grid">
            {activeReservations.length > 0 && (
              <div>
                <h3 style={{ marginBottom: 12 }}>Active reservations</h3>
                <div className="grid reservation-grid">
                  {activeReservations.map((item) => (
                    <div key={item._id} className="card reservation-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                        <strong>{new Date(item.reservationDate).toLocaleDateString()}</strong>
                        <span className={`status-badge status-${item.status}`}>{item.status}</span>
                      </div>
                      <p>Time: {item.timeSlot}</p>
                      <p>Guests: {item.guestCount}</p>
                      <p>Table: {item.tableId?.tableNumber || 'Assigned'}</p>
                      <button className="btn btn-danger" onClick={() => cancelReservation(item._id)}>
                        Cancel booking
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cancelledReservations.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h3 style={{ marginBottom: 12 }}>Cancelled reservations</h3>
                <div className="grid reservation-grid">
                  {cancelledReservations.map((item) => (
                    <div key={item._id} className="card reservation-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                        <strong>{new Date(item.reservationDate).toLocaleDateString()}</strong>
                        <span className={`status-badge status-${item.status}`}>{item.status}</span>
                      </div>
                      <p>Time: {item.timeSlot}</p>
                      <p>Guests: {item.guestCount}</p>
                      <p>Table: {item.tableId?.tableNumber || 'Assigned'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservationsPage;
