export interface IDauthUser {
  _id: string;
  dauthLicense?: string;
  sid: string;
  name: string;
  lastname: string;
  nickname: string;
  email: string;
  is_verified: boolean;
  language: string;
  avatar: string;
  role: string;
  tel_prefix: string;
  tel_suffix: string;
  createdAt: Date;
  updatedAt: Date;
  last_login: Date;
}

interface IDauthDomainState {
  name: string;
  loginRedirect: string;
  allowedOrigins: string[];
}

export interface IDauthState {
  user: IDauthUser;
  domain: IDauthDomainState;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithRedirect: () => void;
  logout: () => void;
  getAccessToken: () => string;
}

const initialDauthState: IDauthState = {
  user: {} as IDauthUser,
  domain: {} as IDauthDomainState,
  isLoading: false,
  isAuthenticated: false,
  loginWithRedirect: () => {},
  logout: () => {},
  getAccessToken: () => initialDauthState.getAccessToken() || '',
};

export default initialDauthState;
