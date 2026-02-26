import React from 'react';
import { motion } from 'framer-motion';

const FeaturedContributor = ({ contributor, role, description, badge }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative p-8 rounded-[40px] bg-white/90 dark:bg-gray-900/60 backdrop-blur-2xl border border-slate-200 dark:border-gray-800/80 shadow-2xl overflow-hidden"
        >
            {/* Animated Gradient Background */}
            <div className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_150deg,#06b6d4_180deg,transparent_210deg,transparent_360deg)] animate-spin-slow opacity-10 group-hover:opacity-30 transition-opacity duration-700" />

            {/* Card Content */}
            <div className="relative flex flex-col items-center text-center z-10">
                {/* Avatar with Animated Gradient Border */}
                <div className="relative w-32 h-32 mb-6">
                    <div className="absolute inset-[-4px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-spin-slow blur-sm opacity-70 group-hover:blur-md transition-all duration-500" />
                    <div className="absolute inset-0 bg-slate-100 dark:bg-gray-900 rounded-full z-0" />
                    <img
                        src={`https://github.com/${contributor}.png`}
                        alt={contributor}
                        className="w-full h-full rounded-full object-cover z-10 relative border-2 border-white/10"
                    />
                    {/* Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-xl shadow-lg border border-white/20 z-20">
                        <span className="text-xl">{badge.split(' ')[0]}</span>
                    </div>
                </div>

                {/* Roles & Info */}
                <div className="mb-4">
                    <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 block">
                        {role}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                        {contributor}
                    </h3>
                    <p className="text-cyan-400/80 text-sm font-medium">@{contributor}</p>
                </div>

                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-8 max-w-[250px]">
                    {description}
                </p>

                {/* View Profile Button */}
                <motion.a
                    href={`https://github.com/${contributor}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                >
                    View Profile
                </motion.a>
            </div>

            {/* Decorative Orbs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px]" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-600/10 rounded-full blur-[60px]" />
        </motion.div>
    );
};

export default FeaturedContributor;
