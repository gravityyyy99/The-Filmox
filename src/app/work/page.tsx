'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './work.module.css';
import { usePortfolio } from '@/context/PortfolioContext';
import gsap from 'gsap';

export default function Work() {
  const { projects } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);

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

      if (projects.length > 0) {
        gsap.fromTo(`.${styles.projectCard}`,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.5, stagger: 0.15, ease: 'power3.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <div className={styles.container} ref={containerRef}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <h1 className={`${styles.title} text-gradient`}>Our Work</h1>
          <p className={styles.subtitle}>Selected wedding films and cinematic essays</p>
        </div>
      </section>

      <section className={styles.portfolio}>
        {projects.length > 0 ? (
          <div className={styles.grid}>
            {projects.map((project) => (
              <Link href={`/work/${project.id}`} key={project.id} className={styles.projectCard}>
                <div className={styles.imageWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={project.coverImageUrl} 
                    alt={project.title} 
                    className={styles.projectImage} 
                    loading="lazy"
                  />
                  <div className={styles.overlay}></div>
                </div>
                <div className={styles.cardContent}>
                  <h3>{project.title}</h3>
                  <div className={styles.details}>
                    <span className={styles.location}>{project.location}</span>
                    <span className={styles.date}>
                      {new Date(project.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No projects uploaded yet.</p>
            <Link href="/admin/dashboard" className={styles.adminPrompt}>
              Go to Admin Dashboard
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
