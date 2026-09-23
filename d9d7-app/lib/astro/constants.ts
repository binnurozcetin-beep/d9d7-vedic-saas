import * as sweph from 'sweph';

export const RASI_NAMES_TR = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık',
] as const;

export const RASI_NAMES_SANSKRIT = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
] as const;

export const PLANET_IDS = {
  Sun: sweph.constants.SE_SUN,
  Moon: sweph.constants.SE_MOON,
  Mercury: sweph.constants.SE_MERCURY,
  Venus: sweph.constants.SE_VENUS,
  Mars: sweph.constants.SE_MARS,
  Jupiter: sweph.constants.SE_JUPITER,
  Saturn: sweph.constants.SE_SATURN,
  // Rahu için ortalama düğüm (Mean Node) kullanılıyor — BPHS ve klasik
  // Vimshottari dasha hesaplamalarının standart referansı budur.
  // Gerçek düğüm (sweph.constants.SE_TRUE_NODE) isteğe bağlı bir
  // alternatiftir, bazı modern okullar bunu tercih eder.
  Rahu: sweph.constants.SE_MEAN_NODE,
} as const;

export type KnownPlanetName = keyof typeof PLANET_IDS;
export type PlanetName = KnownPlanetName | 'Ketu';
