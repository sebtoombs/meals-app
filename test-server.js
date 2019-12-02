const Koa = require("koa");
const next = require("next");
const Router = require("koa-router");
const koaBody = require("koa-body");
const logger = require("koa-logger");
const cors = require("@koa/cors");
const formidable = require("formidable");

const port = parseInt(process.env.PORT, 10) || 3100;
const dev = process.env.NODE_ENV !== "production";

const upload = require("multer")();

//TODO
// https://github.com/zeit/next.js/blob/master/examples/ssr-caching/server.js

const server = new Koa();
const router = new Router();

server.use(logger());

server.use(cors());

server.use(koaBody({ multipart: true }));

router.post(
  "/api/image",
  koaBody({
    formidable: {
      keepExtensions: true, // keep file extension on upload
      multiples: false
    },
    multipart: true,
    urlencoded: true,
    formLimit: "25mb"
  }),
  (ctx, next) => {
    ctx.body = "Success";
  }
);
/*router.get("/a", async ctx => {
    await app.render(ctx.req, ctx.res, "/a", ctx.query);
    ctx.respond = false;
  });

  router.get("/b", async ctx => {
    await app.render(ctx.req, ctx.res, "/b", ctx.query);
    ctx.respond = false;
  });*/

server.use(async (ctx, next) => {
  ctx.res.statusCode = 200;
  await next();
});

server.use(router.routes());
server.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});
