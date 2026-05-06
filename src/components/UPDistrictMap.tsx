import React, { useMemo, useState, useEffect } from 'react';
import * as topojson from 'topojson-client';
import type { Mother } from '../types';

interface UPDistrictMapProps {
  mothers: Mother[];
  onDistrictClick?: (district: string) => void;
  selectedDistrict?: string;
}

interface DistrictFeature {
  district: string;
  path: string;
  centroid: [number, number];
}

// Simple geo projection: Mercator-like scaling for UP's bounding box
function projectPoint(lon: number, lat: number, bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number }, width: number, height: number, padding: number): [number, number] {
  const x = padding + ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * (width - 2 * padding);
  const y = padding + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (height - 2 * padding);
  return [x, y];
}

function coordsToPath(coords: number[][][], bounds: { minLon: number; maxLon: number; minLat: number; maxLat: number }, width: number, height: number, padding: number): string {
  return coords.map(ring => {
    return ring.map((pt, i) => {
      const [x, y] = projectPoint(pt[0], pt[1], bounds, width, height, padding);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ') + ' Z';
  }).join(' ');
}

function getCentroid(coords: number[][][]): [number, number] {
  let sumX = 0, sumY = 0, count = 0;
  coords[0].forEach(pt => { sumX += pt[0]; sumY += pt[1]; count++; });
  return [sumX / count, sumY / count];
}

function getRiskColor(hrpCount: number, total: number): string {
  if (total === 0) return 'var(--bg-secondary)';
  const ratio = hrpCount / total;
  if (ratio >= 0.5) return '#dc2626';
  if (ratio >= 0.35) return '#ea580c';
  if (ratio >= 0.2) return '#f59e0b';
  if (ratio >= 0.1) return '#eab308';
  return '#22c55e';
}

const SVG_WIDTH = 560;
const SVG_HEIGHT = 480;
const PADDING = 20;

export const UPDistrictMap: React.FC<UPDistrictMapProps> = ({ mothers, onDistrictClick, selectedDistrict }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [features, setFeatures] = useState<DistrictFeature[]>([]);
  const [bounds, setBounds] = useState<{ minLon: number; maxLon: number; minLat: number; maxLat: number } | null>(null);

  // Load and parse TopoJSON
  useEffect(() => {
    import('../data/up-districts.topo.json').then((topoData) => {
      const geo = topojson.feature(topoData as any, (topoData as any).objects.districts) as any;

      // Calculate bounds
      let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
      geo.features.forEach((f: any) => {
        const coords = f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates.flat() : f.geometry.coordinates;
        coords.forEach((ring: number[][]) => {
          ring.forEach((pt: number[]) => {
            if (pt[0] < minLon) minLon = pt[0];
            if (pt[0] > maxLon) maxLon = pt[0];
            if (pt[1] < minLat) minLat = pt[1];
            if (pt[1] > maxLat) maxLat = pt[1];
          });
        });
      });

      const b = { minLon, maxLon, minLat, maxLat };
      setBounds(b);

      const parsed: DistrictFeature[] = geo.features.map((f: any) => {
        const district = f.properties.district;
        let path: string;
        let centroidCoords: [number, number];

        if (f.geometry.type === 'MultiPolygon') {
          path = f.geometry.coordinates.map((poly: number[][][]) =>
            coordsToPath(poly, b, SVG_WIDTH, SVG_HEIGHT, PADDING)
          ).join(' ');
          centroidCoords = getCentroid(f.geometry.coordinates[0]);
        } else {
          path = coordsToPath(f.geometry.coordinates, b, SVG_WIDTH, SVG_HEIGHT, PADDING);
          centroidCoords = getCentroid(f.geometry.coordinates);
        }

        const [cx, cy] = projectPoint(centroidCoords[0], centroidCoords[1], b, SVG_WIDTH, SVG_HEIGHT, PADDING);
        return { district, path, centroid: [cx, cy] as [number, number] };
      });

      setFeatures(parsed);
    });
  }, []);

  const districtData = useMemo(() => {
    const data: Record<string, { total: number; hrp: number; critical: number }> = {};
    mothers.forEach(m => {
      if (!data[m.district]) data[m.district] = { total: 0, hrp: 0, critical: 0 };
      data[m.district].total++;
      if (m.riskLevel === 'high' || m.riskLevel === 'critical') data[m.district].hrp++;
      if (m.riskLevel === 'critical') data[m.district].critical++;
    });
    return data;
  }, [mothers]);

  const tooltipData = hoveredDistrict ? (districtData[hoveredDistrict] || { total: 0, hrp: 0, critical: 0 }) : null;

  if (features.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 12 }}>
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Title */}
      <div style={{ position: 'absolute', top: 12, left: 16, zIndex: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
          Uttar Pradesh — HRP Heatmap
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
          75 districts • Click to filter • Color = HRP density
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
            {tooltipData.total > 0 && (
              <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--text-muted)' }}>
                HRP Rate: {Math.round((tooltipData.hrp / tooltipData.total) * 100)}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* SVG Map */}
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        style={{ width: '100%', height: '100%' }}
        aria-label="Uttar Pradesh district heatmap showing high-risk pregnancy distribution"
      >
        {features.map(({ district, path, centroid }) => {
          const data = districtData[district] || { total: 0, hrp: 0, critical: 0 };
          const color = data.total > 0 ? getRiskColor(data.hrp, data.total) : 'var(--bg-secondary)';
          const isHovered = hoveredDistrict === district;
          const isSelected = selectedDistrict === district;
          const hasCritical = data.critical > 0;

          return (
            <g key={district}>
              {/* Pulse for critical */}
              {hasCritical && (
                <circle cx={centroid[0]} cy={centroid[1]} r="8" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6">
                  <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* District path */}
              <path
                d={path}
                fill={color}
                stroke={isSelected ? '#ffffff' : isHovered ? '#e2e8f0' : 'rgba(255,255,255,0.3)'}
                strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.5}
                opacity={isHovered || isSelected ? 1 : 0.88}
                style={{
                  cursor: 'pointer',
                  transition: 'opacity 0.15s, stroke-width 0.15s',
                }}
                onMouseEnter={() => setHoveredDistrict(district)}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => onDistrictClick?.(district)}
                role="button"
                aria-label={`${district}: ${data.total} pregnancies, ${data.hrp} high-risk`}
              />

              {/* District label — only show for districts with data or when hovered */}
              {(data.total > 0 || isHovered) && (
                <text
                  x={centroid[0]}
                  y={centroid[1] + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontSize="7"
                  fontWeight="600"
                  style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  {data.total > 0 ? `${district.slice(0, 8)}` : district.slice(0, 8)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
