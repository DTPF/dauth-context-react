import React, {
  useReducer,
  useMemo,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import initialDauthState, { IDauthUser } from './initialDauthState';
import userReducer from './reducer/dauth.reducer';
import * as action from './reducer/dauth.actions';
import { getClientBasePath } from './api/utils/config';
import { TOKEN_LS } from './constants';
import { routes } from './routes';

interface DauthProviderProps {
  domainName: string;
  sid: string;
  children: React.ReactNode;
}

export const DauthProvider: React.FC<DauthProviderProps> = (
  props: DauthProviderProps
) => {
  const { domainName, sid, children } = props;
  const [dauthState, dispatch] = useReducer(userReducer, initialDauthState);

  // Check token periodically
  useEffect(() => {
    if (!dauthState.isAuthenticated) return;
    let interval = setInterval(() => {
      const token_ls = localStorage.getItem(TOKEN_LS);
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
    const token_url = urlParams.get(TOKEN_LS);
    if (token_url && !dauthState.isAuthenticated) {
      action.setDauthStateAction({ dispatch, token: token_url, domainName });
    }
  }, []);

  // Auto Login
  useEffect(() => {
    const dauth_state_ls = localStorage.getItem(TOKEN_LS);
    if (dauth_state_ls && !dauthState.isAuthenticated) {
      action.setAutoLoginAction({ dispatch, dauth_state_ls, domainName, sid });
    }
  }, []);

  const loginWithRedirect = useCallback(() => {
    return window.location.replace(
      `${getClientBasePath({ domainName })}/${routes.tenantSignin}/${sid}`
    );
  }, [domainName, sid]);

  const logout = useCallback(() => {
    return action.setLogoutAction({ dispatch });
  }, []);

  const getAccessToken = useCallback(async () => {
    const token = await action.getAccessTokenAction({ dispatch, domainName });
    return token as string;
  }, []);

  const updateUser = useCallback(
    async ({
      name,
      lastname,
      nickname,
      tel_prefix,
      tel_suffix,
      language,
      avatar,
    }: Partial<IDauthUser>) => {
      const token_ls = localStorage.getItem(TOKEN_LS);
      const user = {
        name,
        lastname,
        nickname,
        tel_prefix,
        tel_suffix,
        language,
        avatar,
      } as Partial<IDauthUser>;
      return (await action.setUpdateUserAction({
        dispatch,
        domainName,
        user,
        token: token_ls,
      })) as boolean;
    },
    [domainName]
  );

  const updateUserWithRedirect = useCallback(() => {
    const token_ls = localStorage.getItem(TOKEN_LS);
    if (!token_ls) return;
    return window.location.replace(
      `${getClientBasePath({ domainName })}/${
        routes.tenantUpdateUser
      }/${sid}/${token_ls}`
    );
  }, [domainName, sid]);

  const sendEmailVerification = useCallback(async () => {
    const token_ls = localStorage.getItem(TOKEN_LS);
    if (!token_ls) return false;
    return (await action.sendEmailVerificationAction({
      dispatch,
      domainName,
      token: token_ls,
    })) as boolean;
  }, [domainName]);

  const memoProvider = useMemo(
    () => ({
      ...dauthState,
      loginWithRedirect,
      logout,
      getAccessToken,
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
