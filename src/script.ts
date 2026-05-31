const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
const ctx = canvas.getContext("2d")!;

const gridSizeLabel = document.querySelector<HTMLLabelElement>("label[for='grid-size']")!;
const gridSizeInput = document.querySelector<HTMLInputElement>("#grid-size")!;

const gridSizes = [8, 16, 32, 48, 64] as const;

const state = {
  canvasSize: 576,
  canvasColor: "#fff",
  gridSize: gridSizes[gridSizeInput.valueAsNumber],
  gridlinesColor: "#aaa",
};

function renderCanvas() {
  const cellSize = state.canvasSize / state.gridSize;

  ctx.fillStyle = state.canvasColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();

  for (let i = 0; i <= state.gridSize; i++) {
    const pos = i * cellSize;

    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, canvas.height);

    ctx.moveTo(0, pos);
    ctx.lineTo(canvas.width, pos);
  }

  ctx.strokeStyle = state.gridlinesColor;
  ctx.stroke();
}

function updateGridSize(e: Event) {
  const gridSize = gridSizes[gridSizeInput.valueAsNumber];

  gridSizeLabel.textContent = `Grid Size: ${gridSize} x ${gridSize}`;

  if (e.type === "change") {
    state.gridSize = gridSize;
    renderCanvas();
  }
}

function setupEvents() {
  gridSizeInput.addEventListener("input", updateGridSize);
  gridSizeInput.addEventListener("change", updateGridSize);
}

function init() {
  canvas.width = state.canvasSize;
  canvas.height = state.canvasSize;

  renderCanvas();
  setupEvents();
}

init();
