import { getUserAPI, updateUserAPI } from '../api/dauth.api';
import { DAUTH_STATE } from '../constants';
import { IDauthUser } from '../initialDauthState';
import * as DauthTypes from './dauth.types';

type TSetDauthStateAction = {
  dispatch: any;
  dauth_state: string;
  domainName: string;
};
export async function setDauthStateAction({
  dispatch,
  dauth_state,
  domainName,
}: TSetDauthStateAction) {
  dispatch({ type: DauthTypes.SET_IS_LOADING, payload: { isLoading: true } });
  try {
    const getUserFetch = await getUserAPI(domainName, dauth_state);
    if (getUserFetch.response.status === 200) {
      dispatch({
        type: DauthTypes.LOGIN,
        payload: {
          user: getUserFetch.data.user,
          domain: getUserFetch.data.domain,
          isAuthenticated: true,
        },
      });
      window.history.replaceState(
        {},
        document.title,
        getUserFetch.data.domain.loginRedirect
      );
      return localStorage.setItem(DAUTH_STATE, dauth_state);
    } else {
      return localStorage.removeItem(DAUTH_STATE);
    }
  } catch (error) {
    localStorage.removeItem(DAUTH_STATE);
    console.log(error);
  } finally {
    dispatch({
      type: DauthTypes.SET_IS_LOADING,
      payload: { isLoading: false },
    });
  }
}

type TSetAutoLoginAction = {
  dispatch: any;
  dauth_state_ls: string;
  domainName: string;
};
export async function setAutoLoginAction({
  dispatch,
  dauth_state_ls,
  domainName,
}: TSetAutoLoginAction) {
  dispatch({ type: DauthTypes.SET_IS_LOADING, payload: { isLoading: true } });
  try {
    const getUserFetch = await getUserAPI(domainName, dauth_state_ls);
    if (getUserFetch.response.status === 200) {
      dispatch({
        type: DauthTypes.LOGIN,
        payload: {
          user: getUserFetch.data.user,
          domain: getUserFetch.data.domain,
          isAuthenticated: true,
        },
      });
      localStorage.setItem(DAUTH_STATE, dauth_state_ls);
    } else {
      localStorage.removeItem(DAUTH_STATE);
    }
  } catch (error) {
    localStorage.removeItem(DAUTH_STATE);
    console.log(error);
  } finally {
    dispatch({
      type: DauthTypes.SET_IS_LOADING,
      payload: { isLoading: false },
    });
  }
}

export async function setLogoutAction({ dispatch }: { dispatch: any }) {
  dispatch({ type: DauthTypes.SET_IS_LOADING, payload: { isLoading: true } });
  dispatch({
    type: DauthTypes.LOGIN,
    payload: {
      user: {},
      domain: {},
      isAuthenticated: false,
    },
  });
  localStorage.removeItem(DAUTH_STATE);
  return dispatch({
    type: DauthTypes.SET_IS_LOADING,
    payload: { isLoading: false },
  });
}

type TSetUpdateAction = {
  dispatch: any;
  domainName: string;
  user: Partial<IDauthUser>;
  token: string;
};
export async function setUpdateUserAction({
  dispatch,
  domainName,
  user,
  token,
}: TSetUpdateAction) {
  dispatch({ type: DauthTypes.SET_IS_LOADING, payload: { isLoading: true } });
  try {
    const getUserFetch = await updateUserAPI(domainName, user, token);
    if (getUserFetch.response.status === 200) {
      return dispatch({
        type: DauthTypes.UPDATE_USER,
        payload: user,
      });
    } else {
      console.log('Update user error');
      return;
    }
  } catch (error) {
    console.log('Update user error', error);
  } finally {
    dispatch({
      type: DauthTypes.SET_IS_LOADING,
      payload: { isLoading: false },
    });
  }
}
