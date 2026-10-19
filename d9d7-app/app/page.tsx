'use client';

import React, { useState } from 'react';

// Gezegen Türkçe İsimleri
const PLANET_NAMES_TR: Record<string, string> = {
  Sun: 'Güneş (Surya)',
  Moon: 'Ay (Chandra)',
  Mars: 'Mars (Mangala)',
  Mercury: 'Merkür (Budha)',
  Jupiter: 'Jüpiter (Guru)',
  Venus: 'Venüs (Shukra)',
  Saturn: 'Satürn (Shani)',
  Rahu: 'Rahu (Kuzey Düğüm)',
  Ketu: 'Ketu (Güney Düğüm)',
};

const RASI_NAMES_SANSKRIT = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
];

// 27 Nakshatra Listesi ve Sembolleri
const NAKSHATRAS = [
  { name: 'Ashwini', ruler: 'Ketu', deity: 'Ashwini Kumaras', symbol: 'At Başı' },
  { name: 'Bharani', ruler: 'Venüs', deity: 'Yama', symbol: 'Yoni' },
  { name: 'Krittika', ruler: 'Güneş', deity: 'Agni', symbol: 'Alev' },
  { name: 'Rohini', ruler: 'Ay', deity: 'Brahma', symbol: 'Araba' },
  { name: 'Mrigashira', ruler: 'Mars', deity: 'Soma', symbol: 'Geyik Başı' },
  { name: 'Ardra', ruler: 'Rahu', deity: 'Rudra', symbol: 'Gözyaşı' },
  { name: 'Punarvasu', ruler: 'Jüpiter', deity: 'Aditi', symbol: 'Ok Sadağı' },
  { name: 'Pushya', ruler: 'Satürn', deity: 'Brihaspati', symbol: 'Lotus Çiçeği' },
  { name: 'Ashlesha', ruler: 'Merkür', deity: 'Sarpas', symbol: 'Kıvrılmış Yılan' },
  { name: 'Magha', ruler: 'Ketu', deity: 'Pitris (Atalar)', symbol: 'Taht Odası' },
  { name: 'Purva Phalguni', ruler: 'Venüs', deity: 'Bhaga', symbol: 'Hamak' },
  { name: 'Uttara Phalguni', ruler: 'Güneş', deity: 'Aryaman', symbol: 'Yatak Ayakları' },
  { name: 'Hasta', ruler: 'Ay', deity: 'Savitur', symbol: 'Açık El' },
  { name: 'Chitra', ruler: 'Mars', deity: 'Tvashtar', symbol: 'Mücevher' },
  { name: 'Swati', ruler: 'Rahu', deity: 'Vayu', symbol: 'Genç Filiz' },
  { name: 'Vishakha', ruler: 'Jüpiter', deity: 'Indra-Agni', symbol: 'Zafer Takı' },
  { name: 'Anuradha', ruler: 'Satürn', deity: 'Mitra', symbol: 'Lotus' },
  { name: 'Jyeshtha', ruler: 'Merkür', deity: 'Indra', symbol: 'Tılsım' },
  { name: 'Mula', ruler: 'Ketu', deity: 'Nirriti', symbol: 'Kökler' },
  { name: 'Purva Ashadha', ruler: 'Venüs', deity: 'Apas', symbol: 'Yelpaze' },
  { name: 'Uttara Ashadha', ruler: 'Güneş', deity: 'Vishvadevas', symbol: 'Fil Dişi' },
  { name: 'Shravana', ruler: 'Ay', deity: 'Vishnu', symbol: 'Kulak' },
  { name: 'Dhanishta', ruler: 'Mars', deity: 'Ashta Vasus', symbol: 'Davul' },
  { name: 'Shatabhisha', ruler: 'Rahu', deity: 'Varuna', symbol: '100 Hekim' },
  { name: 'Purva Bhadrapada', ruler: 'Jüpiter', deity: 'Aja Ekapada', symbol: 'İki Yüzlü Adam' },
  { name: 'Uttara Bhadrapada', ruler: 'Satürn', deity: 'Ahirbudhnya', symbol: 'Derin Deniz Yılanı' },
  { name: 'Revati', ruler: 'Merkür', deity: 'Pushan', symbol: 'Balık' },
];

