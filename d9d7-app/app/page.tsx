'use client';

import { useState } from 'react';

// ────────────────────────────────────────────────────────────────
// Sabitler
// ────────────────────────────────────────────────────────────────

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const RASI_NAMES_TR = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık',
];

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Rahu: '☊', Ketu: '☋',
};

const PLANET_NAMES_TR: Record<string, string> = {
  Sun: 'Güneş', Moon: 'Ay', Mercury: 'Merkür', Venus: 'Venüs', Mars: 'Mars',
  Jupiter: 'Jüpiter', Saturn: 'Satürn', Rahu: 'Rahu', Ketu: 'Ketu',
};

// Güney Hindistan stili chart'ta her burcun sabit hücre konumu (satır, sütun)
// — Lagna'nın burcu değişse de burçların yeri hiç değişmez, sadece hangi
// hücrenin "1. ev" olduğunu gösteren vurgu kayar. Merkezdeki 2x2 boşluk
// chart başlığı için ayrılır.
const GRID_POSITIONS: Record<number, [number, number]> = {
  11: [0, 0], 0: [0, 1], 1: [0, 2], 2: [0, 3],
  3: [1, 3], 4: [2, 3], 5: [3, 3], 6: [3, 2],
  7: [3, 1], 8: [3, 0], 9: [2, 0], 10: [1, 0],
};

// ────────────────────────────────────────────────────────────────
// Tipler
// ────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
}

interface ChartPlanet {
  planet: string;
  rasiIndex: number;
  rasiNameTr: string;
  house: number;
  isRetrograde?: boolean;
  degreeInRasi?: number;
}

interface ChartData {
  ascendant: { rasiIndex: number; rasiNameTr: string; degreeInRasi?: number };
  planets: ChartPlanet[];
}

interface ApiResponse {
  birthMoment: {
    location: { displayName: string };
    localDateTimeISO: string;
  };
  d1: ChartData;
  d9: ChartData;
  d7: ChartData;
}

type ChartKey = 'd1' | 'd9' | 'd7';

const CHART_LABELS: Record<ChartKey, { title: string; subtitle: string }> = {
  d1: { title: 'D1 — Rasi', subtitle: 'Ana doğum haritası' },
  d9: { title: 'D9 — Navamsha', subtitle: 'Evlilik ve hayat eşi uyumu' },
  d7: { title: 'D7 — Saptamsha', subtitle: 'Çocuklar ve soy' },
};

// ────────────────────────────────────────────────────────────────
// Chart bileşeni (Güney Hindistan stili)
// ────────────────────────────────────────────────────────────────

