import type { D1Chart } from '../chart';
import type { VargaChart } from '../varga';

export interface D7AnalysisResult {
  saptamshaAscendantSummary: {
    sign: string;
    creativityThemeTr: string;
  };
  childrenKarmaSummary: {
    fifthHouseD1Sign: string;
    fifthHouseD7Sign: string;
    jupiterConditionTr: string;
    progenyPotentialTr: string;
  };
  fruitfulnessNoteTr: string;
}

export function analyzeD7Saptamsha(d1: D1Chart, d7: VargaChart): D7AnalysisResult {
  const d7Asc = d7.ascendant;
  
  // D1'de 5. ev (Doğrudan çocuklar ve yaratıcı üretim evi)
  const fifthHouseIndexD1 = (d1.ascendant.rasiIndex + 4) % 12;
  const fifthHouseSignD1 = d1.planets.find(p => p.house === 5)?.rasiNameTr || 'Belirlenen burç';

  // D7'de 5. ev
  const fifthHouseIndexD7 = (d7Asc.rasiIndex + 4) % 12;
  const signNames = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
  const fifthHouseSignD7 = signNames[fifthHouseIndexD7];

  // Jüpiter (Putrakaraka - Çocukların doğal genel karakası)
  const jupiterD1 = d1.planets.find(p => p.planet === 'Jupiter');
  const jupiterD7 = d7.planets.find(p => p.planet === 'Jupiter');

  let jupiterNote = 'Jüpiter haritada dengeli bir konumdadır.';
  if (jupiterD7) {
    if ([1, 4, 7, 10, 5, 9].includes(jupiterD7.house)) {
      jupiterNote = `Jüpiter D7 haritasında hayırlı bir evde (${jupiterD7.house}. evde, ${jupiterD7.rasiNameTr} burcunda) yer alarak çocuklarla sağlıklı bağlar, bereket ve yaratıcı üretimde verimlilik vadeder.`;
    } else {
      jupiterNote = `Jüpiter D7 haritasında ${jupiterD7.house}. evde yer alıyor; çocuk yetiştirirken veya yaratıcı projelere başlarken sabır ve özveri gerektiren süreçlere işaret eder.`;
    }
  }

  return {
    saptamshaAscendantSummary: {
      sign: d7Asc.rasiNameTr,
      creativityThemeTr: `D7 yükselenin ${d7Asc.rasiNameTr} olması, kişinin zihinsel tohumlarını ve projelerini somut birer esere dönüştürme tarzını belirler.`,
    },
    childrenKarmaSummary: {
      fifthHouseD1Sign: fifthHouseSignD1,
      fifthHouseD7Sign: fifthHouseSignD7,
      jupiterConditionTr: jupiterNote,
      progenyPotentialTr: `5. evin D1 ve D7 üzerindeki etkileşimi, hem soyun devamı hem de kişinin dünyaya bıraktığı manevi ve zihinsel eserlerin gücünü gösterir.`,
    },
    fruitfulnessNoteTr: 'Saptamsha haritası sadece fiziksel çocukları değil, kişinin hayatı boyunca ortaya koyduğu en kıymetli fikir ve projelerin nasıl meyve vereceğini gösterir.',
  };
}