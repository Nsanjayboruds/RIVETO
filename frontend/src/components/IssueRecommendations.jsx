import { useEffect, useMemo, useState } from 'react';
import apiConfig from '../utils/apiConfig';
import { LoadingState, EmptyState, ErrorState } from './StateComponents';

const STACK_OPTIONS = [
  'React',
  'Node.js',
  'MongoDB',
  'Express',
  'Tailwind',
  'JavaScript',
];
const LEVELS = [
  { value: 'all', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function IssueRecommendations() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const [stack, setStack] = useState([]);
  const [history, setHistory] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [githubProfile, setGithubProfile] = useState(null);
  const [checkingGithub, setCheckingGithub] = useState(true);

  useEffect(() => {
    const fetchGithubProfile = async () => {
      try {
        const res = await apiConfig.get('/auth/github/profile');
        if (res.data && res.data.connected) {
          setGithubProfile(res.data);
        } else {
          setGithubProfile(null);
        }
      } catch (err) {
        console.error('Error fetching github profile:', err);
      } finally {
        setCheckingGithub(false);
      }
    };
    fetchGithubProfile();
  }, []);

  const toggleStack = (tech) => {
    setStack((prev) =>
      prev.includes(tech)
        ? prev.filter((item) => item !== tech)
        : [...prev, tech]
    );
  };

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    if (search.trim()) params.set('search', search.trim());
    if (level !== 'all') params.set('level', level);
    if (stack.length > 0) params.set('stack', stack.join(','));
    if (history.trim()) params.set('history', history.trim());

    return params;
  }, [search, level, stack, history]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchIssues = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await apiConfig.get(
          `/recommendations?${queryParams.toString()}`,
          {
            signal: controller.signal,
          }
        );
        setIssues(res.data.results || []);
      } catch (requestError) {
        if (
          requestError.name !== 'CanceledError' &&
          requestError.name !== 'AbortError'
        ) {
          setError('Failed to load recommendations.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();

    return () => controller.abort();
  }, [queryParams, retryCount]);

  const difficultyColor = (label) => {
    if (label === 'Easy')
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
    if (label === 'Medium')
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
    return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="page-card mb-8 p-6 shadow-slate-200/60 dark:shadow-none">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">
            Contributor discovery
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Recommended issues
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-gray-400 sm:text-base">
            Find beginner-friendly and relevant GitHub issues ranked by label
            signals, stack matching, and contribution history keywords.
          </p>

          {/* GitHub OAuth Connection Status */}
          <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800/60">
            {checkingGithub ? (
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <svg className="animate-spin h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Checking connection...</span>
              </div>
            ) : githubProfile && githubProfile.connected ? (
              <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-950/40 dark:bg-emerald-950/10">
                <div className="flex items-center space-x-3">
                  <img
                    src={githubProfile.avatar_url}
                    alt={githubProfile.login}
                    className="h-10 w-10 rounded-full border border-emerald-200 shadow-sm dark:border-emerald-800"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Connected to GitHub
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Logged in as <span className="font-medium text-emerald-600 dark:text-emerald-400">@{githubProfile.login}</span> • {githubProfile.public_repos} public repos
                    </p>
                  </div>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/40 p-4 dark:border-slate-800/40 dark:bg-slate-900/10">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Personalize recommendations
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Connect your GitHub account to bypass rate limits and match issues to your repositories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const backendBaseUrl = apiConfig.defaults.baseURL.replace(/\/api$/, '');
                    window.location.href = `${backendBaseUrl}/api/auth/github`;
                  }}
                  className="inline-flex items-center justify-center space-x-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:focus:ring-cyan-600 dark:focus:ring-offset-slate-900"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Connect GitHub</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="xl:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                Search
              </span>
              <input
                className="page-input w-full transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 dark:focus:ring-cyan-900/40 dark:placeholder-gray-500"
                placeholder="Search issues, labels, or descriptions"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                Recent work keywords
              </span>
              <input
                className="page-input w-full transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 dark:focus:ring-cyan-900/40 dark:placeholder-gray-500"
                placeholder="auth, cart, ui"
                value={history}
                onChange={(event) => setHistory(event.target.value)}
              />
            </label>

            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-gray-300">
                Difficulty
              </span>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setLevel(item.value)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      level === item.value
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-300 dark:bg-cyan-600 dark:shadow-cyan-900/30'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:text-cyan-700 dark:border-[#1f2a44] dark:bg-[#0f172a] dark:text-gray-300 dark:hover:border-cyan-500 dark:hover:text-cyan-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {STACK_OPTIONS.map((tech) => {
              const active = stack.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleStack(tech)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'border-cyan-600 bg-cyan-600 text-white shadow-lg shadow-cyan-200 dark:shadow-cyan-900/30'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:text-cyan-700 dark:border-[#1f2a44] dark:bg-[#0f172a] dark:text-gray-300 dark:hover:border-cyan-500 dark:hover:text-cyan-400'
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="py-10">
            <LoadingState message="Finding recommended issues..." />
          </div>
        )}
        {error && (
          <div className="py-10">
            <ErrorState
              title="Failed to load recommendations"
              message={error}
              onRetry={() => setRetryCount((prev) => prev + 1)}
            />
          </div>
        )}
        {!loading && issues.length === 0 && !error && (
          <div className="py-10">
            <EmptyState
              title="No recommendations found"
              description="Try adjusting your filters or keywords to find matching issues."
            />
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {issues.map((issue) => (
            <article
              key={issue.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-[#1f2a44] dark:bg-[#0f172a] dark:hover:shadow-cyan-900/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-gray-500">
                    Issue #{issue.id}
                  </p>
                  <a
                    href={issue.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-lg font-semibold text-slate-900 hover:text-cyan-700 dark:text-white dark:hover:text-cyan-400"
                  >
                    {issue.title}
                  </a>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyColor(
                    issue.difficultyLabel
                  )}`}
                >
                  {issue.difficultyLabel}
                </span>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-gray-400">
                {issue.body}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {issue.isGoodFirst && (
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300">
                    Good first issue
                  </span>
                )}
                {issue.historyMatch > 0 && (
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                    Matches your recent work
                  </span>
                )}
                {issue.stackMatch > 0 && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {issue.stackMatch} stack match
                    {issue.stackMatch > 1 ? 'es' : ''}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {issue.labels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-[#1a2332] dark:text-gray-300"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
