import renderSymbol from "./render-symbol.js";
import template from "./number-panel-template.html";

import initSelect from "./number-sidc/init-select.js";

import echelonMobilityTowedarray from "./number-sidc/echelon-mobility-towedarray.js";

export default function(element, standardJSON, standard) {
  var className;
  var mdcSelects = {};

  function _preRenderSymbol(standardJSON, standard, mdcSelects) {
    var sidc =
      "10" +
      mdcSelects[".standard-identity-1"].value +
      mdcSelects[".standard-identity-2"].value +
      mdcSelects[".symbol-set"].value +
      mdcSelects[".status"].value +
      mdcSelects[".headquarters-taskforce-dummy"].value +
      mdcSelects[".echelon-mobility-towedarray"].value +
      mdcSelects[".icon"].value +
      mdcSelects[".icon-modifier-1"].value +
      mdcSelects[".icon-modifier-2"].value;

    var symbolElement = document.querySelector(element + " .svg-symbol");
    symbolElement.setAttribute("sidc", sidc);
    symbolElement.setAttribute("standard", standard);

    document.querySelector(element + " .sidc").textContent = sidc;

    renderSymbol();
  }

  //Set a generic SIDC for all battle dimensions
  var symbolsets = [];
  for (var i in standardJSON) {
    symbolsets.push(i);
    standardJSON[i].code = i;
    standardJSON[i].sidc =
      "1003" + standardJSON[i].symbolset + "00000000000000";
    for (var j in standardJSON[i]["main icon"]) {
      standardJSON[i]["main icon"][j]["symbol set"] = i;
      standardJSON[i]["main icon"][j].sidc =
        "1003" + i + "0000" + standardJSON[i]["main icon"][j]["code"] + "0000";
    }
    for (var j in standardJSON[i]["modifier 1"]) {
      standardJSON[i]["modifier 1"][j].sidc =
        "1003" +
        i +
        "0000" +
        "000000" +
        standardJSON[i]["modifier 1"][j]["code"] +
        "00";
    }
    for (var j in standardJSON[i]["modifier 2"]) {
      standardJSON[i]["modifier 2"][j].sidc =
        "1003" +
        i +
        "0000" +
        "000000" +
        "00" +
        standardJSON[i]["modifier 2"][j]["code"];
    }
  }
  // Make an ordered array of the symbol sets
  symbolsets = symbolsets.sort();
  for (var i = 0; i < symbolsets.length; i++) {
    symbolsets[i] = standardJSON[symbolsets[i]];
  }

  var selectElement, selectItems, mdcSelect;
  var panel = document.querySelector(element);
  //First add the template to the element
  panel.innerHTML = template;

  className = ".standard-identity-1";
  mdcSelects[className] = initSelect(
    panel,
    className,
    [
      { code: 0, name: "Reality" },
      { code: 1, name: "Exercise" },
      { code: 2, name: "Simulation" }
    ],
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".standard-identity-2";
  mdcSelects[className] = initSelect(
    panel,
    className,
    [
      { code: 0, name: "Pending", sidc: "10001000000000000000" },
      { code: 1, name: "Unknown", sidc: "10011000000000000000" },
      { code: 2, name: "Assumed Friend", sidc: "10021000000000000000" },
      { code: 3, name: "Friend", sidc: "10031000000000000000" },
      { code: 4, name: "Neutral", sidc: "10041000000000000000" },
      { code: 5, name: "Suspect/Joker", sidc: "10051000000000000000" },
      { code: 6, name: "Hostile/Faker", sidc: "10061000000000000000" }
    ],
    standard,
    mdcSelects,
    3
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".symbol-set";
  mdcSelects[className] = initSelect(
    panel,
    className,
    symbolsets,
    standard,
    mdcSelects,
    4
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    initSelect(
      panel,
      ".echelon-mobility-towedarray",
      echelonMobilityTowedarray(mdcSelects[".symbol-set"].value),
      standard,
      mdcSelects,
      0
    );
    initSelect(
      panel,
      ".icon",
      standardJSON[mdcSelects[".symbol-set"].value]["main icon"],
      standard,
      mdcSelects
    );
    initSelect(
      panel,
      className,
      standardJSON[mdcSelects[".symbol-set"].value]["modifier 1"],
      standard,
      mdcSelects,
      0
    );
    initSelect(
      panel,
      className,
      standardJSON[mdcSelects[".symbol-set"].value]["modifier 2"],
      standard,
      mdcSelects,
      0
    ).emit("MDCSelect:change");

    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".status";
  mdcSelects[className] = initSelect(
    panel,
    className,
    [
      { code: 0, name: "Present", sidc: "10031000000000000000" },
      {
        code: 1,
        name: "Planned/Anticipated/Suspect",
        sidc: "10031010000000000000"
      },
      { code: 2, name: "Present/Fully capable", sidc: "10031020000000000000" },
      { code: 3, name: "Present/Damaged", sidc: "10031030000000000000" },
      { code: 4, name: "Present/Destroyed", sidc: "10031040000000000000" },
      {
        code: 5,
        name: "Present/Full to capacity",
        sidc: "10031050000000000000"
      }
    ],
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".headquarters-taskforce-dummy";
  mdcSelects[className] = initSelect(
    panel,
    className,
    [
      { code: 0, name: "Unspecified", sidc: "10031000000000000000" },
      { code: 1, name: "Feint/Dummy", sidc: "10031001000000000000" },
      { code: 2, name: "Headquarters", sidc: "10031002000000000000" },
      {
        code: 3,
        name: "Feint/Dummy Headquarters",
        sidc: "10031003000000000000"
      },
      { code: 4, name: "Task Force", sidc: "10031004000000000000" },
      { code: 5, name: "Feint/Dummy Task Force", sidc: "10031005000000000000" },
      {
        code: 6,
        name: "Task Force Headquarters",
        sidc: "10031006000000000000"
      },
      {
        code: 7,
        name: "Feint/Dummy Task Force Headquarters",
        sidc: "10031007000000000000"
      }
    ],
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".echelon-mobility-towedarray";
  mdcSelects[className] = initSelect(
    panel,
    className,
    echelonMobilityTowedarray(mdcSelects[".symbol-set"].value),
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".icon";
  mdcSelects[className] = initSelect(
    panel,
    className,
    standardJSON[mdcSelects[".symbol-set"].value]["main icon"],
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".icon-modifier-1";
  mdcSelects[className] = initSelect(
    panel,
    className,
    standardJSON[mdcSelects[".symbol-set"].value]["modifier 1"],
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".icon-modifier-2";
  mdcSelects[className] = initSelect(
    panel,
    className,
    standardJSON[mdcSelects[".symbol-set"].value]["modifier 2"],
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  // Now emit a change to render first symbol
  mdcSelects[className].emit("MDCSelect:change");

  return panel;
}
