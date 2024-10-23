import { createContext } from "react";
import { AuthContextProps } from "./AuthProvider";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;
