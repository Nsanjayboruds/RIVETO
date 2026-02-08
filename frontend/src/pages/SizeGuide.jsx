import React, { useState } from "react";
import Footer from "../components/Footer";
import {
  FaRulerHorizontal,
  FaRulerVertical,
  FaTshirt,
  FaShoePrints,
  FaMale,
  FaFemale,
  FaChild,
  FaExchangeAlt,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaHandPointRight,
} from "react-icons/fa";
import { GiTrousers, GiNecklaceDisplay } from "react-icons/gi";

/* ─── Size Data ─── */

const mensTops = {
  title: "Men's Tops",
  headers: ["Size", "Chest (in)", "Chest (cm)", "Waist (in)", "Waist (cm)", "Length (in)", "Length (cm)"],
  rows: [
    ["XS", "34", "86", "28", "71", "27", "69"],
    ["S", "36", "91", "30", "76", "28", "71"],
    ["M", "38–40", "97–102", "32–34", "81–86", "29", "74"],
    ["L", "42–44", "107–112", "36–38", "91–97", "30", "76"],
    ["XL", "46–48", "117–122", "40–42", "102–107", "31", "79"],
    ["XXL", "50–52", "127–132", "44–46", "112–117", "32", "81"],
  ],
};

const mensBottoms = {
  title: "Men's Bottoms",
  headers: ["Size", "Waist (in)", "Waist (cm)", "Hip (in)", "Hip (cm)", "Inseam (in)", "Inseam (cm)"],
  rows: [
    ["28", "28", "71", "34", "86", "30", "76"],
    ["30", "30", "76", "36", "91", "30", "76"],
    ["32", "32", "81", "38", "97", "31", "79"],
    ["34", "34", "86", "40", "102", "31", "79"],
    ["36", "36", "91", "42", "107", "32", "81"],
    ["38", "38", "97", "44", "112", "32", "81"],
    ["40", "40", "102", "46", "117", "32", "81"],
  ],
};

const womensTops = {
  title: "Women's Tops",
  headers: ["Size", "Bust (in)", "Bust (cm)", "Waist (in)", "Waist (cm)", "Hip (in)", "Hip (cm)"],
  rows: [
    ["XS", "31–32", "79–81", "24–25", "61–64", "34–35", "86–89"],
    ["S", "33–34", "84–86", "26–27", "66–69", "36–37", "91–94"],
    ["M", "35–36", "89–91", "28–29", "71–74", "38–39", "97–99"],
    ["L", "37–39", "94–99", "30–32", "76–81", "40–42", "102–107"],
    ["XL", "40–42", "102–107", "33–35", "84–89", "43–45", "109–114"],
    ["XXL", "43–45", "109–114", "36–38", "91–97", "46–48", "117–122"],
  ],
};

const womensBottoms = {
  title: "Women's Bottoms",
  headers: ["Size", "Waist (in)", "Waist (cm)", "Hip (in)", "Hip (cm)", "Inseam (in)", "Inseam (cm)"],
  rows: [
    ["XS (0–2)", "24–25", "61–64", "34–35", "86–89", "30", "76"],
    ["S (4–6)", "26–27", "66–69", "36–37", "91–94", "30", "76"],
    ["M (8–10)", "28–29", "71–74", "38–39", "97–99", "31", "79"],
    ["L (12–14)", "30–32", "76–81", "40–42", "102–107", "31", "79"],
    ["XL (16–18)", "33–35", "84–89", "43–45", "109–114", "32", "81"],
    ["XXL (20)", "36–38", "91–97", "46–48", "117–122", "32", "81"],
  ],
};

const kidsTops = {
  title: "Kids' Tops",
  headers: ["Age", "Size", "Chest (in)", "Chest (cm)", "Length (in)", "Length (cm)"],
  rows: [
    ["3–4", "XS", "21–22", "53–56", "15", "38"],
    ["5–6", "S", "23–24", "58–61", "17", "43"],
    ["7–8", "M", "25–26", "64–66", "19", "48"],
    ["9–10", "L", "27–28", "69–71", "21", "53"],
    ["11–12", "XL", "29–30", "74–76", "23", "58"],
  ],
};

