import { Link } from 'react-router-dom';

const quickActions = [
  {
    title: 'Book a table',
    description: 'Reserve your preferred slot in just a few taps.',
    to: '/create-reservation'
  },
  {
    title: 'Manage bookings',
    description: 'Review or cancel upcoming reservations anytime.',
    to: '/my-reservations'
  },
  {
    title: 'Plan your visit',
    description: 'Choose lunch, dinner, or weekend dining with ease.',
    to: '/create-reservation'
  }
];

const features = [
  'Fast and simple booking flow',
  'Clear booking reminders and status updates',
  'Friendly layout built for mobile and desktop'
];

const CustomerDashboardPage = () => {
  return (
    <div className="container">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Restaurant reservation made simple</p>
          <h1>Reserve your table in minutes.</h1>
          <p>Enjoy a smoother dining experience with quick bookings, easy updates, and a welcoming interface designed for guests.</p>
          <div className="row" style={{ marginTop: 18 }}>
            <Link to="/create-reservation" className="btn btn-primary">Reserve now</Link>
            <Link to="/my-reservations" className="btn btn-secondary">View bookings</Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="mini-stat">
            <strong>Fast booking</strong>
            <span>Reserve in under a minute</span>
          </div>
          <div className="mini-stat">
            <strong>Flexible timing</strong>
            <span>Choose lunch, dinner, or late evening</span>
          </div>
          <div className="mini-stat">
            <strong>Guest-friendly</strong>
            <span>Perfect for couples, families, and groups</span>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        {quickActions.map((item) => (
          <div key={item.title} className="feature-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <Link to={item.to} className="btn btn-secondary" style={{ marginTop: 12 }}>
              Open
            </Link>
          </div>
        ))}
      </section>

      <section className="info-grid">
        <div className="card">
          <h3>Why guests love RRMS</h3>
          <ul className="feature-list">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3>Helpful tip</h3>
          <p>Book early for peak dinner hours and keep your reservations updated if your plans change.</p>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboardPage;
