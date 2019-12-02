const session = require("koa-session");

module.exports = server => {
  server.keys = [process.env.SESSION_KEY];

  const CONFIG = {
    key: "meals:sess",
    maxAge: "session"
  };

  server.use(session(CONFIG, server));
};
