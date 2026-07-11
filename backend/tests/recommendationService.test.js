import { describe, it, expect, beforeEach, jest } from "@jest/globals";

const mockGet = jest.fn();

jest.unstable_mockModule("axios", () => ({
    default: {
        get: mockGet,
    },
}));

const { getRecommendations } = await import(
    "../services/recommendationService.js"
);

describe("recommendationService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("fetches GitHub issues successfully", async () => {
        mockGet.mockResolvedValue({
            data: [
                {
                    number: 1,
                    title: "React beginner issue",
                    body: "Good first issue for React",
                    labels: [{ name: "good first issue" }],
                    created_at: "2025-01-01",
                    assignees: [],
                },
            ],
        });

        const results = await getRecommendations({});

        expect(results).toHaveLength(1);
        expect(results[0].title).toBe("React beginner issue");
    });

    it("assigns Easy difficulty for beginner issues", async () => {
        mockGet.mockResolvedValue({
            data: [
                {
                    number: 2,
                    title: "Easy issue",
                    body: "Small fix",
                    labels: [{ name: "good first issue" }],
                    created_at: "2025-01-01",
                    assignees: [],
                },
            ],
        });

        const results = await getRecommendations({});

        expect(results[0].difficultyLabel).toBe("Easy");
    });

    it("matches stack keywords", async () => {
        mockGet.mockResolvedValue({
            data: [
                {
                    number: 3,
                    title: "React component bug",
                    body: "Fix React rendering",
                    labels: [],
                    created_at: "2025-01-01",
                    assignees: [],
                },
            ],
        });

        const results = await getRecommendations({
            stack: ["react"],
        });

        expect(results[0].stackMatch).toBeGreaterThan(0);
    });

    it("matches contribution history keywords", async () => {
        mockGet.mockResolvedValue({
            data: [
                {
                    number: 4,
                    title: "Authentication improvements",
                    body: "Improve authentication flow",
                    labels: [],
                    created_at: "2025-01-01",
                    assignees: [],
                },
            ],
        });

        const results = await getRecommendations({
            history: ["authentication"],
        });

        expect(results[0].historyMatch).toBeGreaterThan(0);
    });

    it("filters beginner issues correctly", async () => {
        mockGet.mockResolvedValue({
            data: [
                {
                    number: 5,
                    title: "Good first issue",
                    body: "Easy task",
                    labels: [{ name: "good first issue" }],
                    created_at: "2025-01-01",
                    assignees: [],
                },
                {
                    number: 6,
                    title: "Complex architecture change",
                    body: "Major refactor",
                    labels: [{ name: "architecture" }],
                    created_at: "2025-01-01",
                    assignees: [],
                },
            ],
        });

        const results = await getRecommendations({
            level: "beginner",
        });

        expect(results).toHaveLength(1);
        expect(results[0].difficultyLabel).toBe("Easy");
    });

    it("filters issues by search term", async () => {
        mockGet.mockResolvedValue({
            data: [
                {
                    number: 7,
                    title: "React issue",
                    body: "",
                    labels: [],
                    created_at: "2025-01-01",
                    assignees: [],
                },
                {
                    number: 8,
                    title: "Node issue",
                    body: "",
                    labels: [],
                    created_at: "2025-01-01",
                    assignees: [],
                },
            ],
        });

        const results = await getRecommendations({
            search: "react",
        });

        expect(results).toHaveLength(1);
        expect(results[0].title).toContain("React");
    });

    it("ranks good first issues above harder issues", async () => {
        mockGet.mockResolvedValue({
            data: [
                {
                    number: 9,
                    title: "Hard architecture issue",
                    body: "",
                    labels: [{ name: "architecture" }],
                    created_at: "2025-01-01",
                    assignees: [],
                },
                {
                    number: 10,
                    title: "React beginner issue",
                    body: "",
                    labels: [{ name: "good first issue" }],
                    created_at: "2025-01-01",
                    assignees: [],
                },
            ],
        });

        const results = await getRecommendations({
            stack: ["react"],
        });

        expect(results[0].title).toBe("React beginner issue");
    });
    it("excludes pull requests from recommendations", async () => {
        mockGet.mockResolvedValue({
            data: [
                {
                    number: 1,
                    title: "Issue",
                    labels: [],
                    created_at: "2025-01-01",
                    assignees: [],
                },
                {
                    number: 2,
                    title: "PR",
                    pull_request: {},
                    labels: [],
                    created_at: "2025-01-01",
                    assignees: [],
                },
            ],
        });

        const results = await getRecommendations({});

        expect(results).toHaveLength(1);
        expect(results[0].title).toBe("Issue");
    });
});