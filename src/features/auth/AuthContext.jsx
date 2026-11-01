import React, { createContext, useContext } from 'react';

// Shared visual identity only. No login, credentials, sessions or authorization
// are required to navigate this standalone prototype.
const AuthContext = createContext(null);
const visualAdmin = Object.freeze({
  id: 'neir-admin',
  fullName: 'NEIR Admin',
  username: 'neir-admin',
  role: 'Admin',
  email: '',
});
export const AuthProvider = ({children}) => <AuthContext.Provider value={{user:visualAdmin}}>{children}</AuthContext.Provider>;
export const useAuth = () => useContext(AuthContext) ?? {user:visualAdmin};
