import { select } from "material-components-web";

import ms from "../../milsymbol/dist/milsymbol.js";
import { app6b, milstd2525c } from "../../milsymbol/dist/milstd.js";

import renderSymbol from "./render-symbol.js";

var milstd = { app6b: app6b, "2525c": milstd2525c };

function addSelectItem(mdcSelect, htmlSelect, value, text, sidc, standard) {
  var item = "<li ";
  item += 'class="mdc-list-item" ';
  if (sidc) {
    var symbol = new ms.Symbol(sidc, {
      size: 20,
      standard: standard.indexOf("2525") != -1 ? "2525" : "APP6",
      symetric: true
    });
    if (!symbol.isValid()) {
      item += "aria-disabled ";
    } else {
      text =
        '<figure><img src="' +
        symbol.asCanvas(2).toDataURL() +
        '"></figure>' +
        text;
    }
  }
  item += 'id="' + value + '" ';
  item += 'role="option" ';
  item += 'tabindex="0" ';
  item += ">" + text + "</li>";
  return item;
}

function modifier1(battledimension) {
  if (battledimension == "GRDTRK_UNT") {
    return {
      "-": { name: "-" },
      A: { name: "Headquarters", sidc: "SFGP------A" },
      B: { name: "Task Force HQ", sidc: "SFGP------B" },
      C: { name: "Feint Dummy HQ", sidc: "SFGP------C" },
      D: { name: "Feint Dummy/Task Force HQ", sidc: "SFGP------D" },
      E: { name: "Task Force", sidc: "SFGP------E" },
      F: { name: "Feint Dummy", sidc: "SFGP------F" },
      G: { name: "Feint Dummy/Task Force", sidc: "SFGP------G" }
    };
  }
  if (battledimension == "GRDTRK_EQT") {
    return {
      "-": { name: "-" },
      M: { name: "Mobility" }
    };
  }
  if (battledimension == "GRDTRK_INS") {
    return {
      H: { name: "Installation", sidc: "SFGP------H" }
    };
  }

  return { "-": { name: "-" } };
}

function modifier2(battledimension, modifier1) {
  if (battledimension == "GRDTRK_UNT") {
    return {
      "-": { name: "-" },
      A: { name: "Team/Crew", sidc: "SFGP-------A" },
      B: { name: "Squad", sidc: "SFGP-------B" },
      C: { name: "Section", sidc: "SFGP-------C" },
      D: { name: "Platoon/Detachment", sidc: "SFGP-------D" },
      E: { name: "Company/Battery/Troop", sidc: "SFGP-------E" },
      F: { name: "Battalion/Squadron", sidc: "SFGP-------F" },
      G: { name: "Regiment/Group", sidc: "SFGP-------G" },
      H: { name: "Brigade", sidc: "SFGP-------H" },
      I: { name: "Division", sidc: "SFGP-------I" },
      J: { name: "Corps/Mef", sidc: "SFGP-------J" },
      K: { name: "Army", sidc: "SFGP-------K" },
      L: { name: "Army Group/Front", sidc: "SFGP-------L" },
      M: { name: "Region", sidc: "SFGP-------M" },
      N: { name: "Command", sidc: "SFGP-------N" }
    };
  }
  if (battledimension == "GRDTRK_EQT" && modifier1 == "M") {
    return {
      O: { name: "Wheeled/Limited", sidc: "SFGPE-----MO" },
      P: { name: "Wheeled", sidc: "SFGPE-----MP" },
      Q: { name: "Tracked", sidc: "SFGPE-----MQ" },
      R: { name: "Wheeled And Tracked", sidc: "SFGPE-----MR" },
      S: { name: "Towed", sidc: "SFGPE-----MS" },
      T: { name: "Rail", sidc: "SFGPE-----MT" },
      U: { name: "Over The Snow", sidc: "SFGPE-----MU" },
      V: { name: "Sled", sidc: "SFGPE-----MV" },
      W: { name: "Pack Animals", sidc: "SFGPE-----MW" },
      Y: { name: "Barge", sidc: "SFGPE-----MY" },
      Z: { name: "Amphibious", sidc: "SFGPE-----MZ" }
    };
  }
  /*if (battledimension == "GRDTRK_INS") {
    return {
      H: { name: "Installation" }
    };
  }*/

  return { "-": { name: "-" } };
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
  //var selectedIndex = 0;
  if (mdcSelects.hasOwnProperty(className)) {
    var mdcSelect = mdcSelects[className];
    selectedIndex = mdcSelect.selectedIndex;
    mdcSelect.selectedIndex = 0;
  } else {
    var mdcSelect = new select.MDCSelect(selectElement);
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

  var items = "";
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

      items += addSelectItem(
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
      items += addSelectItem(
        selectItems,
        false,
        key,
        name,
        options[key].sidc,
        standard
      );
    }
  }
  selectItems.innerHTML = items;

  if (selectedIndex > mdcSelect.options.length) selectedIndex = 0;
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
        /*if (milstd[standard][i][j].hasOwnProperty("modifier 1")) {
          for (var key in milstd[standard][i][j]["modifier 1"]) {
            var sidc =
              firstSymbol["code scheme"] +
              "F" +
              firstSymbol["battle dimension"] +
              "-" +
              "------" +
              key;
            milstd[standard][i][j]["modifier 1"][key].sidc = sidc;
          }
        }
        if (milstd[standard][i][j].hasOwnProperty("modifier 2")) {
          for (var key in milstd[standard][i][j]["modifier 2"]) {
            var sidc =
              firstSymbol["code scheme"] +
              "F" +
              firstSymbol["battle dimension"] +
              "-" +
              "------" +
              "-" +
              key;
            milstd[standard][i][j]["modifier 2"][key].sidc = sidc;
          }
        }*/
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
    _preRenderSymbol(milstd, standard, mdcSelects);
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
    _preRenderSymbol(milstd, standard, mdcSelects);
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
    _preRenderSymbol(milstd, standard, mdcSelects);
  });

  // Now emit a change to render first symbol
  mdcSelects[className].emit("MDCSelect:change");
}
