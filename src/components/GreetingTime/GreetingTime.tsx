import { useEffect, useState } from "react";
import { siteContent } from "../../content/siteContent";
import "./GreetingTime.css";

type GreetingTimeProps = {
  cubeSize: number;
};

export default function GreetingTime({ cubeSize }: GreetingTimeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const hour = currentTime.getHours();

  const greeting =
    hour < 12 ? siteContent.greeting.morning : hour < 18 ? siteContent.greeting.afternoon : siteContent.greeting.evening;

  const time = currentTime.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className="greetingTime"
      style={
        {
          "--cube-size": `${cubeSize}px`,
        } as React.CSSProperties
      }
    >
      <div className="greetingTimeText">{greeting}</div>

      <div className="greetingTimeClock">{time}</div>
    </div>
  );
}
