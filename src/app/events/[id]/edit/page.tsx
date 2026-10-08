import Link from 'next/link';
import EditEventForm from './components/EditEventForm';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div style={{ padding: '4rem 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← Back
        </Link>
        <h1 style={{ fontSize: '2rem', color: 'var(--neon-cyan)' }}>Edit Event</h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <EditEventForm eventId={id} />
      </div>
    </div>
  );
}
