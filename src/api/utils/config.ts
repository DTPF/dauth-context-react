const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  window.location.hostname === "[::1]" ||
  window.location.hostname.match(
    /(192)\.(168)\.(1)\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm
  ) ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);
export const apiVersion = "v1";
export const serverDomain = "dauth.ovh";

export function getServerBasePath({ domainName }: { domainName: string }) {
  const serverPort = 4012;
  const serverLocalUrl = `${window.location.protocol}//${window.location.hostname}:${serverPort}/api/${apiVersion}`
  const serverProdUrl = `https://${domainName}.${serverDomain}/api/${apiVersion}`
  const serverBasePath = isLocalhost ? serverLocalUrl : serverProdUrl;
  return serverBasePath;
}

export function getClientBasePath({ domainName }: { domainName: string }) {
  const clientPort = 5185;
  const clientLocalUrl = `${window.location.protocol}//${window.location.hostname}:${clientPort}`
  const clientProdUrl = `https://${domainName}.${serverDomain}`
  const clientBasePath = isLocalhost ? clientLocalUrl : clientProdUrl;
  return clientBasePath;
}