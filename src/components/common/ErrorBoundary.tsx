/**
 * ErrorBoundary Component
 * Catches JavaScript errors and displays fallback UI
 * Olumi Design System v1.2
 */

import { Component, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.icon}>⚠️</div>
            <h2 className={styles.title}>Something went wrong</h2>
            <p className={styles.message}>
              We encountered an unexpected error. This has been logged and we'll look into it.
            </p>

            {/* Error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <details className={styles.details}>
                <summary className={styles.summary}>Error Details (Dev Mode)</summary>
                <div className={styles.errorDetails}>
                  <p className={styles.errorName}>{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className={styles.errorStack}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Actions */}
            <div className={styles.actions}>
              <button className={styles.primaryButton} onClick={this.handleReset}>
                Try Again
              </button>
              <button className={styles.secondaryButton} onClick={this.handleReload}>
                Reload Page
              </button>
            </div>

            {/* Help */}
            <p className={styles.helpText}>
              If this problem persists, please{' '}
              <a
                href="https://github.com/yourusername/pre-mortem-tool/issues"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                report the issue
              </a>
              .
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
