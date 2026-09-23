'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import {
  FaUserShield,
  FaKey,
  FaEnvelope,
  FaPhoneAlt,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt,
  FaSyncAlt,
  FaSpinner,
  FaChevronRight,
  FaImages,
  FaAddressBook,
  FaInfoCircle
} from 'react-icons/fa';

const API_BASE = 'https://3pcommunicationsserver.vercel.app/api';

const SettingsPage = () => {
  // User Credentials State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [credCurrentPassword, setCredCurrentPassword] = useState('');
  const [showCredPassword, setShowCredPassword] = useState(false);

  // Password Change State
  const [pwdCurrentPassword, setPwdCurrentPassword] = useState('');
  const [pwdNewPassword, setPwdNewPassword] = useState('');
  const [pwdConfirmPassword, setPwdConfirmPassword] = useState('');
  const [showPwdCurrent, setShowPwdCurrent] = useState(false);
  const [showPwdNew, setShowPwdNew] = useState(false);
  const [showPwdConfirm, setShowPwdConfirm] = useState(false);

  // Loading & Feedback State
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmittingCreds, setIsSubmittingCreds] = useState(false);
  const [isSubmittingPwd, setIsSubmittingPwd] = useState(false);

  // Fetch current user details on mount
  const fetchUserData = async () => {
    setIsLoadingUser(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setIsLoadingUser(false);
        return;
      }

      const res = await fetch(`${API_BASE}/auth/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to load user details');
      }

      setName(data.name || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Update Profile Credentials
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();

    if (!credCurrentPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Current Password Required',
        text: 'Please enter your current password to authorize updates to your administrative profile.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
      return;
    }

    setIsSubmittingCreds(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/auth/update-credentials`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          currentPassword: credCurrentPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update credentials');
      }

      setCredCurrentPassword('');
      Swal.fire({
        icon: 'success',
        title: 'Credentials Updated!',
        text: 'Your administrator profile details have been saved successfully.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message || 'An error occurred while updating credentials.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
    } finally {
      setIsSubmittingCreds(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!pwdCurrentPassword || !pwdNewPassword || !pwdConfirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please complete all password fields.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
      return;
    }

    if (pwdNewPassword.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Too Short',
        text: 'New password must be at least 6 characters long.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
      return;
    }

    if (pwdNewPassword !== pwdConfirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Passwords Do Not Match',
        text: 'The new password and confirmation password do not match.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
      return;
    }

    setIsSubmittingPwd(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: pwdCurrentPassword,
          newPassword: pwdNewPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setPwdCurrentPassword('');
      setPwdNewPassword('');
      setPwdConfirmPassword('');

      Swal.fire({
        icon: 'success',
        title: 'Password Changed!',
        text: 'Your administrative login password has been updated securely.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Change Failed',
        text: err.message || 'Current password might be incorrect.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
    } finally {
      setIsSubmittingPwd(false);
    }
  };

  // Derive initial for avatar
  const avatarLetter = name ? name.trim().charAt(0).toUpperCase() : '3P';
  const passwordsMatch = pwdNewPassword && pwdConfirmPassword && pwdNewPassword === pwdConfirmPassword;

  return (
    <div className="container-fluid p-0">
      {/* Top Breadcrumb & Page Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 text-muted small mb-1">
            <span>System &amp; Security</span>
            <span>/</span>
            <span className="text-dark fw-semibold">Admin Credentials</span>
          </div>
          <h2 className="m-0 fw-bold">Admin Account &amp; Security Settings</h2>
          <p className="text-muted small m-0 mt-1">
            Manage your administrator profile details, primary email address, and security login passwords.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={fetchUserData}
            disabled={isLoadingUser}
            className="btn btn-outline-secondary rounded-3 d-inline-flex align-items-center gap-2"
          >
            <FaSyncAlt className={isLoadingUser ? 'spin-icon' : ''} />
            <span>Refresh Details</span>
          </button>
        </div>
      </div>

      {/* Executive Hero Banner */}
      <div className="settings-executive-banner">
        <div className="settings-banner-glow" />
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-4 position-relative">
          <div className="d-flex align-items-center gap-3">
            <div className="settings-avatar-box">
              <span>{avatarLetter}</span>
              <div className="settings-avatar-pulse" />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <span className="settings-banner-title">{name || 'Administrator'}</span>
                <span className="settings-badge-pill active">
                  <FaCheckCircle className="small" /> Super Admin
                </span>
              </div>
              <div className="text-light opacity-75 small">
                {email || 'Loading verified admin credentials...'}
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <div className="settings-badge-pill">
              <FaShieldAlt className="text-warning" /> JWT Bearer Verified
            </div>
            <div className="settings-badge-pill">
              <FaLock className="text-info" /> Encrypted Session
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Sections (Left) + Security Info (Right) */}
      <div className="row g-4">
        {/* Left Column: Forms */}
        <div className="col-12 col-xl-8">
          {/* Form 1: Profile Information */}
          <div className="project-form-card">
            <div className="project-form-header">
              <div className="project-form-icon">
                <FaUserShield />
              </div>
              <div>
                <h5 className="m-0 fw-bold">Admin Profile Credentials</h5>
                <small className="text-muted">
                  Update your executive contact name, administrative email, and phone
                </small>
              </div>
            </div>

            <form onSubmit={handleUpdateCredentials}>
              <div className="row g-3">
                {/* Full Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <FaUser className="settings-input-icon" />
                    <input
                      type="text"
                      className="form-control settings-input-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. 3P Executive Admin"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <FaEnvelope className="settings-input-icon" />
                    <input
                      type="email"
                      className="form-control settings-input-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@3pcommunication.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <FaPhoneAlt className="settings-input-icon" />
                    <input
                      type="tel"
                      className="form-control settings-input-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1711-000000"
                      required
                    />
                  </div>
                </div>

                {/* Current Password Authorization */}
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Current Password (Authorization) <span className="text-danger">*</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <FaLock className="settings-input-icon" />
                    <input
                      type={showCredPassword ? 'text' : 'password'}
                      className="form-control settings-input-control"
                      value={credCurrentPassword}
                      onChange={(e) => setCredCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      className="settings-eye-toggle"
                      onClick={() => setShowCredPassword(!showCredPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showCredPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <small className="text-muted">
                  Requires current password to confirm authorization
                </small>
                <button
                  type="submit"
                  disabled={isSubmittingCreds || !credCurrentPassword}
                  className="btn dashboard_all_button d-inline-flex align-items-center gap-2"
                >
                  {isSubmittingCreds ? (
                    <>
                      <FaSpinner className="spin-icon" /> Saving Profile...
                    </>
                  ) : (
                    <>
                      <FaUserShield /> Update Credentials
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Form 2: Password Change */}
          <div className="project-form-card">
            <div className="project-form-header">
              <div className="project-form-icon">
                <FaKey />
              </div>
              <div>
                <h5 className="m-0 fw-bold">Change Administrative Password</h5>
                <small className="text-muted">
                  Set a new, secure password for your portal management account
                </small>
              </div>
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="row g-3">
                {/* Current Password */}
                <div className="col-12">
                  <label className="form-label-custom">
                    Current Password <span className="text-danger">*</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <FaLock className="settings-input-icon" />
                    <input
                      type={showPwdCurrent ? 'text' : 'password'}
                      className="form-control settings-input-control"
                      value={pwdCurrentPassword}
                      onChange={(e) => setPwdCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      className="settings-eye-toggle"
                      onClick={() => setShowPwdCurrent(!showPwdCurrent)}
                      aria-label="Toggle password visibility"
                    >
                      {showPwdCurrent ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    New Password <span className="text-danger">*</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <FaKey className="settings-input-icon" />
                    <input
                      type={showPwdNew ? 'text' : 'password'}
                      className="form-control settings-input-control"
                      value={pwdNewPassword}
                      onChange={(e) => setPwdNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                    />
                    <button
                      type="button"
                      className="settings-eye-toggle"
                      onClick={() => setShowPwdNew(!showPwdNew)}
                      aria-label="Toggle password visibility"
                    >
                      {showPwdNew ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Confirm New Password <span className="text-danger">*</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <FaKey className="settings-input-icon" />
                    <input
                      type={showPwdConfirm ? 'text' : 'password'}
                      className="form-control settings-input-control"
                      value={pwdConfirmPassword}
                      onChange={(e) => setPwdConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                    />
                    <button
                      type="button"
                      className="settings-eye-toggle"
                      onClick={() => setShowPwdConfirm(!showPwdConfirm)}
                      aria-label="Toggle password visibility"
                    >
                      {showPwdConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Requirement Checks */}
              {pwdNewPassword && (
                <div className="mt-3 p-3 bg-light rounded-3">
                  <div className="small fw-bold text-muted mb-2">Password Security Checklist:</div>
                  <div className="d-flex flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-2 small">
                      {pwdNewPassword.length >= 6 ? (
                        <FaCheckCircle className="text-success" />
                      ) : (
                        <FaExclamationCircle className="text-muted" />
                      )}
                      <span className={pwdNewPassword.length >= 6 ? 'text-success fw-semibold' : 'text-muted'}>
                        At least 6 characters
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2 small">
                      {passwordsMatch ? (
                        <FaCheckCircle className="text-success" />
                      ) : (
                        <FaExclamationCircle className="text-muted" />
                      )}
                      <span className={passwordsMatch ? 'text-success fw-semibold' : 'text-muted'}>
                        Passwords match
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <small className="text-muted">
                  Once changed, you will use your new password on subsequent logins
                </small>
                <button
                  type="submit"
                  disabled={
                    isSubmittingPwd ||
                    !pwdCurrentPassword ||
                    !pwdNewPassword ||
                    !pwdConfirmPassword ||
                    pwdNewPassword.length < 6 ||
                    pwdNewPassword !== pwdConfirmPassword
                  }
                  className="btn dashboard_all_button d-inline-flex align-items-center gap-2"
                >
                  {isSubmittingPwd ? (
                    <>
                      <FaSpinner className="spin-icon" /> Updating Password...
                    </>
                  ) : (
                    <>
                      <FaLock /> Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Security Status & Quick Navigation */}
        <div className="col-12 col-xl-4">
          {/* Card: Security Guidelines */}
          <div className="settings-security-card">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FaShieldAlt className="text-warning" /> Security Guidelines
            </h6>
            <div className="settings-checklist-item">
              <div className="settings-check-icon">✓</div>
              <span>Keep your admin email and password private</span>
            </div>
            <div className="settings-checklist-item">
              <div className="settings-check-icon">✓</div>
              <span>Rotate passwords periodically for safety</span>
            </div>
            <div className="settings-checklist-item">
              <div className="settings-check-icon">✓</div>
              <span>Ensure your phone number is valid for emergency contact</span>
            </div>
            <div className="settings-checklist-item">
              <div className="settings-check-icon">✓</div>
              <span>Always log out when using shared workstations</span>
            </div>
          </div>

          {/* Card: CMS Content Shortcuts */}
          <div className="settings-security-card">
            <h6 className="fw-bold mb-3">Other Content Settings</h6>
            <p className="small text-muted mb-3">
              Quick access to configure public website pages and information:
            </p>

            <Link href="/dashboard/hero-settings" className="settings-nav-shortcut">
              <div className="d-flex align-items-center gap-2">
                <FaImages className="text-muted" />
                <span>Hero Banner Settings</span>
              </div>
              <FaChevronRight className="small opacity-50" />
            </Link>

            <Link href="/dashboard/UpdateContactDetails" className="settings-nav-shortcut">
              <div className="d-flex align-items-center gap-2">
                <FaAddressBook className="text-muted" />
                <span>Contact Details &amp; Social</span>
              </div>
              <FaChevronRight className="small opacity-50" />
            </Link>

            <Link href="/dashboard/UpdateAboutDetails" className="settings-nav-shortcut">
              <div className="d-flex align-items-center gap-2">
                <FaInfoCircle className="text-muted" />
                <span>About Us Content</span>
              </div>
              <FaChevronRight className="small opacity-50" />
            </Link>

            <Link href="/dashboard/changePrivacyPolicy" className="settings-nav-shortcut">
              <div className="d-flex align-items-center gap-2">
                <FaShieldAlt className="text-muted" />
                <span>Privacy Policy Editor</span>
              </div>
              <FaChevronRight className="small opacity-50" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
