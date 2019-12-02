const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

router.post("/auth/login", passport.authenticate("local", {}), function(ctx) {
  ctx.body = { message: "test1" };
});

module.exports = router.routes();
