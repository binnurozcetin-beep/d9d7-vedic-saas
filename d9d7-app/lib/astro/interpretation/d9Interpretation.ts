import type { D1Chart } from '../chart';
import type { VargaChart } from '../varga';
import { evaluateDignity } from './dignity';

export interface D9AnalysisResult {
  navamshaAscendantSummary: {
    sign: string;
    themeTr: string;
    spiritualPathTr: string;
  };
  marriageAndSpouseAnalysis: {
    seventhHouseSign: string;
    spouseArchetypeTr: string;
    relationshipDynamicTr: string;
  };
  vargottamaPlanets: Array<{
    planet: string;
    sign: string;
    meaningTr: string;
  }>;
  d1ToD9Shifts: Array<{
    planet: string;
    d1Sign: string;
    d9Sign: string;
    transformationTr: string;
  }>;
  darakaraka: {
    planet: string;
    degree: number;
    meaningTr: string;
  };
}

export function analyzeD9Navamsha(d1: D1Chart, d9: VargaChart): D9AnalysisResult {
  const d9Asc = d9.ascendant;

  // 1. D9 Yükselen Özeti (Ruhun Olgunluk Yolu)
  const ascThemes: Record<string, { theme: string; path: string }> = {
    Koç: { theme: 'Öncülük, bağımsızlık ve bireysel cesaret.', path: 'Kendi sınırlarını aşarak ruhsal liderlik geliştirmek.' },
    Boğa: { theme: 'Huzur, sadakat, estetik ve sağlam temeller.', path: 'Maddi ile manevi değerler arasında kutsal denge kurmak.' },
    İkizler: { theme: 'Merak, iletişim, entelektüel derinlik.', path: 'Bilgiyi hikmete dönüştürmek ve ifade etmek.' },
    Yengeç: { theme: 'Şefkat, duygusal bağlılık ve sezgisellik.', path: 'Koşulsuz sevgi ve ruhsal aidiyet bilincini yeşertmek.' },
    Aslan: { theme: 'Yaratıcı asalet, cömertlik ve merkezde olma.', path: 'Egoyu aşarak kalpten ilham kaynağı olmak.' },
    Başak: { theme: 'Hizmet, saflık, adanmışlık ve düzen.', path: 'Dünyevi detaylarda kutsal intizamı görebilmek.' },
    Terazi: { theme: 'Adalet, denge, ortaklık ve yüksek zarafet.', path: 'İlişkiler aynasında kendi benliğini tanımak.' },
    Akrep: { theme: 'Derin dönüşüm, okült kavrayış ve yeniden doğuş.', path: 'Korkuları dönüştürerek ruhsal simyayı gerçekleştirmek.' },
    Yay: { theme: 'Dharma, yüksek felsefe, inanç ve keşif.', path: 'Hakikatin peşinde bilge bir yolcu olmak.' },
    Oğlak: { theme: 'Disiplin, sabır, karmik sorumluluklar.', path: 'Sebatla kalıcı ruhsal eserler inşa etmek.' },
    Kova: { theme: 'Evrensel kardeşlik, vizyonerlik ve özgürlük.', path: 'Bütüne hizmet eden yüksek idealleri yaşatmak.' },
    Balık: { theme: 'Moksha, teslimiyet, merhamet ve birlik.', path: 'Dünyevi bağları şefkatle çözüp evrensel bilince ermek.' },
  };

  const navamshaAscTheme = ascThemes[d9Asc.rasiNameTr] || {
    theme: 'Bireysel dönüşüm ve olgunlaşma.',
    path: 'Dharmik potansiyeli gerçekleştirmek.',
  };

  // 2. 7. Ev (Eş ve Evlilik Dinamiği) - D9'da 7. Ev: (asc + 6) % 12
  const d9SeventhSignIndex = (d9Asc.rasiIndex + 6) % 12;
  const seventhSignNames = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
  const seventhSignName = seventhSignNames[d9SeventhSignIndex];

  const spouseArchetypes: Record<string, { archetype: string; dynamic: string }> = {
    Koç: { archetype: 'Dinamik, dürüst, dobra, lider ruhlu ve inisiyatif alan eş.', dynamic: 'İlişkide tutku ve canlılık ön plandadır; rekabet yerine iş birliği gözetilmelidir.' },
    Boğa: { archetype: 'Sakin, güvenilir, konforu ve sadakati seven, sabırlı eş.', dynamic: 'İlişki zamanla kök salar; huzur ve maddi-manevi istikrar temel önceliktir.' },
    İkizler: { archetype: 'Konuşkan, entelektüel, neşeli, genç ruhlu ve esnek eş.', dynamic: 'Zihinsel uyum ve sürekli iletişim evliliğin en önemli can damarıdır.' },
    Yengeç: { archetype: 'Anaç/babacan, korumacı, duygusal, yuva odaklı ve duyarlı eş.', dynamic: 'Duygusal güven ve derin bağlılık ilişkide huzur sağlar.' },
    Aslan: { archetype: 'Karizmatik, saygın, gururlu, cömert ve dikkat çeken eş.', dynamic: 'Karşılıklı takdir ve saygı ilişkinin uzun ömürlü olmasını sağlar.' },
    Başak: { archetype: 'Pratik, çalışkan, düzenli, analizci ve yardımsever eş.', dynamic: 'Günlük hayatın sorumluluklarını paylaşmak bağı güçlendirir.' },
    Terazi: { archetype: 'Zarif, uzlaşmacı, estetik duygusu güçlü ve adil eş.', dynamic: 'Romantizm ve karşılıklı denge ön plandadır.' },
    Akrep: { archetype: 'Gizemli, tutkulu, sezgileri keskin ve derin sadakat arayan eş.', dynamic: 'Yüzeysel değil, ruhsal düzeyde yoğun bir dönüşüm ilişkisidir.' },
    Yay: { archetype: 'Vizyoner, neşeli, felsefi, inançlı veya yabancı kültürlere açık eş.', dynamic: 'Birlikte öğrenmek, seyahat etmek ve ufku genişletmek bağı besler.' },
    Oğlak: { archetype: 'Ciddi, olgun, kariyer odaklı, sorumluluk sahibi ve gelenekçi eş.', dynamic: 'Zamanla güçlenen, sağlam temellere dayalı bir ortaklıktır.' },
    Kova: { archetype: 'Özgürlükçü, arkadaş canlısı, sıra dışı ve yenilikçi eş.', dynamic: 'Evlilik aynı zamanda derin bir yol arkadaşlığı ve dostluktur.' },
    Balık: { archetype: 'Duyarlı, merhametli, hayal gücü geniş, ruhsal eş.', dynamic: 'Şefkat ve manevi anlayış ilişkinin mayasıdır.' },
  };

  const spouseInfo = spouseArchetypes[seventhSignName] || {
    archetype: 'Dengeli ve tamamlayıcı karakterde eş.',
    dynamic: 'Karşılıklı anlayışla gelişen evlilik bağı.',
  };

  // 3. Vargottama Gezegenler (Hem D1 hem D9'da aynı burçta olanlar)
  const vargottamaPlanets: Array<{ planet: string; sign: string; meaningTr: string }> = [];
  const d1ToD9Shifts: Array<{ planet: string; d1Sign: string; d9Sign: string; transformationTr: string }> = [];

  for (const p1 of d1.planets) {
    const p9 = d9.planets.find((item) => item.planet === p1.planet);
    if (!p9) continue;

    if (p1.rasiIndex === p9.rasiIndex) {
      vargottamaPlanets.push({
        planet: p1.planet,
        sign: p1.rasiNameTr,
        meaningTr: `${p1.planet} hem Rashi (D1) hem Navamsha (D9) haritasında ${p1.rasiNameTr} burcundadır (Vargottama). Bu durum gezegenin vaat ettiği potansiyeli gerçekleştirmesi için sarsılmaz bir güç ve kararlılık verir.`,
      });
    }

    // Güç Değişimi: D1'de düşüşte olup D9'da yücelen vb.
    const d1Dig = evaluateDignity(p1.planet, p1.rasiIndex, p1.degreeInRasi);
    const d9Dig = evaluateDignity(p9.planet, p9.rasiIndex, 0);

    if (d1Dig.dignity === 'debilitated' && d9Dig.dignity === 'exalted') {
      d1ToD9Shifts.push({
        planet: p1.planet,
        d1Sign: p1.rasiNameTr,
        d9Sign: p9.rasiNameTr,
        transformationTr: `${p1.planet} D1'de düşüşteyken Navamsha'da yücelerek güçlü bir Neecha Bhanga (düşüşün iptali ve büyük yükseliş) kalitesi kazanır. Erken yaşlardaki zorluklar ilerleyen yıllarda ustalığa dönüşür.`,
      });
    } else if (d1Dig.dignity !== d9Dig.dignity) {
      d1ToD9Shifts.push({
        planet: p1.planet,
        d1Sign: `${p1.rasiNameTr} (${d1Dig.dignityLabelTr})`,
        d9Sign: `${p9.rasiNameTr} (${d9Dig.dignityLabelTr})`,
        transformationTr: `D1'deki fiziksel potansiyel D9 iç dünyasında ${d9Dig.dignityLabelTr} niteliğine evrilir.`,
      });
    }
  }

  // 4. Jaimini Darakaraka (Rahu/Ketu hariç en düşük dereceli gezegen = Eş Göstergesi)
  const candidatePlanets = d1.planets.filter((p) => p.planet !== 'Rahu' && p.planet !== 'Ketu');
  candidatePlanets.sort((a, b) => a.degreeInRasi - b.degreeInRasi);
  const dk = candidatePlanets[0];

  return {
    navamshaAscendantSummary: {
      sign: d9Asc.rasiNameTr,
      themeTr: navamshaAscTheme.theme,
      spiritualPathTr: navamshaAscTheme.path,
    },
    marriageAndSpouseAnalysis: {
      seventhHouseSign: seventhSignName,
      spouseArchetypeTr: spouseInfo.archetype,
      relationshipDynamicTr: spouseInfo.dynamic,
    },
    vargottamaPlanets,
    d1ToD9Shifts,
    darakaraka: {
      planet: dk.planet,
      degree: Number(dk.degreeInRasi.toFixed(2)),
      meaningTr: `${dk.planet} haritanızda en düşük boylam derecesine sahip olduğu için Jaimini sistemine göre Darakaraka'dır (Eş Göstergesi). İlişkilerinizde aradığınız ruhsal çekirdeği ve hayat partnerinizin temel enerjisini temsil eder.`,
    },
  };
}