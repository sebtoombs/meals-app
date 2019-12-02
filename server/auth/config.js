const passport = require("koa-passport");
const PassportLocalStrategy = require("passport-local");
const authRoutes = require("./authRoutes");

const { query } = require("../../db/dynamodb");

const { getUserById } = query;

const localStrategy = new PassportLocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
    //passReqToCallback: true
  },
  async (username, password, done) => {
    //TODO find user, compare password etc
    const user = {
      //TODO
    };
    return done(null, false);
    return done(null, user);
  }
);

passport.use(localStrategy);
passport.serializeUser((user, done) => done(null, user)); //not sure?
passport.deserializeUser((user, done) => done(null, user));

module.exports = server => {
  server.use(passport.initialize());
  server.use(passport.session());
  server.use(authRoutes);
};
