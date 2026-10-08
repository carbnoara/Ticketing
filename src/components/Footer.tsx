export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: '1.5rem 72px',
      borderTop: '1px solid var(--glass-border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'var(--text-secondary)'
    }}>
      <div>
        <h2 className="gradient-text" style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>NEON TICKETS</h2>
        <p style={{ fontSize: '0.85rem', margin: 0 }}>Your gateway to the best live experiences.</p>
      </div>
      <p style={{ fontSize: '0.8rem', margin: 0 }}>
        &copy; {new Date().getFullYear()} Neon Tickets. All rights reserved.
      </p>
    </footer>
  );
}
