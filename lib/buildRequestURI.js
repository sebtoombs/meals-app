const buildRequestURI = (path, req) => {
  let protocol = req
    ? req.headers["x-forwarded-proto"]
      ? `${req.headers["x-forwarded-proto"]}:`
      : `http:`
    : location.protocol;

  const host = req
    ? req.headers["x-forwarded-host"]
      ? req.headers["x-forwarded-host"]
      : req.headers["host"]
    : location.host;

  const requestURI = `${protocol}//${host}/api/${path}`;
  return requestURI;
};

export default buildRequestURI;
