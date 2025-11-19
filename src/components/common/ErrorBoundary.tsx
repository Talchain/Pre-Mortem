import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-elevated p-8 text-center">
            <div className="w-16 h-16 bg-accent-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-accent-error" />
            </div>

            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Something went wrong
            </h1>

            <p className="text-neutral-600 mb-6">
              We encountered an unexpected error. Don't worry, your data is
              saved. Please try refreshing the page.
            </p>

            {this.state.error && (
              <div className="bg-neutral-100 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs font-mono text-neutral-700">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <Button onClick={this.handleReset} fullWidth>
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
