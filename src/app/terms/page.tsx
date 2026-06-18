'use client';

import React from 'react';
import styles from '../privacy/privacy-terms.module.css';

export default function TermsOfService() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className="text-gradient">Terms of Service</h1>
        <p className={styles.date}>Last Updated: June 18, 2026</p>
        
        <section className={styles.section}>
          <h2>1. Service Offerings</h2>
          <p>
            The Filmox provides premium pre-wedding and wedding cinematography, photography, color grading, sound design, and creative directing services. All bookings are subject to contract terms, date availability, and retainer deposits.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Intellectual Property</h2>
          <p>
            All video teasers, full-length cinematic edits, raw footage, and photograph deliverables captured by The Filmox are protected by copyright laws. Standard personal use rights are granted to clients; commercial usage requires explicit written consent.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Client Responsibilities</h2>
          <p>
            Clients are responsible for obtaining necessary permissions and permits for photography/videography at venues and locations. The Filmox is not liable for footage restrictions imposed by venues.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Cancellations & Rescheduling</h2>
          <p>
            Retainer deposits are non-refundable to secure the production crew. Event rescheduling requests are subject to schedule availability and additional crew costs.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Limitation of Liability</h2>
          <p>
            Our maximum liability under any circumstances is limited to the total service fees paid by the client.
          </p>
        </section>
      </div>
    </div>
  );
}
