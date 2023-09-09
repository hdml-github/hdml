/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "./helpers/mobserver";
import "./helpers/robserver";
import "./components/HdmlViewElement";
import "./components/CartesianPlaneElement";
import "./components/PolarPlaneElement";
import "./components/OrdinalScaleElement";
import "./components/LinearScaleElement";
import "./components/ChromaticScaleElement";
import "./components/HorizontalAxisElement";
import "./components/HorizontalAxisTickElement";
import "./components/VerticalAxisElement";
import "./components/VerticalAxisTickElement";
import "./components/DataAreaElement";
import "./components/DataLineElement";
import "./components/DataPointElement";

(async () => {
  await customElements.whenDefined("hdml-view");
  await customElements.whenDefined("polar-plane");
  await customElements.whenDefined("cartesian-plane");
  await customElements.whenDefined("ordinal-scale");
  await customElements.whenDefined("linear-scale");
  await customElements.whenDefined("chromatic-scale");
  await customElements.whenDefined("horizontal-axis");
  await customElements.whenDefined("horizontal-axis-tick");
  await customElements.whenDefined("vertical-axis");
  await customElements.whenDefined("vertical-axis-tick");
  await customElements.whenDefined("data-area");
  await customElements.whenDefined("data-line");
  await customElements.whenDefined("data-point");
})().catch((reason) => {
  console.error(reason);
});
