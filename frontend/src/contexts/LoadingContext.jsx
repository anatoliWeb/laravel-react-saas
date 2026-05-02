import { createContext, useContext, useMemo, useState } from 'react';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    message: null,
  });

  const showLoading = (message = null) => {
    setLoadingState({
      isLoading: true,
      message,
    });
  };

  const hideLoading = () => {
    setLoadingState({
      isLoading: false,
      message: null,
    });
  };

  const setLoadingMessage = (message) => {
    setLoadingState((prev) => ({
      ...prev,
      message,
    }));
  };

  const value = useMemo(() => ({
    ...loadingState,
    showLoading,
    hideLoading,
    setLoadingMessage,
  }), [loadingState]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('useLoading must be used inside LoadingProvider');
  }

  return context;
}

