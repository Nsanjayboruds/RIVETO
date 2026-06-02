import { useEffect, useMemo, useState } from 'react';
import apiConfig from '../utils/apiConfig';

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
  }, [queryParams]);

  const difficultyColor = (label) => {
    if (label === 'Easy')
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (label === 'Medium')
      return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-cyan-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-600">
            Contributor discovery
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Recommended issues
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            Find beginner-friendly and relevant GitHub issues ranked by label
            signals, stack matching, and contribution history keywords.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="xl:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Search
              </span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="Search issues, labels, or descriptions"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Recent work keywords
              </span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="auth, cart, ui"
                value={history}
                onChange={(event) => setHistory(event.target.value)}
              />
            </label>

            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">
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
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-300'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:text-cyan-700'
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
                      ? 'border-cyan-600 bg-cyan-600 text-white shadow-lg shadow-cyan-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:text-cyan-700'
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <p className="text-sm text-slate-500">Loading recommendations...</p>
        )}
        {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
        {!loading && issues.length === 0 && !error && (
          <p className="text-sm text-slate-500">
            No issues found. Try different filters.
          </p>
        )}

        <div className="mt-6 grid gap-4">
          {issues.map((issue) => (
            <article
              key={issue.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Issue #{issue.id}
                  </p>
                  <a
                    href={issue.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-lg font-semibold text-slate-900 hover:text-cyan-700"
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

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                {issue.body}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {issue.isGoodFirst && (
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">
                    Good first issue
                  </span>
                )}
                {issue.historyMatch > 0 && (
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                    Matches your recent work
                  </span>
                )}
                {issue.stackMatch > 0 && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {issue.stackMatch} stack match
                    {issue.stackMatch > 1 ? 'es' : ''}
                  </span>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {issue.labels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
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
