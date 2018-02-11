import * as mdc from "material-components-web";
import "material-components-web/dist/material-components-web.min.css";
// At the moment use our development version of milsymbol
import ms from "../../milsymbol/dist/milsymbol.js";
import milstd from "../../milsymbol/dist/milstd.js";

//Make sure symbol are centered
ms.addSymbolPart(function squareIcon() {
  var gbbox = new ms.BBox();
  var anchor = { x: 100, y: 100 };
  var maxx = Math.max(anchor.x - this.bbox.x1, this.bbox.x2 - anchor.x);
  gbbox.x1 = anchor.x - maxx;
  gbbox.x2 = anchor.x + maxx;
  return { pre: [], post: [], bbox: gbbox };
});

function addSelectItem(mdcSelect, htmlSelect, value, text, sidc) {
  var item = document.createElement("li");
  item.classList.add("mdc-list-item");
  item.innerHTML = text;
  item.id = value;
  item.setAttribute("role", "option");
  item.setAttribute("tabindex", "0");
  if (mdcSelect) mdcSelect.appendChild(item);
}

function initSelect(panel, className, options, mdcSelects, selectedIndex) {
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
        '<img src="' +
        new ms.Symbol(sidc, {
          size: 20
        })
          .asCanvas(2)
          .toDataURL() +
        '"><em>' +
        options["main icon"][i].name
          .slice(1, -1)
          .concat([""])
          .join(" -&nbsp;") +
        "</em>" +
        options["main icon"][i].name.slice(-1);
      addSelectItem(selectItems, false, options["main icon"][i].code, name);
    }
  } else {
    for (var key in options) {
      if (key == "name") continue;
      name = "";
      if (options[key].sidc) {
        name +=
          '<img src="' +
          new ms.Symbol(options[key].sidc, {
            size: 20
          })
            .asCanvas(2)
            .toDataURL() +
          '">';
      }
      name += options[key].name == "-" ? "" : options[key].name;
      addSelectItem(selectItems, false, key, name);
    }
  }

  window.stuff = mdcSelect;
  /*mdcSelect.listen("MDCSelect:change", function() {
    console.log("init listen");
    console.log(mdcSelect.selectedIndex);
    console.log(
      `Selected "${mdcSelect.selectedOptions[0].textContent}" at index ${
        mdcSelect.selectedIndex
      } ` + `with value "${mdcSelect.value}"`
    );
  });*/
  mdcSelect.selectedIndex = selectedIndex || 0;

  return mdcSelect;
}

function milstd2525cInit() {
  var className;
  var mdcSelects = {};

  //Set a generic SIDC for all battle dimensions
  for (var i in milstd["2525c"]) {
    for (var j in milstd["2525c"][i]) {
      if (typeof milstd["2525c"][i][j] == "object") {
        var firstSymbol = milstd["2525c"][i][j]["main icon"][0];
        milstd["2525c"][i][j].sidc =
          firstSymbol["code scheme"] +
          "F" +
          firstSymbol["battle dimension"] +
          "-";
        if (j == "GRDTRK.EQT") milstd["2525c"][i][j].sidc += "E-----";
        if (j == "GRDTRK.INS") milstd["2525c"][i][j].sidc += "------" + "H-";
      }
    }
  }

  //console.log(milstd["2525c"]);
  var selectElement, selectItems, mdcSelect;
  var panel = document.querySelector(".mil-std-2525c");
  panel.querySelector(".symbol").innerHTML = new ms.Symbol("SFGP", {
    size: 100,
    staffComments: "THIS IS A TEST THAT SYMBOL IS CENTERED"
  }).asSVG();

  className = ".coding-scheme";
  mdcSelects[className] = initSelect(
    panel,
    className,
    milstd["2525c"],
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
      milstd["2525c"][mdcSelects[".coding-scheme"].value],
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
    mdcSelects,
    3
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    renderSymbol(milstd["2525c"], mdcSelects, panel);
  });

  className = ".battle-dimension";
  mdcSelects[className] = initSelect(
    panel,
    className,
    milstd["2525c"].WAR,
    mdcSelects,
    5
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    console.log("outside listen battle dimension");
    /*console.log(
      `Selected "${battleDimension.selectedOptions[0].textContent}" at index ${
        battleDimension.selectedIndex
      } ` + `with value "${battleDimension.value}"`
    );*/
    initSelect(
      panel,
      ".function-id",
      milstd["2525c"][mdcSelects[".coding-scheme"].value][
        mdcSelects[".battle-dimension"].value
      ],
      mdcSelects
    ).emit("MDCSelect:change");

    initSelect(
      panel,
      ".symbol-modifier-1",
      milstd["2525c"][mdcSelects[".coding-scheme"].value][
        mdcSelects[".battle-dimension"].value
      ]["modifier 1"] || { "-": { name: "-" } },
      mdcSelects
    ).emit("MDCSelect:change");

    initSelect(
      panel,
      ".symbol-modifier-2",
      milstd["2525c"][mdcSelects[".coding-scheme"].value][
        mdcSelects[".battle-dimension"].value
      ]["modifier 2"] || { "-": { name: "-" } },
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
    mdcSelects,
    1
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    renderSymbol(milstd["2525c"], mdcSelects, panel);
  });

  className = ".function-id";
  mdcSelects[className] = initSelect(
    panel,
    className,
    milstd["2525c"].WAR["GRDTRK.UNT"],
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    console.log("outside listen function id");
    /*console.log(
      `Selected "${functionId.selectedOptions[0].textContent}" at index ${
        functionId.selectedIndex
      } ` + `with value "${functionId.value}"`
    );*/
    renderSymbol(milstd["2525c"], mdcSelects, panel);
  });

  className = ".symbol-modifier-1";
  mdcSelects[className] = initSelect(
    panel,
    className,
    milstd["2525c"].WAR["GRDTRK.UNT"]["modifier 1"],
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    renderSymbol(milstd["2525c"], mdcSelects, panel);
  });

  className = ".symbol-modifier-2";
  mdcSelects[className] = initSelect(
    panel,
    className,
    milstd["2525c"].WAR["GRDTRK.UNT"]["modifier 2"],
    mdcSelects,
    0
  );
  mdcSelects[className].listen("MDCSelect:change", function() {
    renderSymbol(milstd["2525c"], mdcSelects, panel);
  });
}
function renderSymbol(milstd, mdcSelects, panel) {
  var options =
    milstd[mdcSelects[".coding-scheme"].value][
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
  panel.querySelector(".symbol").innerHTML = new ms.Symbol(sidc, {
    size: 100
  }).asSVG();
}
function milstd2525cUpdate() {}
export default function initGenerator() {
  //

  var tabBarScroller = new mdc.tabs.MDCTabBarScroller(
    document.querySelector("#tab-bar-scroller")
  );

  var panels = document.querySelector(".panels");

  tabBarScroller.tabBar.tabs.forEach(function(tab) {
    tab.preventDefaultOnClick = true;
  });

  function updatePanel(index) {
    var activePanel = panels.querySelector(".panel.active");
    if (activePanel) {
      activePanel.classList.remove("active");
    }
    var newActivePanel = panels.querySelector(
      ".panel:nth-child(" + (index + 1) + ")"
    );
    if (newActivePanel) {
      newActivePanel.classList.add("active");
    }
  }

  tabBarScroller.tabBar.listen("MDCTabBar:change", function({ detail: tabs }) {
    var nthChildIndex = tabs.activeTabIndex;

    updatePanel(nthChildIndex);
  });

  milstd2525cInit();

  mdc.autoInit();
}
