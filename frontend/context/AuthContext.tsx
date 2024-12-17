// AuthContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

type authContextType = {
  account: {
    id: string;
    role: string;
    name: string;
    gender: number;
  };
  login: (id: string, role: string, name: string, gender: number) => void;
  logout: () => void;
  updateAccount: (updatedFields: Partial<{ name: string; gender: number; }>) => void; // 添加更新账户的方法
};

const authContextDefaultValues: authContextType = {
  account: {
    id: "",
    role: "",
    name: "",
    gender: 0,
  },
  login: (id: string, role: string, name: string, gender: number) => {},
  logout: () => {},
  updateAccount: () => {}, // 默认为空函数
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [account, setAccount] = useState({ id: "", role: "", name: "", gender: 0 });

  const login = (id: string, role: string, name: string, gender: number) => {
    setAccount({ id, role, name, gender });
  };

  const logout = () => {
    setAccount({ id: "", role: "", name: "", gender: 0 });
  };

  // 更新账户信息的方法
  const updateAccount = (updatedFields: Partial<{ name: string; gender: number }>) => {
    setAccount((prevAccount) => ({
      ...prevAccount,
      ...updatedFields, // 合并新的字段值
    }));
  };

  const value = {
    account,
    login,
    logout,
    updateAccount, // 提供更新账户的方法
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
