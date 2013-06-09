// image is from: https://github.com/olivierlacan/shields 

// requires:   apt-get install graphicsmagick
// requires:   apt-get install inkscape

var Inkscape = require('inkscape');
var fs = require('fs');
var exec = require('child_process').exec;

var svg;

var getSvg = function(cb){
  // caches svg contents in a variable
  if (svg){
    return cb(null, svg);
  } else {
    fs.readFile(__dirname + '/shield.svg', function (err, data) {
      svg = data.toString();
      return cb(err, svg);
    });
  }
};

var shield = function(vendorText, vendorWidth, statusText, statusWidth, color, cb){
  getSvg(function (err, svg) {
    if (!!err){
      return cb(err);
    }
    svg = interpolate(svg, {
                            'width' : 77 + 50, //vendorWidth + statusWidth + 4,
                            'vendorWidth': vendorWidth,
                            'vendorColor': 'gray',
                            'vendorText': vendorText,
                            'statusPathX' : 83,
                            'statusWidth': statusWidth + vendorWidth - 10,
                            'statusColor': color,
                            'statusTextX' : vendorWidth + 4,
                            'statusText': statusText});
    var filename = new Buffer([vendorText, 
                                vendorWidth, 
                                statusText, 
                                statusWidth, 
                                color].join("|")).toString('base64');
    var svgFile = '/tmp/' + filename + '.svg';
    fs.writeFile(svgFile, svg, function (err) {
      if (err) {
        return cb(err);
      }
      var command = 'inkscape --export-png=/tmp/' + filename + '.png -z -f=' + svgFile;
      command += ' --export-background="rgb(0%,0%,0%)" --export-background-opacity="0"';
      exec(command,function(err,stdout,stderr){
        console.log("err: ", err);
        console.log("stderr: ", stderr);
        console.log("stdout: ", stdout);
        cb(null, fs.createReadStream('/tmp/' + filename + '.png'));
      });
    });

  });

};

var interpolate = function(instr, vars){
  for(var x in vars){
    instr = instr.split('{{' + x + '}}').join(vars[x]);
  }
  return instr;
};

module.exports = shield;
