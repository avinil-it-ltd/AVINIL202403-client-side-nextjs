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

  // Fetch current user details on mount with graceful fallback
  const fetchUserData = async () => {
    setIsLoadingUser(true);
    try {
      // 1. Try local cached data first
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('3p_admin_user');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed.name) setName(parsed.name);
            if (parsed.email) setEmail(parsed.email);
            if (parsed.phone) setPhone(parsed.phone);
          } catch (e) {}
        }
      }

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

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          if (data.name) setName(data.name);
          if (data.email) setEmail(data.email);
          if (data.phone) setPhone(data.phone);

          if (typeof window !== 'undefined') {
            localStorage.setItem(
              '3p_admin_user',
              JSON.stringify({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
              })
            );
          }
        }
      } else {
        // Fallback default if not yet populated
        setName((prev) => prev || 'Administrator');
        setEmail((prev) => prev || 'admin@3pcommunication.com');
        setPhone((prev) => prev || '+880 1711-000000');
      }
    } catch (err) {
      console.warn('Backend user endpoint notice:', err.message);
      setName((prev) => prev || 'Administrator');
      setEmail((prev) => prev || 'admin@3pcommunication.com');
      setPhone((prev) => prev || '+880 1711-000000');
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

    if (!name.trim() || !email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Required Fields',
        text: 'Please provide both your administrator name and email address.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
      return;
    }

    let passwordToUse = credCurrentPassword;

    // If password wasn't entered inline, prompt with sleek modal
    if (!passwordToUse) {
      const { value: inputPassword } = await Swal.fire({
        title: 'Current Password Required',
        text: 'Please enter your current administrator password to authorize profile changes:',
        input: 'password',
        inputPlaceholder: 'Enter current password',
        showCancelButton: true,
        confirmButtonColor: '#ff6600',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Authorize & Save',
        cancelButtonText: 'Cancel',
        customClass: { popup: 'rounded-4' }
      });

      if (!inputPassword) return;
      passwordToUse = inputPassword;
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
          currentPassword: passwordToUse,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update credentials on server');
      }

      // Persist in local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          '3p_admin_user',
          JSON.stringify({ name, email, phone })
        );
      }

      setCredCurrentPassword('');
      Swal.fire({
        icon: 'success',
        title: 'Credentials Updated!',
        text: 'Your administrator profile credentials have been saved successfully.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.message || 'Could not verify current password or update credentials.',
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

    if (!pwdCurrentPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Current Password Required',
        text: 'Please enter your current password.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
      return;
    }

    if (!pwdNewPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'New Password Required',
        text: 'Please enter a new password.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
      return;
    }

    if (pwdNewPassword.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Too Short',
        text: 'The new password must be at least 6 characters long.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
      return;
    }

    if (pwdNewPassword !== pwdConfirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Passwords Do Not Match',
        text: 'The new password and confirmation password do not match. Please verify.',
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
        throw new Error(data.message || 'Failed to change password. Please check your current password.');
      }

      setPwdCurrentPassword('');
      setPwdNewPassword('');
      setPwdConfirmPassword('');

      Swal.fire({
        icon: 'success',
        title: 'Password Changed!',
        text: 'Your administrator login password has been updated securely.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Password Change Failed',
        text: err.message || 'Current password might be incorrect.',
        confirmButtonColor: '#ff6600',
        customClass: { popup: 'rounded-4' }
      });
    } finally {
      setIsSubmittingPwd(false);
    }
  };

  const avatarLetter = name ? name.trim().charAt(0).toUpperCase() : '3P';
  const passwordsMatch = pwdNewPassword && pwdConfirmPassword && pwdNewPassword === pwdConfirmPassword;

  return (
    <div className="container-fluid p-0">
      {/* Top Breadcrumb & Page Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 mb-md-4 gap-2">
        <div>
          <div className="d-flex align-items-center gap-2 text-muted small mb-1">
            <span>System &amp; Security</span>
            <span>/</span>
            <span className="text-dark fw-semibold">Settings</span>
          </div>
          <h2 className="m-0 fw-bold fs-3 fs-md-2">Admin Account &amp; Security Settings</h2>
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
            <span className="d-none d-sm-inline">Refresh Details</span>
          </button>
        </div>
      </div>

      {/* Executive Hero Banner */}
      <div className="settings-executive-banner">
        <div className="settings-banner-glow" />
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 position-relative">
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
              <div className="text-light opacity-75 small text-break">
                {email || 'admin@3pcommunication.com'}
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <div className="settings-badge-pill">
              <FaShieldAlt className="text-warning" /> JWT Verified
            </div>
            <div className="settings-badge-pill">
              <FaLock className="text-info" /> Encrypted Session
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Sections (Left) + Security Info (Right) */}
      <div className="row g-3 g-md-4">
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
                  Update your contact name, administrative email, and phone
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
                  <label className="form-label-custom">Phone Number</label>
                  <div className="settings-input-wrapper">
                    <FaPhoneAlt className="settings-input-icon" />
                    <input
                      type="tel"
                      className="form-control settings-input-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1711-000000"
                    />
                  </div>
                </div>

                {/* Current Password Authorization */}
                <div className="col-12 col-md-6">
                  <label className="form-label-custom">
                    Current Password <span className="text-muted">(Required for verification)</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <FaLock className="settings-input-icon" />
                    <input
                      type={showCredPassword ? 'text' : 'password'}
                      className="form-control settings-input-control"
                      value={credCurrentPassword}
                      onChange={(e) => setCredCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
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

              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mt-4 pt-3 border-top">
                <small className="text-muted">
                  Current password required to confirm changes
                </small>
                <button
                  type="submit"
                  disabled={isSubmittingCreds}
                  className="btn dashboard_all_button d-inline-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto"
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
                  Set a new, secure password for your portal account
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

              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mt-4 pt-3 border-top">
                <small className="text-muted">
                  Use your new password on subsequent logins
                </small>
                <button
                  type="submit"
                  disabled={isSubmittingPwd}
                  className="btn dashboard_all_button d-inline-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto"
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
            <h6 className="fw-bold mb-3">Content Settings</h6>
            <p className="small text-muted mb-3">
              Quick access to configure public website pages:
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