const kidsBottoms = {
  title: "Kids' Bottoms",
  headers: ["Age", "Size", "Waist (in)", "Waist (cm)", "Hip (in)", "Hip (cm)", "Inseam (in)", "Inseam (cm)"],
  rows: [
    ["3–4", "XS", "20–21", "51–53", "22–23", "56–58", "15", "38"],
    ["5–6", "S", "21–22", "53–56", "24–25", "61–64", "18", "46"],
    ["7–8", "M", "22–23", "56–58", "26–27", "66–69", "21", "53"],
    ["9–10", "L", "23–24", "58–61", "28–29", "71–74", "24", "61"],
    ["11–12", "XL", "24–25", "61–64", "30–31", "76–79", "26", "66"],
  ],
};

const shoes = {
  title: "Shoe Sizes",
  headers: ["US Men", "US Women", "UK", "EU", "Foot Length (in)", "Foot Length (cm)"],
  rows: [
    ["6", "7.5", "5.5", "38.5", "9.25", "23.5"],
    ["7", "8.5", "6.5", "40", "9.63", "24.4"],
    ["8", "9.5", "7.5", "41", "9.94", "25.2"],
    ["9", "10.5", "8.5", "42.5", "10.31", "26.2"],
    ["10", "11.5", "9.5", "44", "10.69", "27.1"],
    ["11", "12.5", "10.5", "45", "11.06", "28.1"],
    ["12", "13.5", "11.5", "46", "11.44", "29.1"],
  ],
};

const accessories = {
  title: "Accessories — Belts & Hats",
  headers: ["Size", "Belt Waist (in)", "Belt Waist (cm)", "Hat Circ. (in)", "Hat Circ. (cm)"],
  rows: [
    ["S", "28–30", "71–76", "21–21.5", "53–55"],
    ["M", "32–34", "81–86", "21.5–22", "55–56"],
    ["L", "36–38", "91–97", "22–22.5", "56–57"],
    ["XL", "40–42", "102–107", "22.5–23", "57–58"],
    ["XXL", "44–46", "112–117", "23–23.5", "58–60"],
  ],
};

/* ─── Tab & Category Config ─── */

const categories = [
  { key: "men", label: "Men", icon: <FaMale /> },
  { key: "women", label: "Women", icon: <FaFemale /> },
  { key: "kids", label: "Kids", icon: <FaChild /> },
  { key: "shoes", label: "Shoes", icon: <FaShoePrints /> },
  { key: "accessories", label: "Accessories", icon: <GiNecklaceDisplay /> },
];

const chartMap = {
  men: [mensTops, mensBottoms],
  women: [womensTops, womensBottoms],
  kids: [kidsTops, kidsBottoms],
  shoes: [shoes],
  accessories: [accessories],
};

/* ─── Measurement Tips ─── */

const measurementTips = [
  {
    label: "Chest / Bust",
    icon: <FaTshirt className="text-xl" />,
    description:
      "Wrap the tape around the fullest part of your chest, keeping it level under your arms and across your shoulder blades.",
  },
  {
    label: "Waist",
    icon: <FaRulerHorizontal className="text-xl" />,
    description:
      "Measure around your natural waistline — the narrowest part of your torso, typically just above the belly button.",
  },
  {
    label: "Hips",
    icon: <FaRulerVertical className="text-xl" />,
    description:
      "Stand with feet together and wrap the tape around the widest part of your hips, keeping it parallel to the floor.",
  },
  {
    label: "Inseam",
    icon: <GiTrousers className="text-xl" />,
    description:
      "Measure from the top of your inner thigh down to your ankle bone. It helps to use a pair of well-fitting pants as a reference.",
  },
  {
    label: "Foot Length",
    icon: <FaShoePrints className="text-xl" />,
    description:
      "Stand on a piece of paper, mark the tip of your longest toe and the back of your heel, then measure the distance between them.",
  },
];

const proTips = [
  "Use a soft, flexible measuring tape — not a metal one.",
  "Wear thin clothing or measure over undergarments for best accuracy.",
  "Keep the tape snug but not tight; you should be able to slide a finger underneath.",
  "Measure yourself standing up straight with arms relaxed at your sides.",
  "Take each measurement twice to confirm accuracy.",
  "If you're between sizes, we recommend going one size up for a comfortable fit.",
];

/* ─── Reusable Size Chart Table ─── */

