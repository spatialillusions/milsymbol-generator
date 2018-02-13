import ms from "../../milsymbol/dist/milsymbol.js";

export default function(standard, sidc) {
  var options = {};
  document
    .querySelectorAll(".option-inputs .mdc-text-field .mdc-text-field__input")
    .forEach(function(elm) {
      if (elm.value) {
        options[elm.getAttribute("id")] = elm.value;
      }
    });

  document.querySelectorAll(".symbol").forEach(function(elm) {
    if (elm.hasAttribute("sidc") && elm.hasAttribute("standard")) {
      var style = {
        size: 100,
        standard:
          elm.getAttribute("standard").indexOf("2525") != -1 ? "2525" : "APP6"
      };

      elm.innerHTML = new ms.Symbol(elm.getAttribute("sidc"), style, options, {
        symetric: true
      }).asSVG();
    }
  });
}
