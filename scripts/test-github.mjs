const main = async () => {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is not available.");
  }

  const query = `
    query {
      viewer {
        login
        contributionsCollection {
          restrictedContributionsCount
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  const viewer = data.data?.viewer;

  console.log("GitHub username:", viewer?.login);
  console.log(
    "Private/restricted contributions:",
    viewer?.contributionsCollection?.restrictedContributionsCount,
  );
  console.log(
    "Total contributions:",
    viewer?.contributionsCollection?.contributionCalendar?.totalContributions,
  );
};

main();
