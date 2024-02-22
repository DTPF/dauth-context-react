import * as DauthTypes from './dauth.types';

export default function userReducer(state: any, action: any) {
  const { type, payload } = action;

  switch (type) {
    case DauthTypes.LOGIN:
      return {
        ...state,
        user: payload.user,
        domain: payload.domain,
        isAuthenticated: payload.isAuthenticated,
      };

    case DauthTypes.SET_IS_LOADING:
      return {
        ...state,
        isLoading: payload.isLoading,
      };

    case DauthTypes.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
      };

    case DauthTypes.SET_SEND_EMAIL_VERIFICATION_STATUS:
      return {
        ...state,
        sev: {
          ...state.sev,
          status: {
            type: payload.type,
            message: payload.message,
          },
        },
      };

    case DauthTypes.SET_SEND_EMAIL_VERIFICATION_IS_LOADING:
      return {
        ...state,
        sev: {
          ...state.sev,
          isLoading: payload,
        },
      };

    default:
      return state;
  }
}
