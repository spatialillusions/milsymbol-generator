import mdc from "material-components-web/dist/material-components-web.min.js";
var textField = mdc.textField;

import ms from "milsymbol";

import renderSymbol from "./render-symbol.js";
import template from "./number-panel-template.html";

import initSelect from "./number-sidc/init-select.js";

import echelonMobilityTowedarray from "./number-sidc/echelon-mobility-towedarray.js";
import headquartersTaskforceDummy from "./number-sidc/headquarters-taskforce-dummy.js";

function numberPanel(element, standardJSON, standard) {
  this.element = element;
  this.mdcSelects = {};
  this.standard = standard;
  this.standardJSON = standardJSON;
  var className;

  //Set a generic SIDC for all battle dimensions
  var symbolsets = [];
  for (var i in this.standardJSON) {
    symbolsets.push(i);
    this.standardJSON[i].code = i;
    this.standardJSON[i].sidc =
      "1003" + this.standardJSON[i].symbolset + "00000000000000";
    for (var j in this.standardJSON[i]["main icon"]) {
      this.standardJSON[i]["main icon"][j]["symbol set"] = i;
      if (this.standardJSON[i]["main icon"][j].hasOwnProperty("entity")) {
        this.standardJSON[i]["main icon"][j].name = [
          this.standardJSON[i]["main icon"][j]["entity"]
        ];
        if (this.standardJSON[i]["main icon"][j].hasOwnProperty("entity type"))
          this.standardJSON[i]["main icon"][j].name.push(
            this.standardJSON[i]["main icon"][j]["entity type"]
          );
        if (
          this.standardJSON[i]["main icon"][j].hasOwnProperty("entity subtype")
        )
          this.standardJSON[i]["main icon"][j].name.push(
            this.standardJSON[i]["main icon"][j]["entity subtype"]
          );
      }
      this.standardJSON[i]["main icon"][j].sidc =
        "1003" +
        i +
        "0000" +
        this.standardJSON[i]["main icon"][j]["code"] +
        "0000";
    }
    for (var j in this.standardJSON[i]["modifier 1"]) {
      this.standardJSON[i]["modifier 1"][j].sidc =
        "1003" +
        i +
        "0000" +
        "000000" +
        this.standardJSON[i]["modifier 1"][j]["code"] +
        "00";
    }
    for (var j in this.standardJSON[i]["modifier 2"]) {
      this.standardJSON[i]["modifier 2"][j].sidc =
        "1003" +
        i +
        "0000" +
        "000000" +
        "00" +
        this.standardJSON[i]["modifier 2"][j]["code"];
    }
  }
  // Make an ordered array of the symbol sets
  symbolsets = symbolsets.sort();
  var symbolsetsDefaults = {};
  for (var i = 0; i < symbolsets.length; i++) {
    symbolsets[i] = this.standardJSON[symbolsets[i]];
    symbolsetsDefaults[symbolsets[i].symbolset] = symbolsets[i];
    symbolsetsDefaults[symbolsets[i].symbolset].index = i;
  }
  this.symbolsets = symbolsets;

  var selectElement, selectItems, mdcSelect;
  var panel = document.querySelector(element);
  //First add the template to the element
  panel.innerHTML = template;

  panel
    .querySelector(".search #search-icon")
    .addEventListener("click", function() {
      // fix better way to show panel
      panel.querySelector(".search .mdc-text-field").classList.add("active");
      panel.querySelector(".search input").focus();
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
  var search = new textField.MDCTextField(
    panel.querySelector(".search .mdc-text-field")
  );
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

        var sidc = results[i].sidc;
        /*results[i]["code scheme"] +
          "F" +
          results[i]["battle dimension"] +
          "P" +
          results[i]["code"] +
          "--";*/
        var symbol = new ms.Symbol(sidc, {
          size: 20,
          standard: standard || "2525",
          symetric: true
        });
        link.innerHTML =
          '<i class="material-icons mdc-list-item__graphic" aria-hidden="true"><figure><img src="' +
          symbol.asCanvas().toDataURL() +
          '"></figure></i>' +
          results[i].name[results[i].name.length - 1];
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

  className = ".standard-identity-1";
  var standardIdentity1Default = {
    0: { index: 0, name: "Reality" },
    1: { index: 1, name: "Exercise" },
    2: { index: 2, name: "Simulation" }
  };
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    standardIdentity1Default,
    this.standard,
    this.mdcSelects,
    0
  );
  this.mdcSelects[className].defaults = standardIdentity1Default;
  this.mdcSelects[className].listen(
    "MDCSelect:change",
    function() {
      this._preRenderSymbol();
    }.bind(this)
  );

  className = ".standard-identity-2";
  var standardIdentity2Default = {
    0: { code: 0, index: 0, name: "Pending", sidc: "10001000000000000000" },
    1: { code: 1, index: 1, name: "Unknown", sidc: "10011000000000000000" },
    2: {
      code: 2,
      index: 2,
      name: "Assumed Friend",
      sidc: "10021000000000000000"
    },
    3: { code: 3, index: 3, name: "Friend", sidc: "10031000000000000000" },
    4: { code: 4, index: 4, name: "Neutral", sidc: "10041000000000000000" },
    5: {
      code: 5,
      index: 5,
      name: "Suspect/Joker",
      sidc: "10051000000000000000"
    },
    6: {
      code: 6,
      index: 6,
      name: "Hostile/Faker",
      sidc: "10061000000000000000"
    }
  };
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    standardIdentity2Default,
    this.standard,
    this.mdcSelects,
    3
  );
  this.mdcSelects[className].defaults = standardIdentity2Default;
  this.mdcSelects[className].listen(
    "MDCSelect:change",
    function() {
      this._preRenderSymbol();
    }.bind(this)
  );

  className = ".symbol-set";
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    symbolsets,
    this.standard,
    this.mdcSelects,
    4
  );
  this.mdcSelects[className].defaults = symbolsetsDefaults;
  this.mdcSelects[className].listen(
    "MDCSelect:change",
    function() {
      this.initSelect(
        panel,
        ".headquarters-taskforce-dummy",
        headquartersTaskforceDummy(this.mdcSelects[".symbol-set"].value),
        this.standard,
        this.mdcSelects,
        0
      );
      this.initSelect(
        panel,
        ".echelon-mobility-towedarray",
        echelonMobilityTowedarray(this.mdcSelects[".symbol-set"].value),
        this.standard,
        this.mdcSelects,
        0
      );
      this.initSelect(
        panel,
        ".icon",
        this.standardJSON[this.mdcSelects[".symbol-set"].value]["main icon"],
        this.standard,
        this.mdcSelects
      );
      this.initSelect(
        panel,
        ".icon-modifier-1",
        this.standardJSON[this.mdcSelects[".symbol-set"].value]["modifier 1"],
        this.standard,
        this.mdcSelects,
        0
      );
      this.initSelect(
        panel,
        ".icon-modifier-2",
        this.standardJSON[this.mdcSelects[".symbol-set"].value]["modifier 2"],
        this.standard,
        this.mdcSelects,
        0
      ).emit("MDCSelect:change");

      this._preRenderSymbol();
    }.bind(this)
  );

  className = ".status";
  var statusDefault = {
    0: { code: 0, index: 0, name: "Present", sidc: "10031000000000000000" },
    1: {
      code: 1,
      index: 1,
      name: "Planned/Anticipated/Suspect",
      sidc: "10031010000000000000"
    },
    2: {
      code: 2,
      index: 2,
      name: "Present/Fully capable",
      sidc: "10031020000000000000"
    },
    3: {
      code: 3,
      index: 3,
      name: "Present/Damaged",
      sidc: "10031030000000000000"
    },
    4: {
      code: 4,
      index: 4,
      name: "Present/Destroyed",
      sidc: "10031040000000000000"
    },
    5: {
      code: 5,
      index: 5,
      name: "Present/Full to capacity",
      sidc: "10031050000000000000"
    }
  };
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    statusDefault,
    this.standard,
    this.mdcSelects,
    0
  );
  this.mdcSelects[className].defaults = statusDefault;
  this.mdcSelects[className].listen(
    "MDCSelect:change",
    function() {
      this._preRenderSymbol();
    }.bind(this)
  );

  className = ".headquarters-taskforce-dummy";
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    headquartersTaskforceDummy(this.mdcSelects[".symbol-set"].value),
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

  className = ".echelon-mobility-towedarray";
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    echelonMobilityTowedarray(this.mdcSelects[".symbol-set"].value),
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

  className = ".icon";
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    this.standardJSON[this.mdcSelects[".symbol-set"].value]["main icon"],
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

  className = ".icon-modifier-1";
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    this.standardJSON[this.mdcSelects[".symbol-set"].value]["modifier 1"],
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

  className = ".icon-modifier-2";
  this.mdcSelects[className] = this.initSelect(
    panel,
    className,
    this.standardJSON[this.mdcSelects[".symbol-set"].value]["modifier 2"],
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

numberPanel.prototype._preRenderSymbol = function() {
  var sidc = this.getSIDC();
  var symbolElement = document.querySelector(this.element + " .svg-symbol");
  symbolElement.setAttribute("sidc", sidc);
  symbolElement.setAttribute("standard", this.standard);
  document.querySelector(this.element + " .sidc").textContent = sidc;
  renderSymbol();
};

numberPanel.prototype.initSelect = initSelect;

numberPanel.prototype.getSIDC = function() {
  var sidc =
    "10" +
    this.mdcSelects[".standard-identity-1"].value +
    this.mdcSelects[".standard-identity-2"].value +
    this.mdcSelects[".symbol-set"].value +
    this.mdcSelects[".status"].value +
    (this.mdcSelects[".headquarters-taskforce-dummy"].value || "0") +
    (this.mdcSelects[".echelon-mobility-towedarray"].value || "00") +
    this.mdcSelects[".icon"].value +
    (this.mdcSelects[".icon-modifier-1"].value || "00") +
    (this.mdcSelects[".icon-modifier-2"].value || "00");
  return sidc;
};

numberPanel.prototype.search = function(searchString, results) {
  var found = [];
  for (var i in this.symbolsets) {
    for (var j in this.standardJSON[this.symbolsets[i].symbolset][
      "main icon"
    ]) {
      var names = this.standardJSON[this.symbolsets[i].symbolset]["main icon"][
        j
      ].name;
      if (
        names[names.length - 1]
          .toUpperCase()
          .indexOf(searchString.toUpperCase()) != -1
      ) {
        found.push(
          this.standardJSON[this.symbolsets[i].symbolset]["main icon"][j]
        );
      }
      if (found.length >= results) {
        break;
      }
    }
    if (found.length >= results) {
      break;
    }
  }
  return found;
};

numberPanel.prototype.setSIDC = function(sidc) {
  this.mdcSelects[".standard-identity-1"].selectedIndex =
    this.mdcSelects[".standard-identity-1"].defaults[sidc.charAt(2)].index || 0;

  this.mdcSelects[".standard-identity-2"].selectedIndex =
    this.mdcSelects[".standard-identity-2"].defaults[sidc.charAt(3)].index || 0;

  if (
    this.mdcSelects[".symbol-set"].selectedIndex !=
    this.mdcSelects[".symbol-set"].defaults[sidc.substring(4, 6)].index
  ) {
    this.mdcSelects[".symbol-set"].selectedIndex =
      this.mdcSelects[".symbol-set"].defaults[sidc.substring(4, 6)].index || 0;
    this.mdcSelects[".symbol-set"].emit("MDCSelect:change");
  }

  this.mdcSelects[".status"].selectedIndex =
    this.mdcSelects[".status"].defaults[sidc.charAt(6)].index || 0;

  this.mdcSelects[".headquarters-taskforce-dummy"].selectedIndex =
    headquartersTaskforceDummy(sidc.substring(4, 6))[sidc.charAt(7)].index || 0;

  var ecehlonEtc = echelonMobilityTowedarray(sidc.substring(4, 6));
  for (var i = 0; i < ecehlonEtc.length; i++) {
    if (sidc.substring(8, 10) == ecehlonEtc[i].code) {
      this.mdcSelects[".echelon-mobility-towedarray"].selectedIndex = i;
      break;
    }
  }

  var icons = this.standardJSON[sidc.substring(4, 6)]["main icon"] || [];
  for (var i = 0; i < icons.length; i++) {
    if (sidc.substring(10, 16) == icons[i].code) {
      this.mdcSelects[".icon"].selectedIndex = i;
      break;
    }
  }

  var icons = this.standardJSON[sidc.substring(4, 6)]["modifier 1"] || [];
  for (var i = 0; i < icons.length; i++) {
    if (sidc.substring(16, 18) == icons[i].code) {
      this.mdcSelects[".icon-modifier-1"].selectedIndex = i;
      break;
    }
  }

  var icons = this.standardJSON[sidc.substring(4, 6)]["modifier 2"] || [];
  for (var i = 0; i < icons.length; i++) {
    if (sidc.substring(18, 20) == icons[i].code) {
      this.mdcSelects[".icon-modifier-2"].selectedIndex = i;
      break;
    }
  }
  this.mdcSelects[".icon-modifier-2"].emit("MDCSelect:change");

  return this;
};
export default numberPanel;
