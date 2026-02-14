import React from "react";
import {
  DollarSign,
  FolderKanban,
  Code2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Legend,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { formatRupiah } from "../../utils/helpers";
import { Transaction } from "../../types";

interface AdminOverviewProps {
  netProfit: number;
  activeProjectsCount: number;
  completedProjectsCount: number;
  transactions: Transaction[];
  getMonthlyRevenue: () => { name: string; value: number }[];
}

const CHART_COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
};

const GRADIENT_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  netProfit,
  activeProjectsCount,
  completedProjectsCount,
  transactions,
  getMonthlyRevenue,
}) => {
  const monthlyData = getMonthlyRevenue();

  // Calculate growth rate
  const lastMonth = monthlyData[monthlyData.length - 1]?.value || 0;
  const prevMonth = monthlyData[monthlyData.length - 2]?.value || 0;
  const growthRate =
    prevMonth > 0 ? ((lastMonth - prevMonth) / prevMonth) * 100 : 0;

  // Total revenue
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Calculate average transaction
  const avgTransaction =
    transactions.length > 0 ? totalRevenue / transactions.length : 0;

  // Revenue by status
  const revenueByStatus = [
    {
      name: "Lunas",
      value: transactions
        .filter((t) => t.status === "paid")
        .reduce((sum, t) => sum + t.amount, 0),
      color: CHART_COLORS.success,
    },
    {
      name: "Pending",
      value: transactions
        .filter((t) => t.status === "pending")
        .reduce((sum, t) => sum + t.amount, 0),
      color: CHART_COLORS.warning,
    },
    {
      name: "Overdue",
      value: transactions
        .filter((t) => t.status === "overdue")
        .reduce((sum, t) => sum + t.amount, 0),
      color: CHART_COLORS.danger,
    },
  ].filter((item) => item.value > 0);

  // Transaction count by status
  const transactionsByStatus = [
    {
      name: "Lunas",
      count: transactions.filter((t) => t.status === "paid").length,
    },
    {
      name: "Pending",
      count: transactions.filter((t) => t.status === "pending").length,
    },
    {
      name: "Overdue",
      count: transactions.filter((t) => t.status === "overdue").length,
    },
  ];

  // Performance radar data
  const performanceData = [
    {
      metric: "Revenue",
      value: Math.min((totalRevenue / 100000000) * 100, 100),
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
      metric: "Avg Deal",
      value: Math.min((avgTransaction / 10000000) * 100, 100),
      fullMark: 100,
    },
    {
      metric: "Growth",
      value: Math.min(Math.abs(growthRate), 100),
      fullMark: 100,
    },
  ];

  // Recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  // Enhanced monthly data with cumulative
  const enhancedMonthlyData = monthlyData.map((item, index) => {
    const cumulative = monthlyData
      .slice(0, index + 1)
      .reduce((sum, m) => sum + m.value, 0);
    return {
      ...item,
      cumulative,
    };
  });

  const statCards = [
    {
      label: "Total Revenue",
      value: formatRupiah(totalRevenue),
      subtitle: "Pendapatan keseluruhan",
      icon: <DollarSign className="w-6 h-6" />,
      iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      textColor: "text-indigo-400",
      bgGradient: "from-indigo-500/10 to-indigo-600/10",
      borderColor: "border-indigo-500/20",
      growth: growthRate,
    },
    {
      label: "Net Profit",
      value: formatRupiah(netProfit),
      subtitle: "Keuntungan bersih",
      icon: <TrendingUp className="w-6 h-6" />,
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-green-400",
      bgGradient: "from-green-500/10 to-green-600/10",
      borderColor: "border-green-500/20",
    },
    {
      label: "Active Projects",
      value: activeProjectsCount,
      subtitle: "Sedang dikerjakan",
      icon: <FolderKanban className="w-6 h-6" />,
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-purple-400",
      bgGradient: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-500/20",
    },
    {
      label: "Completed",
      value: completedProjectsCount,
      subtitle: "Project selesai",
      icon: <Code2 className="w-6 h-6" />,
      iconBg: "bg-gradient-to-br from-teal-500 to-teal-600",
      textColor: "text-teal-400",
      bgGradient: "from-teal-500/10 to-teal-600/10",
      borderColor: "border-teal-500/20",
    },
  ];

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
                {entry.name.includes("Revenue") ||
                entry.name.includes("Cumulative")
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h2>
          <p className="text-slate-400">Ringkasan performa bisnis real-time</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
          <Activity className="w-4 h-4 text-green-400 animate-pulse" />
          <span className="text-slate-300 text-sm font-medium">Live</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} p-6 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`${card.iconBg} p-3 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform`}
              >
                {card.icon}
              </div>
              {card.growth !== undefined && card.growth !== 0 && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                    card.growth > 0
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {card.growth > 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(card.growth).toFixed(1)}%
                </div>
              )}
            </div>
            <h3 className="text-slate-400 font-medium text-sm mb-2">
              {card.label}
            </h3>
            <p
              className={`text-3xl font-bold text-white mb-1 ${card.textColor}`}
            >
              {card.value}
            </p>
            <p className="text-xs text-slate-500">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend - 2 columns */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl border border-slate-700 p-6 hover:border-indigo-500/30 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Revenue Trend
              </h3>
              <p className="text-slate-400 text-sm">
                Pendapatan bulanan & kumulatif
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-slate-400">Monthly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-400">Cumulative</span>
              </div>
            </div>
          </div>
          {transactions.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={enhancedMonthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  stroke="#94a3b8"
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  fill="url(#colorRevenue)"
                  stroke="#6366f1"
                  strokeWidth={3}
                  name="Monthly Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Cumulative"
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
              <BarChart3 className="w-16 h-16 mb-3 opacity-30" />
              <p className="text-lg font-medium">Belum ada data transaksi</p>
            </div>
          )}
        </div>

        {/* Performance Radar - 1 column */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 hover:border-purple-500/30 transition-colors">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">
              Performance Score
            </h3>
            <p className="text-slate-400 text-sm">Analisis performa bisnis</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
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

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Status */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 hover:border-green-500/30 transition-colors">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">
              Payment Status
            </h3>
            <p className="text-slate-400 text-sm">
              Distribusi status pembayaran
            </p>
          </div>
          {revenueByStatus.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={revenueByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomPieLabel}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByStatus.map((entry, index) => (
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
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col justify-center space-y-3">
                {revenueByStatus.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-300 text-sm font-medium">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-white font-bold text-sm">
                      {formatRupiah(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">
              Belum ada data pembayaran
            </div>
          )}
        </div>

        {/* Transaction Count by Status */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 hover:border-blue-500/30 transition-colors">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">
              Transaction Volume
            </h3>
            <p className="text-slate-400 text-sm">
              Jumlah transaksi per status
            </p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={transactionsByStatus} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#94a3b8"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {transactionsByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Recent Transactions
              </h3>
              <p className="text-slate-400 text-sm">4 transaksi terbaru</p>
            </div>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-slate-700/50 p-4 rounded-xl hover:bg-slate-700 transition-colors border border-slate-600/50 hover:border-indigo-500/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      transaction.status === "paid"
                        ? "bg-green-500/20 text-green-400"
                        : transaction.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {transaction.status === "paid"
                      ? "Lunas"
                      : transaction.status === "pending"
                        ? "Pending"
                        : "Overdue"}
                  </span>
                </div>
                <p className="text-white font-medium text-sm mb-2 line-clamp-2">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(transaction.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
                <p className="text-green-400 font-bold text-lg">
                  {formatRupiah(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
