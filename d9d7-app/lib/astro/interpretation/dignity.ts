import type { PlanetName } from '../constants';
import type { D1PlanetPlacement } from '../chart';

export type PlanetDignity = 
  | 'exalted'        // Uchcha (Yücelimde - En güçlü)
  | 'moolatrikona'   // Kök güç alanında
  | 'own'            // Swakshetra (Kendi evinde)
  | 'debilitated'    // Neecha (Düşüşte - Zorlu/sınavlı)
  | 'neutral';       // Nötr/Diğer

// Yücelim ve Düşüş Burç İndeksleri (0 = Koç, 1 = Boğa, ..., 11 = Balık)
const EXALTATION_SIGNS: Record<string, number> = {
  Sun: 0,     // Koç
  Moon: 1,    // Boğa
  Mars: 9,    // Oğlak
  Mercury: 5, // Başak
  Jupiter: 3, // Yengeç
  Venus: 11,  // Balık
  Saturn: 6,  // Terazi
  Rahu: 1,    // Boğa (klasik ekolde Boğa/İkizler)
  Ketu: 7,    // Akrep (klasik ekolde Akrep/Yay)
};

const DEBILITATION_SIGNS: Record<string, number> = {
  Sun: 6,     // Terazi
  Moon: 7,    // Akrep
  Mars: 3,    // Yengeç
  Mercury: 11,// Balık
  Jupiter: 9, // Oğlak
  Venus: 5,   // Başak
  Saturn: 0,  // Koç
  Rahu: 7,    // Akrep
  Ketu: 1,    // Boğa
};

const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4],           // Aslan
  Moon: [3],          // Yengeç
  Mars: [0, 7],       // Koç, Akrep
  Mercury: [2, 5],    // İkizler, Başak
  Jupiter: [8, 11],   // Yay, Balık
  Venus: [1, 6],      // Boğa, Terazi
  Saturn: [9, 10],    // Oğlak, Kova
  Rahu: [10],         // Kova (yardımcı yönetici)
  Ketu: [7],          // Akrep (yardımcı yönetici)
};

export interface DignityResult {
  dignity: PlanetDignity;
  dignityLabelTr: string;
  isCombust: boolean; // Güneş'e çok yakın olup yanık mı?
  combustNote?: string;
  descriptionTr: string;
}

export function evaluateDignity(
  planet: PlanetName,
  rasiIndex: number,
  degreeInRasi: number,
  sunPlacement?: { rasiIndex: number; degreeInRasi: number }
): DignityResult {
  let dignity: PlanetDignity = 'neutral';
  let dignityLabelTr = 'Nötr / Normal';
  let descriptionTr = 'Gezegen olağan tesirlerini sergiler.';

  if (EXALTATION_SIGNS[planet] === rasiIndex) {
    dignity = 'exalted';
    dignityLabelTr = 'Yücelimde (Uchcha)';
    descriptionTr = 'Gezegen en yüksek kapasitesinde, saflığında ve etkinliğinde çalışır.';
  } else if (DEBILITATION_SIGNS[planet] === rasiIndex) {
    dignity = 'debilitated';
    dignityLabelTr = 'Düşüşte (Neecha)';
    descriptionTr = 'Gezegen enerjisini rahat ifade edemez, içsel mücadele ve çabayla olgunlaşır.';
  } else if (OWN_SIGNS[planet]?.includes(rasiIndex)) {
    dignity = 'own';
    dignityLabelTr = 'Kendi Evinde (Swakshetra)';
    descriptionTr = 'Gezegen kendi güvenceli alanındadır; konforlu ve koruyucudur.';
  }

  // Yanıklık (Combustion / Asta) Kontrolü (Güneş ile mesafe)
  let isCombust = false;
  let combustNote: string | undefined;

  if (sunPlacement && planet !== 'Sun' && planet !== 'Rahu' && planet !== 'Ketu') {
    const pTotalDeg = rasiIndex * 30 + degreeInRasi;
    const sTotalDeg = sunPlacement.rasiIndex * 30 + sunPlacement.degreeInRasi;
    let diff = Math.abs(pTotalDeg - sTotalDeg);
    if (diff > 180) diff = 360 - diff;

    // Vedik yanıklık orbları (yaklaşık 8° - 14°)
    const orbLimit = planet === 'Moon' ? 12 : planet === 'Mars' ? 17 : planet === 'Venus' ? 10 : planet === 'Jupiter' ? 11 : 14;
    if (diff <= orbLimit) {
      isCombust = true;
      combustNote = `Güneş ile ${diff.toFixed(1)}° mesafede olduğundan yanık (Asta) durumdadır. Dış dünyada görünürlüğü azalırken içsel arayışı derinleştirir.`;
    }
  }

  return { dignity, dignityLabelTr, isCombust, combustNote, descriptionTr };
}