'use client';

import Link from 'next/link';

interface ConcertCardProps {
  id: string;
  title: string;
  artist: string;
  date: string;
  venue: string;
  price: string;
  imageUrl?: string | null;
  category?: string;
  isSoldOut?: boolean;
}

export default function ConcertCard({ id, title, artist, date, venue, price, imageUrl, category, isSoldOut = false }: ConcertCardProps) {
  return (
    <Link href={`/events/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="glass-panel" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      opacity: isSoldOut ? 0.6 : 1,
      filter: isSoldOut ? 'grayscale(0.5)' : 'none'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 255, 204, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{
        height: '180px',
        backgroundColor: 'var(--glass-bg)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--glass-border)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {category && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--neon-pink)', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 10 }}>
            {category}
          </div>
        )}
        {isSoldOut && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.8)', border: '2px solid var(--neon-pink)', color: 'var(--neon-pink)', padding: '8px 16px', borderRadius: '4px', fontSize: '1.5rem', fontWeight: 'bold', zIndex: 15, textTransform: 'uppercase', letterSpacing: '2px', transformOrigin: 'center' }}>
            Sold Out
          </div>
        )}
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <span style={{ color: 'var(--neon-cyan)', fontSize: '2rem', opacity: 0.5 }}>♫</span>
        )}
      </div>
      
      <div style={{ minWidth: 0 }}>
        <h3 
          style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '1.2rem', 
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          title={title}
        >
          {title}
        </h3>
        <p 
          style={{ 
            margin: 0, 
            color: 'var(--neon-pink)', 
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          title={artist}
        >
          {artist}
        </p>
      </div>
      
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <p style={{ margin: '0 0 0.25rem 0' }}>🗓 {date}</p>
        <p style={{ margin: 0 }}>📍 {venue}</p>
      </div>
      
      <div style={{
        marginTop: 'auto',
        paddingTop: '1rem',
        borderTop: '1px solid var(--glass-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', textDecoration: isSoldOut ? 'line-through' : 'none' }}>
          {price.toLowerCase() === 'free' ? 'FREE' : price === 'TBA' ? 'TBA' : `From ${price}`}
        </span>
        <span className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-block', borderRadius: '4px', opacity: isSoldOut ? 0.5 : 1 }}>
          {isSoldOut ? 'Sold Out' : 'Get Tickets'}
        </span>
      </div>
    </div>
    </Link>
  );
}
