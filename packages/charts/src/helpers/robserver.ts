/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { debounce } from "throttle-debounce";

const dispatchDelayed = debounce(50, () => {
  window.dispatchEvent(
    new CustomEvent("styles-changed", {
      cancelable: false,
      composed: false,
      bubbles: false,
    }),
  );
});

export const robserver = new ResizeObserver(() => {
  dispatchDelayed();
});

function cb(): void {
  robserver.observe(document.body);
  document.removeEventListener("load", cb);
}

window.addEventListener("load", cb);
