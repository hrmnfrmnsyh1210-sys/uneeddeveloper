import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  TrendingUp,
  DollarSign,
  X,
  Search,
} from "lucide-react";
import { Button } from "../Button";
import { FormInput } from "../ui/FormInput";
import { TeamMember } from "../../types";
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
} from "recharts";

interface AdminTeamProps {
  teamMembers: TeamMember[];
  showAddMember: boolean;
  editingMemberId: string | null;
  newMember: Partial<TeamMember>;
  setNewMember: (m: Partial<TeamMember>) => void;
  isSyncing: boolean;
  onSave: () => void;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  onAdd: () => void;
  getMemberRevenue: (memberId: string) => number;
  getTotalSplitRevenue: () => number;
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#f43f5e",
];

export const AdminTeam: React.FC<AdminTeamProps> = ({
  teamMembers,
  showAddMember,
  editingMemberId,
  newMember,
  setNewMember,
  isSyncing,
  onSave,
  onEdit,
  onDelete,
  onCancel,
  onAdd,
  getMemberRevenue,
  getTotalSplitRevenue,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = teamMembers.filter((m) => {
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q);
  });

  const totalSplit = getTotalSplitRevenue();

  // Prepare chart data
  const chartData = teamMembers
    .map((member) => ({
      name: member.name,
      revenue: getMemberRevenue(member.id),
      role: member.role,
    }))
    .filter((item) => item.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue);

  const pieData = chartData.map((item, index) => ({
    name: item.name,
    value: item.revenue,
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-slate-400 text-sm">{payload[0].payload.role}</p>
          <p className="text-green-400 font-bold mt-1">
            {formatRupiah(payload[0].value)}
          </p>
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
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Manajemen Tim</h2>
          <p className="text-slate-400 text-sm mt-1">
            Total pendapatan terbagi: {formatRupiah(totalSplit)}
          </p>
        </div>
        <Button onClick={onAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Tambah Anggota
        </Button>
      </div>

      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
          <div className="relative w-full max-w-lg bg-slate-800 rounded-xl border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingMemberId ? "Edit Anggota" : "Tambah Anggota"}
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
                placeholder="Nama Lengkap"
                value={newMember.name || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
              />
              <FormInput
                placeholder="Role (Developer, Designer, PM, dll)"
                value={newMember.role || ""}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={onCancel}>
                Batal
              </Button>
              <Button onClick={onSave} isLoading={isSyncing}>
                {editingMemberId ? "Update & Sync" : "Simpan & Sync"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Distribution Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">
                Pendapatan per Anggota
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
                />
                <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-white">
                Distribusi Pendapatan
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomPieLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry: any) => (
                    <span className="text-slate-300 text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border border-indigo-500/20 rounded-xl p-4">
            <p className="text-indigo-400 text-sm font-medium mb-1">
              Top Performer
            </p>
            <p className="text-white text-xl font-bold">{chartData[0]?.name}</p>
            <p className="text-green-400 text-sm font-medium mt-1">
              {formatRupiah(chartData[0]?.revenue)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-green-400 text-sm font-medium mb-1">
              Rata-rata Pendapatan
            </p>
            <p className="text-white text-xl font-bold">
              {formatRupiah(totalSplit / teamMembers.length)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4">
            <p className="text-purple-400 text-sm font-medium mb-1">
              Total Anggota
            </p>
            <p className="text-white text-xl font-bold">{teamMembers.length}</p>
            <p className="text-slate-400 text-sm mt-1">anggota tim aktif</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Cari nama atau role anggota..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {teamMembers.length === 0 ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">
            Belum ada anggota tim. Klik "Tambah Anggota" untuk memulai.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700">
          <table className="w-full text-left min-w-[600px] md:min-w-full">
            <thead className="bg-slate-900 text-slate-400 text-sm uppercase">
              <tr>
                <th className="p-4 font-medium">Nama</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium text-right">Total Pendapatan</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Tidak ada anggota yang cocok dengan "{searchQuery}".
                  </td>
                </tr>
              ) : filteredMembers.map((member, index) => {
                const revenue = getMemberRevenue(member.id);
                return (
                  <tr
                    key={member.id}
                    className="text-slate-300 hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="p-4 font-medium text-white">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        {member.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-500/20 text-indigo-400">
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-green-400">
                      {revenue > 0 ? formatRupiah(revenue) : "-"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(member)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors p-2 hover:bg-slate-700 rounded-lg"
                          title="Edit anggota"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(member.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-slate-700 rounded-lg"
                          title="Hapus anggota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
