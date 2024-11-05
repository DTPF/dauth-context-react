export interface IDauthUser {
  _id: string;
  name: string;
  lastname: string;
  nickname: string;
  email: string;
  isVerified: boolean;
  language: string;
  avatar: {
    id: string;
    url: string;
  };
  role: string;
  telPrefix: string;
  telSuffix: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
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
    telPrefix,
    telSuffix,
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