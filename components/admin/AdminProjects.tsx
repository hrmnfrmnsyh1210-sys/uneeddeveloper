import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../Button";
import { FormInput, FormSelect } from "../ui/FormInput";
import { AdminProject } from "../../types";
import { PROJECT_STATUSES } from "../../constants";
import { formatRupiah } from "../../utils/helpers";

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
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Manajemen Project</h2>
        <Button onClick={onAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Project Baru
        </Button>
      </div>

      {showAddProject && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingProjectId ? "Edit Project" : "Tambah Project"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormInput
              placeholder="Nama Project"
              value={newProject.name || ""}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <FormInput
              placeholder="Klien"
              value={newProject.client || ""}
              onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
            />
            <FormInput
              type="number"
              placeholder="Nilai (Rp)"
              value={newProject.value || ""}
              onChange={(e) => setNewProject({ ...newProject, value: Number(e.target.value) })}
            />
            <FormInput
              type="date"
              value={newProject.deadline || ""}
              onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
            />
            <FormSelect
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
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
      )}

      <div className="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700">
        <table className="w-full text-left min-w-[800px] md:min-w-full">
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
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Belum ada data project. Klik "Project Baru" untuk menambahkan.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="text-slate-300 hover:bg-slate-700/50">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.client}</td>
                  <td className="p-4">{formatRupiah(p.value)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(p.status)}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors p-2 hover:bg-slate-700 rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-slate-700 rounded-lg"
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
