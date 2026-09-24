// Displays a centered logo inside a simple rectangular banner.

import "./LogoBanner.css";
type LogoBannerProps = {
  image: string;
  backgroundImage: string;
  height?: string;
};

export default function LogoBanner({
  image,
  backgroundImage,
  height = "240px",
}: LogoBannerProps) {
  return (
    <div
      className="logoBanner"
      style={
        {
          width: "100%",
          height,
          minWidth: 0,
          minHeight: 0,

          padding: 0,
          boxSizing: "border-box",

          "--logo-background": `url(${backgroundImage})`,

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          overflow: "hidden",
        } as React.CSSProperties & {
          "--logo-background": string;
        }
      }
    >
      <img
        src={image}
        className="logoBannerImage"
        alt="Company logo"
        style={{
          display: "block",
          width: "32%",
          height: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          transition: "transform 250ms ease, filter 250ms ease",
        }}
      />
    </div>
  );
}
