import {
  getUserAPI,
  refreshAccessTokenAPI,
  sendEmailVerificationAPI,
  updateUserAPI,
} from '../api/dauth.api';
import { getClientBasePath } from '../api/utils/config';
import { DAUTH_STATE } from '../constants';
import { IDauthDomainState, IDauthUser } from '../initialDauthState';
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
      return resetUser(dispatch);
    }
  } catch (error) {
    console.log(error);
    return resetUser(dispatch);
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
  sid: string;
};
export async function setAutoLoginAction({
  dispatch,
  dauth_state_ls,
  domainName,
  sid,
}: TSetAutoLoginAction) {
  dispatch({ type: DauthTypes.SET_IS_LOADING, payload: { isLoading: true } });
  try {
    const refreshAccessTokenFetch = await refreshAccessTokenAPI(
      domainName,
      dauth_state_ls
    );
    if (refreshAccessTokenFetch.response.status === 200) {
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
        localStorage.setItem(
          DAUTH_STATE,
          refreshAccessTokenFetch.data.accessToken
        );
        return;
      } else {
        window.location.replace(
          `${getClientBasePath({ domainName })}/t-sign/${sid}`
        );
        return resetUser(dispatch);
      }
    } else {
      window.location.replace(
        `${getClientBasePath({ domainName })}/t-sign/${sid}`
      );
      return resetUser(dispatch);
    }
  } catch (error) {
    console.log(error);
    return resetUser(dispatch);
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
      console.log('Update user error', getUserFetch.data.message);
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

export async function checkTokenAction({
  dispatch,
  domainName,
  sid,
  token,
}: {
  dispatch: any;
  domainName: string;
  sid: string;
  token: string;
}) {
  try {
    const refreshAccessTokenFetch = await refreshAccessTokenAPI(
      domainName,
      token
    );
    if (refreshAccessTokenFetch.response.status === 200) {
      return;
    } else {
      window.location.replace(
        `${getClientBasePath({ domainName })}/t-sign/${sid}`
      );
      return resetUser(dispatch);
    }
  } catch (error) {
    resetUser(dispatch);
    throw error;
  }
}

export async function getAccessTokenAction({
  dispatch,
  domainName,
}: {
  dispatch: any;
  domainName: string;
}) {
  const token_ls = localStorage.getItem(DAUTH_STATE);
  if (!token_ls) return;
  try {
    const refreshAccessTokenFetch = await refreshAccessTokenAPI(
      domainName,
      token_ls
    );
    if (refreshAccessTokenFetch.response.status === 200) {
      return refreshAccessTokenFetch.data.accessToken ?? token_ls;
    } else {
      resetUser(dispatch);
      return 'token-not-found';
    }
  } catch (error) {
    resetUser(dispatch);
    throw error;
  }
}

///////////////////////////////////////////
//////////////////////////////////////////
export const resetUser = (dispatch: any) => {
  localStorage.removeItem(DAUTH_STATE);
  return dispatch({
    type: DauthTypes.LOGIN,
    payload: {
      user: {} as IDauthUser,
      domain: {} as IDauthDomainState,
      isAuthenticated: false,
    },
  });
};
