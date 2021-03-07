const passport = require("koa-passport");
const PassportLocalStrategy = require("passport-local");
const authRoutes = require("./authRoutes");
const to = require("../../utils/to");
const argon2 = require("argon2");

const { query } = require("../../db/dynamodb");

const { getUserById } = query;

const localStrategy = new PassportLocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
    //passReqToCallback: true
  },
  async (username, password, done) => {
    //console.log("Looking for user: ", username, password);
    const [findUserErr, findUser] = await to(getUserById(username));
    //An error finding user
    if (findUserErr) {
      console.log(findUserErr);
      return done(findUserErr);
    }

    //console.log("Get User: ", findUser);

    //No user matched
    if (!findUser) {
      return done(null, false);
    }

    const user = findUser;

    //console.log("Matched user", user);

    //Verify password
    if (!user.password || !password) return done(new Error("password missing"));
    const [verifyPwErr, verify] = await to(
      argon2.verify(user.password, password)
    );

    if (verifyPwErr) {
      console.log(verifyPwErr);
      return done(verifyPwErr);
    }

    //Password didn't match
    if (!verify) {
      return done(null, false);
    }

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
