import ms from "../../milsymbol/dist/milsymbol.js";

//Make sure symbol are centered
ms.addSymbolPart(function squareIcon() {
  var gbbox = new ms.BBox();
  if (this.options.symetric) {
    var anchor = { x: 100, y: 100 };
    var maxx = Math.max(anchor.x - this.bbox.x1, this.bbox.x2 - anchor.x);
    gbbox.x1 = anchor.x - maxx;
    gbbox.x2 = anchor.x + maxx;
  }
  //Post is set to an array of an empty array, because otherwise milsymbol will ignore the boundingbox
  return { pre: [], post: [[]], bbox: gbbox };
});

export default function(standard, sidc) {
  var options = {};
  document
    .querySelectorAll(".option-inputs .mdc-text-field .mdc-text-field__input")
    .forEach(function(elm) {
      if (elm.value) {
        options[elm.getAttribute("id")] = elm.value;
      }
    });
  var style = {};
  document
    .querySelectorAll(".style-inputs .mdc-switch input")
    .forEach(function(elm) {
      style[elm.getAttribute("id")] = elm.checked;
    });
  document.querySelectorAll(".style-inputs .mdc-slider").forEach(function(elm) {
    style[elm.getAttribute("id")] = elm.getAttribute("aria-valuenow");
  });
  document.querySelectorAll(".style-inputs .mdc-select").forEach(function(elm) {
    var id = elm.getAttribute("id");
    elm = elm.querySelector("li[aria-selected]");
    if (elm) {
      if (elm.hasAttribute("id")) {
        style[id] = elm.getAttribute("id");
      } else {
        style[id] = elm.textContent.replace(/\n\s*/g, "");
      }
    }
  });
  document.querySelectorAll(".symbol").forEach(function(elm) {
    var sym = elm.querySelector(".svg-symbol");
    if (sym.hasAttribute("sidc") && sym.hasAttribute("standard")) {
      style.standard =
        sym.getAttribute("standard").indexOf("2525") != -1 ? "2525" : "APP6";

      var ua = window.navigator.userAgent;
      var isIE =
        ua.indexOf("MSIE ") > 0 ||
        ua.indexOf("Trident/") > 0 ||
        ua.indexOf("Edge/") > 0
          ? true
          : false;

      var symbol = new ms.Symbol(sym.getAttribute("sidc"), options, style, {
        symetric: true
      });

      if (isIE) {
        sym.innerHTML = symbol.asSVG();
      } else {
        // The image won't keep max-height and max-width correctly, need to look into this...
        sym.innerHTML =
          '<img src="' +
          symbol.asCanvas(window.devicePixelRatio).toDataURL() +
          '" width="' +
          symbol.getSize().width +
          '" height="' +
          symbol.getSize().height +
          '">';
      }

      var downloadSymbol = new ms.Symbol(
        sym.getAttribute("sidc"),
        options,
        style,
        {
          symetric: false
        }
      );

      elm.querySelector("a").href = downloadSymbol.asCanvas().toDataURL();
      var fileName = [];
      if (options.uniqueDesignation) fileName.push(options.uniqueDesignation);
      fileName.push(sym.getAttribute("sidc"));
      elm.querySelector("a").download = fileName.join(" ") + ".png";
      if (isIE) elm.querySelector("a").style = "display:none;";
    }
  });
}
