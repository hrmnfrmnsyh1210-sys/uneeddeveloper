import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Login } from "./components/Login";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { STORAGE_KEYS } from "./constants";
import { PageName } from "./types";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageName>("home");

  useEffect(() => {
    const isAuth = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
    if (isAuth === "true") {
      setCurrentPage("admin");
    }
  }, []);

  const handleLoginSuccess = () => setCurrentPage("admin");

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
    setCurrentPage("home");
  };

  if (currentPage === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (currentPage === "login") {
    return (
      <Login
        onLogin={handleLoginSuccess}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      <Header onNavigate={setCurrentPage} />
      <main>
        <Hero />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
