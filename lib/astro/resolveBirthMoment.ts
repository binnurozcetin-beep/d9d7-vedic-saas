import { NominatimGeocoder } from './geocode';
import { resolveTimeZone } from './timezone';
import { toJulianDayUT } from './julianDay';
import type { BirthInput, ResolvedBirthMoment } from './types';

// Modül seviyesinde tek instance: cache ve rate-limit tüm istekler
// arasında paylaşılsın diye.
const geocoder = new NominatimGeocoder();

/**
 * Ham doğum verisini (isim, tarih, saat, yer metni) Swiss Ephemeris'in
 * ihtiyaç duyduğu kesin astronomik girdiye çevirir: koordinatlar,
 * tarihsel olarak doğru UTC zamanı ve Julian Day (UT).
 */
export async function resolveBirthMoment(input: BirthInput): Promise<ResolvedBirthMoment> {
  const location = await geocoder.geocode(input.location);
  if (!location) {
    throw new Error(`"${input.location}" için konum bulunamadı.`);
  }

  const tz = resolveTimeZone(location.latitude, location.longitude, input.date, input.time);
  const julianDayUT = toJulianDayUT(tz.utcDateTimeISO);

  return {
    input,
    location,
    ianaTimeZone: tz.ianaTimeZone,
    utcOffsetMinutes: tz.utcOffsetMinutes,
    localDateTimeISO: tz.localDateTimeISO,
    utcDateTimeISO: tz.utcDateTimeISO,
    julianDayUT,
  };
}
