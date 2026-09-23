import { SequentialRateLimiter } from './rateLimiter';
import type { GeocodedLocation } from './types';

const OPENCAGE_ENDPOINT = 'https://api.opencagedata.com/geocode/v1/json';

export interface GeocodingProvider {
  geocode(query: string): Promise<GeocodedLocation | null>;
}

/**
 * OpenCageData ile geocoding. OpenStreetMap dahil birden çok kaynağı
 * birleştiren, üretim uygulamaları için tasarlanmış bir API.
 *
 * Nominatim'in halka açık demo sunucusunun aksine (ki bu sunucu bulut/
 * datacenter IP aralıklarını -GitHub Codespaces, Vercel vb.- sıkça
 * engelliyor, kendi kullanım politikasında da bunu açıkça belirtiyor),
 * API anahtarıyla kimliklendirilen istekler güvenilir şekilde çalışır.
 * Ücretsiz katman: günde 2.500 istek — bu aşamada fazlasıyla yeterli.
 */
export class OpenCageGeocoder implements GeocodingProvider {
  private cache = new Map<string, GeocodedLocation | null>();
  private limiter = new SequentialRateLimiter(1100);

  constructor(private apiKey: string) {
    if (!apiKey) {
      throw new Error(
        'OPENCAGE_API_KEY tanımlı değil. d9d7-app/.env.local dosyasına ekleyin ' +
        '(https://opencagedata.com adresinden ücretsiz key alınabilir).'
      );
    }
  }

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
    const url = new URL(OPENCAGE_ENDPOINT);
    url.searchParams.set('q', query);
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('limit', '1');
    url.searchParams.set('no_annotations', '1');

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`OpenCage geocoding başarısız: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as {
      results: Array<{
        geometry: { lat: number; lng: number };
        formatted: string;
        components?: Record<string, string>;
      }>;
    };

    if (!data.results || data.results.length === 0) return null;

    const best = data.results[0];
    return {
      latitude: best.geometry.lat,
      longitude: best.geometry.lng,
      displayName: best.formatted,
      countryCode: best.components?.['ISO_3166-1_alpha-2']?.toLowerCase(),
    };
  }
}
