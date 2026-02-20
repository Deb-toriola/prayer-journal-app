import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught render error:', error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-primary, #fff)' }}>
          <p style={{ marginBottom: 8, fontSize: '1.1rem', fontWeight: 600 }}>Something went wrong</p>
          <p style={{ marginBottom: 24, color: 'var(--text-secondary, rgba(255,255,255,0.6))', fontSize: '0.85rem' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            style={{
              background: 'var(--gold, #FBBF24)',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
            onClick={() => window.location.reload()}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
