

import { useState, useMemo } from 'react';
import useGitHubContributors from '../hooks/useGitHubContributors';

import { BsStar, BsGit } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';

// Special mentions (hardcoded specific contributors)
const specialMentions = {
  firstContributor: 'madhav2348',
  innovator: 'asadanwarr0',
  uiDesigner: 'vedantbudhaware',
};

const Contributors = () => {
  const { contributors, stats, loading, error } = useGitHubContributors();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('contributions'); // 'contributions' or 'name'

  // Separate top 3 by contributions and special mentions
  const { topThree, _specialContributors, regularContributors } = useMemo(() => {
    const sorted = [...contributors].sort(
      (a, b) => b.contributions - a.contributions
    );

    // Get top 3 by contributions
    const top3 = sorted.slice(0, 3);

    // Get special mention contributors (if not already in top 3)
    const special = contributors.filter(
      (c) =>
        Object.values(specialMentions).includes(c.login) &&
        !top3.find((t) => t.login === c.login)
    );

    // Get remaining contributors
    const regular = sorted
      .slice(3)
      .filter((c) => !Object.values(specialMentions).includes(c.login));

    return {
      topThree: top3,
      specialContributors: special,
      regularContributors: regular,
    };
  }, [contributors]);

  const filteredContributors = useMemo(() => {
    return regularContributors
      .filter((c) => c.login.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'contributions')
          return b.contributions - a.contributions;
        return a.login.localeCompare(b.login);
      });
  }, [regularContributors, searchTerm, sortBy]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-black flex items-center justify-center p-4">
        <div className="text-center p-8 rounded-3xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-black dark:via-[#05070c] dark:to-[#0a1220] min-h-screen overflow-x-hidden pt-20">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 text-slate-900 dark:text-white"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Our Amazing <br /> Contributors
            </h1>
            <p className="text-slate-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
              The brilliant minds building RIVETO together. We celebrate every
              commit, every idea, and every contributor.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              {
                label: 'Contributors',
                value: stats.totalContributors,
                icon: HiOutlineUserGroup,
              },
              { label: 'PRs Merged', value: stats.pullRequests, icon: BsGit },
              { label: 'GitHub Stars', value: stats.stars, icon: BsStar },
              { label: 'Forks', value: stats.forks, icon: BsStar },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md"
              >
                <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {loading ? '...' : stat.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-widest font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Featured Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center mb-16">
            <span
              className="text-[#4F8CFF] text-sm font-bold uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              The Hall of Fame
            </span>
            <h2
              className="text-4xl font-bold text-slate-900 dark:text-white text-center mb-2"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Top Contributors
            </h2>
            <p className="text-gray-400 text-center max-w-2xl">
              Based on number of contributions
            </p>
          </div>

          {/* Podium for Top 3 Contributors */}
          {!loading && topThree.length >= 3 && (
            <div className="max-w-5xl mx-auto mb-20">
              <div className="flex items-end justify-center gap-4 md:gap-8">
                {/* 2nd Place - Silver */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex-1 max-w-[250px]"
                >
                  <div className="relative">
                    {/* Silver Medal Badge */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
                      <FaMedal className="text-white text-xl" />
                    </div>

                    <div className="bg-gradient-to-br from-gray-300/20 to-gray-400/20 border border-gray-300/30 rounded-t-3xl p-6 pt-10 text-center backdrop-blur-xl">
                      <img
                        src={topThree[1].avatar_url}
                        alt={topThree[1].login}
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-300/50 shadow-xl"
                      />
                      <h3 className="text-xl font-bold text-white mb-1">
                        {topThree[1].login}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">2nd Place</p>
                      <div className="inline-block px-4 py-2 bg-gray-300/20 rounded-full border border-gray-300/30">
                        <span className="text-white font-bold">
                          {topThree[1].contributions}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">
                          contributions
                        </span>
                      </div>
                    </div>

                    {/* Podium Base */}
                    <div className="h-24 bg-gradient-to-t from-gray-400/30 to-gray-300/20 border-x border-b border-gray-300/30 rounded-b-3xl flex items-center justify-center backdrop-blur-xl">
                      <span className="text-5xl font-black text-gray-300/40">
                        2
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* 1st Place - Gold */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="flex-1 max-w-[280px]"
                >
                  <div className="relative">
                    {/* Crown with Gold Medal */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-10">
                      <FaCrown className="text-yellow-400 text-4xl drop-shadow-2xl animate-pulse" />
                    </div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
                      <FaTrophy className="text-white text-2xl" />
                    </div>

                    <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/40 rounded-t-3xl p-8 pt-14 text-center backdrop-blur-xl shadow-2xl">
                      <img
                        src={topThree[0].avatar_url}
                        alt={topThree[0].login}
                        className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-yellow-400/50 shadow-2xl ring-4 ring-yellow-400/20"
                      />
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {topThree[0].login}
                      </h3>
                      <p className="text-yellow-400 text-sm mb-4 font-semibold">
                        🏆 Champion
                      </p>
                      <div className="inline-block px-6 py-2 bg-yellow-400/20 rounded-full border border-yellow-400/40">
                        <span className="text-white font-bold text-lg">
                          {topThree[0].contributions}
                        </span>
                        <span className="text-gray-300 text-sm ml-1">
                          contributions
                        </span>
                      </div>
                    </div>

                    {/* Podium Base */}
                    <div className="h-32 bg-gradient-to-t from-orange-500/30 to-yellow-400/20 border-x border-b border-yellow-400/40 rounded-b-3xl flex items-center justify-center backdrop-blur-xl">
                      <span className="text-6xl font-black text-yellow-400/40">
                        1
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* 3rd Place - Bronze */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="flex-1 max-w-[250px]"
                >
                  <div className="relative">
                    {/* Bronze Medal Badge */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 w-12 h-12 bg-gradient-to-br from-orange-600 to-amber-700 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
                      <FaAward className="text-white text-xl" />
                    </div>

                    <div className="bg-gradient-to-br from-orange-600/20 to-amber-700/20 border border-orange-600/30 rounded-t-3xl p-6 pt-10 text-center backdrop-blur-xl">
                      <img
                        src={topThree[2].avatar_url}
                        alt={topThree[2].login}
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-orange-600/50 shadow-xl"
                      />
                      <h3 className="text-xl font-bold text-white mb-1">
                        {topThree[2].login}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">3rd Place</p>
                      <div className="inline-block px-4 py-2 bg-orange-600/20 rounded-full border border-orange-600/30">
                        <span className="text-white font-bold">
                          {topThree[2].contributions}
                        </span>
                        <span className="text-gray-400 text-sm ml-1">
                          contributions
                        </span>
                      </div>
                    </div>

                    {/* Podium Base */}
                    <div className="h-20 bg-gradient-to-t from-amber-700/30 to-orange-600/20 border-x border-b border-orange-600/30 rounded-b-3xl flex items-center justify-center backdrop-blur-xl">
                      <span className="text-5xl font-black text-orange-600/40">
                        3
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Special Mentions Section */}
          <div className="flex flex-col items-center mb-12 mt-20">
            <span
              className="text-purple-400 text-sm font-bold uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Special Recognition
            </span>
            <h2
              className="text-3xl font-bold text-slate-900 dark:text-white text-center"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Outstanding Achievements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* First Contributor */}
            {(() => {
              const contributor = contributors.find(
                (c) => c.login === specialMentions.firstContributor
              );
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative group rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 backdrop-blur-xl overflow-hidden hover:border-blue-400/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />

                  <div className="relative p-6">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <img
                          src={
                            contributor?.avatar_url ||
                            `https://github.com/${specialMentions.firstContributor}.png`
                          }
                          alt={specialMentions.firstContributor}
                          className="w-24 h-24 rounded-full border-4 border-blue-500/50 shadow-xl"
                        />
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/20">
                          <span className="text-xl">🎯</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
                        FIRST CONTRIBUTOR
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {specialMentions.firstContributor}
                      </h3>
                      <p className="text-cyan-400 text-sm font-semibold mb-1">
                        @{specialMentions.firstContributor}
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
                      For being the first to join and contribute to RIVETO!
                      Pioneering the spirit of community.
                    </p>

                    <a
                      href={`https://github.com/${specialMentions.firstContributor}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-center rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      View Profile
                    </a>
                  </div>
                </motion.div>
              );
            })()}

            {/* Most Innovative */}
            {(() => {
              const contributor = contributors.find(
                (c) => c.login === specialMentions.innovator
              );
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative group rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 backdrop-blur-xl overflow-hidden hover:border-green-400/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-all duration-500" />

                  <div className="relative p-6">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <img
                          src={
                            contributor?.avatar_url ||
                            `https://github.com/${specialMentions.innovator}.png`
                          }
                          alt={specialMentions.innovator}
                          className="w-24 h-24 rounded-full border-4 border-green-500/50 shadow-xl"
                        />
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/20">
                          <span className="text-xl">💡</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <div className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-xs font-bold uppercase tracking-wider mb-3">
                        MOST INNOVATIVE
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {specialMentions.innovator}
                      </h3>
                      <p className="text-green-400 text-sm font-semibold mb-1">
                        @{specialMentions.innovator}
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
                      For enhancing the About, Contact, and Home sections with
                      creative touches.
                    </p>

                    <a
                      href={`https://github.com/${specialMentions.innovator}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white text-center rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      View Profile
                    </a>
                  </div>
                </motion.div>
              );
            })()}

            {/* UI/UX Designer */}
            {(() => {
              const contributor = contributors.find(
                (c) => c.login === specialMentions.uiDesigner
              );
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="relative group rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 backdrop-blur-xl overflow-hidden hover:border-purple-400/50 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500" />

                  <div className="relative p-6">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <img
                          src={
                            contributor?.avatar_url ||
                            `https://github.com/${specialMentions.uiDesigner}.png`
                          }
                          alt={specialMentions.uiDesigner}
                          className="w-24 h-24 rounded-full border-4 border-purple-500/50 shadow-xl"
                        />
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/20">
                          <span className="text-xl">🎨</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <div className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
                        UI/UX CHAMPION
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {specialMentions.uiDesigner}
                      </h3>
                      <p className="text-purple-400 text-sm font-semibold mb-1">
                        @{specialMentions.uiDesigner}
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
                      For fixing critical UI issues and optimizing the mobile
                      experience for our users.
                    </p>

                    <a
                      href={`https://github.com/${specialMentions.uiDesigner}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white text-center rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      View Profile
                    </a>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        </section>

        {/* All Contributors Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                All Contributors
              </h2>
              <p className="text-gray-400 text-sm">
                Every contribution matters
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search contributors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
              >
                <option
                  value="contributions"
                  className="bg-[#1a1f2e] text-white"
                >
                  Sort by: Contributions
                </option>
                <option value="name" className="bg-[#1a1f2e] text-white">
                  Sort by: Name
                </option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-3xl bg-white/80 dark:bg-white/5 animate-pulse border border-slate-200 dark:border-white/10"
                />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredContributors.map((c) => (
                  <ContributorCard key={c.id} contributor={c} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredContributors.length === 0 && (
            <div className="text-center py-20 text-slate-500 dark:text-gray-500">
              No contributors found matching "{searchTerm}"
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative p-12 rounded-[50px] bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/10 dark:to-blue-600/10 border border-slate-200 dark:border-white/10 backdrop-blur-2xl text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 hover:opacity-10 transition-opacity duration-500" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                Want to see your name here?
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-lg max-w-xl mx-auto mb-10">
                Join our community and start contributing to RIVETO. Whether
                it's code, design, or documentation, every contribution counts!
              </p>
              <motion.a
                href="https://github.com/Nsanjayboruds/RIVETO"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-black font-black text-lg hover:bg-cyan-400 transition-all duration-300"
              >
                Start Contributing <BsArrowUpRight strokeWidth={1} />
              </motion.a>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Contributors;
