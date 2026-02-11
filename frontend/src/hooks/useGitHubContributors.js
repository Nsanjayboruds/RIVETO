import { useState, useEffect } from 'react';
import axios from 'axios';

const useGitHubContributors = (repoOwner = 'Nsanjayboruds', repoName = 'RIVETO') => {
    const [contributors, setContributors] = useState([]);
    const [stats, setStats] = useState({
        stars: 0,
        forks: 0,
        totalContributors: 0,
        pullRequests: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGitHubData = async () => {
            try {
                setLoading(true);
                
                // Fetch contributors
                const contributorsRes = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contributors`);
                setContributors(contributorsRes.data);

                // Fetch repo stats
                const repoRes = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}`);
                
                // Fetch PR count (simplified, just the first page is usually enough for a counter or estimate)
                const prRes = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls?state=all&per_page=1`);
                // Use Link header or just a placeholder if not easily parsed. 
                // For now, let's use the contributors count + some heuristic or fetch if needed.
                // Better way to get total PRs: search API
                const prSearchRes = await axios.get(`https://api.github.com/search/issues?q=repo:${repoOwner}/${repoName}+type:pr`);

                setStats({
                    stars: repoRes.data.stargazers_count,
                    forks: repoRes.data.forks_count,
                    totalContributors: contributorsRes.data.length,
                    pullRequests: prSearchRes.data.total_count,
                });

                setError(null);
            } catch (err) {
                console.error("Error fetching GitHub data:", err);
                setError("Failed to load contributor data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchGitHubData();
    }, [repoOwner, repoName]);

    return { contributors, stats, loading, error };
};

export default useGitHubContributors;
