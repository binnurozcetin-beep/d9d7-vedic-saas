import { getAscendant, getPlanetPositions } from './ephemeris';
import type { AscendantPosition, PlanetPosition } from './ephemeris';

export interface D1PlanetPlacement extends PlanetPosition {
  /** 1-12, whole sign (tam burç) ev sistemine göre */
  house: number;
}

export interface D1Chart {
  julianDayUT: number;
  ascendant: AscendantPosition;
  planets: D1PlanetPlacement[];
}

/**
 * D1 (Rasi / ana doğum haritası) oluşturur: Lagna ve tüm gezegenlerin
 * sideral pozisyonları + whole sign ev sistemine göre ev numaraları.
 * Bu çıktı, bir sonraki adımda D9/D7 varga hesaplamalarının girdisi olacak.
 */
export function castD1Chart(
  julianDayUT: number,
  latitude: number,
  longitude: number
): D1Chart {
  const ascendant = getAscendant(julianDayUT, latitude, longitude);
  const planets = getPlanetPositions(julianDayUT);

  const planetsWithHouses: D1PlanetPlacement[] = planets.map((p) => ({
    ...p,
    // Whole sign ev sistemi: gezegenin burcu ile Lagna'nın burcu
    // arasındaki fark (mod 12), ev numarasını verir.
    house: ((p.rasiIndex - ascendant.rasiIndex + 12) % 12) + 1,
  }));

  return { julianDayUT, ascendant, planets: planetsWithHouses };
}
