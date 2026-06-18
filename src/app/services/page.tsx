'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './services.module.css';
import { usePortfolio } from '@/context/PortfolioContext';
import gsap from 'gsap';

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { packages } = usePortfolio();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(`.${styles.title}`, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
      
      gsap.fromTo(`.${styles.subtitle}`, 
        { opacity: 0, y: 20 },
        { opacity: 0.6, y: 0, duration: 1, delay: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(`.${styles.card}`,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.5, stagger: 0.2, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [packages]);

  return (
    <div className={styles.container} ref={containerRef}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <h1 className={`${styles.title} text-gradient`}>Collections & Inquiry</h1>
          <p className={styles.subtitle}>Premium cinematography packages customized for your memories</p>
        </div>
      </section>

      <section className={styles.packages}>
        <div className={styles.grid}>
          {packages.map((pkg, idx) => (
            <div key={pkg.id} className={`${styles.card} ${idx === 1 ? styles.cardFeatured : ''}`}>
              {idx === 1 && <span className={styles.badge}>Popular</span>}
              <div className={styles.cardHeader}>
                <h3>{pkg.title}</h3>
                <p className={styles.cardDescription}>{pkg.description}</p>
              </div>
              <ul className={styles.inclusions}>
                {pkg.inclusions.map((inc, i) => (
                  <li key={i}>{inc}</li>
                ))}
              </ul>
              <Link 
                href={`/contact?package=${encodeURIComponent(pkg.title)}`}
                className={`${styles.ctaButton} ${idx === 1 ? styles.ctaButtonFeatured : ''}`}
              >
                Inquire & Book
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.customQuote}>
        <div className={styles.customQuoteContent}>
          <h2>Planning a Destination Wedding?</h2>
          <p>
            We love to travel and capture love across borders. If you have custom wedding plans, a destination wedding, or multi-day ceremonies, reach out to us and we will design a tailormade proposal matching your schedule.
          </p>
          <Link href="/contact" className={styles.quoteBtn}>
            Request Custom Proposal
          </Link>
        </div>
      </section>
    </div>
  );
}
