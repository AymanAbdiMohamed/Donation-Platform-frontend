import { Component } from "react";

/**
 * Top-level error boundary.
 * Catches unhandled JS errors in the React component tree and
 * shows a friendly fallback instead of a blank page.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // TODO: hook into an error-reporting service (Sentry, etc.)
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#FDF2F8]/30 px-4">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-[#1F2937]">
              Something went wrong
            </h1>
            <p className="text-[#4B5563]">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#DB2777] transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                className="rounded-xl border border-[#FBB6CE]/30 px-5 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#FDF2F8] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
