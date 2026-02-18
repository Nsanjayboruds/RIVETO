import React, { useMemo } from 'react';
import { FaTimes, FaCheck, FaStar, FaTrophy, FaPercent, FaInfoCircle } from 'react-icons/fa';
import { RiPriceTag3Line } from "react-icons/ri";
import gsap from 'gsap';

const ComparisonPanel = ({ compareList, onClose, removeProduct, currency = "$" }) => {

    React.useEffect(() => {
        gsap.fromTo(".comparison-panel-content",
            { y: "100%" },
            { y: "0%", duration: 0.5, ease: "power3.out" }
        );
    }, []);

    // Helper to generate deterministic stats (copied from Card.jsx logic to ensure consistency)
    const getProductStats = (id, price) => {
        const seed = typeof id === 'string' ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : id;
        const pseudoRandom = (offset) => ((seed * 9301 + offset * 49297) % 233280) / 233280;

        return {
            rating: parseFloat((pseudoRandom(1) * 1.5 + 3.5).toFixed(1)),
            reviewCount: Math.floor(pseudoRandom(2) * 100) + 15,
            features: [
                pseudoRandom(4) > 0.5 ? "Eco-friendly" : "Standard Material",
                pseudoRandom(5) > 0.5 ? "Water Resistant" : "Breathable",
                pseudoRandom(6) > 0.5 ? "2 Year Warranty" : "1 Year Warranty",
                pseudoRandom(7) > 0.5 ? "Fast Shipping" : "Standard Shipping"
            ]
        };
    };

    // Enhance products with stats
    const enhancedProducts = useMemo(() => {
        return compareList.map(product => {
            const stats = getProductStats(product._id, product.price);
            return { ...product, ...stats };
        });
    }, [compareList]);

    // Generate Smart Insights
    const insights = useMemo(() => {
        if (enhancedProducts.length < 2) return [];

        const insightsList = [];
        const sortedByPrice = [...enhancedProducts].sort((a, b) => a.price - b.price);
        const sortedByRating = [...enhancedProducts].sort((a, b) => b.rating - a.rating);

        // Best Value (Lowest Price + Good Rating)
        const bestValue = enhancedProducts.reduce((prev, curr) => {
            const prevScore = (1 / prev.price) * prev.rating;
            const currScore = (1 / curr.price) * curr.rating;
            return currScore > prevScore ? curr : prev;
        });
        insightsList.push({
            type: "value",
            icon: <FaPercent className="text-green-400" />,
            title: "Best Value",
            text: `${bestValue.name} offers the best balance of price and rating.`,
            productId: bestValue._id
        });

        // Premium Choice
        const premium = sortedByPrice[sortedByPrice.length - 1];
        insightsList.push({
            type: "premium",
            icon: <FaTrophy className="text-yellow-400" />,
            title: "Premium Choice",
            text: `${premium.name} is the most exclusive option with premium features.`,
            productId: premium._id
        });

        // Top Rated
        const topRated = sortedByRating[0];
        if (topRated._id !== bestValue._id && topRated._id !== premium._id) {
            insightsList.push({
                type: "rating",
                icon: <FaStar className="text-yellow-400" />,
                title: "Top Rated",
                text: `Users love ${topRated.name} the most with a ${topRated.rating} rating.`,
                productId: topRated._id
            });
        }

        return insightsList;
    }, [enhancedProducts]);

    if (compareList.length === 0) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col justify-end pointer-events-none">

            {/* Panel Container - Slide Up Animation */}
            <div className="comparison-panel-content bg-gray-900/95 backdrop-blur-xl border-t border-gray-700 shadow-2xl rounded-t-3xl pointer-events-auto transform max-h-[85vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <RiPriceTag3Line className="text-cyan-400" />
                            </span>
                            Compare ({compareList.length})
                        </h2>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 hidden sm:inline-block">
                            Select up to 4 items
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-500/20 rounded-full group transition-colors"
                    >
                        <FaTimes className="text-gray-400 group-hover:text-red-400" />
                    </button>
                </div>

                <div className="overflow-y-auto overflow-x-auto p-4 md:p-6 custom-scrollbar">

                    {/* Smart Insights Section */}
                    {compareList.length > 1 && (
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {insights.map((insight, idx) => (
                                <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-800/50 p-4 rounded-xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        {insight.icon}
                                    </div>
                                    <div className="flex items-start gap-3 relative z-10">
                                        <div className="p-2 bg-gray-700/50 rounded-lg shrink-0">
                                            {insight.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm mb-1">{insight.title}</h4>
                                            <p className="text-gray-400 text-xs leading-relaxed">{insight.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Comparison Grid */}
                    <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(200px,1fr))] gap-0 divide-x divide-gray-700 border border-gray-700 rounded-2xl bg-gray-900/50 overflow-hidden">

                        {/* Labels Column */}
                        <div className="bg-gray-800/30 flex flex-col">
                            <div className="h-48 p-4 flex items-end font-semibold text-gray-400 text-sm border-b border-gray-700">Product</div>
                            <div className="h-14 p-4 flex items-center font-semibold text-gray-400 text-sm border-b border-gray-700">Price</div>
                            <div className="h-14 p-4 flex items-center font-semibold text-gray-400 text-sm border-b border-gray-700">Rating</div>
                            <div className="h-32 p-4 flex items-start pt-4 font-semibold text-gray-400 text-sm border-b border-gray-700">Features</div>
                            <div className="h-14 p-4 flex items-center font-semibold text-gray-400 text-sm">Action</div>
                        </div>

                        {/* Product Columns */}
                        {enhancedProducts.map((item) => (
                            <div key={item._id} className="flex flex-col min-w-[200px] relative group hover:bg-gray-800/30 transition-colors">
                                <button
                                    onClick={() => removeProduct(item._id)}
                                    className="absolute top-2 right-2 z-10 p-1.5 bg-gray-900/80 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 hover:bg-gray-800"
                                >
                                    <FaTimes size={12} />
                                </button>

                                {/* Product Header */}
                                <div className="h-48 p-4 border-b border-gray-700 flex flex-col justify-end relative">
                                    <div className="absolute top-4 left-4 right-4 bottom-20 flex items-center justify-center">
                                        <img src={item.image1 || item.image[0]} alt={item.name} className="max-h-full max-w-full object-contain drop-shadow-lg" />
                                    </div>
                                    <h3 className="text-white font-medium text-sm leading-tight line-clamp-2 mb-1">{item.name}</h3>
                                    <span className="text-xs text-gray-500">{item.subCategory}</span>
                                </div>

                                {/* Price */}
                                <div className="h-14 p-4 flex items-center border-b border-gray-700">
                                    <span className="text-cyan-400 font-bold">{currency}{item.price}</span>
                                </div>

                                {/* Rating */}
                                <div className="h-14 p-4 flex items-center border-b border-gray-700 gap-2">
                                    <div className="flex text-yellow-400 text-xs">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < Math.floor(item.rating) ? "opacity-100" : "opacity-30"} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400">({item.reviewCount})</span>
                                </div>

                                {/* Features */}
                                <div className="h-32 p-4 border-b border-gray-700">
                                    <ul className="space-y-2">
                                        {item.features.map((feature, i) => (
                                            <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                                                <FaCheck className="text-green-500 text-[10px]" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action */}
                                <div className="h-14 p-4 flex items-center justify-center">
                                    <button className="text-xs bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-1.5 rounded-full transition-colors font-medium">
                                        Select
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Empty slots placeholders (optional) */}
                        {[...Array(Math.max(0, 2 - compareList.length))].map((_, i) => (
                            <div key={`empty-${i}`} className="hidden md:flex flex-col min-w-[200px] bg-gray-900/20">
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2 p-4">
                                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center">
                                        <span className="text-2xl">+</span>
                                    </div>
                                    <span className="text-sm">Add item</span>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonPanel;
