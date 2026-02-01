import { useState, useEffect, useCallback } from "react";
import {
  AdminProject,
  Transaction,
  TeamMember,
  SyncStatus,
  JsonBinConfig,
  ProjectStatus,
  TransactionType,
} from "../../types";
import {
  STORAGE_KEYS,
  SYNC_STATUS_RESET_DELAY,
  DEFAULT_PROJECT_FORM,
  getDefaultTransactionForm,
} from "../../constants";
import { parseLocalStorage, generateId, getTodayISO } from "../../utils/helpers";
import { fetchBin, updateBin, createBin, CloudData } from "../../services/jsonBinService";

export const useAdminData = () => {
  // ===== Core Data =====
  const [projects, setProjects] = useState<AdminProject[]>(() =>
    parseLocalStorage(STORAGE_KEYS.ADMIN_PROJECTS, [])
  );
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    parseLocalStorage(STORAGE_KEYS.ADMIN_TRANSACTIONS, [])
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    parseLocalStorage(STORAGE_KEYS.TEAM_MEMBERS, [])
  );

  // ===== Cloud Config =====
  const [jsonBinConfig, setJsonBinConfig] = useState<JsonBinConfig>({
    binId: "",
    apiKey: "",
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

  // ===== Project Form State =====
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<AdminProject>>(DEFAULT_PROJECT_FORM);

  // ===== Team Member Form State =====
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({});

  // ===== Transaction Form State =====
  const [showAddTrans, setShowAddTrans] = useState(false);
  const [editingTransId, setEditingTransId] = useState<string | null>(null);
  const [newTrans, setNewTrans] = useState<Partial<Transaction>>(getDefaultTransactionForm());

  // ===== Persist to localStorage =====
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(teamMembers));
  }, [teamMembers]);

  // ===== Load Cloud Config on mount =====
  useEffect(() => {
    const savedConfig = parseLocalStorage<JsonBinConfig | null>(STORAGE_KEYS.JSONBIN_CONFIG, null);
    if (savedConfig) {
      setJsonBinConfig(savedConfig);
      if (savedConfig.binId && savedConfig.apiKey) {
        handleFetchFromCloud(savedConfig.binId, savedConfig.apiKey);
      }
    }
  }, []);

  // ===== Sync Helpers =====
  const resetSyncStatus = () => {
    setTimeout(() => setSyncStatus("idle"), SYNC_STATUS_RESET_DELAY);
  };

  const handleFetchFromCloud = async (binId: string, apiKey: string) => {
    if (!binId || !apiKey) return;
    setIsSyncing(true);
    try {
      const record = await fetchBin(binId, apiKey);
      if (record) {
        const cloudProjects = record.projects || [];
        const cloudTransactions = record.transactions || [];
        const cloudTeamMembers = record.teamMembers || [];
        setProjects(cloudProjects);
        setTransactions(cloudTransactions);
        setTeamMembers(cloudTeamMembers);
        localStorage.setItem(STORAGE_KEYS.ADMIN_PROJECTS, JSON.stringify(cloudProjects));
        localStorage.setItem(STORAGE_KEYS.ADMIN_TRANSACTIONS, JSON.stringify(cloudTransactions));
        localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(cloudTeamMembers));
        setSyncStatus("success");
        resetSyncStatus();
      }
    } catch (error) {
      console.error("Auto-load failed", error);
      setSyncStatus("error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveToCloud = async (
    currentProjects: AdminProject[],
    currentTransactions: Transaction[],
    currentTeamMembers?: TeamMember[]
  ) => {
    if (!jsonBinConfig.binId || !jsonBinConfig.apiKey) return;
    setIsSyncing(true);
    try {
      const payload: CloudData = {
        projects: currentProjects,
        transactions: currentTransactions,
        teamMembers: currentTeamMembers ?? teamMembers,
        lastUpdated: new Date().toISOString(),
      };
      const ok = await updateBin(jsonBinConfig.binId, jsonBinConfig.apiKey, payload);
      setSyncStatus(ok ? "success" : "error");
      if (ok) resetSyncStatus();
    } catch (error) {
      console.error("Auto-save failed", error);
      setSyncStatus("error");
    } finally {
      setIsSyncing(false);
    }
  };

  // ===== Derived Stats =====
  const totalRevenue = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;

  const activeProjectsCount = projects.filter(
    (p) => p.status === "In Progress" || p.status === "Pending"
  ).length;

  const completedProjectsCount = projects.filter(
    (p) => p.status === "Completed"
  ).length;

  // ===== Project CRUD =====
  const handleSaveProject = async () => {
    if (!newProject.name || !newProject.client || !newProject.value) {
      alert("Mohon lengkapi nama project, klien, dan nilai project.");
      return;
    }

    let updatedProjects: AdminProject[];

    if (editingProjectId) {
      updatedProjects = projects.map((p) =>
        p.id === editingProjectId ? ({ ...p, ...newProject } as AdminProject) : p
      );
      setEditingProjectId(null);
    } else {
      const project: AdminProject = {
        id: generateId(),
        name: newProject.name,
        client: newProject.client,
        value: Number(newProject.value),
        status: (newProject.status || "Pending") as ProjectStatus,
        deadline: newProject.deadline || "",
      };
      updatedProjects = [...projects, project];
    }

    setProjects(updatedProjects);
    await handleSaveToCloud(updatedProjects, transactions);
    setShowAddProject(false);
    setNewProject(DEFAULT_PROJECT_FORM);
  };

  const handleEditProjectClick = (project: AdminProject) => {
    setNewProject(project);
    setEditingProjectId(project.id);
    setShowAddProject(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Yakin ingin menghapus project ini secara permanen?")) {
      const updatedProjects = projects.filter((p) => p.id !== id);
      setProjects(updatedProjects);
      await handleSaveToCloud(updatedProjects, transactions);
    }
  };

  const handleCancelProject = () => {
    setShowAddProject(false);
    setEditingProjectId(null);
    setNewProject(DEFAULT_PROJECT_FORM);
  };

  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setNewProject(DEFAULT_PROJECT_FORM);
    setShowAddProject(true);
  };

  // ===== Transaction CRUD =====
  const handleSaveTrans = async () => {
    if (!newTrans.description || !newTrans.amount) {
      alert("Mohon lengkapi deskripsi dan jumlah transaksi.");
      return;
    }

    let updatedTransactions: Transaction[];

    if (editingTransId) {
      updatedTransactions = transactions.map((t) =>
        t.id === editingTransId ? ({ ...t, ...newTrans } as Transaction) : t
      );
      setEditingTransId(null);
    } else {
      const trans: Transaction = {
        id: generateId(),
        date: newTrans.date || getTodayISO(),
        description: newTrans.description,
        amount: Number(newTrans.amount),
        projectId: newTrans.projectId || "",
        type: (newTrans.type || "Income") as TransactionType,
      };
      updatedTransactions = [...transactions, trans];
    }

    setTransactions(updatedTransactions);
    await handleSaveToCloud(projects, updatedTransactions);
    setShowAddTrans(false);
    setNewTrans(getDefaultTransactionForm());
  };

  const handleEditTransClick = (trans: Transaction) => {
    setNewTrans(trans);
    setEditingTransId(trans.id);
    setShowAddTrans(true);
  };

  const handleDeleteTrans = async (id: string) => {
    if (confirm("Hapus transaksi ini? Data akan hilang permanen.")) {
      const updatedTransactions = transactions.filter((t) => t.id !== id);
      setTransactions(updatedTransactions);
      await handleSaveToCloud(projects, updatedTransactions);
    }
  };

  const handleCancelTrans = () => {
    setShowAddTrans(false);
    setEditingTransId(null);
    setNewTrans(getDefaultTransactionForm());
  };

  const handleOpenAddTrans = () => {
    setEditingTransId(null);
    setNewTrans(getDefaultTransactionForm());
    setShowAddTrans(true);
  };

  // ===== Export =====
  const handleExportData = () => {
    const data = {
      projects,
      transactions,
      teamMembers,
      exportedAt: new Date().toISOString(),
      app: "Uneed Developer Admin",
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `uneed-backup-${getTodayISO()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ===== Cloud Config =====
  const saveConfig = () => {
    localStorage.setItem(STORAGE_KEYS.JSONBIN_CONFIG, JSON.stringify(jsonBinConfig));
    alert("Konfigurasi disimpan! Sistem akan otomatis memuat data...");
    handleFetchFromCloud(jsonBinConfig.binId, jsonBinConfig.apiKey);
  };

  const handleCreateBin = async () => {
    if (!jsonBinConfig.apiKey) {
      alert("Mohon isi Master Key terlebih dahulu sebelum membuat database.");
      return;
    }

    if (
      jsonBinConfig.binId &&
      !confirm("Bin ID sudah terisi. Apakah Anda yakin ingin membuat Bin BARU? (Bin ID lama akan diganti)")
    ) {
      return;
    }

    setIsSyncing(true);
    try {
      const payload: CloudData = {
        projects,
        transactions,
        teamMembers,
        lastUpdated: new Date().toISOString(),
      };
      const newBinId = await createBin(jsonBinConfig.apiKey, payload);
      const newConfig = { ...jsonBinConfig, binId: newBinId };
      setJsonBinConfig(newConfig);
      localStorage.setItem(STORAGE_KEYS.JSONBIN_CONFIG, JSON.stringify(newConfig));
      alert(`Database berhasil dibuat! Bin ID: ${newBinId} telah disimpan otomatis.`);
    } catch (error: any) {
      console.error(error);
      alert(`Gagal membuat database: ${error.message || "Unknown error"}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUploadToCloud = async () => {
    await handleSaveToCloud(projects, transactions);
    alert("Sukses upload data ke cloud!");
  };

  const handleDownloadFromCloud = async () => {
    if (!jsonBinConfig.apiKey || !jsonBinConfig.binId) {
      alert("Mohon isi API Key dan Bin ID terlebih dahulu.");
      return;
    }
    if (!confirm("Peringatan: Data di browser ini akan ditimpa dengan data dari Cloud. Lanjutkan?")) {
      return;
    }
    await handleFetchFromCloud(jsonBinConfig.binId, jsonBinConfig.apiKey);
    alert("Sukses download data dari cloud!");
  };

  // ===== Team Member CRUD =====
  const handleSaveMember = async () => {
    if (!newMember.name || !newMember.role) {
      alert("Mohon lengkapi nama dan role anggota tim.");
      return;
    }

    let updatedMembers: TeamMember[];

    if (editingMemberId) {
      updatedMembers = teamMembers.map((m) =>
        m.id === editingMemberId ? ({ ...m, ...newMember } as TeamMember) : m
      );
      setEditingMemberId(null);
    } else {
      const member: TeamMember = {
        id: generateId(),
        name: newMember.name,
        role: newMember.role,
      };
      updatedMembers = [...teamMembers, member];
    }

    setTeamMembers(updatedMembers);
    await handleSaveToCloud(projects, transactions, updatedMembers);
    setShowAddMember(false);
    setNewMember({});
  };

  const handleEditMemberClick = (member: TeamMember) => {
    setNewMember(member);
    setEditingMemberId(member.id);
    setShowAddMember(true);
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm("Yakin ingin menghapus anggota tim ini?")) {
      const updatedMembers = teamMembers.filter((m) => m.id !== id);
      setTeamMembers(updatedMembers);
      await handleSaveToCloud(projects, transactions, updatedMembers);
    }
  };

  const handleCancelMember = () => {
    setShowAddMember(false);
    setEditingMemberId(null);
    setNewMember({});
  };

  const handleOpenAddMember = () => {
    setEditingMemberId(null);
    setNewMember({});
    setShowAddMember(true);
  };

  // ===== Derived: Revenue per Team Member =====
  const getMemberRevenue = (memberId: string): number => {
    return transactions.reduce((total, t) => {
      if (t.type !== "Income" || !t.splits) return total;
      const split = t.splits.find((s) => s.memberId === memberId);
      return total + (split?.amount || 0);
    }, 0);
  };

  const getTotalSplitRevenue = (): number => {
    return transactions.reduce((total, t) => {
      if (t.type !== "Income" || !t.splits) return total;
      return total + t.splits.reduce((sum, s) => sum + s.amount, 0);
    }, 0);
  };

  // ===== Chart Data =====
  const getMonthlyRevenue = () => {
    const monthlyData: Record<string, number> = {};
    const sortedTrans = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    sortedTrans
      .filter((t) => t.type === "Income")
      .forEach((t) => {
        const date = new Date(t.date);
        const monthYear = date.toLocaleString("id-ID", {
          month: "short",
          year: "2-digit",
        });
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + t.amount;
      });

    const data = Object.entries(monthlyData).map(([name, value]) => ({ name, value }));
    return data.length === 0 ? [{ name: "No Data", value: 0 }] : data;
  };

  return {
    // Data
    projects,
    transactions,
    // Stats
    totalRevenue,
    totalExpenses,
    netProfit,
    activeProjectsCount,
    completedProjectsCount,
    // Sync
    jsonBinConfig,
    setJsonBinConfig,
    isSyncing,
    syncStatus,
    // Project Form
    showAddProject,
    editingProjectId,
    newProject,
    setNewProject,
    handleSaveProject,
    handleEditProjectClick,
    handleDeleteProject,
    handleCancelProject,
    handleOpenAddProject,
    // Transaction Form
    showAddTrans,
    editingTransId,
    newTrans,
    setNewTrans,
    handleSaveTrans,
    handleEditTransClick,
    handleDeleteTrans,
    handleCancelTrans,
    handleOpenAddTrans,
    // Cloud
    saveConfig,
    handleCreateBin,
    handleUploadToCloud,
    handleDownloadFromCloud,
    // Team Members
    teamMembers,
    showAddMember,
    editingMemberId,
    newMember,
    setNewMember,
    handleSaveMember,
    handleEditMemberClick,
    handleDeleteMember,
    handleCancelMember,
    handleOpenAddMember,
    getMemberRevenue,
    getTotalSplitRevenue,
    // Reports
    handleExportData,
    getMonthlyRevenue,
  };
};
