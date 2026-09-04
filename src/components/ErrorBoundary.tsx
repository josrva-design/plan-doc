import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-base)]">
          <div className="text-center p-6">
            <p className="text-lg font-bold text-[var(--color-text-primary)]">Algo salió mal</p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{this.state.error?.message}</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 premium-btn-pill premium-btn-pill--primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
