import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  user: string | null;
  login: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIsLoggedIn().finally(() => setLoading(false));
  }, []);

  const checkIsLoggedIn = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
      return;
    }

    try {
      const response = await fetch("/api/auth/isLoggedIn");
      const data = await response.json();
      if (data.isLoggedIn) {
        setUser(data.user.email);
        localStorage.setItem("user", data.user.email);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const login = (email: string, token: string) => {
    localStorage.setItem("user", email);
    setUser(email);
  };

  const logout = () => {
    try {
      fetch("/api/auth/logout");
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
