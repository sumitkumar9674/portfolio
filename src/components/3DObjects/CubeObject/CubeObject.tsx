import "./CubeObject.css";

type CubeObjectProps = {
  size?: number;
  color?: string;
  glowColor?: string;
};

export default function CubeObject({
  size = 80,
  color = "#020617",
  glowColor = "#00ffff",
}: CubeObjectProps) {
  const halfSize = size / 2;

  return (
    <div
      className="objectCubeScene"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div
        className="objectCube"
        style={
          {
            "--object-cube-size": `${size}px`,
            "--object-cube-half": `${halfSize}px`,
            "--object-cube-color": color,
            "--object-cube-glow": glowColor,
          } as React.CSSProperties
        }
      >
        {/* Front face */}
        <div className="objectCubeFace objectCubeFront" />

        {/* Back face */}
        <div className="objectCubeFace objectCubeBack" />

        {/* Right face */}
        <div className="objectCubeFace objectCubeRight" />

        {/* Left face */}
        <div className="objectCubeFace objectCubeLeft" />

        {/* Top face */}
        <div className="objectCubeFace objectCubeTop" />

        {/* Bottom face */}
        <div className="objectCubeFace objectCubeBottom" />
      </div>
    </div>
  );
}
