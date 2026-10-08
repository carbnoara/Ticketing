import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Check if event already exists
  const existingEvent = await prisma.event.findFirst({
    where: { name: 'Neon Nights Tour' }
  });

  if (!existingEvent) {
    const event = await prisma.event.create({
      data: {
        name: 'Neon Nights Tour',
        artist: 'The Midnight',
        date: new Date('2026-10-24T19:00:00.000Z'), // Oct 24, 2026 7:00 PM
        location: 'Cyber Arena, Neo Tokyo',
        description: 'Join us for an unforgettable night of synthwave and retro-futuristic vibes. Experience the neon glow and pulsating bass in the heart of Neo Tokyo.',
        imageUrl: null,
        ticketTiers: {
          create: [
            { name: 'Early Bird', price: 50, key: 'early_bird' },
            { name: 'General Admission', price: 80, key: 'ga' },
            { name: 'VIP Pass', price: 250, key: 'vip' },
            { name: 'VVIP Pass', price: 350, key: 'vvip' },
            { name: 'Backstage & Meet', price: 500, key: 'backstage' }
          ]
        }
      }
    });
    console.log('Seed: Created event:', event.name);
  } else {
    console.log('Seed: Event already exists:', existingEvent.name);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
