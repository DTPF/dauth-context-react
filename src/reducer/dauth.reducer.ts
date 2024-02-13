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

    default:
      return state;
  }
}