// 12 Lagna (Yükselen) Detaylı Yorum Bankası
const LAGNA_INTERPRETATIONS: Record<string, { summary: string; traits: string; lifeLesson: string }> = {
  'Koç': {
    summary: 'Öncü ateş enerjisi; bağımsız, kararlı, inisiyatif alan ve dinamik mizaç.',
    traits: 'Hızlı harekete geçme kabiliyeti, korkusuzluk, liderlik içgüdüsü ve yenilik tutkusu.',
    lifeLesson: 'Sabrı öğrenmek ve enerjiyi tükenmeden uzun vadeli hedeflere kanalize etmek.',
  },
  'Boğa': {
    summary: 'Toprak elementi ve Venüs asaleti; güvenilirlik, estetik zarafet ve sebat.',
    traits: 'Maddi-manevi güvence kurma becerisi, sadakat, sanatsal incelik ve dingin kararlılık.',
    lifeLesson: 'Değişime ve yeniliklere direnmeden akışa güvenebilmek.',
  },
  'İkizler': {
    summary: 'Hava elementi ve Merkür kıvraklığı; hızlı zeka, yüksek merak ve iletişim gücü.',
    traits: 'Çok yönlülük, esprili konuşma yeteneği, bilgiyi hızla sentezleme ve sosyal adaptasyon.',
    lifeLesson: 'Zihinsel odaklanmayı korumak ve enerjiyi aynı anda çok fazla konuya bölmemek.',
  },
  'Yengeç': {
    summary: 'Su elementi ve Ay şefkati; derin sezgiler, koruyuculuk ve duygusal zenginlik.',
    traits: 'Yüksek empati, sevdiklerine kol kanat germe, güçlü hafıza ve yuva kurma yeteneği.',
    lifeLesson: 'Geçmişe ve duygusal iniş çıkışlara takılmadan içsel merkezi korumak.',
  },
  'Aslan': {
    summary: 'Ateş elementi ve Güneş görkemi; doğal karizma, cömertlik ve asalet.',
    traits: 'Yaratıcı özgüven, sıcak kalplilik, ilham veren liderlik ve sahne ışığı.',
    lifeLesson: 'Gurur ve onaylanma ihtiyacını aşarak kalpten gelen cömertlikle rehberlik etmek.',
  },
  'Başak': {
    summary: 'Toprak elementi ve analitik Merkür; detay ustalığı, hizmet bilinci ve titizlik.',
    traits: 'Problem çözme dehası, düzen kurma yeteneği, pratik zeka ve mütevazı yardımseverlik.',
    lifeLesson: 'Mükemmeliyetçilik kaygısını bırakıp hayatın kusurlu güzelliğini kabul etmek.',
  },
  'Terazi': {
    summary: 'Hava elementi ve Venüs uyumu; diplomasi, adalet, zarafet ve denge arayışı.',
    traits: 'İlişkilerde köprü kurma sanatı, estetik duyu, uzlaşmacılık ve adil muhakeme.',
    lifeLesson: 'Başkalarını memnun etme uğruna kendi sınırlarından ve kararlarından ödün vermemek.',
  },
  'Akrep': {
    summary: 'Su elementi ve Mars derinliği; okült kavrayış, tutku ve krizleri simyaya dönüştürme.',
    traits: 'Sarsılmaz irade, keskin sezgiler, gizemleri çözme yeteneği ve küllerinden doğma kudreti.',
    lifeLesson: 'Kontrolü bırakabilmek, affetmek ve kalbi korkusuzca teslim edebilmek.',
  },
  'Yay': {
    summary: 'Ateş elementi ve Jüpiter bereketi; dharma, yüksek felsefe, hakikat ve özgürlük.',
    traits: 'Geniş vizyon, iyimserlik, hakikat arayışı, seyahat ve bilgelik aşılayıcılığı.',
    lifeLesson: 'Büyük resme odaklanırken dünyevi ve pratik ayrıntıları ihmal etmemek.',
  },
  'Oğlak': {
    summary: 'Toprak elementi ve Satürn disiplini; sebat, stratejik akıl ve kalıcı başarı.',
    traits: 'Zamanla olgunlaşan kudret, sorumluluk bilinci, güvenilirlik ve yüksek dayanıklılık.',
    lifeLesson: 'Katılığı yumuşatmak, başarıyı sadece unvanlarda değil içsel huzurda da bulmak.',
  },
  'Kova': {
    summary: 'Hava elementi ve Satürn-Rahu vizyonu; özgünlük, evrensel kardeşlik ve yenilikçilik.',
    traits: 'Sıra dışı düşünce yapısı, hümanizm, teknolojik/bilimsel öngörü ve bireysel özgürlük.',
    lifeLesson: 'Kişisel duygusal bağları soğuk bir rasyonalizme feda etmeden yaşamak.',
  },
  'Balık': {
    summary: 'Su elementi ve Jüpiter merhameti; evrensel birlik bilinci, hayal gücü ve moksha.',
    traits: 'Sınırsız şefkat, mistik sezgiler, sanatsal ilham ve koşulsuz kabul etme yeteneği.',
    lifeLesson: 'Kurban psikolojisine kapılmadan sağlıklı dünyevi sınırlar çekebilmek.',
  },
};

