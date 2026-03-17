import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

console.log('[init] index.tsx loaded');

// Validate environment variable
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.warn('[init] WARNING: API_KEY environment variable is not set. Image analysis will fail.');
} else {
  console.log('[init] API_KEY environment variable is present.');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  const msg = 'Could not find #root element in the DOM. Check that index.html contains <div id="root"></div>.';
  console.error('[init]', msg);
  throw new Error(msg);
}

console.log('[init] #root element found, mounting React application...');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('[init] React application mounted successfully.');