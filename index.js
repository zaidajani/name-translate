const upload = require("express-fileupload");
const port = process.env.PORT || 3000;
const express = require("express");
const translate = require("translate");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cors = require("cors");
const csvtojson = require("csvtojson");
const { json } = require("express");
const app = express();

let elemArray = [];
let hindiElemArray = [];
let hindiElemArrayFix;

app.use(upload());
app.use(express.json());
app.set("view engine", "ejs");
app.use(cors());

translate.engine = "google";
translate.key = "AIzaSyAMy2otabTI7DJCCfdWHF9e_xy6Fua7mVU";

app.get("/", (req, res) => {
  res.render('index');
});

app.post("/", async (req, res) => {
  try {
    const file = req.files.file;
    const filename = file.name;

    file.mv("./xls/" + filename, (err) => {});

    csvtojson()
      .fromFile('./xls/' + filename)
      .then(text => {
        elemArray = text;
        console.log(elemArray);
        elemArray.forEach(element => {
          translate(element.Name, { from: 'Eng', to: 'hin' }).then((text) => {
            hindiElemArray.push(text);
            hindiElemArrayFix = hindiElemArray;
            console.log(hindiElemArrayFix);
          });
        });
      });
  } catch (err) {
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
