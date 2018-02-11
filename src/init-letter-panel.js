import * as mdc from "material-components-web";

import ms from "../../milsymbol/dist/milsymbol.js";
import milstd from "../../milsymbol/dist/milstd.js";

import renderSymbol from "./render-symbol.js";

function addSelectItem(mdcSelect, htmlSelect, value, text, sidc, standard) {
  var item = document.createElement("li");
  item.classList.add("mdc-list-item");
  if (sidc) {
    var symbol = new ms.Symbol(sidc, {
      size: 20,
      standard: standard.indexOf("2525") != -1 ? "2525" : "APP6"
    });
    if (!symbol.isValid()) {
      item.setAttribute("aria-disabled", "true");
    } else {
      text = '<img src="' + symbol.asCanvas(2).toDataURL() + '">' + text;
    }
  }
  item.innerHTML = text;
  item.id = value;
  item.setAttribute("role", "option");
  item.setAttribute("tabindex", "0");
  if (mdcSelect) mdcSelect.appendChild(item);
}

function initSelect(
  panel,
  className,
  options,
  standard,
  mdcSelects,
  selectedIndex
) {
  var selectElement = panel.querySelector(className + " .mdc-select");

  if (mdcSelects.hasOwnProperty(className)) {
    var mdcSelect = mdcSelects[className];
    mdcSelect.selectedIndex = 0;
  } else {
    var mdcSelect = new mdc.select.MDCSelect(selectElement);
    mdcSelects[className] = mdcSelect;
  }

  // TODO remove this code when the fix is in place in mdc
  selectElement
    .querySelector(".mdc-select__label")
    .classList.add("mdc-select__label--float-above");

  var selectItems = panel.querySelector(className + " .mdc-menu__items");
  while (selectItems.firstChild) {
    selectItems.removeChild(selectItems.firstChild);
  }

  if (options.hasOwnProperty("main icon")) {
    for (var i = 0; i < options["main icon"].length; i++) {
      var sidc =
        options["main icon"][i]["code scheme"] +
        "F" +
        options["main icon"][i]["battle dimension"] +
        "P" +
        options["main icon"][i]["code"];

      var name =
        "<em>" +
        options["main icon"][i].name
          .slice(1, -1)
          .concat([""])
          .join(" -&nbsp;") +
        "</em>" +
        options["main icon"][i].name.slice(-1);

      addSelectItem(
        selectItems,
        false,
        options["main icon"][i].code,
        name,
        sidc,
        standard
      );
    }
  } else {
    for (var key in options) {
      if (key == "name") continue;
      name = options[key].name == "-" ? "" : options[key].name;
      addSelectItem(selectItems, false, key, name, options[key].sidc, standard);
    }
  }
  // maby add some clever stuff to try to keep the selected index...
  mdcSelect.selectedIndex = selectedIndex || 0;
  return mdcSelect;
}

export default function(standard) {
  var className;
  var mdcSelects = {};

  function _preRenderSymbol(milstd, standard, mdcSelects) {
    var options =
      milstd[standard][mdcSelects[".coding-scheme"].value][
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

    var symbolElement = document.querySelector(
      ".panel-" + standard + " .symbol"
    );
    symbolElement.setAttribute("sidc", sidc);
    symbolElement.setAttribute("standard", standard);
    renderSymbol();
  }
  //Set a generic SIDC for all battle dimensions
  for (var i in milstd[standard]) {
    for (var j in milstd[standard][i]) {
      if (typeof milstd[standard][i][j] == "object") {
        var firstSymbol = milstd[standard][i][j]["main icon"][0];
        milstd[standard][i][j].sidc =
          firstSymbol["code scheme"] +
          "F" +
          firstSymbol["battle dimension"] +
          "-";
        if (j == "GRDTRK_EQT") milstd[standard][i][j].sidc += "E-----";
        if (j == "GRDTRK_INS") milstd[standard][i][j].sidc += "------" + "H-";
      }
    }
  }

  //console.log(milstd["2525c"]);
  var selectElement, selectItems, mdcSelect;
  var panel = document.querySelector(".panel-" + standard);

  className = ".coding-scheme";
  mdcSelects[className] = initSelect(
    panel,
    className,
    milstd[standard],
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
      milstd[standard][mdcSelects[".coding-scheme"].value],
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
    _preRenderSymbol(milstd, standard, mdcSelects);
  });

  className = ".battle-dimension";
  mdcSelects[className] = initSelect(
    panel,
    className,
    milstd[standard].WAR,
    standard,
    mdcSelects,
    2
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    //console.log("outside listen battle dimension");
    /*console.log(
      `Selected "${battleDimension.selectedOptions[0].textContent}" at index ${
        battleDimension.selectedIndex
      } ` + `with value "${battleDimension.value}"`
    );*/
    initSelect(
      panel,
      ".function-id",
      milstd[standard][mdcSelects[".coding-scheme"].value][
        mdcSelects[".battle-dimension"].value
      ],
      standard,
      mdcSelects
    ).emit("MDCSelect:change");

    initSelect(
      panel,
      ".symbol-modifier-1",
      milstd[standard][mdcSelects[".coding-scheme"].value][
        mdcSelects[".battle-dimension"].value
      ]["modifier 1"] || { "-": { name: "-" } },
      standard,
      mdcSelects
    ).emit("MDCSelect:change");

    initSelect(
      panel,
      ".symbol-modifier-2",
      milstd[standard][mdcSelects[".coding-scheme"].value][
        mdcSelects[".battle-dimension"].value
      ]["modifier 2"] || { "-": { name: "-" } },
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
    _preRenderSymbol(milstd, standard, mdcSelects);
  });

  className = ".function-id";
  mdcSelects[className] = initSelect(
    panel,
    className,
    milstd[standard][mdcSelects[".coding-scheme"].value][
      mdcSelects[".battle-dimension"].value
    ],
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    //.log("outside listen function id");
    /*console.log(
      `Selected "${functionId.selectedOptions[0].textContent}" at index ${
        functionId.selectedIndex
      } ` + `with value "${functionId.value}"`
    );*/
    _preRenderSymbol(milstd, standard, mdcSelects);
  });

  className = ".symbol-modifier-1";
  mdcSelects[className] = initSelect(
    panel,
    className,
    milstd[standard][mdcSelects[".coding-scheme"].value][
      mdcSelects[".battle-dimension"].value
    ]["modifier 1"] || { "-": { name: "-" } },
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(milstd, standard, mdcSelects);
  });

  className = ".symbol-modifier-2";
  mdcSelects[className] = initSelect(
    panel,
    className,
    milstd[standard][mdcSelects[".coding-scheme"].value][
      mdcSelects[".battle-dimension"].value
    ]["modifier 2"] || { "-": { name: "-" } },
    standard,
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    _preRenderSymbol(milstd, standard, mdcSelects);
  });

  // Now emit a change to render first symbol
  mdcSelects[className].emit("MDCSelect:change");
}
