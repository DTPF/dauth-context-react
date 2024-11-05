import React, {
  useReducer,
  useMemo,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import initialDauthState from './initialDauthState';
import userReducer from './reducer/dauth.reducer';
import * as action from './reducer/dauth.actions';
import { getClientBasePath } from './api/utils/config';
import { TOKEN_LS } from './constants';
import { routes } from './api/utils/routes';
import { verifyTokenAPI } from './api/dauth.api';
import { IDauthUser } from './interfaces';

interface DauthProviderProps {
  domainName: string;
  tsk: string;
  children: React.ReactNode;
}

export const DauthProvider: React.FC<DauthProviderProps> = (
  props: DauthProviderProps
) => {
  const { domainName, tsk, children } = props;
  const [dauthState, dispatch] = useReducer(userReducer, initialDauthState);

  const isValidTsk = useCallback(
    async (token: string) => {
      const verifyToken = await verifyTokenAPI({
        domainName,
        token,
        tsk,
      });
      if (verifyToken.response.status !== 200) {
        return false;
      }
      return true;
    },
    [domainName, tsk]
  );

  // Check token periodically
  useEffect(() => {
    if (!dauthState.isAuthenticated) return;
    let interval = setInterval(async () => {
      const token_ls = localStorage.getItem(TOKEN_LS);
      if (!token_ls) return;
      const isValid = await isValidTsk(token_ls);
      if (isValid) {
        return action.checkTokenAction({
          dispatch,
          domainName,
          token: token_ls,
        });
      } else {
        action.setLogoutAction({ dispatch });
        throw new Error('Ask value in DauthProvider is not valid');
      }
    }, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [dauthState.isAuthenticated, isValidTsk]);

  // Catch login redirect
  useEffect(() => {
    (async () => {
      const queryString = window.location.search;
      if (!queryString) return;
      const urlParams = new URLSearchParams(queryString);
      const token_url = urlParams.get(TOKEN_LS);
      if (token_url && !dauthState.isAuthenticated) {
        const isValid = await isValidTsk(token_url);
        if (isValid) {
          return action.setDauthStateAction({
            dispatch,
            token: token_url,
            domainName,
          });
        } else {
          action.setLogoutAction({ dispatch });
          throw new Error('Ask value in DauthProvider is not valid');
        }
      }
    })();
  }, []);

  // Auto Login
  useEffect(() => {
    (async () => {
      const token_ls = localStorage.getItem(TOKEN_LS);
      if (token_ls && !dauthState.isAuthenticated) {
        const isValid = await isValidTsk(token_ls);
        if (isValid) {
          return action.setAutoLoginAction({
            dispatch,
            token_ls,
            domainName,
          });
        } else {
          action.setLogoutAction({ dispatch });
          throw new Error('Ask value in DauthProvider is not valid');
        }
      }
    })();
  }, []);

  const loginWithRedirect = useCallback(() => {
    return window.location.replace(
      `${getClientBasePath({ domainName })}/${
        routes.tenantSignin
      }/${domainName}`
    );
  }, [domainName, domainName]);

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
      telPrefix,
      telSuffix,
      language,
      avatar,
    }: Partial<IDauthUser>) => {
      const token_ls = localStorage.getItem(TOKEN_LS);
      const user = {
        name,
        lastname,
        nickname,
        telPrefix,
        telSuffix,
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
      }/${domainName}/${token_ls}`
    );
  }, [domainName, domainName]);

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
