import React, { Component, ReactNode } from 'react';
import { brandConfig } from '../../config/brandConfig';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      hasError: true,
      error,
      errorInfo
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          padding: brandConfig.spacing.xl,
          backgroundColor: brandConfig.colors.barnWhite,
          borderRadius: brandConfig.layout.borderRadius,
          border: `1px solid ${brandConfig.colors.errorRed}`,
          fontFamily: brandConfig.typography.fontPrimary,
        }}>
          <h2 style={{
            color: brandConfig.colors.errorRed,
            fontSize: brandConfig.typography.fontSize2xl,
            marginBottom: brandConfig.spacing.md,
            textAlign: 'center',
          }}>
            Something went wrong
          </h2>
          <p style={{
            color: brandConfig.colors.neutralGray,
            fontSize: brandConfig.typography.fontSizeSm,
            textAlign: 'center',
            marginBottom: brandConfig.spacing.lg,
            maxWidth: '400px',
          }}>
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: `${brandConfig.spacing.md} ${brandConfig.spacing.lg}`,
              backgroundColor: brandConfig.colors.stableMahogany,
              color: brandConfig.colors.barnWhite,
              border: 'none',
              borderRadius: brandConfig.layout.borderRadius,
              fontSize: brandConfig.typography.fontSizeSm,
              fontFamily: brandConfig.typography.fontPrimary,
              cursor: 'pointer',
              fontWeight: brandConfig.typography.weightMedium,
            }}
          >
            Refresh Page
          </button>
          
          {/* Development error details */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginTop: brandConfig.spacing.lg,
              padding: brandConfig.spacing.md,
              backgroundColor: brandConfig.colors.arenaSand,
              borderRadius: brandConfig.layout.borderRadius,
              fontSize: brandConfig.typography.fontSizeXs,
              fontFamily: 'monospace',
              color: brandConfig.colors.midnightBlack,
              maxWidth: '600px',
              overflow: 'auto',
            }}>
              <summary style={{
                cursor: 'pointer',
                marginBottom: brandConfig.spacing.sm,
                fontWeight: brandConfig.typography.weightMedium,
              }}>
                Error Details (Development)
              </summary>
              <pre style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                margin: 0,
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
} 