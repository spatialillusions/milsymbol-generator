import { select } from "material-components-web";
import renderSymbol from "./render-symbol.js";
import addSelectItem from "./add-select-item.js";
import template from "./number-panel-template.html";

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
  if (battledimension == "SSUF" || battledimension == "SBSUF") {
    return {
      "-": { name: "-" },
      N: { name: "Towed array" }
    };
  }

  return undefined; //{ "-": { name: "-" } };
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
  if (
    (battledimension == "SSUF" || battledimension == "SBSUF") &&
    modifier1 == "N"
  ) {
    return {
      S: { name: "Towed Array (short)", sidc: "SFSPE-----NS" },
      L: { name: "Towed Array (long)", sidc: "SFSPE-----NL" }
    };
  }

  return undefined; //{ "-": { name: "-" } };
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

  if (typeof options == "undefined") {
    selectElement
      .querySelector(".mdc-select__label")
      .classList.remove("mdc-select__label--float-above");
    mdcSelect.selectedIndex = -1;
    mdcSelect.disabled = true;
    return mdcSelect;
  }

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

  // TODO remove this code when the fix is in place in mdc
  selectElement
    .querySelector(".mdc-select__label")
    .classList.add("mdc-select__label--float-above");
  mdcSelect.disabled = false;

  selectItems.innerHTML = items;

  if (selectedIndex == -1) selectedIndex = 0;
  if (selectedIndex > mdcSelect.options.length) selectedIndex = 0;
  mdcSelect.selectedIndex = selectedIndex || 0;

  if (mdcSelect.value == "-") {
    // For modifier 1 and 2
    selectElement
      .querySelector(".mdc-select__label")
      .classList.remove("mdc-select__label--float-above");
  }

  return mdcSelect;
}

export default function(element, standardJSON, standard) {
  var className;
  var mdcSelects = {};
  //First add the template to the element
  console.log(template);
  document.querySelector(element).innerHTML = template;
  /*
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
  mdcSelects[className].emit("MDCSelect:change");*/
}
