import Link from "next/link";

interface ConcertFilterProps {
  q?: string;
  filter?: string;
  isAdmin: boolean;
}

export default function ConcertFilter({ q, filter, isAdmin }: ConcertFilterProps) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <form action="/concerts" style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: 0 }}>
        <input
          type="text"
          name="q"
          defaultValue={q || ''}
          placeholder="Search artists, venues..."
          style={{
            padding: '0.8rem 1.2rem',
            borderRadius: '8px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            width: '200px',
            outline: 'none'
          }}
        />
        <select
          name="filter"
          defaultValue={filter || ''}
          style={{
            padding: '0.8rem 1.2rem',
            borderRadius: '8px',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        >
          <option value="">Sort by Date (Default)</option>
          <option value="newest">Baru ditambahkan</option>
          <option value="category">Sesuai kategori event</option>
          <option value="price_low">Harga terendah</option>
          <option value="price_high">Harga tertinggi</option>
          <option value="rating_high">Rating tertinggi</option>
        </select>
        <button type="submit" className="btn-secondary" style={{ padding: '0.8rem 1.5rem' }}>Filter</button>
      </form>
      {isAdmin && (
        <Link href="/events/new">
          <button className="btn-primary" style={{ padding: '0.8rem 1.5rem', marginLeft: '1rem' }}>+ Add Event</button>
        </Link>
      )}
    </div>
  );
}
