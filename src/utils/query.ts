/**
 * Function to find the scroll parent of a given HTML element
 * @param element - The HTML element for which to find the scroll parent
 * @returns The scroll parent of the given HTML element
 */
export function getScrollParent(element: HTMLElement) {
  var style = getComputedStyle(element),
    excludeStaticParent = style.position === "absolute",
    overflowRegex = /(auto|scroll)/;

  if (style.position !== "fixed")
    for (
      var parent: HTMLElement | null = element;
      (parent = parent.parentElement);

    ) {
      style = getComputedStyle(parent);
      if (excludeStaticParent && style.position === "static") continue;
      if (
        overflowRegex.test(style.overflow + style.overflowY + style.overflowX)
      )
        return parent;
    }

  return window;
}