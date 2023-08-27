function axisEventListener(event) {
  console.log(event.type, event.datum);
}

function tickEventListener(event) {
  console.log(event.type, event.datum);
}

const horizontal = window.document.querySelector("horizontal-axis");
horizontal.addEventListener("mouseenter", axisEventListener);
horizontal.addEventListener("mouseleave", axisEventListener);
horizontal.addEventListener("mousemove", axisEventListener);
horizontal.addEventListener("mouseover", axisEventListener);
horizontal.addEventListener("mouseout", axisEventListener);
horizontal.addEventListener("mousedown", axisEventListener);
horizontal.addEventListener("mouseup", axisEventListener);
horizontal.addEventListener("click", axisEventListener);
horizontal.addEventListener("focus", axisEventListener);
horizontal.addEventListener("blur", axisEventListener);

const horizontalTick = window.document.querySelector("horizontal-axis-tick");
horizontalTick.addEventListener("mouseenter", tickEventListener);
horizontalTick.addEventListener("mouseleave", tickEventListener);
horizontalTick.addEventListener("mousemove", tickEventListener);
horizontalTick.addEventListener("mouseover", tickEventListener);
horizontalTick.addEventListener("mouseout", tickEventListener);
horizontalTick.addEventListener("mousedown", tickEventListener);
horizontalTick.addEventListener("mouseup", tickEventListener);
horizontalTick.addEventListener("click", tickEventListener);
horizontalTick.addEventListener("focus", tickEventListener);
horizontalTick.addEventListener("blur", tickEventListener);

const vertical = window.document.querySelector("vertical-axis");
vertical.addEventListener("mouseenter", axisEventListener);
vertical.addEventListener("mouseleave", axisEventListener);
vertical.addEventListener("mousemove", axisEventListener);
vertical.addEventListener("mouseover", axisEventListener);
vertical.addEventListener("mouseout", axisEventListener);
vertical.addEventListener("mousedown", axisEventListener);
vertical.addEventListener("mouseup", axisEventListener);
vertical.addEventListener("click", axisEventListener);
vertical.addEventListener("focus", axisEventListener);
vertical.addEventListener("blur", axisEventListener);

const verticalTick = window.document.querySelector("vertical-axis-tick");
verticalTick.addEventListener("mouseenter", tickEventListener);
verticalTick.addEventListener("mouseleave", tickEventListener);
verticalTick.addEventListener("mousemove", tickEventListener);
verticalTick.addEventListener("mouseover", tickEventListener);
verticalTick.addEventListener("mouseout", tickEventListener);
verticalTick.addEventListener("mousedown", tickEventListener);
verticalTick.addEventListener("mouseup", tickEventListener);
verticalTick.addEventListener("click", tickEventListener);
verticalTick.addEventListener("focus", tickEventListener);
verticalTick.addEventListener("blur", tickEventListener);
