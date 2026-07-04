import { useState } from 'react';
import api from '../api/axios';

const timeSlots = ['12:00', '13:00', '14:00', '18:00', '19:00', '20:00', '21:00'];
const tableOptions = [
  { capacity: 2, icon: '🪑', title: 'Cozy for two', subtitle: 'Perfect for dates and quick bites', accent: 'sunset' },
  { capacity: 4, icon: '🪑🪑', title: 'Small group', subtitle: 'Ideal for friends and casual meetups', accent: 'sky' },
  { capacity: 6, icon: '🪑🪑🪑', title: 'Family table', subtitle: 'Roomy and comfortable for a bigger crew', accent: 'gold' },
  { capacity: 8, icon: '🪑🪑🪑🪑', title: 'Banquet table', subtitle: 'Great for celebrations and shared meals', accent: 'violet' },
  { capacity: 10, icon: '🪑🪑🪑🪑🪑', title: 'Group table', subtitle: 'A spacious pick for lively gatherings', accent: 'mint' },
  { capacity: 12, icon: '🪑🪑🪑🪑🪑🪑', title: 'Party table', subtitle: 'Best for big events and special occasions', accent: 'rose' }
];

const CreateReservationPage = () => {
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateValue = (value) => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const today = formatLocalDate(new Date());
  const [form, setForm] = useState({ reservationDate: today, timeSlot: '19:00', guestCount: 2 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedTable = tableOptions.find((option) => option.capacity === Number(form.guestCount)) || tableOptions[0];
  const now = new Date();
  const todayDate = parseDateValue(today);
  const selectedDate = parseDateValue(form.reservationDate || today);
  const isToday = selectedDate.getTime() === todayDate.getTime();

  const getValidationError = (reservationDate, timeSlot) => {
    if (!reservationDate) return '';
    const selectedBookingDate = parseDateValue(reservationDate);
    if (selectedBookingDate < todayDate) {
      return 'No booking can be done for past dates or times. Please pick a future date and time.';
    }
    if (selectedBookingDate > todayDate) {
      return '';
    }

    const [hours, minutes] = timeSlot.split(':').map(Number);
    const selectedTime = new Date(now);
    selectedTime.setHours(hours, minutes, 0, 0);

    return selectedTime <= now ? 'No booking can be done for past dates or times. Please pick a future date and time.' : '';
  };

  const validationError = getValidationError(form.reservationDate, form.timeSlot);

  const isPastSelection = () => Boolean(validationError);

  const isTimeDisabled = (slot) => {
    if (!isToday) return false;
    const [hours, minutes] = slot.split(':').map(Number);
    const slotTime = new Date(now);
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime <= now;
  };

  const timeHint = isToday
    ? 'Some time slots are already past and are disabled.'
    : 'Choose any available time slot for your preferred day.';
  const dateLabel = parseDateValue(form.reservationDate).toLocaleDateString('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (isPastSelection()) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/reservation/create', {
        reservationDate: form.reservationDate,
        timeSlot: form.timeSlot,
        guestCount: Number(form.guestCount)
      });
      setSuccess(response.data.message || 'Your reservation has been booked successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card reservation-shell">
        <div className="reservation-hero">
          <div className="reservation-hero-copy">
            <p className="eyebrow">Restaurant booking</p>
            <h2>Reserve your perfect table</h2>
            <p>Pick a date, a suitable time, and a table size that fits your group. The flow is simple, quick, and made for a smooth dining experience.</p>
            <div className="booking-steps">
              <div className="booking-step">
                <strong>1</strong>
                <span>Select a date</span>
              </div>
              <div className="booking-step">
                <strong>2</strong>
                <span>Pick a time</span>
              </div>
              <div className="booking-step">
                <strong>3</strong>
                <span>Choose your table</span>
              </div>
            </div>
          </div>

          <div className="reservation-hero-panel">
            <div className="mini-stat">
              <strong>Easy table selection</strong>
              <span>Each table card shows the ideal seating size at a glance.</span>
            </div>
            <div className="mini-stat">
              <strong>Fast confirmation</strong>
              <span>One tap to lock in your preferred dining time and table.</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-panel">
          {(error || validationError) && (
            <div className="alert alert-error">
              <strong>Booking unavailable</strong>
              <div>{error || validationError}</div>
            </div>
          )}
          {success && <div className="alert alert-success">{success}</div>}

          <label className="field">
            <span>Select date</span>
            <input
              type="date"
              min={today}
              value={form.reservationDate}
              onChange={(e) => setForm({ ...form, reservationDate: e.target.value })}
              required
            />
          </label>

          <label className="field">
            <span>Pick a time slot</span>
            <div className="time-hint">{timeHint}</div>
            <div className="chip-row">
              {timeSlots.map((slot) => {
                const disabled = isTimeDisabled(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    className={`chip ${form.timeSlot === slot ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                    onClick={() => !disabled && setForm({ ...form, timeSlot: slot })}
                    disabled={disabled}
                  >
                    {slot}
                    {disabled && ' • Past'}
                  </button>
                );
              })}
            </div>
          </label>

          <label className="field">
            <span>Choose your table</span>
            <div className="table-grid">
              {tableOptions.map((option) => (
                <button
                  key={option.capacity}
                  type="button"
                  className={`table-card ${Number(form.guestCount) === option.capacity ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, guestCount: option.capacity })}
                >
                  <div className={`table-icon ${option.accent}`}>{option.icon}</div>
                  <div className="table-copy">
                    <strong>{option.title}</strong>
                    <span>{option.capacity} seats</span>
                    <small>{option.subtitle}</small>
                  </div>
                </button>
              ))}
            </div>
          </label>

          <div className="ticket-summary">
            <div className="ticket-summary-top">
              <span className="ticket-pill">Your booking</span>
              <strong>{selectedTable.title}</strong>
            </div>
            <div className="ticket-meta">
              <div>
                <span>Date</span>
                <strong>{dateLabel}</strong>
              </div>
              <div>
                <span>Time</span>
                <strong>{form.timeSlot}</strong>
              </div>
              <div>
                <span>Guests</span>
                <strong>{form.guestCount}</strong>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Reserve this table'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateReservationPage;
