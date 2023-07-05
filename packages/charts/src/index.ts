/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Chart, registerables, ChartDataset } from "chart.js";

Chart.register(...registerables);

setTimeout(() => {
  const ctx = <HTMLCanvasElement>document.getElementById("myChart");
  // let updated = false;
  new Chart(ctx, {
    data: {
      datasets: [
        {
          type: "bar",

          xAxisID: "xAxisBar",
          yAxisID: "yAxisBar",
          indexAxis: "x",
          data: [10, 40, 30],

          // barThickness: 15,
          barPercentage: 0.9,
          categoryPercentage: 1,
          borderWidth: [2, 4, 6],
          hoverBorderWidth: [4, 6, 8],
          borderRadius: [2, 4, 6],
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          hoverBorderRadius: [4, 6, 8],
          borderColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          hoverBorderColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
          ],
          hoverBackgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
        },
        // {
        //   type: "bar",

        //   xAxisID: "xAxisBar",
        //   yAxisID: "yAxisBar",
        //   data: [30, 10, 20],

        //   // barThickness: 15,
        //   barPercentage: 0.9,
        //   categoryPercentage: 1,
        //   backgroundColor: [
        //     "rgba(255, 99, 132, 0.2)",
        //     "rgba(255, 159, 64, 0.2)",
        //     "rgba(255, 205, 86, 0.2)",
        //   ],
        //   hoverBackgroundColor: [
        //     "rgba(54, 162, 235, 0.2)",
        //     "rgba(153, 102, 255, 0.2)",
        //     "rgba(201, 203, 207, 0.2)",
        //   ],
        // },
        {
          type: "line",
          label: "Line Dataset",
          xAxisID: "xAxisLine",
          yAxisID: "yAxisLine",
          data: [-50, 50, -50, 50],
        },
        {
          type: "polarArea",
          label: "Polar Dataset",
          // xAxisID: "xAxisRadar",
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          rAxisID: "rAxisRadar",
          data: [11, 16, 7, 3],
        },
      ],
      labels: ["January", "February", "March", "April"],
    },
    options: {
      scales: {
        xAxisBar: {
          type: "category",
          display: true,
          position: "bottom",
          labels: ["January", "February", "March"],
        },
        yAxisBar: {
          type: "logarithmic",
          display: true,
          position: "left",
          min: -100,
          max: 100,
        },
        xAxisLine: {
          type: "category",
          display: true,
          position: "top",
          labels: ["January", "February", "March", "April"],
        },
        yAxisLine: {
          type: "linear",
          display: true,
          position: "right",
          min: -50,
          max: 50,
        },
        rAxisRadar: {
          type: "radialLinear",
          display: true,
          min: 0,
          max: 20,
          pointLabels: {
            display: true,
            // color: "red",
          },
        },
      },
      // events: [
      //   // "mouseenter",
      //   // "mouseover",
      //   "mousemove",
      //   "mouseout",
      //   "click",
      //   "touchstart",
      //   "touchmove",
      // ],
      interaction: {
        mode: "point",
      },
      plugins: {
        title: {
          display: false,
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      onHover(event, elements, chart) {
        console.log(elements);
        // if (elements.length) {
        //   const bgc = <string>(
        //     elements[0].element.options.backgroundColor
        //   );
        //   chart.config.data.datasets[
        //     elements[0].datasetIndex
        //   ].hoverBackgroundColor = "rgb(0, 0, 0)";
        // }
      },
    },
    // plugins: [
    //   {
    //     id: "hdml",
    //     beforeEvent: (chart, args, pluginOptions) => {
    //       // console.log(chart, args, pluginOptions);
    //       console.log(args.event);
    //     },
    //   },
    // ],
  });
}, 10);
