/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

export const robserver = new ResizeObserver(() => {
  window.dispatchEvent(
    new CustomEvent("styles-changed", {
      cancelable: false,
      composed: false,
      bubbles: false,
    }),
  );
});

function cb(): void {
  robserver.observe(document.body);
  document.removeEventListener("load", cb);
}

window.addEventListener("load", cb);
