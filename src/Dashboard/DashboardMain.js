'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  FaFolderOpen,
  FaClock,
  FaCheckCircle,
  FaPlayCircle,
  FaEnvelopeOpenText,
  FaBriefcase,
  FaUserGraduate,
  FaThLarge,
  FaArrowRight,
  FaPlus,
  FaExternalLinkAlt,
  FaSyncAlt,
  FaCalendarAlt,
  FaChartPie,
  FaChartBar
} from 'react-icons/fa';

// Register Chart.js components safely on client
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const DashboardMain = () => {
  const [projectData, setProjectData] = useState([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [careerCount, setCareerCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [runningCount, setRunningCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [recentContacts, setRecentContacts] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      // 1. Fetch projects
      const projectRes = await axios.get('https://3pcommunicationsserver.vercel.app/api/projects');
      const projects = Array.isArray(projectRes.data)
        ? projectRes.data
        : (projectRes.data?.projects || []);

      setProjectData(projects);
      setPendingCount(projects.filter(p => p.status?.toLowerCase() === 'pending').length);
      setRunningCount(projects.filter(p => p.status?.toLowerCase() === 'running').length);
      setCompletedCount(projects.filter(p => p.status?.toLowerCase() === 'completed').length);

      // 2. Fetch categories
      try {
        const catRes = await axios.get('https://3pcommunicationsserver.vercel.app/api/categories');
        setCategoryCount(Array.isArray(catRes.data) ? catRes.data.length : 0);
      } catch (e) {
        console.error('Error fetching categories:', e);
      }

      // 3. Fetch contacts
      try {
        const contactRes = await axios.get('https://3pcommunicationsserver.vercel.app/api/contacts');
        const contacts = Array.isArray(contactRes.data) ? contactRes.data : [];
        setContactCount(contacts.length);
        setRecentContacts(contacts.slice(-5).reverse());
      } catch (e) {
        console.error('Error fetching contacts:', e);
      }

      // 4. Fetch careers
      try {
        const careerRes = await axios.get('https://3pcommunicationsserver.vercel.app/api/careers');
        const careers = Array.isArray(careerRes.data) ? careerRes.data : [];
        setCareerCount(careers.length);
      } catch (e) {
        console.error('Error fetching careers:', e);
      }

      // 5. Fetch applications
      try {
        const appRes = await axios.get('https://3pcommunicationsserver.vercel.app/api/applications');
        const apps = Array.isArray(appRes.data) ? appRes.data : [];
        setApplicationCount(apps.length);
        setRecentApplications(apps.slice(-4).reverse());
      } catch (e) {
        console.error('Error fetching applications:', e);
      }
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  // Doughnut Chart Data (Project Status)
  const doughnutData = {
    labels: ['Completed', 'Running', 'Pending'],
    datasets: [
      {
        data: [
          completedCount || 1,
          runningCount || 1,
          pendingCount || 1
        ],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        hoverBackgroundColor: ['#059669', '#2563eb', '#d97706'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 14,
          font: { size: 12, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 10,
        cornerRadius: 8,
      }
    },
    cutout: '70%',
  };

  // Bar Chart Data (Overall Metrics)
  const barData = {
    labels: ['Leads', 'Projects', 'Careers', 'Apps', 'Categories'],
    datasets: [
      {
        label: 'Total Volume',
        data: [
          contactCount,
          projectData.length,
          careerCount,
          applicationCount,
          categoryCount
        ],
        backgroundColor: [
          'rgba(255, 102, 0, 0.85)',
          'rgba(59, 130, 246, 0.85)',
          'rgba(139, 92, 246, 0.85)',
          'rgba(236, 72, 153, 0.85)',
          'rgba(16, 185, 129, 0.85)'
        ],
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { precision: 0 }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <div className="dashboard-spinner"></div>
        <p className="loading-caption">Gathering real-time portfolio metrics...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-modern-page">
      {/* 1. Executive Welcome & Header Bar */}
      <div className="executive-welcome-banner">
        <div className="banner-content">
          <div className="welcome-tag">
            <span className="pulse-dot"></span>
            3P Communication Executive Console
          </div>
          <h1 className="welcome-title">Administrative Overview</h1>
          <p className="welcome-subtitle">
            Monitoring live interior projects, client inquiries, recruitment pipelines, and digital assets.
          </p>
        </div>
        <div className="banner-controls">
          <div className="date-badge">
            <FaCalendarAlt className="date-icon" />
            <span>{todayFormatted}</span>
          </div>
          <button 
            className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
            onClick={fetchDashboardData}
            title="Refresh statistics"
          >
            <FaSyncAlt />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Metric Stat Cards */}
      <div className="kpi-grid">
        {/* Total Projects Card */}
        <div className="kpi-card kpi-orange">
          <div className="kpi-card-inner">
            <div className="kpi-meta">
              <span className="kpi-label">Total Projects</span>
              <h2 className="kpi-value">{projectData.length}</h2>
              <div className="kpi-status-chips">
                <span className="chip-mini chip-completed" title="Completed">
                  {completedCount} Done
                </span>
                <span className="chip-mini chip-running" title="Running">
                  {runningCount} Active
                </span>
                <span className="chip-mini chip-pending" title="Pending">
                  {pendingCount} Pending
                </span>
              </div>
            </div>
            <div className="kpi-icon-wrapper">
              <FaFolderOpen />
            </div>
          </div>
          <Link href="/dashboard/projects" className="kpi-footer-link">
            <span>Manage Portfolio</span>
            <FaArrowRight className="link-arrow" />
          </Link>
        </div>

        {/* Client Inquiries Card */}
        <div className="kpi-card kpi-amber">
          <div className="kpi-card-inner">
            <div className="kpi-meta">
              <span className="kpi-label">Client Inquiries</span>
              <h2 className="kpi-value">{contactCount}</h2>
              <p className="kpi-hint">Direct submissions through contact form</p>
            </div>
            <div className="kpi-icon-wrapper">
              <FaEnvelopeOpenText />
            </div>
          </div>
          <Link href="/dashboard/contactDashboard" className="kpi-footer-link">
            <span>Review Leads</span>
            <FaArrowRight className="link-arrow" />
          </Link>
        </div>

        {/* Job Applications Card */}
        <div className="kpi-card kpi-blue">
          <div className="kpi-card-inner">
            <div className="kpi-meta">
              <span className="kpi-label">Applications</span>
              <h2 className="kpi-value">{applicationCount}</h2>
              <p className="kpi-hint">Across {careerCount} active career openings</p>
            </div>
            <div className="kpi-icon-wrapper">
              <FaUserGraduate />
            </div>
          </div>
          <Link href="/dashboard/applications" className="kpi-footer-link">
            <span>View Applicants</span>
            <FaArrowRight className="link-arrow" />
          </Link>
        </div>

        {/* Categories & Services Card */}
        <div className="kpi-card kpi-emerald">
          <div className="kpi-card-inner">
            <div className="kpi-meta">
              <span className="kpi-label">Service Categories</span>
              <h2 className="kpi-value">{categoryCount}</h2>
              <p className="kpi-hint">Interior, Exterior & Event divisions</p>
            </div>
            <div className="kpi-icon-wrapper">
              <FaThLarge />
            </div>
          </div>
          <Link href="/dashboard/categories" className="kpi-footer-link">
            <span>Manage Categories</span>
            <FaArrowRight className="link-arrow" />
          </Link>
        </div>
      </div>

      {/* 3. Quick Action Buttons Bar */}
      <div className="quick-actions-bar">
        <span className="actions-label">Quick Actions:</span>
        <div className="actions-button-group">
          <Link href="/dashboard/addProject" className="quick-action-btn primary-btn">
            <FaPlus className="btn-icon" /> New Project
          </Link>
          <Link href="/dashboard/addCareer" className="quick-action-btn">
            <FaBriefcase className="btn-icon" /> Post Career
          </Link>
          <Link href="/dashboard/contactDashboard" className="quick-action-btn">
            <FaEnvelopeOpenText className="btn-icon" /> Leads ({contactCount})
          </Link>
          <Link href="/dashboard/headlineDashboard" className="quick-action-btn">
            Headline Ticker
          </Link>
          <Link href="/dashboard/categories" className="quick-action-btn">
            Categories
          </Link>
        </div>
      </div>

      {/* 4. Visual Charts Row */}
      <div className="dashboard-charts-grid">
        {/* Doughnut Chart: Project Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Project Status Breakdown</h3>
              <p className="chart-subtitle">Distribution across current pipeline stages</p>
            </div>
            <div className="chart-badge">
              <FaChartPie /> Distribution
            </div>
          </div>
          <div className="chart-body doughnut-chart-body">
            <div className="chart-canvas-wrapper">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <div className="doughnut-stat-summary">
              <div className="stat-pill-row">
                <span className="pill-dot dot-completed"></span>
                <span className="pill-label">Completed:</span>
                <span className="pill-count">{completedCount}</span>
              </div>
              <div className="stat-pill-row">
                <span className="pill-dot dot-running"></span>
                <span className="pill-label">In Progress:</span>
                <span className="pill-count">{runningCount}</span>
              </div>
              <div className="stat-pill-row">
                <span className="pill-dot dot-pending"></span>
                <span className="pill-label">Pending:</span>
                <span className="pill-count">{pendingCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart: Platform Activity */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Platform Operations Metric</h3>
              <p className="chart-subtitle">Aggregate volume across data entities</p>
            </div>
            <div className="chart-badge">
              <FaChartBar /> Metrics
            </div>
          </div>
          <div className="chart-body">
            <div className="chart-canvas-wrapper bar-chart-wrapper">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Activity Panels Row */}
      <div className="recent-activity-grid">
        {/* Recent Inquiries Preview */}
        <div className="activity-panel-card">
          <div className="activity-panel-header">
            <div>
              <h3 className="panel-title">Recent Client Inquiries</h3>
              <p className="panel-subtitle">Latest messages submitted via website</p>
            </div>
            <Link href="/dashboard/contactDashboard" className="panel-view-all">
              View All ({contactCount}) <FaArrowRight />
            </Link>
          </div>
          <div className="activity-table-wrapper">
            {recentContacts.length === 0 ? (
              <p className="no-activity-text">No client inquiries found.</p>
            ) : (
              <table className="modern-activity-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Contact Info</th>
                    <th>Message Snippet</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentContacts.map((contact) => (
                    <tr key={contact._id}>
                      <td className="font-semibold text-dark">
                        {contact.name || 'Anonymous'}
                      </td>
                      <td>
                        <div className="contact-info-cell">
                          <span className="contact-email">{contact.email}</span>
                          {contact.phoneNumber && (
                            <span className="contact-phone">{contact.phoneNumber}</span>
                          )}
                        </div>
                      </td>
                      <td className="message-snippet-cell">
                        <span className="snippet-text" title={contact.message}>
                          {contact.message?.length > 45 
                            ? `${contact.message.substring(0, 45)}...` 
                            : contact.message || '—'}
                        </span>
                      </td>
                      <td>
                        <Link 
                          href="/dashboard/contactDashboard" 
                          className="btn-action-mini"
                          title="Open in Leads dashboard"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Applications Preview */}
        <div className="activity-panel-card">
          <div className="activity-panel-header">
            <div>
              <h3 className="panel-title">Recent Job Applicants</h3>
              <p className="panel-subtitle">Latest candidate submissions</p>
            </div>
            <Link href="/dashboard/applications" className="panel-view-all">
              View All ({applicationCount}) <FaArrowRight />
            </Link>
          </div>
          <div className="activity-table-wrapper">
            {recentApplications.length === 0 ? (
              <p className="no-activity-text">No job applications submitted yet.</p>
            ) : (
              <table className="modern-activity-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app._id}>
                      <td className="font-semibold text-dark">
                        {app.name || 'Applicant'}
                      </td>
                      <td>
                        <div className="contact-info-cell">
                          <span className="contact-email">{app.email}</span>
                        </div>
                      </td>
                      <td>
                        {app.isShortlisted ? (
                          <span className="badge-pill-shortlisted">Shortlisted</span>
                        ) : (
                          <span className="badge-pill-pending">Review Pending</span>
                        )}
                      </td>
                      <td>
                        <Link 
                          href="/dashboard/applications" 
                          className="btn-action-mini"
                          title="Review application"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
