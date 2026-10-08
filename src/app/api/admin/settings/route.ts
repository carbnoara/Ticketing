import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const activeRoleId = (session?.user as any)?.activeRoleId || 2;
  
  if (!session || (activeRoleId !== 1 && activeRoleId !== 3)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key, value } = await req.json();

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json(setting, { status: 200 });
  } catch (error) {
    console.error("Error saving setting:", error);
    return NextResponse.json({ message: "Failed to save setting" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const keys = searchParams.get('keys');
  
  try {
    if (keys) {
      const keyArray = keys.split(',');
      const settings = await prisma.siteSetting.findMany({
        where: { key: { in: keyArray } }
      });
      
      const result = settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);
      
      return NextResponse.json(result);
    }
    
    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
  }
}
