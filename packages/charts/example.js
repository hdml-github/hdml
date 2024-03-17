const q = window.q = document.getElementById("query");
q.query();
q.addEventListener("hdml-data", (event) => {
  window.res = event.detail.table;

  const numRows = event.detail.table.numRows;
  const labels = res.getChild("label");
  const avgAmazonVolumes = res.getChild("avg_amazon_volume");
  const avgAppleVolumes = res.getChild("avg_apple_volume");
  const avgGoogleVolumes = res.getChild("avg_google_volume");
  const avgMicrosoftVolumes = res.getChild("avg_microsoft_volume");
  const avgNetflixVolumes = res.getChild("avg_netflix_volume");

  const min = {
    avgAmazonDate: labels.get(0),
    avgAmazonVolume: +avgAmazonVolumes.get(0),
    avgAppleDate: labels.get(0),
    avgAppleVolume: +avgAppleVolumes.get(0),
    avgGoogleDate: labels.get(0),
    avgGoogleVolume: +avgGoogleVolumes.get(0),
    avgMicrosoftDate: labels.get(0),
    avgMicrosoftVolume: +avgMicrosoftVolumes.get(0),
    avgNetflixDate: labels.get(0),
    avgNetflixVolume: +avgNetflixVolumes.get(0),
  };
  const max = {
    avgAmazonDate: labels.get(0),
    avgAmazonVolume: +avgAmazonVolumes.get(0),
    avgAppleDate: labels.get(0),
    avgAppleVolume: +avgAppleVolumes.get(0),
    avgGoogleDate: labels.get(0),
    avgGoogleVolume: +avgGoogleVolumes.get(0),
    avgMicrosoftDate: labels.get(0),
    avgMicrosoftVolume: +avgMicrosoftVolumes.get(0),
    avgNetflixDate: labels.get(0),
    avgNetflixVolume: +avgNetflixVolumes.get(0),
  };

  for(let i = 1; i < numRows; i++) {
    if (+avgAmazonVolumes.get(i) < min.avgAmazonVolume) {
      min.avgAmazonDate = labels.get(i);
      min.avgAmazonVolume = +avgAmazonVolumes.get(i);
    } else if (+avgAmazonVolumes.get(i) > max.avgAmazonVolume) {
      max.avgAmazonDate = labels.get(i);
      max.avgAmazonVolume = +avgAmazonVolumes.get(i);
    }
    if (+avgAppleVolumes.get(i) < min.avgAppleVolume) {
      min.avgAppleDate = labels.get(i);
      min.avgAppleVolume = +avgAppleVolumes.get(i);
    } else if (+avgAppleVolumes.get(i) > max.avgAppleVolume) {
      max.avgAppleDate = labels.get(i);
      max.avgAppleVolume = +avgAppleVolumes.get(i);
    }
    if (+avgGoogleVolumes.get(i) < min.avgGoogleVolume) {
      min.avgGoogleDate = labels.get(i);
      min.avgGoogleVolume = +avgGoogleVolumes.get(i);
    } else if (+avgGoogleVolumes.get(i) > max.avgGoogleVolume) {
      max.avgGoogleDate = labels.get(i);
      max.avgGoogleVolume = +avgGoogleVolumes.get(i);
    }
    if (+avgMicrosoftVolumes.get(i) < min.avgMicrosoftVolume) {
      min.avgMicrosoftDate = labels.get(i);
      min.avgMicrosoftVolume = +avgMicrosoftVolumes.get(i);
    } else if (+avgMicrosoftVolumes.get(i) > max.avgMicrosoftVolume) {
      max.avgMicrosoftDate = labels.get(i);
      max.avgMicrosoftVolume = +avgMicrosoftVolumes.get(i);
    }
    if (+avgNetflixVolumes.get(i) < min.avgNetflixVolume) {
      min.avgNetflixDate = labels.get(i);
      min.avgNetflixVolume = +avgNetflixVolumes.get(i);
    } else if (+avgNetflixVolumes.get(i) > max.avgNetflixVolume) {
      max.avgNetflixDate = labels.get(i);
      max.avgNetflixVolume = +avgNetflixVolumes.get(i);
    }
  }

  const minScale = Math.min(
    min.avgAmazonVolume,
    min.avgAppleVolume,
    min.avgGoogleVolume,
    min.avgMicrosoftVolume,
    min.avgNetflixVolume,
  );
  const maxScale = Math.max(
    max.avgAmazonVolume,
    max.avgAppleVolume,
    max.avgGoogleVolume,
    max.avgMicrosoftVolume,
    max.avgNetflixVolume,
  );

  const labelsAttrValues = JSON.stringify(res.getChild("label").toArray());

  // Scale X
  document
    .querySelector("hdml-view ordinal-scale")
    .setAttribute("values", labelsAttrValues);

  // X-axis
  document
    .querySelector("hdml-view horizontal-axis-grid[dimension=x]")
    .setAttribute("values", labelsAttrValues);
  document
    .querySelector("hdml-view horizontal-axis-tick[dimension=x]")
    .setAttribute("values", labelsAttrValues);
  document
    .querySelector("hdml-view horizontal-axis-tick.labels[dimension=x]")
    .setAttribute("values", labelsAttrValues);

  // Scale Y
  document
    .querySelector("hdml-view linear-scale")
    .setAttribute("min", minScale);
  document
    .querySelector("hdml-view linear-scale")
    .setAttribute("max", maxScale);

  // Lines
  document
    .querySelector("hdml-view data-line.amazon")
    .setAttribute("x", labelsAttrValues);
  document
    .querySelector("hdml-view data-line.amazon")
    .setAttribute("y", avgAmazonVolumes.toString());
  document
    .querySelector("hdml-view data-line.apple")
    .setAttribute("x", labelsAttrValues);
  document
    .querySelector("hdml-view data-line.apple")
    .setAttribute("y", avgAppleVolumes.toString());
  document
    .querySelector("hdml-view data-line.google")
    .setAttribute("x", labelsAttrValues);
  document
    .querySelector("hdml-view data-line.google")
    .setAttribute("y", avgGoogleVolumes.toString());
  document
    .querySelector("hdml-view data-line.microsoft")
    .setAttribute("x", labelsAttrValues);
  document
    .querySelector("hdml-view data-line.microsoft")
    .setAttribute("y", avgMicrosoftVolumes.toString());
  document
    .querySelector("hdml-view data-line.netflix")
    .setAttribute("x", labelsAttrValues);
  document
    .querySelector("hdml-view data-line.netflix")
    .setAttribute("y", avgNetflixVolumes.toString());

  // Points (max)
  document
    .querySelector("hdml-view data-point.amazon")
    .setAttribute("x", `["${max.avgAmazonDate}"]`);
  document
    .querySelector("hdml-view data-point.amazon")
    .setAttribute("y", `[${max.avgAmazonVolume}]`);
  document
    .querySelector("hdml-view data-point.apple")
    .setAttribute("x", `["${max.avgAppleDate}"]`);
  document
    .querySelector("hdml-view data-point.apple")
    .setAttribute("y", `[${max.avgAppleVolume}]`);
  document
    .querySelector("hdml-view data-point.google")
    .setAttribute("x", `["${max.avgGoogleDate}"]`);
  document
    .querySelector("hdml-view data-point.google")
    .setAttribute("y", `[${max.avgGoogleVolume}]`);
  document
    .querySelector("hdml-view data-point.microsoft")
    .setAttribute("x", `["${max.avgMicrosoftDate}"]`);
  document
    .querySelector("hdml-view data-point.microsoft")
    .setAttribute("y", `[${max.avgMicrosoftVolume}]`);
  document
    .querySelector("hdml-view data-point.netflix")
    .setAttribute("x", `["${max.avgNetflixDate}"]`);
  document
    .querySelector("hdml-view data-point.netflix")
    .setAttribute("y", `[${max.avgNetflixVolume}]`);

  // Labels (max)
  document
    .querySelector("hdml-view data-point.labels.amazon")
    .setAttribute("x", `["${max.avgAmazonDate}"]`);
  document
    .querySelector("hdml-view data-point.labels.amazon")
    .setAttribute("y", `[${max.avgAmazonVolume}]`);
    document
      .querySelector("hdml-view data-point.labels.apple")
      .setAttribute("x", `["${max.avgAppleDate}"]`);
    document
      .querySelector("hdml-view data-point.labels.apple")
      .setAttribute("y", `[${max.avgAppleVolume}]`);
    document
      .querySelector("hdml-view data-point.labels.google")
      .setAttribute("x", `["${max.avgGoogleDate}"]`);
    document
      .querySelector("hdml-view data-point.labels.google")
      .setAttribute("y", `[${max.avgGoogleVolume}]`);
    document
      .querySelector("hdml-view data-point.labels.microsoft")
      .setAttribute("x", `["${max.avgMicrosoftDate}"]`);
    document
      .querySelector("hdml-view data-point.labels.microsoft")
      .setAttribute("y", `[${max.avgMicrosoftVolume}]`);
    document
      .querySelector("hdml-view data-point.labels.netflix")
      .setAttribute("x", `["${max.avgNetflixDate}"]`);
    document
      .querySelector("hdml-view data-point.labels.netflix")
      .setAttribute("y", `[${max.avgNetflixVolume}]`);
});