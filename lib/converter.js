var webpage = require("webpage");
var fs = require("fs");

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
        var dimensions = page.evaluate(function(){
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
          setVendorText("shawty");
          // resize Vendor Background
          var vendorBackground = el("vendorBackground");
          var vendorTextBox = el("vendorText").getBBox();
          var vendorWidth = vendorTextBox.width + (2 * vendorTextBox.x);
          vendorBackground.setAttribute("d", 
                              "M32,19.25H3c-1.657,0-3-1.343-3-3v-12c0-1.657,1.343-3,3-3h" + 
                              vendorWidth + 
                              "V19.25z");

          // status part
          setStatusText("reallyreallyreallyloooooong");
          setStatusTextX(vendorWidth + 4);
          var statusTextBox = el("statusText").getBBox();
          var statusWidth = statusTextBox.width + (4 * 2);

          var statusBg =  el("statusBackground");
          var statusX = vendorWidth + 0;
          var statusBgBox = statusBg.getBBox();
          var curveVals1 = [1.657, 0, 3, -1.343, 3, -3];
          var curveVals2 = [0, -1.657, -1.343, -3, -3, -3];
          var draw = "M" + (statusX) + " 19.25" +
                      " H " + (statusX + statusWidth - 3) +   //subtract 3 to leave room for curve
                      " c " + 
                      curveVals1.join(" ") + 
                      " v -12 " + 
                      "c " + 
                      curveVals2.join(" ") + 
                      " H " + statusX + "V 19.25 z";
          statusBg.setAttribute("d", draw);

          setColor("yellowgreen");

          var totalWidth = vendorWidth + statusWidth;
          document.documentElement.setAttribute("viewBox", "0 1.25 " + totalWidth + " 18");
          document.documentElement.setAttribute("width", totalWidth);

          // TODO make png as small as the svg

          // resize png based on svg dimensions
          var doc = document.documentElement;
          var bbox = doc.getBBox();
          //console.log(JSON.stringify(bbox));
          //
          //
          //
          return {width : bbox.width, height : bbox.height, usesViewBox : false};

        });
        page.viewportSize = {
            width: Math.round(dimensions.width * scale),
            height: Math.round(dimensions.height * scale)
        };
        if (!dimensions.usesViewBox) {
            page.zoomFactor = scale;
        }

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
