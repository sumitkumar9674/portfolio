import "./WireframePCObject.css";

type WireframePCObjectProps = {
  size?: number;
  color?: string;
  glowColor?: string;
};

export default function WireframePCObject({
  size = 180,
  color = "#a93097",
  glowColor = "#00ffff",
}: WireframePCObjectProps) {
  return (
    <div
      className="wireframePCScene"
      style={
        {
          "--pc-size": `${size}px`,
          "--pc-color": color,
          "--pc-glow": glowColor,
        } as React.CSSProperties
      }
    >
      <div className="wireframePC">
        {/* Desktop tower */}
        <div className="wireframePCTower">
          <div className="wireframePCTowerFront" />
          <div className="wireframePCTowerSide" />
          <div className="wireframePCTowerTop" />

          {/* Decorative front details */}
          <div className="wireframePCTowerLine wireframePCTowerLineOne" />
          <div className="wireframePCTowerLine wireframePCTowerLineTwo" />
          <div className="wireframePCTowerButton" />
        </div>
      </div>
    </div>
  );
}
