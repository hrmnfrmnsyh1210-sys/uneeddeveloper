import React from "react";
import { Button } from "./Button";
import { ArrowRight, CheckCircle2, Instagram } from "lucide-react";
import { CONTACT, TRUST_INDICATORS } from "../constants";

export const Hero: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-teal-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-indigo-300 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Sekarang Menerima Proyek Baru
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
            Bangun{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
              Aplikasi Impian
            </span>
            <br />
            Tanpa Batas.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Mitra teknologi terpercaya untuk pembuatan Laporan Otomatis, Website
            Modern, dan Aplikasi Mobile yang membantu bisnis Anda berkembang
            lebih cepat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              variant="primary"
              className="w-full sm:w-auto h-14 !text-lg !px-8"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={scrollToContact}
            >
              Konsultasi Gratis
            </Button>
            <a
              href={CONTACT.INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full h-14 !text-lg !px-8"
                leftIcon={<Instagram className="w-5 h-5" />}
              >
                Instagram Kami
              </Button>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-12 text-slate-500 font-medium text-sm">
            {TRUST_INDICATORS.map((indicator) => (
              <div key={indicator} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
