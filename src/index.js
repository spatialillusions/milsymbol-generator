import * as mdc from "material-components-web";
import "material-components-web/dist/material-components-web.min.css";
// At the moment use our development version of milsymbol
import ms from "../../milsymbol/dist/milsymbol.js";
import milstd from "../../milsymbol/dist/milstd.js";

function addSelectItem(mdcSelect, htmlSelect, value, text, sidc) {
  var item = document.createElement("div");
  item.classList.add("mdc-list-item");
  item.textContent = text;
  item.id = value;
  item.setAttribute("role", "option");
  if (mdcSelect) mdcSelect.appendChild(item);
}
function setSelectedIndex(mdcSelect, htmlSelect, index) {
  //mdc-select__label mdc-select__label--float-above
}
function intiSelect(panel, className, options) {
  var selectElement = panel.querySelector(className + " .mdc-select");
  selectElement
    .querySelector(".mdc-select__label")
    .classList.add("mdc-select__label--float-above");

  var selectItems = panel.querySelector(className + " .mdc-menu__items");
  for (var i = 0; i < options.length; i++) {
    addSelectItem(selectItems, false, options[i][0], options[i][1]);
  }

  var mdcSelect = new mdc.select.MDCSelect(selectElement);
  mdcSelect.selectedIndex = 0;
  mdcSelect.listen("MDCSelect:change", () => {
    alert(
      `Selected "${mdcSelect.selectedOptions[0].textContent}" at index ${
        mdcSelect.selectedIndex
      } ` + `with value "${mdcSelect.value}"`
    );
  });
}
function milstd2525cInit() {
  var selectElement, selectItems, mdcSelect;
  var panel = document.querySelector(".mil-std-2525c");
  panel.querySelector(".symbol").innerHTML = new ms.Symbol("SHGAEWMA-------", {
    size: 100
  }).asSVG();
  intiSelect(panel, ".coding-scheme", [
    ["S", "Warfighting"],
    ["I", "Intelligence"],
    ["O", "Stability Operations"],
    ["E", "Emergency Management Symbols"]
  ]);
  intiSelect(panel, ".affiliation", [
    ["P", "Pending"],
    ["U", "Unknown"],
    ["A", "Assumed Friend"],
    ["F", "Friend"],
    ["N", "Neutral"],
    ["S", "Suspect"],
    ["H", "Hostile"],
    ["G", "Exercise Pending"],
    ["W", "Exercise Unknown"],
    ["D", "Exercise Friend"],
    ["L", "Exercise Neutral"],
    ["M", "Exercise Assumed Friend"],
    ["J", "Joker"],
    ["K", "Faker"],
    ["O", "None Specified"]
  ]);
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
