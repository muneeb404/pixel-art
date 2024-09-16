// Initial references
const container = document.querySelector(".container");
const gridButton = document.getElementById("submit-grid");
const clearGridButton = document.getElementById("clear-grid");
const gridWidth = document.getElementById("width-range");
const gridHeight = document.getElementById("height-range");
const colorButton = document.getElementById("color-input");
const eraseBtn = document.getElementById("erase-btn");
const paintBtn = document.getElementById("paint-btn");
const widthValue = document.getElementById("width-value");
const heightValue = document.getElementById("height-value");

// Events object
const events = {
  mouse: { down: "mousedown", move: "mousemove", up: "mouseup" },
  touch: { down: "touchstart", move: "touchmove", up: "touchend" },
};

let deviceType = "";
let draw = false;
let erase = false;

// Detect touch device
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};
isTouchDevice();

// Check screen size and set maximum grid width accordingly
const checkScreenSize = () => {
  const screenWidth = window.innerWidth;
  
  // Determine maximum grid width based on screen size
  let maxWidth;
  if (screenWidth < 375) {
    maxWidth = 18;
  } else if (screenWidth < 401) {
    maxWidth = 20;
  } else if (screenWidth < 426) {
    maxWidth = 24;
  } else {
    maxWidth = Infinity; // No limit
  }
  
  // Apply the maximum width constraint
  if (gridWidth.value > maxWidth) {
    gridWidth.value = maxWidth;
    updateWidth();
  }
};

// Event listeners
gridButton.addEventListener("click", createGrid);
clearGridButton.addEventListener("click", () => (container.innerHTML = ""));
eraseBtn.addEventListener("click", () => (erase = true));
paintBtn.addEventListener("click", () => (erase = false));

const debounce = (func, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

gridWidth.addEventListener("input", debounce(updateWidth, 300));
gridHeight.addEventListener("input", debounce(updateHeight, 300));

// Update width and height display
function updateWidth() {
  widthValue.innerHTML = gridWidth.value.padStart(2, '0');
  checkScreenSize(); // Check screen size whenever width is updated
}

function updateHeight() {
  heightValue.innerHTML = gridHeight.value.padStart(2, '0');
}

// Create Grid
function createGrid() {
  checkScreenSize(); // Check the screen size before creating the grid

  container.innerHTML = ""; // Clear previous grid
  const fragment = document.createDocumentFragment(); // Use DocumentFragment for performance
  for (let i = 0; i < gridHeight.value; i++) {
    const row = document.createElement("div");
    row.className = "gridRow";
    for (let j = 0; j < gridWidth.value; j++) {
      const cell = document.createElement("div");
      cell.className = "gridCol";
      row.appendChild(cell);
    }
    fragment.appendChild(row);
  }
  container.appendChild(fragment); // Append all at once

  container.addEventListener(events[deviceType].down, (event) => {
    if (event.target.classList.contains("gridCol")) {
      drawCell(event.target);
    }
  });
}

// Handle drawing/erasing on cells
function drawCell(cell) {
  draw = true;
  cell.style.backgroundColor = erase ? "transparent" : colorButton.value;
}

// Page load initializations
window.onload = () => {
  checkScreenSize(); // Check size on load
  gridWidth.value = 0;
  gridHeight.value = 0;
  updateWidth();
  updateHeight();
};

// Call checkScreenSize whenever the window is resized
window.addEventListener('resize', checkScreenSize);
