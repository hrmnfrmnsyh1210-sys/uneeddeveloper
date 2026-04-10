import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  FolderKanban,
  Clock,
  TrendingUp,
  Calendar,
  X,
  Search,
} from "lucide-react";
import { Button } from "../Button";
import { FormInput, FormSelect } from "../ui/FormInput";
import { AdminProject } from "../../types";
import { PROJECT_STATUSES } from "../../constants";
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
} from "recharts";

interface AdminProjectsProps {
  projects: AdminProject[];
  showAddProject: boolean;
  editingProjectId: string | null;
  newProject: Partial<AdminProject>;
  setNewProject: (p: Partial<AdminProject>) => void;
  isSyncing: boolean;
  onSave: () => void;
  onEdit: (project: AdminProject) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const COLORS = {
  completed: "#10b981",
  inProgress: "#6366f1",
  planning: "#f59e0b",
};

const STATUS_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"];

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "Completed":
      return "bg-green-500/20 text-green-400";
    case "In Progress":
      return "bg-indigo-500/20 text-indigo-400";
    default:
      return "bg-slate-500/20 text-slate-400";
  }
};

export const AdminProjects: React.FC<AdminProjectsProps> = ({
  projects,
  showAddProject,
  editingProjectId,
  newProject,
  setNewProject,
  isSyncing,
  onSave,
  onEdit,
  onDelete,
  onCancel,
  onAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const totalValue = projects.reduce((sum, p) => sum + p.value, 0);
  const completedValue = projects
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + p.value, 0);
  const inProgressValue = projects
    .filter((p) => p.status === "In Progress")
    .reduce((sum, p) => sum + p.value, 0);
  const avgProjectValue =
    projects.length > 0 ? totalValue / projects.length : 0;

  // Project status distribution
  const statusDistribution = [
    {
      name: "Completed",
      count: projects.filter((p) => p.status === "Completed").length,
      value: completedValue,
      color: COLORS.completed,
    },
    {
      name: "In Progress",
      count: projects.filter((p) => p.status === "In Progress").length,
      value: inProgressValue,
      color: COLORS.inProgress,
    },
    {
      name: "Planning",
      count: projects.filter((p) => p.status === "Planning").length,
      value: projects
        .filter((p) => p.status === "Planning")
        .reduce((sum, p) => sum + p.value, 0),
      color: COLORS.planning,
    },
  ].filter((item) => item.count > 0);

  // Top projects by value
  const topProjects = [...projects]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((p) => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
      value: p.value,
      status: p.status,
    }));

  // Projects by client
  const projectsByClient = projects.reduce(
    (acc, project) => {
      const client = project.client;
      if (!acc[client]) {
        acc[client] = { client, count: 0, totalValue: 0 };
      }
      acc[client].count += 1;
      acc[client].totalValue += project.value;
      return acc;
    },
    {} as Record<string, { client: string; count: number; totalValue: number }>,
  );

  const clientData = Object.values(projectsByClient)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  // Upcoming deadlines (next 30 days)
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcomingDeadlines = projects
    .filter((p) => {
      const deadline = new Date(p.deadline);
      return (
        deadline >= now &&
        deadline <= thirtyDaysFromNow &&
        p.status !== "Completed"
      );
    })
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )
    .slice(0, 4);

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
                {entry.name.includes("Value") || entry.name.includes("value")
                  ? formatRupiah(entry.value)
                  : entry.value}
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
          <h2 className="text-2xl font-bold text-white">Manajemen Project</h2>
          <p className="text-slate-400 text-sm mt-1">
            Total: {projects.length} project • Value: {formatRupiah(totalValue)}
          </p>
        </div>
        <Button onClick={onAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Project Baru
        </Button>
      </div>

      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
          <div className="relative w-full max-w-lg bg-slate-800 rounded-xl border border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProjectId ? "Edit Project" : "Tambah Project"}
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
                placeholder="Nama Project"
                value={newProject.name || ""}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
              />
              <FormInput
                placeholder="Klien"
                value={newProject.client || ""}
                onChange={(e) =>
                  setNewProject({ ...newProject, client: e.target.value })
                }
              />
              <FormInput
                type="number"
                placeholder="Nilai (Rp)"
                value={newProject.value || ""}
                onChange={(e) =>
                  setNewProject({ ...newProject, value: Number(e.target.value) })
                }
              />
              <FormInput
                label="Tanggal Deadline"
                type="date"
                value={newProject.deadline || ""}
                onChange={(e) =>
                  setNewProject({ ...newProject, deadline: e.target.value })
                }
              />
              <FormSelect
                value={newProject.status}
                onChange={(e) =>
                  setNewProject({ ...newProject, status: e.target.value as any })
                }
              >
                {PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={onCancel}>
                Batal
              </Button>
              <Button onClick={onSave} isLoading={isSyncing}>
                {editingProjectId ? "Update & Sync" : "Simpan & Sync"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-green-500/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-500/20 p-2.5 rounded-lg">
                <FolderKanban className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <p className="text-green-400 text-sm font-medium mb-1">Completed</p>
            <p className="text-2xl font-bold text-white">
              {projects.filter((p) => p.status === "Completed").length}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {formatRupiah(completedValue)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border border-indigo-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-indigo-500/20 p-2.5 rounded-lg">
                <Clock className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <p className="text-indigo-400 text-sm font-medium mb-1">
              In Progress
            </p>
            <p className="text-2xl font-bold text-white">
              {projects.filter((p) => p.status === "In Progress").length}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {formatRupiah(inProgressValue)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-500/20 p-2.5 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-purple-400 text-sm font-medium mb-1">
              Total Value
            </p>
            <p className="text-2xl font-bold text-white">
              {formatRupiah(totalValue)}
            </p>
            <p className="text-xs text-slate-400 mt-1">All projects</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-orange-500/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-orange-500/20 p-2.5 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <p className="text-orange-400 text-sm font-medium mb-1">
              Avg Value
            </p>
            <p className="text-2xl font-bold text-white">
              {formatRupiah(avgProjectValue)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Per project</p>
          </div>
        </div>
      )}

      {/* Charts Row */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Status Distribution */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-green-500/30 transition-colors">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">
                Project Status
              </h3>
              <p className="text-slate-400 text-sm">
                Distribusi status project
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomPieLabel}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col justify-center space-y-3">
                {statusDistribution.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-300 text-sm font-medium">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-white font-bold text-sm">
                        {item.count}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 ml-5">
                      {formatRupiah(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Projects by Value */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-indigo-500/30 transition-colors">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">
                Top Projects
              </h3>
              <p className="text-slate-400 text-sm">
                5 project dengan value tertinggi
              </p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topProjects} layout="horizontal">
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
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Project Value">
                  {topProjects.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Secondary Row */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Clients */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-purple-500/30 transition-colors">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">Top Clients</h3>
              <p className="text-slate-400 text-sm">
                Klien dengan project terbanyak
              </p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={clientData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  type="number"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                />
                <YAxis
                  dataKey="client"
                  type="category"
                  stroke="#94a3b8"
                  fontSize={11}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="totalValue"
                  radius={[0, 8, 8, 0]}
                  name="Total Value"
                >
                  {clientData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-orange-500/30 transition-colors">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-1">
                Upcoming Deadlines
              </h3>
              <p className="text-slate-400 text-sm">
                Deadline dalam 30 hari ke depan
              </p>
            </div>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map((project) => {
                  const daysUntilDeadline = Math.ceil(
                    (new Date(project.deadline).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24),
                  );
                  return (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-white font-medium text-sm truncate">
                          {project.name}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          {project.client}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            daysUntilDeadline <= 7
                              ? "bg-red-500/20 text-red-400"
                              : daysUntilDeadline <= 14
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {daysUntilDeadline} hari
                        </div>
                        <p className="text-slate-400 text-xs mt-1">
                          {new Date(project.deadline).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-slate-500">
                Tidak ada deadline mendekati
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
          placeholder="Cari project, klien, atau status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700">
        <table className="w-full text-left min-w-[800px] md:min-w-full">
          <thead className="bg-slate-900 text-slate-400 text-sm uppercase">
            <tr>
              <th className="p-4 font-medium">Project Name</th>
              <th className="p-4 font-medium">Client</th>
              <th className="p-4 font-medium">Value</th>
              <th className="p-4 font-medium">Deadline</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Belum ada data project. Klik "Project Baru" untuk menambahkan.
                </td>
              </tr>
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Tidak ada project yang cocok dengan "{searchQuery}".
                </td>
              </tr>
            ) : (
              filteredProjects.map((p) => (
                <tr
                  key={p.id}
                  className="text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="p-4 font-medium text-white">{p.name}</td>
                  <td className="p-4">{p.client}</td>
                  <td className="p-4 font-medium text-green-400">
                    {formatRupiah(p.value)}
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(p.deadline).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
                        p.status,
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors p-2 hover:bg-slate-700 rounded-lg"
                        title="Edit project"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-slate-700 rounded-lg"
                        title="Hapus project"
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
