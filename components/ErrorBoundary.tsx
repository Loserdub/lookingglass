import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught React error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#000',
          color: '#e5e5e5',
          fontFamily: 'monospace',
          padding: '2rem',
          boxSizing: 'border-box',
        }}>
          <h1 style={{ color: '#f87171', fontSize: '1.5rem', marginBottom: '1rem' }}>
            ⚠️ Application Error
          </h1>
          <p style={{ color: '#a3a3a3', marginBottom: '1rem' }}>
            A React rendering error has occurred. Details below:
          </p>
          <div style={{
            backgroundColor: '#171717',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            overflowX: 'auto',
          }}>
            <strong style={{ color: '#f87171' }}>Error:</strong>
            <pre style={{ color: '#fca5a5', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.message}
            </pre>
          </div>
          {this.state.error?.stack && (
            <div style={{
              backgroundColor: '#171717',
              border: '1px solid #404040',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              overflowX: 'auto',
            }}>
              <strong style={{ color: '#a3a3a3' }}>Stack Trace:</strong>
              <pre style={{ color: '#737373', marginTop: '0.5rem', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                {this.state.error.stack}
              </pre>
            </div>
          )}
          {this.state.errorInfo?.componentStack && (
            <div style={{
              backgroundColor: '#171717',
              border: '1px solid #404040',
              borderRadius: '8px',
              padding: '1rem',
              overflowX: 'auto',
            }}>
              <strong style={{ color: '#a3a3a3' }}>Component Stack:</strong>
              <pre style={{ color: '#737373', marginTop: '0.5rem', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
