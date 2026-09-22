/**
 * Nominatim kullanım politikası saniyede en fazla 1 istek şart koşuyor.
 * Bu sınıf tüm geocoding çağrılarını tek bir sıraya alıp aralarına
 * minimum bekleme süresi koyar. Üretimde yüksek hacimde kullanılacaksa
 * bunun yerine kendi Nominatim instance'ını self-host etmek ya da
 * ücretli bir sağlayıcıya (Google, Mapbox, LocationIQ) geçmek gerekir.
 */
export class SequentialRateLimiter {
  private queue: Promise<unknown> = Promise.resolve();
  private lastRunAt = 0;

  constructor(private minIntervalMs = 1100) {}

  run<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(async () => {
      const wait = Math.max(0, this.minIntervalMs - (Date.now() - this.lastRunAt));
      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
      this.lastRunAt = Date.now();
      return task();
    });

    // Zincirin bir sonraki görevi bekletmemesi için hatayı burada yutuyoruz;
    // gerçek hata `result` promise'i üzerinden çağırana ulaşır.
    this.queue = result.catch(() => undefined);
    return result;
  }
}
