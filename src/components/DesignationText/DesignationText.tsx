import { useEffect, useState } from "react";
import DecodeText from "../DecodeText/DecodeText";
import "./DesignationText.css";

type DesignationTextProps = {
  designations: string[];
  isActive: boolean;
  fontSize?: string | number;
  padding?: string | number;
};

export default function DesignationText({
  designations,
  isActive,
  fontSize = "16px",
  padding = "0",
}: DesignationTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Stop completely when the screen is not active.
    if (!isActive) {
      return;
    }

    // Change designation after the configured interval.
    const timer = window.setInterval(() => {
      setCurrentIndex((current) => {
        return (current + 1) % designations.length;
      });
    }, 5000);

    // Stop the cycle when the screen becomes inactive.
    return () => {
      window.clearInterval(timer);
    };
  }, [isActive, designations.length]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="designationText">
      <DecodeText
        text={designations[currentIndex]}
        fontSize={fontSize}
        padding={padding}
      />
    </div>
  );
}
