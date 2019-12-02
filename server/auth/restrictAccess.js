module.exports = (ctx, next) => {
  if (!ctx.isAuthenticated()) {
    ctx.status = 401;
    //ctx.redirect("/login");
    return;
  }
  next();
};
