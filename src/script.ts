const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
const ctx = canvas.getContext("2d")!;

const paintColorInput = document.querySelector<HTMLInputElement>("#paint-color")!;
const gridSizeLabel = document.querySelector<HTMLLabelElement>("label[for='grid-size']")!;
const gridSizeInput = document.querySelector<HTMLInputElement>("#grid-size")!;

const gridSizes = [8, 16, 32, 48, 64] as const;

type PaintingMode = "custom-color" | "random-color" | "eraser";

const state = {
  gridSize: gridSizes[gridSizeInput.valueAsNumber],
  canvasSize: 576,
  canvasColor: "#fff",
  gridlinesColor: "#aaa",
  paintingMode: "custom-color" as PaintingMode,
  paintColor: paintColorInput.value,
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

function updatePaintColor() {
  state.paintColor = paintColorInput.value;
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

function paint(e: PointerEvent) {
  if (e.buttons !== 1) return;

  const rect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const cellSize = state.canvasSize / state.gridSize;

  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  const drawX = col * cellSize + 1;
  const drawY = row * cellSize + 1;

  const fillSize = cellSize - 1;

  switch (state.paintingMode) {
    case "custom-color":
      ctx.fillStyle = state.paintColor;
      break;
  }

  ctx.fillRect(drawX, drawY, fillSize, fillSize);
}

function setupEvents() {
  canvas.addEventListener("pointerdown", paint);
  canvas.addEventListener("pointermove", paint);
  paintColorInput.addEventListener("input", updatePaintColor);
  gridSizeInput.addEventListener("input", updateGridSize);
  gridSizeInput.addEventListener("change", updateGridSize);
}

function init() {
  drawCanvas();
  setupEvents();
}

init();
