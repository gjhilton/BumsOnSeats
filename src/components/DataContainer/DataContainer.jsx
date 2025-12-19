import { useState, useEffect } from "react";
import { css } from "@generated/css";

const MessagePage = ({ title, titleColor, children }) => (
  <div className={css({ padding: "xl", minHeight: "100vh" })}>
    <h1 className={css({ fontSize: "xl", mb: "lg", color: titleColor })}>
      {title}
    </h1>
    {children}
  </div>
);

const LoadingComponent = () => <MessagePage title="Loading..." />;

const ErrorComponent = ({ message }) => (
  <MessagePage title="Error loading data" titleColor="accent">
    <p>{message}</p>
  </MessagePage>
);

const NoDataComponent = () => <MessagePage title="No data available" />;

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
