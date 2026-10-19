/**
 * Kullanıcıya olduğu gibi gösterilebilecek (güvenli) hatalar için.
 *
 * Bunun dışındaki her hata (ör. eksik API anahtarı, ephemeris hatası)
 * sunucuda loglanır, kullanıcıya ise genel bir mesaj döner. Böylece iç
 * ayrıntılar dışarı sızmaz.
 */
export class UserFacingError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400
  ) {
    super(message);
    this.name = 'UserFacingError';
  }
}
