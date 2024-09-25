import { createContext, ReactNode, useEffect, useState } from "react";
import { getUserByCookie } from "../api/user";

export const UserContext = createContext({});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState(null);
  const fetchUser = async () => {
    const res = await getUserByCookie();
    console.log(res, "contect re");
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