function SizeTable({ chart }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg md:text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
        <FaTshirt className="text-cyan-400" />
        {chart.title}
      </h3>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-700/50">
        <table className="w-full text-sm text-left" role="table">
          <caption className="sr-only">{chart.title} size chart</caption>
          <thead>
            <tr className="bg-gray-800/80">
              {chart.headers.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-cyan-400 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`border-t border-gray-700/40 transition-colors ${
                  rIdx % 2 === 0 ? "bg-gray-800/30" : "bg-gray-800/10"
                } hover:bg-cyan-500/10`}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`px-5 py-3 whitespace-nowrap ${
                      cIdx === 0 ? "font-semibold text-white" : "text-gray-300"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-3">
        {chart.rows.map((row, rIdx) => (
          <div
            key={rIdx}
            className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4"
          >
            <p className="text-cyan-300 font-semibold text-base mb-2">
              {chart.headers[0]}: {row[0]}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {chart.headers.slice(1).map((h, i) => (
                <div key={i}>
                  <span className="text-gray-500 text-xs">{h}</span>
                  <p className="text-gray-200">{row[i + 1]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Collapsible Measurement Tip ─── */

function MeasurementTipCard({ tip }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 transition-all hover:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      aria-expanded={open}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400">
            {tip.icon}
          </div>
          <span className="font-medium text-white">{tip.label}</span>
        </div>
        {open ? (
          <FaChevronUp className="text-cyan-400 text-sm" />
        ) : (
          <FaChevronDown className="text-gray-500 text-sm" />
        )}
      </div>
      {open && (
        <p className="mt-3 text-sm text-gray-400 leading-relaxed pl-[52px]">
          {tip.description}
        </p>
      )}
    </button>
  );
}

/* ─── Main Page ─── */

const SizeGuide = () => {
  const [activeCategory, setActiveCategory] = useState("men");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0f172a] to-[#0c4a6e] pt-24 pb-1 text-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-5 py-2 mb-6">
            <FaRulerHorizontal className="text-cyan-400 text-sm" />
            <span className="text-cyan-300 text-sm font-medium">Find Your Perfect Fit</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Size Guide
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Use our comprehensive size charts to find clothing and accessories that fit you perfectly.
            All measurements are provided in both centimeters and inches.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="flex flex-wrap justify-center gap-3 mb-10" role="tablist" aria-label="Size chart categories">
          {categories.map((cat) => (
            <button
              key={cat.key}
              role="tab"
              aria-selected={activeCategory === cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat.key
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-lg shadow-cyan-500/20"
                  : "bg-gray-800/50 text-gray-400 border-gray-700/50 hover:text-white hover:border-cyan-500/40"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Size Charts */}
        <div role="tabpanel" aria-label={`${activeCategory} size charts`}>
          {chartMap[activeCategory].map((chart, idx) => (
            <SizeTable key={idx} chart={chart} />
          ))}
        </div>

        {/* Fit Tip */}
        <div className="flex items-start gap-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 mb-16">
          <FaInfoCircle className="text-cyan-400 mt-1 flex-shrink-0 text-lg" />
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="font-semibold text-cyan-300">Fit Tip:</span> If you're between two sizes, 
            we recommend sizing up for a more comfortable fit — especially for outerwear and structured items.
          </p>
        </div>
      </section>

      {/* How to Measure Section */}
      <section className="mx-auto max-w-5xl px-4 md:px-8 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            How to Measure
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Follow these steps to take accurate body measurements so you can find your perfect size every time.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {measurementTips.map((tip, idx) => (
            <MeasurementTipCard key={idx} tip={tip} />
          ))}
        </div>

        {/* Pro Tips */}
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <FaHandPointRight className="text-cyan-400" />
            Pro Tips for Accurate Measurements
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {proTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Unit Conversion Quick Reference */}
      <section className="mx-auto max-w-5xl px-4 md:px-8 mb-20">
        <div className="bg-gradient-to-r from-gray-800/60 to-gray-800/30 border border-gray-700/50 rounded-2xl p-6 md:p-8">
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <FaExchangeAlt className="text-cyan-400" />
            Quick Conversion Reference
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: "1 inch", value: "2.54 cm" },
              { label: "1 cm", value: "0.394 inch" },
              { label: "1 foot", value: "30.48 cm" },
              { label: "1 meter", value: "39.37 inches" },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/40">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-lg font-semibold text-cyan-300">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SizeGuide;
