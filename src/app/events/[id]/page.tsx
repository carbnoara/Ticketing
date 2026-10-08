import { PrismaClient } from '@prisma/client';
import EventPageClient from '@/components/EventPageClient';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetails({ params }: PageProps) {
  const { id } = await params;

  // If the id is not a valid cuid/uuid, we might want to handle it. For now let's just query.
  // In the dummy data scenario, we seeded 1 event. If the user goes to /events/2, it might not exist.
  // For demonstration, if we don't find it by ID, let's just grab the first event available
  // so the user still sees something. In a real app, we'd return a 404.
  
  let event = await prisma.event.findUnique({
    where: { id },
    include: { ticketTiers: true }
  });

  if (!event) {
    // Fallback for demo purposes if they go to /events/2 etc.
    event = await prisma.event.findFirst({
      include: { ticketTiers: true }
    });
  }

  if (!event) {
    return notFound();
  }

  return <EventPageClient event={event} tiers={event.ticketTiers} />;
}
