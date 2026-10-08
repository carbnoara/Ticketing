import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) return NextResponse.json({ error: 'Code is required' }, { status: 400 });

  try {
    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive promo code' }, { status: 404 });
    }

    return NextResponse.json({ discount: promo.discount });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
