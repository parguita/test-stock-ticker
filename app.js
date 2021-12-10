const PORT = process.env.PORT || 3000;
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var urlObj = require('url');
const MongoClient = require('mongodb').MongoClient;
const url = "";
  
var output = "out";

client = new MongoClient(url,{ useUnifiedTopology: true });

http.createServer(function (req, res) {
    adr = req.url

    qobj  = urlObj.parse(req.url, true).query;
    console.dir(qobj);

    adrArr = adr.split('?');
    console.log(req.url)
    console.dir(adrArr);
    if (adrArr[0] == "/")
    {
      file = 'index.html';
      fs.readFile(file, function(err, txt) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(txt);
      res.end();
      });
    }
    else if (adrArr[0] == "/results"){
        file = 'index.html'
        fs.readFile(file, function(err, txt) {
            res.write(txt);
        });

        theQuery = {[qobj.type_search]: qobj.search }
        var results = '';

        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if(err) { console.log("Connection err: " + err); return; }
          
            var dbo = db.db("companies");
            var coll = dbo.collection('companies');
            
            coll.find(theQuery).toArray(function(err, items) {
                if (err) {
                  console.log("Error: " + err);
                } 
                else 
                {
                    results += "<table>";
                  items.map(function(item){
                      results += "<tr>";
                      results += "<td><b>Company:</b></td>";
                      results += `<td>${item.company}</td>`;
                      results += "<td><b>Ticker:</b></td>";
                      results += `<td>${item.ticker}</td>`;
                      results += "</tr>";
                  });	 		 
                  results += "<table>";
                  res.write("<h2> Results: </h2>" + results);
                  res.end();
                }   
                db.close();
              });  //end find	
        });
    }
    else 
    {
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write ("Unknown page request");
      res.end();
    }
    // res.end();

}).listen(PORT);