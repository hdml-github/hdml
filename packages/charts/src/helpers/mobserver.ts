/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { debounce } from "throttle-debounce";

const dispatchImmediate = () => {
  window.dispatchEvent(
    new CustomEvent("styles-changed", {
      cancelable: false,
      composed: false,
      bubbles: false,
    }),
  );
};

const dispatchDelayed = debounce(50, () => {
  window.dispatchEvent(
    new CustomEvent("styles-changed", {
      cancelable: false,
      composed: false,
      bubbles: false,
    }),
  );
});

const mobserver = new MutationObserver((recs: MutationRecord[]) => {
  let dispatch = false;
  let delayed = false;
  for (const rec of recs) {
    if (rec.type === "attributes") {
      if (rec.attributeName === "style") {
        dispatch = true;
        break;
      }
      if (rec.attributeName === "class") {
        dispatch = true;
        delayed = true;
        break;
      }
    }

    if (rec.type === "childList" && rec.addedNodes.length) {
      for (const node of rec.addedNodes) {
        if (node.nodeName === "STYLE" || node.nodeName === "LINK") {
          dispatch = true;
          break;
        }
      }
      if (dispatch) break;
    }

    if (rec.type === "childList" && rec.removedNodes.length) {
      for (const node of rec.removedNodes) {
        if (node.nodeName === "STYLE" || node.nodeName === "LINK") {
          dispatch = true;
          break;
        }
      }
      if (dispatch) break;
    }
  }

  if (dispatch && delayed) {
    dispatchDelayed();
  } else {
    dispatchImmediate();
  }
});

mobserver.observe(document, {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ["class", "style"],
});
