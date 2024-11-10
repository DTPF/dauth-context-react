import { IActionStatus, IDauthDomainState, IDauthState, IDauthUser } from "./interfaces";

const initialDauthState: IDauthState = {
  user: {
    language: window.document.documentElement.getAttribute('lang') || 'es',
  } as IDauthUser,
  domain: {} as IDauthDomainState,
  isLoading: true,
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
