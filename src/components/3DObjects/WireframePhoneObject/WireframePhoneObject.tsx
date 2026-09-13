import "./WireframePhoneObject.css";

type WireframePhoneObjectProps = {
  size?: number;
  depth?: number;

  // Position inside the shared 3D scene.
  x?: number;
  y?: number;
  z?: number;

  // Initial orientation of the complete phone object.
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;

  color?: string;
};

export default function WireframePhoneObject({
  size = 150,
  depth = 18,

  x = 0,
  y = 0,
  z = 0,

  rotateX = 0,
  rotateY = -20,
  rotateZ = 0,

  color = "#00f0ff",
}: WireframePhoneObjectProps) {
  return (
    <div
      className="wireframe-phone"
      style={
        {
          "--phone-size": `${size}px`,
          "--phone-depth": `${depth}px`,
          "--phone-x": `${x}px`,
          "--phone-y": `${y}px`,
          "--phone-z": `${z}px`,
          "--phone-rotate-x": `${rotateX}deg`,
          "--phone-rotate-y": `${rotateY}deg`,
          "--phone-rotate-z": `${rotateZ}deg`,
          "--phone-color": color,
        } as React.CSSProperties
      }
    >
      <div className="wireframe-phone__object">
        <svg
          className="wireframe-phone__svg"
          viewBox="0 0 180 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter
              id="phoneGlow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glow layer */}
          <g className="wireframe-phone__glow" filter="url(#phoneGlow)">
            <rect x="25" y="25" width="120" height="250" rx="22" />
            <rect x="37" y="48" width="96" height="204" rx="14" />

            {/* Phone depth */}
            <path d={`M25 25 L${25 + depth} ${25 - depth}`} />
            <path d={`M145 25 L${145 + depth} ${25 - depth}`} />
            <path d={`M145 275 L${145 + depth} ${275 - depth}`} />
            <path d={`M25 275 L${25 + depth} ${275 - depth}`} />
          </g>

          {/* Main front phone */}
          <g className="wireframe-phone__main">
            {/* Rounded phone body */}
            <rect
              className="wireframe-phone__body"
              x="25"
              y="25"
              width="120"
              height="250"
              rx="22"
            />

            {/* Screen */}
            <rect
              className="wireframe-phone__screen"
              x="37"
              y="48"
              width="96"
              height="204"
              rx="14"
            />

            {/* Speaker */}
            <path className="wireframe-phone__detail" d="M72 38 L96 38" />

            {/* Camera */}
            <circle
              className="wireframe-phone__detail"
              cx="106"
              cy="38"
              r="3"
            />

            {/* Home indicator */}
            <path className="wireframe-phone__detail" d="M72 263 L98 263" />

            {/* Side buttons */}
            <path
              className="wireframe-phone__detail"
              d="M21 100 L25 100 L25 135 L21 135"
            />

            <path
              className="wireframe-phone__detail"
              d="M145 115 L149 115 L149 155 L145 155"
            />
          </g>

          {/* Back/depth silhouette */}
          <g className="wireframe-phone__depth">
            <rect
              x={25 + depth}
              y={25 - depth}
              width="120"
              height="250"
              rx="22"
            />

            <path d={`M25 25 L${25 + depth} ${25 - depth}`} />
            <path d={`M145 25 L${145 + depth} ${25 - depth}`} />
            <path d={`M145 275 L${145 + depth} ${275 - depth}`} />
            <path d={`M25 275 L${25 + depth} ${275 - depth}`} />
          </g>
        </svg>
      </div>
    </div>
  );
}
