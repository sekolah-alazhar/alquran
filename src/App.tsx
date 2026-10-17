import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { quranService } from './services/quranService';
import type { Surah, Ayah } from './services/quranService';
import { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await quranService.getSurahs();
        setSurahs(data);
        setError(null);
      } catch (err) {
        setError('Failed to load surah list. Please try again.');
        console.error('Failed to fetch surahs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  if (loading) return <p className="text-center py-4">Memuat...</p>;
  if (error) return <p className="text-center py-4 text-red-600">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-emerald-800">Al-Quran</h1>
      <p className="text-center text-sm text-gray-500 mb-6">{surahs.length} Surah</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {surahs.map((surah) => (
          <div
            key={surah.number}
            className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-all duration-200"
          >
            <Link to={`/surah/${surah.number}`} className="block">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{surah.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{surah.englishName}</p>
                  <p className="text-xs text-gray-400 mt-1">{surah.englishNameTranslation}</p>
                </div>
                <div className="bg-emerald-50 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-700">{surah.number}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">{surah.numberOfAyahs} ayat • {surah.revelationType}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const SurahDetail: React.FC = () => {
  const { surahId } = useParams<{ surahId: string }>();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surahInfo, setSurahInfo] = useState<Surah | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!surahId) return;
      try {
        const data = await quranService.getSurahDetail(parseInt(surahId, 10));
        setSurahInfo({
          number: data.number,
          name: data.name,
          englishName: data.englishName,
          englishNameTranslation: data.englishNameTranslation,
          numberOfAyahs: data.numberOfAyahs,
          revelationType: data.revelationType,
        });
        setAyahs(data.ayahs);
        setError(null);
      } catch (err) {
        setError('Failed to load surah. Please try again.');
        console.error('Failed to fetch surah:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [surahId]);

  if (loading) return <p className="text-center py-4">Memuat...</p>;
  if (error) return <p className="text-center py-4 text-red-600">{error}</p>;
  if (!surahInfo) return <p className="text-center py-4">Surah tidak ditemukan</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="text-emerald-600 hover:underline font-medium">&larr; Kembali ke Daftar Surah</Link>
        <h1 className="text-2xl font-bold text-emerald-800">{surahInfo.name} ({surahInfo.englishName})</h1>
      </div>
      <p className="text-sm text-gray-600 mb-6">{surahInfo.englishNameTranslation} • {surahInfo.numberOfAyahs} ayat • {surahInfo.revelationType}</p>
      <div className="space-y-3">
        {ayahs.map((ayah) => (
          <div key={ayah.number} className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-50 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs font-bold text-emerald-700">{ayah.numberInSurah}</span>
              </div>
              <div className="flex-1">
                <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 leading-relaxed mb-2">{ayah.text}</p>
                <p className="text-xs text-gray-400">Ayat {ayah.numberInSurah} dari {surahInfo.numberOfAyahs}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-emerald-700">Al-Quran</h1>
          </div>
        </header>
        <main className="flex-1 py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/surah/:surahId" element={<SurahDetail />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Al-Quran App • Data dari alquran.cloud
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
