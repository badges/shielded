// image is from: https://github.com/olivierlacan/shields 
var svg2png = require('./svg2png');

var shield = function(vendorText, statusText, color, filename, scale, cb){
  svg2png("./lib/shield.svg", "asdf.png", 1, function (err) {
    cb(err);
  });
};

module.exports = shield;
