// image is from: https://github.com/olivierlacan/shields 
var svg2png = require('./svg2png');
var fs = require('fs');
var logger = require('log-driver').logger;

var getUniqueId = function(vendorText, statusText, color, scale){
  return new Buffer(JSON.stringify({vendor:vendorText,
                                    status:statusText,
                                    color:color,
                                    scale:scale}))
                .toString('base64');
};

var shield = function(options, cb){
  if (!options.vendorText || !options.statusText){
    return cb("missing required field.");
  }
  if (options.loglevel || options.loglevel === false){
    logger = require('log-driver').logger = require('log-driver')({level : options.loglevel });
  }
  var vendorText = options.vendorText;
  var statusText = options.statusText;
  var color = options.color || 'lightgray';
  var scale = options.scale || 1;
  var tempdir = options.tempdir || '/tmp';
  var filename = options.filename || getUniqueId(vendorText, 
                                                 statusText, 
                                                 color, 
                                                 scale) + '.png';
  if (['green', 'yellow',
        'yellowgreen', 'red',
        'lightgray' ].indexOf(color) === -1){
    return cb("invalid background color: " + color);
  }
   
  fs.readFile(__dirname + "/shield.svg", function(err, contents){
    if (err){ 
      return cb(err);
    }
    contents = contents.toString();
    var svgFileName = tempdir + '/' + getUniqueId(vendorText, statusText, color, 1) + '.svg';
        // scale value is irrelevant for svg, so just set it to a constant 1
    logger.debug("contents: ", contents);
    logger.debug("svg file: ", svgFileName);
    var svgFileStream = fs.createWriteStream(svgFileName);
    contents.split('||').forEach(function(piece){
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
    svg2png(svgFileName, filename, scale, function (err) {
      cb(err);
    });
  });
};

module.exports = shield;
