import React, { Component, ReactNode, ErrorInfo } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import * as Sentry from "@sentry/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Update state with error details
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Report to Sentry
    Sentry.withScope((scope) => {
      scope.setExtras({
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      });
      scope.setTag("component", "ErrorBoundary");
      scope.setLevel("error");
      Sentry.captureException(error);
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleNavigateHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="max-w-2xl w-full space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Oops! Something went wrong</AlertTitle>
              <AlertDescription>
                We're sorry, but something unexpected happened. Please try refreshing the page or
                navigating back to the home page.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 justify-center">
              <Button onClick={this.handleReset} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="secondary">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              <Button onClick={this.handleNavigateHome} variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>

            {isDevelopment && this.state.error && (
              <div className="mt-8 space-y-4">
                <Alert>
                  <AlertTitle className="font-mono">Error Details (Development Only)</AlertTitle>
                  <AlertDescription className="mt-2">
                    <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                      {this.state.error.toString()}
                    </pre>
                  </AlertDescription>
                </Alert>

                {this.state.errorInfo && (
                  <Alert>
                    <AlertTitle className="font-mono">Component Stack</AlertTitle>
                    <AlertDescription className="mt-2">
                      <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {this.state.errorCount > 2 && (
              <Alert variant="destructive">
                <AlertTitle>Multiple Errors Detected</AlertTitle>
                <AlertDescription>
                  This error has occurred multiple times. There might be a persistent issue.
                  Please contact support if this continues.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
}

// Export Sentry's ErrorBoundary as well for more advanced use cases
export const SentryErrorBoundary = Sentry.ErrorBoundary;