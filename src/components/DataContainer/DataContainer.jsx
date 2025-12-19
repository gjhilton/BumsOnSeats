import { useState, useEffect } from "react";
import { css } from "@generated/css";

const LoadingComponent = () => (
  <div className={css({ padding: "2rem", minHeight: "100vh" })}>
    <h1 className={css({ fontSize: "xlarge", mb: "lg" })}>
      Loading...
    </h1>
  </div>
);

const ErrorComponent = ({ message }) => (
  <div className={css({ padding: "2rem", minHeight: "100vh" })}>
    <h1 className={css({ fontSize: "xlarge", mb: "lg", color: "accent" })}>
      Error loading data
    </h1>
    <p>{message}</p>
  </div>
);

const NoDataComponent = () => (
  <div className={css({ padding: "2rem", minHeight: "100vh" })}>
    <h1 className={css({ fontSize: "xlarge", mb: "lg" })}>
      No data available
    </h1>
  </div>
);

export function DataContainer({ loadData, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [loadData]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent message={error.message} />;
  }

  if (!data) {
    return <NoDataComponent />;
  }

  return children(data);
}
