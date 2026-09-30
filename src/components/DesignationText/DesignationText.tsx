import { useEffect, useState } from "react";
import "./DesignationText.css";
import NeonText from "../NeonText";

type DesignationTextProps = {
  designations: string[];
  fontSize?: string | number;
  padding?: string | number;
};

export default function DesignationText({
  designations,
  fontSize = "16px",
  padding = "0",
}: DesignationTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Change designation continuously while this component is mounted.
    const timer = window.setInterval(() => {
      setCurrentIndex((current) => {
        return (current + 1) % designations.length;
      });
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [designations.length]);

  return (
    <div className="designationText" style={{ padding }}>
      <NeonText
        text={designations[currentIndex]}
        isActive={true}
        fontSize={fontSize}
        textColor="#d3ddd4"
        fontFamily="Bespoke Stencil"
        backgroundColor="transparent"
      />
    </div>
  );
}
