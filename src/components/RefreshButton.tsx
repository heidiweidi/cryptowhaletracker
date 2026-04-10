'use client';

import { useState } from 'react';

interface RefreshButtonProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export default function RefreshButton({ onRefresh, isLoading, lastUpdated }: RefreshButtonProps) {
  return (
    <div className="flex items-center gap-4">
      {lastUpdated && (
        <span className="text-gray-500 text-sm">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </span>
      )}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${isLoading
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-cyan-600 hover:bg-cyan-500 text-white'
          }
        `}
      >
        <svg
          className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {isLoading ? 'Loading...' : 'Refresh Data'}
      </button>
    </div>
  );
}
