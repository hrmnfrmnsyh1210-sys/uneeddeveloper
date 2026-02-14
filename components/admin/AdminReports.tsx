import React from "react";
import {
  Download,
  TrendingUp,
  DollarSign,
  FolderKanban,
  Users,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
import { Button } from "../Button";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { AdminProject, Transaction } from "../../types";
import { formatRupiah } from "../../utils/helpers";

interface AdminReportsProps {
  projects: AdminProject[];
  transactions: Transaction[];
  totalRevenue: number;
  netProfit: number;
  completedProjectsCount: number;
  getMonthlyRevenue: () => { name: string; value: number }[];
  onExport: () => void;
}

const COLORS = [
  "#10b981",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
];

export const AdminReports: React.FC<AdminReportsProps> = ({
  projects,
  transactions,
  totalRevenue,
  netProfit,
  completedProjectsCount,
  getMonthlyRevenue,
  onExport,
}) => {
  // Calculate comprehensive statistics
  const activeProjectsCount = projects.filter(
    (p) => p.status === "In Progress",
  ).length;
  const planningProjectsCount = projects.filter(
    (p) => p.status === "Planning",
  ).length;

  const avgProjectValue =
    projects.length > 0
      ? projects.reduce((sum, p) => sum + p.value, 0) / projects.length
      : 0;

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const profitMargin =
    totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0";

  const totalProjectValue = projects.reduce((sum, p) => sum + p.value, 0);
  const completedProjectValue = projects
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + p.value, 0);
  const inProgressProjectValue = projects
    .filter((p) => p.status === "In Progress")
    .reduce((sum, p) => sum + p.value, 0);

  // Project status distribution
  const projectStatusData = [
    {
      name: "Completed",
      value: completedProjectsCount,
      amount: completedProjectValue,
      color: COLORS[0],
    },
    {
      name: "In Progress",
      value: activeProjectsCount,
      amount: inProgressProjectValue,
      color: COLORS[1],
    },
    {
      name: "Planning",
      value: planningProjectsCount,
      amount: projects
        .filter((p) => p.status === "Planning")
        .reduce((sum, p) => sum + p.value, 0),
      color: COLORS[2],
    },
  ].filter((item) => item.value > 0);

  // Monthly trend data with income and expense
  const monthlyTrendData = getMonthlyRevenue().map((item) => {
    const month = item.name;
    const income = transactions
      .filter((t) => {
        const date = new Date(t.date);
        const monthName = date.toLocaleString("id-ID", { month: "short" });
        return t.type === "Income" && monthName === month.split(" ")[0];
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => {
        const date = new Date(t.date);
        const monthName = date.toLocaleString("id-ID", { month: "short" });
        return t.type === "Expense" && monthName === month.split(" ")[0];
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month,
      revenue: item.value,
      income,
      expense,
      profit: income - expense,
    };
  });

  // Top clients by project value
  const clientData = projects.reduce(
    (acc, project) => {
      if (!acc[project.client]) {
        acc[project.client] = {
          client: project.client,
          totalValue: 0,
          count: 0,
        };
      }
      acc[project.client].totalValue += project.value;
      acc[project.client].count += 1;
      return acc;
    },
    {} as Record<string, { client: string; totalValue: number; count: number }>,
  );

  const topClients = Object.values(clientData)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  // Performance metrics for radar chart
  const performanceData = [
    {
      metric: "Revenue",
      value: Math.min((totalRevenue / 100000000) * 100, 100),
      fullMark: 100,
    },
    {
      metric: "Profit",
      value: Math.min((netProfit / 50000000) * 100, 100),
      fullMark: 100,
    },
    {
      metric: "Projects",
      value: Math.min((completedProjectsCount / 50) * 100, 100),
      fullMark: 100,
    },
    {
      metric: "Active",
      value: Math.min((activeProjectsCount / 20) * 100, 100),
      fullMark: 100,
    },
    {
      metric: "Margin",
      value: Math.min(parseFloat(profitMargin), 100),
      fullMark: 100,
    },
  ];

  // Income vs Expense ratio
  const incomeExpenseData = [
    { name: "Income", value: totalIncome, color: COLORS[0] },
    { name: "Expense", value: totalExpense, color: COLORS[3] },
  ].filter((item) => item.value > 0);

  // Transaction status distribution
  const transactionStatusData = [
    {
      name: "Paid",
      value: transactions.filter((t) => t.status === "paid").length,
      color: COLORS[0],
    },
    {
      name: "Pending",
      value: transactions.filter((t) => t.status === "pending").length,
      color: COLORS[2],
    },
    {
      name: "Overdue",
      value: transactions.filter((t) => t.status === "overdue").length,
      color: COLORS[3],
    },
  ].filter((item) => item.value > 0);

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
                {typeof entry.value === "number" && entry.value > 1000
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Laporan Komprehensif
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Ringkasan lengkap performa bisnis & analytics
          </p>
        </div>
        <Button
          onClick={onExport}
          variant="outline"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export Data (JSON)
        </Button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-green-500/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-500/20 p-2.5 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-green-400 text-sm font-medium mb-1">
            Total Revenue
          </p>
          <p className="text-2xl font-bold text-white">
            {formatRupiah(totalRevenue)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Pendapatan total</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border border-indigo-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-indigo-500/20 p-2.5 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <p className="text-indigo-400 text-sm font-medium mb-1">Net Profit</p>
          <p className="text-2xl font-bold text-white">
            {formatRupiah(netProfit)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Margin: {profitMargin}%</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-500/20 p-2.5 rounded-lg">
              <FolderKanban className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-purple-400 text-sm font-medium mb-1">
            Total Projects
          </p>
          <p className="text-2xl font-bold text-white">{projects.length}</p>
          <p className="text-xs text-slate-400 mt-1">
            {completedProjectsCount} selesai
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl p-5 hover:shadow-lg hover:shadow-orange-500/10 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-500/20 p-2.5 rounded-lg">
              <Activity className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <p className="text-orange-400 text-sm font-medium mb-1">
            Avg Project Value
          </p>
          <p className="text-2xl font-bold text-white">
            {formatRupiah(avgProjectValue)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Per project</p>
        </div>
      </div>

      {/* Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-green-500/30 transition-colors">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-1">
              Revenue & Profit Trend
            </h3>
            <p className="text-slate-400 text-sm">
              Tren pendapatan dan keuntungan bulanan
            </p>
          </div>
          {monthlyTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  fill="url(#colorRevenue)"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: "#6366f1", r: 4 }}
                  name="Profit"
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-500">
              Belum ada data trend
            </div>
          )}
        </div>

        {/* Performance Radar */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-purple-500/30 transition-colors">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-1">
              Performance Score
            </h3>
            <p className="text-slate-400 text-sm">Overall business metrics</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
              <PolarRadiusAxis stroke="#94a3b8" fontSize={10} />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status Distribution */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-indigo-500/30 transition-colors">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-1">
              Project Status
            </h3>
            <p className="text-slate-400 text-sm">Distribusi status project</p>
          </div>
          {projectStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomPieLabel}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-slate-300 text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-slate-500">
              Belum ada project
            </div>
          )}
        </div>

        {/* Income vs Expense */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-green-500/30 transition-colors">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-1">
              Income vs Expense
            </h3>
            <p className="text-slate-400 text-sm">
              Perbandingan pemasukan & pengeluaran
            </p>
          </div>
          {incomeExpenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={incomeExpenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomPieLabel}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeExpenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatRupiah(value)}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-slate-300 text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-slate-500">
              Belum ada transaksi
            </div>
          )}
        </div>

        {/* top client */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500/30 transition-colors">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-1">Top Clients</h3>
            <p className="text-slate-400 text-sm">
              5 klien dengan value tertinggi
            </p>
          </div>
          {topClients.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topClients} layout="vertical">
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
                  {topClients.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-500">
              Belum ada data klien
            </div>
          )}
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-blue-500/30 transition-colors">
        {/* Income & Expense Breakdown */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-purple-500/30 transition-colors">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-1">
              Monthly Breakdown
            </h3>
            <p className="text-slate-400 text-sm">
              Income vs Expense per bulan
            </p>
          </div>
          {monthlyTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Income"
                />
                <Bar
                  dataKey="expense"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="Expense"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-500">
              Belum ada data breakdown
            </div>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-6">
          Ringkasan Statistik
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Total Income</p>
            <p className="text-xl font-bold text-green-400">
              {formatRupiah(totalIncome)}
            </p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Total Expense</p>
            <p className="text-xl font-bold text-red-400">
              {formatRupiah(totalExpense)}
            </p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Project Value</p>
            <p className="text-xl font-bold text-white">
              {formatRupiah(totalProjectValue)}
            </p>
          </div>
          <div className="bg-slate-700/50 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Active Projects</p>
            <p className="text-xl font-bold text-indigo-400">
              {activeProjectsCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
