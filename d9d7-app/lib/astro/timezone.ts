import { find as findTimeZones } from 'geo-tz';
import { DateTime } from 'luxon';
import type { TimeZoneResolution } from './types';

/**
 * Bir koordinatta geçerli IANA saat dilimini bulur, ardından o saat
 * diliminin GİRİLEN yerel doğum tarihi/saati için tarihsel olarak doğru
 * UTC ofsetini hesaplar.
 *
 * Bu adım gözden kaçırılırsa en yaygın hata buradan çıkar: birçok yer
 * yıllar içinde UTC ofsetini veya yaz saati kuralını değiştirdi
 * (örn. Türkiye 2016'da EET+DST'den kalıcı UTC+3'e geçti; Hindistan'da
 * 1947 öncesi farklı yerel ofsetler vardı). Sabit bir "ülke -> ofset"
 * tablosu kullanmak eski doğum tarihlerinde yanlış sonuç verir.
 *
 * Luxon bu hesabı, tarayıcı/Node motoruna gömülü IANA tzdata (ICU) üzerinden
 * yapar — ciddi astroloji yazılımlarının kullandığı aynı kaynak.
 */
export function resolveTimeZone(
  latitude: number,
  longitude: number,
  localDate: string,
  localTime: string
): TimeZoneResolution {
  const zones = findTimeZones(latitude, longitude);
  if (zones.length === 0) {
    throw new Error(`${latitude}, ${longitude} için saat dilimi bulunamadı.`);
  }

  // Sınır bölgelerinde geo-tz birden fazla aday döndürebilir; ilk sonuç
  // en iyi eşleşmedir. Anlaşmazlıklı bölgeler için `zones` dizisinin
  // tamamını çağırana döndürüp kullanıcıya seçtirmek de düşünülebilir.
  const ianaTimeZone = zones[0];

  const local = DateTime.fromISO(`${localDate}T${localTime}`, { zone: ianaTimeZone });
  if (!local.isValid) {
    throw new Error(
      `Geçersiz yerel tarih/saat: ${local.invalidReason} - ${local.invalidExplanation}`
    );
  }

  return {
    ianaTimeZone,
    utcOffsetMinutes: local.offset,
    localDateTimeISO: local.toISO()!,
    utcDateTimeISO: local.toUTC().toISO()!,
  };
}
