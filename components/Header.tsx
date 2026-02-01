import React, { useState, useEffect } from "react";
import { Menu, X, Code2, LogIn } from "lucide-react";
import { Button } from "./Button";

interface HeaderProps {
  onNavigate?: (page: "home" | "login") => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Layanan", href: "#services" },
    { name: "Kontak", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    if (onNavigate) onNavigate("home");
    setIsMobileMenuOpen(false);

    // Slight delay to allow view change if needed
    setTimeout(() => {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#");
          }}
          className="flex items-center gap-2 group"
        >
          <div className="bg-indigo-600 p-2 rounded-lg text-white group-hover:scale-105 transition-transform">
            <Code2 className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Uneed<span className="text-indigo-400">Dev</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Button
            variant="ghost"
            className="!py-2 !px-4 !text-sm text-slate-300"
            onClick={() => onNavigate && onNavigate("login")}
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Login
          </Button>
          <Button
            variant="primary"
            className="!py-2 !px-4 !text-sm !rounded-lg"
            onClick={() => handleNavClick("#contact")}
          >
            Mulai Proyek
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 p-6 md:hidden flex flex-col gap-4 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-300 hover:text-white font-medium py-2 block border-b border-slate-800 last:border-0"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
            >
              {link.name}
            </a>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onNavigate && onNavigate("login");
            }}
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Login Admin
          </Button>
          <Button
            variant="primary"
            className="w-full mt-4"
            onClick={() => handleNavClick("#contact")}
          >
            Mulai Proyek
          </Button>
        </div>
      )}
    </header>
  );
};
