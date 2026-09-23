'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "../../Dashboard/DashboardHeader";
import Sidebar from "../../Dashboard/Sidebar";
import "../../Dashboard/css/dashboard.css";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!authorized) {
    return (
      <div className="auth-checking-screen">
        <div className="auth-spinner-box">
          <div className="auth-pulsing-logo">3P</div>
          <div className="auth-spinner"></div>
          <p className="auth-loading-text">Verifying administrative access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-app-layout">
      {/* Fixed Executive Topbar */}
      <DashboardHeader 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
      />

      <div className="admin-body-container">
        {/* Responsive Luxury Architectural Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
        />

        {/* Dynamic Main Workspace Content */}
        <main className="admin-main-viewport">
          <div className="admin-content-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
