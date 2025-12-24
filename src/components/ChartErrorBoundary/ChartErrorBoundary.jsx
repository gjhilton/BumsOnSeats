import { Component } from "react";
import { css } from "@generated/css";

export class ChartErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('Chart rendering error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={css({
            padding: "xl",
            textAlign: "center",
            color: "error"
          })}
        >
          <h2 className={css({ fontSize: "xl", mb: "md" })}>
            Error rendering visualization
          </h2>
          <p className={css({ fontSize: "md" })}>
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
