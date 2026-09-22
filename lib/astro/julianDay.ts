import { DateTime } from 'luxon';

/**
 * UTC zaman damgasını Julian Day (UT)'a çevirir — Swiss Ephemeris'in
 * (swe_calc_ut, swe_houses vb.) beklediği zaman formatı budur.
 *
 * Standart astronomik formül (Jean Meeus, "Astronomical Algorithms", 7. bölüm),
 * swisseph'in kendi swe_julday fonksiyonunun içinde kullandığı formülle aynı.
 * Saf bir fonksiyon olduğu için native binding'e ihtiyaç duymadan bağımsız
 * test edilebilir; üretimde swisseph paketinin swe_julday'i ile çapraz
 * kontrol edilmesi önerilir.
 */
export function toJulianDayUT(utcDateTimeISO: string): number {
  const dt = DateTime.fromISO(utcDateTimeISO, { zone: 'utc' });
  if (!dt.isValid) {
    throw new Error(`Geçersiz UTC tarih/saat: ${utcDateTimeISO}`);
  }

  const { year, month, day, hour, minute, second } = dt;
  const dayFraction = day + (hour + minute / 60 + second / 3600) / 24;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4); // Gregoryen takvim düzeltmesi

  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    dayFraction +
    B -
    1524.5
  );
}
