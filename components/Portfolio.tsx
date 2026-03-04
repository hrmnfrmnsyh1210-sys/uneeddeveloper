import React, { useState, useEffect } from "react";
import { ExternalLink, Globe } from "lucide-react";
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

const CATEGORY_BADGE: Record<string, string> = {
  "Web App": "text-indigo-400",
  "Mobile App": "text-violet-400",
  "Reporting": "text-blue-400",
  "Backend & API": "text-emerald-400",
  "Custom System": "text-amber-400",
};

const CATEGORY_GRADIENT: Record<string, string> = {
  "Web App": "from-indigo-600/30 to-indigo-900/60",
  "Mobile App": "from-violet-600/30 to-violet-900/60",
  "Reporting": "from-blue-600/30 to-blue-900/60",
  "Backend & API": "from-emerald-600/30 to-emerald-900/60",
  "Custom System": "from-amber-600/30 to-amber-900/60",
};

const getCategoryBadge = (cat: string) => CATEGORY_BADGE[cat] ?? "text-indigo-400";
const getCategoryGradient = (cat: string) => CATEGORY_GRADIENT[cat] ?? "from-slate-700/30 to-slate-900/60";

const getScreenshotUrl = (link: string) =>
  `https://image.thum.io/get/width/800/crop/500/noanimate/${link}`;

const hasValidLink = (link: string) =>
  link && link !== "#" && link.startsWith("http");

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const showScreenshot = hasValidLink(item.link);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-600 transition-all duration-300">
      {/* Thumbnail area */}
      <div className="aspect-video overflow-hidden relative bg-slate-800">
        {showScreenshot && !imgError ? (
          <>
            {/* Skeleton while loading */}
            {!imgLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-800 animate-pulse">
                <Globe className="w-8 h-8 text-slate-600" />
                <span className="text-slate-500 text-xs">Memuat preview...</span>
              </div>
            )}
            <img
              src={getScreenshotUrl(item.link)}
              alt={item.title}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105 ${
                imgLoaded ? "opacity-80 group-hover:opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          /* Fallback gradient when no valid URL or image fails */
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(item.category)} flex items-center justify-center`}
          >
            <Globe className="w-12 h-12 text-white/20" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info area */}
      <div className="p-6">
        <span className={`text-sm font-semibold uppercase tracking-wide ${getCategoryBadge(item.category)}`}>
          {item.category}
        </span>
        <h4 className="text-xl font-bold text-white mt-1 mb-2">{item.title}</h4>
        {item.description && (
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
            {item.description}
          </p>
        )}

        {hasValidLink(item.link) ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Lihat Project <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm text-slate-600">
            <Globe className="w-3.5 h-3.5" />
            Segera Hadir
          </span>
        )}
      </div>
    </div>
  );
};

export const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    const adminItems = parseLocalStorage<PortfolioItem[]>(STORAGE_KEYS.PORTFOLIO_ITEMS, []);
    return adminItems.length > 0 ? adminItems : STATIC_PORTFOLIO;
  });

  useEffect(() => {
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
        <div className="mb-12">
          <h2 className="text-indigo-400 font-semibold tracking-wide uppercase mb-3">
            Portfolio
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            Karya Terbaik Kami
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
