'use client';

import React from 'react';
import styles from './privacy-terms.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className="text-gradient">Privacy Policy</h1>
        <p className={styles.date}>Last Updated: June 18, 2026</p>
        
        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to The Filmox. We are committed to protecting your personal data and respecting your privacy. This Privacy Policy outlines how we collect, store, and process information from our clients and website visitors.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Information We Collect</h2>
          <p>
            We may collect information you provide directly through our contact and inquiry forms, including names, partner names, email addresses, phone numbers, event locations, and event dates.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <p>
            Your information is used to schedule consultations, draft pricing proposals, provide wedding photography and videography services, and contact you in relation to your inquiries. We do not sell or lease your details to third-party advertisers.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Storage & Security</h2>
          <p>
            We take reasonable technical and organizational precautions to protect your personal details from unauthorized access, loss, or theft.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Contact Us</h2>
          <p>
            If you have questions about your privacy rights or this policy, please email us at <a href="mailto:hello@thefilmox.com">hello@thefilmox.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
