import { IDauthUser } from '../initialDauthState';
import { getServerBasePath } from './utils/config';

export const getUserAPI = async (
  domainName: string,
  token: string
): Promise<any> => {
  const params = {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(
    `${getServerBasePath({ domainName })}/t-get-user`,
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
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  };
  const response = await fetch(
    `${getServerBasePath({ domainName })}/t-update-user`,
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
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  };
  const response = await fetch(
    `${getServerBasePath({
      domainName,
    })}/t-resend-email-verification`,
    params
  );
  const data = await response.json();
  return { response, data };
};
