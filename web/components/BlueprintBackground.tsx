/**
 * Decorative engineering drawings that "draw" themselves on a loop over the
 * blueprint grid. Animation and placement live in styles/blueprint.css.
 * Each shape uses pathLength={1} for the pen effect; s1–s5 stagger strokes.
 */
export default function BlueprintBackground() {
  return (
    <div className="blueprint" aria-hidden="true">
      {/* Spur gear with centerlines and diameter dimension */}
      <svg className="bp-drawing bp-gear" viewBox="0 0 200 215">
        <path
          className="bp-line s1"
          pathLength={1}
          d="M166.0 100.0 L179.6 107.5 L178.1 117.5 L162.8 120.4 L157.2 133.0 L165.2 146.3 L158.9 154.2 L144.2 149.0 L133.0 157.2 L133.3 172.7 L123.9 176.3 L113.7 164.6 L100.0 166.0 L92.5 179.6 L82.5 178.1 L79.6 162.8 L67.0 157.2 L53.7 165.2 L45.8 158.9 L51.0 144.2 L42.8 133.0 L27.3 133.3 L23.7 123.9 L35.4 113.7 L34.0 100.0 L20.4 92.5 L21.9 82.5 L37.2 79.6 L42.8 67.0 L34.8 53.7 L41.1 45.8 L55.8 51.0 L67.0 42.8 L66.7 27.3 L76.1 23.7 L86.3 35.4 L100.0 34.0 L107.5 20.4 L117.5 21.9 L120.4 37.2 L133.0 42.8 L146.3 34.8 L154.2 41.1 L149.0 55.8 L157.2 67.0 L172.7 66.7 L176.3 76.1 L164.6 86.3 Z"
        />
        <circle className="bp-line s2" pathLength={1} cx="100" cy="100" r="24" />
        <path className="bp-line s3" pathLength={1} d="M100 88 a12 12 0 1 0 0.01 0 M96 88.7 V83 H104 V88.7" />
        <path className="bp-dim s4" pathLength={1} d="M100 8 V192 M8 100 H192" />
        <path
          className="bp-dim s5"
          pathLength={1}
          d="M20 200 H180 M20 194 V206 M180 194 V206 M26 197 L20 200 L26 203 M174 197 L180 200 L174 203"
        />
        <text className="bp-label" x="100" y="213" textAnchor="middle">Ø160</text>
      </svg>

      {/* L-bracket with holes, fillet, and dimensions */}
      <svg className="bp-drawing bp-bracket" viewBox="0 0 250 190">
        <path className="bp-line s1" pathLength={1} d="M30 150 H230 V130 H82 A12 12 0 0 1 70 118 V30 H30 Z" />
        <circle className="bp-line s2" pathLength={1} cx="50" cy="60" r="8" />
        <circle className="bp-line s2" pathLength={1} cx="50" cy="100" r="8" />
        <circle className="bp-line s3" pathLength={1} cx="130" cy="140" r="5" />
        <circle className="bp-line s3" pathLength={1} cx="195" cy="140" r="5" />
        <path
          className="bp-dim s4"
          pathLength={1}
          d="M30 155 V178 M230 155 V178 M30 172 H230 M36 169 L30 172 L36 175 M224 169 L230 172 L224 175"
        />
        <path
          className="bp-dim s5"
          pathLength={1}
          d="M25 30 H6 M25 150 H6 M12 30 V150 M9 36 L12 30 L15 36 M9 144 L12 150 L15 144"
        />
        <text className="bp-label" x="130" y="186" textAnchor="middle">200</text>
        <text className="bp-label" x="20" y="94" textAnchor="middle" transform="rotate(-90 20 90)">120</text>
        <text className="bp-label" x="92" y="112">R12</text>
      </svg>

      {/* Hex nut, top view */}
      <svg className="bp-drawing bp-hex" viewBox="0 0 160 175">
        <polygon
          className="bp-line s1"
          pathLength={1}
          points="135.0,80.0 107.5,127.6 52.5,127.6 25.0,80.0 52.5,32.4 107.5,32.4"
        />
        <circle className="bp-line s2" pathLength={1} cx="80" cy="80" r="47.6" />
        <circle className="bp-line s3" pathLength={1} cx="80" cy="80" r="20" />
        <path className="bp-line s4" pathLength={1} d="M80 56 A24 24 0 1 1 56 80" />
        <path className="bp-dim s5" pathLength={1} d="M80 14 V146 M14 80 H146" />
        <text className="bp-label" x="80" y="168" textAnchor="middle">M24 HEX</text>
      </svg>

      {/* Drawing title block */}
      <svg className="bp-drawing bp-title" viewBox="0 0 260 100">
        <rect className="bp-line s1" pathLength={1} x="2" y="2" width="256" height="96" />
        <path className="bp-line s2" pathLength={1} d="M2 34 H258 M2 66 H258 M150 34 V98 M205 66 V98" />
        <text className="bp-label" x="10" y="14">TITLE</text>
        <text className="bp-label bp-label--lg" x="10" y="28">PERSONAL PORTFOLIO</text>
        <text className="bp-label" x="10" y="46">DRAWN BY</text>
        <text className="bp-label bp-label--lg" x="10" y="60">D. NAHLIK</text>
        <text className="bp-label" x="158" y="46">DWG NO.</text>
        <text className="bp-label bp-label--lg" x="158" y="60">DN-001</text>
        <text className="bp-label" x="10" y="78">CAPA • LEAN SIX SIGMA</text>
        <text className="bp-label" x="158" y="78">SCALE</text>
        <text className="bp-label bp-label--lg" x="158" y="92">1:1</text>
        <text className="bp-label" x="213" y="78">REV</text>
        <text className="bp-label bp-label--lg" x="213" y="92">A</text>
      </svg>
    </div>
  );
}
