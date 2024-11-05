import { routes } from './utils/routes';
import { getServerBasePath } from './utils/config';
import { IDauthUser } from '../interfaces';
import {
  IgetUserAPIResponse,
  IrefreshAccessTokenAPIResponse,
  IsendEmailVerificationAPIResponse,
  IupdateUserAPIResponse,
  IverifyTokenAPIResponse,
} from './interfaces/dauth.api.responses';

export const getUserAPI = async (
  domainName: string,
  token: string
): Promise<IgetUserAPIResponse> => {
  const params = {
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(
    `${getServerBasePath({ domainName })}/${
      routes.tenantGetUser
    }/${domainName}`,
    params
  );
  const data = await response.json();
  return { response, data };
};

export const updateUserAPI = async (
  domainName: string,
  user: Partial<IDauthUser>,
  token: string
): Promise<IupdateUserAPIResponse> => {
  const params = {
    method: 'PATCH',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  };
  const response = await fetch(
    `${getServerBasePath({ domainName })}/${
      routes.tenantUpdateUser
    }/${domainName}`,
    params
  );
  const data = await response.json();
  return { response, data };
};

export const sendEmailVerificationAPI = async (
  domainName: string,
  token: string
): Promise<IsendEmailVerificationAPIResponse> => {
  const params = {
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(
    `${getServerBasePath({ domainName })}/${
      routes.tenantResendEmailVerification
    }/${domainName}`,
    params
  );
  const data = await response.json();
  return { response, data };
};

export const refreshAccessTokenAPI = async (
  domainName: string,
  token: string
): Promise<IrefreshAccessTokenAPIResponse> => {
  const params = {
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(
    `${getServerBasePath({ domainName })}/${
      routes.tenantRefreshAccessToken
    }/${domainName}`,
    params
  );
  const data = await response.json();
  return { response, data };
};

export const verifyTokenAPI = async ({
  domainName,
  tsk,
  token,
}: {
  domainName: string;
  tsk: string;
  token: string;
}): Promise<IverifyTokenAPIResponse> => {
  const params = {
    method: 'POST',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tsk }),
  };
  const response = await fetch(
    `${getServerBasePath({ domainName })}/${
      routes.tenantVerifyToken
    }/${domainName}`,
    params
  );
  const data = await response.json();
  return { response, data };
};
