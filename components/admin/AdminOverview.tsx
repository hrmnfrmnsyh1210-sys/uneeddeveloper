import React from "react";
import { DollarSign, FolderKanban, Code2, BarChart3 } from "lucide-react";
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
import { formatRupiah } from "../../utils/helpers";
import { Transaction } from "../../types";

interface AdminOverviewProps {
  netProfit: number;
  activeProjectsCount: number;
  completedProjectsCount: number;
  transactions: Transaction[];
  getMonthlyRevenue: () => { name: string; value: number }[];
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  netProfit,
  activeProjectsCount,
  completedProjectsCount,
  transactions,
  getMonthlyRevenue,
}) => {
  const statCards = [
    {
      label: "Net Profit",
      value: formatRupiah(netProfit),
      subtitle: "Total Pendapatan Bersih",
      icon: <DollarSign className="w-5 h-5 text-green-500" />,
      iconBg: "bg-green-500/10",
    },
    {
      label: "Active Projects",
      value: activeProjectsCount,
      subtitle: "Sedang dikerjakan",
      icon: <FolderKanban className="w-5 h-5 text-indigo-500" />,
      iconBg: "bg-indigo-500/10",
    },
    {
      label: "Completed",
      value: completedProjectsCount,
      subtitle: "Project selesai",
      icon: <Code2 className="w-5 h-5 text-teal-500" />,
      iconBg: "bg-teal-500/10",
    },
  ];

  const monthlyData = getMonthlyRevenue();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-slate-800 p-6 rounded-2xl border border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium">{card.label}</h3>
              <div className={`p-2 ${card.iconBg} rounded-lg`}>{card.icon}</div>
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-slate-500 mt-2">{card.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-6">Pendapatan Bulanan</h3>
        {transactions.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  stroke="#94a3b8"
                  tickFormatter={(value) => `${value / 1000}k`}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#fff",
                  }}
                  formatter={(value: number) => [
                    formatRupiah(value),
                    "Pendapatan",
                  ]}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={index % 2 === 0 ? "#6366f1" : "#818cf8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
            <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
            <p>Belum ada data transaksi</p>
          </div>
        )}
      </div>
    </div>
  );
};
