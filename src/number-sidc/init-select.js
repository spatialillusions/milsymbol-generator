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
  if (Array.isArray(options) && options.length == 0) {
    // If options is an empty array, set it to undefined
    options = undefined;
  }
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
  if (Array.isArray(options)) {
    for (var i = 0; i < options.length; i++) {
      var name = options[i].name;
      if (options[i].hasOwnProperty("entity")) {
        options[i].name = [options[i]["entity"]];
        if (options[i].hasOwnProperty("entity type"))
          options[i].name.push(options[i]["entity type"]);
        if (options[i].hasOwnProperty("entity subtype"))
          options[i].name.push(options[i]["entity subtype"]);

        var name =
          "<em>" +
          options[i].name
            .slice(0, -1)
            .concat([""])
            .join(" -&nbsp;") +
          "</em>" +
          options[i].name.slice(-1);
      }
      if (options[i].hasOwnProperty("modifier")) {
        var name = options[i].modifier;
      }

      var sidc = options[i].sidc;

      items += addSelectItem(
        selectItems,
        false,
        options[i].code,
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
