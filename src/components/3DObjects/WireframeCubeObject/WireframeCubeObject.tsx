import "./WireframeCubeObject.css";

type WireframeCubeObjectProps = {
  size?: number;
  color?: string;
  lineWidth?: number;

  /*
    Position relative to the Home face.
  */
  x?: number;
  y?: number;
  z?: number;

  /*
    Starting 3D rotation.
  */
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
};

export default function WireframeCubeObject({
  size = 100,
  color = "#00ffff",
  lineWidth = 2,

  x = 0,
  y = 0,
  z = 0,

  rotateX = -20,
  rotateY = -35,
  rotateZ = 0,
}: WireframeCubeObjectProps) {
  /*
    The cube is always a perfect cube.
    Half of the size determines how far each face
    sits from the center.
  */
  const halfSize = size / 2;

  return (
    <div
      className="wireframeCubeScene"
      style={{
        width: `${size}px`,
        height: `${size}px`,

        /*
          Position this object inside the Home face.
        */
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
      }}
    >
      <div
        className="wireframeCube"
        style={
          {
            /*
              All six faces use the exact same dimensions.
            */
            "--wireframe-cube-size": `${size}px`,
            "--wireframe-cube-half": `${halfSize}px`,

            "--wireframe-cube-color": color,
            "--wireframe-cube-line-width": `${lineWidth}px`,

            /*
              Individual starting angle of this cube.
            */
            "--wireframe-cube-rotate-x": `${rotateX}deg`,
            "--wireframe-cube-rotate-y": `${rotateY}deg`,
            "--wireframe-cube-rotate-z": `${rotateZ}deg`,
          } as React.CSSProperties
        }
      >
        {/* Six physical faces make up the cube. */}
        <div className="wireframeCubeFace wireframeCubeFront" />
        <div className="wireframeCubeFace wireframeCubeBack" />
        <div className="wireframeCubeFace wireframeCubeRight" />
        <div className="wireframeCubeFace wireframeCubeLeft" />
        <div className="wireframeCubeFace wireframeCubeTop" />
        <div className="wireframeCubeFace wireframeCubeBottom" />
      </div>
    </div>
  );
}
