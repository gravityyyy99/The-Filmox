'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [isLightMode, setIsLightMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Initialize Theme
    const savedTheme = localStorage.getItem('filmox_theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.body.classList.add('light-theme');
    } else {
      setIsLightMode(false);
      document.body.classList.remove('light-theme');
    }

    // Check Auth
    const auth = sessionStorage.getItem('filmox_authenticated');
    if (auth === 'true') {
      setIsLoggedIn(true);
      setUserRole(sessionStorage.getItem('filmox_user_role') || '');
      setUserId(sessionStorage.getItem('filmox_user_id') || '');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Re-check auth when pathname changes (after login/logout)
  useEffect(() => {
    const auth = sessionStorage.getItem('filmox_authenticated');
    if (auth === 'true') {
      setIsLoggedIn(true);
      setUserRole(sessionStorage.getItem('filmox_user_role') || '');
      setUserId(sessionStorage.getItem('filmox_user_id') || '');
    } else {
      setIsLoggedIn(false);
      setUserRole('');
      setUserId('');
    }
  }, [pathname]);

  // Close mobile menu when page changes
  useEffect(() => {
    setMobileOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (showUserMenu) setShowUserMenu(false);
    };
    if (showUserMenu) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside, { once: true });
      }, 0);
    }
  }, [showUserMenu]);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleTheme = () => {
    if (isLightMode) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('filmox_theme', 'dark');
      setIsLightMode(false);
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('filmox_theme', 'light');
      setIsLightMode(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('filmox_authenticated');
    sessionStorage.removeItem('filmox_user_id');
    sessionStorage.removeItem('filmox_user_role');
    setIsLoggedIn(false);
    setUserRole('');
    setUserId('');
    setShowUserMenu(false);
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/work' },
    { name: 'Studio', href: '/office' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${mobileOpen ? styles.headerActive : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <div className={styles.logoImgContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="THE FILMOX" className={styles.logoImg} onError={(e) => {
                // Fallback to text if image fails to load
                (e.target as HTMLElement).parentElement!.style.display = 'none';
                const sib = (e.target as HTMLElement).parentElement!.nextElementSibling;
                if (sib) (sib as HTMLElement).style.display = 'block';
              }} />
            </div>
            <span className={styles.logoText} style={{ display: 'none' }}>THE FILMOX</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className={pathname === link.href ? styles.activeLink : ''}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme} 
            className={styles.themeToggle}
            aria-label="Toggle Theme"
          >
            {isLightMode ? (
              <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* User Icon */}
          <div className={styles.userIconWrapper}>
            <button
              onClick={() => {
                if (isLoggedIn) {
                  setShowUserMenu(!showUserMenu);
                } else {
                  router.push('/admin/login');
                }
              }}
              className={`${styles.userIconBtn} ${isLoggedIn ? styles.userLoggedIn : ''}`}
              aria-label="User Account"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && isLoggedIn && (
              <div className={styles.userDropdown}>
                <div className={styles.userDropdownHeader}>
                  <div className={styles.userAvatar}>
                    {userId.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={styles.userName}>{userId}</div>
                    <div className={styles.userRoleBadge}>
                      {userRole === 'admin' ? '✦ Admin' : '◈ Viewer'}
                    </div>
                  </div>
                </div>
                <div className={styles.userDropdownDivider} />
                <Link
                  href="/admin/dashboard"
                  className={styles.userDropdownItem}
                  onClick={() => setShowUserMenu(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Dashboard
                </Link>
                <button className={styles.userDropdownItem} onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <Link href="/contact" className={styles.ctaButton}>
            Inquire
          </Link>
          
          {/* Hamburger Button */}
          <button 
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerActive : ''}`} 
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`${styles.mobileDrawer} ${mobileOpen ? styles.drawerOpen : ''}`}>
        <nav className={styles.mobileNav}>
          <ul className={styles.mobileNavList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className={pathname === link.href ? styles.activeMobileLink : ''}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              {isLoggedIn ? (
                <Link href="/admin/dashboard" className={styles.adminLink}>
                  Dashboard
                </Link>
              ) : (
                <Link href="/admin/login" className={styles.adminLink}>
                  Sign In
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
