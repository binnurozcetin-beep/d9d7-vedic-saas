import { Constants } from '@fusionstrings/swisseph-wasi';

export const RASI_NAMES_TR = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık',
] as const;

export const RASI_NAMES_SANSKRIT = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
] as const;

export const PLANET_IDS = {
  Sun: Constants.SE_SUN,
  Moon: Constants.SE_MOON,
  Mercury: Constants.SE_MERCURY,
  Venus: Constants.SE_VENUS,
  Mars: Constants.SE_MARS,
  Jupiter: Constants.SE_JUPITER,
  Saturn: Constants.SE_SATURN,
  // Rahu için ortalama düğüm (Mean Node) kullanılıyor — BPHS ve klasik
  // Vimshottari dasha hesaplamalarının standart referansı budur.
  // Gerçek düğüm (Constants.SE_TRUE_NODE) isteğe bağlı bir alternatiftir,
  // bazı modern okullar bunu tercih eder.
  Rahu: Constants.SE_MEAN_NODE,
} as const;

export type KnownPlanetName = keyof typeof PLANET_IDS;
export type PlanetName = KnownPlanetName | 'Ketu';
