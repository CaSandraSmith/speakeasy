import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // For mobile
import { Platform } from "react-native";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  name: string;
  user_id: number;
  exp?: number;
}

interface User {
  email: string;
  name: string;
  user_id: number;
}

interface ContextType {
  user: User | null;
  setUser: (user: User) => void;
  storeToken: (token: string) => Promise<void>;
  getToken: () => Promise<string | null>;
  clearToken: () => Promise<void>;
}

const TOKEN_KEY = "auth_token";
const UserContext = createContext<ContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Helper function to store token
  const storeToken = async (token: string) => {
    if (Platform.OS === "web") {
      sessionStorage.setItem(TOKEN_KEY, token); // Store the token in sessionStorage for web
    } else {
      await AsyncStorage.setItem(TOKEN_KEY, token); // Store the token in AsyncStorage for mobile
    }
  };

  // Helper function to get token
  const getToken = async (): Promise<string | null> => {
    if (Platform.OS === "web") {
      return sessionStorage.getItem(TOKEN_KEY); // Get token from sessionStorage for web
    } else {
      return await AsyncStorage.getItem(TOKEN_KEY); // Get token from AsyncStorage for mobile
    }
  };

  // Helper function to clear token
  const clearToken = async () => {
    if (Platform.OS === "web") {
      sessionStorage.removeItem(TOKEN_KEY); // Remove token from sessionStorage for web
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY); // Remove token from AsyncStorage for mobile
    }
    setUser(null);
  };

  // Check session token on app startup
  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      console.log("this is the token", token);
      if (token) {
        try {
          const decoded = jwtDecode(token) as JwtPayload;
          console.log("this is the decoded", decoded);

          // Token is still valid
          setUser({
            email: decoded.sub,
            name: decoded.name,
            user_id: decoded.user_id,
          });
        } catch (error) {
          console.error("Invalid token:", error);
          await clearToken();
        }
      }
    };

    checkToken();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, storeToken, getToken, clearToken }}
    >
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
