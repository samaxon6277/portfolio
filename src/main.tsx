import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeDatabase } from './utils/mockAdminData.ts';
import { CustomUiProvider } from './context/CustomUiContext.tsx';

// Strict secure global console hygiene for Production
if (typeof window !== 'undefined' && !(import.meta as any).env?.DEV) {
  const noop = () => {};
  window.console.log = noop;
  window.console.warn = noop;
  window.console.debug = noop;
  window.console.info = noop;

  const originalError = window.console.error;
  window.console.error = (...args: any[]) => {
    // Sanitize and filter out all potential sensitive data leaks (e.g. auth, RLS, emails, supabase details)
    const hasSensitiveData = args.some(arg => {
      if (!arg) return false;
      const str = typeof arg === 'object' ? JSON.stringify(arg).toLowerCase() : String(arg).toLowerCase();
      return str.includes('supabase') || 
             str.includes('auth') || 
             str.includes('email') || 
             str.includes('role') || 
             str.includes('user') ||
             str.includes('rls') ||
             str.includes('key') ||
             str.includes('session');
    });
    if (!hasSensitiveData) {
      originalError(...args);
    }
  };
}

// Warm up local database triggers
initializeDatabase();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomUiProvider>
      <App />
    </CustomUiProvider>
  </StrictMode>,
);
