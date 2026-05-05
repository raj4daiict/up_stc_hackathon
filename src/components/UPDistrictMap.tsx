import React, { useMemo, useState } from 'react';
import type { Mother } from '../types';

interface UPDistrictMapProps {
  mothers: Mother[];
  onDistrictClick?: (district: string) => void;
  selectedDistrict?: string;
}

// Simplified SVG paths for key UP districts (stylized representation)
const DISTRICT_PATHS: Record<string, { path: string; cx: number; cy: number }> = {
  Lucknow: {
    path: 'M 180 200 L 210 185 L 240 190 L 255 210 L 250 235 L 225 245 L 195 240 L 175 220 Z',
    cx: 215, cy: 215,
  },
  Varanasi: {
    path: 'M 320 250 L 350 235 L 380 240 L 390 260 L 385 285 L 360 295 L 330 290 L 315 270 Z',
    cx: 352, cy: 265,
  },
  Agra: {
    path: 'M 80 220 L 110 205 L 140 210 L 150 230 L 145 255 L 120 265 L 90 260 L 75 240 Z',
    cx: 112, cy: 235,
  },
  Kanpur: {
    path: 'M 155 260 L 185 248 L 210 255 L 218 275 L 212 295 L 190 303 L 162 298 L 150 278 Z',
    cx: 184, cy: 275,
  },
  Prayagraj: {
    path: 'M 255 255 L 285 242 L 310 248 L 320 268 L 314 290 L 292 298 L 264 293 L 250 273 Z',
    cx: 284, cy: 270,
  },
  Gorakhpur: {
    path: 'M 350 155 L 380 140 L 410 145 L 420 165 L 415 188 L 392 198 L 362 192 L 345 175 Z',
    cx: 382, cy: 168,
  },
  Jhansi: {
    path: 'M 85 290 L 115 278 L 140 283 L 148 300 L 142 320 L 120 328 L 94 323 L 80 305 Z',
    cx: 114, cy: 303,
  },
  Bareilly: {
    path: 'M 155 130 L 185 118 L 210 123 L 218 140 L 212 160 L 190 168 L 162 163 L 150 148 Z',
    cx: 184, cy: 143,
  },
};

function getRiskColor(hrpCount: number, total: number): string {
  if (total === 0) return '#1e293b';
  const ratio = hrpCount / total;
  if (ratio >= 0.5) return '#dc2626';   // red - very high
  if (ratio >= 0.35) return '#ea580c';  // orange - high
  if (ratio >= 0.2) return '#f59e0b';   // amber - moderate
  if (ratio >= 0.1) return '#eab308';   // yellow - low-moderate
  return '#22c55e';                      // green - low
}

function getRiskGlow(hrpCount: number, total: number): string {
  if (total === 0) return 'none';
  const ratio = hrpCount / total;
  if (ratio >= 0.5) return '0 0 12px rgba(220,38,38,0.6)';
  if (ratio >= 0.35) return '0 0 10px rgba(234,88,12,0.5)';
  return 'none';
}

export const UPDistrictMap: React.FC<UPDistrictMapProps> = ({ mothers, onDistrictClick, selectedDistrict }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const districtData = useMemo(() => {
    const data: Record<string, { total: number; hrp: number; critical: number }> = {};
    Object.keys(DISTRICT_PATHS).forEach(d => {
      data[d] = { total: 0, hrp: 0, critical: 0 };
    });
    mothers.forEach(m => {
      if (data[m.district]) {
        data[m.district].total++;
        if (m.riskLevel === 'high' || m.riskLevel === 'critical') data[m.district].hrp++;
        if (m.riskLevel === 'critical') data[m.district].critical++;
      }
    });
    return data;
  }, [mothers]);

  const tooltipData = hoveredDistrict ? districtData[hoveredDistrict] : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Title */}
      <div style={{ position: 'absolute', top: 12, left: 16, zIndex: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
          Uttar Pradesh — HRP Heatmap
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
          Click a district to filter • Color = HRP density
        </div>
      </div>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 12, left: 16, display: 'flex', alignItems: 'center', gap: 6, zIndex: 2 }}>
        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Low</span>
        {['#22c55e', '#eab308', '#f59e0b', '#ea580c', '#dc2626'].map((c, i) => (
          <div key={i} style={{ width: 20, height: 8, borderRadius: 2, background: c }} />
        ))}
        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>High</span>
      </div>

      {/* Tooltip */}
      {hoveredDistrict && tooltipData && (
        <div style={{
          position: 'absolute', top: 12, right: 16, zIndex: 10,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '12px 16px', boxShadow: 'var(--shadow-lg)',
          minWidth: 160,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            {hoveredDistrict}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Pregnancies</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{tooltipData.total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: 'var(--text-secondary)' }}>High-Risk (HRP)</span>
              <span style={{ fontWeight: 600, color: '#f97316' }}>{tooltipData.hrp}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Critical</span>
              <span style={{ fontWeight: 600, color: '#ef4444' }}>{tooltipData.critical}</span>
            </div>
            <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--text-muted)' }}>
              HRP Rate: {tooltipData.total > 0 ? Math.round((tooltipData.hrp / tooltipData.total) * 100) : 0}%
            </div>
          </div>
        </div>
      )}

      {/* SVG Map */}
      <svg viewBox="0 0 480 380" style={{ width: '100%', height: '100%' }} aria-label="Uttar Pradesh district heatmap">
        {/* Background shape representing UP outline */}
        <path
          d="M 50 100 Q 80 60 160 50 Q 250 40 350 55 Q 430 70 450 120 Q 460 180 440 240 Q 420 300 380 340 Q 320 370 250 360 Q 160 350 100 330 Q 60 310 45 260 Q 35 200 50 100 Z"
          fill="var(--bg-secondary)"
          stroke="var(--border)"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* District regions */}
        {Object.entries(DISTRICT_PATHS).map(([district, { path, cx, cy }]) => {
          const data = districtData[district];
          const color = getRiskColor(data.hrp, data.total);
          const isHovered = hoveredDistrict === district;
          const isSelected = selectedDistrict === district;
          const hasCritical = data.critical > 0;

          return (
            <g key={district}>
              {/* Pulse animation for critical districts */}
              {hasCritical && (
                <circle cx={cx} cy={cy} r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6">
                  <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* District shape */}
              <path
                d={path}
                fill={color}
                stroke={isSelected ? '#ffffff' : isHovered ? '#e2e8f0' : 'var(--border)'}
                strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                opacity={isHovered || isSelected ? 1 : 0.85}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  filter: isHovered ? `drop-shadow(${getRiskGlow(data.hrp, data.total)})` : 'none',
                }}
                onMouseEnter={() => setHoveredDistrict(district)}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => onDistrictClick?.(district)}
                role="button"
                aria-label={`${district}: ${data.total} pregnancies, ${data.hrp} high-risk`}
              />

              {/* District label */}
              <text
                x={cx}
                y={cy - 8}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontWeight="700"
                style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
              >
                {district}
              </text>
              <text
                x={cx}
                y={cy + 6}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="800"
                style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
              >
                {data.hrp}
              </text>
              <text
                x={cx}
                y={cy + 17}
                textAnchor="middle"
                fill="rgba(255,255,255,0.8)"
                fontSize="7"
                style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
              >
                HRP cases
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
