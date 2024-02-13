import { getServerBasePath } from './utils/config';

export const getTenantUserAPI = async (
  domainName: string,
  ssid: string,
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
    `${getServerBasePath({ domainName })}/get-tenant-user/${ssid}`,
    params
  );
  const data = await response.json();
  return { response, data };
};
