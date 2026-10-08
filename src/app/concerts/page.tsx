import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ConcertList from "./components/ConcertList";
import ConcertFilter from "./components/ConcertFilter";

export const metadata: Metadata = {
  title: "Concerts | Neon Tickets",
  description: "Browse all upcoming cyberpunk and synthwave concerts.",
};

interface PageProps {
  searchParams: Promise<{ q?: string; filter?: string }>;
}

export default async function ConcertsPage({ searchParams }: PageProps) {
  const { q, filter } = await searchParams;
  const session = await getServerSession(authOptions);
  const activeRoleId = (session?.user as any)?.activeRoleId || 2;
  const isAdmin = activeRoleId === 1 || activeRoleId === 3;

  const where: any = {};

  if (q) {
    where.OR = [
      { name: { contains: q } },
      { artist: { contains: q } },
      { location: { contains: q } }
    ];
  }

  let events = await prisma.event.findMany({
    where,
    include: { ticketTiers: true }
  });

  if (filter === 'newest') {
    events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else if (filter === 'category') {
    events.sort((a, b) => a.category.localeCompare(b.category));
  } else if (filter === 'price_low') {
    events.sort((a, b) => {
      const minA = a.ticketTiers.length > 0 ? Math.min(...a.ticketTiers.map(t => t.price)) : Infinity;
      const minB = b.ticketTiers.length > 0 ? Math.min(...b.ticketTiers.map(t => t.price)) : Infinity;
      return minA - minB;
    });
  } else if (filter === 'price_high') {
    events.sort((a, b) => {
      const minA = a.ticketTiers.length > 0 ? Math.min(...a.ticketTiers.map(t => t.price)) : -Infinity;
      const minB = b.ticketTiers.length > 0 ? Math.min(...b.ticketTiers.map(t => t.price)) : -Infinity;
      return minB - minA;
    });
  } else if (filter === 'rating_high') {
    events.sort((a, b) => (b as any).rating - (a as any).rating);
  } else {
    // Default sorting by date
    events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  return (
    <div style={{ padding: '4rem 72px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            All Concerts
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Find your next immersive experience on the grid.</p>
        </div>

        <ConcertFilter q={q} filter={filter} isAdmin={isAdmin} />
      </div>

      <ConcertList events={events} />
    </div>
  );
}
