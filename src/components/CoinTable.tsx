'use client';

import { Coin, SortField, SortDirection } from '@/lib/types';
import { formatCurrency } from '@/lib/api';
import Sparkline from './Sparkline';
import Tooltip from './Tooltip';

interface CoinTableProps {
  coins: Coin[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const ACTIVITY_STYLES = {
  high: {
    bg: 'bg-red-900/30',
    text: 'text-red-400',
    dot: 'bg-red-500',
    label: 'High',
  },
  medium: {
    bg: 'bg-yellow-900/30',
    text: 'text-yellow-400',
    dot: 'bg-yellow-500',
    label: 'Medium',
  },
  low: {
    bg: 'bg-green-900/30',
    text: 'text-green-400',
    dot: 'bg-green-500',
    label: 'Low',
  },
};

const COLUMN_TOOLTIPS: Record<string, string> = {
  '#': 'Rank by liquidity volume',
  Coin: 'Cryptocurrency name and symbol',
  Price: 'Current USD price',
  '24h %': 'Price change percentage in the last 24 hours',
  '24h Volume': 'Total trading volume in the last 24 hours',
  Activity: 'Based on 24h price change + volume. High: >5% or high volume, Medium: 2-5%, Low: <2%',
  '7D Chart': '7-day price trend sparkline',
  Liquidity: 'Score calculated from trading volume + market cap (log scale)',
};

const HelpIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 cursor-help ml-1"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

export default function CoinTable({ coins, sortField, sortDirection, onSort }: CoinTableProps) {
  const sortIcons = {
    asc: '↑',
    desc: '↓',
  };

  const SortHeader = ({
    field,
    label,
    tooltip,
  }: {
    field: SortField;
    label: string;
    tooltip: string;
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        <Tooltip content={tooltip}>
          <span className="flex items-center">
            {label}
            <HelpIcon />
          </span>
        </Tooltip>
        {sortField === field && (
          <span className="text-cyan-400">{sortIcons[sortDirection]}</span>
        )}
      </div>
    </th>
  );

  const HeaderCell = ({
    label,
    tooltip,
  }: {
    label: string;
    tooltip: string;
  }) => (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
      <div className="flex items-center">
        <Tooltip content={tooltip}>
          <span className="flex items-center">
            {label}
            <HelpIcon />
          </span>
        </Tooltip>
      </div>
    </th>
  );

  if (coins.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">No coins match the selected filter.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <HeaderCell label="#" tooltip={COLUMN_TOOLTIPS['#']} />
            <SortHeader
              field="name"
              label="Coin"
              tooltip={COLUMN_TOOLTIPS['Coin']}
            />
            <SortHeader
              field="current_price"
              label="Price"
              tooltip={COLUMN_TOOLTIPS['Price']}
            />
            <SortHeader
              field="price_change_percentage_24h"
              label="24h %"
              tooltip={COLUMN_TOOLTIPS['24h %']}
            />
            <SortHeader
              field="total_volume"
              label="24h Volume"
              tooltip={COLUMN_TOOLTIPS['24h Volume']}
            />
            <HeaderCell
              label="Activity"
              tooltip={COLUMN_TOOLTIPS['Activity']}
            />
            <HeaderCell
              label="7D Chart"
              tooltip={COLUMN_TOOLTIPS['7D Chart']}
            />
            <HeaderCell
              label="Liquidity"
              tooltip={COLUMN_TOOLTIPS['Liquidity']}
            />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/50">
          {coins.map((coin, index) => {
            const priceChange = coin.price_change_percentage_24h;
            const isPositive = priceChange >= 0;
            const activityLevel = coin.activity_level || 'low';
            const activityStyle = ACTIVITY_STYLES[activityLevel];

            return (
              <tr
                key={coin.id}
                className="hover:bg-gray-900/50 transition-colors"
              >
                <td className="px-4 py-4 text-gray-500 text-sm">
                  {index + 1}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-white">{coin.name}</div>
                      <div className="text-gray-500 text-sm uppercase">
                        {coin.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-white font-medium">
                  {coin.current_price != null
                    ? formatCurrency(
                        coin.current_price,
                        coin.current_price < 1 ? 6 : 2
                      )
                    : '-'}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${
                      isPositive
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {priceChange != null ? priceChange.toFixed(2) : '0.00'}%
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-300">
                  {formatCurrency(coin.total_volume)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium ${activityStyle.bg} ${activityStyle.text}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${activityStyle.dot}`} />
                    {activityStyle.label}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {coin.sparkline_in_7d?.price && (
                    <Sparkline
                      data={coin.sparkline_in_7d.price}
                      positive={isPositive}
                      index={index}
                    />
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{
                          width: `${Math.min((coin.liquidity_score ?? 0) * 5, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-cyan-400 text-sm font-medium">
                      {(coin.liquidity_score ?? 0).toFixed(1)}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
