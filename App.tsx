import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Login } from "./components/Login";
import { AdminDashboard } from "./components/AdminDashboard";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"home" | "login" | "admin">(
    "home",
  );

  useEffect(() => {
    // Check if user is already logged in
    const isAuth = localStorage.getItem("isAuthenticated");
    if (isAuth === "true") {
      setCurrentPage("admin");
    }
  }, []);

  const handleLoginSuccess = () => {
    setCurrentPage("admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setCurrentPage("home");
  };

  // Render Admin Dashboard
  if (currentPage === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Render Login Page
  if (currentPage === "login") {
    return (
      <Login
        onLogin={handleLoginSuccess}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  // Render Landing Page
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
