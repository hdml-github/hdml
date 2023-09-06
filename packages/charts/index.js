function eventListener(event) {
  console.log(event.type, event.datum);
}

const horizontal = window.document.querySelector("horizontal-axis");
horizontal.addEventListener("mouseenter", eventListener);
horizontal.addEventListener("mouseleave", eventListener);
horizontal.addEventListener("mousemove", eventListener);
horizontal.addEventListener("mouseover", eventListener);
horizontal.addEventListener("mouseout", eventListener);
horizontal.addEventListener("mousedown", eventListener);
horizontal.addEventListener("mouseup", eventListener);
horizontal.addEventListener("click", eventListener);
horizontal.addEventListener("focus", eventListener);
horizontal.addEventListener("blur", eventListener);

const horizontalTick = window.document.querySelector("horizontal-axis-tick");
horizontalTick.addEventListener("mouseenter", eventListener);
horizontalTick.addEventListener("mouseleave", eventListener);
horizontalTick.addEventListener("mousemove", eventListener);
horizontalTick.addEventListener("mouseover", eventListener);
horizontalTick.addEventListener("mouseout", eventListener);
horizontalTick.addEventListener("mousedown", eventListener);
horizontalTick.addEventListener("mouseup", eventListener);
horizontalTick.addEventListener("click", eventListener);
horizontalTick.addEventListener("focus", eventListener);
horizontalTick.addEventListener("blur", eventListener);

const vertical = window.document.querySelector("vertical-axis");
vertical.addEventListener("mouseenter", eventListener);
vertical.addEventListener("mouseleave", eventListener);
vertical.addEventListener("mousemove", eventListener);
vertical.addEventListener("mouseover", eventListener);
vertical.addEventListener("mouseout", eventListener);
vertical.addEventListener("mousedown", eventListener);
vertical.addEventListener("mouseup", eventListener);
vertical.addEventListener("click", eventListener);
vertical.addEventListener("focus", eventListener);
vertical.addEventListener("blur", eventListener);

const verticalTick = window.document.querySelector("vertical-axis-tick");
verticalTick.addEventListener("mouseenter", eventListener);
verticalTick.addEventListener("mouseleave", eventListener);
verticalTick.addEventListener("mousemove", eventListener);
verticalTick.addEventListener("mouseover", eventListener);
verticalTick.addEventListener("mouseout", eventListener);
verticalTick.addEventListener("mousedown", eventListener);
verticalTick.addEventListener("mouseup", eventListener);
verticalTick.addEventListener("click", eventListener);
verticalTick.addEventListener("focus", eventListener);
verticalTick.addEventListener("blur", eventListener);

const dataArea = window.document.querySelector("data-area");
dataArea.addEventListener("mouseenter", eventListener);
dataArea.addEventListener("mouseleave", eventListener);
dataArea.addEventListener("mousemove", eventListener);
dataArea.addEventListener("mouseover", eventListener);
dataArea.addEventListener("mouseout", eventListener);
dataArea.addEventListener("mousedown", eventListener);
dataArea.addEventListener("mouseup", eventListener);
dataArea.addEventListener("click", eventListener);
dataArea.addEventListener("focus", eventListener);
dataArea.addEventListener("blur", eventListener);
