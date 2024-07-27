"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@app/firebase/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, loading] = useAuthState(auth);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    if (!loading) {
      setAuthUser(user);
    }
  }, [user, loading]);

  return (
    <AuthContext.Provider value={{ user: authUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);