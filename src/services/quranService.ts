import axios from 'axios';

const API_BASE = 'https://api.alquran.cloud/v1';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  translation?: string;
}

export interface QuranApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export const quranService = {
  getSurahs: async (): Promise<Surah[]> => {
    const response = await axios.get<QuranApiResponse<Surah[]>>(`${API_BASE}/surah`);
    return response.data.data;
  },

  getSurahDetail: async (surahNumber: number): Promise<Surah & { ayahs: Ayah[] }> => {
    // Fetch Arabic text
    const arabicResponse = await axios.get(`${API_BASE}/surah/${surahNumber}`);
    // Fetch Indonesian translation
    const idResponse = await axios.get(`${API_BASE}/surah/${surahNumber}/id.indonesian`);
    
    const arabicData = arabicResponse.data.data;
    const idData = idResponse.data.data;
    
    // Combine Arabic text with Indonesian translation
    const ayahs = arabicData.ayahs.map((ayah: Ayah, index: number) => ({
      ...ayah,
      translation: idData.ayahs[index]?.text || ayah.text
    }));
    
    return {
      ...arabicData,
      ayahs
    };
  },
};