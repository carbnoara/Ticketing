'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function NewEventForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [tiers, setTiers] = useState<any[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
      } else {
        alert('Failed to upload image');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    const activeRoleId = (session?.user as any)?.activeRoleId || 2;
    if (!session || (activeRoleId !== 1 && activeRoleId !== 3)) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') return <div>Loading...</div>;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      artist: formData.get('artist'),
      category: formData.get('category'),
      date: formData.get('date'),
      location: formData.get('location'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl'),
      tiers: tiers,
    };

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to create event');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Event Name *</label>
        <input type="text" name="name" required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Artist / Performer *</label>
          <input type="text" name="artist" required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category *</label>
          <select name="category" required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}>
            <option value="Music">Music</option>
            <option value="Webinar">Webinar</option>
            <option value="Workshop">Workshop</option>
            <option value="Stand Up Comedy">Stand Up Comedy</option>
            <option value="Conference">Conference</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Date & Time *</label>
          <input type="datetime-local" name="date" required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Location *</label>
          <input type="text" name="location" placeholder="e.g. Cyber Arena, Neo Tokyo" required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description *</label>
        <textarea name="description" rows={4} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', resize: 'vertical' }}></textarea>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Cover Image</label>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input type="hidden" name="imageUrl" value={imageUrl} />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} 
            />
            {isUploading && <p style={{ color: 'var(--neon-cyan)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Uploading...</p>}
            {!isUploading && !imageUrl && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Select an image from your computer to upload.</p>}
          </div>
          {imageUrl && (
            <div style={{ width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
        <h3 style={{ margin: 0 }}>Ticket Pricing</h3>
        <button 
          type="button" 
          onClick={() => setTiers([...tiers, { name: '', stock: 0, price: 0 }])}
          className="btn-secondary" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          + Add Category
        </button>
      </div>
      
      {tiers.map((tier, index) => (
        <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category Name</label>
            <input 
              type="text" 
              value={tier.name}
              onChange={e => {
                const newTiers = [...tiers];
                newTiers[index].name = e.target.value;
                setTiers(newTiers);
              }}
              placeholder="e.g. Kategori A" 
              required 
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Stock</label>
            <input 
              type="number" 
              value={tier.stock}
              onChange={e => {
                const newTiers = [...tiers];
                newTiers[index].stock = Number(e.target.value);
                setTiers(newTiers);
              }}
              min={0} 
              required 
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Price ($)</label>
            <input 
              type="number" 
              value={tier.price}
              onChange={e => {
                const newTiers = [...tiers];
                newTiers[index].price = Number(e.target.value);
                setTiers(newTiers);
              }}
              min={0} 
              required 
              style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} 
            />
          </div>
          {tiers.length > 1 && (
            <button 
              type="button" 
              onClick={() => {
                const newTiers = [...tiers];
                newTiers.splice(index, 1);
                setTiers(newTiers);
              }}
              style={{ padding: '0.8rem', background: 'rgba(255,0,0,0.2)', color: 'var(--text-primary)', border: '1px solid rgba(255,0,0,0.5)', borderRadius: '4px', cursor: 'pointer' }}
            >
              X
            </button>
          )}
        </div>
      ))}

      <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '1rem', marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
        {isSubmitting ? 'Creating Event...' : 'Create Event'}
      </button>
    </form>
  );
}
