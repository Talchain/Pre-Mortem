/**
 * AppFooter Component
 * Application footer with credits and links
 * Olumi Design System v1.2
 */

import styles from './AppFooter.module.css';

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.content}>
          {/* Branding */}
          <div className={styles.branding}>
            <span className={styles.brandIcon}>🔮</span>
            <p className={styles.brandText}>
              <strong>Pre-Mortem Analysis</strong>
              <span className={styles.separator}>·</span>
              Powered by Olumi
            </p>
          </div>

          {/* Links */}
          <div className={styles.links}>
            <a
              href="https://github.com/yourusername/pre-mortem-tool"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub
            </a>
            <span className={styles.separator}>·</span>
            <a
              href="https://olumi.ai"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Olumi
            </a>
            <span className={styles.separator}>·</span>
            <a
              href="https://olumi.ai/docs/pre-mortem"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Documentation
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p>© {currentYear} Olumi. All rights reserved.</p>
        </div>

        {/* Attribution */}
        <div className={styles.attribution}>
          <p>
            Built with{' '}
            <span className={styles.heart} aria-label="love">
              ❤️
            </span>{' '}
            using React, TypeScript, and the Olumi Design System
          </p>
        </div>
      </div>
    </footer>
  );
}
