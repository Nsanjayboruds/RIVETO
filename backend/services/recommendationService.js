import axios from "axios";

const GITHUB_API = "https://api.github.com";
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "Nsanjayboruds";
const REPO_NAME = process.env.GITHUB_REPO_NAME || "RIVETO";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function getGithubHeaders(githubToken = null) {
  const headers = {
    Accept: "application/vnd.github+json",
  };

  if (githubToken) {
    headers.Authorization = `token ${githubToken}`;
  } else if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchIssues(githubToken = null) {
  const res = await axios.get(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
    {
      params: {
        state: "open",
        per_page: 100,
        sort: "updated",
        direction: "desc",
      },
      headers: getGithubHeaders(githubToken),
    },
  );

  return res.data.filter((issue) => !issue.pull_request);
}

function normalizeText(value = "") {
  return String(value).toLowerCase();
}

function scoreDifficulty(issue) {
  const body = normalizeText(issue.body);
  const labels = (issue.labels || []).map((label) => normalizeText(label.name));
  let score = 50;

  if (labels.includes("good first issue")) score -= 30;
  if (labels.includes("help wanted")) score -= 10;
  if (labels.includes("beginner")) score -= 20;
  if (labels.includes("documentation")) score -= 15;
  if (labels.includes("easy")) score -= 20;

  if (labels.includes("complex")) score += 30;
  if (labels.includes("breaking change")) score += 25;
  if (labels.includes("architecture")) score += 20;
  if (labels.includes("performance")) score += 15;

  if (body.length > 1000) score += 10;
  if (body.length < 200) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function getDifficultyLabel(score) {
  if (score <= 30) return "Easy";
  if (score <= 60) return "Medium";
  return "Hard";
}

function matchStack(issue, userStack = []) {
  const text = normalizeText(`${issue.title} ${issue.body || ""}`);
  return userStack.filter((tech) => text.includes(normalizeText(tech))).length;
}

function scoreHistory(issue, historyTerms = []) {
  const text = normalizeText(`${issue.title} ${issue.body || ""}`);
  return historyTerms.filter(
    (term) => term && text.includes(normalizeText(term)),
  ).length;
}

async function getRecommendations({
  stack = [],
  level = "all",
  search = "",
  history = [],
  githubToken = null,
}) {
  const issues = await fetchIssues(githubToken);
  const historyTerms = Array.isArray(history)
    ? history
    : String(history)
        .split(",")
        .map((term) => term.trim())
        .filter(Boolean);

  const scored = issues.map((issue) => {
    const labels = (issue.labels || []).map((label) => label.name);
    const difficulty = scoreDifficulty(issue);
    const stackMatch = matchStack(issue, stack);
    const historyMatch = scoreHistory(issue, historyTerms);
    const normalizedLabels = labels.map((label) => normalizeText(label));
    const isGoodFirst = normalizedLabels.some((label) =>
      ["good first issue", "beginner", "easy", "help wanted"].includes(label),
    );

    return {
      id: issue.number,
      title: issue.title,
      url: issue.html_url,
      labels,
      difficulty,
      difficultyLabel: getDifficultyLabel(difficulty),
      stackMatch,
      historyMatch,
      isGoodFirst,
      createdAt: issue.created_at,
      body: issue.body?.slice(0, 300) || "",
      assignees: issue.assignees?.map((assignee) => assignee.login) || [],
    };
  });

  let filtered = scored;

  if (level === "beginner")
    filtered = filtered.filter((issue) => issue.difficulty <= 30);
  if (level === "intermediate")
    filtered = filtered.filter(
      (issue) => issue.difficulty > 30 && issue.difficulty <= 60,
    );
  if (level === "advanced")
    filtered = filtered.filter((issue) => issue.difficulty > 60);

  if (search) {
    const q = normalizeText(search);
    filtered = filtered.filter(
      (issue) =>
        normalizeText(issue.title).includes(q) ||
        issue.labels.some((label) => normalizeText(label).includes(q)) ||
        normalizeText(issue.body).includes(q),
    );
  }

  filtered.sort((a, b) => {
    const rankA =
      (a.isGoodFirst ? 100 : 0) +
      a.stackMatch * 20 +
      a.historyMatch * 15 -
      a.difficulty;
    const rankB =
      (b.isGoodFirst ? 100 : 0) +
      b.stackMatch * 20 +
      b.historyMatch * 15 -
      b.difficulty;
    return rankB - rankA;
  });

  return filtered;
}

export { getRecommendations };
