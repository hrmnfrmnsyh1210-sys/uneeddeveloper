import { CONTACT } from "../constants";

/**
 * Format angka ke format Rupiah Indonesia (tanpa simbol "Rp").
 * Contoh: 1500000 -> "1.500.000"
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("id-ID");
};

/**
 * Format angka ke format Rupiah lengkap dengan simbol.
 * Contoh: 1500000 -> "Rp 1.500.000"
 */
export const formatRupiah = (amount: number): string => {
  return `Rp ${formatCurrency(amount)}`;
};

/**
 * Ambil tanggal hari ini dalam format ISO (YYYY-MM-DD).
 */
export const getTodayISO = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Generate ID unik berbasis timestamp.
 */
export const generateId = (): string => {
  return Date.now().toString();
};

/**
 * Bangun URL WhatsApp dengan pesan yang sudah di-encode.
 */
export const buildWhatsAppURL = (message: string): string => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CONTACT.PHONE}?text=${encoded}`;
};

/**
 * Parse JSON dari localStorage dengan fallback.
 */
export const parseLocalStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return fallback;
  }
};
