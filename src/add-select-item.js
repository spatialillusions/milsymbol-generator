import ms from "milsymbol";

export default function addSelectItem(
  mdcSelect,
  htmlSelect,
  value,
  text,
  sidc,
  standard
) {
  var item = "<li ";
  item += 'class="mdc-list-item" ';
  if (sidc) {
    var symbol = new ms.Symbol(sidc, {
      size: 20,
      standard: standard || "2525",
      symetric: true
    });
    if (!symbol.isValid()) {
      item += 'aria-disabled="true" ';
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
