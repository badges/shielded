var shield = require('./lib/shield');
var fs = require('fs');

var vendorWidth = 30;
var vendorText = 'vendor';
var statusWidth = 25;  // TODO this number is strange.  why so small?
var statusText = 'value';
statusText = statusText.slice(0, -2) + ' ' + statusText.slice(-2);
shield(vendorText, vendorWidth, statusText, statusWidth, 'green',
               function(err, stdout, stderr){
                  if (err) { 
                    throw err; 
                  }
                  if (stdout){
                    stdout.pipe(fs.createWriteStream("./asdf.png"));
                  }
                  if (stderr){
                    stderr.pipe(process.stderr);
                  }

                });


