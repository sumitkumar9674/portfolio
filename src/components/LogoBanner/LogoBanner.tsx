// Displays a centered logo inside a simple rectangular banner.
type LogoBannerProps = {
  image: string;
  backgroundImage: string;
};

export default function LogoBanner({
  image,
  backgroundImage,
}: LogoBannerProps) {
  return (
    <div
      className="logoBanner"
      style={{
        width: "100%",
        height: "240px",
        padding: "30px 20px",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <img
        src={image}
        className="logoBannerImage"
        alt="Company logo"
        style={{
          display: "block",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          transition: "transform 250ms ease, filter 250ms ease",
        }}
      />
    </div>
  );
}
