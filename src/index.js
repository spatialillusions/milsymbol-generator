import * as mdc from "material-components-web";
import "material-components-web/dist/material-components-web.min.css";
// At the moment use our development version of milsymbol
import ms from "../../milsymbol/dist/milsymbol.js";

import initLetterPanel from "./init-letter-panel.js";
import renderSymbol from "./render-symbol.js";

//Make sure symbol are centered
ms.addSymbolPart(function squareIcon() {
  var gbbox = new ms.BBox();
  var anchor = { x: 100, y: 100 };
  var maxx = Math.max(anchor.x - this.bbox.x1, this.bbox.x2 - anchor.x);
  gbbox.x1 = anchor.x - maxx;
  gbbox.x2 = anchor.x + maxx;
  return { pre: [], post: [], bbox: gbbox };
});

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

  mdc.autoInit();

  // Set up event listeners for all option inputs
  var optionFields = {};
  document
    .querySelectorAll(".option-inputs .mdc-text-field")
    .forEach(function(elm) {
      var id = elm.querySelector(".mdc-text-field__input").getAttribute("id");
      //optionFields[id] = new mdc.textField.MDCTextField(elm);
      window.elm = elm;
      optionFields[id] = elm.MDCTextField;
      optionFields[id].listen("keyup", function() {
        renderSymbol();
      });
    });

  initLetterPanel("2525c");
  initLetterPanel("app6b");
}
