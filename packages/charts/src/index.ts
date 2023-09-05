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
import "./components/SeriesElement";
import "./components/DataAreaElement";

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
  await customElements.whenDefined("x-series");
  await customElements.whenDefined("y-series");
  await customElements.whenDefined("z-series");
  await customElements.whenDefined("i-series");
  await customElements.whenDefined("j-series");
  await customElements.whenDefined("data-area");
})().catch((reason) => {
  console.error(reason);
});
