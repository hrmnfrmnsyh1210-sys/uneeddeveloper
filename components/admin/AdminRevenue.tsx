import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../Button";
import { FormInput, FormSelect } from "../ui/FormInput";
import { AdminProject, Transaction } from "../../types";
import { formatRupiah } from "../../utils/helpers";

interface AdminRevenueProps {
  transactions: Transaction[];
  projects: AdminProject[];
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
          <div className="flex gap-2 justify-end">
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
        <table className="w-full text-left min-w-[800px] md:min-w-full">
          <thead className="bg-slate-900 text-slate-400 text-sm uppercase">
            <tr>
              <th className="p-4 font-medium">Tanggal</th>
              <th className="p-4 font-medium">Deskripsi</th>
              <th className="p-4 font-medium">Project</th>
              <th className="p-4 font-medium text-right">Jumlah</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
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
