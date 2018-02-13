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
    if (elm) style[id] = elm.textContent.replace(/\n\s*/g, "");
  });
  document.querySelectorAll(".symbol").forEach(function(elm) {
    if (elm.hasAttribute("sidc") && elm.hasAttribute("standard")) {
      style.standard =
        elm.getAttribute("standard").indexOf("2525") != -1 ? "2525" : "APP6";

      elm.innerHTML = new ms.Symbol(elm.getAttribute("sidc"), options, style, {
        symetric: true
      }).asSVG();
    }
  });
}
