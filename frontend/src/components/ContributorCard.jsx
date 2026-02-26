import React from 'react';
import { motion } from 'framer-motion';

const ContributorCard = ({ contributor }) => {
    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative p-6 rounded-3xl bg-white/85 dark:bg-gray-900/40 backdrop-blur-xl border border-slate-200 dark:border-gray-800/50 hover:border-cyan-500/50 transition-all duration-500 overflow-hidden"
        >
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

            {/* Shimmer Effect */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />

            <div className="relative flex flex-col items-center">
                {/* Avatar */}
                <div className="relative w-20 h-20 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                    <img
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        className="w-full h-full rounded-full border-2 border-white/20 dark:border-gray-700 object-cover z-10 relative"
                    />
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {contributor.login}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    @{contributor.login}
                </p>

                {/* Stats */}
                <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                    {contributor.contributions} Contributions
                </div>

                {/* External Link Overlay */}
                <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-20 cursor-pointer"
                    aria-label={`View ${contributor.login}'s profile`}
                />
            </div>
        </motion.div>
    );
};

export default ContributorCard;
