const translate = require("translate");
const csvtojson = require("csvtojson");
const port = process.env.PORT || 3000;
const express = require("express");
const upload = require("express-fileupload");
const app = express();

app.use(express.json());
app.use(upload());
translate.engine = "google";
translate.key = "AIzaSyAMy2otabTI7DJCCfdWHF9e_xy6Fua7mVU";

app.put("/", (req, res) => {
  if (req.files) {
    res.send(req.files);
  }
  // translate(req.body.transliterateTerm, { from: "eng", to: "hin" }).then((text) => {
  //   res.send(text);
  // });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
