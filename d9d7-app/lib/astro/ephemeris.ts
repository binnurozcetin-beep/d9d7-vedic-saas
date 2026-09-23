import { Constants, load } from '@fusionstrings/swisseph-wasi';
import { PLANET_IDS, RASI_NAMES_TR, RASI_NAMES_SANSKRIT, type PlanetName } from './constants';

type SwissEphEngine = Awaited<ReturnType<typeof load>>;

let enginePromise: Promise<SwissEphEngine> | null = null;
let sidModeConfigured = false;

/**
 * Motoru yalnızca bir kez yükler ve Lahiri (Chitrapaksha) ayanamsha'yı
 * ayarlar. Lahiri, Hindistan hükümetinin resmi Vedik astroloji standardı
 * ve en yaygın kullanılan sistemdir.
 */
async function getEngine(): Promise<SwissEphEngine> {
  if (!enginePromise) {
    enginePromise = load();
  }
  const eph = await enginePromise;
  if (!sidModeConfigured) {
    eph.swe_set_sid_mode(Constants.SE_SIDM_LAHIRI, 0, 0);
    sidModeConfigured = true;
  }
  return eph;
}

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
 * boylamlarını hesaplar. SEFLG_SIDEREAL bayrağı, tropikal boylamdan
 * Lahiri ayanamsha'sının doğrudan motor tarafından çıkarılmasını sağlar.
 */
export async function getPlanetPositions(julianDayUT: number): Promise<PlanetPosition[]> {
  const eph = await getEngine();
  const flags = Constants.SEFLG_SIDEREAL | Constants.SEFLG_SPEED;

  const results: PlanetPosition[] = [];

  for (const [name, id] of Object.entries(PLANET_IDS) as [PlanetName, number][]) {
    const { xx, error } = eph.swe_calc_ut(julianDayUT, id, flags);
    if (error) {
      throw new Error(`${name} pozisyonu hesaplanamadı: ${error}`);
    }
    const longitude = xx[0];
    const speedLongitude = xx[3];
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
 * Lagna'yı (yükselen burç) hesaplar. Ev sistemi hesaplaması genelde
 * tropikal döner; bu yüzden önce tropikal Ascendant alınır, ardından
 * aynı an için Lahiri ayanamsha'sı çıkarılarak sideral Lagna'ya çevrilir.
 * Bu yöntem, kullanılan WASM sarmalayıcısının swe_houses_ex'te sideral
 * bayrağı destekleyip desteklemediğinden bağımsız olarak her zaman doğru
 * sonucu verir.
 */
export async function getAscendant(
  julianDayUT: number,
  latitude: number,
  longitude: number
): Promise<AscendantPosition> {
  const eph = await getEngine();

  // 'W' = whole sign (tam burç) ev sistemi, Vedik astrolojide standart.
  // Lagna'nın kendisi ev sisteminden bağımsızdır; fonksiyon parametre olarak istiyor.
  const hsysWholeSign = 'W'.charCodeAt(0);
  const { ascmc, error } = eph.swe_houses(julianDayUT, latitude, longitude, hsysWholeSign);
  if (error) {
    throw new Error(`Lagna hesaplanamadı: ${error}`);
  }

  const tropicalAscendant = ascmc[0];
  const ayanamsha = eph.swe_get_ayanamsa_ut(julianDayUT);
  const siderealAscendant = ((tropicalAscendant - ayanamsha) % 360 + 360) % 360;

  return {
    longitude: siderealAscendant,
    ...longitudeToRasi(siderealAscendant),
  };
}
