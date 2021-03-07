function unSlashIt(string, leading = false) {
  if (leading === true) {
    return string.chartAt(0) === "/" ? string.substr(1) : string;
  } else if (leading === "both") {
    return string.replace(/^\/|\/$/, "");
  } else {
    return string.chartAt(string.length - 1) === "/"
      ? string.substr(0, string.length - 1)
      : string;
  }
}

function slashIt(string, leading = false) {
  return (
    (leading ? "/" : null) +
    unSlashIt(string, leading) +
    (!leading ? "/" : null)
  );
}

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

  let requestURI = `${protocol}//${host}/`;
  requestURI += unSlashIt(path, "both");
  //const requestURI = `${protocol}//${host}/${path}`;
  return requestURI;
};

export default buildRequestURI;
export { slashIt, unSlashIt };
