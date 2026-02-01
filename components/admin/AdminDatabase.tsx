import React from "react";
import {
  CheckCircle2,
  AlertCircle,
  Save,
  PlusCircle,
  Upload,
  RefreshCw,
} from "lucide-react";
import { Button } from "../Button";
import { FormInput } from "../ui/FormInput";
import { SyncStatus, JsonBinConfig } from "../../types";

interface AdminDatabaseProps {
  jsonBinConfig: JsonBinConfig;
  setJsonBinConfig: (config: JsonBinConfig) => void;
  syncStatus: SyncStatus;
  isSyncing: boolean;
  onSaveConfig: () => void;
  onCreateBin: () => void;
  onUpload: () => void;
  onDownload: () => void;
}

export const AdminDatabase: React.FC<AdminDatabaseProps> = ({
  jsonBinConfig,
  setJsonBinConfig,
  syncStatus,
  isSyncing,
  onSaveConfig,
  onCreateBin,
  onUpload,
  onDownload,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">
          Database Online (JSONBin)
        </h2>
        {syncStatus === "success" && (
          <span className="text-green-400 flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4" /> Terhubung
          </span>
        )}
        {syncStatus === "error" && (
          <span className="text-red-400 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" /> Gagal Terhubung
          </span>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl text-blue-200 text-sm">
        <p className="font-bold mb-1">Agar data muncul di perangkat lain:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Copy <strong>API Key</strong> dan <strong>Bin ID</strong> dari perangkat ini.
          </li>
          <li>
            Buka website ini di perangkat baru, login Admin, dan buka menu Database.
          </li>
          <li>
            Paste API Key dan Bin ID tersebut, lalu klik "Simpan Konfigurasi".
          </li>
          <li>Data akan otomatis ter-download.</li>
        </ol>
      </div>

      {/* Config Form */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 max-w-2xl">
        <h3 className="text-lg font-bold text-white mb-4">Konfigurasi</h3>
        <div className="space-y-4">
          <div>
            <FormInput
              label="JSONBin Master Key (X-Master-Key)"
              type="password"
              placeholder="Contoh: $2a$10$..."
              className="w-full p-3"
              value={jsonBinConfig.apiKey}
              onChange={(e) =>
                setJsonBinConfig({ ...jsonBinConfig, apiKey: e.target.value })
              }
            />
            <p className="text-xs text-slate-500 mt-1">
              Dapatkan key dari dashboard JSONBin.io
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Bin ID
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                placeholder="Contoh: 65a... (Atau klik 'Buat Baru')"
                className="w-full bg-slate-900 border border-slate-600 p-3 rounded text-white focus:border-indigo-500 outline-none"
                value={jsonBinConfig.binId}
                onChange={(e) =>
                  setJsonBinConfig({ ...jsonBinConfig, binId: e.target.value })
                }
              />
              <Button
                onClick={onCreateBin}
                isLoading={isSyncing}
                variant="secondary"
                className="whitespace-nowrap bg-teal-600 hover:bg-teal-500"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Buat Baru (Auto)
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={onSaveConfig}
              variant="primary"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Simpan & Load Data
            </Button>
          </div>
        </div>
      </div>

      {/* Manual Sync */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <div className="bg-indigo-900/20 p-6 rounded-2xl border border-indigo-500/30">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-400" /> Force Upload
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Paksa upload data saat ini ke cloud (menimpa data cloud).
          </p>
          <Button
            onClick={onUpload}
            isLoading={isSyncing}
            className="w-full bg-indigo-600 hover:bg-indigo-500"
          >
            Upload Manual
          </Button>
        </div>

        <div className="bg-teal-900/20 p-6 rounded-2xl border border-teal-500/30">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-teal-400" /> Force Download
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Paksa ambil data dari cloud (menimpa data lokal).
          </p>
          <Button
            onClick={onDownload}
            isLoading={isSyncing}
            variant="secondary"
            className="w-full"
          >
            Download Manual
          </Button>
        </div>
      </div>
    </div>
  );
};
