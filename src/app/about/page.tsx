'use client';

import React, { useEffect, useRef } from 'react';
import styles from './about.module.css';
import gsap from 'gsap';
import { usePortfolio } from '@/context/PortfolioContext';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { teamMembers } = usePortfolio();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in animations for headings and cards
      gsap.fromTo(`.${styles.title}`, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
      
      gsap.fromTo(`.${styles.subtitle}`, 
        { opacity: 0, y: 20 },
        { opacity: 0.6, y: 0, duration: 1, delay: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(`.${styles.storyText} > *`,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.5, stagger: 0.2, ease: 'power2.out' }
      );

      gsap.fromTo(`.${styles.memberCard}`,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, delay: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [teamMembers]);

  return (
    <div className={styles.container} ref={containerRef}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <h1 className={`${styles.title} text-gradient`}>Our Story</h1>
          <p className={styles.subtitle}>Crafting visual poetry since 2018</p>
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.storyContent}>
          <div className={styles.storyText}>
            <h2>Love Stories in Motion</h2>
            <p>
              At The Filmox, we believe that weddings are not just events; they are raw, unfolding sagas of love, promise, and emotion. We do not just record videos—we curate timeless cinema.
            </p>
            <p>
              Founded with the vision to redefine wedding videography, we merge contemporary film techniques with authentic storytelling. We focus on the unscripted, natural moments—the stolen glances, teary laughter, and chaotic joys that make your day uniquely yours.
            </p>
          </div>
          <div className={styles.visualPlaceholder}>
            <span>The Director&apos;s Lens</span>
          </div>
        </div>
      </section>

      <section className={styles.team}>
        <div className={styles.teamHeader}>
          <h2>Meet the Directors</h2>
          <p>The visionaries behind the lens crafting your cinema.</p>
        </div>
        <div className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.memberImage}>
                <span>{member.initials}</span>
                <div className={styles.memberImageOverlay}></div>
              </div>
              <div className={styles.memberInfo}>
                <h3>{member.name}</h3>
                <div className={styles.memberRole}>{member.role}</div>
                <p className={styles.memberBio}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
