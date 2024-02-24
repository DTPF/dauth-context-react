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
  avatar: {
    id: string;
    url: string;
  };
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
  updateUser: ({
    name,
    lastname,
    nickname,
    tel_prefix,
    tel_suffix,
    language,
    avatar,
  }: Partial<IDauthUser>) => void;
  updateUserWithRedirect: () => void;
  // Send email verification
  sev: {
    status: IActionStatus;
    isLoading: boolean;
  };
  sendEmailVerification: () => void;
}

export interface IActionStatus {
  type: TStatusTypes;
  message: string;
}
export type TStatusTypes = 'success' | 'error' | 'info' | 'warning';

const initialDauthState: IDauthState = {
  user: {
    language: window.document.documentElement.getAttribute('lang') || 'es',
  } as IDauthUser,
  domain: {} as IDauthDomainState,
  isLoading: false,
  isAuthenticated: false,
  loginWithRedirect: () => {},
  logout: () => {},
  getAccessToken: () => initialDauthState.getAccessToken() || '',
  updateUser: () => {},
  updateUserWithRedirect: () => {},
  // Send email verification
  sev: {
    status: {
      type: 'info',
      message: 'Sending email verification...',
    } as IActionStatus,
    isLoading: false,
  },
  sendEmailVerification: () => {},
};

export default initialDauthState;
