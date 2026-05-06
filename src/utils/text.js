export function fitPixiTextToBox(
  textObject,
  value,
  maxWidth,
  baseFontSize = 18,
  minFontSize = 11,
) {
  if (!textObject) return;

  textObject.text = value;
  textObject.style.fontSize = baseFontSize;

  let size = baseFontSize;

  while (textObject.width > maxWidth && size > minFontSize) {
    size -= 1;
    textObject.style.fontSize = size;
  }
}
