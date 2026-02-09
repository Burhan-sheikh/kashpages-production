// Authentication Types

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  photoURL: string;
  bio: string;
  role: 'user' | 'admin';
  createdAt: Date;
  isVerified: boolean;
  isBlocked: boolean;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
  username: string;
  phone?: string;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
