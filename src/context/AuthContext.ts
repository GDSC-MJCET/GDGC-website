import { createContext, type Dispatch, type SetStateAction } from "react"

export interface AuthState {
  loggedIn: boolean;
  token: string;
}

export interface AuthContextValue {
  authState: AuthState;
  setAuthState: Dispatch<SetStateAction<AuthState>>;
}

// Consumers destructure the value without a null check; the provider in App always supplies it.
export const AuthContext = createContext<AuthContextValue>(undefined as unknown as AuthContextValue);
