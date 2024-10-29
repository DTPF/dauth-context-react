import { IDauthUser } from '../initialDauthState';
import { routes } from '../routes';
import { getServerBasePath } from './utils/config';

export const getUserAPI = async (
  domainName: string,
  token: string
): Promise<any> => {
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
): Promise<any> => {
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
): Promise<any> => {
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
): Promise<any> => {
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
