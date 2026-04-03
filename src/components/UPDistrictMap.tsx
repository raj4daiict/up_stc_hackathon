import React, { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';

interface DistrictData {
  name: string;
  mmr: number;
  registered: number;
  hrp: number;
  ancCoverage: number;
  aiCallReach: number;
}

interface UPDistrictMapProps {
  onSelectDistrict: (name: string) => void;
  selectedDistrict: string | null;
}

// Simplified UP district positions (approximate lat/lon mapped to SVG coords)
const DISTRICT_POSITIONS: { name: string; x: number; y: number; size: 'lg' | 'md' | 'sm' }[] = [
  { name: 'Lucknow', x: 52, y: 42, size: 'lg' },
  { name: 'Varanasi', x: 78, y: 52, size: 'lg' },
  { name: 'Agra', x: 22, y: 38, size: 'lg' },
  { name: 'Kanpur', x: 45, y: 48, size: 'lg' },
  { name: 'Prayagraj', x: 65, y: 55, size: 'md' },
  { name: 'Gorakhpur', x: 78, y: 28, size: 'md' },
  { name: 'Jhansi', x: 25, y: 62, size: 'md' },
  { name: 'Bareilly', x: 42, y: 18, size: 'md' },
  { name: 'Meerut', x: 18, y: 12, size: 'sm' },
  { name: 'Moradabad', x: 32, y: 14, size: 'sm' },
  { name: 'Aligarh', x: 20, y: 28, size: 'sm' },
  { name: 'Mathura', x: 16, y: 34, size: 'sm' },
  { name: 'Firozabad', x: 26, y: 44, size: 'sm' },
  { name: 'Etawah', x: 32, y: 50, size: 'sm' },
  { name: 'Fatehpur', x: 56, y: 55, size: 'sm' },
  { name: 'Sultanpur', x: 68, y: 46, size: 'sm' },
  { name: 'Azamgarh', x: 76, y: 42, size: 'sm' },
  { name: 'Basti', x: 72, y: 30, size: 'sm' },
  { name: 'Bahraich', x: 58, y: 22, size: 'sm' },
  { name: 'Sitapur', x: 50, y: 30, size: 'sm' },
  { name: 'Hardoi', x: 44, y: 34, size: 'sm' },
  { name: 'Unnao', x: 48, y: 46, size: 'sm' },
  { name: 'Rae Bareli', x: 56, y: 50, size: 'sm' },
  { name: 'Banda', x: 42, y: 60, size: 'sm' },
  { name: 'Mirzapur', x: 70, y: 60, size: 'sm' },
  { name: 'Sonbhadra', x: 78, y: 65, size: 'sm' },
  { name: 'Ghaziabad', x: 14, y: 16, size: 'sm' },
  { name: 'Saharanpur', x: 18, y: 5, size: 'sm' },
  { name: 'Muzaffarnagar', x: 16, y: 8, size: 'sm' },
  { name: 'Lakhimpur Kheri', x: 52, y: 16, size: 'sm' },
  { name: 'Gonda', x: 64, y: 28, size: 'sm' },
  { name: 'Deoria', x: 82, y: 34, size: 'sm' },
  { name: 'Ballia', x: 86, y: 42, size: 'sm' },
  { name: 'Jaunpur', x: 74, y: 50, size: 'sm' },
  { name: 'Pratapgarh', x: 64, y: 50, size: 'sm' },
  { name: 'Hamirpur', x: 34, y: 58, size: 'sm' },
];

function generateDistrictData(name: string): DistrictData {
  // Seeded pseudo-random based on name for consistency
  let seed = 0;
  for (let i = 0; i < name.length; i++) seed += name.charCodeAt(i);
  const r = (min: number, max: number) => { seed = (seed * 9301 + 49297) % 233280; return min + (seed / 233280) * (max - min); };
  return {
    name,
    mmr: Math.round(r(80, 220)),
    registered: Math.round(r(500, 5000)),
    hrp: Math.round(r(50, 500)),
    ancCoverage: Math.round(r(40, 95)),
    aiCallReach: Math.round(r(30, 85)),
  };
}

export const UPDistrictMap: React.FC<UPDistrictMapProps> = ({ onSelectDistrict, selectedDistrict }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const districtDataMap = useMemo(() => {
    const map: Record<string, DistrictData> = {};
    DISTRICT_POSITIONS.forEach(d => { map[d.name] = generateDistrictData(d.name); });
    return map;
  }, []);

  const hovered = hoveredDistrict ? districtDataMap[hoveredDistrict] : null;
  const selected = selectedDistrict ? districtDataMap[selectedDistrict] : null;
  const detail = hovered || selected;

  const getColor = (name: string) => {
    const d = districtDataMap[name];
    if (!d) return '#64748b';
    if (d.mmr > 180) return '#ef4444';
    if (d.mmr > 150) return '#f97316';
    if (d.mmr > 120) return '#f59e0b';
    return '#10b981';
  };

  const getRadius = (size: 'lg' | 'md' | 'sm') => size === 'lg' ? 3.5 : size === 'md' ? 2.5 : 1.8;

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)',
      padding: 16, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <MapPin size={16} color="#3b82f6" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Uttar Pradesh — District Risk Map</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Click a district to drill down · Color = MMR severity</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg viewBox="0 0 100 72" style={{ width: '100%', height: 'auto', minHeight: 220 }}>
            {/* UP outline (simplified) */}
            <path d="M8,2 L28,1 L42,8 L56,6 L68,12 L80,10 L90,18 L88,28 L92,38 L88,48 L82,55 L76,62 L68,68 L58,65 L48,68 L38,66 L28,68 L18,62 L12,52 L8,42 L6,30 L4,18 Z"
              fill="var(--subtle-bg)" stroke="var(--border)" strokeWidth="0.5" />

            {/* District dots */}
            {DISTRICT_POSITIONS.map(d => {
              const isHovered = hoveredDistrict === d.name;
              const isSelected = selectedDistrict === d.name;
              const color = getColor(d.name);
              const radius = getRadius(d.size);
              return (
                <g key={d.name}
                  onMouseEnter={() => setHoveredDistrict(d.name)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  onClick={() => onSelectDistrict(d.name)}
                  style={{ cursor: 'pointer' }}
                >
                  {(isHovered || isSelected) && (
                    <circle cx={d.x} cy={d.y} r={radius + 3} fill={color} opacity={0.15} />
                  )}
                  <circle cx={d.x} cy={d.y} r={isHovered || isSelected ? radius + 1 : radius}
                    fill={color} stroke={isSelected ? 'var(--text-primary)' : 'none'} strokeWidth={0.5}
                    opacity={isHovered || isSelected ? 1 : 0.8} />
                  {(d.size === 'lg' || isHovered || isSelected) && (
                    <text x={d.x} y={d.y + radius + 4} textAnchor="middle"
                      fontSize={isHovered || isSelected ? 3 : 2.5}
                      fill="var(--text-secondary)" fontWeight={isSelected ? 700 : 500}>
                      {d.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
            {[
              { label: 'MMR > 180', color: '#ef4444' },
              { label: '150-180', color: '#f97316' },
              { label: '120-150', color: '#f59e0b' },
              { label: '< 120', color: '#10b981' },
            ].map(l => (
              <span key={l.label} style={{ fontSize: 9, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div style={{ width: 200, flexShrink: 0 }}>
          {detail ? (
            <div className="animate-fade-in">
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{detail.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'MMR', value: `${detail.mmr}`, unit: 'per 100k', color: detail.mmr > 180 ? '#ef4444' : detail.mmr > 150 ? '#f97316' : detail.mmr > 120 ? '#f59e0b' : '#10b981' },
                  { label: 'Registered', value: detail.registered.toLocaleString(), unit: 'pregnancies', color: '#3b82f6' },
                  { label: 'HRP Cases', value: detail.hrp.toLocaleString(), unit: 'high risk', color: '#f97316' },
                  { label: 'ANC Coverage', value: `${detail.ancCoverage}%`, unit: '', color: detail.ancCoverage >= 80 ? '#10b981' : '#f59e0b' },
                  { label: 'AI Call Reach', value: `${detail.aiCallReach}%`, unit: '', color: detail.aiCallReach >= 60 ? '#10b981' : '#f59e0b' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{row.label}</span>
                    <div>
                      <span style={{ fontSize: 16, fontWeight: 700, color: row.color }}>{row.value}</span>
                      {row.unit && <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 3 }}>{row.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: '6px 8px', borderRadius: 6, background: 'var(--subtle-bg)', border: '1px solid var(--border)', fontSize: 9, color: 'var(--text-muted)' }}>
                India avg: 97 · UP avg: 167 · TN: 35
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: 11 }}>
              Hover or click a district to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
