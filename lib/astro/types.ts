export interface BirthInput {
  name?: string;
  /** YYYY-MM-DD, kullanıcının girdiği yerel doğum tarihi */
  date: string;
  /** HH:mm (24 saat), kullanıcının girdiği yerel doğum saati */
  time: string;
  /** Serbest metin: "Istanbul, Turkey", "Mumbai, India" vb. */
  location: string;
}

export interface GeocodedLocation {
  latitude: number;
  longitude: number;
  displayName: string;
  countryCode?: string;
}

export interface TimeZoneResolution {
  ianaTimeZone: string;
  utcOffsetMinutes: number;
  /** Ofsetli yerel zaman, örn. 1990-04-15T14:30:00+03:00 */
  localDateTimeISO: string;
  /** UTC zaman, örn. 1990-04-15T11:30:00.000Z */
  utcDateTimeISO: string;
}

export interface ResolvedBirthMoment {
  input: BirthInput;
  location: GeocodedLocation;
  ianaTimeZone: string;
  utcOffsetMinutes: number;
  localDateTimeISO: string;
  utcDateTimeISO: string;
  /** Swiss Ephemeris'e (swe_calc_ut vb.) doğrudan verilecek Julian Day (UT) */
  julianDayUT: number;
}
