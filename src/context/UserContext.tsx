import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserProfile = {
  id: string;
  name: string;
  pan: string;
  image: string;
  title: string;
};

export const USERS: Record<string, UserProfile> = {
  deepak: {
    id: 'deepak',
    name: 'Deepak Kumar',
    pan: 'DEEPA1234K',
    image: '/me.png',
    title: 'B.Tech · Standard Repayment'
  },
  sumit: {
    id: 'sumit',
    name: 'Sumit Yadav',
    pan: 'SUMIT1234Y',
    image: '/sumit.jpeg',
    title: 'M.Tech · Aggressive Repayment'
  },
  kashish: {
    id: 'kashish',
    name: 'Kashish Jaiswal',
    pan: 'KASHI1234J',
    image: '/kashish.jpeg',
    title: 'B.Des · Wealth Builder'
  },
  tarun: {
    id: 'tarun',
    name: 'Tarun Singh',
    pan: 'TARUN1234S',
    image: '/tarun.png',
    title: 'MBA · Debt Optimizer'
  }
};

interface UserContextType {
  activeUser: UserProfile;
  setActiveUserId: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [activeUserId, setActiveUserId] = useState<string>('deepak');

  useEffect(() => {
    const savedId = localStorage.getItem('activeUserId');
    if (savedId && USERS[savedId]) {
      setActiveUserId(savedId);
    }
  }, []);

  const handleSetUser = (id: string) => {
    if (USERS[id]) {
      setActiveUserId(id);
      localStorage.setItem('activeUserId', id);
      
      // When user changes, we could potentially reload their specific CIBIL from backend/mock
      // For now, let's keep it clean
    }
  };

  return (
    <UserContext.Provider value={{
      activeUser: USERS[activeUserId],
      setActiveUserId: handleSetUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
