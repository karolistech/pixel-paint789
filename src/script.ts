const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
const ctx = canvas.getContext("2d")!;

const gridSizeLabel = document.querySelector<HTMLLabelElement>("label[for='grid-size']")!;
const gridSizeInput = document.querySelector<HTMLInputElement>("#grid-size")!;

const gridSizes = [8, 16, 32, 48, 64] as const;

const state = {
  gridSize: gridSizes[gridSizeInput.valueAsNumber],
  canvasSize: 576,
  canvasColor: "#fff",
  gridlinesColor: "#aaa",
};

function drawCanvas() {
  const size = state.gridSize;
  const scale = state.canvasSize / size;

  canvas.width = state.canvasSize + 1;
  canvas.height = state.canvasSize + 1;

  ctx.fillStyle = state.canvasColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = state.gridlinesColor;

  for (let i = 0; i <= size; i++) {
    const p = i * scale;

    ctx.fillRect(p, 0, 1, canvas.height);
    ctx.fillRect(0, p, canvas.width, 1);
  }
}

function updateGridSize(e: Event) {
  const index = gridSizeInput.valueAsNumber;
  const gridSize = gridSizes[index];

  gridSizeLabel.textContent = `Grid Size: ${gridSize} x ${gridSize}`;

  if (e.type === "change") {
    state.gridSize = gridSize;
    drawCanvas();
  }
}

function setupEvents() {
  gridSizeInput.addEventListener("input", updateGridSize);
  gridSizeInput.addEventListener("change", updateGridSize);
}

function init() {
  drawCanvas();
  setupEvents();
}

init();
