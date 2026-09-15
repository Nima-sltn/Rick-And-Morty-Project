import React, { ReactNode } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from "react-error-boundary";

import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Fallback component for errors
const ErrorFallback: React.FC<FallbackProps> = ({
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
              {"\n"}
              {error.stack}
            </pre>
          </details>
        )}
      </div>

      <button
        onClick={resetErrorBoundary}
        type="button"
        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
        <ArrowPathIcon className="h-4 w-4 mr-2" />
        Try Again
      </button>
    </div>
  </div>
);

// Simple error fallback for smaller components
export const SimpleErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => (
  <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
    <div className="flex items-center">
      <ExclamationTriangleIcon className="h-5 w-5 text-danger-500 mr-2" />

      <span className="text-sm text-danger-700 dark:text-danger-300">
        {error.message || "Something went wrong"}
      </span>

      <button
        onClick={resetErrorBoundary}
        type="button"
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
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    onError?.(error, errorInfo);
  };

  const FallbackComponent = fallback ? () => <>{fallback}</> : ErrorFallback;

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      onReset={() => {
        window.location.reload();
      }}>
      {children}
    </ReactErrorBoundary>
  );
};

// Component used by the HOC
const ErrorBoundaryWrapper = <P extends object>({
  Component,
  errorFallback: ErrorFallbackComponent,
  props,
}: {
  Component: React.ComponentType<P>;
  errorFallback?: React.ComponentType<ErrorFallbackProps>;
  props: P;
}) => (
  <ErrorBoundary
    fallback={
      ErrorFallbackComponent ? (
        <ErrorFallbackComponent
          error={new Error("An unexpected error occurred")}
          resetErrorBoundary={() => window.location.reload()}
        />
      ) : undefined
    }>
    <Component {...props} />
  </ErrorBoundary>
);

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorFallback?: React.ComponentType<ErrorFallbackProps>,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundaryWrapper
      Component={Component}
      errorFallback={errorFallback}
      props={props}
    />
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
}

export default ErrorBoundary;
