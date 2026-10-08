import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const activeRoleId = (session?.user as any)?.activeRoleId || 2;
  
  if (!session || (activeRoleId !== 1 && activeRoleId !== 3)) {
    redirect('/');
  }

  const [orders, events, promoCodes] = await Promise.all([
    prisma.order.findMany({ include: { event: true }, orderBy: { createdAt: 'desc' } }),
    prisma.event.findMany({ include: { ticketTiers: true } }),
    prisma.promoCode.findMany({ orderBy: { discount: 'desc' } })
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const ticketsSold = orders.reduce((sum, o) => sum + o.quantity, 0);

  return (
    <div style={{ padding: '4rem 72px' }}>
      <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '4rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Revenue</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--neon-cyan)', margin: 0 }}>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Tickets Sold</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--neon-pink)', margin: 0 }}>{ticketsSold}</p>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active Events</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>{events.length}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Recent Orders</h2>
          {orders.length === 0 ? <p>No orders yet.</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '1rem 0' }}>Order ID</th>
                  <th>Customer</th>
                  <th>Event</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 0', fontFamily: 'monospace' }}>{o.orderId}</td>
                    <td>{o.customerName}</td>
                    <td>{o.event.name}</td>
                    <td>{o.quantity}</td>
                    <td style={{ color: 'var(--neon-cyan)' }}>${o.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Promo Codes</h2>
          {promoCodes.length === 0 ? <p>No promo codes.</p> : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {promoCodes.map(p => (
                <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>{p.code}</span>
                  <span style={{ color: 'var(--neon-pink)' }}>{p.discount}% OFF</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
