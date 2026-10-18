# 📖 Al-Quran Digital App

A beautiful, responsive web application for reading the Holy Quran with Indonesian translations. Built with modern web technologies for an optimal user experience.

## 🚀 Live Demo

Access the live application at: **https://quran.pudin.eu.org**

## 🛠️ Technology Stack

### Frontend Framework
- **React 19** - Modern UI library with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better developer experience
- **Vite** - Next-generation frontend tooling with fast HMR (Hot Module Replacement)

### Styling
- **Tailwind CSS v3** - Utility-first CSS framework for rapid UI development
- **Amiri Font** - Beautiful Arabic calligraphy font from Google Fonts
- **Inter Font** - Clean, modern UI font for Indonesian text

### Routing & API
- **React Router DOM** - Client-side routing for seamless page navigation
- **Axios** - Promise-based HTTP client for API requests

### Backend Integration
- **alquran.cloud API** - Free, official Quran API providing:
  - 114 Surah list
  - Arabic text (Quran Majeed)
  - Indonesian translations (id.indonesian)

## 📁 Project Structure

```
quran/
├── src/
│   ├── components/     # Reusable UI components
│   ├── services/       # API service layer
│   │   └── quranService.ts    # Main API client
│   ├── pages/          # Page components (if needed)
│   ├── App.tsx         # Main application component with routing
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles and Tailwind directives
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.cjs  # PostCSS configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🔧 API Integration

### Endpoints Used
| Endpoint | Description |
|----------|-------------|
| `GET /v1/surah` | List all 114 surahs |
| `GET /v1/surah/{number}` | Get surah with Arabic text |
| `GET /v1/surah/{number}/id.indonesian` | Get Indonesian translation |

### Service Architecture
The `quranService.ts` fetches both Arabic and Indonesian text in parallel using `Promise.all()`:
```typescript
const [arabicData, idData] = await Promise.all([
  fetch(`/surah/${surahNumber}`),
  fetch(`/surah/${surahNumber}/id.indonesian`)
]);
```

## 🎨 Features

- ✅ Complete 114 surah list with search functionality
- ✅ Beautiful Arabic typography with proper RTL support
- ✅ Indonesian translation for each ayah
- ✅ Responsive design for all screen sizes
- ✅ Fast loading with Vite's optimized build
- ✅ Skeleton loading states for better UX
- ✅ Glassmorphism header and modern card designs
- ✅ Smooth animations and transitions
- ✅ Scroll to top button
- ✅ Type-safe with TypeScript

## 📋 Prerequisites

- Node.js v18+ (recommended: v20+)
- npm or yarn package manager
- Git for version control

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/sekolah-alazhar/alquran.git
cd alquran

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

This application is deployed on:
- **Server:** VPS Ubuntu 24.04 (Tencent Cloud CVM)
- **Domain:** quran.pudin.eu.org
- **SSL:** Cloudflare
- **Port:** 3001
- **Service:** systemd unit `quran-app.service`

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name quran.pudin.eu.org;
    
    ssl_certificate /etc/cloudflare/pudin.eu.org.pem;
    ssl_certificate_key /etc/cloudflare/pudin.eu.org.key;
    
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Systemd Service
```ini
[Unit]
Description=Al-Quran Digital App
After=network.target

[Service]
Type=simple
User=upudin
WorkingDirectory=/home/upudin/quran
ExecStart=/usr/bin/node /home/upudin/quran/node_modules/vite/bin/vite.js preview --port 3001
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## 🎯 Environment Variables

No environment variables are required. The app directly uses the alquran.cloud public API.

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run oxlint for code quality |

## 🔒 Security

- SSL/TLS encryption via Cloudflare
- No sensitive data stored in client-side code
- CORS policy handled by alquran.cloud API
- Secure deployment with fail2ban and UFW firewall

## 📄 License

MIT License - Feel free to use this project for educational and personal purposes.

## 🙏 Acknowledgments

- **alquran.cloud** for providing the free Quran API
- **Google Fonts** for Amiri and Inter typefaces
- **Tailwind CSS** team for the amazing utility-first framework
- **React and Vite** communities for excellent developer tools

---

**Built with ❤️ for the Muslim community**
