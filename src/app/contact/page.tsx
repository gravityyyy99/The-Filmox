'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './contact.module.css';
import { usePortfolio } from '@/context/PortfolioContext';
import gsap from 'gsap';

function ContactFormInner() {
  const searchParams = useSearchParams();
  const initialPackage = searchParams.get('package') || '';
  const { packages } = usePortfolio();
  
  const [formData, setFormData] = useState({
    name: '',
    partnerName: '',
    email: '',
    phone: '',
    date: '',
    location: '',
    package: initialPackage,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialPackage) {
      setFormData(prev => ({ ...prev, package: initialPackage }));
    }
  }, [initialPackage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Inquiry submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className={styles.formWrapper}>
      {submitted ? (
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h3>Inquiry Received</h3>
          <p>
            Thank you for reaching out, {formData.name}! We have received your love story details and our lead cinematographer will get back to you within 24 hours to schedule a detailed call.
          </p>
          <button className={styles.resetBtn} onClick={() => setSubmitted(false)}>
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className={styles.inputField}
                placeholder="E.g., Rohan"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="partnerName">Partner's Name</label>
              <input
                type="text"
                id="partnerName"
                name="partnerName"
                className={styles.inputField}
                placeholder="E.g., Priya"
                value={formData.partnerName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={styles.inputField}
                placeholder="hello@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className={styles.inputField}
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date">Event Date</label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className={styles.inputField}
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location">Event Location</label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className={styles.inputField}
                placeholder="E.g., Udaipur, Mumbai, Goa"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="package">Select Cinematic Package</label>
              <select
                id="package"
                name="package"
                required
                className={styles.selectField}
                value={formData.package}
                onChange={handleChange}
              >
                <option value="">-- Choose a package --</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.title}>{pkg.title}</option>
                ))}
                <option value="Custom Inquiry">Custom Destination Package / Other</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="message">Tell us your story</label>
              <textarea
                id="message"
                name="message"
                required
                className={styles.textareaField}
                placeholder="Tell us about yourself, your wedding theme, what elements you prioritize in video/film, and any queries you might have..."
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Request Callback & Quote
          </button>
        </form>
      )}
    </div>
  );
}

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
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

      gsap.fromTo(`.${styles.contactContent}`,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroContent}>
          <h1 className={`${styles.title} text-gradient`}>Let's Connect</h1>
          <p className={styles.subtitle}>Tell us about your love story, and let's craft history together</p>
        </div>
      </section>

      <section className={styles.contactContent}>
        <div className={styles.contactInfo}>
          <div className={styles.infoBlock}>
            <h2>Get in Touch</h2>
            <p>
              We want to know what makes your union unique. Fill out our cinematography form, or reach out to us directly through call or email if you prefer a direct consultation.
            </p>
          </div>
          
          <div className={styles.directLinks}>
            <div className={styles.linkCard}>
              <span>Call Us Directly</span>
              <a href={`tel:${settings.phone}`}>{settings.phone}</a>
            </div>
            
            <div className={styles.linkCard}>
              <span>Send An Email</span>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className={styles.formWrapper}><p style={{ color: 'var(--color-antique-gold)' }}>Loading inquiry form...</p></div>}>
          <ContactFormInner />
        </Suspense>
      </section>
    </div>
  );
}
