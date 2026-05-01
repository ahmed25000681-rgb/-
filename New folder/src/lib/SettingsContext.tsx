import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth, checkAdmin } from './firebase';

interface SiteSettings {
  siteName: string;
  siteLogo: string;
  primaryColor: string;
  contactEmail: string;
  horrorIntensity: number;
  maintenanceMode: boolean;
}

const defaultSettings: SiteSettings = {
  siteName: "أكاديمية الظل",
  siteLogo: "",
  primaryColor: "#e61919",
  contactEmail: "admin@shadow-academy.com",
  horrorIntensity: 1,
  maintenanceMode: false,
};

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for real-time updates to global settings
    const path = 'settings/global';
    const unsub = onSnapshot(doc(db, path), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings;
        setSettings(data);
        
        // Update CSS variables for dynamic theming
        if (data.primaryColor) {
           document.documentElement.style.setProperty('--cyber-accent', data.primaryColor);
        }
      } else {
        // Initialize settings ONLY if authorized
        checkAdmin().then(isAdmin => {
          if (isAdmin) {
            setDoc(doc(db, path), defaultSettings).catch(e => {
              console.error("Failed to initialize settings:", e);
            });
          } else {
            console.warn("Global settings not found. Waiting for admin initialization.");
          }
        });
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const path = 'settings/global';
    try {
      await setDoc(doc(db, path), { ...settings, ...newSettings });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
