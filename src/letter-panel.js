import mdc from "material-components-web/dist/material-components-web.min.js";
var textField = mdc.textField;

import ms from "milsymbol";

import renderSymbol from "./render-symbol.js";
import template from "./letter-panel-template.html";

import initSelect from "./letter-sidc/init-select.js";
import modifier1 from "./letter-sidc/modifier1.js";
import modifier2 from "./letter-sidc/modifier2.js";

function letterPanel(element, standardJSON, standard) {
  this.element = element;
  this.mdcSelects = {};
  this.standard = standard;
  this.standardJSON = standardJSON;
  var className;

  //Set a generic SIDC for all battle dimensions
  for (var i in this.standardJSON) {
    for (var j in this.standardJSON[i]) {
      if (typeof this.standardJSON[i][j] == "object") {
        var firstSymbol = this.standardJSON[i][j]["main icon"][0];
        this.standardJSON[i][j].sidc =
          firstSymbol["code scheme"] +
          "F" +
          firstSymbol["battle dimension"] +
          "-";
        if (j == "GRDTRK_EQT") this.standardJSON[i][j].sidc += "E-----";
        if (j == "GRDTRK_INS") this.standardJSON[i][j].sidc += "------" + "H-";
      }
    }
  }
  var selectElement, selectItems, mdcSelect;
  var panel = document.querySelector(element);
  //First add the template to the element
  panel.innerHTML = template;

  var search = new textField.MDCTextField(
    panel.querySelector(".search .mdc-text-field")
  );
  window.search = search;
  panel
    .querySelector(".search #search-icon")
    .addEventListener("click", function() {
      // fix better way to show panel
      panel.querySelector(".search .mdc-text-field").classList.add("active");
      //panel.querySelector(".search input").focus();
    });
  panel
    .querySelector(".search .mdc-text-field")
    .addEventListener("transitionend", function() {
      if (this.classList.contains("active"))
        panel.querySelector(".search input").focus();
    });
  panel.querySelector(".search input").addEventListener("focus", function() {
    // fix better way to show panel
    if (panel.querySelector(".search nav").innerHTML != "") {
      panel.querySelector(".search nav").style.opacity = 1;
    }
    panel.querySelector(".search nav").style.display = "block";
  });
  panel.querySelector(".search input").addEventListener("blur", function() {
    // fix better way to hide panel
    panel.querySelector(".search nav").style.opacity = 0;
    panel.querySelector(".search .mdc-text-field").classList.remove("active");
  });
  search.listen(
    "keyup",
    function() {
      var max_number_results = 10;
      var results = this.search(search.value, max_number_results);
      if (results.length) {
        panel.querySelector(".search nav").style.opacity = 1;
      } else {
        panel.querySelector(".search nav").style.opacity = 0;
      }
      var resultElement = panel.querySelector(".search nav");
      resultElement.innerHTML = "";
      for (var i = 0; i < results.length; i++) {
        var link = document.createElement("a");

        link.classList.add("mdc-list-item", "mdc-ripple-upgraded");
        link.style["--mdc-ripple-fg-size"] = "360px";
        link.style["--mdc-ripple-fg-scale"] = 1.69977;
        link.style["--mdc-ripple-fg-translate-start"] = "43px, -159.031px";
        link.style["--mdc-ripple-fg-translate-end"] = "120px, -156px";

        var sidc =
          results[i]["code scheme"] +
          "F" + //this.mdcSelects[".affiliation"].value +
          results[i]["battle dimension"] +
          "P" + //this.mdcSelects[".status"].value +
          results[i]["code"] +
          "--";

        var symbol = new ms.Symbol(sidc, {
          size: 20,
          standard: standard || "2525",
          symetric: true
        });
        link.innerHTML =
          '<i class="material-icons mdc-list-item__graphic" aria-hidden="true"><figure><img src="' +
          symbol.asCanvas().toDataURL() +
          '"></figure></i>' +
          '<span class="mdc-list-item__text">' +
          results[i].name[results[i].name.length - 1] +
          /*'<span class="mdc-list-item__secondary-text">' +
          results[i].name.slice(1, -1).join(" -&nbsp;") +
          "</span>"+*/ "</span>";

        link.onclick = function(sidc) {
          this.setSIDC(sidc);
          panel.querySelector(".search nav").style.display = "none";
        }.bind(this, sidc);
        if (symbol.isValid()) {
          resultElement.appendChild(link);
        }
      }
    }.bind(this)
  );

  className = ".coding-scheme";
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    this.standardJSON,
    this.standard,
    this.mdcSelects,
    0
  );
  this.mdcSelects[className].listen(
    "MDCSelect:change",
    function() {
      this.initSelect(
        panel,
        ".battle-dimension",
        this.standardJSON[this.mdcSelects[".coding-scheme"].value],
        this.standard,
        this.mdcSelects
      ).emit("MDCSelect:change");
    }.bind(this)
  );

  className = ".affiliation";
  var affiliationDefault = {
    P: { index: 0, name: "Pending", sidc: "SPGP" },
    U: { index: 1, name: "Unknown", sidc: "SUGP" },
    A: { index: 2, name: "Assumed Friend", sidc: "SAGP" },
    F: { index: 3, name: "Friend", sidc: "SFGP" },
    N: { index: 4, name: "Neutral", sidc: "SNGP" },
    S: { index: 5, name: "Suspect", sidc: "SSGP" },
    H: { index: 6, name: "Hostile", sidc: "SHGP" },
    G: { index: 7, name: "Exercise Pending", sidc: "SGGP" },
    W: { index: 8, name: "Exercise Unknown", sidc: "SWGP" },
    D: { index: 9, name: "Exercise Friend", sidc: "SDGP" },
    L: { index: 10, name: "Exercise Neutral", sidc: "SLGP" },
    M: { index: 11, name: "Exercise Assumed Friend", sidc: "SMGP" },
    J: { index: 12, name: "Joker", sidc: "SJGP" },
    K: { index: 13, name: "Faker", sidc: "SKGP" },
    O: { index: 14, name: "None Specified", sidc: "SOGP" }
  };
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    affiliationDefault,
    this.standard,
    this.mdcSelects,
    3
  );
  this.mdcSelects[className].defaults = affiliationDefault;
  this.mdcSelects[className].listen(
    "MDCSelect:change",
    function() {
      this._preRenderSymbol();
    }.bind(this)
  );

  className = ".battle-dimension";
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    this.standardJSON.WAR,
    this.standard,
    this.mdcSelects,
    2
  );
  this.mdcSelects[className].listen(
    "MDCSelect:change",
    function() {
      this.initSelect(
        panel,
        ".function-id",
        this.standardJSON[this.mdcSelects[".coding-scheme"].value][
          this.mdcSelects[".battle-dimension"].value
        ],
        this.standard,
        this.mdcSelects
      ).emit("MDCSelect:change");

      this.initSelect(
        panel,
        ".symbol-modifier-1",
        modifier1(this.mdcSelects[".battle-dimension"].value),
        this.standard,
        this.mdcSelects
      ).emit("MDCSelect:change");

      this.initSelect(
        panel,
        ".symbol-modifier-2",
        modifier2(
          this.mdcSelects[".battle-dimension"].value,
          this.mdcSelects[".symbol-modifier-1"].value
        ),
        this.standard,
        this.mdcSelects
      ).emit("MDCSelect:change");
    }.bind(this)
  );

  className = ".status";
  var statusDefault = {
    A: { index: 0, name: "Anticipated/Planned", sidc: "SFGA" },
    P: { index: 1, name: "Present", sidc: "SFGP" },
    C: { index: 2, name: "Present/Fully Capable", sidc: "SFGC" },
    D: { index: 3, name: "Present/Damaged", sidc: "SFGD" },
    X: { index: 4, name: "Present/Destroyed", sidc: "SFGX" },
    F: { index: 5, name: "Present/Full To Capacity", sidc: "SFGF" }
  };
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    statusDefault,
    this.standard,
    this.mdcSelects,
    1
  );
  this.mdcSelects[className].defaults = statusDefault;
  this.mdcSelects[className].listen(
    "MDCSelect:change",
    function() {
      this._preRenderSymbol();
    }.bind(this)
  );

  className = ".function-id";
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    this.standardJSON[this.mdcSelects[".coding-scheme"].value][
      this.mdcSelects[".battle-dimension"].value
    ],
    this.standard,
    this.mdcSelects,
    0
  );
  this.mdcSelects[className].listen(
    "MDCSelect:change",
    function() {
      this._preRenderSymbol();
    }.bind(this)
  );

  className = ".symbol-modifier-1";
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    modifier1(this.mdcSelects[".battle-dimension"].value),
    this.standard,
    this.mdcSelects,
    0
  );
  this.mdcSelects[className].listen(
    "MDCSelect:change",
    function() {
      this.initSelect(
        panel,
        ".symbol-modifier-2",
        modifier2(
          this.mdcSelects[".battle-dimension"].value,
          this.mdcSelects[".symbol-modifier-1"].value
        ),
        this.standard,
        this.mdcSelects
      );
      this._preRenderSymbol();
    }.bind(this)
  );

  className = ".symbol-modifier-2";
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    modifier2(
      this.mdcSelects[".battle-dimension"].value,
      this.mdcSelects[".symbol-modifier-1"].value
    ),
    this.standard,
    this.mdcSelects,
    0
  );
  this.mdcSelects[className].listen(
    "MDCSelect:change",
    function() {
      this._preRenderSymbol();
    }.bind(this)
  );

  // Now emit a change to render first symbol
  this.mdcSelects[className].emit("MDCSelect:change");

  return this;
}

