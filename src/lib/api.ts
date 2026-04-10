import { Coin, BinanceDepth, ActivityLevel } from './types';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const BINANCE_BASE = 'https://api.binance.com/api/v3';

export async function fetchTopCoinsByVolume(limit: number = 200): Promise<Coin[]> {
  const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=volume_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status}`);
  }

  const data = await response.json();
  
  return data.map((coin: Coin) => ({
    ...coin,
    liquidity_score: calculateLiquidityScore(coin),
    activity_level: calculateActivityLevel(coin),
  }));
}

function calculateActivityLevel(coin: Coin): ActivityLevel {
  const absPriceChange = Math.abs(coin.price_change_percentage_24h ?? 0);
  const volumeScore = calculateVolumeActivity(coin);
  
  if (absPriceChange > 5 || volumeScore === 'high') {
    return 'high';
  }
  if (absPriceChange >= 2 || volumeScore === 'medium') {
    return 'medium';
  }
  return 'low';
}

function calculateVolumeActivity(coin: Coin): 'high' | 'medium' | 'low' {
  const volume = coin.total_volume ?? 0;
  if (volume > 1_000_000_000) return 'high';
  if (volume > 100_000_000) return 'medium';
  return 'low';
}

export async function fetchBinanceDepth(symbol: string, limit: number = 20): Promise<BinanceDepth> {
  const binanceSymbol = symbol.toUpperCase().replace('-', '') + 'USDT';
  const url = `${BINANCE_BASE}/depth?symbol=${binanceSymbol}&limit=${limit}`;
  
  const response = await fetch(url, {
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchBinance24hrTicker(symbol: string) {
  const binanceSymbol = symbol.toUpperCase().replace('-', '') + 'USDT';
  const url = `${BINANCE_BASE}/ticker/24hr?symbol=${binanceSymbol}`;
  
  const response = await fetch(url, {
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status}`);
  }

  return response.json();
}

function calculateLiquidityScore(coin: Coin): number {
  const volume = coin.total_volume ?? 0;
  const marketCap = coin.market_cap ?? 0;
  const volumeScore = Math.log10(volume + 1) * 10;
  const marketCapScore = Math.log10(marketCap + 1) * 0.5;
  
  return Math.round((volumeScore + marketCapScore) * 10) / 10;
}

export function formatCurrency(value: number | null | undefined, decimals: number = 2): string {
  if (value == null) return '-';
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  if (value >= 1) {
    return `$${value.toFixed(decimals)}`;
  }
  return `$${value.toFixed(6)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}
