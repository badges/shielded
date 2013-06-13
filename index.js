var svg2png = require('./lib/svg2png');

svg2png("./lib/shield.svg", "asdf.png", 2, function (err) {
  // PNGs for everyone!
  if (err){
    console.log("Error:");
    console.log(err);
    process.exit(1);
  }
});

