import { SequentialRateLimiter } from './rateLimiter';
import type { GeocodedLocation } from './types';

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';

export interface GeocodingProvider {
  geocode(query: string): Promise<GeocodedLocation | null>;
}

/**
 * OpenStreetMap Nominatim ile geocoding. Ücretsiz, dünya çapında kapsama
 * sağlıyor ve düzenli güncelleniyor. Kullanım politikası gereği:
 *  - saniyede en fazla 1 istek (rateLimiter bunu garanti eder)
 *  - açıklayıcı bir User-Agent header'ı zorunlu
 * Farklı bir sağlayıcıya geçmek gerekirse aynı `GeocodingProvider`
 * arayüzünü uygulayan yeni bir sınıf yazmak yeterli — geri kalan
 * kod (resolveBirthMoment) değişmeden çalışmaya devam eder.
 */
export class NominatimGeocoder implements GeocodingProvider {
  private cache = new Map<string, GeocodedLocation | null>();
  private limiter = new SequentialRateLimiter();

  constructor(private userAgent = 'vedic-chart-app/1.0 (contact@example.com)') {}

  async geocode(query: string): Promise<GeocodedLocation | null> {
    const key = query.trim().toLowerCase();
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const result = await this.limiter.run(() => this.fetchGeocode(query));
    this.cache.set(key, result);
    return result;
  }

  private async fetchGeocode(query: string): Promise<GeocodedLocation | null> {
    const url = new URL(NOMINATIM_ENDPOINT);
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');
    url.searchParams.set('addressdetails', '1');

    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': this.userAgent },
    });

    if (!res.ok) {
      throw new Error(`Nominatim geocoding başarısız: ${res.status} ${res.statusText}`);
    }

    const results = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
      address?: { country_code?: string };
    }>;

    if (results.length === 0) return null;

    const best = results[0];
    return {
      latitude: parseFloat(best.lat),
      longitude: parseFloat(best.lon),
      displayName: best.display_name,
      countryCode: best.address?.country_code,
    };
  }
}
