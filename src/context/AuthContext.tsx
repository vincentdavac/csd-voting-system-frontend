import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import CryptoJS from 'crypto-js';
import { AuthUser } from '../types/user';
import API_BASE_URL from '../config/api';

interface AuthContextType {
  authUser: AuthUser | null;
  login: (data: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ENCRYPTION_KEY =
  import.meta.env.VITE_TOKEN_SECRET || 'my_super_secret_key';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedRoleEncrypted = localStorage.getItem('authRole'); // encrypted

    if (!storedToken || !storedRoleEncrypted) return;

    try {
      // Decrypt token
      const bytesToken = CryptoJS.AES.decrypt(storedToken, ENCRYPTION_KEY);
      const token = bytesToken.toString(CryptoJS.enc.Utf8);

      if (!token) throw new Error('Invalid token');

      // Decrypt role
      const bytesRole = CryptoJS.AES.decrypt(
        storedRoleEncrypted,
        ENCRYPTION_KEY,
      );

      const role = bytesRole.toString(CryptoJS.enc.Utf8) as 'admin' | 'client';

      if (!role || (role !== 'admin' && role !== 'client'))
        throw new Error('Invalid role');

      const fetchUser = async () => {
        try {
          const endpoint = role === 'admin' ? '/users/me' : '/clients/me';

          const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) throw new Error('User not found');

          const data = await res.json();

          setAuthUser({
            role,
            token,
            user:
              role === 'admin'
                ? { id: data.data.user.id, ...data.data.user.attributes }
                : { id: data.data.client.id, ...data.data.client.attributes },
          });
        } catch {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authRole');
          setAuthUser(null);
        }
      };

      fetchUser();
    } catch {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authRole');
      setAuthUser(null);
    }
  }, []);

  const login = (data: AuthUser) => {
    const encryptedToken = CryptoJS.AES.encrypt(
      data.token,
      ENCRYPTION_KEY,
    ).toString();
    const encryptedRole = CryptoJS.AES.encrypt(
      data.role,
      ENCRYPTION_KEY,
    ).toString();

    localStorage.setItem('authToken', encryptedToken);
    localStorage.setItem('authRole', encryptedRole);
    setAuthUser(data);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRole');
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
