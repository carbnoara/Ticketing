import Link from "next/link";
import { Prisma } from "@prisma/client";
import ConcertCard from "@/components/ConcertCard";

interface ConcertListProps {
  events: any[]; // Or properly type with Prisma.EventGetPayload<{include: {ticketTiers: true}}>[]
}

export default function ConcertList({ events }: ConcertListProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2.5rem'
    }}>
      {events.map((evt) => {
        const lowestPrice = evt.ticketTiers && evt.ticketTiers.length > 0
          ? Math.min(...evt.ticketTiers.map((t: any) => t.price))
          : -1;
        const price = lowestPrice === -1 ? 'TBA' : (lowestPrice === 0 ? 'Free' : `$${lowestPrice}`);
        
        const isSoldOut = evt.ticketTiers && evt.ticketTiers.length > 0 
          && evt.ticketTiers.every((t: any) => t.stock <= 0);

        return (
          <div key={evt.id} className="hover-lift">
            <ConcertCard
              id={evt.id.toString()}
              title={evt.name}
              artist={evt.artist}
              date={evt.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              venue={evt.location}
              price={price}
              imageUrl={evt.imageUrl}
              category={evt.category}
              isSoldOut={isSoldOut}
            />
          </div>
        );
      })}
    </div>
  );
}
