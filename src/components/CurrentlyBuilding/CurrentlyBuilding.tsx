// Displays the projects currently being worked on and their descriptions.

import { useEffect, useState } from "react";
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

  useEffect(() => {
    // Stop the rotation completely when the screen is inactive.
    if (!isActive || projects.length <= 1) {
      return;
    }

    // Keep the current project visible long enough to read.
    const timer = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % projects.length);
    }, 9000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isActive, projects.length]);

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

      <div className="currentlyBuildingDescription">
        <DecodeText
          text={currentProject.description}
          fontSize={`${cubeSize * 0.019}px`}
          padding="0"
          wrap
        />
      </div>
    </div>
  );
}
