import { RASI_NAMES_TR, RASI_NAMES_SANSKRIT } from './constants';
import type { D1Chart, D1PlanetPlacement } from './chart';

// ────────────────────────────────────────────────────────────────
// D9 (Navamsha) — evlilik ve hayat eşi uyumu
// BPHS kuralı: burcun doğasına göre başlangıç burcu değişir:
//  • Hareketli (chara) burçlar → kendisinden başlar
//  • Sabit (sthira) burçlar → kendisinden 9. burçtan başlar
//  • Çift doğalı (dwiswabhava) burçlar → kendisinden 5. burçtan başlar
// ────────────────────────────────────────────────────────────────

const CHARA_RASIS = new Set([0, 3, 6, 9]);   // Koç, Yengeç, Terazi, Oğlak
const STHIRA_RASIS = new Set([1, 4, 7, 10]); // Boğa, Aslan, Akrep, Kova
// Kalanlar (2, 5, 8, 11: İkizler, Başak, Yay, Balık) dwiswabhava'dır.

function d9StartSign(rasiIndex: number): number {
  if (CHARA_RASIS.has(rasiIndex)) return rasiIndex;
  if (STHIRA_RASIS.has(rasiIndex)) return (rasiIndex + 8) % 12;
  return (rasiIndex + 4) % 12;
}

export function calculateD9Sign(rasiIndex: number, degreeInRasi: number): number {
  const partSize = 30 / 9; // 3°20'
  const partIndex = Math.min(Math.floor(degreeInRasi / partSize), 8);
  return (d9StartSign(rasiIndex) + partIndex) % 12;
}

// ────────────────────────────────────────────────────────────────
// D7 (Saptamsha) — çocuklar ve soy
// BPHS kuralı: tek burçlar kendisinden, çift burçlar kendisinden
// 7. burçtan başlar.
// ────────────────────────────────────────────────────────────────

function d7StartSign(rasiIndex: number): number {
  const isOddSign = rasiIndex % 2 === 0; // rasiIndex 0 = Koç = 1. burç (tek)
  return isOddSign ? rasiIndex : (rasiIndex + 6) % 12;
}

export function calculateD7Sign(rasiIndex: number, degreeInRasi: number): number {
  const partSize = 30 / 7; // 4°17'8.57"
  const partIndex = Math.min(Math.floor(degreeInRasi / partSize), 6);
  return (d7StartSign(rasiIndex) + partIndex) % 12;
}

// ────────────────────────────────────────────────────────────────
// Genel varga chart oluşturucu (D9 ve D7 için ortak)
// ────────────────────────────────────────────────────────────────

export interface VargaSignInfo {
  rasiIndex: number;
  rasiNameTr: string;
  rasiNameSanskrit: string;
}

export interface VargaPlanetPlacement extends VargaSignInfo {
  planet: D1PlanetPlacement['planet'];
  house: number;
}

export interface VargaChart {
  ascendant: VargaSignInfo;
  planets: VargaPlanetPlacement[];
}

function toSignInfo(rasiIndex: number): VargaSignInfo {
  return {
    rasiIndex,
    rasiNameTr: RASI_NAMES_TR[rasiIndex],
    rasiNameSanskrit: RASI_NAMES_SANSKRIT[rasiIndex],
  };
}

function buildVargaChart(
  d1: D1Chart,
  signCalculator: (rasiIndex: number, degreeInRasi: number) => number
): VargaChart {
  const ascendantVargaIndex = signCalculator(d1.ascendant.rasiIndex, d1.ascendant.degreeInRasi);
  const ascendant = toSignInfo(ascendantVargaIndex);

  const planets: VargaPlanetPlacement[] = d1.planets.map((p) => {
    const vargaIndex = signCalculator(p.rasiIndex, p.degreeInRasi);
    return {
      planet: p.planet,
      ...toSignInfo(vargaIndex),
      // Whole sign ev sistemi: varga Lagna'sına göre hesaplanır.
      house: ((vargaIndex - ascendantVargaIndex + 12) % 12) + 1,
    };
  });

  return { ascendant, planets };
}

/** D9 (Navamsha): evlilik ve hayat eşi uyumu */
export function castD9Chart(d1: D1Chart): VargaChart {
  return buildVargaChart(d1, calculateD9Sign);
}

/** D7 (Saptamsha): çocuklar ve soy */
export function castD7Chart(d1: D1Chart): VargaChart {
  return buildVargaChart(d1, calculateD7Sign);
}