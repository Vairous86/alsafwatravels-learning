import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

type User = {
  id?: number;
  username: string;
  serial: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (username: string) => Promise<{ success: boolean; error?: string }>; 
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load persisted user from localStorage
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.username && parsed?.serial) setUser(parsed);
      }
    } catch (e) {
      // ignore
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string) => {
    try {
      // ensure device id
      let deviceId = '';
      try { deviceId = localStorage.getItem('device_id') || ''; } catch (e) { deviceId = ''; }
      if (!deviceId) {
        deviceId = (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2);
        try { localStorage.setItem('device_id', deviceId); } catch (e) { /* ignore */ }
      }

      const { data, error } = await supabase.rpc('login_or_register', { p_username: username, p_device_id: deviceId });
      if (error) return { success: false, error: error.message };
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) return { success: false, error: 'No response from server' };

      // Handle specific server messages according to rules
      if (row.message === 'username_invalid') {
        // Arabic message: "اليوزر نيم خطأ"
        return { success: false, error: 'اليوزر نيم خطأ' };
      }

      if (row.message === 'device_mismatch') {
        // Arabic message: "الجهاز غير مطابق"
        return { success: false, error: 'الجهاز غير مطابق' };
      }

      // Successful login or serial assignment: 'serial_assigned' or 'ok'
      const newUser: User = { username: row.username, serial: row.serial, id: row.id };
      setUser(newUser);
      try { localStorage.setItem('user', JSON.stringify(newUser)); } catch (e) {}
      return { success: true };    } catch (err: any) {
      return { success: false, error: err?.message || String(err) };
    }
  };

  const signOut = () => {
    setUser(null);
    try { localStorage.removeItem('user'); } catch (e) {}
    try { window.location.href = '/login'; } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
