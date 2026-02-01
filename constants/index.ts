// ===== Contact & Social =====
export const CONTACT = {
  PHONE: "6285705041136",
  PHONE_DISPLAY: "0857-0504-1136",
  EMAIL: "uneeddeveloper2025@gmail.com",
  INSTAGRAM_URL: "https://www.instagram.com/uneeddeveloper/",
  INSTAGRAM_HANDLE: "@uneeddeveloper",
  WHATSAPP_URL: "https://wa.me/6285705041136",
  ADDRESS: "Purnajaya 1 Jalur II No.28",
  ADDRESS_CITY: "Pontianak Utara, Kota Pontianak, Kalimantan Barat, Indonesia",
} as const;

// ===== Auth =====
export const AUTH = {
  EMAIL: "admin@uneed.com",
  PASSWORD: "admin123",
} as const;

// ===== LocalStorage Keys =====
export const STORAGE_KEYS = {
  IS_AUTHENTICATED: "isAuthenticated",
  ADMIN_PROJECTS: "admin_projects",
  ADMIN_TRANSACTIONS: "admin_transactions",
  JSONBIN_CONFIG: "jsonbin_config",
  TEAM_MEMBERS: "admin_team_members",
} as const;

// ===== API =====
export const API = {
  JSONBIN_BASE: "https://api.jsonbin.io/v3/b",
  JSONBIN_BIN_NAME: "Uneed Developer DB",
} as const;

// ===== Navigation =====
export const NAV_LINKS = [
  { name: "Layanan", href: "#services" },
  { name: "Kontak", href: "#contact" },
] as const;

// ===== Admin Tabs =====
export type AdminTab = "overview" | "projects" | "revenue" | "team" | "reports" | "database";

// ===== Project Status & Transaction Type =====
export const PROJECT_STATUSES = ["Pending", "In Progress", "Completed", "Cancelled"] as const;
export const TRANSACTION_TYPES = ["Income", "Expense"] as const;

// ===== UI Constants =====
export const SCROLL_THRESHOLD = 50;
export const SYNC_STATUS_RESET_DELAY = 3000;
export const LOGIN_SIMULATION_DELAY = 1000;
export const NAV_SCROLL_DELAY = 100;

// ===== Trust Indicators =====
export const TRUST_INDICATORS = [
  "Tim Expert",
  "Teknologi Terbaru",
  "Support 24/7",
] as const;

// ===== Service Options (for Contact form) =====
export const SERVICE_OPTIONS = [
  { value: "web", label: "Web Application" },
  { value: "mobile", label: "Mobile Application" },
  { value: "report", label: "Pelaporan & Data" },
  { value: "custom", label: "Sistem Custom" },
] as const;

// ===== Footer Links =====
export const FOOTER_LINKS = {
  layanan: [
    { label: "Web Development", href: "#" },
    { label: "Mobile Apps", href: "#" },
    { label: "Automated Reporting", href: "#" },
    { label: "UI/UX Design", href: "#" },
  ],
  perusahaan: [
    { label: "Tentang Kami", href: "#" },
    { label: "Karir", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Kontak", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
} as const;

// ===== Social Links =====
export const SOCIAL_LINKS = [
  { name: "Github", href: "#" },
  { name: "Linkedin", href: "#" },
  { name: "Twitter", href: "#" },
  { name: "Instagram", href: CONTACT.INSTAGRAM_URL },
] as const;

// ===== Default Form Values =====
export const DEFAULT_CONTACT_FORM = {
  name: "",
  email: "",
  service: "web",
  message: "",
} as const;

export const DEFAULT_PROJECT_FORM = {
  status: "Pending" as const,
};

export const getDefaultTransactionForm = () => ({
  type: "Income" as const,
  date: new Date().toISOString().split("T")[0],
});

// ===== Chat =====
export const CHAT_WELCOME_MESSAGE =
  "Halo! 👋 Saya Uneed AI Assistant. Ada yang bisa saya bantu terkait pembuatan website, aplikasi mobile, atau sistem laporan bisnis Anda hari ini?";
