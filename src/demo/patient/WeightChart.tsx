import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Dot } from 'recharts';

interface Props {
  weights: number[];
}

export function WeightChart({ weights }: Props) {
  const data = weights.map((w, i) => ({ week: `W${i + 1}`, weight: w }));

  const renderDot = (props: any) => {
    const { cx, cy, index } = props;
    const isAbnormal = index > 0 && weights[index] - weights[index - 1] > 2;
    return <Dot cx={cx} cy={cy} r={5} fill={isAbnormal ? '#ef4444' : '#10b981'} stroke="white" strokeWidth={2} />;
  };

  // Build gradient segments by coloring the line
  const segments = data.map((_, i) => {
    if (i === 0) return '#10b981';
    return weights[i] - weights[i - 1] > 2 ? '#ef4444' : '#10b981';
  });

  const hasAnomaly = weights.some((w, i) => i > 0 && w - weights[i - 1] > 2);

  return (
    <div style={{ width: '100%' }}>
      {hasAnomaly && (
        <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, margin: '0 0 6px', textAlign: 'center' }}>
          पिछले 2 हफ्तों में आपका वजन तेजी से बढ़ा है
        </p>
      )}
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <XAxis dataKey="week" tick={{ fontSize: 10 }} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v: number) => [`${v} kg`, 'वजन']} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke={hasAnomaly ? '#ef4444' : '#10b981'}
            strokeWidth={2}
            dot={renderDot}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 4 }}>
        <span style={{ fontSize: 10, color: '#10b981' }}>● सामान्य</span>
        <span style={{ fontSize: 10, color: '#ef4444' }}>● असामान्य</span>
      </div>
    </div>
  );
}