letterPanel.prototype._preRenderSymbol = function() {
  var sidc = this.getSIDC();
  var symbolElement = document.querySelector(this.element + " .svg-symbol");
  symbolElement.setAttribute("sidc", sidc);
  symbolElement.setAttribute("standard", this.standard);
  document.querySelector(this.element + " .sidc").textContent = sidc;
  renderSymbol();
};

letterPanel.prototype.initSelect = initSelect;

letterPanel.prototype.getSIDC = function() {
  var options = this.standardJSON[this.mdcSelects[".coding-scheme"].value][
    this.mdcSelects[".battle-dimension"].value
  ]["main icon"][this.mdcSelects[".function-id"].selectedIndex];
  var sidc =
    options["code scheme"] +
    this.mdcSelects[".affiliation"].value +
    options["battle dimension"] +
    this.mdcSelects[".status"].value +
    options["code"] +
    (this.mdcSelects[".symbol-modifier-1"].value || "-") +
    (this.mdcSelects[".symbol-modifier-2"].value || "-");
  return sidc;
};

letterPanel.prototype.search = function(searchString, results) {
  var found = [];
  for (var i in this.standardJSON) {
    var battleDimension = 0;
    for (var j in this.standardJSON[i]) {
      if (typeof this.standardJSON[i][j] == "string") {
        continue;
      }
      var functionId = 0;
      for (var k in this.standardJSON[i][j]["main icon"]) {
        var names = this.standardJSON[i][j]["main icon"][k].name;
        if (names[names.length - 1].indexOf(searchString.toUpperCase()) != -1) {
          found.push(this.standardJSON[i][j]["main icon"][k]);
        }

        if (found.length >= results) {
          //foundSIDC = true;
          break;
        }
        functionId++;
      }
      if (found.length >= results) {
        break;
      } else {
        battleDimension++;
      }
    }
    if (found.length >= results) {
      break;
    }
  }

  return found;
};

