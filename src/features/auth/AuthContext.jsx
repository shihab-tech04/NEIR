import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const LOCAL_KEY = 'neir_admin_session';
const SESSION_KEY = 'neir_admin_session';

const readStoredSession = () => {
  try {
    const local = localStorage.getItem(LOCAL_KEY);
    if (local) return JSON.parse(local);

    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) return JSON.parse(session);
  } catch {
    return null;
  }

  return null;
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readStoredSession);

  const login = async (username = '', password = '', remember = false) => {
    const normalizedUsername = username?.trim() || 'neir-admin';

    const sessionUser = {
      id: 'neir-admin-session',
      fullName: normalizedUsername === 'neir-admin' ? 'NEIR Admin' : normalizedUsername,
      username: normalizedUsername,
      email: normalizedUsername.includes('@') ? normalizedUsername : '',
      role: 'Admin',
      designation: '',
      department: '',
    };

    const nextSession = {
      user: sessionUser,
      authenticated: true,
    };

    localStorage.removeItem(LOCAL_KEY);
    sessionStorage.removeItem(SESSION_KEY);

    if (remember) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(nextSession));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    }

    setSession(nextSession);
    return sessionUser;
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        isAuthenticated: Boolean(session?.authenticated && session?.user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
