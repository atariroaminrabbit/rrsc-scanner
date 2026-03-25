import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { StaffMember } from '../services/auth';

const TOKEN_KEY = 'rrsc_auth_token';
const STAFF_KEY = 'rrsc_staff';

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  staff: StaffMember | null;
  signIn: (token: string, staff: StaffMember) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember | null>(null);

  useEffect(() => {
    // Restore session on app launch
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const staffJson = await SecureStore.getItemAsync(STAFF_KEY);
        if (token && staffJson) {
          setStaff(JSON.parse(staffJson));
        }
      } catch {
        // Corrupt storage — clear it
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(STAFF_KEY);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = async (token: string, staffMember: StaffMember) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(STAFF_KEY, JSON.stringify(staffMember));
    setStaff(staffMember);
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(STAFF_KEY);
    setStaff(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: staff !== null,
        staff,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
