import { NextRequest, NextResponse } from 'next/server';
import { resolveBirthMoment } from '@/lib/astro/resolveBirthMoment';
import { castD1Chart } from '@/lib/astro/chart';
import { castD9Chart, castD7Chart } from '@/lib/astro/varga';

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

    const birthMoment = await resolveBirthMoment({ name, date, time, location });
    const d1 = castD1Chart(
      birthMoment.julianDayUT,
      birthMoment.location.latitude,
      birthMoment.location.longitude
    );
    const d9 = castD9Chart(d1);
    const d7 = castD7Chart(d1);

    return NextResponse.json({ birthMoment, d1, d9, d7 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Bilinmeyen hata oluştu.' },
      { status: 500 }
    );
  }
}
