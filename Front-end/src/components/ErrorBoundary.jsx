// src/components/ErrorBoundary.jsx
import React from 'react';

/**
 * ErrorBoundary component to catch rendering errors in its child component tree.
 * It displays a fallback UI instead of crashing the entire application.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state to track if an error has occurred
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * static getDerivedStateFromError(error)
   * This lifecycle method is called after an error has been thrown by a descendant component.
   * It receives the error that was thrown as a parameter.
   * It should return a value to update state, which will trigger a re-render
   * with the fallback UI.
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  /**
   * componentDidCatch(error, errorInfo)
   * This lifecycle method is called after an error has been thrown by a descendant component.
   * It receives two parameters:
   * 1. error: The error that was thrown.
   * 2. errorInfo: An object with a componentStack key containing information
   * about which component threw the error.
   * This is typically used for side-effects like logging errors to an analytics service.
   */
  componentDidCatch(error, errorInfo) {
    // Log the error to the console for debugging purposes
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // In a real application, you would send this error information
    // to an error reporting service (e.g., Sentry, Bugsnag, or your own backend)
    // Example: logErrorToMyService(error, errorInfo.componentStack);

    // Update state with errorInfo for display in development mode
    this.setState({ errorInfo: errorInfo });
  }

  /**
   * render()
   * Renders the children components if no error has occurred,
   * otherwise renders the fallback UI.
   */
  render() {
    if (this.state.hasError) {
      // If an error occurred, render the fallback UI provided via props
      // or a default error message.
      return (
        <div style={{
          padding: '20px',
          color: 'white',
          backgroundColor: '#1a1a1a', // Dark background
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '50px auto',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          border: '1px solid #ef4444' // Red border
        }}>
          <h2 style={{ color: '#ef4444', fontSize: '2em', marginBottom: '15px' }}>
            <span role="img" aria-label="warning">⚠️</span> Oops! Something Went Wrong.
          </h2>
          <p style={{ fontSize: '1.1em', color: '#ccc', marginBottom: '20px' }}>
            We're sorry, but an unexpected error occurred while loading this section.
          </p>

          {/* Display error details in development for debugging */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              marginTop: '25px',
              borderTop: '1px solid #444',
              paddingTop: '15px',
              color: '#aaa',
              fontSize: '0.9em'
            }}>
              <summary style={{ cursor: 'pointer', color: '#bbb', fontWeight: 'bold' }}>
                Click for Error Details
              </summary>
              <pre style={{ overflowX: 'auto', padding: '10px', backgroundColor: '#222', borderRadius: '8px', marginTop: '10px' }}>
                <code style={{ color: '#ddd' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack ? `\n\nComponent Stack:\n${this.state.errorInfo.componentStack}` : ''}
                </code>
              </pre>
            </details>
          )}

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '30px',
              padding: '12px 25px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Reload Page
          </button>
        </div>
      );
    }

    // If no error, render the children components normally
    return this.props.children;
  }
}

export default ErrorBoundary;
