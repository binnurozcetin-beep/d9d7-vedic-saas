import { NextRequest, NextResponse } from 'next/server';
import { resolveBirthMoment } from '@/lib/astro/resolveBirthMoment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, date, time, location } = body;

    if (!date || !time || !location) {
      return NextResponse.json(
        { error: 'date, time ve location alanları zorunludur.' },
        { status: 400 }
      );
    }

    const resolved = await resolveBirthMoment({ name, date, time, location });
    return NextResponse.json(resolved);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Bilinmeyen hata oluştu.' },
      { status: 500 }
    );
  }
}