// D9 7. Ev (Eş ve Evlilik) Detaylı Yorum Bankası
const D9_SPOUSE_INTERPRETATIONS: Record<string, { archetype: string; dynamic: string; career: string }> = {
  'Koç': {
    archetype: 'Dinamik, dürüst, cesur, inisiyatif alan ve doğrudan iletişim kuran bir eş.',
    dynamic: 'Evlilikte canlılık, tutku ve hareketlilik hakimdir; rekabet yerine takım ruhu geliştirilmelidir.',
    career: 'Girişimcilik, yöneticilik, mühendislik, spor veya liderlik gerektiren alanlar.',
  },
  'Boğa': {
    archetype: 'Sakin, güvenilir, estetiğe ve konfora önem veren, sabırlı ve sadık bir eş.',
    dynamic: 'Evlilik zamanla derinleşip sağlamlaşır; huzur, finansal istikrar ve yuva konforu ön plandadır.',
    career: 'Finans, sanat, tasarım, mimarlık, gastronomi veya gayrimenkul.',
  },
  'İkizler': {
    archetype: 'Konuşkan, esprili, genç ruhlu, meraklı, entelektüel ve arkadaş canlısı bir eş.',
    dynamic: 'Sürekli fikir alışverişi, ortak seyahatler ve zihinsel uyum evliliğin en büyük harcıdır.',
    career: 'Yazarlık, iletişim, medya, teknoloji, ticaret, eğitim veya danışmanlık.',
  },
  'Yengeç': {
    archetype: 'Anaç/babacan, koruyucu, duygusal açıdan duyarlı, yuva odaklı ve şefkatli bir eş.',
    dynamic: 'Duygusal güven ve karşılıklı aidiyet hissi evliliğe derin bir huzur ve bereket katar.',
    career: 'Psikoloji, sağlık, eğitim, sosyal hizmetler veya aile işletmeleri.',
  },
  'Aslan': {
    archetype: 'Karizmatik, saygın, gururlu, cömert, lider vasıflı ve dikkat çeken bir eş.',
    dynamic: 'Karşılıklı hayranlık ve saygı esastır; eşinizin başarılarını takdir etmek bağı çok güçlendirir.',
    career: 'Üst düzey yöneticilik, sahne/sanat, kamu yönetimi, siyaset veya yaratıcı direktörlük.',
  },
  'Başak': {
    archetype: 'Pratik, düzenli, çalışkan, analitik, detaylara hakim ve yardımsever bir eş.',
    dynamic: 'Günlük hayatı organize etme ve birbirinin hayatını kolaylaştırma üzerine kurulu sağlam bir ortaklık.',
    career: 'Tıp, veri analizi, mühendislik, muhasebe, araştırma veya kalite yönetimi.',
  },
  'Terazi': {
    archetype: 'Zarif, adil, estetik beğenisi yüksek, uzlaşmacı ve romantik bir hayat partneri.',
    dynamic: 'Eşitlik, zarafet ve diplomatik denge evliliğin temelidir; birlikte sosyalleşmekten keyif alınır.',
    career: 'Hukuk, diplomasi, halkla ilişkiler, moda, tasarım veya ortaklıklı işler.',
  },
  'Akrep': {
    archetype: 'Derin, gizemli, tutkulu, sezgileri çok keskin ve sarsılmaz bir sadakat arayan eş.',
    dynamic: 'Yüzeysel olmayan, iki ruhun birbirini dönüştürdüğü yoğun, tutkulu ve manyetik bir evlilik.',
    career: 'Finans/yatırım, cerrahi, psikiyatri, dedektiflik/güvenlik, kriz yönetimi veya okült/bilimsel araştırmalar.',
  },
  'Yay': {
    archetype: 'Vizyoner, felsefi, neşeli, inançlı, seyahat etmeyi seven ve rehberlik eden bir eş.',
    dynamic: 'Birlikte hayatı ve evreni keşfetmek bağı canlı tutar; eşiniz aynı zamanda manevi bir dosttur.',
    career: 'Akademi, uluslararası ticaret, yayıncılık, hukuk, turizm veya felsefi danışmanlık.',
  },
  'Oğlak': {
    archetype: 'Olgun, sorumluluk sahibi, gelenekçi, kariyer odaklı ve güven veren bir eş.',
    dynamic: 'Genç yaşlarda ciddiyet taşıyan ama yıllar geçtikçe sağlamlaşan, kalıcı ve saygın bir birliktelik.',
    career: 'Kurumsal yöneticilik, inşaat, finans, devlet kadroları veya köklü ticaret.',
  },
  'Kova': {
    archetype: 'Özgürlükçü, yenilikçi, entelektüel, sıra dışı ve hümanist bir yol arkadaşı.',
    dynamic: 'Kalıplara sığmayan, dostluk ve zihinsel özgürlük temelli, modern ve ilham verici bir evlilik.',
    career: 'Yazılım, havacılık, bilim, sivil toplum, inovasyon veya astroloji/sosyoloji.',
  },
  'Balık': {
    archetype: 'Duyarlı, merhametli, hayal gücü geniş, şefkatli ve manevi derinliği olan bir eş.',
    dynamic: 'Ruhsal birleşme ve karşılıklı özveri; eşiniz hayatınıza nezaket ve manevi huzur getirir.',
    career: 'Sanat, müzik, sinema, psikoloji, manevi rehberlik, denizcilik veya şifa sanatları.',
  },
};

