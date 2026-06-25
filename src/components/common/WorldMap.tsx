import { useMemo } from 'react'
import { geoEquirectangular, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import worldTopoData from 'world-atlas/countries-110m.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const topo = worldTopoData as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const worldData: any = feature(topo, topo.objects.countries)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const worldFeatures: any[] = worldData.features ?? worldData

interface WorldMapProps {
  width?: number
  height?: number
  className?: string
}

export default function RealWorldMap({ width = 1000, height = 520, className = '' }: WorldMapProps) {
  const pathGenerator = useMemo(() => {
    const projection = geoEquirectangular()
      .translate([width / 2, height / 2])
      .scale(width / (2 * Math.PI))
    return geoPath(projection)
  }, [width, height])

  const countryPaths = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      worldFeatures.map((f: any, i: number) => {
        const d = pathGenerator(f)
        return d ? <path key={i} d={d} /> : null
      }),
    [pathGenerator]
  )

  return (
    <svg
      className={`h-full w-full text-brand-800 ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="世界地图"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="rmap-grid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M 44 0 L 0 0 0 44" fill="none" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#rmap-grid)" opacity="0.5" />

      <g
        fill="currentColor"
        opacity="0.10"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="0.5"
      >
        {countryPaths}
      </g>

      <g fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.8" strokeDasharray="5 4">
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} />
      </g>
    </svg>
  )
}
