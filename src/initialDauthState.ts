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

export interface IDauthDomainState {
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
  getAccessToken: () => Promise<string>;
  updateUser: ({
    name,
    lastname,
    nickname,
    tel_prefix,
    tel_suffix,
    language,
    avatar,
  }: Partial<IDauthUser>) => Promise<boolean>;
  updateUserWithRedirect: () => void;
  // Send email verification
  sendEmailVerificationStatus: {
    status: IActionStatus;
    isLoading: boolean;
  };
  sendEmailVerification: () => Promise<boolean>;
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
  getAccessToken: () => Promise.resolve(''),
  updateUser: () => Promise.resolve(false),
  updateUserWithRedirect: () => {},
  // Send email verification
  sendEmailVerificationStatus: {
    status: {
      type: 'info',
      message: 'Sending email verification...',
    } as IActionStatus,
    isLoading: false,
  },
  sendEmailVerification: () => Promise.resolve(false),
};

export default initialDauthState;
