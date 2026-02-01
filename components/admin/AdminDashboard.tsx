import React, { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  DollarSign,
  BarChart3,
  LogOut,
  Cloud,
  Code2,
  Menu,
  X,
} from "lucide-react";
import { AdminTab } from "../../constants";
import { useAdminData } from "./useAdminData";
import { AdminOverview } from "./AdminOverview";
import { AdminProjects } from "./AdminProjects";
import { AdminRevenue } from "./AdminRevenue";
import { AdminReports } from "./AdminReports";
import { AdminDatabase } from "./AdminDatabase";

interface AdminDashboardProps {
  onLogout: () => void;
}

const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "projects", label: "Projects", icon: <FolderKanban className="w-5 h-5" /> },
  { id: "revenue", label: "Pendapatan", icon: <DollarSign className="w-5 h-5" /> },
  { id: "reports", label: "Laporan", icon: <BarChart3 className="w-5 h-5" /> },
  { id: "database", label: "Database", icon: <Cloud className="w-5 h-5" /> },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const data = useAdminData();

  const handleNavClick = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <AdminOverview
            netProfit={data.netProfit}
            activeProjectsCount={data.activeProjectsCount}
            completedProjectsCount={data.completedProjectsCount}
            transactions={data.transactions}
            getMonthlyRevenue={data.getMonthlyRevenue}
          />
        );
      case "projects":
        return (
          <AdminProjects
            projects={data.projects}
            showAddProject={data.showAddProject}
            editingProjectId={data.editingProjectId}
            newProject={data.newProject}
            setNewProject={data.setNewProject}
            isSyncing={data.isSyncing}
            onSave={data.handleSaveProject}
            onEdit={data.handleEditProjectClick}
            onDelete={data.handleDeleteProject}
            onCancel={data.handleCancelProject}
            onAdd={data.handleOpenAddProject}
          />
        );
      case "revenue":
        return (
          <AdminRevenue
            transactions={data.transactions}
            projects={data.projects}
            showAddTrans={data.showAddTrans}
            editingTransId={data.editingTransId}
            newTrans={data.newTrans}
            setNewTrans={data.setNewTrans}
            isSyncing={data.isSyncing}
            onSave={data.handleSaveTrans}
            onEdit={data.handleEditTransClick}
            onDelete={data.handleDeleteTrans}
            onCancel={data.handleCancelTrans}
            onAdd={data.handleOpenAddTrans}
          />
        );
      case "reports":
        return (
          <AdminReports
            projects={data.projects}
            transactions={data.transactions}
            totalRevenue={data.totalRevenue}
            netProfit={data.netProfit}
            completedProjectsCount={data.completedProjectsCount}
            getMonthlyRevenue={data.getMonthlyRevenue}
            onExport={data.handleExportData}
          />
        );
      case "database":
        return (
          <AdminDatabase
            jsonBinConfig={data.jsonBinConfig}
            setJsonBinConfig={data.setJsonBinConfig}
            syncStatus={data.syncStatus}
            isSyncing={data.isSyncing}
            onSaveConfig={data.saveConfig}
            onCreateBin={data.handleCreateBin}
            onUpload={data.handleUploadToCloud}
            onDownload={data.handleDownloadFromCloud}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">Uneed Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">Uneed Admin</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {tab.id === "database" && data.syncStatus === "success" ? (
                <Cloud className="w-5 h-5 text-green-400" />
              ) : (
                tab.icon
              )}
              <span>{tab.label}</span>
            </button>
          ))}
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
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto min-h-[calc(100vh-65px)] md:min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
};
