import React from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "../Button";
import { FormInput } from "../ui/FormInput";
import { TeamMember } from "../../types";
import { formatRupiah } from "../../utils/helpers";

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
  const totalSplit = getTotalSplitRevenue();

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
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-white mb-4">
            {editingMemberId ? "Edit Anggota" : "Tambah Anggota"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormInput
              placeholder="Nama Lengkap"
              value={newMember.name || ""}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
            <FormInput
              placeholder="Role (Developer, Designer, PM, dll)"
              value={newMember.role || ""}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
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
      )}

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
              {teamMembers.map((member) => {
                const revenue = getMemberRevenue(member.id);
                return (
                  <tr key={member.id} className="text-slate-300 hover:bg-slate-700/50">
                    <td className="p-4 font-medium text-white">{member.name}</td>
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
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(member.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-slate-700 rounded-lg"
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
