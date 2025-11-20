import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PreMortemProvider } from './context/PreMortemContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './styles/globals.css';
import './styles/breakpoints.css';
import './styles/mobile.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PreMortemProvider>
        <App />
      </PreMortemProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
