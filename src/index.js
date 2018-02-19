import { select, slider, tabs, textField } from "material-components-web";
import "material-components-web/dist/material-components-web.min.css";
// At the moment use our development version of milsymbol
import {
  app6b,
  milstd2525c,
  milstd2525d,
  app6d
} from "../../milsymbol/dist/milstd.js";

import initLetterPanel from "./init-letter-panel.js";
import initNumberPanel from "./init-number-panel.js";
import renderSymbol from "./render-symbol.js";

export default function initGenerator() {
  var panelInitialized = {};

  var tabBarScroller = new tabs.MDCTabBarScroller(
    document.querySelector("#tab-bar-scroller")
  );

  var panels = document.querySelector(".panels");

  tabBarScroller.tabBar.tabs.forEach(function(tab) {
    tab.preventDefaultOnClick = true;
  });

  function updatePanel(index) {
    if (!panelInitialized[index]) {
      // The panel has never been used so let's start it up
      switch (String(index)) {
        case "0":
          panelInitialized[index] = new initLetterPanel(
            ".panel-2525c",
            milstd2525c,
            "2525"
          );
          break;
        case "1":
          panelInitialized[index] = new initLetterPanel(
            ".panel-app6b",
            app6b,
            "APP6"
          );
          break;
        case "2":
          panelInitialized[index] = new initNumberPanel(
            ".panel-2525d",
            milstd2525d,
            "2525"
          );
          break;
        case "3":
          panelInitialized[index] = new initNumberPanel(
            ".panel-app6d",
            app6d,
            "APP6"
          );
          break;
      }
    }
    var activePanel = panels.querySelector(".panel.active");
    if (activePanel) {
      activePanel.classList.remove("active");
    }
    var newActivePanel = panels.querySelector(
      ".panel:nth-child(" + (Number(index) + 1) + ")"
    );
    if (newActivePanel) {
      newActivePanel.classList.add("active");
    }

    // Save the active panel for next session
    try {
      localStorage.setItem("panel", index);
    } catch (error) {
      console.log("Could not set local storage");
    }
  }

  tabBarScroller.tabBar.listen("MDCTabBar:change", function({ detail: tabs }) {
    var nthChildIndex = tabs.activeTabIndex;
    updatePanel(nthChildIndex);
  });

  var panel;
  try {
    panel = localStorage.getItem("panel");
  } catch (error) {}
  // Activate 2525C by default
  tabBarScroller.tabBar.activeTabIndex = panel || 0;
  updatePanel(panel || 0);

  // Set up event listeners for all option inputs
  var optionFields = {};
  document
    .querySelectorAll(".option-inputs .mdc-text-field")
    .forEach(function(elm) {
      var id = elm.querySelector(".mdc-text-field__input").getAttribute("id");
      optionFields[id] = new textField.MDCTextField(elm);
      //optionFields[id] = elm.MDCTextField;
      optionFields[id].listen("keyup", function() {
        renderSymbol();
      });
    });
  // Set up event listeners for all style inputs
  var styleFields = {};
  document
    .querySelectorAll(".style-inputs .mdc-switch input")
    .forEach(function(elm) {
      elm.addEventListener("change", function() {
        renderSymbol();
      });
    });
  document.querySelectorAll(".style-inputs .mdc-slider").forEach(function(elm) {
    var id = elm.getAttribute("id");
    styleFields[id] = new slider.MDCSlider(elm);
    styleFields[id].listen("MDCSlider:input", function() {
      renderSymbol();
    });
  });
  document.querySelectorAll(".style-inputs .mdc-select").forEach(function(elm) {
    var id = elm.getAttribute("id");
    styleFields[id] = new select.MDCSelect(elm);
    styleFields[id].listen("MDCSelect:change", function() {
      renderSymbol();
    });
  });
}
