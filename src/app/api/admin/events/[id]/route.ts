import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const activeRoleId = (session?.user as any)?.activeRoleId || 2;

  if (!session || (activeRoleId !== 1 && activeRoleId !== 3)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ message: "Failed to delete event" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { ticketTiers: true }
    });
    if (!event) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const activeRoleId = (session?.user as any)?.activeRoleId || 2;
  
  if (!session || (activeRoleId !== 1 && activeRoleId !== 3)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const event = await prisma.event.update({
      where: { id },
      data: {
        name: data.name,
        artist: data.artist,
        date: new Date(data.date),
        location: data.location,
        category: data.category || 'Music',
        description: data.description,
        imageUrl: data.imageUrl || null,
        ticketTiers: data.tiers ? {
          deleteMany: {},
          create: data.tiers.map((tier: any) => ({
            name: tier.name,
            stock: Number(tier.stock),
            price: Number(tier.price),
            key: tier.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
          }))
        } : undefined,
      }
    });
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ message: error instanceof Error ? error.message : "Failed to update event" }, { status: 500 });
  }
}
