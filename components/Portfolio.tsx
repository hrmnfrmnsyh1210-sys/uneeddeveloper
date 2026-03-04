import React, { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { PortfolioItem } from "../types";
import { STORAGE_KEYS } from "../constants";
import { parseLocalStorage } from "../utils/helpers";

const STATIC_PORTFOLIO: PortfolioItem[] = [
  {
    id: "s1",
    title: "Finance Dashboard Pro",
    category: "Reporting",
    description:
      "Sistem pelaporan keuangan otomatis dengan visualisasi data real-time untuk perusahaan ritel.",
    link: "#",
  },
  {
    id: "s2",
    title: "E-Learning Mobile App",
    category: "Mobile App",
    description:
      "Aplikasi pembelajaran interaktif berbasis Flutter dengan fitur video streaming dan kuis online.",
    link: "#",
  },
  {
    id: "s3",
    title: "Logistic Management System",
    category: "Web App",
    description:
      "Platform manajemen armada dan tracking pengiriman berbasis web untuk perusahaan logistik.",
    link: "#",
  },
  {
    id: "s4",
    title: "HealthCare Booking",
    category: "Mobile App",
    description:
      "Aplikasi booking dokter dan telemedisin yang terintegrasi dengan sistem rumah sakit.",
    link: "#",
  },
];

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Web App": "from-indigo-600/30 to-indigo-900/60",
  "Mobile App": "from-violet-600/30 to-violet-900/60",
  "Reporting": "from-blue-600/30 to-blue-900/60",
  "Backend & API": "from-emerald-600/30 to-emerald-900/60",
  "Custom System": "from-amber-600/30 to-amber-900/60",
};

const CATEGORY_BADGE: Record<string, string> = {
  "Web App": "text-indigo-400",
  "Mobile App": "text-violet-400",
  "Reporting": "text-blue-400",
  "Backend & API": "text-emerald-400",
  "Custom System": "text-amber-400",
};

const getCategoryGradient = (category: string) =>
  CATEGORY_GRADIENTS[category] ?? "from-slate-700/30 to-slate-900/60";

const getCategoryBadge = (category: string) =>
  CATEGORY_BADGE[category] ?? "text-indigo-400";

export const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>(STATIC_PORTFOLIO);

  useEffect(() => {
    const adminItems = parseLocalStorage<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO_ITEMS, []);
    if (adminItems.length > 0) {
      setItems(adminItems);
    }

    const handleStorageChange = () => {
      const updated = parseLocalStorage<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO_ITEMS, []);
      setItems(updated.length > 0 ? updated : STATIC_PORTFOLIO);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <section id="portfolio" className="py-24 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-indigo-400 font-semibold tracking-wide uppercase mb-3">
              Portfolio
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
              Karya Terbaik Kami
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all duration-300"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(item.category)} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative p-8 flex flex-col justify-between min-h-[200px]">
                <div>
                  <span
                    className={`text-sm font-semibold uppercase tracking-wide ${getCategoryBadge(item.category)}`}
                  >
                    {item.category}
                  </span>
                  <h4 className="text-2xl font-bold text-white mt-2 mb-3 group-hover:text-indigo-100 transition-colors">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-slate-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                      {item.description}
                    </p>
                  )}
                </div>

                {item.link && item.link !== "#" && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl w-fit transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  >
                    Lihat Project
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
