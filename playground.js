const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: './xls/sample-name.csv',
    header: [
        {id: 'name', title: 'NAME'},
    ]
});
 
const records = [
    ``
];
 
csvWriter.writeRecords(records)      
    .then(() => {
        console.log('...Done');
    });
 