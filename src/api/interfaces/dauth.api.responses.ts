import { IDauthDomainState, IDauthUser } from '../../interfaces';

export interface IgetUserAPIResponse {
  response: Response;
  data: {
    status: string;
    user: IDauthUser;
    domain: IDauthDomainState;
  };
}

export interface IupdateUserAPIResponse {
  response: Response;
  data: {
    status: string;
    user: IDauthUser;
    message: string;
  };
}

export interface IsendEmailVerificationAPIResponse {
  response: Response;
  data: {
    status: string;
    message: string;
    emailStatus: string;
  };
}

export interface IrefreshAccessTokenAPIResponse {
  response: Response;
  data: {
    accessToken: string;
  };
}

export interface IverifyTokenAPIResponse {
  response: Response;
  data: {
    status: string;
    message: string;
  };
}
