import React, { useState } from "react";
import { Button } from "./Button";
import { Mail, Phone, MapPin, Send, Instagram } from "lucide-react";
import { ContactCard } from "./ui/ContactCard";
import { ContactFormState } from "../types";
import { CONTACT, DEFAULT_CONTACT_FORM, SERVICE_OPTIONS } from "../constants";
import { buildWhatsAppURL } from "../utils/helpers";

export const Contact: React.FC = () => {
  const [formState, setFormState] = useState<ContactFormState>({ ...DEFAULT_CONTACT_FORM });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const text = `Halo Uneed Developer, perkenalkan saya ${formState.name}.\n\nSaya tertarik dengan layanan: ${formState.service.toUpperCase()}.\n\nDetail Project: ${formState.message}\n\nEmail saya: ${formState.email}`;
    const waUrl = buildWhatsAppURL(text);
    window.open(waUrl, "_blank");

    setIsSubmitting(false);
    setFormState({ ...DEFAULT_CONTACT_FORM });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
              Siap mentransformasi bisnis Anda dengan teknologi? Hubungi kami via
              WhatsApp atau DM Instagram untuk respon cepat.
            </p>

            <div className="space-y-6">
              <ContactCard
                icon={<Phone className="w-6 h-6" />}
                title="WhatsApp"
                description={CONTACT.PHONE_DISPLAY}
                href={CONTACT.WHATSAPP_URL}
                hoverColor="indigo"
              />
              <ContactCard
                icon={<Instagram className="w-6 h-6" />}
                title="Instagram"
                description={CONTACT.INSTAGRAM_HANDLE}
                href={CONTACT.INSTAGRAM_URL}
                hoverColor="pink"
              />
              <ContactCard
                icon={<Mail className="w-6 h-6" />}
                title="Email Kami"
                description={CONTACT.EMAIL}
              />
              <ContactCard
                icon={<MapPin className="w-6 h-6" />}
                title="Kantor Studio"
                description={
                  <p>
                    {CONTACT.ADDRESS}
                    <br />
                    {CONTACT.ADDRESS_CITY}
                  </p>
                }
              />
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl backdrop-blur-sm">
            <div className="mb-6">
              <h4 className="text-xl font-bold text-white mb-2">
                Kirim Pesan Langsung
              </h4>
              <p className="text-slate-400 text-sm">
                Form ini akan membuka WhatsApp Anda dengan pesan yang sudah terisi.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
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
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
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
                <label htmlFor="service" className="block text-sm font-medium text-slate-300 mb-2">
                  Layanan yang Dibutuhkan
                </label>
                <select
                  id="service"
                  name="service"
                  value={formState.service}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
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
