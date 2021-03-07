const upload = require("express-fileupload");
const port = process.env.PORT || 3000;
const express = require("express");
const translate = require("translate");
const cors = require("cors");
const csvtojson = require("csvtojson");
const app = express();

let elemArray = [];
let hindiElemArray = [];
let hindiElemArrayFix;

app.use(upload());
app.use(express.json());
app.set("view engine", "ejs");
app.use("/static", express.static(__dirname + "/xls"));
app.use(cors());

translate.engine = "google";
translate.key = "AIzaSyAMy2otabTI7DJCCfdWHF9e_xy6Fua7mVU";

app.get("/", (req, res) => {
  res.render("index", { link: "none" });
});

app.post("/", async (req, res) => {
  try {
    const file = req.files.file;
    const filename = file.name;

    file.mv("./xls/" + filename, (err) => {});

    csvtojson()
      .fromFile("./xls/" + filename)
      .then((text) => {
        elemArray = text;
        elemArray.forEach((element) => {
          translate(element.Name, { from: "Eng", to: "hin" }).then((text) => {
            hindiElemArray.push(text);
            hindiElemArrayFix = hindiElemArray;
            const help = [];

            try {
              hindiElemArrayFix.forEach((record) => {
                help.push([record]);
              });

              const createCsvWriter = require("csv-writer")
                .createArrayCsvWriter;
              const csvWriter = createCsvWriter({
                header: ["NAME"],
                path: `xls/${filename}`,
              });

              try {
                csvWriter
                  .writeRecords(help)
                  .then(() => {
                    res.render("index", { link: `/static/${filename}` });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } catch (err) {
                console.log(err);
              }
            } catch (err) {
              console.log(err);
            }
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
