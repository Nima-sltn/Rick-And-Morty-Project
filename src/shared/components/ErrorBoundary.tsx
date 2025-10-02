import React, { Component, ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Fallback component for errors
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => (
  <div className="min-h-[400px] flex items-center justify-center p-8">
    <div className="text-center max-w-md mx-auto">
      <div className="mb-6">
        <ExclamationTriangleIcon className="h-16 w-16 text-danger-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We encountered an unexpected error. Don't worry, it's not your fault!
        </p>
        {process.env.NODE_ENV === "development" && (
          <details className="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <summary className="cursor-pointer font-medium text-sm mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
      <button
        onClick={resetErrorBoundary}
        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
        <ArrowPathIcon className="h-4 w-4 mr-2" />
        Try Again
      </button>
    </div>
  </div>
);

// Simple error fallback for smaller components
export const SimpleErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
    <div className="flex items-center">
      <ExclamationTriangleIcon className="h-5 w-5 text-danger-500 mr-2" />
      <span className="text-sm text-danger-700 dark:text-danger-300">
        Something went wrong
      </span>
      <button
        onClick={resetErrorBoundary}
        className="ml-auto text-xs text-danger-600 hover:text-danger-800 underline">
        Retry
      </button>
    </div>
  </div>
);

// Main ErrorBoundary component using react-error-boundary
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
  onError,
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Call custom error handler if provided
    onError?.(error, errorInfo);

    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { errorInfo } });
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Optionally clear any error state or reload data
        window.location.reload();
      }}>
      {children}
    </ReactErrorBoundary>
  );
};

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: React.ComponentType<ErrorFallbackProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary
      fallback={
        errorFallback ? (
          <errorFallback error={new Error()} resetErrorBoundary={() => {}} />
        ) : undefined
      }>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

export default ErrorBoundary;
