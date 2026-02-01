import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  DollarSign,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  Search,
  Code2,
  Calendar,
} from "lucide-react";
import { Button } from "./Button";
import { AdminProject, Transaction } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AdminDashboardProps {
  onLogout: () => void;
}

// Initial Mock Data
const INITIAL_PROJECTS: AdminProject[] = [
  {
    id: "1",
    name: "E-Commerce App",
    client: "PT Retail Indo",
    value: 25000000,
    status: "In Progress",
    deadline: "2024-06-30",
  },
  {
    id: "2",
    name: "Company Profile",
    client: "CV Maju Jaya",
    value: 5000000,
    status: "Completed",
    deadline: "2024-03-15",
  },
  {
    id: "3",
    name: "HRIS System",
    client: "Corp Tech",
    value: 45000000,
    status: "Pending",
    deadline: "2024-08-01",
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    date: "2024-03-01",
    description: "DP Company Profile",
    amount: 2500000,
    projectId: "2",
    type: "Income",
  },
  {
    id: "2",
    date: "2024-03-15",
    description: "Pelunasan Company Profile",
    amount: 2500000,
    projectId: "2",
    type: "Income",
  },
  {
    id: "3",
    date: "2024-04-10",
    description: "DP E-Commerce",
    amount: 10000000,
    projectId: "1",
    type: "Income",
  },
  {
    id: "4",
    date: "2024-04-12",
    description: "Server Cost AWS",
    amount: 1500000,
    projectId: "1",
    type: "Expense",
  },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "revenue" | "reports"
  >("overview");

  // Data State with simple localStorage persistence
  const [projects, setProjects] = useState<AdminProject[]>(() => {
    const saved = localStorage.getItem("admin_projects");
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("admin_transactions");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Persist data when changed
  useEffect(() => {
    localStorage.setItem("admin_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("admin_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Derived Stats
  const totalRevenue = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const activeProjectsCount = projects.filter(
    (p) => p.status === "In Progress" || p.status === "Pending",
  ).length;
  const completedProjectsCount = projects.filter(
    (p) => p.status === "Completed",
  ).length;

  // New Item States
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState<Partial<AdminProject>>({
    status: "Pending",
  });
  const [showAddTrans, setShowAddTrans] = useState(false);
  const [newTrans, setNewTrans] = useState<Partial<Transaction>>({
    type: "Income",
    date: new Date().toISOString().split("T")[0],
  });

  // Handlers
  const handleAddProject = () => {
    if (newProject.name && newProject.client && newProject.value) {
      const project: AdminProject = {
        id: Date.now().toString(),
        name: newProject.name,
        client: newProject.client,
        value: Number(newProject.value),
        status: newProject.status as any,
        deadline: newProject.deadline || "",
      };
      setProjects([...projects, project]);
      setShowAddProject(false);
      setNewProject({ status: "Pending" });
    }
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Yakin ingin menghapus project ini?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleAddTrans = () => {
    if (newTrans.description && newTrans.amount) {
      const trans: Transaction = {
        id: Date.now().toString(),
        date: newTrans.date || new Date().toISOString().split("T")[0],
        description: newTrans.description,
        amount: Number(newTrans.amount),
        projectId: newTrans.projectId || "",
        type: newTrans.type as any,
      };
      setTransactions([...transactions, trans]);
      setShowAddTrans(false);
      setNewTrans({
        type: "Income",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleDeleteTrans = (id: string) => {
    if (confirm("Hapus transaksi ini?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  // Report Data Gen
  const getMonthlyRevenue = () => {
    const monthlyData: { [key: string]: number } = {};
    transactions
      .filter((t) => t.type === "Income")
      .forEach((t) => {
        const month = new Date(t.date).toLocaleString("id-ID", {
          month: "short",
        });
        monthlyData[month] = (monthlyData[month] || 0) + t.amount;
      });
    return Object.entries(monthlyData).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 font-medium">Net Profit</h3>
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">
                  Rp {netProfit.toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Total Pendapatan Bersih
                </p>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 font-medium">
                    Active Projects
                  </h3>
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <FolderKanban className="w-5 h-5 text-indigo-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">
                  {activeProjectsCount}
                </p>
                <p className="text-sm text-slate-500 mt-2">Sedang dikerjakan</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 font-medium">Completed</h3>
                  <div className="p-2 bg-teal-500/10 rounded-lg">
                    <Code2 className="w-5 h-5 text-teal-500" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">
                  {completedProjectsCount}
                </p>
                <p className="text-sm text-slate-500 mt-2">Project selesai</p>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-6">
                Pendapatan Bulanan
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getMonthlyRevenue()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis
                      stroke="#94a3b8"
                      tickFormatter={(value) => `Rp${value / 1000000}jt`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderColor: "#334155",
                        color: "#fff",
                      }}
                      formatter={(value: number) => [
                        `Rp ${value.toLocaleString("id-ID")}`,
                        "Pendapatan",
                      ]}
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                      {getMonthlyRevenue().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? "#6366f1" : "#818cf8"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Manajemen Project
              </h2>
              <Button
                onClick={() => setShowAddProject(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Project Baru
              </Button>
            </div>

            {showAddProject && (
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-bold text-white mb-4">
                  Tambah Project
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    placeholder="Nama Project"
                    className="bg-slate-900 border border-slate-600 p-2 rounded text-white"
                    value={newProject.name || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                  />
                  <input
                    placeholder="Klien"
                    className="bg-slate-900 border border-slate-600 p-2 rounded text-white"
                    value={newProject.client || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, client: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Nilai (Rp)"
                    className="bg-slate-900 border border-slate-600 p-2 rounded text-white"
                    value={newProject.value || ""}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        value: Number(e.target.value),
                      })
                    }
                  />
                  <input
                    type="date"
                    className="bg-slate-900 border border-slate-600 p-2 rounded text-white"
                    value={newProject.deadline || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, deadline: e.target.value })
                    }
                  />
                  <select
                    className="bg-slate-900 border border-slate-600 p-2 rounded text-white"
                    value={newProject.status}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        status: e.target.value as any,
                      })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddProject(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleAddProject}>Simpan</Button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 text-sm uppercase">
                  <tr>
                    <th className="p-4 font-medium">Project Name</th>
                    <th className="p-4 font-medium">Client</th>
                    <th className="p-4 font-medium">Value</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {projects.map((p) => (
                    <tr
                      key={p.id}
                      className="text-slate-300 hover:bg-slate-700/50"
                    >
                      <td className="p-4">{p.name}</td>
                      <td className="p-4">{p.client}</td>
                      <td className="p-4">
                        Rp {p.value.toLocaleString("id-ID")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium 
                          ${
                            p.status === "Completed"
                              ? "bg-green-500/20 text-green-400"
                              : p.status === "In Progress"
                                ? "bg-indigo-500/20 text-indigo-400"
                                : "bg-slate-500/20 text-slate-400"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "revenue":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Manajemen Pendapatan
              </h2>
              <Button
                onClick={() => setShowAddTrans(true)}
                className="bg-green-600 hover:bg-green-500"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Catat Transaksi
              </Button>
            </div>

            {showAddTrans && (
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-bold text-white mb-4">
                  Tambah Transaksi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="date"
                    className="bg-slate-900 border border-slate-600 p-2 rounded text-white"
                    value={newTrans.date}
                    onChange={(e) =>
                      setNewTrans({ ...newTrans, date: e.target.value })
                    }
                  />
                  <input
                    placeholder="Deskripsi"
                    className="bg-slate-900 border border-slate-600 p-2 rounded text-white"
                    value={newTrans.description || ""}
                    onChange={(e) =>
                      setNewTrans({ ...newTrans, description: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Jumlah (Rp)"
                    className="bg-slate-900 border border-slate-600 p-2 rounded text-white"
                    value={newTrans.amount || ""}
                    onChange={(e) =>
                      setNewTrans({
                        ...newTrans,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                  <select
                    className="bg-slate-900 border border-slate-600 p-2 rounded text-white"
                    value={newTrans.type}
                    onChange={(e) =>
                      setNewTrans({ ...newTrans, type: e.target.value as any })
                    }
                  >
                    <option value="Income">Pemasukan (+)</option>
                    <option value="Expense">Pengeluaran (-)</option>
                  </select>
                  <select
                    className="bg-slate-900 border border-slate-600 p-2 rounded text-white"
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
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddTrans(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleAddTrans}
                    className="bg-green-600 hover:bg-green-500"
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700">
              <table className="w-full text-left">
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
                  {transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="text-slate-300 hover:bg-slate-700/50"
                    >
                      <td className="p-4 text-sm">{t.date}</td>
                      <td className="p-4">{t.description}</td>
                      <td className="p-4 text-sm text-slate-500">
                        {projects.find((p) => p.id === t.projectId)?.name ||
                          "-"}
                      </td>
                      <td
                        className={`p-4 text-right font-medium ${t.type === "Income" ? "text-green-400" : "text-red-400"}`}
                      >
                        {t.type === "Income" ? "+" : "-"} Rp{" "}
                        {t.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteTrans(t.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Laporan Keuangan & Project
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6">
                  Tren Pemasukan
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getMonthlyRevenue()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          borderColor: "#334155",
                        }}
                        formatter={(value: number) =>
                          `Rp ${value.toLocaleString()}`
                        }
                      />
                      <Bar dataKey="value" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">
                  Ringkasan Kinerja
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/30 rounded-lg flex justify-between items-center">
                    <span className="text-slate-300">
                      Total Project Selesai
                    </span>
                    <span className="text-xl font-bold text-white">
                      {completedProjectsCount}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg flex justify-between items-center">
                    <span className="text-slate-300">
                      Rata-rata Nilai Project
                    </span>
                    <span className="text-xl font-bold text-white">
                      Rp{" "}
                      {projects.length > 0
                        ? (
                            projects.reduce((sum, p) => sum + p.value, 0) /
                            projects.length
                          ).toLocaleString("id-ID", {
                            maximumFractionDigits: 0,
                          })
                        : 0}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg flex justify-between items-center">
                    <span className="text-slate-300">Margin Keuntungan</span>
                    <span className="text-xl font-bold text-green-400">
                      {totalRevenue > 0
                        ? ((netProfit / totalRevenue) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">Uneed Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "overview" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "projects" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <FolderKanban className="w-5 h-5" />
            <span>Projects</span>
          </button>
          <button
            onClick={() => setActiveTab("revenue")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "revenue" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Pendapatan</span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "reports" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Laporan</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};
