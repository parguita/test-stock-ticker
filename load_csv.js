var http = require('http');
var fs = require('fs');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://victor_01:hola123@cluster0.qmwae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const file = 'companies.csv'

async function readFile() {
    var readStream = fs.createReadStream(file, 'utf8');

    let companies = []
    readStream.on('data', function (line) {
        console.log(line);
        let company = line.toString().split('\r\n') + '';
        if (company != '') {
            let arrCompany = company.split(',');

            console.log(arrCompany);
            companies.push([arrCompany[0], arrCompany[1]]);
        }
    });

    readStream.on('end', function () {
        console.log(companies);
        readStream.close();
        return companies;
    })
    
}

async function main() {
    let companies = []
    fs.readFile('companies.csv', function(err, txt) {
        let rawText = txt.toString();
        console.log(rawText);
        let firstSplit = rawText.split('\r\n');
        console.log(firstSplit);
        let companies = firstSplit.map(function(line){return line.split(',')});
        console.log(companies);

        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
            if (err) { return console.log(err); }
            console.log(companies);
    
            var dbo = db.db("companies");
            var collection = dbo.collection('companies');
    
            
            companies.map(function (company) {
                if(company[0] == '') return;
                if(company[0] == 'Company') return;
                var newData = { "company": company[0], "ticker": company[1] };
                collection.insertOne(newData, function (err, res) {
                    if (err) { console.log("query err: " + err); return; }
                    console.log("new document inserted");
                });
            })
    
    
            console.log("Success!");
    
        });
      });

    
    
}

main();


