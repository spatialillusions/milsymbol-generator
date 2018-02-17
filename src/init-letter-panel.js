import renderSymbol from "./render-symbol.js";
import template from "./letter-panel-template.html";

import initSelect from "./letter-sidc/init-select.js";
import modifier1 from "./letter-sidc/modifier1.js";
import modifier2 from "./letter-sidc/modifier2.js";

export default function(element, standardJSON, standard) {
  var className;
  var mdcSelects = {};

  function _preRenderSymbol(standardJSON, standard, mdcSelects) {
    var options =
      standardJSON[mdcSelects[".coding-scheme"].value][
        mdcSelects[".battle-dimension"].value
      ]["main icon"][mdcSelects[".function-id"].selectedIndex];
    var sidc =
      options["code scheme"] +
      mdcSelects[".affiliation"].value +
      options["battle dimension"] +
      mdcSelects[".status"].value +
      options["code"] +
      mdcSelects[".symbol-modifier-1"].value +
      mdcSelects[".symbol-modifier-2"].value;

    var symbolElement = document.querySelector(element + " .svg-symbol");
    symbolElement.setAttribute("sidc", sidc);
    symbolElement.setAttribute("standard", standard);

    document.querySelector(element + " .sidc").textContent = sidc;

    renderSymbol();
  }

  //Set a generic SIDC for all battle dimensions
  for (var i in standardJSON) {
    for (var j in standardJSON[i]) {
      if (typeof standardJSON[i][j] == "object") {
        var firstSymbol = standardJSON[i][j]["main icon"][0];
        standardJSON[i][j].sidc =
          firstSymbol["code scheme"] +
          "F" +
          firstSymbol["battle dimension"] +
          "-";
        if (j == "GRDTRK_EQT") standardJSON[i][j].sidc += "E-----";
        if (j == "GRDTRK_INS") standardJSON[i][j].sidc += "------" + "H-";
      }
    }
  }

  var selectElement, selectItems, mdcSelect;
  var panel = document.querySelector(element);
  //First add the template to the element
  panel.innerHTML = template;

  className = ".coding-scheme";
  mdcSelects[className] = initSelect(
    panel,
    className,
    standardJSON,
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    /*console.log("outside listen coding scheeme");
    console.log(
      `Selected "${codingScheme.selectedOptions[0].textContent}" at index ${
        codingScheme.selectedIndex
      } ` + `with value "${codingScheme.value}"`
    );*/
    initSelect(
      panel,
      ".battle-dimension",
      standardJSON[mdcSelects[".coding-scheme"].value],
      standard,
      mdcSelects
    ).emit("MDCSelect:change");
  });

  className = ".affiliation";
  mdcSelects[className] = initSelect(
    panel,
    className,
    {
      P: { name: "Pending", sidc: "SPGP" },
      U: { name: "Unknown", sidc: "SUGP" },
      A: { name: "Assumed Friend", sidc: "SAGP" },
      F: { name: "Friend", sidc: "SFGP" },
      N: { name: "Neutral", sidc: "SNGP" },
      S: { name: "Suspect", sidc: "SSGP" },
      H: { name: "Hostile", sidc: "SHGP" },
      G: { name: "Exercise Pending", sidc: "SGGP" },
      W: { name: "Exercise Unknown", sidc: "SWGP" },
      D: { name: "Exercise Friend", sidc: "SDGP" },
      L: { name: "Exercise Neutral", sidc: "SLGP" },
      M: { name: "Exercise Assumed Friend", sidc: "SMGP" },
      J: { name: "Joker", sidc: "SJGP" },
      K: { name: "Faker", sidc: "SKGP" },
      O: { name: "None Specified", sidc: "SOGP" }
    },
    standard,
    mdcSelects,
    3
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".battle-dimension";
  mdcSelects[className] = initSelect(
    panel,
    className,
    standardJSON.WAR,
    standard,
    mdcSelects,
    2
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    initSelect(
      panel,
      ".function-id",
      standardJSON[mdcSelects[".coding-scheme"].value][
        mdcSelects[".battle-dimension"].value
      ],
      standard,
      mdcSelects
    ).emit("MDCSelect:change");

    initSelect(
      panel,
      ".symbol-modifier-1",
      modifier1(mdcSelects[".battle-dimension"].value),
      standard,
      mdcSelects
    ).emit("MDCSelect:change");

    initSelect(
      panel,
      ".symbol-modifier-2",
      modifier2(
        mdcSelects[".battle-dimension"].value,
        mdcSelects[".symbol-modifier-1"].value
      ),
      standard,
      mdcSelects
    ).emit("MDCSelect:change");
  });

  className = ".status";
  mdcSelects[className] = initSelect(
    panel,
    className,
    {
      A: { name: "Anticipated/Planned", sidc: "SFGA" },
      P: { name: "Present", sidc: "SFGP" },
      C: { name: "Present/Fully Capable", sidc: "SFGC" },
      D: { name: "Present/Damaged", sidc: "SFGD" },
      X: { name: "Present/Destroyed", sidc: "SFGX" },
      F: { name: "Present/Full To Capacity", sidc: "SFGF" }
    },
    standard,
    mdcSelects,
    1
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".function-id";
  mdcSelects[className] = initSelect(
    panel,
    className,
    standardJSON[mdcSelects[".coding-scheme"].value][
      mdcSelects[".battle-dimension"].value
    ],
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".symbol-modifier-1";
  mdcSelects[className] = initSelect(
    panel,
    className,
    modifier1(mdcSelects[".battle-dimension"].value),
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    initSelect(
      panel,
      ".symbol-modifier-2",
      modifier2(
        mdcSelects[".battle-dimension"].value,
        mdcSelects[".symbol-modifier-1"].value
      ),
      standard,
      mdcSelects
    );
    _preRenderSymbol(standardJSON, standard, mdcSelects);
  });

  className = ".symbol-modifier-2";
  mdcSelects[className] = initSelect(
    panel,
    className,
    modifier2(
      mdcSelects[".battle-dimension"].value,
      mdcSelects[".symbol-modifier-1"].value
    ),
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
