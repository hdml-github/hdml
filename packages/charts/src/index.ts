/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import "./components/HdmlViewElement";
import "./components/CartesianPlaneElement";
import "./components/PolarPlaneElement";
import "./components/OrdinalScaleElement";
import "./components/LinearScaleElement";
import "./components/ChromaticScaleElement";
import "./components/HorizontalAxisElement";
import "./components/VerticalAxisElement";
import "./components/AxisGridElement";
import "./components/AxisTickElement";
import "./components/TickLabelElement";
import "./components/AxisTitleElement";

(async () => {
  await customElements.whenDefined("hdml-view");
  await customElements.whenDefined("polar-plane");
  await customElements.whenDefined("cartesian-plane");
  await customElements.whenDefined("ordinal-scale");
  await customElements.whenDefined("linear-scale");
  await customElements.whenDefined("chromatic-scale");
  await customElements.whenDefined("horizontal-axis");
  await customElements.whenDefined("vertical-axis");
  await customElements.whenDefined("axis-grid");
  await customElements.whenDefined("axis-tick");
  await customElements.whenDefined("tick-label");
  await customElements.whenDefined("axis-title");
})().catch((reason) => {
  console.error(reason);
});
