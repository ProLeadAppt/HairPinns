export const resolveRequestedPort = (argMap) => {
  if (argMap.port == null) return 0;
  const port = Number(argMap.port);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid prerender port: ${argMap.port}`);
  }
  return port;
};

export const getListeningPort = (server) => {
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Prerender preview server has no TCP listening address');
  }
  return address.port;
};
