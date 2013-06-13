var webpage = require("webpage");
var fs = require("fs");

var logged = false;
var log = function(str){
  if (!logged){
    fs.writeFileSync(_dirname + '/log.txt', str);
    logged = true;
  } else {
    fs.appendFileSync(_dirname + '/log.txt', str);
  }
};

if (phantom.args.length !== 3) {
    console.error("Usage: converter.js source dest scale");
    phantom.exit();
} else {
    convert(phantom.args[0], phantom.args[1], Number(phantom.args[2]));
}

function convert(source, dest, scale) {
    var page = webpage.create();
    page.onConsoleMessage = function(){
      console.log(arguments[0]);
    };

    var dimensions;

    page.open(source, function (status) {
        if (status !== "success") {
            console.error("Unable to load the source file.");
            phantom.exit();
            return;
        }


        var doc = 'unset';
        page.evaluate(function(){
          var el = function(id){
            return document.documentElement.getElementById(id);
          };
          var setVendorText = function(text){
            el("vendorText3").firstChild.textContent = text;
            el("vendorText2").firstChild.textContent = text;
            el("vendorText1").firstChild.textContent = text;
          };
          var setStatusText = function(text){
            var doc = document.documentElement;
            el("statusText3").firstChild.textContent = text;
            el("statusText2").firstChild.textContent = text;
            el("statusText1").firstChild.textContent = text;
          };
          var setStatusTextX = function(x){
            var doc = document.documentElement;
            el("statusText3").setAttribute("x", x);
            el("statusText2").setAttribute("x", x);
            el("statusText1").setAttribute("x", x);
          };
          var setColor = function(color){
            if (['green', 'yellow', 
                  'yellowgreen', 'red', 
                  'lightgray' ].indexOf(color) === -1){
              throw "invalid background color: " + color;
            }
            el("statusBackground").setAttribute("fill", "url(#" + color + ")");
          };
          // vendor part
          setVendorText("percpercperc");
          // resize Vendor Background
          var vendorBackground = el("vendorBackground");
          var vendorTextBox = el("vendorText").getBBox();
          var vendorWidth = vendorTextBox.width + (2 * vendorTextBox.x);
          vendorBackground.setAttribute("d", "M32,19.25H3c-1.657,0-3-1.343-3-3v-12c0-1.657,1.343-3,3-3h" + vendorWidth + "V19.25z");

          // status part
          setStatusText("10%");
          setStatusTextX(vendorWidth + 4);
          var statusTextBox = el("statusText").getBBox();
          var statusWidth = statusTextBox.width + (4 * 2) + 32;// (vendorWidth / 2);  // 32?  magic?
          console.log("vendorWidth: ", vendorWidth);
          console.log("statusWidth: ", statusWidth);


          var statusBg =  el("statusBackground");
          var statusX = vendorWidth + 0;
          var curveVal = -1.343;
          var draw = "M" + 
                      statusWidth +
                      " 19.25 h 42 c 1.657 0 3 " + 
                      curveVal + " 3 -3 v -12 c 0 -1.657 " +
                      curveVal + " -3 -3 -3 H " +
                      statusX + "V 19.25 z";
          console.log(draw);
          statusBg.setAttribute("d", draw);

          setColor("yellow");

          var totalWidth = vendorWidth + statusWidth;
          document.documentElement.setAttribute("viewBox", "0 1.25 " + totalWidth + " 18");
          document.documentElement.setAttribute("width", totalWidth);
          /*
document.documentElement.viewBox.baseVal
SVGRect {height: 18, width: 500, y: 1.25, x: 0}
document.documentElement.setAttribute("width", 500);
document.documentElement.width;
*/

          // TODO make svg fit status text
          // TODO make png as small as the svg

          /*
          // resize png based on svg dimensions
          var doc = document.documentElement;
          var bbox = doc.getBBox();
          console.log(bbox);

          var width = parseFloat(doc.getAttribute("width"));
          var height = parseFloat(doc.getAttribute("height"));
          */
        });

        // This delay is I guess necessary for the resizing to happen?
        setTimeout(function () {
            page.render(dest);
            phantom.exit();
        }, 0);
    });
}

function getSvgDimensions(page) {
  console.log("in getSvgDimensions");
    return page.evaluate(function () {
        /*global document: false*/
        console.log("got here");

        var el = document.documentElement;
        var bbox = el.getBBox();
        console.log(bbox);

        var width = parseFloat(el.getAttribute("width"));
        var height = parseFloat(el.getAttribute("height"));
        var viewBoxWidth = el.viewBox.animVal.width;
        var viewBoxHeight = el.viewBox.animVal.height;
        var usesViewBox = viewBoxWidth && viewBoxHeight;

        if (usesViewBox) {
            if (width && !height) {
                height = width * viewBoxHeight / viewBoxWidth;
            }
            if (height && !width) {
                width = height * viewBoxWidth / viewBoxHeight;
            }
            if (!width && !height) {
                width = viewBoxWidth;
                height = viewBoxHeight;
            }
        }

        if (!width) {
            width = bbox.width + bbox.x;
        }
        if (!height) {
            height = bbox.height + bbox.y;
        }

        return { width: width, height: height, usesViewBox: usesViewBox };
    });
}
