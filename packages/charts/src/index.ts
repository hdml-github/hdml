/**
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables);
Chart.register(ChartDataLabels);

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
        {
          type: "bar",

          xAxisID: "xAxisBar",
          yAxisID: "yAxisBar",
          data: [30, 10, 20, 15],

          // barThickness: 15,
          barPercentage: 0.9,
          categoryPercentage: 1,
        },
        {
          type: "line",
          label: "Line Dataset",
          xAxisID: "xAxisLine",
          yAxisID: "yAxisLine",
          data: [
            { x: 0, y: -50 },
            { x: 2.5, y: 50 },
            { x: 5, y: -50 },
            { x: 10, y: 50 },
          ],
          datalabels: {
            display: true,
            align: "right",
            anchor: "center",
            offset: 15,
            rotation: -0,
            color: "white",
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 3,
            backgroundColor: "grey",
            font: {
              size: 16,
              family: "Arial",
              style: "normal",
              weight: "bold",
              lineHeight: "16px",
            },
          },
        },
        {
          type: "polarArea",
          label: "Polar Dataset",
          // eslint-disable-next-line max-len
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          rAxisID: "rAxisRadar",
          data: [11, 16, 7, 9, 12],
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
          datalabels: {
            align: "center",
            anchor: "center",
            color: "white",
            borderWidth: 1,
            borderColor: "white",
            borderRadius: 3,
            backgroundColor: "red",
            font: {
              size: 16,
              family: "Arial",
              style: "normal",
              weight: "bold",
              lineHeight: "16px",
            },
          },
        },
      ],
      labels: [null, null, null, null, null],
    },
    options: {
      scales: {
        xAxisBar: {
          type: "category",
          stacked: true,
          display: true,
          position: "bottom",
          labels: ["January", "February", "March", "April"],
          title: {
            display: true,
            text: "X axis",
          },
          grid: {
            display: true,
            color: "rgb(0, 255, 0)",

            tickLength: 10,
            tickWidth: 2,
            tickColor: "rgb(0, 0, 255)",
          },
          ticks: {
            align: "center",
            crossAlign: "center",
            padding: 0,
            labelOffset: 0,

            maxTicksLimit: 10,
            color: "rgb(255, 0, 0)",
            showLabelBackdrop: true,
            backdropColor: "rgb(0, 255, 0)",
          },
        },
        yAxisBar: {
          type: "logarithmic",
          stacked: true,
          display: true,
          position: "left",
          min: -100,
          max: 100,
          title: {
            display: true,
            text: "Y axis",
          },
          ticks: {
            color: "rgb(255, 255, 0)",
            showLabelBackdrop: true,
            backdropColor: "rgb(255, 0, 0)",
          },
        },
        xAxisLine: {
          type: "linear",
          display: true,
          position: "top",
          min: 0,
          max: 15,
          // labels: ["one", "two", "three", "four"],
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

          // X axis
          startAngle: 0,
          angleLines: {
            display: true,
            color: "rgb(0, 0, 255)",
            lineWidth: 1,
            // borderDash: () => [13, 8],
          },
          pointLabels: {
            display: true,
            font: {
              size: 16,
              family: "Arial",
              style: "normal",
              weight: "bold",
              lineHeight: "16px",
            },
            color: "white",
            backdropColor: "rgb(0, 0, 255)",
            backdropPadding: 5,
            callback: (label: string, index: number) => {
              return ["January", "February", "March", "April"][index];
            },
            centerPointLabels: true,
            padding: 0,
          },

          // Y axis
          min: 0,
          max: 20,
          grid: {
            display: true,
            circular: true,
            color: "rgb(255, 0, 0)",
            lineWidth: 1,
          },
          ticks: {
            display: true,
            count: 5,
            z: 1,
            font: {
              size: 16,
              family: "Arial",
              style: "normal",
              weight: "bold",
              lineHeight: 1.2,
            },
            color: "white",
            backdropColor: "rgb(255, 0, 0)",
            backdropPadding: 5,
            callback: (scale, value, index) => {
              return `${scale}.0`;
            },
          },
        },
      },
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
        type Parsed = { x: number; y: number } | { r: number };
        if (elements.length > 0) {
          elements.forEach((el) => {
            const meta = chart.getDatasetMeta(el.datasetIndex);
            const parsed = meta._parsed[el.index] as Parsed;
            console.log(meta);
            console.log({
              type: meta.type,

              xAxisID: meta.xAxisID,
              xAxisType: meta.xScale?.type,
              xAxisTicks: meta.xScale?.ticks,

              yAxisID: meta.yAxisID,
              yAxisType: meta.yScale?.type,
              yAxisTicks: meta.yScale?.ticks,

              rAxisID: meta.rAxisID,
              rAxisType: meta.rScale?.type,
              rAxisTicks: meta.rScale?.ticks,

              lAxisID: "lAxisID",
              lAxisType: "lAxisType",
              lAxisTicks: chart.data.labels,

              ...parsed,
            });
          });
        }
      },
    },
    plugins: [ChartDataLabels],
  });
}, 10);
