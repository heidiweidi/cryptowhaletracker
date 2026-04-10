# 🐋 Crypto Whale Tracker

A real-time dashboard to track the top 200 high-liquidity cryptocurrencies with activity-based filtering.

![Crypto Whale Tracker](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue) ![API](https://img.shields.io/badge/API-CoinGecko-orange)

## Features

- **Top 200 Coins** - Track the top 200 cryptocurrencies by trading volume
- **Activity Filters** - Filter coins by activity level:
  - 🔴 **High Activity**: >5% price change or high volume
  - 🟡 **Medium Activity**: 2-5% price change
  - 🟢 **Low Activity**: <2% price change
- **Sortable Columns** - Click any column header to sort
- **7-Day Charts** - Sparkline charts showing 7-day price trends
- **Liquidity Score** - Custom score calculated from volume and market cap
- **Tooltips** - Hover over column headers for explanations
- **Responsive Design** - Works on desktop and mobile

## Data Sources

- **CoinGecko API** - Real-time price, volume, and market data
- **No API Key Required** - Uses free tier endpoints

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Data Fetching**: Native fetch with React hooks
- **Charts**: Custom SVG sparklines

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
npm run build
```

### Static Export (for GitHub Pages)

```bash
npm run build
# Output will be in the 'out' directory
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx         # Main dashboard page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/
│   ├── Dashboard.tsx    # Main dashboard container
│   ├── CoinTable.tsx    # Sortable coin data table
│   ├── Sparkline.tsx    # 7-day price chart
│   ├── RefreshButton.tsx # Manual refresh button
│   └── Tooltip.tsx      # Reusable tooltip component
└── lib/
    ├── api.ts           # API functions
    └── types.ts         # TypeScript types
```

## Activity Classification

| Level | Price Change | Volume |
|-------|--------------|--------|
| High | >5% | >$1B |
| Medium | 2-5% | >$100M |
| Low | <2% | Normal |

## Deployment

This project is configured for GitHub Pages deployment. After pushing to your repository:

1. Go to **Settings → Pages**
2. Select **Source**: Deploy from a branch
3. Select **Branch**: `gh-pages` / `root`
4. Click **Save**

## License

MIT License - Feel free to use and modify!

---

Built with ❤️ using Next.js, Tailwind CSS, and CoinGecko API
