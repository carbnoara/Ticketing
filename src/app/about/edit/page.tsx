'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function EditAboutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [visionText, setVisionText] = useState('');
  const [platformText, setPlatformText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    const activeRoleId = (session?.user as any)?.activeRoleId || 2;
    if (!session || (activeRoleId !== 1 && activeRoleId !== 3)) {
      router.push('/');
      return;
    }

    // Fetch current settings
    const fetchSettings = async () => {
      try {
        // We'll create a GET endpoint for this later, or we can just fetch it as part of page load.
        // For simplicity, let's just make a POST request to a specialized endpoint or fetch all settings.
        const res = await fetch('/api/admin/settings?keys=about_vision,about_platform');
        if (res.ok) {
          const data = await res.json();
          if (data.about_vision) setVisionText(data.about_vision);
          if (data.about_platform) setPlatformText(data.about_platform);
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchSettings();
    }
  }, [session, status, router]);

  const handleSave = async (key: string, value: string) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        alert('Saved successfully!');
        router.push('/about');
        router.refresh();
      } else {
        alert('Failed to save');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '4rem 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', paddingLeft: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--neon-cyan)' }}>Edit About Page</h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--neon-pink)' }}>Our Vision</h2>
        <textarea 
          rows={6} 
          value={visionText} 
          onChange={(e) => setVisionText(e.target.value)}
          style={{ width: '100%', padding: '1rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', marginBottom: '1rem', resize: 'vertical' }}
          placeholder="Born from the underground synthwave scene..."
        />
        <button 
          className="btn-primary" 
          onClick={() => handleSave('about_vision', visionText)} 
          disabled={isSaving}
          style={{ padding: '0.8rem 1.5rem', opacity: isSaving ? 0.7 : 1 }}
        >
          Save Vision
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--neon-pink)' }}>The Platform</h2>
        <textarea 
          rows={6} 
          value={platformText} 
          onChange={(e) => setPlatformText(e.target.value)}
          style={{ width: '100%', padding: '1rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', marginBottom: '1rem', resize: 'vertical' }}
          placeholder="Built on cutting-edge secure ledgers..."
        />
        <button 
          className="btn-primary" 
          onClick={() => handleSave('about_platform', platformText)} 
          disabled={isSaving}
          style={{ padding: '0.8rem 1.5rem', opacity: isSaving ? 0.7 : 1 }}
        >
          Save Platform
        </button>
      </div>
    </div>
  );
}
