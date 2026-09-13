import "./WireframeMonitorObject.css";

type WireframeMonitorObjectProps = {
  size?: number;
  glowColor?: string;
  screenColor?: string;
};

export default function WireframeMonitorObject({
  size = 180,
  glowColor = "#00ffff",
  screenColor = "rgba(220, 250, 255, 0.08)",
}: WireframeMonitorObjectProps) {
  return (
    <div
      className="wireframeMonitorScene"
      style={
        {
          "--monitor-size": `${size}px`,
          "--monitor-glow": glowColor,
          "--monitor-screen": screenColor,
        } as React.CSSProperties
      }
    >
      <div className="wireframeMonitor">
        {/* Monitor body */}
        <div className="wireframeMonitorBody">
          {/* Front display frame */}
          <div className="wireframeMonitorFrame">
            <div className="wireframeMonitorScreen" />
          </div>

          {/* Visible side depth */}
          <div className="wireframeMonitorSide" />

          {/* Top depth surface */}
          <div className="wireframeMonitorTop" />
        </div>

        {/* Monitor stand */}
        <div className="wireframeMonitorStand">
          <div className="wireframeMonitorStandNeck" />
          <div className="wireframeMonitorStandBase" />
        </div>
      </div>
    </div>
  );
}
