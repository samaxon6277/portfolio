import './utils/patchFetch.ts';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeDatabase } from './utils/mockAdminData.ts';
import { CustomUiProvider } from './context/CustomUiContext.tsx';

// Warm up local database triggers during browser idle time to keep main thread fast for FCP & LCP
if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => initializeDatabase());
  } else {
    setTimeout(initializeDatabase, 100);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomUiProvider>
      <App />
    </CustomUiProvider>
  </StrictMode>,
);

