import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryProvider } from "./shared/providers/QueryProvider";
import { ThemeProvider } from "./shared/providers/ThemeProvider";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
