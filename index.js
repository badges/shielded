var shield = require('./lib/shield');

var vendorText = "vendorText";
var statusText = "statusText";
var color = "color";
var filename = "asdf.png";
var scale = 1;

shield(vendorText, statusText, color, filename, scale, function(err){
  if (err){
    console.log("Error:");
    console.log(err);
    process.exit(1);
  }
});

/*
svg2png("./lib/shield.svg", "asdf.png", 1, function (err) {
  // PNGs for everyone!
});
*/

