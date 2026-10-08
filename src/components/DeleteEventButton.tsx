'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteEventButton({ eventId }: { eventId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="btn-secondary"
      style={{ 
        padding: '0.8rem 1.5rem', 
        borderColor: 'var(--neon-pink)', 
        color: 'var(--neon-pink)',
        cursor: isDeleting ? 'wait' : 'pointer',
        opacity: isDeleting ? 0.5 : 1
      }}
    >
      {isDeleting ? 'Deleting...' : 'Delete Event'}
    </button>
  );
}
