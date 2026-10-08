'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ViewAsDropdown() {
  const { data: session, update } = useSession();
  const router = useRouter();

  // Render if actual role is Superadmin (1) or PIC (3)
  const roleId = (session?.user as any)?.roleId;
  if (!session || (roleId !== 1 && roleId !== 3)) {
    return null;
  }

  const activeRoleId = (session?.user as any)?.activeRoleId || 1;

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRoleId = parseInt(e.target.value);
    // Call update session from NextAuth
    await update({ activeRoleId: newRoleId });
    router.refresh(); // Refresh the page to apply new permissions
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <select
        value={activeRoleId}
        onChange={handleRoleChange}
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--neon-pink)',
          color: 'var(--text-primary)',
          padding: '4px 8px',
          borderRadius: '4px',
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        <option value={1}>Superadmin</option>
        <option value={2}>Buyer</option>
        <option value={3}>PIC</option>
      </select>
    </div>
  );
}
