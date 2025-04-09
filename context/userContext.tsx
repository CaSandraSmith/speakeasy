import React, { createContext, ReactNode, useContext, useState } from "react";

interface User {
  email: string;
  password: string;
}

interface ContextType {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<ContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};
