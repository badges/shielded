// image is from: https://github.com/olivierlacan/shields 
var svg2png = require('./svg2png');
var fs = require('fs');

var getUniqueId = function(vendorText, statusText, color){
  return new Buffer(JSON.stringify({vendor:vendorText,status:statusText,color:color}))
                .toString('base64');
};

var shield = function(vendorText, statusText, color, filename, scale, cb){
  if (['green', 'yellow',
        'yellowgreen', 'red',
        'lightgray' ].indexOf(color) === -1){
    return cb("invalid background color: " + color);
  }
   
  fs.readFile("./lib/shield.svg", function(err, contents){
    if (err){ 
      return cb(err);
    }
    var svgFileName = '/tmp/' + getUniqueId(vendorText, statusText, color) + '.svg';
    console.log("svg file: ", svgFileName);
    var svgFileStream = fs.createWriteStream(svgFileName);
    contents.toString().split('||').forEach(function(piece){
      switch(piece){
        case 'vendor' : 
          piece = vendorText;
        break;
        case 'status' : 
          piece = statusText;
        break;
        case 'color' : 
          piece = color;
        break;
      }
      svgFileStream.write(piece);
    });
    svgFileStream.end();
    svg2png(svgFileName, "asdf.png", scale, function (err) {
      cb(err);
    });
  });
};

module.exports = shield;
