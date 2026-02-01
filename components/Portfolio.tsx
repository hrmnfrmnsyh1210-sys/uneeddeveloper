import React from "react";
import { Project } from "../types";
import { ExternalLink } from "lucide-react";

const projects: Project[] = [
  {
    id: "1",
    title: "Finance Dashboard Pro",
    category: "Reporting",
    imageUrl: "https://picsum.photos/800/600?random=1",
    description:
      "Sistem pelaporan keuangan otomatis dengan visualisasi data real-time untuk perusahaan ritel.",
  },
  {
    id: "2",
    title: "E-Learning Mobile App",
    category: "Mobile App",
    imageUrl: "https://picsum.photos/800/600?random=2",
    description:
      "Aplikasi pembelajaran interaktif berbasis Flutter dengan fitur video streaming dan kuis online.",
  },
  {
    id: "3",
    title: "Logistic Management System",
    category: "Web App",
    imageUrl: "https://picsum.photos/800/600?random=3",
    description:
      "Platform manajemen armada dan tracking pengiriman berbasis web untuk perusahaan logistik.",
  },
  {
    id: "4",
    title: "HealthCare Booking",
    category: "Mobile App",
    imageUrl: "https://picsum.photos/800/600?random=4",
    description:
      "Aplikasi booking dokter dan telemedisin yang terintegrasi dengan sistem rumah sakit.",
  },
];

const ViewAllLink: React.FC<{ className?: string }> = ({ className = "" }) => (
  <a
    href="#"
    className={`inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors ${className}`}
  >
    Lihat Semua Project <ExternalLink className="w-4 h-4 ml-2" />
  </a>
);

export const Portfolio: React.FC = () => {
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
          <ViewAllLink className="hidden md:flex" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-indigo-400 text-sm font-semibold mb-2">
                  {project.category}
                </span>
                <h4 className="text-2xl font-bold text-white mb-2">
                  {project.title}
                </h4>
                <p className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <ViewAllLink />
        </div>
      </div>
    </section>
  );
};
