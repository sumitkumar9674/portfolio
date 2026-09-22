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

    // 20% remain empty.
    if (random < 0.2) {
      return day;
    }

    // 70.5% become 1 contribution.
    if (random < 0.905) {
      return {
        ...day,
        count: 1,
        level: 1 as const,
      };
    }

    // 9% become 2 contributions.
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
  return (
    <div className="gitHubActivity">
      <div className="gitHubActivityTitle">GitHub Activity</div>

      <div className="gitHubActivityCalendar">
        <GitHubCalendar
          username="sumitkumar9674"
          colorScheme="dark"
          showTotalCount={false}
          showColorLegend={false}
          showMonthLabels={false}
          blockSize={Math.max(5, Math.floor(_cubeSize / 75))}
          blockMargin={3}
          fontSize={Math.max(8, Math.floor(_cubeSize / 110))}
          transformData={transformContributions}
          theme={{
            dark: ["#161616", "#263238", "#35515c", "#4b7885", "#6fa8b8"],
          }}
        />
      </div>
    </div>
  );
}
