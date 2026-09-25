// Displays the projects currently being worked on and their descriptions.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DesignationText from "../DesignationText/DesignationText";
import DecodeText from "../DecodeText/DecodeText";
import "./CurrentlyBuilding.css";

type Project = {
  name: string;
  description: string;
};

type CurrentlyBuildingProps = {
  projects: Project[];
  isActive: boolean;
  cubeSize: number;
};

export default function CurrentlyBuilding({
  projects,
  isActive,
  cubeSize,
}: CurrentlyBuildingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState(
    cubeSize * 0.019,
  );

  const descriptionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Stop the rotation completely when the screen is inactive.
    if (!isActive || projects.length <= 1) {
      return;
    }

    // Keep the current project visible long enough to read.
    const timer = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % projects.length);
    }, 21000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isActive, projects.length]);

  useLayoutEffect(() => {
    if (!isActive || projects.length === 0) {
      return;
    }

    const baseFontSize = cubeSize * 0.019;

    setDescriptionFontSize(baseFontSize);

    const descriptionElement = descriptionRef.current;

    if (!descriptionElement) {
      return;
    }

    let frame = 0;

    const fitText = () => {
      const availableHeight = descriptionElement.clientHeight;

      if (availableHeight <= 0) {
        return;
      }

      let fontSize = baseFontSize;

      descriptionElement.style.fontSize = `${fontSize}px`;

      while (
        descriptionElement.scrollHeight > availableHeight &&
        fontSize > cubeSize * 0.01
      ) {
        fontSize -= 0.5;
        descriptionElement.style.fontSize = `${fontSize}px`;
      }

      while (
        descriptionElement.scrollHeight <= availableHeight &&
        fontSize < baseFontSize
      ) {
        const nextFontSize = fontSize + 0.5;

        descriptionElement.style.fontSize = `${nextFontSize}px`;

        if (descriptionElement.scrollHeight > availableHeight) {
          break;
        }

        fontSize = nextFontSize;
      }

      setDescriptionFontSize(fontSize);
    };

    frame = window.requestAnimationFrame(fitText);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [currentIndex, cubeSize, isActive, projects.length]);

  if (!isActive || projects.length === 0) {
    return null;
  }

  const currentProject = projects[currentIndex];

  return (
    <div
      className="currentlyBuilding"
      style={
        {
          "--cube-size": `${cubeSize}px`,
        } as React.CSSProperties
      }
    >
      <div className="currentlyBuildingHeader">
        <div className="currentlyBuildingLabel">Currently Working</div>

        <div className="currentlyBuildingProject">
          <DesignationText
            designations={[currentProject.name]}
            isActive={isActive}
            fontSize={`${cubeSize * 0.021}px`}
          />
        </div>
      </div>

      <div ref={descriptionRef} className="currentlyBuildingDescription">
        <DecodeText
          text={currentProject.description}
          fontSize={`${descriptionFontSize}px`}
          padding="0"
          wrap
        />
      </div>
    </div>
  );
}
