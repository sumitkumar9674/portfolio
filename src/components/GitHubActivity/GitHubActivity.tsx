import { useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { siteLinks } from "../../config/siteLinks";
import { siteContent } from "../../content/siteContent";
import { getThemeColor } from "../../theme/getThemeColor";
import "./GitHubActivity.css";

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

export default function GitHubActivity() {
  const [contributionTheme] = useState<
    [string, string, string, string, string]
  >(() => [
    getThemeColor("--color-calendar-level-0"),
    getThemeColor("--color-calendar-level-1"),
    getThemeColor("--color-calendar-level-2"),
    getThemeColor("--color-calendar-level-3"),
    getThemeColor("--color-calendar-level-4"),
  ]);

  return (
    <div
      className="gitHubActivity"
      aria-label={siteContent.githubActivity.ariaLabel}
    >
      <GitHubCalendar
        username={siteLinks.github.username}
        year="last"
        colorScheme="dark"
        transformData={transformContributions}
        blockSize={21}
        blockMargin={0.7}
        blockRadius={0}
        fontSize={13}
        showMonthLabels
        showTotalCount
        showColorLegend
        labels={{
          totalCount: siteContent.githubActivity.totalCount,
          legend: {
            less: siteContent.githubActivity.less,
            more: siteContent.githubActivity.more,
          },
        }}
        // Level zero stays visible as an empty day; GitHub counts remain untouched.
        theme={{
          dark: contributionTheme,
        }}
        style={{ width: "100%", maxWidth: "none", gap: "0.6cqw" }}
      />
    </div>
  );
}
