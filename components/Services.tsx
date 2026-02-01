import React from "react";
import {
  Smartphone,
  Monitor,
  FileText,
  BarChart3,
  Database,
  Layers,
} from "lucide-react";
import { ServiceItem } from "../types";

const services: ServiceItem[] = [
  {
    id: "report",
    title: "Pelaporan & Dashboard",
    description:
      "Ubah data mentah menjadi wawasan bisnis yang berharga melalui dashboard interaktif dan sistem pelaporan otomatis.",
    icon: <BarChart3 className="w-8 h-8" />,
    features: [
      "Real-time Analytics",
      "Export PDF/Excel Otomatis",
      "Data Visualization",
      "Business Intelligence",
    ],
  },
  {
    id: "web",
    title: "Web Application",
    description:
      "Membangun aplikasi web yang skalabel, aman, dan responsif menggunakan teknologi modern terkini.",
    icon: <Monitor className="w-8 h-8" />,
    features: [
      "React & Next.js",
      "Progressive Web Apps (PWA)",
      "SaaS Development",
      "Admin Panels",
    ],
  },
  {
    id: "mobile",
    title: "Mobile Application",
    description:
      "Jangkau pengguna di mana saja dengan aplikasi mobile native performa tinggi untuk iOS dan Android.",
    icon: <Smartphone className="w-8 h-8" />,
    features: [
      "Flutter & React Native",
      "iOS & Android",
      "Push Notifications",
      "Offline Mode",
    ],
  },
  {
    id: "backend",
    title: "Backend & API",
    description:
      "Pondasi kuat untuk aplikasi Anda dengan arsitektur server yang handal dan API yang teroptimasi.",
    icon: <Database className="w-8 h-8" />,
    features: [
      "RESTful API",
      "GraphQL",
      "Cloud Infrastructure",
      "Database Optimization",
    ],
  },
  {
    id: "custom",
    title: "Custom System",
    description:
      "Sistem yang dirancang khusus sesuai dengan alur kerja unik bisnis Anda. Tidak ada batasan fitur.",
    icon: <Layers className="w-8 h-8" />,
    features: ["ERP Systems", "CRM Custom", "Inventory Management", "HRIS"],
  },
  {
    id: "consult",
    title: "Konsultasi IT",
    description:
      "Bingung mulai dari mana? Diskusikan ide Anda dengan tim ahli kami untuk mendapatkan roadmap terbaik.",
    icon: <FileText className="w-8 h-8" />,
    features: [
      "Tech Stack Advisory",
      "System Design",
      "Feasibility Study",
      "Project Management",
    ],
  },
];

export const Services: React.FC = () => {
  return (
    <section
      id="services"
      className="py-24 bg-slate-900 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-indigo-400 font-semibold tracking-wide uppercase mb-3">
            Layanan Kami
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Solusi Digital Komprehensif
          </h3>
          <p className="text-slate-400 text-lg">
            Kami menyediakan layanan end-to-end mulai dari perencanaan, desain,
            pengembangan, hingga pemeliharaan sistem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-slate-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-colors duration-300 shadow-lg shadow-black/20">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                {service.title}
              </h4>
              <p className="text-slate-400 mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-sm text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
