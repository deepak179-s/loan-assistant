import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

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
  creditProfile: any | null;
  profileLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [activeUserId, setActiveUserId] = useState<string>('deepak');
  const [creditProfile, setCreditProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const savedId = localStorage.getItem('activeUserId');
    if (savedId && USERS[savedId]) {
      setActiveUserId(savedId);
    }
  }, []);

  useEffect(() => {
    setProfileLoading(true);
    setCreditProfile(null);
    
    // Subscribe to active user's credit profile
    const unsub = onSnapshot(doc(db, 'credit_profiles', activeUserId), (docSnap) => {
      if (docSnap.exists()) {
        setCreditProfile(docSnap.data());
      } else {
        setCreditProfile(null);
      }
      setProfileLoading(false);
    }, (error) => {
      console.error("Error fetching credit profile:", error);
      setProfileLoading(false);
    });

    return () => unsub();
  }, [activeUserId]);

  const handleSetUser = (id: string) => {
    if (USERS[id]) {
      setActiveUserId(id);
      localStorage.setItem('activeUserId', id);
    }
  };

  return (
    <UserContext.Provider value={{
      activeUser: USERS[activeUserId],
      setActiveUserId: handleSetUser,
      creditProfile,
      profileLoading
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
