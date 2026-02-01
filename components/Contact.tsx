import React, { useState } from "react";
import { Button } from "./Button";
import { Mail, Phone, MapPin, Send, Instagram } from "lucide-react";
import { ContactFormState } from "../types";

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState<ContactFormState>({
    name: "",
    email: "",
    service: "web",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Construct WhatsApp Message
    const phoneNumber = "6285705041136";
    const text = `Halo Uneed Developer, perkenalkan saya ${formState.name}.\n\nSaya tertarik dengan layanan: ${formState.service.toUpperCase()}.\n\nDetail Project: ${formState.message}\n\nEmail saya: ${formState.email}`;
    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    // Open WhatsApp
    window.open(waUrl, "_blank");

    setIsSubmitting(false);
    setFormState({ name: "", email: "", service: "web", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24 bg-slate-900 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-indigo-400 font-semibold tracking-wide uppercase mb-3">
              Kontak Kami
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Mulai Proyek Anda Hari Ini
            </h3>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Siap mentransformasi bisnis Anda dengan teknologi? Hubungi kami
              via WhatsApp atau DM Instagram untuk respon cepat.
            </p>

            <div className="space-y-6">
              <a
                href="https://wa.me/6285705041136"
                target="_blank"
                rel="noreferrer"
                className="flex items-start group"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0 mr-4">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 group-hover:text-indigo-400 transition-colors">
                    WhatsApp
                  </h4>
                  <p className="text-slate-400">0857-0504-1136</p>
                </div>
              </a>

              <a
                href="https://www.instagram.com/uneeddeveloper/"
                target="_blank"
                rel="noreferrer"
                className="flex items-start group"
              >
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-indigo-400 group-hover:bg-pink-600 group-hover:text-white transition-colors flex-shrink-0 mr-4">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1 group-hover:text-pink-400 transition-colors">
                    Instagram
                  </h4>
                  <p className="text-slate-400">@uneeddeveloper</p>
                </div>
              </a>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0 mr-4">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email Kami</h4>
                  <p className="text-slate-400">uneeddeveloper2025@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0 mr-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Kantor Studio
                  </h4>
                  <p className="text-slate-400">
                    Purnajaya 1 Jalur II No.28
                    <br />
                    Pontianak Utara, Kota Pontianak, Kalimantan Barat, Indonesia
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl backdrop-blur-sm">
            <div className="mb-6">
              <h4 className="text-xl font-bold text-white mb-2">
                Kirim Pesan Langsung
              </h4>
              <p className="text-slate-400 text-sm">
                Form ini akan membuka WhatsApp Anda dengan pesan yang sudah
                terisi.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="email@anda.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Layanan yang Dibutuhkan
                </label>
                <select
                  id="service"
                  name="service"
                  value={formState.service}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                >
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile Application</option>
                  <option value="report">Pelaporan & Data</option>
                  <option value="custom">Sistem Custom</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Detail Proyek
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Ceritakan sedikit tentang proyek yang ingin Anda buat..."
                ></textarea>
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                rightIcon={!isSubmitting && <Send className="w-4 h-4" />}
                className="w-full bg-green-600 hover:bg-green-500 focus:ring-green-500 shadow-green-600/20"
              >
                Kirim via WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
