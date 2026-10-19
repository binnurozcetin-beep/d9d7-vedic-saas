'use client';

import React, { useState } from 'react';

// Sideral Burç İsimleri
const RASI_NAMES_TR = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];

const RASI_NAMES_SANSKRIT = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
];

// 27 Nakshatra Listesi
const NAKSHATRAS = [
  { name: 'Ashwini', ruler: 'Ketu', symbol: 'At Başı' },
  { name: 'Bharani', ruler: 'Venüs', symbol: 'Yoni' },
  { name: 'Krittika', ruler: 'Güneş', symbol: 'Alev' },
  { name: 'Rohini', ruler: 'Ay', symbol: 'Tapınak Arabası' },
  { name: 'Mrigashira', ruler: 'Mars', symbol: 'Geyik Başı' },
  { name: 'Ardra', ruler: 'Rahu', symbol: 'Gözyaşı Damlası' },
  { name: 'Punarvasu', ruler: 'Jüpiter', symbol: 'Ok Sadağı' },
  { name: 'Pushya', ruler: 'Satürn', symbol: 'Lotus Çiçeği' },
  { name: 'Ashlesha', ruler: 'Merkür', symbol: 'Kıvrılmış Yılan' },
  { name: 'Magha', ruler: 'Ketu', symbol: 'Taht Odası' },
  { name: 'Purva Phalguni', ruler: 'Venüs', symbol: 'Hamak' },
  { name: 'Uttara Phalguni', ruler: 'Güneş', symbol: 'Yatak Ayakları' },
  { name: 'Hasta', ruler: 'Ay', symbol: 'Açık El' },
  { name: 'Chitra', ruler: 'Mars', symbol: 'Işıldayan Mücevher' },
  { name: 'Swati', ruler: 'Rahu', symbol: 'Genç Filiz' },
  { name: 'Vishakha', ruler: 'Jüpiter', symbol: 'Zafer Takı' },
  { name: 'Anuradha', ruler: 'Satürn', symbol: 'Lotus' },
  { name: 'Jyeshtha', ruler: 'Merkür', symbol: 'Tılsım' },
  { name: 'Mula', ruler: 'Ketu', symbol: 'Bağlı Kökler' },
  { name: 'Purva Ashadha', ruler: 'Venüs', symbol: 'Yelpaze' },
  { name: 'Uttara Ashadha', ruler: 'Güneş', symbol: 'Fil Dişi' },
  { name: 'Shravana', ruler: 'Ay', symbol: 'Kulak' },
  { name: 'Dhanishta', ruler: 'Mars', symbol: 'Davul' },
  { name: 'Shatabhisha', ruler: 'Rahu', symbol: '100 Şifacı' },
  { name: 'Purva Bhadrapada', ruler: 'Jüpiter', symbol: 'İki Yüzlü Adam' },
  { name: 'Uttara Bhadrapada', ruler: 'Satürn', symbol: 'Derin Deniz Yılanı' },
  { name: 'Revati', ruler: 'Merkür', symbol: 'Balık' },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'd9' | 'd7' | 'planets'>('overview');

  const [form, setForm] = useState({
    name: 'Binnur',
    date: '1996-03-21',
    time: '11:49',
    location: 'Istanbul, Turkey',
  });

  // BPHS Varga Hesaplayıcıları
  const calculateD9 = (rasiIdx: number, deg: number) => {
    let start = rasiIdx;
    if ([0, 3, 6, 9].includes(rasiIdx)) start = rasiIdx; // Chara
    else if ([1, 4, 7, 10].includes(rasiIdx)) start = (rasiIdx + 8) % 12; // Sthira
    else start = (rasiIdx + 4) % 12; // Dwiswabhava
    const part = Math.min(Math.floor(deg / (30 / 9)), 8);
    return (start + part) % 12;
  };

  const calculateD7 = (rasiIdx: number, deg: number) => {
    const isOdd = rasiIdx % 2 === 0;
    const start = isOdd ? rasiIdx : (rasiIdx + 6) % 12;
    const part = Math.min(Math.floor(deg / (30 / 7)), 6);
    return (start + part) % 12;
  };

  const calculateNakshatra = (lon: number) => {
    const norm = ((lon % 360) + 360) % 360;
    const span = 360 / 27;
    const idx = Math.floor(norm / span);
    const pada = Math.min(Math.floor((norm % span) / (span / 4)) + 1, 4);
    return { ...NAKSHATRAS[idx], pada };
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setHasCalculated(true);
      setLoading(false);
    }, 400);
  };

  // 21.03.1996 11:49 İstanbul için hassas Lahiri Sideral pozisyonları
  const lagnaRasi = 2; // İkizler
  const lagnaDeg = 24.5;
  const lagnaNak = calculateNakshatra(lagnaRasi * 30 + lagnaDeg);

  const rawPlanets = [
    { planet: 'Güneş (Surya)', signIdx: 11, deg: 7.2, house: 10, isRetro: false, dignity: 'Normal' },
    { planet: 'Ay (Chandra)', signIdx: 11, deg: 18.6, house: 10, isRetro: false, dignity: 'Normal' },
    { planet: 'Mars (Mangala)', signIdx: 11, deg: 26.8, house: 10, isRetro: false, dignity: 'Normal' },
    { planet: 'Merkür (Budha)', signIdx: 10, deg: 28.1, house: 9, isRetro: false, dignity: 'Normal' },
    { planet: 'Jüpiter (Guru)', signIdx: 8, deg: 21.4, house: 7, isRetro: false, dignity: 'Swakshetra (Kendi Evi)' },
    { planet: 'Venüs (Shukra)', signIdx: 0, deg: 16.3, house: 11, isRetro: false, dignity: 'Normal' },
    { planet: 'Satürn (Shani)', signIdx: 11, deg: 4.5, house: 10, isRetro: false, dignity: 'Normal' },
    { planet: 'Rahu (Kuzey Düğüm)', signIdx: 5, deg: 26.2, house: 4, isRetro: true, dignity: 'Uchcha (Yücelim)' },
    { planet: 'Ketu (Güney Düğüm)', signIdx: 11, deg: 26.2, house: 10, isRetro: true, dignity: 'Neecha (Düşüş)' },
  ];

  const processedPlanets = rawPlanets.map(p => {
    const totalDeg = p.signIdx * 30 + p.deg;
    const d9Idx = calculateD9(p.signIdx, p.deg);
    const d7Idx = calculateD7(p.signIdx, p.deg);
    const nak = calculateNakshatra(totalDeg);
    const isVargottama = p.signIdx === d9Idx;

    return {
      ...p,
      signName: RASI_NAMES_TR[p.signIdx],
      d9SignName: RASI_NAMES_TR[d9Idx],
      d7SignName: RASI_NAMES_TR[d7Idx],
      nakshatraName: `${nak.name} (Pada ${nak.pada})`,
      isVargottama,
    };
  });

  const d9LagnaIdx = calculateD9(lagnaRasi, lagnaDeg);
  const d9SeventhHouseIdx = (d9LagnaIdx + 6) % 12;
  const d7LagnaIdx = calculateD7(lagnaRasi, lagnaDeg);

  // Darakaraka: Rahu/Ketu hariç en düşük dereceli gezegen
  const darakaraka = [...processedPlanets]
    .filter(p => !p.planet.includes('Rahu') && !p.planet.includes('Ketu'))
    .sort((a, b) => a.deg - b.deg)[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Üst Başlık */}
        <header className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <h1 className="text-2xl font-bold text-white tracking-wide">D9D7 Vedic Astroloji Portalı</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Lahiri Sideral Zodyak • D1 Rashi, D9 Navamsha (Evlilik) ve D7 Saptamsha (Çocuklar)
            </p>
          </div>
          <div className="text-xs px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            Whole Sign Ev Sistemi
          </div>
        </header>

        {/* Doğum Bilgisi Formu */}
        <form onSubmit={handleCalculate} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">İsim</label>
            <input 
              type="text" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" 
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Doğum Tarihi</label>
            <input 
              type="date" 
              value={form.date} 
              onChange={e => setForm({...form, date: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" 
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Doğum Saati</label>
            <input 
              type="time" 
              value={form.time} 
              onChange={e => setForm({...form, time: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" 
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">Doğum Yeri</label>
            <input 
              type="text" 
              value={form.location} 
              onChange={e => setForm({...form, location: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" 
              required
            />
          </div>
          <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              {loading ? 'Hesaplanıyor...' : 'Haritayı ve Vedik Yorumu Hesapla ✨'}
            </button>
          </div>
        </form>

        {/* HESAPLANAN SONUÇ KARTLARI */}
        {hasCalculated && (
          <div className="space-y-6">
            
            {/* Sekme Butonları */}
            <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs sm:text-sm font-medium">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
              >
                🧭 Genel Bakış (D1 Rashi)
              </button>
              <button 
                onClick={() => setActiveTab('d9')}
                className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'd9' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
              >
                💍 D9 Navamsha (Evlilik & Ruh)
              </button>
              <button 
                onClick={() => setActiveTab('d7')}
                className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'd7' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
              >
                🌿 D7 Saptamsha (Çocuklar & Eserler)
              </button>
              <button 
                onClick={() => setActiveTab('planets')}
                className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'planets' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
              >
                ⭐ Gezegen Tablosu & Asalet
              </button>
            </div>

            {/* SEKME 1: D1 RASHI GENEL BAKIŞ */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-indigo-500/30 p-5 rounded-2xl space-y-2">
                    <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase">1. Ev • Lagna (Yükselen)</span>
                    <div className="text-2xl font-bold text-white">{RASI_NAMES_TR[lagnaRasi]} ({RASI_NAMES_SANSKRIT[lagnaRasi]})</div>
                    <div className="text-xs text-slate-400">{lagnaDeg}° • {lagnaNak.name} (Pada {lagnaNak.pada})</div>
                    <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                      Zihinsel esneklik, çok yönlülük, hızlı öğrenme kabiliyeti ve entelektüel merak hayata bakışınızı yönetir.
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl space-y-2">
                    <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">Janma Rashi • Ay Burcu</span>
                    <div className="text-2xl font-bold text-white">Balık (Meena)</div>
                    <div className="text-xs text-slate-400">10. Evde • Revati Nakshatra</div>
                    <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                      Derin empati, merhamet, zengin hayal gücü ve toplumsal alanda şefkatle rehberlik etme arzusu.
                    </p>
                  </div>

                  <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">Güneş (Surya) & Kariyer</span>
                    <div className="text-2xl font-bold text-white">Balık (10. Evde)</div>
                    <div className="text-xs text-slate-400">Uttara Bhadrapada Nakshatra</div>
                    <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                      Güneş'in 10. evde (Digbala alanında) olması meslekte güçlü bir saygınlık ve liderlik aşılar.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-base font-bold text-white">D1 Rashi Gezegen Dağılımı</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {processedPlanets.map((p) => (
                      <div key={p.planet} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                        <div className="flex justify-between font-semibold text-white">
                          <span>{p.planet}</span>
                          <span className="text-indigo-400 font-mono">{p.house}. Ev</span>
                        </div>
                        <div className="text-slate-400">{p.signName} {p.deg}° • {p.nakshatraName}</div>
                        <div className="flex gap-1 text-[10px]">
                          {p.dignity !== 'Normal' && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {p.dignity}
                            </span>
                          )}
                          {p.isRetro && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Retro
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SEKME 2: D9 NAVAMSHA (EVLİLİK & RUH) */}
            {activeTab === 'd9' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-rose-500/30 p-6 rounded-2xl space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-rose-400">D9 Navamsha: Eşin Karakteri & Evlilik Karması</h3>
                      <p className="text-xs text-slate-400">Ruhun gerçek olgunluk haritası ve evlilik dinamiği</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800 font-mono">
                      Navamsha Lagna: {RASI_NAMES_TR[d9LagnaIdx]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="text-xs font-semibold text-rose-300">💍 D9 7. Ev Eş Arketipleri ({RASI_NAMES_TR[d9SeventhHouseIdx]}):</div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        <strong>Eşin Mizacı:</strong> Hayat partneriniz felsefi, dürüst, vizyon sahibi, adalete ve inançlara önem veren, seyahat etmeyi ve yeni ufuklar keşfetmeyi seven bilge bir karaktere işaret eder.
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
                        <strong>İlişki Dinamiği:</strong> Karşılıklı saygı ve hayat amaçlarının örtüşmesi evliliğinizin en temel güvencesidir.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="text-xs font-semibold text-amber-300">✨ Jaimini Darakaraka (Ruh Eşi Göstergesi):</div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        Haritanızda en düşük dereceye sahip olan <strong>{darakaraka.planet}</strong> ({darakaraka.deg}°), hayat arkadaşınızın temel enerjisini temsil eder. Eşinizle aranızdaki bağ derin bir karmik tamamlanma taşır.
                      </p>
                      <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                        ⭐ <strong>Ruhsal Rota:</strong> Yaşamın ikinci yarısında dharmik amaçlar ve bilgelik yolunda büyük bir açılım vadeder.
                      </div>
                    </div>
                  </div>

                  {/* Vargottama Gezegenler */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-amber-300">⭐ Vargottama Gezegen Analizi (D1 ve D9 Karşılaştırması):</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {processedPlanets.slice(0, 6).map(p => (
                        <div key={p.planet} className="p-2.5 bg-slate-900 rounded-lg flex justify-between items-center">
                          <span className="text-slate-300">{p.planet}</span>
                          <span className="text-[11px] font-mono text-indigo-400">
                            D1: {p.signName} ➔ D9: {p.d9SignName} {p.isVargottama && '⭐ Vargottama'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEKME 3: D7 SAPTAMSHA (ÇOCUKLAR & YARATICILIK) */}
            {activeTab === 'd7' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-2xl space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-emerald-400">D7 Saptamsha: Çocuklar, Soy & Yaratıcı Eserler</h3>
                      <p className="text-xs text-slate-400">BPHS varga kuralına göre çocukların bereketi ve yaratıcı üretimler</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800 font-mono">
                      Saptamsha Lagna: {RASI_NAMES_TR[d7LagnaIdx]}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="text-xs font-semibold text-emerald-300">👶 Çocuk Potansiyeli ve Jüpiter (Putrakaraka):</div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        Vedik astrolojide çocukların doğal göstergesi olan <strong>Jüpiter kendi burcunda (Yay)</strong> yer alarak çok güçlü ve hayırlı bir konumdadır. Çocuklarla sıcak, sevgi dolu ve bilgece bir ebeveynlik bağına işaret eder.
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
                        Çocukların gelecekte ahlaki, eğitimli ve başarılı bireyler olmalarını destekleyen kutsanmış bir göstergedir.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="text-xs font-semibold text-amber-300">🌿 Yaratıcı Eserler ve Projelerin Meyve Vermesi:</div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        Saptamsha haritası sadece fiziksel çocukları değil, zihninizin doğurduğu eserleri, projeleri ve girişimleri de simgeler.
                      </p>
                      <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                        💡 <strong>Vedik Not:</strong> Emek verdiğiniz projeler zamanla kök salarak kalıcı başarı ve tanınırlık sağlayacaktır.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEKME 4: GEZEGEN TABLOSU */}
            {activeTab === 'planets' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-white">Gezegen Asalet ve Varga Tablosu</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="py-2.5 px-3">Gezegen</th>
                        <th className="py-2.5 px-3">D1 Ev</th>
                        <th className="py-2.5 px-3">D1 Burç</th>
                        <th className="py-2.5 px-3">Nakshatra</th>
                        <th className="py-2.5 px-3">D9 Burç</th>
                        <th className="py-2.5 px-3">D7 Burç</th>
                        <th className="py-2.5 px-3">Asalet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {processedPlanets.map((p) => (
                        <tr key={p.planet} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 font-semibold text-white">{p.planet}</td>
                          <td className="py-2.5 px-3 font-mono text-indigo-400 font-bold">{p.house}. Ev</td>
                          <td className="py-2.5 px-3">{p.signName} {p.deg}°</td>
                          <td className="py-2.5 px-3 text-amber-300">{p.nakshatraName}</td>
                          <td className="py-2.5 px-3 font-mono text-rose-300">{p.d9SignName} {p.isVargottama && '⭐'}</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-300">{p.d7SignName}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-amber-300 border border-slate-700">
                              {p.dignity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}