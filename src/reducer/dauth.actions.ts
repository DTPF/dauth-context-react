import {
  getUserAPI,
  sendEmailVerificationAPI,
  updateUserAPI,
} from '../api/dauth.api';
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
      user: {
        language: window.document.documentElement.getAttribute('lang') || 'es',
      },
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
  token: string | null;
};
export async function setUpdateUserAction({
  dispatch,
  domainName,
  user,
  token,
}: TSetUpdateAction) {
  if (user.language) {
    window.document.documentElement.setAttribute('lang', user.language);
  }
  if (!token) {
    return dispatch({
      type: DauthTypes.UPDATE_USER,
      payload: user,
    });
  }
  try {
    const getUserFetch = await updateUserAPI(domainName, user, token);
    if (getUserFetch.response.status === 200) {
      return dispatch({
        type: DauthTypes.UPDATE_USER,
        payload: getUserFetch.data.user,
      });
    } else {
      console.log('Update user error');
      return;
    }
  } catch (error) {
    console.log('Update user error', error);
  }
}

type TSetSendEmailVerificationAction = {
  dispatch: any;
  domainName: string;
  token: string;
};
export async function sendEmailVerificationAction({
  dispatch,
  domainName,
  token,
}: TSetSendEmailVerificationAction) {
  dispatch({
    type: DauthTypes.SET_SEND_EMAIL_VERIFICATION_IS_LOADING,
    payload: true,
  });
  dispatch({
    type: DauthTypes.SET_SEND_EMAIL_VERIFICATION_STATUS,
    payload: { type: 'info', message: 'Sending email verification...' },
  });
  try {
    const sendEmailFetch = await sendEmailVerificationAPI(domainName, token);
    if (sendEmailFetch.response.status === 200) {
      dispatch({
        type: DauthTypes.SET_SEND_EMAIL_VERIFICATION_STATUS,
        payload: { type: 'success', message: sendEmailFetch.data.message },
      });
      return dispatch({
        type: DauthTypes.SET_SEND_EMAIL_VERIFICATION_IS_LOADING,
        payload: false,
      });
    } else {
      dispatch({
        type: DauthTypes.SET_SEND_EMAIL_VERIFICATION_STATUS,
        payload: { type: 'error', message: sendEmailFetch.data.message },
      });
      return dispatch({
        type: DauthTypes.SET_SEND_EMAIL_VERIFICATION_IS_LOADING,
        payload: false,
      });
    }
  } catch (error) {
    dispatch({
      type: DauthTypes.SET_SEND_EMAIL_VERIFICATION_STATUS,
      payload: {
        type: 'error',
        message: 'Send email verification fetch error',
      },
    });
    return dispatch({
      type: DauthTypes.SET_SEND_EMAIL_VERIFICATION_IS_LOADING,
      payload: false,
    });
  }
}
