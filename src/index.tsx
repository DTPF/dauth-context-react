import React, {
  useReducer,
  useMemo,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import initialDauthState, { IDauthState } from './initialDauthState';
import userReducer from './reducer/dauth.reducer';
import * as action from './reducer/dauth.actions';
import { getClientBasePath } from './api/utils/config';
import { DAUTH_STATE } from './constants';

interface DauthProviderProps {
  domainName: string;
  sid: string;
  ssid: string;
  children: React.ReactNode;
}

export const DauthProvider: React.FC<DauthProviderProps> = (
  props: DauthProviderProps
) => {
  const { domainName, sid, ssid, children } = props;
  const [ds, dispatch] = useReducer(userReducer, initialDauthState);
  const dauthState = ds as IDauthState;

  // Catch login redirect
  useEffect(() => {
    const queryString = window.location.search;
    if (!queryString) return;
    const urlParams = new URLSearchParams(queryString);
    const dauth_state = urlParams.get(DAUTH_STATE);
    if (dauth_state && !dauthState.isAuthenticated) {
      action.setDauthStateAction({ dispatch, dauth_state, domainName, ssid });
    }
  }, [dauthState.isAuthenticated, domainName, ssid]);

  // Auto Login
  useEffect(() => {
    const dauth_state_ls = localStorage.getItem(DAUTH_STATE);
    if (dauth_state_ls && !dauthState.isAuthenticated) {
      action.setAutoLoginAction({ dispatch, dauth_state_ls, domainName, ssid });
    }
  }, [dauthState.isAuthenticated, domainName, ssid]);

  const loginWithRedirect = useCallback(() => {
    return window.location.replace(
      `${getClientBasePath({ domainName })}/t-sign/${sid}`
    );
  }, [domainName, sid]);

  const logout = useCallback(() => {
    return action.setLogoutAction({ dispatch });
  }, []);

  const memoProvider = useMemo(
    () => ({
      ...dauthState,
      loginWithRedirect,
      logout,
    }),
    [dauthState, loginWithRedirect, logout]
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
    throw new Error(
      'useMyContext debe ser utilizado dentro de un MyContextProvider'
    );
  }
  return context;
};
