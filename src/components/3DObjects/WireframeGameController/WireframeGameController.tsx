import "./WireframeGameController.css";

type WireframeGameControllerProps = {
  size?: number;
  color?: string;
  glowColor?: string;
};

export default function WireframeGameController({
  size = 180,
  color = "rgba(255, 255, 255, 0.08)",
  glowColor = "#00ffff",
}: WireframeGameControllerProps) {
  return (
    <div
      className="wireframeControllerScene"
      style={
        {
          "--controller-size": `${size}px`,
          "--controller-color": color,
          "--controller-glow": glowColor,
        } as React.CSSProperties
      }
    >
      <div className="wireframeController">
        {/* Main controller body */}
        <div className="wireframeControllerBody">
          {/* Left handle */}
          <div className="wireframeControllerHandle wireframeControllerHandleLeft" />

          {/* Right handle */}
          <div className="wireframeControllerHandle wireframeControllerHandleRight" />

          {/* Main center body */}
          <div className="wireframeControllerMain" />

          {/* Left analog stick */}
          <div className="wireframeControllerStick wireframeControllerStickLeft" />

          {/* Right analog stick */}
          <div className="wireframeControllerStick wireframeControllerStickRight" />

          {/* D-pad */}
          <div className="wireframeControllerDpad">
            <div className="wireframeControllerDpadHorizontal" />
            <div className="wireframeControllerDpadVertical" />
          </div>

          {/* Face buttons */}
          <div className="wireframeControllerButtons">
            <div className="wireframeControllerButton buttonTop">△</div>
            <div className="wireframeControllerButton buttonRight">○</div>
            <div className="wireframeControllerButton buttonBottom">×</div>
            <div className="wireframeControllerButton buttonLeft">□</div>
          </div>

          {/* Center buttons */}
          <div className="wireframeControllerCenterButtons">
            <div />
            <div />
          </div>

          {/* Small depth layer */}
          <div className="wireframeControllerDepth" />
        </div>
      </div>
    </div>
  );
}
