const upload = require("multer")();

module.exports = (req, res) => {
  upload.single("file")(req, res, err => {
    console.log(req.file);
    res.json({ message: "ok" });
  });
};
