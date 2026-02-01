import React from "react";
import { Download } from "lucide-react";
import { Button } from "../Button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

export const AdminReports: React.FC<AdminReportsProps> = ({
  projects,
  transactions,
  totalRevenue,
  netProfit,
  completedProjectsCount,
  getMonthlyRevenue,
  onExport,
}) => {
  const avgProjectValue =
    projects.length > 0
      ? projects.reduce((sum, p) => sum + p.value, 0) / projects.length
      : 0;

  const profitMargin =
    totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0";

  const summaryItems = [
    { label: "Total Project Selesai", value: completedProjectsCount, color: "text-white" },
    {
      label: "Rata-rata Nilai Project",
      value: formatRupiah(Math.round(avgProjectValue)),
      color: "text-white",
    },
    { label: "Margin Keuntungan", value: `${profitMargin}%`, color: "text-green-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">
          Laporan Keuangan & Project
        </h2>
        <Button
          onClick={onExport}
          variant="outline"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Backup Database (JSON)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-6">Tren Pemasukan</h3>
          <div className="h-64 w-full">
            {transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getMonthlyRevenue()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                    }}
                    formatter={(value: number) => formatRupiah(value)}
                  />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Belum ada data grafik
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Ringkasan Kinerja</h3>
          <div className="space-y-4">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="p-4 bg-slate-700/30 rounded-lg flex justify-between items-center"
              >
                <span className="text-slate-300">{item.label}</span>
                <span className={`text-xl font-bold ${item.color}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
