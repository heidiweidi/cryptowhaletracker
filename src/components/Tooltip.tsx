'use client';

import { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex items-center isolate">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-[9999] top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 text-xs text-white bg-gray-800 border border-gray-700 rounded-lg shadow-xl whitespace-normal max-w-xs">
          {content}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 border-4 border-transparent border-b-gray-800" />
        </div>
      )}
    </div>
  );
}
