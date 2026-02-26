import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGitHubContributors from '../hooks/useGitHubContributors';
import FeaturedContributor from '../components/FeaturedContributor';
import ContributorCard from '../components/ContributorCard';
import Footer from '../components/Footer';
import { BsSearch, BsArrowUpRight, BsGithub, BsStar, BsGit } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';

const Contributors = () => {
    const { contributors, stats, loading, error } = useGitHubContributors();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('contributions'); // 'contributions' or 'name'

    const filteredContributors = useMemo(() => {
        return contributors
            .filter(c => c.login.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sortBy === 'contributions') return b.contributions - a.contributions;
                return a.login.localeCompare(b.login);
            });
    }, [contributors, searchTerm, sortBy]);

    const featured = [
        {
            username: 'madhav2348',
            role: 'First Contributor',
            badge: '🎯 Excellence',
            description: 'For being the first to join and contribute to RIVETO! Pioneering the spirit of community.'
        },
        {
            username: 'asadanwarr0',
            role: 'Most Innovative',
            badge: '💡 Innovation',
            description: 'For enhancing the About, Contact, and Home sections with creative touches.'
        },
        {
            username: 'vedantbudhabaware',
            role: 'UI/UX Champion',
            badge: '🎨 Design',
            description: 'For fixing critical UI issues and optimizing the mobile experience for our users.'
        }
    ];

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-black flex items-center justify-center p-4">
                <div className="text-center p-8 rounded-3xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 backdrop-blur-xl">
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Oops! Something went wrong</h2>
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
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-blue-600">
                            Our Amazing <br /> Contributors
                        </h1>
                        <p className="text-slate-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
                            The brilliant minds building RIVETO together. We celebrate every commit, every idea, and every contributor.
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
                            { label: 'Contributors', value: stats.totalContributors, icon: HiOutlineUserGroup },
                            { label: 'PRs Merged', value: stats.pullRequests, icon: BsGit },
                            { label: 'GitHub Stars', value: stats.stars, icon: BsStar },
                            { label: 'Forks', value: stats.forks, icon: BsStar },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md">
                                <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                                <div className="text-2xl font-black text-slate-900 dark:text-white">{loading ? '...' : stat.value}</div>
                                <div className="text-xs text-slate-500 dark:text-gray-500 uppercase tracking-widest font-bold">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </section>

                {/* Featured Section */}
                <section className="container mx-auto px-4 py-20">
                    <div className="flex flex-col items-center mb-16">
                        <span className="text-cyan-400 text-sm font-black uppercase tracking-[0.3em] mb-4">The Hall of Fame</span>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white text-center tracking-tight">Special Recognition</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featured.map((f, i) => (
                            <FeaturedContributor
                                key={i}
                                contributor={f.username}
                                role={f.role}
                                description={f.description}
                                badge={f.badge}
                            />
                        ))}
                    </div>
                </section>

                {/* All Contributors Grid */}
                <section className="container mx-auto px-4 py-20">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">All Contributors</h2>

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
                                className="px-4 py-3 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                            >
                                <option value="contributions">Sort by: Contributions</option>
                                <option value="name">Sort by: Name</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-64 rounded-3xl bg-white/80 dark:bg-white/5 animate-pulse border border-slate-200 dark:border-white/10" />
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
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Want to see your name here?</h2>
                            <p className="text-slate-600 dark:text-gray-400 text-lg max-w-xl mx-auto mb-10">
                                Join our community and start contributing to RIVETO. Whether it's code, design, or documentation, every contribution counts!
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
