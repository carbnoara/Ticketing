'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (res?.error) {
      alert("Invalid credentials");
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at center, rgba(0, 255, 204, 0.05) 0%, transparent 60%)'
    }}>
      <div className="glass-panel" style={{
        padding: '3rem',
        width: '100%',
        maxWidth: '450px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Sign in to access your tickets and history.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'var(--neon-cyan)' }}>Email Address</label>
            <input 
              type="email" 
              id="email"
              required 
              placeholder="cyber@punk.city"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                background: 'var(--glass-bg)', 
                border: '1px solid var(--glass-border)', 
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }} 
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--neon-cyan)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password" style={{ fontSize: '0.9rem', color: 'var(--neon-cyan)' }}>Password</label>
              <Link href="#" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Forgot?</Link>
            </div>
            <input 
              type="password" 
              id="password"
              required 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                background: 'var(--glass-bg)', 
                border: '1px solid var(--glass-border)', 
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }} 
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--neon-cyan)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          <button type="submit" className="btn-secondary" style={{ marginTop: '1rem', padding: '12px' }}>
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link href="/register" style={{ color: 'var(--neon-pink)', fontWeight: 600 }}>Register here</Link>
        </div>
      </div>
    </div>
  );
}
