import React from "react";
import { Code2, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { FOOTER_LINKS, SOCIAL_LINKS } from "../constants";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Github: <Github className="w-5 h-5" />,
  Linkedin: <Linkedin className="w-5 h-5" />,
  Twitter: <Twitter className="w-5 h-5" />,
  Instagram: <Instagram className="w-5 h-5" />,
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 text-slate-400 text-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="bg-slate-800 p-2 rounded-lg text-white">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">
                Uneed<span className="text-indigo-400">Developer</span>
              </span>
            </a>
            <p className="mb-6 leading-relaxed">
              Kami membantu perusahaan dan startup membangun produk digital kelas
              dunia dengan teknologi terkini.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href !== "#" ? "_blank" : undefined}
                  rel={link.href !== "#" ? "noopener noreferrer" : undefined}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {SOCIAL_ICONS[link.name]}
                </a>
              ))}
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-white font-bold mb-4">Layanan</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.layanan.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-indigo-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="text-white font-bold mb-4">Perusahaan</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.perusahaan.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-indigo-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-indigo-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} Uneed Developer. All rights reserved.
          </p>
          <p className="mt-2 md:mt-0">Dibuat dengan ❤️ di Indonesia</p>
        </div>
      </div>
    </footer>
  );
};
