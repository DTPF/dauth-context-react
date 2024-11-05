import { IDauthState } from '../interfaces';
import * as DauthTypes from './dauth.types';

export default function userReducer(state: IDauthState, action: any) {
  const { type, payload } = action;

  switch (type) {
    case DauthTypes.LOGIN: {
      const login: IDauthState = {
        ...state,
        user: payload.user,
        domain: payload.domain,
        isAuthenticated: payload.isAuthenticated,
      };
      return login;
    }

    case DauthTypes.SET_IS_LOADING: {
      const isLoading: IDauthState = {
        ...state,
        isLoading: payload.isLoading,
      };
      return isLoading;
    }

    case DauthTypes.UPDATE_USER: {
      const updateUser: IDauthState = {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
      };
      return updateUser;
    }

    case DauthTypes.SET_SEND_EMAIL_VERIFICATION_STATUS: {
      const setSendEmailVerificationStatus: IDauthState = {
        ...state,
        sendEmailVerificationStatus: {
          ...state.sendEmailVerificationStatus,
          status: {
            type: payload.type,
            message: payload.message,
          },
        },
      };
      return setSendEmailVerificationStatus;
    }

    case DauthTypes.SET_SEND_EMAIL_VERIFICATION_IS_LOADING: {
      const setSendEmailVerificationIsLoading: IDauthState = {
        ...state,
        sendEmailVerificationStatus: {
          ...state.sendEmailVerificationStatus,
          isLoading: payload,
        },
      };
      return setSendEmailVerificationIsLoading;
    }

    default:
      return state;
  }
}
