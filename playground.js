const records = [
  "इमाद",
  "मरियम",
  "ज़ैद",
  "फातिमा",
  "शमीम",
  "सोहेल",
  "जॉन",
  "मुकेश",
  "रजा",
  "गणेश",
  "बहादुर",
  "रमेश",
];

const help = [];

records.forEach((record) => {
  help.push([record]);
});

const createCsvWriter = require("csv-writer").createArrayCsvWriter;
const csvWriter = createCsvWriter({
  header: ["NAME"],
  path: "xls/sample-name.csv",
});


csvWriter
  .writeRecords(help) // returns a promise
  .then(() => {
    console.log("...Done");
  });
