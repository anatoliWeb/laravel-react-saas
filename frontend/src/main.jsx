import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import { HeaderProvider } from './app/HeaderContext';
import { LoadingProvider } from './contexts/LoadingContext';
import './i18n';
import './styles/app.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <HeaderProvider>
        <App />
      </HeaderProvider>
    </LoadingProvider>
  </StrictMode>,
);