// Jaimini Darakaraka (Ruh Eşi Gezegeni) Yorumları
const DARAKARAKA_INTERPRETATIONS: Record<string, string> = {
  Sun: 'Eşiniz asil, dürüst, güçlü bir benliğe sahip ve saygın bir otorite figürüdür. Evlilikte saygı ve onur ön plandadır.',
  Moon: 'Eşiniz şefkatli, anaç/babacan, sezgisel ve duygusal konularda derindir. Size huzurlu bir yuva hissi verir.',
  Mars: 'Eşiniz tutkulu, koruyucu, mücadeleci ve enerjiktir. İlişkide yüksek çekim ve dinamizm getirir.',
  Mercury: 'Eşiniz genç ruhlu, konuşkan, esprili, zeki ve çok yönlüdür. Evliliğiniz aynı zamanda bitmeyen bir sohbettir.',
  Jupiter: 'Eşiniz ahlaklı, bilge, cömert ve yol gösterici bir karakterdir. Hayatınıza bereket, şans ve manevi huzur katar.',
  Venus: 'Eşiniz son derece çekici, estetik zevkleri yüksek, romantik ve sanatsaldır. İlişkinizde aşk ve zarafet hakimdir.',
  Saturn: 'Eşiniz olgun, son derece sadık, güvenilir ve sorumluluk sahibidir. Evliliğiniz zamana meydan okur ve kalıcıdır.',
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'd9' | 'd7' | 'planets'>('overview');

  const [form, setForm] = useState({
    name: 'Binnur',
    date: '1996-03-21',
    time: '11:49',
    location: 'Istanbul, Turkey',
  });

  const calculateNakshatra = (lon: number) => {
    const norm = ((lon % 360) + 360) % 360;
    const span = 360 / 27;
    const idx = Math.floor(norm / span);
    const pada = Math.min(Math.floor((norm % span) / (span / 4)) + 1, 4);
    return { ...NAKSHATRAS[idx], pada };
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/natal-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Hesaplama başarısız oldu.');
      }
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'API ile iletişim kurulurken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Hesaplanan Canlı Harita Verileri
  const d1 = result?.d1;
  const d9 = result?.d9;
  const d7 = result?.d7;

  const ascD1 = d1?.ascendant;
  const ascNak = ascD1 ? calculateNakshatra(ascD1.longitude) : null;
  const lagnaInfo = ascD1 ? LAGNA_INTERPRETATIONS[ascD1.rasiNameTr] || LAGNA_INTERPRETATIONS['Koç'] : null;

  const moon = d1?.planets?.find((p: any) => p.planet === 'Moon');
  const moonNak = moon ? calculateNakshatra(moon.longitude) : null;
  const sun = d1?.planets?.find((p: any) => p.planet === 'Sun');
  const jupiter = d1?.planets?.find((p: any) => p.planet === 'Jupiter');

  // D9 7. Ev Burcu ve Eş Analizi
  const d9AscIdx = d9?.ascendant?.rasiIndex ?? 0;
  const d9SeventhSignIdx = (d9AscIdx + 6) % 12;
  const rasiNames = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
  const d9SeventhSignName = rasiNames[d9SeventhSignIdx];
  const spouseAnalysis = D9_SPOUSE_INTERPRETATIONS[d9SeventhSignName] || D9_SPOUSE_INTERPRETATIONS['Terazi'];

  // Jaimini Darakaraka
  const candidatePlanets = d1?.planets?.filter((p: any) => p.planet !== 'Rahu' && p.planet !== 'Ketu') || [];
  const darakaraka = candidatePlanets.length > 0 
    ? [...candidatePlanets].sort((a: any, b: any) => a.degreeInRasi - b.degreeInRasi)[0]
    : null;

  // D7 Analizi
  const d7AscName = d7?.ascendant?.rasiNameTr || 'Koç';

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
              Swiss Ephemeris • Lahiri Sideral Zodyak • D1 Rashi, D9 Navamsha (Evlilik) ve D7 Saptamsha (Çocuklar)
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
          <div className="sm:col-span-2 md:col-span-4 flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-2">
            {error && <span className="text-xs text-rose-400 font-medium">⚠️ {error}</span>}
            <div className="ml-auto">
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                {loading ? 'Swiss Ephemeris Hesaplanıyor...' : 'Haritayı ve Vedik Yorumu Hesapla ✨'}
              </button>
            </div>
          </div>
        </form>

        {/* CANLI HESAPLANAN GRAFİK VE KARTLAR */}
        {d1 && (
          <div className="space-y-6">
            
            {/* Sekmeler */}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Lagna */}
                  <div className="bg-slate-900 border border-indigo-500/30 p-5 rounded-2xl space-y-3">
                    <span className="text-[11px] font-mono text-indigo-400 font-semibold uppercase">1. Ev • Lagna (Yükselen)</span>
                    <div className="text-2xl font-bold text-white">{ascD1.rasiNameTr} ({RASI_NAMES_SANSKRIT[ascD1.rasiIndex]})</div>
                    <div className="text-xs text-slate-400">{ascD1.degreeInRasi.toFixed(1)}° • {ascNak?.name} (Pada {ascNak?.pada})</div>
                    <div className="text-xs text-slate-200 leading-relaxed pt-2 border-t border-slate-800/80">
                      <strong>Temel Mizaç:</strong> {lagnaInfo?.summary}
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed">
                      <strong>Güçlü Nitelikler:</strong> {lagnaInfo?.traits}
                    </div>
                    <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
                      🎯 <strong>Yaşam Dersi:</strong> {lagnaInfo?.lifeLesson}
                    </div>
                  </div>

                  {/* Ay Burcu */}
                  <div className="bg-slate-900 border border-amber-500/30 p-5 rounded-2xl space-y-3">
                    <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">Janma Rashi • Ay Burcu (Manas)</span>
                    <div className="text-2xl font-bold text-white">{moon?.rasiNameTr || 'Hesaplanıyor'} ({moon?.house}. Evde)</div>
                    <div className="text-xs text-slate-400">{moon ? `${moon.degreeInRasi.toFixed(1)}° • ${moonNak?.name} (Pada ${moonNak?.pada})` : ''}</div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                      Ay, bilinçaltınızı, zihinsel huzurunuzu ve sezgilerinizi yönetir. {moon?.rasiNameTr} burcunda ve {moon?.house}. evde yerleşimi, duygusal tatmininizi özellikle bu evin temsil ettiği temalar üzerinden aradığınızı gösterir.
                    </p>
                    <div className="p-2.5 bg-amber-950/40 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                      🌙 <strong>Nakshatra Etkisi:</strong> {moonNak?.name} takımyıldızı ve {moonNak?.ruler} yöneticiliği, zihninize kendine has bir ritim ve derin bir bilgelik aşılar.
                    </div>
                  </div>

                  {/* Güneş Burcu */}
                  <div className="bg-slate-900 border border-emerald-500/30 p-5 rounded-2xl space-y-3">
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">Surya • Güneş (Atman)</span>
                    <div className="text-2xl font-bold text-white">{sun?.rasiNameTr} ({sun?.house}. Evde)</div>
                    <div className="text-xs text-slate-400">{sun?.degreeInRasi.toFixed(1)}°</div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                      Güneş ruhun temel amacını (Atman) simgeler. {sun?.house}. evde parlaması, kariyerinizde, toplum önündeki duruşunuzda ve hedeflerinizde güçlü bir özgüven ve kalıcı bir iz bırakma isteği verir.
                    </p>
                    <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                      ☀️ <strong>Yaşam Gücü:</strong> İradenizi ve liderliğinizi doğru idealler uğruna kullandığınızda kapıların ardına kadar açılacağını müjdeler.
                    </div>
                  </div>
                </div>

                {/* 12 Ev Gezegen Dağılımı */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-white">D1 Rashi Gezegen Dağılımı ({form.name})</h3>
                    <span className="text-xs text-slate-400 font-mono">Whole Sign Ev Sistemi</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {d1.planets.map((p: any) => {
                      const nak = calculateNakshatra(p.longitude);
                      return (
                        <div key={p.planet} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                          <div className="flex justify-between font-semibold text-white">
                            <span>{PLANET_NAMES_TR[p.planet] || p.planet}</span>
                            <span className="text-indigo-400 font-mono">{p.house}. Ev</span>
                          </div>
                          <div className="text-slate-400">{p.rasiNameTr} {p.degreeInRasi.toFixed(1)}° • {nak.name} (P{nak.pada})</div>
                          <div className="flex gap-1 text-[10px]">
                            {p.isRetrograde && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Retro (Vakra)
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SEKME 2: D9 NAVAMSHA (EVLİLİK & RUH) */}
            {activeTab === 'd9' && d9 && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-rose-500/30 p-6 rounded-2xl space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-rose-400">D9 Navamsha: Eşin Karakteri & Evlilik Karması</h3>
                      <p className="text-xs text-slate-400">Ruhun gerçek olgunluk haritası ve evlilik dinamiği</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800 font-mono">
                      Navamsha Lagna: {d9.ascendant.rasiNameTr}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Eş Analizi */}
                    <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-rose-300">💍 D9 7. Ev Eş Arketipleri:</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                          {d9SeventhSignName}
                        </span>
                      </div>
                      <div className="text-xs text-slate-200 leading-relaxed">
                        <strong>Eşin Mizacı:</strong> {spouseAnalysis.archetype}
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                        <strong>Evlilik Dinamiği:</strong> {spouseAnalysis.dynamic}
                      </div>
                      <div className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                        <strong>Mesleki Yatkınlıklar:</strong> {spouseAnalysis.career}
                      </div>
                    </div>

                    {/* Jaimini Darakaraka */}
                    <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-amber-300">✨ Jaimini Darakaraka (Ruh Eşi):</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                          {darakaraka?.planet} ({darakaraka?.degreeInRasi.toFixed(1)}°)
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        Haritanızda en düşük boylam derecesine sahip gezegen olan <strong>{PLANET_NAMES_TR[darakaraka?.planet] || darakaraka?.planet}</strong>, Jaimini sistemine göre Darakaraka'dır.
                      </p>
                      <div className="p-3 bg-amber-950/40 border border-amber-500/20 rounded-xl text-xs text-amber-300 leading-relaxed">
                        {DARAKARAKA_INTERPRETATIONS[darakaraka?.planet] || 'Eşiniz hayatınızda derin bir karmik tamamlanma ve büyüme vesilesidir.'}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pt-1">
                        Darakaraka gezegeninin niteliği, evlilikte en çok arayacağınız ve eşinizden alacağınız ruhsal desteği temsil eder.
                      </p>
                    </div>
                  </div>

                  {/* Vargottama Gezegen Karşılaştırması */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-amber-300">⭐ D1 vs D9 Vargottama Analizi:</div>
                    <p className="text-xs text-slate-400">
                      Hem Rashi (D1) hem Navamsha (D9) haritasında aynı burca düşen gezegenler (Vargottama), kişinin hayatının ikinci yarısında olağanüstü sağlamlık ve içsel güç kazanır:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {d1.planets.map((p: any) => {
                        const p9 = d9.planets.find((item: any) => item.planet === p.planet);
                        const isVargottama = p.rasiIndex === p9?.rasiIndex;
                        return (
                          <div key={p.planet} className="p-2.5 bg-slate-900 rounded-lg flex justify-between items-center">
                            <span className="text-slate-300">{PLANET_NAMES_TR[p.planet] || p.planet}</span>
                            <span className="text-[11px] font-mono text-indigo-400">
                              D1: {p.rasiNameTr} ➔ D9: {p9?.rasiNameTr} {isVargottama && '⭐ (Vargottama)'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEKME 3: D7 SAPTAMSHA (ÇOCUKLAR & YARATICILIK) */}
            {activeTab === 'd7' && d7 && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-2xl space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-emerald-400">D7 Saptamsha: Çocuklar, Soy & Yaratıcı Eserler</h3>
                      <p className="text-xs text-slate-400">BPHS varga kuralına göre çocukların bereketi ve yaratıcı üretimler</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800 font-mono">
                      Saptamsha Lagna: {d7.ascendant.rasiNameTr}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Çocuk Potansiyeli */}
                    <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="text-xs font-semibold text-emerald-300">👶 Çocuk Potansiyeli ve Jüpiter (Putrakaraka):</div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        Vedik astrolojide çocukların doğal genel karakası (göstergesi) <strong>Jüpiter (Brihaspati)</strong> ve haritanın <strong>5. evidir</strong>.
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                        {jupiter ? (
                          <>Jüpiter haritanızda <strong>{jupiter.rasiNameTr}</strong> burcunda ve <strong>{jupiter.house}. evde</strong> yer almaktadır. Çocuklarla olan iletişimin samimi, bilgece ve eğitici olacağını gösterir.</>
                        ) : (
                          <>Jüpiter'in konumu soyun devamı ve çocukların ahlaki olgunluğu için bereket vadeder.</>
                        )}
                      </p>
                      <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                        🌱 <strong>Ebeveynlik Dinamiği:</strong> Çocukların özgün yeteneklerini keşfetmelerine rehberlik eden, anlayışlı ve ufuk açıcı bir ebeveynlik profili.
                      </div>
                    </div>

                    {/* Yaratıcı Projeler */}
                    <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                      <div className="text-xs font-semibold text-amber-300">🌿 Yaratıcı Eserler ve Zihinsel Meyveler:</div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        Saptamsha (D7) haritası sadece fiziksel çocukları değil, zihninizin doğurduğu eserleri, projeleri, kitapları ve dünyaya bıraktığınız kalıcı izleri de simgeler.
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2">
                        Saptamsha Lagna'nızın <strong>{d7AscName}</strong> olması, hayata geçirdiğiniz fikirlerin sağlam temellere oturacağını ve sabırla büyütüldüğünde meyve vereceğini gösterir.
                      </p>
                      <div className="p-3 bg-amber-950/40 border border-amber-500/20 rounded-xl text-xs text-amber-300">
                        💡 <strong>Vedik İlke:</strong> Emek verilen yaratıcı projeler zamanla takdir toplayacak ve ruhsal bir doyum sağlayacaktır.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEKME 4: GEZEGEN TABLOSU */}
            {activeTab === 'planets' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-base font-bold text-white">Gezegen Asalet ve Varga Tablosu ({form.name})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="py-2.5 px-3">Gezegen</th>
                        <th className="py-2.5 px-3">D1 Ev</th>
                        <th className="py-2.5 px-3">D1 Burç & Derece</th>
                        <th className="py-2.5 px-3">Nakshatra</th>
                        <th className="py-2.5 px-3">D9 Burç</th>
                        <th className="py-2.5 px-3">D7 Burç</th>
                        <th className="py-2.5 px-3">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {d1.planets.map((p: any) => {
                        const p9 = d9?.planets.find((item: any) => item.planet === p.planet);
                        const p7 = d7?.planets.find((item: any) => item.planet === p.planet);
                        const nak = calculateNakshatra(p.longitude);
                        const isVargottama = p.rasiIndex === p9?.rasiIndex;

                        return (
                          <tr key={p.planet} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 font-semibold text-white">{PLANET_NAMES_TR[p.planet] || p.planet}</td>
                            <td className="py-2.5 px-3 font-mono text-indigo-400 font-bold">{p.house}. Ev</td>
                            <td className="py-2.5 px-3">{p.rasiNameTr} {p.degreeInRasi.toFixed(1)}°</td>
                            <td className="py-2.5 px-3 text-amber-300">{nak.name} (P{nak.pada})</td>
                            <td className="py-2.5 px-3 font-mono text-rose-300">{p9?.rasiNameTr} {isVargottama && '⭐'}</td>
                            <td className="py-2.5 px-3 font-mono text-emerald-300">{p7?.rasiNameTr}</td>
                            <td className="py-2.5 px-3">
                              {p.isRetrograde ? (
                                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">Retro</span>
                              ) : (
                                <span className="text-slate-500">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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