import "./GitHubActivity.css";
import { GitHubCalendar } from "react-github-calendar";

const transformContributions = (
  data: {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }[],
) => {
  return data.map((day) => {
    // Keep real GitHub contributions unchanged.
    if (day.count > 0) {
      return day;
    }

    // Create a stable seed from the date.
    let seed = 0;

    for (let i = 0; i < day.date.length; i++) {
      seed = (seed << 5) - seed + day.date.charCodeAt(i);
      seed |= 0;
    }

    // Seeded pseudo-random number between 0 and 1.
    const random = Math.abs(Math.sin(seed)) % 1;

    // 33% remain empty.
    if (random < 0.33) {
      return day;
    }

    // 61% become 1 contribution.
    if (random < 0.94) {
      return {
        ...day,
        count: 1,
        level: 1 as const,
      };
    }

    // 5.5% become 2 contributions.
    if (random < 0.995) {
      return {
        ...day,
        count: 2,
        level: 2 as const,
      };
    }

    // Remaining 0.5% become 3 contributions.
    return {
      ...day,
      count: 3,
      level: 3 as const,
    };
  });
};

type GitHubActivityProps = {
  _cubeSize: number;
};

export default function GitHubActivity({ _cubeSize }: GitHubActivityProps) {
  const calendarHorizontalPadding = _cubeSize * 0.024;
  const availableCalendarWidth = _cubeSize - calendarHorizontalPadding;

  const blockSize = Math.floor(_cubeSize / 59);

  const blockMargin = Math.max(
    0,
    (availableCalendarWidth - 53 * blockSize) / 56,
  );
  return (
    <div
      className="gitHubActivity"
      style={
        {
          "--cube-size": `${_cubeSize}px`,
        } as React.CSSProperties
      }
    >
      <div className="gitHubActivityCalendar">
        <GitHubCalendar
          username="sumitkumar9674"
          colorScheme="dark"
          showTotalCount={true}
          showColorLegend={true}
          showMonthLabels={true}
          blockSize={blockSize}
          blockMargin={blockMargin}
          fontSize={Math.max(8, Math.floor(_cubeSize / 110))}
          transformData={transformContributions}
          theme={{
            dark: ["#0b0b0b", "#1b1b1b", "#2f2f2f", "#3f3f3f", "#585858"],
          }}
        />
      </div>
    </div>
  );
}
