//import { select } from "material-components-web";
import mdc from "material-components-web/dist/material-components-web.min.js";
var select = mdc.select;
import addSelectItem from "../add-select-item.js";

export default function initSelect(
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
    var selectItems = panel.querySelector(className + " .mdc-menu__items");
    while (selectItems.firstChild) {
      selectItems.removeChild(selectItems.firstChild);
    }
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

  if (selectedIndex == -1 || selectedIndex > mdcSelect.options.length)
    selectedIndex = 0;
  mdcSelect.selectedIndex = selectedIndex || 0;
  return mdcSelect;
}
