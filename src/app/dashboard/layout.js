'use client';

import TopMenu from "../../core/TopMenu";
import Sidebar from "../../Dashboard/Sidebar";
import "../../Dashboard/css/dashboard.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="text-center p-5">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div><TopMenu /></div>
      <div className="dashboard">
        <Sidebar />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
