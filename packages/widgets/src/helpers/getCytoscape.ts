/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */

import cytoscape, { Core } from "cytoscape";

export function getCytoscape(container: HTMLElement): Core {
  const style = window.getComputedStyle(container);
  return cytoscape({
    container,
    zoom: 1,
    zoomingEnabled: false,
    style: [
      // node
      {
        selector: "node",
        style: {
          display: "element",
          width: "80px",
          height: "80px",
          // label: "data(name)",
          "border-width": "1px",
          "border-color": "black",
          "background-color": "white",
          "text-valign": "center",
          "text-halign": "center",
          "font-size": "24px",
          "font-weight": "normal",
          "font-family": `${style.fontFamily}`,
          // @ts-ignore
          "overlay-shape": "ellipse",
        },
      },
      // edge
      {
        selector: "edge",
        style: {
          width: "1px",
          "line-color": "black",
          "curve-style": "straight",
        },
      },
      // edge.target
      {
        selector: "edge.target",
        style: {
          "target-arrow-shape": "vee",
          "target-arrow-color": "black",
          "target-arrow-fill": "filled",
          "arrow-scale": 1.5,
        },
      },
      // edge.source
      {
        selector: "edge.source",
        style: {
          "source-arrow-shape": "vee",
          "source-arrow-color": "black",
          "source-arrow-fill": "filled",
          "arrow-scale": 1,
        },
      },
      // node.table
      {
        selector: "node.table",
        style: {
          width: "150px",
          height: "150px",
          "font-weight": "bold",
          "border-width": "2px",
        },
      },
      // node.field
      {
        selector: ".field",
        style: {
          width: "30px",
          height: "30px",
          "font-size": "18px",
          "text-valign": "top",
          "border-width": "2px",
        },
      },
      // edge.field
      {
        selector: "edge.field",
        style: {
          width: "2px",
          "line-color": "black",
        },
      },
      // node.join
      {
        selector: "node.join",
        style: {
          // display: "none",
          label: "data(type)",
          width: "80px",
          height: "80px",
          "font-size": "18px",
        },
      },
      // edge.join
      {
        selector: "edge.join",
        style: {
          // display: "none",
          "line-style": "dashed",
        },
      },
      // node.clause
      {
        selector: "node.clause",
        style: {
          // display: "none",
          width: "24px",
          height: "24px",
          "font-size": "18px",
        },
      },
      // node.filter.on
      {
        selector: "node.filter.on",
        style: {
          // display: "none",
          width: "25px",
          height: "25px",
          "font-size": "18px",
          "border-style": "dashed",
        },
      },
      // edge.filter.on
      {
        selector: "edge.filter.on",
        style: {
          "line-style": "dashed",
        },
      },
      // node.filter.expr
      {
        selector: "node.filter.expr",
        style: {
          // display: "none", // element
          width: "12px",
          height: "12px",
          "background-color": "black",
          "text-valign": "bottom",
          "font-size": "18px",
        },
      },
    ],
  });
}
