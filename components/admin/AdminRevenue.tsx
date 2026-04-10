import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  X,
  Search,
} from "lucide-react";
import { Button } from "../Button";
import { FormInput, FormSelect } from "../ui/FormInput";
import {
  AdminProject,
  Transaction,
  TeamMember,
  RevenueSplit,
} from "../../types";
import { formatRupiah } from "../../utils/helpers";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";

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

const COLORS = [
  "#10b981",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
];

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    const projectName = projects.find((p) => p.id === t.projectId)?.name ?? "";
    return (
      t.description.toLowerCase().includes(q) ||
      t.date.includes(q) ||
      t.type.toLowerCase().includes(q) ||
      projectName.toLowerCase().includes(q)
    );
  });

  const currentSplits: RevenueSplit[] = newTrans.splits || [];
  const totalSplitAmount = currentSplits.reduce((sum, s) => sum + s.amount, 0);
  const transAmount = Number(newTrans.amount) || 0;
  const remaining = transAmount - totalSplitAmount;

  // Calculate statistics
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netRevenue = totalIncome - totalExpense;
  const profitMargin =
    totalIncome > 0 ? ((netRevenue / totalIncome) * 100).toFixed(1) : "0";

  // Income vs Expense by month
  const monthlyData = transactions.reduce(
    (acc, trans) => {
      const date = new Date(trans.date);
      const monthKey = date.toLocaleString("id-ID", {
        month: "short",
        year: "numeric",
      });

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, income: 0, expense: 0, net: 0 };
      }

      if (trans.type === "Income") {
        acc[monthKey].income += trans.amount;
      } else {
        acc[monthKey].expense += trans.amount;
      }
      acc[monthKey].net = acc[monthKey].income - acc[monthKey].expense;

      return acc;
    },
    {} as Record<
      string,
      { month: string; income: number; expense: number; net: number }
    >,
  );

  const chartData = Object.values(monthlyData).sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA.getTime() - dateB.getTime();
  });

  // Revenue by project
  const revenueByProject = transactions
    .filter((t) => t.type === "Income" && t.projectId)
    .reduce(
      (acc, trans) => {
        const project = projects.find((p) => p.id === trans.projectId);
        const projectName = project?.name || "Unknown";

        if (!acc[projectName]) {
          acc[projectName] = 0;
        }
        acc[projectName] += trans.amount;

        return acc;
      },
      {} as Record<string, number>,
    );

  const projectData = Object.entries(revenueByProject)
    .map(([name, value]) => ({
      name: name.length > 20 ? name.substring(0, 20) + "..." : name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Income distribution (paid, pending, overdue)
  const incomeDistribution = [
    {
      name: "Paid",
      value: transactions
        .filter((t) => t.type === "Income" && t.status === "paid")
        .reduce((sum, t) => sum + t.amount, 0),
      color: COLORS[0],
    },
    {
      name: "Pending",
      value: transactions
        .filter((t) => t.type === "Income" && t.status === "pending")
        .reduce((sum, t) => sum + t.amount, 0),
      color: COLORS[2],
    },
    {
      name: "Overdue",
      value: transactions
        .filter((t) => t.type === "Income" && t.status === "overdue")
        .reduce((sum, t) => sum + t.amount, 0),
      color: COLORS[3],
    },
  ].filter((item) => item.value > 0);

  // Top expense categories (from descriptions)
  const expenseData = transactions
    .filter((t) => t.type === "Expense")
    .reduce(
      (acc, trans) => {
        const category = trans.description.split(" ")[0] || "Other";
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += trans.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

  const topExpenses = Object.entries(expenseData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const handleAddSplit = () => {
    const updatedSplits = [...currentSplits, { memberId: "", amount: 0 }];
    setNewTrans({ ...newTrans, splits: updatedSplits });
  };

  const handleUpdateSplit = (
    index: number,
    field: keyof RevenueSplit,
    value: string | number,
  ) => {
    const updatedSplits = currentSplits.map((s, i) =>
      i === index
        ? { ...s, [field]: field === "amount" ? Number(value) : value }
        : s,
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-600 rounded-xl p-4 shadow-2xl">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 mb-1"
            >
              <span className="text-slate-300 text-sm">{entry.name}:</span>
              <span className="font-bold" style={{ color: entry.color }}>
                {formatRupiah(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-bold drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Manajemen Pendapatan
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {transactions.length} transaksi • Net: {formatRupiah(netRevenue)}
          </p>
        </div>
        <Button
          onClick={onAdd}
          className="bg-green-600 hover:bg-green-500"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Catat Transaksi
        </Button>
      </div>

      {showAddTrans && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
          <div className="relative w-full max-w-lg bg-slate-800 rounded-xl border border-slate-700 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingTransId ? "Edit Transaksi" : "Tambah Transaksi"}
              </h3>
              <button
                onClick={onCancel}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormInput
                type="date"
                value={newTrans.date}
                onChange={(e) =>
                  setNewTrans({ ...newTrans, date: e.target.value })
                }
              />
              <FormInput
                placeholder="Deskripsi"
                value={newTrans.description || ""}
                onChange={(e) =>
                  setNewTrans({ ...newTrans, description: e.target.value })
                }
              />
              <FormInput
                type="number"
                placeholder="Jumlah (Rp)"
                value={newTrans.amount || ""}
                onChange={(e) =>
                  setNewTrans({ ...newTrans, amount: Number(e.target.value) })
                }
              />
              <FormSelect
                value={newTrans.type}
                onChange={(e) =>
                  setNewTrans({ ...newTrans, type: e.target.value as any })
                }
              >
                <option value="Income">Pemasukan (+)</option>
                <option value="Expense">Pengeluaran (-)</option>
              </FormSelect>
              <FormSelect
                value={newTrans.projectId}
                onChange={(e) =>
                  setNewTrans({ ...newTrans, projectId: e.target.value })
                }
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
                    Belum ada pembagian. Klik "Tambah" untuk membagi pendapatan ke
                    anggota tim.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {currentSplits.map((split, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <select
                          value={split.memberId}
                          onChange={(e) =>
                            handleUpdateSplit(index, "memberId", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleUpdateSplit(index, "amount", e.target.value)
                          }
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
                          remaining < 0
                            ? "text-red-400"
                            : remaining > 0
                              ? "text-yellow-400"
                              : "text-green-400"
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
        </div>
      )}

      {/* Statistics Cards */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-green-500/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-500/20 p-2.5 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-green-400 text-sm font-medium mb-1">
              Total Income
            </p>
            <p className="text-2xl font-bold text-white">
              {formatRupiah(totalIncome)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Pemasukan</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-red-500/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-red-500/20 p-2.5 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <p className="text-red-400 text-sm font-medium mb-1">
              Total Expense
            </p>
            <p className="text-2xl font-bold text-white">
              {formatRupiah(totalExpense)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Pengeluaran</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border border-indigo-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-indigo-500/20 p-2.5 rounded-lg">
                <DollarSign className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <p className="text-indigo-400 text-sm font-medium mb-1">
              Net Revenue
            </p>
            <p
              className={`text-2xl font-bold ${netRevenue >= 0 ? "text-white" : "text-red-400"}`}
            >
              {formatRupiah(netRevenue)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Keuntungan bersih</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-500/20 p-2.5 rounded-lg">
                <PieChartIcon className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-purple-400 text-sm font-medium mb-1">
              Profit Margin
            </p>
            <p className="text-2xl font-bold text-white">{profitMargin}%</p>
            <p className="text-xs text-slate-400 mt-1">Margin keuntungan</p>
          </div>
        </div>
      )}

      {/* Secondary Charts Row */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Project */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-purple-500/30 transition-colors">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">
                Revenue by Project
              </h3>
              <p className="text-slate-400 text-sm">
                Top 5 project penghasil revenue
              </p>
            </div>
            {projectData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}jt`
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Revenue">
                    {projectData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-slate-500">
                Belum ada data revenue per project
              </div>
            )}
          </div>

          {/* Top Expenses */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-orange-500/30 transition-colors">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">
                Top Expenses
              </h3>
              <p className="text-slate-400 text-sm">
                5 kategori pengeluaran terbesar
              </p>
            </div>
            {topExpenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topExpenses} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}jt`
                    }
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    fontSize={11}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} name="Expense">
                    {topExpenses.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-slate-500">
                Belum ada data expense
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Cari transaksi, deskripsi, atau project..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Transactions Table */}
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
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Tidak ada transaksi yang cocok dengan "{searchQuery}".
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
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
                            <span className="text-green-400">
                              {formatRupiah(split.amount)}
                            </span>
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
                        title="Edit transaksi"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(t.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-slate-700 rounded-lg"
                        title="Hapus transaksi"
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
