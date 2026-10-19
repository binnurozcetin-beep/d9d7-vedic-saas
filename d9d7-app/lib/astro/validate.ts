import { DateTime } from 'luxon';
import { UserFacingError } from './errors';
import type { BirthInput } from './types';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

// Desteklenen en eski doğum yılı. Bunun öncesinde saat dilimi kayıtları
// (IANA tzdata) çoğu bölge için güvenilir değil; bilinçli bir sınır.
const MIN_YEAR = 1900;
const MIN_LOCATION_LENGTH = 2;
const MAX_LOCATION_LENGTH = 120;
const MAX_NAME_LENGTH = 80;

/**
 * Ham istek gövdesini doğrular ve temizlenmiş bir BirthInput döndürür.
 * Geçersiz girdide kullanıcıya gösterilebilecek Türkçe bir hata fırlatır.
 */
export function parseBirthInput(body: unknown): BirthInput {
  if (typeof body !== 'object' || body === null) {
    throw new UserFacingError('İstek geçersiz.');
  }

  const { name, date, time, location } = body as Record<string, unknown>;

  // Tarih
  if (typeof date !== 'string' || !DATE_RE.test(date)) {
    throw new UserFacingError('Doğum tarihi geçersiz (YYYY-AA-GG biçiminde olmalı).');
  }
  const parsedDate = DateTime.fromISO(date);
  if (!parsedDate.isValid) {
    throw new UserFacingError('Doğum tarihi geçersiz (böyle bir gün yok).');
  }
  if (parsedDate.year < MIN_YEAR) {
    throw new UserFacingError(`Doğum yılı en erken ${MIN_YEAR} olabilir.`);
  }
  if (parsedDate.toMillis() > DateTime.now().plus({ days: 1 }).toMillis()) {
    throw new UserFacingError('Doğum tarihi gelecekte olamaz.');
  }

  // Saat
  if (typeof time !== 'string' || !TIME_RE.test(time)) {
    throw new UserFacingError('Doğum saati geçersiz (SS:DD biçiminde olmalı).');
  }

  // Yer
  if (typeof location !== 'string') {
    throw new UserFacingError('Doğum yeri gerekli.');
  }
  const cleanLocation = location.trim();
  if (cleanLocation.length < MIN_LOCATION_LENGTH || cleanLocation.length > MAX_LOCATION_LENGTH) {
    throw new UserFacingError(
      `Doğum yeri ${MIN_LOCATION_LENGTH}-${MAX_LOCATION_LENGTH} karakter arasında olmalı.`
    );
  }

  // İsim (isteğe bağlı, hesaplamada kullanılmıyor)
  const cleanName = typeof name === 'string' ? name.trim().slice(0, MAX_NAME_LENGTH) : '';

  return {
    name: cleanName || undefined,
    date,
    time,
    location: cleanLocation,
  };
}
