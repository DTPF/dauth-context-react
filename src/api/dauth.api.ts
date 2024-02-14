import { getServerBasePath } from './utils/config';

export const getTenantUserAPI = async (
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
    `${getServerBasePath({ domainName })}/get-tenant-user/${domainName}`,
    params
  );
  const data = await response.json();
  return { response, data };
};
