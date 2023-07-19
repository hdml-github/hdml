/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

const mobserver = new MutationObserver((recs: MutationRecord[]) => {
  let dispatch = false;
  for (const rec of recs) {
    dispatch =
      dispatch ||
      (rec.type === "attributes" &&
        (rec.attributeName === "class" ||
          rec.attributeName === "style"));

    if (dispatch) continue;

    if (rec.type === "childList" && rec.addedNodes.length) {
      for (const node of rec.addedNodes) {
        if (node.nodeName === "STYLE" || node.nodeName === "LINK") {
          dispatch = true;
          continue;
        }
      }
      if (dispatch) continue;
    }

    if (rec.type === "childList" && rec.removedNodes.length) {
      for (const node of rec.removedNodes) {
        if (node.nodeName === "STYLE" || node.nodeName === "LINK") {
          dispatch = true;
          continue;
        }
      }
      if (dispatch) continue;
    }
  }

  dispatch &&
    window.dispatchEvent(
      new CustomEvent("styles-changed", {
        cancelable: false,
        composed: false,
        bubbles: false,
      }),
    );
});

mobserver.observe(document, {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ["class", "style"],
});
