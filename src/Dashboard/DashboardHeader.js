'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBars, FaExternalLinkAlt, FaSignOutAlt, FaUserShield, FaBell } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

// Route name mapping for clean breadcrumbs
const routeNames = {
  '/dashboard': 'Overview',
  '/dashboard/projects': 'Projects Portfolio',
  '/dashboard/addProject': 'Add New Project',
  '/dashboard/categories': 'Service Categories',
  '/dashboard/contactDashboard': 'Client Inquiries',
  '/dashboard/careers': 'Career Postings',
  '/dashboard/addCareer': 'Post New Career',
  '/dashboard/applications': 'Job Applications',
  '/dashboard/headlineDashboard': 'Announcement Headlines',
  '/dashboard/testimonialDashboard': 'Testimonials',
  '/dashboard/faqDashboard': 'FAQ Management',
  '/dashboard/UpdateAboutDetails': 'About Page Details',
  '/dashboard/UpdateContactDetails': 'Contact Information',
  '/dashboard/changePrivacyPolicy': 'Privacy Policy',
  '/dashboard/settings': 'Admin Credentials',
  '/dashboard/changeCredentials': 'Change Credentials',
  '/dashboard/changeImage': 'Media & Banners',
};

const DashboardHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userName, setUserName] = useState('Administrator');
  const [userEmail, setUserEmail] = useState('admin@3pcommunication.com');

  useEffect(() => {
    // Try to load user data from AuthContext or fetch if needed
    if (user?.name) {
      setUserName(user.name);
      setUserEmail(user.email || '');
    } else {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        fetch('https://3pcommunicationsserver.vercel.app/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data?.name) {
              setUserName(data.name);
              setUserEmail(data.email || '');
            }
          })
          .catch(() => {});
      }
    }
  }, [user]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to end your administrative session?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ff6600',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Stay Logged In',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-4'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
        }
        router.push('/login');
      }
    });
  };

  // Determine current route title
  const currentTitle = routeNames[pathname] || (
    pathname?.startsWith('/dashboard/updateproject') ? 'Edit Project' :
    pathname?.startsWith('/dashboard/updateCareer') ? 'Edit Career' : 'Admin Area'
  );

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <button 
          className="topbar-menu-btn" 
          onClick={toggleSidebar} 
          aria-label="Toggle navigation menu"
        >
          <FaBars />
        </button>

        <div className="topbar-brand">
          <Link href="/dashboard" className="brand-logo-text">
            3P <span className="brand-accent">CONSOLE</span>
          </Link>
          <span className="brand-badge">ADMIN</span>
        </div>

        <div className="topbar-divider d-none d-md-block"></div>

        <nav className="topbar-breadcrumbs d-none d-md-flex" aria-label="breadcrumb">
          <Link href="/dashboard" className="breadcrumb-item-link">Dashboard</Link>
          {pathname !== '/dashboard' && (
            <>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{currentTitle}</span>
            </>
          )}
        </nav>
      </div>

      <div className="topbar-right">
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="topbar-action-btn view-site-btn"
          title="Open live public website in new tab"
        >
          <FaExternalLinkAlt className="action-icon" />
          <span className="d-none d-sm-inline">Live Website</span>
        </a>

        <div className="topbar-user-chip">
          <div className="user-avatar-circle">
            <FaUserShield />
            <span className="online-indicator" title="Connected"></span>
          </div>
          <div className="user-details d-none d-lg-flex flex-column">
            <span className="user-name">{userName}</span>
            <span className="user-role">Super Admin</span>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="topbar-action-btn logout-btn" 
          title="Sign Out"
        >
          <FaSignOutAlt className="action-icon" />
          <span className="d-none d-md-inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
