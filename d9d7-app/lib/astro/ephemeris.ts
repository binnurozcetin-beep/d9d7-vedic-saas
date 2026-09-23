import * as sweph from 'sweph';
import { PLANET_IDS, RASI_NAMES_TR, RASI_NAMES_SANSKRIT, type PlanetName } from './constants';

let sidModeConfigured = false;

/**
 * Lahiri (Chitrapaksha) ayanamsha'yı bir kez ayarlar. Lahiri, Hindistan
 * hükümetinin resmi Vedik astroloji standardı ve en yaygın kullanılan
 * sistemdir.
 */
function ensureSidModeConfigured() {
  if (sidModeConfigured) return;
  sweph.set_sid_mode(sweph.constants.SE_SIDM_LAHIRI, 0, 0);
  sidModeConfigured = true;
}

/**
 * Ephemeris dosyaları (.se1) henüz indirilip sunucuya eklenmediği için
 * Moshier yarı-analitik algoritmasını kullanıyoruz: dosya gerektirmez,
 * ~0.1 açı saniyesi hassasiyet sağlar (Vedik astroloji için fazlasıyla
 * yeterli — burç sınırları 30° aralıklı). İleride en yüksek hassasiyet
 * istenirse .se1 dosyaları indirilip set_ephe_path() ile tanımlanabilir
 * ve bu bayrak SEFLG_SWIEPH ile değiştirilebilir.
 */
const EPHEMERIS_FLAG = sweph.constants.SEFLG_MOSEPH;

function longitudeToRasi(longitude: number) {
  const normalized = ((longitude % 360) + 360) % 360;
  const rasiIndex = Math.floor(normalized / 30);
  const degreeInRasi = normalized - rasiIndex * 30;
  return {
    rasiIndex, // 0 = Koç ... 11 = Balık
    rasiNameTr: RASI_NAMES_TR[rasiIndex],
    rasiNameSanskrit: RASI_NAMES_SANSKRIT[rasiIndex],
    degreeInRasi,
  };
}

export interface PlanetPosition {
  planet: PlanetName;
  /** Sideral (Lahiri) boylam, 0-360 derece */
  longitude: number;
  /** Derece/gün cinsinden boylam hızı; negatifse retrograd */
  speedLongitude: number;
  isRetrograde: boolean;
  rasiIndex: number;
  rasiNameTr: string;
  rasiNameSanskrit: string;
  degreeInRasi: number;
}

/**
 * Tüm klasik gezegenlerin (Güneş'ten Satürn'e + Rahu/Ketu) sideral
 * boylamlarını hesaplar.
 */
export function getPlanetPositions(julianDayUT: number): PlanetPosition[] {
  ensureSidModeConfigured();
  const flags = EPHEMERIS_FLAG | sweph.constants.SEFLG_SIDEREAL | sweph.constants.SEFLG_SPEED;

  const results: PlanetPosition[] = [];

  for (const [name, id] of Object.entries(PLANET_IDS) as [PlanetName, number][]) {
    const result = sweph.calc_ut(julianDayUT, id, flags);
    if (result.flag === sweph.constants.ERR) {
      throw new Error(`${name} pozisyonu hesaplanamadı: ${result.error}`);
    }
    const [longitude, , , speedLongitude] = result.data;
    results.push({
      planet: name,
      longitude,
      speedLongitude,
      isRetrograde: speedLongitude < 0,
      ...longitudeToRasi(longitude),
    });
  }

  // Ketu, Rahu'nun tam 180° karşısıdır — ayrı bir astronomik hesap gerekmez.
  const rahu = results.find((p) => p.planet === 'Rahu')!;
  const ketuLongitude = (rahu.longitude + 180) % 360;
  results.push({
    planet: 'Ketu',
    longitude: ketuLongitude,
    speedLongitude: rahu.speedLongitude,
    isRetrograde: true, // Rahu/Ketu (gölge gezegenler) her zaman retrograd kabul edilir
    ...longitudeToRasi(ketuLongitude),
  });

  return results;
}

export interface AscendantPosition {
  longitude: number;
  rasiIndex: number;
  rasiNameTr: string;
  rasiNameSanskrit: string;
  degreeInRasi: number;
}

/**
 * Lagna'yı (yükselen burç) hesaplar. houses_ex tropikal Ascendant döner;
 * bu yüzden aynı an için Lahiri ayanamsha'sı çıkarılarak sideral Lagna'ya
 * çevriliyor. Bu yöntem, kullanılan sürümün sideral bayrağını houses_ex
 * içinde nasıl işlediğinden bağımsız olarak her zaman doğru sonucu verir.
 */
export function getAscendant(
  julianDayUT: number,
  latitude: number,
  longitude: number
): AscendantPosition {
  ensureSidModeConfigured();

  // 'W' = whole sign (tam burç) ev sistemi, Vedik astrolojide standart.
  const result = sweph.houses_ex(julianDayUT, EPHEMERIS_FLAG, latitude, longitude, 'W');
  if (result.flag === sweph.constants.ERR) {
    throw new Error(`Lagna hesaplanamadı: ${result.error}`);
  }

  const tropicalAscendant = result.data.points[0]; // asc
  const ayanamsha = sweph.get_ayanamsa_ut(julianDayUT);
  const siderealAscendant = ((tropicalAscendant - ayanamsha) % 360 + 360) % 360;

  return {
    longitude: siderealAscendant,
    ...longitudeToRasi(siderealAscendant),
  };
}
