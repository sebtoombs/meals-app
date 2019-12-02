const Koa = require("koa");
const next = require("next");
const Router = require("koa-router");
const koaBody = require("koa-body");
const logger = require("koa-logger");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

//const fs = require("fs");
//const os = require("os");
//const path = require("path");

//const upload = require("multer")();
const uuidv1 = require("uuid/v1");
const { create, query } = require("../db/dynamodb");
const to = require("../utils/to");
const cloudinary = require("cloudinary");

//TODO
// https://github.com/zeit/next.js/blob/master/examples/ssr-caching/server.js

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.use(logger());
  server.use(koaBody({ multipart: true }));

  require("./session/config")(server);
  require("./auth/config")(server);

  router.use("/api", require("./auth/restrictAccess"));

  router.get("/api/calendar", require("./api/calendar/fetch"));

  router.post("/api/calendar/add", require("./api/calendar/add"));

  router.post("/api/meals", require("./api/meals/create"));

  router.get("/api/meals", async ctx => {
    const meals = await query.getMeals();
    ctx.body = meals;
  });

  router.post("/api/image", async ctx => {
    const file = ctx.request.files.file;
    const { pk } = ctx.request.body;
    //const reader = fs.createReadStream(file.path);

    /*size: 248544,
    path: '/var/folders/wp/s0p1cx_d5tqbwpg8kc1kqm140000gn/T/upload_62d8e0f7a2259340bf54ef8b50839887',
    name: 'chicken-katsu.jpg',
    type: 'image/jpeg',
    hash: null,
    lastModifiedDate: 2019-11-28T05:36:41.051Z,*/

    /*const uploadResponse = await cloudinary.v2.uploader.upload_stream(file, {
        resource_type: "image",
        //public_id: "my_folder/my_sub_folder/my_dog",
        overwrite: false
        //notification_url: "https://mysite.example.com/notify_endpoint"
      });*/

    /*const upload_stream = cloudinary.v2.uploader.upload_stream(
      { tags: "basic_sample" },
      function(err, image) {
        console.log("here");
        console.log("** Stream Upload");
        //if (err){ console.warn(err);}
        console.log("* Same image, uploaded via stream");
        console.log("* " + image.public_id);
        console.log("* " + image.url);
      }
    );

    reader.pipe(upload_stream);*/

    const [uploadErr, uploadResult] = await to(
      cloudinary.v2.uploader.upload(file.path, {
        folder: "meals",
        tags: ["meal_image"]
      })
    );

    if (uploadErr) {
      ctx.status = 500;
      ctx.body = uploadErr;
      return;
    }

    const imageId = uuidv1();
    const [createErr, createResult] = await to(
      create({
        ...uploadResult,
        pk,
        sk: "Image:" + imageId
      })
    );

    if (createErr) {
      ctx.status = 500;
      ctx.body = createErr;
      return;
    }

    console.log({ ...uploadResult, pk });
    ctx.body = {};
  });

  /*router.get("/a", async ctx => {
    await app.render(ctx.req, ctx.res, "/a", ctx.query);
    ctx.respond = false;
  });

  router.get("/b", async ctx => {
    await app.render(ctx.req, ctx.res, "/b", ctx.query);
    ctx.respond = false;
  });*/

  router.all("*", async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
