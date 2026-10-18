import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { quranService } from './services/quranService';
import type { Surah, Ayah } from './services/quranService';
import { useEffect, useState, useMemo } from 'react';

// Loading skeleton component
const SkeletonCard: React.FC = () => (
  <div className="bg-white/60 rounded-2xl p-5 border border-white/50 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

// Header component
const Header: React.FC<{ pageTitle?: string }> = ({ pageTitle }) => (
  <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-800">Al-Quran</h1>
            <p className="text-xs text-emerald-600 -mt-1">Kitab Suci Islam</p>
          </div>
        </Link>
        {pageTitle && (
          <div className="hidden sm:block text-right">
            <p className="text-sm text-gray-500">Surah Aktif</p>
            <p className="font-semibold text-emerald-700">{pageTitle}</p>
          </div>
        )}
      </div>
    </div>
  </header>
);

// Footer component
const Footer: React.FC = () => (
  <footer className="bg-white/60 backdrop-blur-sm border-t border-emerald-100 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Al-Quran Digital • Data dari <span className="text-emerald-600 font-medium">alquran.cloud</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">&copy; {new Date().getFullYear()} Dibuat dengan ❤️ untuk Umat Islam</p>
      </div>
    </div>
  </footer>
);

// Home Page Component
const Home: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await quranService.getSurahs();
        setSurahs(data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat daftar surah. Silakan coba lagi.');
        console.error('Failed to fetch surahs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  // Filter surahs based on search
  const filteredSurahs = useMemo(() => {
    if (!searchTerm) return surahs;
    const term = searchTerm.toLowerCase();
    return surahs.filter(s => 
      s.englishName.toLowerCase().includes(term) ||
      s.englishNameTranslation.toLowerCase().includes(term) ||
      s.name.includes(term) ||
      s.number.toString() === term
    );
  }, [surahs, searchTerm]);

  if (loading) return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="h-10 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-32 mx-auto animate-pulse"></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          Coba Lagi
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <span className="text-white font-arabic text-4xl -rotate-12">📖</span>
            </div>
          </div>
          <h2 className="section-title mb-2">Bismillahhirrahmanirrahim</h2>
          <p className="text-gray-600 text-lg mb-2">Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="stat-badge">{surahs.length} Surah</span>
            <span>•</span>
            <span>6.236 Ayat</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari surah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Ditemukan {filteredSurahs.length} surah
            </p>
          )}
        </div>

        {/* Surah Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.number}
              to={`/surah/${surah.number}`}
              className="surah-card"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold">{surah.number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg truncate">{surah.englishName}</h3>
                  <p className="text-sm text-emerald-600 font-medium">{surah.englishNameTranslation}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {surah.numberOfAyahs} ayat • {surah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="font-arabic text-emerald-700 text-xl">{surah.name}</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">Surah tidak ditemukan</p>
            <p className="text-gray-400 text-sm">Coba kata kunci lain</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

// Surah Detail Component
const SurahDetail: React.FC = () => {
  const { surahId } = useParams<{ surahId: string }>();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surahInfo, setSurahInfo] = useState<Surah | null>(null);
  const [scrollTop, setScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        window.scrollTo(0, 0);
      } catch (err) {
        setError('Gagal memuat surah. Silakan coba lagi.');
        console.error('Failed to fetch surah:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [surahId]);

  if (loading) return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-32 mb-8 animate-pulse"></div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-white/60 rounded-2xl p-6 mb-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/4 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg">{error}</p>
        <Link to="/" className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          Kembali
        </Link>
      </div>
    </div>
  );

  if (!surahInfo) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📖</div>
        <p className="text-gray-600 text-lg">Surah tidak ditemukan</p>
        <Link to="/" className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          Kembali ke Daftar
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header pageTitle={surahInfo.englishName} />
      
      {/* Back Button & Title */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4 group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Surah
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-bold text-2xl">{surahInfo.number}</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-emerald-800">{surahInfo.englishName}</h2>
              <p className="text-emerald-600 font-medium">{surahInfo.englishNameTranslation}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  {surahInfo.numberOfAyahs} Ayat
                </span>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                  {surahInfo.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}
                </span>
              </div>
            </div>
            <div className="ml-auto hidden sm:block">
              <span className="font-arabic text-4xl text-emerald-700">{surahInfo.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bismillah */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-arabic text-3xl text-emerald-800">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          <p className="text-sm text-gray-500 mt-1">Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang</p>
        </div>
      </div>

      {/* Ayahs */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="space-y-4">
          {ayahs.map((ayah) => (
            <div key={ayah.number} className="ayah-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-bold text-sm">{ayah.numberInSurah}</span>
                </div>
                <div className="flex-1">
                  <p className="arabic-text mb-4">{ayah.text}</p>
                  <div className="border-t border-emerald-100 pt-3">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {ayah.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Scroll to top button */}
      {scrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 transition-all hover:scale-110 z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surah/:surahId" element={<SurahDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
