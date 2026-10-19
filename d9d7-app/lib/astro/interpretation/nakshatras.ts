export interface NakshatraInfo {
  name: string;
  pada: number;
  ruler: string;
  deity: string;
  quality: string;
  symbol: string;
}

const NAKSHATRA_NAMES = [
  { name: 'Ashwini', ruler: 'Ketu', deity: 'Ashwini Kumaras', symbol: 'At Başı' },
  { name: 'Bharani', ruler: 'Venus', deity: 'Yama', symbol: 'Yoni' },
  { name: 'Krittika', ruler: 'Sun', deity: 'Agni', symbol: 'Ustura/Alev' },
  { name: 'Rohini', ruler: 'Moon', deity: 'Brahma', symbol: 'Araba/Tapınak' },
  { name: 'Mrigashira', ruler: 'Mars', deity: 'Soma', symbol: 'Geyik Başı' },
  { name: 'Ardra', ruler: 'Rahu', deity: 'Rudra', symbol: 'Gözyaşı' },
  { name: 'Punarvasu', ruler: 'Jupiter', deity: 'Aditi', symbol: 'Ok Kılıfı' },
  { name: 'Pushya', ruler: 'Saturn', deity: 'Brihaspati', symbol: 'Çiçek/İnek Memesi' },
  { name: 'Ashlesha', ruler: 'Mercury', deity: 'Sarpas', symbol: 'Kıvrılmış Yılan' },
  { name: 'Magha', ruler: 'Ketu', deity: 'Pitris (Atalar)', symbol: 'Taht Odası' },
  { name: 'Purva Phalguni', ruler: 'Venus', deity: 'Bhaga', symbol: 'Hamak/Yatak' },
  { name: 'Uttara Phalguni', ruler: 'Sun', deity: 'Aryaman', symbol: 'Yatak Ayakları' },
  { name: 'Hasta', ruler: 'Moon', deity: 'Savitur', symbol: 'Açık El' },
  { name: 'Chitra', ruler: 'Mars', deity: 'Tvashtar', symbol: 'Mücevher/İnci' },
  { name: 'Swati', ruler: 'Rahu', deity: 'Vayu', symbol: 'Genç Filiz' },
  { name: 'Vishakha', ruler: 'Jupiter', deity: 'Indra-Agni', symbol: 'Zafer Takı' },
  { name: 'Anuradha', ruler: 'Saturn', deity: 'Mitra', symbol: 'Lotus Çiçeği' },
  { name: 'Jyeshtha', ruler: 'Mercury', deity: 'Indra', symbol: 'Yuvarlak Tılsım' },
  { name: 'Mula', ruler: 'Ketu', deity: 'Nirriti', symbol: 'Bağlı Kökler' },
  { name: 'Purva Ashadha', ruler: 'Venus', deity: 'Apas (Sular)', symbol: 'Yelpaze' },
  { name: 'Uttara Ashadha', ruler: 'Sun', deity: 'Vishvadevas', symbol: 'Fil Dişi' },
  { name: 'Shravana', ruler: 'Moon', deity: 'Vishnu', symbol: 'Kulak' },
  { name: 'Dhanishta', ruler: 'Mars', deity: 'Ashta Vasus', symbol: 'Davul/Flüt' },
  { name: 'Shatabhisha', ruler: 'Rahu', deity: 'Varuna', symbol: '100 Hekim/Boş Çember' },
  { name: 'Purva Bhadrapada', ruler: 'Jupiter', deity: 'Aja Ekapada', symbol: 'İki Yüzlü Adam' },
  { name: 'Uttara Bhadrapada', ruler: 'Saturn', deity: 'Ahirbudhnya', symbol: 'Derin Deniz Yılanı' },
  { name: 'Revati', ruler: 'Mercury', deity: 'Pushan', symbol: 'Balık/Davul' },
];

export function calculateNakshatra(longitude: number): NakshatraInfo {
  const norm = ((longitude % 360) + 360) % 360;
  const nakshatraSpan = 360 / 27; // 13° 20' = 13.333333°
  const padaSpan = nakshatraSpan / 4; // 3° 20' = 3.333333°

  const nakshatraIndex = Math.floor(norm / nakshatraSpan);
  const positionInNakshatra = norm - nakshatraIndex * nakshatraSpan;
  const pada = Math.min(Math.floor(positionInNakshatra / padaSpan) + 1, 4);

  const base = NAKSHATRA_NAMES[nakshatraIndex];
  return {
    name: base.name,
    pada,
    ruler: base.ruler,
    deity: base.deity,
    quality: `${base.ruler} yönetiminde, ${base.deity} himayesinde`,
    symbol: base.symbol,
  };
}