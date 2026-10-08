'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      if (res.ok) {
        alert('Registration successful! Please sign in.');
        router.push('/login');
      } else {
        const data = await res.json();
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at center, rgba(255, 0, 85, 0.05) 0%, transparent 60%)'
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
            Join the Resistance
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Create an account to book your next live experience.
          </p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="name" style={{ fontSize: '0.9rem', color: 'var(--neon-pink)' }}>Full Name</label>
            <input 
              type="text" 
              id="name"
              required 
              placeholder="Neon Runner"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ 
                padding: '1rem', 
                borderRadius: '8px', 
                background: 'var(--glass-bg)', 
                border: '1px solid var(--glass-border)', 
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }} 
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--neon-pink)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'var(--neon-pink)' }}>Email Address</label>
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
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--neon-pink)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.9rem', color: 'var(--neon-pink)' }}>Password</label>
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
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--neon-pink)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '12px' }}>
            Create Account
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
