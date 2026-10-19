import type { D1Chart } from '../chart';
import type { VargaChart } from '../varga';
import { evaluateDignity } from './dignity';
import { calculateNakshatra } from './nakshatras';
import { analyzeD9Navamsha, type D9AnalysisResult } from './d9Interpretation';
import { analyzeD7Saptamsha, type D7AnalysisResult } from './d7Interpretation';

export interface CompleteVedicInterpretation {
  d1Overview: {
    ascendantSign: string;
    ascendantNakshatra: string;
    moonSign: string;
    moonNakshatra: string;
    planetsSummary: Array<{
      planet: string;
      house: number;
      sign: string;
      dignity: string;
      nakshatra: string;
      isRetrograde: boolean;
      isCombust: boolean;
    }>;
  };
  d9NavamshaAnalysis: D9AnalysisResult;
  d7SaptamshaAnalysis: D7AnalysisResult;
}

export function generateVedicInterpretation(
  d1: D1Chart,
  d9: VargaChart,
  d7: VargaChart
): CompleteVedicInterpretation {
  const sun = d1.planets.find(p => p.planet === 'Sun');
  const moon = d1.planets.find(p => p.planet === 'Moon');

  const ascNak = calculateNakshatra(d1.ascendant.longitude);
  const moonNak = moon ? calculateNakshatra(moon.longitude) : undefined;

  const planetsSummary = d1.planets.map(p => {
    const dig = evaluateDignity(p.planet, p.rasiIndex, p.degreeInRasi, sun);
    const nak = calculateNakshatra(p.longitude);
    return {
      planet: p.planet,
      house: p.house,
      sign: p.rasiNameTr,
      dignity: dig.dignityLabelTr,
      nakshatra: `${nak.name} (Pada ${nak.pada})`,
      isRetrograde: p.isRetrograde,
      isCombust: dig.isCombust,
    };
  });

  return {
    d1Overview: {
      ascendantSign: d1.ascendant.rasiNameTr,
      ascendantNakshatra: `${ascNak.name} (Pada ${ascNak.pada})`,
      moonSign: moon ? moon.rasiNameTr : '',
      moonNakshatra: moonNak ? `${moonNak.name} (Pada ${moonNak.pada})` : '',
      planetsSummary,
    },
    d9NavamshaAnalysis: analyzeD9Navamsha(d1, d9),
    d7SaptamshaAnalysis: analyzeD7Saptamsha(d1, d7),
  };
}