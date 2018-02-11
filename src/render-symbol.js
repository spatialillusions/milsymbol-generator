import ms from "../../milsymbol/dist/milsymbol.js";

export default function(standard, sidc) {
  // here we shuold grab all other options that we need to add to the symbol
  document.querySelector(
    ".panel-" + standard + " .symbol"
  ).innerHTML = new ms.Symbol(sidc, {
    size: 100,
    standard: standard.indexOf("2525") != -1 ? "2525" : "APP6"
  }).asSVG();
}
