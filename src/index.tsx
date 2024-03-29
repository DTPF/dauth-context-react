import React, {
  useReducer,
  useMemo,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import initialDauthState, {
  IDauthState,
  IDauthUser,
} from './initialDauthState';
import userReducer from './reducer/dauth.reducer';
import * as action from './reducer/dauth.actions';
import { getClientBasePath } from './api/utils/config';
import { DAUTH_STATE } from './constants';

interface DauthProviderProps {
  domainName: string;
  sid: string;
  children: React.ReactNode;
}

export const DauthProvider: React.FC<DauthProviderProps> = (
  props: DauthProviderProps
) => {
  const { domainName, sid, children } = props;
  const [ds, dispatch] = useReducer(userReducer, initialDauthState);
  const dauthState = ds as IDauthState;

  // Check token periodically
  useEffect(() => {
    if (!dauthState.isAuthenticated) return;
    let interval = setInterval(() => {
      const token_ls = localStorage.getItem(DAUTH_STATE);
      if (!token_ls) return;
      action.checkTokenAction({ dispatch, domainName, sid, token: token_ls });
    }, 1000 * 60 * 2);
    return () => clearInterval(interval);
  }, []);

  // Catch login redirect
  useEffect(() => {
    const queryString = window.location.search;
    if (!queryString) return;
    const urlParams = new URLSearchParams(queryString);
    const dauth_state = urlParams.get(DAUTH_STATE);
    if (dauth_state && !dauthState.isAuthenticated) {
      action.setDauthStateAction({ dispatch, dauth_state, domainName });
    }
  }, []);

  // Auto Login
  useEffect(() => {
    const dauth_state_ls = localStorage.getItem(DAUTH_STATE);
    if (dauth_state_ls && !dauthState.isAuthenticated) {
      action.setAutoLoginAction({ dispatch, dauth_state_ls, domainName, sid });
    }
  }, []);

  const loginWithRedirect = useCallback(() => {
    return window.location.replace(
      `${getClientBasePath({ domainName })}/t-sign/${sid}`
    );
  }, [domainName, sid]);

  const logout = useCallback(() => {
    return action.setLogoutAction({ dispatch });
  }, []);

  const getAccessToken = useCallback(async () => {
    const token = await action.getAccessTokenAction({ dispatch, domainName });
    return token;
  }, []);

  const updateUser = useCallback(
    ({
      name,
      lastname,
      nickname,
      tel_prefix,
      tel_suffix,
      language,
      avatar,
    }: Partial<IDauthUser>) => {
      const token_ls = localStorage.getItem(DAUTH_STATE);
      const user = {
        name,
        lastname,
        nickname,
        tel_prefix,
        tel_suffix,
        language,
        avatar,
      } as Partial<IDauthUser>;
      return action.setUpdateUserAction({
        dispatch,
        domainName,
        user,
        token: token_ls,
      });
    },
    [domainName]
  );

  const updateUserWithRedirect = useCallback(() => {
    const token_ls = localStorage.getItem(DAUTH_STATE);
    if (!token_ls) return;
    return window.location.replace(
      `${getClientBasePath({ domainName })}/t-update-user/${sid}/${token_ls}`
    );
  }, [domainName, sid]);

  const sendEmailVerification = useCallback(() => {
    const token_ls = localStorage.getItem(DAUTH_STATE);
    if (!token_ls) return;
    return action.sendEmailVerificationAction({
      dispatch,
      domainName,
      token: token_ls,
    });
  }, [domainName]);

  const memoProvider = useMemo(
    () => ({
      ...dauthState,
      loginWithRedirect,
      logout,
      getAccessToken: () => getAccessToken() || '',
      updateUser,
      updateUserWithRedirect,
      sendEmailVerification,
    }),
    [
      dauthState,
      loginWithRedirect,
      logout,
      getAccessToken,
      updateUser,
      updateUserWithRedirect,
      sendEmailVerification,
    ]
  );

  return (
    <DauthContext.Provider value={memoProvider}>
      {children}
    </DauthContext.Provider>
  );
};

const DauthContext = createContext(initialDauthState);

export const useDauth = () => {
  const context = useContext(DauthContext);
  if (!context) {
    throw new Error('useDauth must be used inside DauthProvider');
  }
  return context;
};
