import React, { createContext, useContext } from 'react';
import { useSettings, SettingsData } from './useSettings';

const SettingsContext = createContext<SettingsData | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useGlobalSettings = () => useContext(SettingsContext);
