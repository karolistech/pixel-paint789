const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
const ctx = canvas.getContext("2d")!;

const canvasColorInput = document.querySelector<HTMLInputElement>("#canvas-color")!;
const paintColorInput = document.querySelector<HTMLInputElement>("#paint-color")!;
const gridSizeLabel = document.querySelector<HTMLLabelElement>("label[for='grid-size']")!;
const gridSizeInput = document.querySelector<HTMLInputElement>("#grid-size")!;

const customColorBtn = document.querySelector<HTMLButtonElement>(".controls__btn--custom-color")!;
const randomColorBtn = document.querySelector<HTMLButtonElement>(".controls__btn--random-color")!;
const eraserBtn = document.querySelector<HTMLButtonElement>(".controls__btn--eraser")!;

const gridSizes = [8, 16, 32, 48, 64] as const;

type PaintMode = "custom-color" | "random-color" | "eraser";

const state = {
  gridSize: gridSizes[gridSizeInput.valueAsNumber],
  canvasSize: 576,
  canvasColor: "#fff",
  gridlinesColor: "#aaa",
  paintMode: "custom-color" as PaintMode,
  paintColor: paintColorInput.value,
  painted: null as string | null
};

function drawCanvas() {
  const cellSize = state.canvasSize / state.gridSize;

  canvas.width = state.canvasSize + 1;
  canvas.height = state.canvasSize + 1;

  ctx.fillStyle = state.canvasColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = state.gridlinesColor;

  for (let i = 0; i <= state.gridSize; i++) {
    const p = i * cellSize;

    ctx.fillRect(p, 0, 1, canvas.height);
    ctx.fillRect(0, p, canvas.width, 1);
  }
}

function updateCanvasColor() {
  state.canvasColor = canvasColorInput.value;
}

function updatePaintColor() {
  state.paintColor = paintColorInput.value;
}

function updateGridSizeLabel() {
  const gridSize = gridSizes[gridSizeInput.valueAsNumber];

  gridSizeLabel.textContent = `Grid Size: ${gridSize} x ${gridSize}`;
}

function updateGridSize() {
  state.gridSize = gridSizes[gridSizeInput.valueAsNumber];

  drawCanvas();
}

function setPaintMode(mode: PaintMode) {
  state.paintMode = mode;
}

function paint(e: PointerEvent) {
  if (e.buttons !== 1) return;

  const rect = canvas.getBoundingClientRect();
  const scale = canvas.width / rect.width;

  const x = (e.clientX - rect.left) * scale;
  const y = (e.clientY - rect.top) * scale;

  const cellSize = state.canvasSize / state.gridSize;

  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  const cell = `${col}-${row}`;
  if (cell === state.painted) return;

  state.painted = cell;

  const drawX = col * cellSize + 1;
  const drawY = row * cellSize + 1;

  const fillSize = cellSize - 1;

  switch (state.paintMode) {
    case "custom-color":
      ctx.fillStyle = state.paintColor;
      break;
    case "random-color":
      ctx.fillStyle = getRandomColor();
      break;
    case "eraser":
      ctx.fillStyle = state.canvasColor;
  }

  ctx.fillRect(drawX, drawY, fillSize, fillSize);
}

function resetPainted() {
  state.painted = null;
}

function getRandomColor(): string {
  const randomNumber = Math.floor(Math.random() * 0xffffff);
  const hexCode = `#${randomNumber.toString(16).padStart(6, "0")}`;

  return hexCode;
}

function setupEvents() {
  canvas.addEventListener("pointerdown", paint);
  canvas.addEventListener("pointermove", paint);
  canvas.addEventListener("pointerup", resetPainted);
  canvas.addEventListener("pointerleave", resetPainted);

  canvasColorInput.addEventListener("input", updateCanvasColor);
  paintColorInput.addEventListener("input", updatePaintColor);
  gridSizeInput.addEventListener("input", updateGridSizeLabel);
  gridSizeInput.addEventListener("change", updateGridSize);

  customColorBtn.addEventListener("click", () => setPaintMode("custom-color"));
  randomColorBtn.addEventListener("click", () => setPaintMode("random-color"));
  eraserBtn.addEventListener("click", () => setPaintMode("eraser"));
}

function init() {
  drawCanvas();
  setupEvents();
}

init();
