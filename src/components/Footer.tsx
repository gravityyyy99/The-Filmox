'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

import { usePortfolio } from '@/context/PortfolioContext';

export default function Footer() {
  const { settings } = usePortfolio();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.footerLogoContainer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="THE FILMOX" className={styles.footerLogo} onError={(e) => {
                (e.target as HTMLElement).parentElement!.style.display = 'none';
                const sib = (e.target as HTMLElement).parentElement!.nextElementSibling;
                if (sib) (sib as HTMLElement).style.display = 'block';
              }} />
            </div>
            <h2 className={styles.logo} style={{ display: 'none' }}>THE FILMOX</h2>
            <p className={styles.tagline}>LOVE STORIES IN MOTION</p>
            <p className={styles.description}>
              Premium pre-wedding and wedding cinematography, capturing the timeless essence of your love story.
            </p>
          </div>
          
          <div className={styles.links}>
            <h3>Explore</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Services & Pricing</Link></li>
              <li><Link href="/work">Portfolio</Link></li>
              <li><Link href="/office">Our Studio</Link></li>
            </ul>
          </div>

          <div className={styles.contact}>
            <h3>Contact</h3>
            <p>Email: <a href={`mailto:${settings.email}`}>{settings.email}</a></p>
            <p>Phone: <a href={`tel:${settings.phone}`}>{settings.phone}</a></p>
            <p>Location: <Link href="/office">View our Studio</Link></p>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} The Filmox. All rights reserved.</p>
          <div className={styles.legal}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
