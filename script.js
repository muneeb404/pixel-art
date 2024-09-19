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
const downloadIcon = document.getElementById("download-icon");

const cellSize = 20; // Size of each pixel cell in the canvas

// Events object for touch and mouse
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
  
  let maxWidth;
  if (screenWidth < 375) {
    maxWidth = 18;
  } else if (screenWidth < 401) {
    maxWidth = 20;
  } else if (screenWidth < 426) {
    maxWidth = 24;
  } else {
    maxWidth = Infinity;
  }
  
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

// Debounce utility function to limit rapid function calls
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
  checkScreenSize(); 
}

function updateHeight() {
  heightValue.innerHTML = gridHeight.value.padStart(2, '0');
}

// Create Grid
function createGrid() {
  checkScreenSize();

  container.innerHTML = ""; // Clear previous grid
  const fragment = document.createDocumentFragment();
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
  container.appendChild(fragment);

  container.addEventListener(events[deviceType].down, (event) => {
    if (event.target.classList.contains("gridCol")) {
      drawCell(event.target);
    }
  });
}

// Handle drawing/erasing on cells
function drawCell(cell) {
  draw = true;
  if (erase) {
    cell.style.backgroundColor = "transparent"; // Set erased pixels to transparent
  } else {
    cell.style.backgroundColor = colorButton.value;
  }
}

// Download the grid as a PNG image
downloadIcon.addEventListener('click', () => {
  if (container.children.length === 0) {
    alert("Please create a grid first!");
    return;
  }

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Get rows and columns
  const rows = document.querySelectorAll('.gridRow');
  const cols = rows[0].querySelectorAll('.gridCol').length;

  // Set canvas size based on grid dimensions
  canvas.width = cols * cellSize;
  canvas.height = rows.length * cellSize;

  // Draw each cell onto the canvas
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('.gridCol');
    cells.forEach((cell, colIndex) => {
      const color = cell.style.backgroundColor;
      if (color === "transparent" || color === "") {
        // If the cell is erased, ensure transparency in the canvas
        ctx.clearRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
      } else {
        // Draw the filled cells
        ctx.fillStyle = color;
        ctx.fillRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
      }
    });
  });

  // Convert canvas to PNG and download
  const link = document.createElement('a');
  link.download = 'pixel-art.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Initialize on page load
window.onload = () => {
  checkScreenSize();
  gridWidth.value = 0;
  gridHeight.value = 0;
  updateWidth();
  updateHeight();
};

// Handle window resize
window.addEventListener('resize', checkScreenSize);
