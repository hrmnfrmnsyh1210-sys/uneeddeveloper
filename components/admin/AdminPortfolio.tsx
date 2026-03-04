import React from "react";
import { Plus, Edit3, Trash2, ExternalLink, Image, X, Check, Loader2, Globe } from "lucide-react";
import { PortfolioItem } from "../../types";
import { PORTFOLIO_CATEGORIES } from "../../constants";

interface AdminPortfolioProps {
  portfolioItems: PortfolioItem[];
  showAddPortfolio: boolean;
  editingPortfolioId: string | null;
  newPortfolioItem: Partial<PortfolioItem>;
  setNewPortfolioItem: (item: Partial<PortfolioItem>) => void;
  isSyncing: boolean;
  onSave: () => void;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Web App": "from-indigo-600 to-indigo-400",
  "Mobile App": "from-violet-600 to-violet-400",
  "Reporting": "from-blue-600 to-blue-400",
  "Backend & API": "from-emerald-600 to-emerald-400",
  "Custom System": "from-amber-600 to-amber-400",
};

const getCategoryColor = (category: string) =>
  CATEGORY_COLORS[category] ?? "from-slate-600 to-slate-400";

export const AdminPortfolio: React.FC<AdminPortfolioProps> = ({
  portfolioItems,
  showAddPortfolio,
  editingPortfolioId,
  newPortfolioItem,
  setNewPortfolioItem,
  isSyncing,
  onSave,
  onEdit,
  onDelete,
  onCancel,
  onAdd,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Manajemen Portfolio</h2>
          <p className="text-slate-400 mt-1">
            Kelola karya terbaik yang ditampilkan di halaman depan website.
          </p>
        </div>
        <button
          onClick={onAdd}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Tambah Portfolio
        </button>
      </div>

      {/* Form Tambah / Edit */}
      {showAddPortfolio && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {editingPortfolioId ? "Edit Portfolio" : "Tambah Portfolio Baru"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Judul Project *</label>
              <input
                type="text"
                placeholder="Contoh: Finance Dashboard Pro"
                value={newPortfolioItem.title ?? ""}
                onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Kategori</label>
              <select
                value={newPortfolioItem.category ?? "Web App"}
                onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PORTFOLIO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Link Project *</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="url"
                placeholder="https://example.com/project"
                value={newPortfolioItem.link ?? ""}
                onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, link: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Masukkan URL lengkap (https://...)</p>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Deskripsi</label>
            <textarea
              placeholder="Jelaskan singkat tentang project ini..."
              rows={3}
              value={newPortfolioItem.description ?? ""}
              onChange={(e) => setNewPortfolioItem({ ...newPortfolioItem, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
              Batal
            </button>
            <button
              onClick={onSave}
              disabled={isSyncing}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {editingPortfolioId ? "Simpan Perubahan" : "Simpan"}
            </button>
          </div>
        </div>
      )}

      {/* List Portfolio */}
      {portfolioItems.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
          <Image className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Belum ada portfolio</p>
          <p className="text-slate-500 text-sm mt-1">
            Klik "Tambah Portfolio" untuk menambahkan karya pertamamu.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-600 transition-colors"
            >
              {/* Color Banner */}
              <div className={`h-3 w-full bg-gradient-to-r ${getCategoryColor(item.category)}`} />

              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <h4 className="text-white font-bold text-lg leading-tight mt-0.5 truncate">
                      {item.title}
                    </h4>
                  </div>
                  <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-slate-400 text-sm line-clamp-2">{item.description}</p>
                )}

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors truncate max-w-full"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.link}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {portfolioItems.length > 0 && (
        <p className="text-center text-slate-500 text-sm">
          {portfolioItems.length} item portfolio · Ditampilkan di halaman depan website
        </p>
      )}
    </div>
  );
};
