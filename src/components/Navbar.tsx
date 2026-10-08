'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import ViewAsDropdown from './ViewAsDropdown';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 72px',
      borderBottom: '1px solid var(--glass-border)'
    }} className="glass-panel">
      <div>
        <Link href="/">
          <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
            NEON TICKETS
          </h1>
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 600 }}>Home</Link>
        <Link href="/concerts" style={{ fontWeight: 600 }}>Concerts</Link>
        <Link href="/about" style={{ fontWeight: 600 }}>About</Link>
        {session && <Link href="/my-tickets" style={{ fontWeight: 600 }}>My Tickets</Link>}
        {session && ((session.user as any)?.activeRoleId === 1 || (session.user as any)?.activeRoleId === 3) && (
          <Link href="/admin" style={{ fontWeight: 600, color: 'var(--neon-cyan)' }}>Admin</Link>
        )}
        
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ViewAsDropdown />
            <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>{session.user?.name}</span>
            <button 
              onClick={() => signOut()}
              className="btn-secondary" 
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
