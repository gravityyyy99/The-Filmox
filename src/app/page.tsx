'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const teaserRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial state
      gsap.set(titleRef.current, { opacity: 0, scale: 1.1, y: 30 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });

      // Cinematic Reveal
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        delay: 0.5
      })
      .to(titleRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out'
      }, "-=0.5")
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, "-=1")
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, "-=0.8");

      // Teaser section fade-in
      if (teaserRef.current) {
        gsap.fromTo(teaserRef.current.querySelectorAll(`.${styles.teaserText} > *`),
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1, delay: 2, stagger: 0.15, ease: 'power2.out'
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className={styles.main} ref={containerRef}>
      {/* Dark overlay that fades out like a cinema screen turning on */}
      <div className={styles.cinemaOverlay} ref={overlayRef}></div>

      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Subtle background gradient or video placeholder */}
        <div className={styles.heroBackground}>
          <div className={styles.glow}></div>
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.title} ref={titleRef}>
            THE FILMOX
          </h1>
          <p className={styles.subtitle} ref={subtitleRef}>
            LOVE STORIES IN MOTION
          </p>
          <div className={styles.cta} ref={ctaRef}>
            <Link href="/work" className={styles.primaryButton}>
              Explore Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Teaser Section */}
      <section className={styles.teaser} ref={teaserRef}>
        <div className="container">
          <div className={styles.teaserGrid}>
            <div className={styles.teaserText}>
              <h2>Cinematic Storytelling</h2>
              <p>We craft timeless memories using light, sound, and raw emotion. Your love story deserves a motion picture.</p>
              <Link href="/about" className={styles.linkButton}>Read Our Story</Link>
            </div>
            <div className={styles.directorsCut}>
              <div className={styles.filmFrame}>
                <div className={styles.filmStrip}>
                  <div className={styles.filmHole}></div>
                  <div className={styles.filmHole}></div>
                  <div className={styles.filmHole}></div>
                  <div className={styles.filmHole}></div>
                  <div className={styles.filmHole}></div>
                </div>
                <div className={styles.filmContent}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
                    alt="Cinematic wedding moment"
                    className={styles.filmImage}
                  />
                  <div className={styles.filmOverlay}>
                    <div className={styles.playIcon}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                    <span className={styles.filmLabel}>Director&apos;s Cut</span>
                  </div>
                </div>
                <div className={styles.filmStrip}>
                  <div className={styles.filmHole}></div>
                  <div className={styles.filmHole}></div>
                  <div className={styles.filmHole}></div>
                  <div className={styles.filmHole}></div>
                  <div className={styles.filmHole}></div>
                </div>
              </div>
              <div className={styles.directorsBadge}>
                <span className={styles.badgeLine}></span>
                <span className={styles.badgeText}>EXCLUSIVE CINEMA</span>
                <span className={styles.badgeLine}></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
