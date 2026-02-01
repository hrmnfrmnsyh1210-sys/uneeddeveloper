import React from "react";
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Button } from "../Button";
import { FormInput, FormSelect } from "../ui/FormInput";
import { AdminProject, Transaction, TeamMember, RevenueSplit } from "../../types";
import { formatRupiah } from "../../utils/helpers";

interface AdminRevenueProps {
  transactions: Transaction[];
  projects: AdminProject[];
  teamMembers: TeamMember[];
  showAddTrans: boolean;
  editingTransId: string | null;
  newTrans: Partial<Transaction>;
  setNewTrans: (t: Partial<Transaction>) => void;
  isSyncing: boolean;
  onSave: () => void;
  onEdit: (trans: Transaction) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  onAdd: () => void;
}

export const AdminRevenue: React.FC<AdminRevenueProps> = ({
  transactions,
  projects,
  teamMembers,
  showAddTrans,
  editingTransId,
  newTrans,
  setNewTrans,
  isSyncing,
  onSave,
  onEdit,
  onDelete,
  onCancel,
  onAdd,
}) => {
  const currentSplits: RevenueSplit[] = newTrans.splits || [];
  const totalSplitAmount = currentSplits.reduce((sum, s) => sum + s.amount, 0);
  const transAmount = Number(newTrans.amount) || 0;
  const remaining = transAmount - totalSplitAmount;

  const handleAddSplit = () => {
    const updatedSplits = [...currentSplits, { memberId: "", amount: 0 }];
    setNewTrans({ ...newTrans, splits: updatedSplits });
  };

  const handleUpdateSplit = (index: number, field: keyof RevenueSplit, value: string | number) => {
    const updatedSplits = currentSplits.map((s, i) =>
      i === index ? { ...s, [field]: field === "amount" ? Number(value) : value } : s
    );
    setNewTrans({ ...newTrans, splits: updatedSplits });
  };

  const handleRemoveSplit = (index: number) => {
    const updatedSplits = currentSplits.filter((_, i) => i !== index);
    setNewTrans({ ...newTrans, splits: updatedSplits });
  };

  const getMemberName = (memberId: string) => {
    return teamMembers.find((m) => m.id === memberId)?.name || "-";
  };

  const isIncome = newTrans.type === "Income";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Manajemen Pendapatan</h2>
        <Button
          onClick={onAdd}
          className="bg-green-600 hover:bg-green-500"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Catat Transaksi
        </Button>
      </div>

      {showAddTrans && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingTransId ? "Edit Transaksi" : "Tambah Transaksi"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormInput
              type="date"
              value={newTrans.date}
              onChange={(e) => setNewTrans({ ...newTrans, date: e.target.value })}
            />
            <FormInput
              placeholder="Deskripsi"
              value={newTrans.description || ""}
              onChange={(e) => setNewTrans({ ...newTrans, description: e.target.value })}
            />
            <FormInput
              type="number"
              placeholder="Jumlah (Rp)"
              value={newTrans.amount || ""}
              onChange={(e) => setNewTrans({ ...newTrans, amount: Number(e.target.value) })}
            />
            <FormSelect
              value={newTrans.type}
              onChange={(e) => setNewTrans({ ...newTrans, type: e.target.value as any })}
            >
              <option value="Income">Pemasukan (+)</option>
              <option value="Expense">Pengeluaran (-)</option>
            </FormSelect>
            <FormSelect
              value={newTrans.projectId}
              onChange={(e) => setNewTrans({ ...newTrans, projectId: e.target.value })}
            >
              <option value="">-- Pilih Project (Opsional) --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </FormSelect>
          </div>

          {/* Revenue Split Section - Only for Income */}
          {isIncome && teamMembers.length > 0 && (
            <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-slate-300">
                  Pembagian ke Tim
                </h4>
                <button
                  type="button"
                  onClick={handleAddSplit}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah
                </button>
              </div>

              {currentSplits.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Belum ada pembagian. Klik "Tambah" untuk membagi pendapatan ke anggota tim.
                </p>
              ) : (
                <div className="space-y-2">
                  {currentSplits.map((split, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        value={split.memberId}
                        onChange={(e) => handleUpdateSplit(index, "memberId", e.target.value)}
                        className="flex-1 bg-slate-800 border border-slate-600 p-2 rounded text-white text-sm focus:border-indigo-500 outline-none"
                      >
                        <option value="">-- Pilih Anggota --</option>
                        {teamMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.role})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Nominal (Rp)"
                        value={split.amount || ""}
                        onChange={(e) => handleUpdateSplit(index, "amount", e.target.value)}
                        className="w-40 bg-slate-800 border border-slate-600 p-2 rounded text-white text-sm focus:border-indigo-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSplit(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {transAmount > 0 && (
                    <div
                      className={`flex items-center gap-2 text-xs mt-2 ${
                        remaining < 0 ? "text-red-400" : remaining > 0 ? "text-yellow-400" : "text-green-400"
                      }`}
                    >
                      <AlertCircle className="w-3 h-3" />
                      {remaining === 0
                        ? "Semua pendapatan sudah terbagi."
                        : remaining > 0
                          ? `Sisa belum dibagi: ${formatRupiah(remaining)}`
                          : `Melebihi total transaksi: ${formatRupiah(Math.abs(remaining))}`}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {isIncome && teamMembers.length === 0 && (
            <p className="text-xs text-slate-500 mt-2">
              Tambahkan anggota tim di tab "Tim" untuk bisa membagi pendapatan.
            </p>
          )}

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="ghost" onClick={onCancel}>
              Batal
            </Button>
            <Button
              onClick={onSave}
              className="bg-green-600 hover:bg-green-500"
              isLoading={isSyncing}
            >
              {editingTransId ? "Update & Sync" : "Simpan & Sync"}
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700">
        <table className="w-full text-left min-w-[900px] md:min-w-full">
          <thead className="bg-slate-900 text-slate-400 text-sm uppercase">
            <tr>
              <th className="p-4 font-medium">Tanggal</th>
              <th className="p-4 font-medium">Deskripsi</th>
              <th className="p-4 font-medium">Project</th>
              <th className="p-4 font-medium">Pembagian</th>
              <th className="p-4 font-medium text-right">Jumlah</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Belum ada data transaksi.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="text-slate-300 hover:bg-slate-700/50">
                  <td className="p-4 text-sm">{t.date}</td>
                  <td className="p-4">{t.description}</td>
                  <td className="p-4 text-sm text-slate-500">
                    {projects.find((p) => p.id === t.projectId)?.name || "-"}
                  </td>
                  <td className="p-4 text-sm">
                    {t.splits && t.splits.length > 0 ? (
                      <div className="space-y-0.5">
                        {t.splits.map((split, i) => (
                          <div key={i} className="text-xs text-slate-400">
                            {getMemberName(split.memberId)}:{" "}
                            <span className="text-green-400">{formatRupiah(split.amount)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td
                    className={`p-4 text-right font-medium ${
                      t.type === "Income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {t.type === "Income" ? "+" : "-"} {formatRupiah(t.amount)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(t)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors p-2 hover:bg-slate-700 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(t.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-slate-700 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
