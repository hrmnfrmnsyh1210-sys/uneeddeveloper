import React, { useState } from "react";
import { Button } from "./Button";
import { Lock, Mail, ArrowLeft, AlertCircle, Info } from "lucide-react";
import { AUTH, STORAGE_KEYS, LOGIN_SIMULATION_DELAY } from "../constants";

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim();
      const cleanPass = password.trim();

      if (cleanEmail === AUTH.EMAIL && cleanPass === AUTH.PASSWORD) {
        localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true");
        onLogin();
      } else {
        setError("Email atau password salah. Pastikan tidak ada spasi tambahan.");
        setIsLoading(false);
      }
    }, LOGIN_SIMULATION_DELAY);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Beranda
        </button>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Login Admin</h1>
            <p className="text-slate-400">
              Masuk untuk mengelola project dan laporan.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 flex items-start text-sm">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder={AUTH.EMAIL}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full py-3">
              Sign In
            </Button>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-start gap-3 bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
              <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-indigo-300 font-semibold mb-1">
                  Demo Access Credentials:
                </p>
                <div className="grid grid-cols-[60px_1fr] gap-1 text-slate-400">
                  <span>Email:</span>
                  <code className="text-indigo-200">{AUTH.EMAIL}</code>
                  <span>Pass:</span>
                  <code className="text-indigo-200">{AUTH.PASSWORD}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
