import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { MuiProvider } from './system/MuiProvider.jsx';

const root = document.getElementById('root');

if (!root) {
  throw new Error('NEIR root element was not found.');
}

createRoot(root).render(
  <StrictMode>
    <MuiProvider>
      <App />
    </MuiProvider>
  </StrictMode>,
);
