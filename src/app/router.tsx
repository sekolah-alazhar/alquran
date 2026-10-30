import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import HomePage from '@/pages/HomePage'
import SurahListPage from '@/pages/SurahListPage'
import SurahDetailPage from '@/pages/SurahDetailPage'
import SearchPage from '@/pages/SearchPage'
import BookmarkPage from '@/pages/BookmarkPage'
import HistoryPage from '@/pages/HistoryPage'
import SettingsPage from '@/pages/SettingsPage'
import AboutPage from '@/pages/AboutPage'
import NotFoundPage from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'surah', element: <SurahListPage /> },
      { path: 'surah/:nomor', element: <SurahDetailPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'bookmark', element: <BookmarkPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'about', element: <AboutPage /> },
      // juz & tafsir terpisah: tahap berikutnya (PRD §3.2)
      { path: 'juz', element: <NotFoundPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '/home', element: <Navigate to="/" replace /> },
])
