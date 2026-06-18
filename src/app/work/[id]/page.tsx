'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import styles from './project-details.module.css';
import { usePortfolio } from '@/context/PortfolioContext';
import { Category, MediaType } from '@/types';
import Link from 'next/link';
import gsap from 'gsap';

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { id } = use(params);
  const { projects, mediaItems } = usePortfolio();
  
  const project = projects.find(p => p.id === id);
  const projectMedia = mediaItems.filter(m => m.projectId === id);

  const [activeCategory, setActiveCategory] = useState<Category>('wedding');
  const [activeMediaType, setActiveMediaType] = useState<MediaType>('photo');
  const [lightboxImg, setLightboxImg] = useState<{ url: string; title?: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project) {
      const ctx = gsap.context(() => {
        gsap.fromTo(`.${styles.title}`,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
        );
        gsap.fromTo(`.${styles.meta}`,
          { opacity: 0, y: 20 },
          { opacity: 0.7, y: 0, duration: 1, delay: 0.3, ease: 'power2.out' }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [project]);

  if (!project) {
    return (
      <div className={styles.container}>
        <div className={styles.noMedia}>
          <h2>Project Not Found</h2>
          <p style={{ marginTop: '1rem', opacity: 0.7 }}>The requested portfolio project does not exist.</p>
          <Link href="/work" style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--color-antique-gold)' }}>
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  // Filter media based on active category and media type
  const filteredMedia = projectMedia.filter(
    m => m.category === activeCategory && m.type === activeMediaType
  );

  // Determine if categories exist to toggle tabs
  const hasWeddingItems = projectMedia.some(m => m.category === 'wedding');
  const hasPreWeddingItems = projectMedia.some(m => m.category === 'pre-wedding');

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Banner */}
      <section className={styles.banner}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.coverImageUrl} alt={project.title} className={styles.bannerImage} />
        <div className={styles.bannerOverlay}></div>
        <div className={styles.bannerContent}>
          <h1 className={styles.title}>{project.title}</h1>
          <div className={styles.meta}>
            <span>{project.location}</span>
            <span>•</span>
            <span>
              {new Date(project.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Description */}
      {project.description && (
        <section className={styles.descriptionSection}>
          <p className={styles.descriptionText}>{project.description}</p>
        </section>
      )}

      {/* Navigation Filter bar */}
      <section className={styles.navSection}>
        <div className={styles.tabsContainer}>
          <div className={styles.categoryTabs}>
            <button
              onClick={() => setActiveCategory('wedding')}
              className={`${styles.tabBtn} ${activeCategory === 'wedding' ? styles.activeTabBtn : ''}`}
              disabled={!hasWeddingItems && hasPreWeddingItems} // Auto focus active if only one exists
            >
              Wedding
            </button>
            <button
              onClick={() => setActiveCategory('pre-wedding')}
              className={`${styles.tabBtn} ${activeCategory === 'pre-wedding' ? styles.activeTabBtn : ''}`}
              disabled={!hasPreWeddingItems && hasWeddingItems}
            >
              Pre-Wedding
            </button>
          </div>

          <div className={styles.mediaTypeTabs}>
            <button
              onClick={() => setActiveMediaType('photo')}
              className={`${styles.subTabBtn} ${activeMediaType === 'photo' ? styles.activeSubTabBtn : ''}`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveMediaType('video')}
              className={`${styles.subTabBtn} ${activeMediaType === 'video' ? styles.activeSubTabBtn : ''}`}
            >
              Videos
            </button>
          </div>
        </div>
      </section>

      {/* Media Content */}
      <section className={styles.mediaSection}>
        {filteredMedia.length > 0 ? (
          activeMediaType === 'photo' ? (
            <div className={styles.photoGrid}>
              {filteredMedia.map((item) => (
                <div 
                  key={item.id} 
                  className={styles.photoItem}
                  onClick={() => setLightboxImg({ url: item.url, title: item.title })}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.title || project.title} loading="lazy" />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.videoGrid}>
              {filteredMedia.map((item) => (
                <div key={item.id} className={styles.videoItem}>
                  <div className={styles.videoWrapper}>
                    <iframe
                      src={item.url}
                      title={item.title || "Wedding Film"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className={styles.videoInfo}>
                    <h4>{item.title || 'Cinematic Film Segment'}</h4>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className={styles.noMedia}>
            <p>No media files found under this category.</p>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className={styles.lightbox} onClick={() => setLightboxImg(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={() => setLightboxImg(null)}>
              ✕ Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightboxImg.url} alt={lightboxImg.title || ""} className={styles.lightboxImage} />
            {lightboxImg.title && (
              <div className={styles.lightboxTitle}>{lightboxImg.title}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
