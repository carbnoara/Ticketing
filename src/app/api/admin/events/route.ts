import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const recent = url.searchParams.get("recent");

  if (recent) {
    try {
      const event = await prisma.event.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { ticketTiers: true }
      });
      return NextResponse.json(event || { message: "No events" });
    } catch (e) {
      return NextResponse.json({ message: "Error" }, { status: 500 });
    }
  }
  
  return NextResponse.json({ message: "Not implemented" }, { status: 400 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const activeRoleId = (session?.user as any)?.activeRoleId || 2;
  
  if (!session || (activeRoleId !== 1 && activeRoleId !== 3)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    const event = await prisma.event.create({
      data: {
        name: data.name,
        artist: data.artist,
        date: new Date(data.date),
        location: data.location,
        category: data.category || 'Music',
        description: data.description,
        imageUrl: data.imageUrl || null,
        ticketTiers: {
          create: data.tiers.map((tier: any) => ({
            name: tier.name,
            stock: Number(tier.stock),
            price: Number(tier.price),
            key: tier.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
          }))
        }
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ message: "Failed to create event" }, { status: 500 });
  }
}
