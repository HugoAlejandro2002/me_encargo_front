import { createContext, ReactNode, useEffect, useState } from "react";
import { getUserByCookie } from "../api/user";
interface UserContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}
export const UserContext = createContext<UserContextType | null>(null);

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState(null);
  const fetchUser = async () => {
    try {
      const userData = await getUserByCookie();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
