var http = require('http');
var fs = require('fs');
var qs = require('querystring');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://victor_01:hola123@cluster0.qmwae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  
var output = "out";

client = new MongoClient(url,{ useUnifiedTopology: true });

http.createServer(function (req, res) {
    adr = req.url
    
    if (adr == "/")
    {
      file = 'index.html';
      fs.readFile(file, function(err, txt) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(txt);
      res.end();
      });
    }
    else if (adr.startsWith('/process'))
    {
      file1 = 'index.html';
      fs.readFile(file1, function(err, txt) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(txt);

        pdata = "";
        req.on('data', data => {
             pdata += data.toString();
        });

        res.write("106");
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
            if(err) { console.log("Connection err: " + err); return; }
            
            var dbo = db.db("stockticker");
            var coll = dbo.collection('companies');

            theQuery = "";
            if (pdata['rad'] == 'symbol' && input != "") {
              theQuery = {ticker: input};
            }
            else if (pdata['rad'] == 'name' && input != "") {
              theQuery = {company: input};
            }
            if (theQuery != "") {
              res.write("120");
              coll.find(theQuery).toArray(function(err, items) {
                if (err) {
                  console.log("Error: " + err);
                } 
                else 
                {
                for (i=0; i<items.length; i++)
                  res.write("company name : " + items[i].company + ", ticker symbol : " + items[i].ticker);
                  // output =  output + "\ncompany name : " + items[i].company + ", ticker symbol : " + items[i].ticker; 
                }
                if (items.length == 0) {
                  res.write("No match for input");
                  // output = output + "\nNo match for input";
                }
              });
              res.write("144");
              // console.log(output);
            }
            pdata = qs.parse(pdata);
            global.input = pdata['user_input'];
            // res.write(output);
            if (pdata['rad'] == 'symbol' && input != "") {
              res.write("The symbol is: "+input);
            }
            else if (pdata['rad'] == 'name' && input != "") {
              res.write ("The name is: "+ input);
            }

            db.close();
            res.end();
        });
      });
    
    }
    else 
    {
      res.writeHead(200, {'Content-Type':'text/html'});
      res.write ("Unknown page request");
      res.end();
    }

}).listen(8080);