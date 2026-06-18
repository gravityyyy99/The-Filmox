'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

const ADMIN_IDS = ['admin', 'ceo', 'owner'];
const MASTER_PASSWORD = 'filmox2026';

export default function AdminLogin() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem('filmox_authenticated');
    if (auth === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim()) {
      setError('Please enter your User ID or Email.');
      return;
    }

    if (password === MASTER_PASSWORD) {
      const normalizedId = userId.trim().toLowerCase();
      const role = ADMIN_IDS.includes(normalizedId) ? 'admin' : 'viewer';

      sessionStorage.setItem('filmox_authenticated', 'true');
      sessionStorage.setItem('filmox_user_id', normalizedId);
      sessionStorage.setItem('filmox_user_role', role);
      setError('');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundGlow}></div>

      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.lockIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>The Filmox</h2>
          <p>Secure Portal</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="userId">User ID or Email</label>
            <input
              type="text"
              id="userId"
              required
              className={styles.input}
              placeholder="e.g. admin, ceo, or your email"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>

        <div className={styles.roleHint}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>Admin / CEO / Owner IDs unlock full edit access</span>
        </div>

        <Link href="/" className={styles.backLink}>
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}
