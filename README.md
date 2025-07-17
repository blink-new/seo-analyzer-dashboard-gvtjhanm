# SEO Analyzer Dashboard

A comprehensive SEO analysis platform that provides on-page SEO audits, Core Web Vitals monitoring, competitor analysis, and detailed reporting in a clean, professional dashboard interface.

## Features

### Basic Features
- URL analysis input
- On-page SEO analysis (meta tags, titles, headings H1-H6, ALT attributes, content length, links)
- Overall SEO score (0-100 scale)
- Error detection (missing ALT, missing description, duplicate tags)
- Improvement suggestions list

### Advanced Features
- Core Web Vitals analysis (LCP, FID, CLS)
- Competitor comparison (top 3 from Google)
- Report export (PDF, CSV)
- Analysis history for logged users

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: ShadCN UI + Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend**: Blink SDK

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Sidebar, Navbar)
│   ├── pages/           # Page components
│   └── ui/              # ShadCN UI components
├── services/            # API services
├── hooks/               # Custom React hooks
└── lib/                 # Utilities
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build