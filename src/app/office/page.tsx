'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './office.module.css';
import { usePortfolio } from '@/context/PortfolioContext';
import dynamic from 'next/dynamic';
import gsap from 'gsap';

// Dynamically import the 3D studio canvas to avoid server-side hydration errors with WebGL/R3F
const Studio3D = dynamic(() => import('@/components/Studio3D'), {
  ssr: false,
  loading: () => <div style={{ color: 'var(--color-antique-gold)' }}>Loading Cinema Engine...</div>
});

export default function OfficePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'studio' | 'workspace'>('studio');
  const { settings } = usePortfolio();

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

      gsap.fromTo(`.${styles.splitRow}`,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const studioImages = [
    {
      title: 'Grading Suite',
      description: 'Color grading deck with calibrated reference displays.',
      imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'Sound Design Lab',
      description: 'Acoustically tuned environment for crafting immersive wedding soundtracks.',
      imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'Cinematic Theater Lounge',
      description: 'Private screening theater with cinema projection and multi-channel audio.',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const workspaceImages = [
    {
      title: 'Primary Workspace',
      description: 'Collaborative desk setups with ultra-wide panels and studio equipment.',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'The Design Studio',
      description: 'Ideation tables and storyboards where pre-wedding visual concepts begin.',
      imageUrl: 'https://images.unsplash.com/photo-1507207611509-ec012433ff52?q=80&w=600&auto=format&fit=crop'
    },
    {
      title: 'Equipment Arsenal Room',
      description: 'Secure, climate-controlled setup for cameras, custom rigs, and aerial setups.',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const gearsList = [
    {
      category: 'Cinema Cameras',
      items: ['RED V-Raptor 8K VV Cinema Camera', 'Sony FX6 Full-Frame Cinema Line', 'Sony FX3 Compact Cinema System']
    },
    {
      category: 'Anamorphic & Prime Lenses',
      items: ['Cooke Anamorphic/i prime lenses', 'Sony G-Master Primes (24mm, 50mm, 85mm)', 'Sony G-Master Zooms (16-35mm, 24-70mm, 70-200mm)']
    },
    {
      category: 'Aviation & Aerial',
      items: ['DJI Mavic 3 Cine (Apple ProRes recording)', 'DJI Inspire 3 (8K ProRes RAW cinema drone)']
    },
    {
      category: 'Stabilizers & Support',
      items: ['DJI Ronin 2 Professional Gimbal', 'DJI RS3 Pro stabilizer system', 'EasyRig Vario 5 camera support rig']
    },
    {
      category: 'Audio Recording',
      items: ['Sennheiser MKH 416 directional shotgun mic', 'Rode Wireless PRO system with internal backup', 'Zoom F6 Field Recorder']
    }
  ];

  return (
    <div className={styles.container} ref={containerRef}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <h1 className={`${styles.title} text-gradient`}>Our Studio</h1>
          <p className={styles.subtitle}>Where stories are designed, colored, and brought to life</p>
        </div>
      </section>

      <section className={styles.showcase}>
        <div className={styles.splitRow}>
          <div className={styles.studioText}>
            <h2>The Filmox Headquarters</h2>
            <p>{settings.studioDescription}</p>
          </div>
          
          <div className={styles.interactive3DWrapper}>
            <Studio3D />
            <span className={styles.hint3D}>Drag to Rotate Lens</span>
          </div>
        </div>

        {/* Gallery Tabs for Studio / Workspace */}
        <div className={styles.galleryTabsSection}>
          <div className={styles.tabsHeader}>
            <button 
              className={`${styles.tabLink} ${activeTab === 'studio' ? styles.activeTabLink : ''}`}
              onClick={() => setActiveTab('studio')}
            >
              The Studio
            </button>
            <button 
              className={`${styles.tabLink} ${activeTab === 'workspace' ? styles.activeTabLink : ''}`}
              onClick={() => setActiveTab('workspace')}
            >
              The Workspace
            </button>
          </div>
          
          <div className={styles.galleryGrid}>
            {(activeTab === 'studio' ? studioImages : workspaceImages).map((item, idx) => (
              <div key={idx} className={styles.showroomCard}>
                <div className={styles.cardImage}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.title} loading="lazy" />
                </div>
                <div className={styles.cardInfo}>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', opacity: 0.85, fontSize: '1.05rem', lineHeight: '1.7', textAlign: 'center', maxWidth: '800px', margin: '2rem auto 0' }}>
            <p>{settings.workspaceDescription}</p>
          </div>
        </div>

        {/* Gears Section */}
        <div className={styles.gearsSection}>
          <h3 className={styles.gearsHeading}>The Cinematic Gear Arsenal</h3>
          <p className={styles.gearsSubtitle}>We utilize industry-grade cinematic production gear to bring your wedding story to the silver screen.</p>
          
          <div className={styles.gearsGrid}>
            {gearsList.map((gearCategory, idx) => (
              <div key={idx} className={styles.gearCard}>
                <h4>{gearCategory.category}</h4>
                <ul>
                  {gearCategory.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Location Map */}
        <div className={styles.locationMap}>
          <div className={styles.mapText}>
            <h3>Visit The Studio</h3>
            <p>
              We would love to show you around, show you some of our premium films in our custom screening lounge, and discuss your big day over a cup of fresh coffee. Please schedule an appointment ahead of time.
            </p>
            <div className={styles.addressBox}>
              <h4>The Filmox HQ</h4>
              <p>{settings.address}</p>
            </div>
          </div>
          
          <div className={styles.mapPlaceholder}>
            <span>Studio Location Map</span>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Andheri West Business District
            </p>
            <div className={styles.mapCoordinates}>
              19.1197° N, 72.8471° E
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
