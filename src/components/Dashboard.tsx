'use client';

import { useState, useCallback, useMemo } from 'react';
import { Coin, SortField, SortDirection, ActivityFilter, ActivityLevel } from '@/lib/types';
import { fetchTopCoinsByVolume } from '@/lib/api';
import CoinTable from '@/components/CoinTable';
import RefreshButton from '@/components/RefreshButton';

const ACTIVITY_FILTERS: { key: ActivityFilter; label: string; color: string }[] = [
  { key: 'all', label: 'All Coins', color: 'text-white' },
  { key: 'high', label: 'High Activity', color: 'text-red-400' },
  { key: 'medium', label: 'Medium Activity', color: 'text-yellow-400' },
  { key: 'low', label: 'Low Activity', color: 'text-green-400' },
];

export default function Dashboard() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sortField, setSortField] = useState<SortField>('total_volume');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');

  const loadCoins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTopCoinsByVolume(200);
      setCoins(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredCoins = useMemo(() => {
    if (activityFilter === 'all') return coins;
    return coins.filter(coin => coin.activity_level === activityFilter);
  }, [coins, activityFilter]);

  const sortedCoins = useMemo(() => {
    return [...filteredCoins].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [filteredCoins, sortField, sortDirection]);

  const totalVolume = coins.reduce((sum, coin) => sum + coin.total_volume, 0);

  const activityCounts = useMemo(() => ({
    all: coins.length,
    high: coins.filter(c => c.activity_level === 'high').length,
    medium: coins.filter(c => c.activity_level === 'medium').length,
    low: coins.filter(c => c.activity_level === 'low').length,
  }), [coins]);

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">🐋</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Crypto Whale Tracker</h1>
              <p className="text-sm text-gray-400">Top 200 High Liquidity Coins</p>
            </div>
          </div>
          <RefreshButton
            onRefresh={loadCoins}
            isLoading={isLoading}
            lastUpdated={lastUpdated}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Total 24h Volume</p>
            <p className="text-2xl font-bold text-white">
              ${(totalVolume / 1e9).toFixed(2)}B
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">High Activity</p>
            <p className="text-2xl font-bold text-red-400">{activityCounts.high}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Medium Activity</p>
            <p className="text-2xl font-bold text-yellow-400">{activityCounts.medium}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Low Activity</p>
            <p className="text-2xl font-bold text-green-400">{activityCounts.low}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {isLoading && coins.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading crypto data...</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Coins by Activity</h2>
                  <p className="text-sm text-gray-400">Filtered: {sortedCoins.length} of {coins.length} coins</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_FILTERS.map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => setActivityFilter(filter.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activityFilter === filter.key
                          ? 'bg-cyan-600 text-white border-2 border-cyan-400'
                          : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {filter.label} ({activityCounts[filter.key]})
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">Click column headers to sort. High: &gt;5% price change, Medium: 2-5%, Low: &lt;2%</p>
            </div>
            <CoinTable
              coins={sortedCoins}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          Data provided by CoinGecko API • Updated on refresh • Built with Next.js
        </div>
      </footer>
    </div>
  );
}
