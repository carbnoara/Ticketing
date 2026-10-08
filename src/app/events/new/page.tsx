import Link from 'next/link';
import NewEventForm from './components/NewEventForm';

export default function NewEventPage() {
  return (
    <div style={{ padding: '4rem 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← Back
        </Link>
        <h1 style={{ fontSize: '2rem', color: 'var(--neon-cyan)' }}>Add New Event</h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <NewEventForm />
      </div>
    </div>
  );
}
