import Hero from "@/components/Hero";
import ConcertCard from "@/components/ConcertCard";

import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function Home() {
  const session = await getServerSession(authOptions);
  const activeRoleId = (session?.user as any)?.activeRoleId || 2;
  const isAdmin = activeRoleId === 1 || activeRoleId === 3;

  const events = await prisma.event.findMany({
    where: {
      ticketTiers: {
        some: {
          stock: {
            gt: 0
          }
        }
      }
    },
    include: { ticketTiers: true },
    orderBy: { date: 'asc' }
  });

  return (
    <div>
      <Hero />
      
      <section style={{ padding: '4rem 72px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', borderBottom: '1px solid var(--neon-pink)', display: 'inline-block', paddingBottom: '0.5rem', margin: 0 }}>
            On Sale
          </h2>
          {isAdmin && (
            <Link href="/events/new" className="btn-primary" style={{ padding: '0.8rem 1.5rem', textDecoration: 'none' }}>
              + Add New Event
            </Link>
          )}
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {events.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No upcoming events right now. Check back later!</p>
          ) : (
            events.map(event => {
              const lowestPrice = event.ticketTiers.length > 0 
                ? Math.min(...event.ticketTiers.map(t => t.price))
                : -1;
              const priceStr = lowestPrice === -1 ? 'TBA' : (lowestPrice === 0 ? 'Free' : `$${lowestPrice}`);
              
              const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });

              return (
                <ConcertCard 
                  key={event.id} 
                  id={event.id}
                  title={event.name}
                  artist={event.artist}
                  date={formattedDate}
                  venue={event.location}
                  price={priceStr}
                  imageUrl={event.imageUrl}
                  category={event.category}
                />
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
