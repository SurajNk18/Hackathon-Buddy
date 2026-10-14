import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "40px 20px",
          textAlign: "center",
          maxWidth: "600px",
          margin: "40px auto",
          background: "#111726",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          color: "#f8fafc"
        }}>
          <h2 style={{ color: "#ef4444", marginBottom: "12px" }}>Something went wrong</h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px" }}>
            An unexpected error occurred while loading this view.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: "10px 20px",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
