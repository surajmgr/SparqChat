import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    user: string | null;
    login: (username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);

    // Check if user is already logged in on mount
    useEffect(() => {
        const localUser = localStorage.getItem('user');
        if (localUser) {
            setUser(localUser);
        }
    }, []);

    const login = (username: string) => {
        setUser(username);
        // Save user to local storage
        localStorage.setItem('user', username);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user'); // clear user from local storage when logging out
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
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