function VedicChart({ chart, label }: { chart: ChartData; label: string }) {
  const planetsByRasi = new Map<number, ChartPlanet[]>();
  for (const p of chart.planets) {
    const list = planetsByRasi.get(p.rasiIndex) ?? [];
    list.push(p);
    planetsByRasi.set(p.rasiIndex, list);
  }

  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-[2px] aspect-square w-full max-w-md mx-auto bg-[#3a2f5c]">
      {Array.from({ length: 12 }, (_, rasiIndex) => {
        const [row, col] = GRID_POSITIONS[rasiIndex];
        const isAscendant = rasiIndex === chart.ascendant.rasiIndex;
        const cellPlanets = planetsByRasi.get(rasiIndex) ?? [];
        return (
          <div
            key={rasiIndex}
            style={{ gridRow: row + 1, gridColumn: col + 1 }}
            className={`relative flex flex-col items-center justify-center p-1 text-center ${
              isAscendant ? 'bg-[#4a3a7a]' : 'bg-[#1c1533]'
            }`}
          >
            <div className="flex items-center gap-1 text-[#d4a24e]">
              <span className="text-base leading-none">{ZODIAC_SYMBOLS[rasiIndex]}</span>
              <span className="text-[9px] hidden sm:inline text-[#a89bc9]">
                {RASI_NAMES_TR[rasiIndex]}
              </span>
            </div>
            {isAscendant && (
              <span className="absolute top-0.5 left-0.5 text-[8px] tracking-wide text-[#d4a24e]">
                Lagna
              </span>
            )}
            <div className="flex flex-wrap justify-center gap-x-1 mt-1">
              {cellPlanets.map((p) => (
                <span key={p.planet} className="text-sm text-[#f3ead9] leading-tight">
                  {PLANET_SYMBOLS[p.planet] ?? p.planet.slice(0, 2)}
                  {p.isRetrograde && <sup className="text-[#c1543f]">R</sup>}
                </span>
              ))}
            </div>
          </div>
        );
      })}
      <div
        style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}
        className="flex items-center justify-center bg-[#140f28] px-2"
      >
        <span className="text-[#a89bc9] text-xs text-center leading-snug">{label}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Gezegen tablosu
// ────────────────────────────────────────────────────────────────

function PlanetTable({ chart, showDegree }: { chart: ChartData; showDegree: boolean }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-[#a89bc9] border-b border-[#3a2f5c]">
            <th className="py-2 pr-4 font-normal">Gezegen</th>
            <th className="py-2 pr-4 font-normal">Burç</th>
            {showDegree && <th className="py-2 pr-4 font-normal">Derece</th>}
            <th className="py-2 pr-4 font-normal">Ev</th>
          </tr>
        </thead>
        <tbody>
          {chart.planets.map((p) => (
            <tr key={p.planet} className="border-b border-[#2a2148]">
              <td className="py-2 pr-4 text-[#f3ead9]">
                <span className="mr-2">{PLANET_SYMBOLS[p.planet]}</span>
                {PLANET_NAMES_TR[p.planet] ?? p.planet}
                {p.isRetrograde && <span className="ml-1 text-[#c1543f] text-xs">(R)</span>}
              </td>
              <td className="py-2 pr-4 text-[#c9c2dc]">{p.rasiNameTr}</td>
              {showDegree && (
                <td className="py-2 pr-4 text-[#c9c2dc]">
                  {p.degreeInRasi !== undefined ? `${p.degreeInRasi.toFixed(2)}°` : '—'}
                </td>
              )}
              <td className="py-2 pr-4 text-[#c9c2dc]">{p.house}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Ana sayfa
// ────────────────────────────────────────────────────────────────

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthLocation: '',
  });
  const [activeChart, setActiveChart] = useState<ChartKey>('d1');
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/natal-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          date: formData.birthDate,
          time: formData.birthTime,
          location: formData.birthLocation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Chart hesaplanamadı.');
      }

      setResult(data);
      setActiveChart('d1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#140f28] to-[#1c1533] text-[#f3ead9]">
      {/* Header */}
      <header className="border-b border-[#3a2f5c]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl sm:text-4xl font-serif tracking-tight">D9/D7 Vedik Harita Okuyucu</h1>
          <p className="text-[#a89bc9] mt-2">Navamsha ve Saptamsha ile evlilik uyumu analizi</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-[#1c1533]/60 border border-[#3a2f5c] rounded-lg p-6 h-fit">
            <h2 className="text-xl font-serif mb-6">Doğum Bilgilerini Gir</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#a89bc9] mb-2">İsim</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınız"
                  className="w-full bg-[#140f28] border border-[#3a2f5c] rounded px-3 py-2 text-[#f3ead9] placeholder-[#5c5480] focus:outline-none focus:border-[#d4a24e]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#a89bc9] mb-2">Doğum Tarihi</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full bg-[#140f28] border border-[#3a2f5c] rounded px-3 py-2 text-[#f3ead9] focus:outline-none focus:border-[#d4a24e]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#a89bc9] mb-2">Doğum Saati</label>
                <input
                  type="time"
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleChange}
                  className="w-full bg-[#140f28] border border-[#3a2f5c] rounded px-3 py-2 text-[#f3ead9] focus:outline-none focus:border-[#d4a24e]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#a89bc9] mb-2">Doğum Yeri</label>
                <input
                  type="text"
                  name="birthLocation"
                  value={formData.birthLocation}
                  onChange={handleChange}
                  placeholder="Şehir, Ülke"
                  className="w-full bg-[#140f28] border border-[#3a2f5c] rounded px-3 py-2 text-[#f3ead9] placeholder-[#5c5480] focus:outline-none focus:border-[#d4a24e]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d4a24e] hover:bg-[#c4923e] disabled:opacity-50 disabled:cursor-not-allowed text-[#140f28] font-medium py-2 rounded mt-6 transition"
              >
                {loading ? 'Hesaplanıyor...' : 'D9/D7 Chart Oluştur'}
              </button>

              {error && (
                <p className="text-[#c1543f] text-sm pt-2">{error}</p>
              )}
            </form>
          </div>

          {/* Sonuç veya bilgi kutusu */}
          <div className="bg-[#1c1533]/60 border border-[#3a2f5c] rounded-lg p-6">
            {!result && !loading && (
              <>
                <h2 className="text-xl font-serif mb-4">D9/D7 Chart Nedir</h2>
                <p className="text-[#c9c2dc] mb-4 text-sm leading-relaxed">
                  Doğum bilgilerini girerek anlık D9 (Navamsha) ve D7 (Saptamsha)
                  chart okumaları alabilirsin — evlilik uyumu ve soy analizi için.
                </p>
                <div className="space-y-3 text-sm text-[#c9c2dc]">
                  <p><span className="text-[#d4a24e]">D9 Chart:</span> Evlilik beklentilerini ve hayat eşi uyumunu gösterir</p>
                  <p><span className="text-[#d4a24e]">D7 Chart:</span> Çocuklar ve soy hattını işaret eder</p>
                  <p><span className="text-[#d4a24e]">Lahiri Ayanamsha</span> ile hesaplanır, whole sign ev sistemi kullanılır</p>
                </div>
              </>
            )}

            {loading && (
              <div className="flex items-center justify-center h-full min-h-[200px] text-[#a89bc9]">
                Gezegen konumları hesaplanıyor...
              </div>
            )}

            {result && (
              <>
                <div className="flex gap-2 mb-6">
                  {(Object.keys(CHART_LABELS) as ChartKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveChart(key)}
                      className={`px-3 py-1.5 rounded text-sm transition ${
                        activeChart === key
                          ? 'bg-[#d4a24e] text-[#140f28]'
                          : 'bg-[#140f28] text-[#a89bc9] hover:text-[#f3ead9]'
                      }`}
                    >
                      {CHART_LABELS[key].title}
                    </button>
                  ))}
                </div>

                <p className="text-[#a89bc9] text-sm mb-1">
                  {result.birthMoment.location.displayName}
                </p>
                <p className="text-[#c9c2dc] text-xs mb-6">
                  {CHART_LABELS[activeChart].subtitle}
                </p>

                <VedicChart chart={result[activeChart]} label={CHART_LABELS[activeChart].title} />

                <PlanetTable chart={result[activeChart]} showDegree={activeChart === 'd1'} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
