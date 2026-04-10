'use client';

interface SparklineProps {
  data: number[];
  positive: boolean;
  index: number;
  width?: number;
  height?: number;
}

export default function Sparkline({
  data,
  positive,
  index,
  width = 100,
  height = 32,
}: SparklineProps) {
  if (!data || data.length === 0) {
    return <div className="w-[100px] h-[32px]" />;
  }

  const sampleRate = Math.max(1, Math.floor(data.length / 50));
  const sampledData = data.filter((_, i) => i % sampleRate === 0);
  
  const min = Math.min(...sampledData);
  const max = Math.max(...sampledData);
  const range = max - min || 1;

  const points = sampledData
    .map((value, index) => {
      const x = (index / (sampledData.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const gradientColor = positive ? '#22c55e' : '#ef4444';
  const gradientId = `sparkline-gradient-${positive ? 'pos' : 'neg'}-${index}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={gradientColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#${gradientId})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={gradientColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
