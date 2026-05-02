import { useLoading } from '../../contexts/LoadingContext';

function GlobalLoader() {
  const { isLoading, message } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="global-loader" role="status" aria-live="polite" aria-label="Global loading">
      <div className="global-loader__content">
        <div className="global-loader__spinner" aria-hidden="true" />
        {message ? <p className="global-loader__message">{message}</p> : null}
      </div>
    </div>
  );
}

export default GlobalLoader;

