'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaSpinner,
  FaCheckCircle,
  FaShieldAlt
} from 'react-icons/fa';
import backgroundImage from '../../assets/images/loginbackground/loginbackground.jpg';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('https://3pcommunicationsserver.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid administrative credentials');
      }

      // Save user & token in context and localStorage
      login(data.user, data.token);

      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true');
        if (data.user) {
          localStorage.setItem('3p_admin_user', JSON.stringify(data.user));
        }
      }

      // Navigate to dashboard
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const bgUrl = backgroundImage?.src || backgroundImage;

  return (
    <div className="admin-login-wrapper">
      {/* Background with Contrast Scrim */}
      <div
        className="admin-login-bg"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      <div className="admin-login-scrim" />

      {/* Top Header Navigation */}
      <header className="admin-login-nav">
        <Link href="/" className="admin-login-brand">
          <span className="admin-login-logo">
            3P <span className="brand-accent">COMMUNICATION</span>
          </span>
          <span className="admin-login-badge">PORTAL</span>
        </Link>

        <Link href="/" className="admin-login-back-btn">
          <FaArrowLeft className="small" />
          <span>Return to Website</span>
        </Link>
      </header>

      {/* Centered Login Card */}
      <main className="admin-login-content">
        <div className="admin-login-card">
          {/* Card Header */}
          <div className="admin-card-header">
            <div className="admin-icon-avatar">
              <FaUserShield />
            </div>
            <h1 className="admin-card-title">Admin Portal</h1>
            <p className="admin-card-subtitle">
              Sign in with your administrative credentials to manage portfolio and site content
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
              <span className="fw-semibold">Error:</span> {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {/* Email Address */}
            <div className="mb-1">
              <label htmlFor="adminEmail" className="form-label-custom">
                Administrator Email <span className="text-danger">*</span>
              </label>
              <div className="admin-login-input-group">
                <FaEnvelope className="admin-login-input-icon" />
                <input
                  type="email"
                  id="adminEmail"
                  className="admin-login-input"
                  placeholder="admin@3pcommunication.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-2">
              <label htmlFor="adminPassword" className="form-label-custom">
                Master Password <span className="text-danger">*</span>
              </label>
              <div className="admin-login-input-group">
                <FaLock className="admin-login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="adminPassword"
                  className="admin-login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-login-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spin-icon" /> Verifying Access...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer Security Badge */}
          <div className="admin-login-footer-note">
            <FaShieldAlt className="text-warning" />
            <span>Authorized Administrator Access Only • 3P Communication</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
