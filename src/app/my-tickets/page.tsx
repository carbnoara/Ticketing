import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function MyTickets() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    redirect('/login');
  }

  const orders = await prisma.order.findMany({
    where: {
      customerEmail: session.user.email
    },
    include: {
      event: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>My Tickets</h1>
      
      {orders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>You haven't purchased any tickets yet.</p>
          <a href="/concerts" className="btn-primary" style={{ display: 'inline-block', padding: '0.8rem 2rem', textDecoration: 'none' }}>Explore Events</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="glass-panel hover-lift" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{order.event.name}</h3>
                <p style={{ color: 'var(--neon-pink)', fontWeight: 'bold', marginBottom: '1rem' }}>{new Date(order.event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <span>📍 {order.event.location}</span>
                  <span>🎟️ {order.quantity}x {order.tier}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', borderLeft: '1px solid var(--glass-border)', paddingLeft: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Order ID</p>
                  <p style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{order.orderId}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Total Paid</p>
                  <p style={{ fontWeight: 'bold', color: 'var(--neon-cyan)', fontSize: '1.2rem' }}>${order.totalAmount.toFixed(2)}</p>
                </div>
                <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px' }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${order.orderId}`} alt="QR Code" width={100} height={100} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
