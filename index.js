const upload = require("express-fileupload");
const port = process.env.PORT || 3000;
const express = require("express");
const translate = require("translate");
const cors = require("cors");
const csvtojson = require("csvtojson");
const fs = require("fs");
const db = require("crud-db");
const app = express();

let elemArray = [];
let hindiElemArray = [];
let hindiElemArrayFix;

app.use(upload());
app.use(express.json());
app.set("view engine", "ejs");
app.use("/static", express.static(__dirname + "/xls"));
app.use(cors());

db.initialize();

translate.engine = "google";
translate.key = "AIzaSyAMy2otabTI7DJCCfdWHF9e_xy6Fua7mVU";

app.get("/", (req, res) => {
  res.render("index", { link: "none" });
});

app.post("/", async (req, res) => {
  try {
    const file = req.files.file;
    const filename = file.name;
    let dbno = db.get("num");
    db.add("num", dbno + 1);

    file.mv("./xls/" + dbno + "-" + filename, (err) => {
      console.log(err);
    });

    csvtojson()
      .fromFile("./xls/" + dbno + "-" + filename)
      .then(async (text) => {
        elemArray = text;
        elemArray.forEach((element) => {
          translate(element.Name, { from: "Eng", to: "hin" }).then(
            async (text) => {
              hindiElemArray.push(text);
              hindiElemArrayFix = hindiElemArray;
              const help = [];
              try {
                hindiElemArrayFix.forEach(async (record) => {
                  help.push(record);
                  // await createFile(dbno, filename, help, res);
                  console.log(help);
                  fs.writeFileSync('xls/' + dbno + '-' + filename, JSON.stringify(help).replace(/[\[\]']+/g,''), 'utf-8');
                  // fs.writeFileSync('xls/' + dbno + '-' + filename, JSON.stringify(record) + '\n', 'utf-8');
                  // const ObjectsToCsv = require("objects-to-csv");
                  // const csv = new ObjectsToCsv(help);
                  // await csv.toDisk("./xls/" + dbno + "-" + filename);
                  // console.log(await csv.toString());
                });
                res.render("index", {
                  link: `/static/${dbno + "-" + filename}`,
                });
              } catch (err) {
                console.log(err);
              }
            }
          );
        });
      });
  } catch (err) {
    console.log(err);
  }
});

async function createFile(dbno, filename, help, res) {
  const createCsvWriter = require("csv-writer").createArrayCsvWriter;
  const csvWriter = createCsvWriter({
    header: ["Name"],
    path: `xls/${dbno + "-" + filename}`,
  });

  try {
    csvWriter
      .writeRecords(help)
      .then(() => {
        res.render("index", { link: `/static/${dbno + "-" + filename}` });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
}

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
