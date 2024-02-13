export interface IDauthUser {
  _id: string;
  ssid: string;
  name: string;
  lastname: string;
  nickname: string;
  email: string;
  is_verified: boolean;
  language: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  last_login: Date;
}

export interface IDauthDomain {
  name: string;
  loginRedirect: string;
  allowedOrigins: string[];
}

export interface IDauthState {
  user: IDauthUser;
  domain: IDauthDomain;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithRedirect: () => void;
  logout: () => void;
  getAccessToken: () => void;
}

const initialDauthState: IDauthState = {
  user: {} as IDauthUser,
  domain: {} as IDauthDomain,
  isLoading: true,
  isAuthenticated: false,
  loginWithRedirect: () => {},
  logout: () => {},
  getAccessToken: () => {},
};

export default initialDauthState;