letterPanel.prototype.setSIDC = function(sidc) {
  this.mdcSelects[".affiliation"].selectedIndex = this.mdcSelects[
    ".affiliation"
  ].defaults[sidc.charAt(1)].index;
  this.mdcSelects[".status"].selectedIndex = this.mdcSelects[
    ".status"
  ].defaults[sidc.charAt(3)].index;

  var codingScheme = 0;
  var foundSIDC = false;
  for (var i in this.standardJSON) {
    var battleDimension = 0;
    for (var j in this.standardJSON[i]) {
      if (typeof this.standardJSON[i][j] == "string") {
        continue;
      }
      var functionId = 0;
      for (var k in this.standardJSON[i][j]["main icon"]) {
        var rowSIDC =
          this.standardJSON[i][j]["main icon"][k]["code scheme"] +
          sidc.charAt(1) +
          this.standardJSON[i][j]["main icon"][k]["battle dimension"] +
          sidc.charAt(3) +
          this.standardJSON[i][j]["main icon"][k]["code"] +
          (sidc.charAt(10) || "-") +
          (sidc.charAt(11) || "-");
        if (sidc == rowSIDC) {
          foundSIDC = true;
          break;
        }
        functionId++;
      }
      if (foundSIDC) {
        break;
      } else {
        battleDimension++;
      }
    }
    if (foundSIDC) {
      break;
    } else {
      codingScheme++;
    }
  }
  if (this.mdcSelects[".coding-scheme"].selectedIndex != codingScheme) {
    this.mdcSelects[".coding-scheme"].selectedIndex = codingScheme;
    this.mdcSelects[".coding-scheme"].emit("MDCSelect:change");
  }
  if (this.mdcSelects[".battle-dimension"].selectedIndex != battleDimension) {
    this.mdcSelects[".battle-dimension"].selectedIndex = battleDimension;
    this.mdcSelects[".battle-dimension"].emit("MDCSelect:change");
  }
  if (this.mdcSelects[".function-id"].selectedIndex != functionId) {
    this.mdcSelects[".function-id"].selectedIndex = functionId;
    this.mdcSelects[".function-id"].emit("MDCSelect:change");
  }
  for (
    var i = 0;
    i < this.mdcSelects[".symbol-modifier-1"].options.length;
    i++
  ) {
    if (this.mdcSelects[".symbol-modifier-1"].item(i).id == sidc.charAt(10)) {
      this.mdcSelects[".symbol-modifier-1"].selectedIndex = i;
      this.mdcSelects[".symbol-modifier-1"].emit("MDCSelect:change");
    }
  }
  for (
    var i = 0;
    i < this.mdcSelects[".symbol-modifier-2"].options.length;
    i++
  ) {
    if (this.mdcSelects[".symbol-modifier-2"].item(i).id == sidc.charAt(11)) {
      this.mdcSelects[".symbol-modifier-2"].selectedIndex = i;
      this.mdcSelects[".symbol-modifier-2"].emit("MDCSelect:change");
    }
  }

  return this;
};

export default letterPanel;
