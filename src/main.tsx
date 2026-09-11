import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeDatabase } from './utils/mockAdminData.ts';
import { CustomUiProvider } from './context/CustomUiContext.tsx';

// Warm up local database triggers
initializeDatabase();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomUiProvider>
      <App />
    </CustomUiProvider>
  </StrictMode>,
);

