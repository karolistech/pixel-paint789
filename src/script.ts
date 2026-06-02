const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
const ctx = canvas.getContext("2d")!;

const paintColorInput = document.querySelector<HTMLInputElement>("#paint-color")!;
const gridSizeLabel = document.querySelector<HTMLLabelElement>("label[for='grid-size']")!;
const gridSizeInput = document.querySelector<HTMLInputElement>("#grid-size")!;

const gridSizes = [8, 16, 32, 48, 64] as const;

type PaintMode = "custom-color" | "random-color" | "eraser";

const state = {
  canvasSize: 576,
  canvasColor: "#fff",
  gridSize: gridSizes[gridSizeInput.valueAsNumber],
  gridlinesColor: "#aaa",
  paintMode: "custom-color" as PaintMode,
  paintColor: paintColorInput.value,
  paintedCells: new Map<number, string>(),
};

function renderCanvas() {
  const cellSize = state.canvasSize / state.gridSize;

  ctx.fillStyle = state.canvasColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const [cellIndex, color] of state.paintedCells) {
    const col = cellIndex % state.gridSize;
    const row = Math.floor(cellIndex / state.gridSize);

    ctx.fillStyle = color;
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
  }

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

function updatePaintColor() {
  state.paintColor = paintColorInput.value;
}

function updateGridSize(e: Event) {
  const gridSize = gridSizes[gridSizeInput.valueAsNumber];

  gridSizeLabel.textContent = `Grid Size: ${gridSize} x ${gridSize}`;

  if (e.type === "change") {
    state.gridSize = gridSize;
    renderCanvas();
  }
}

function handleCanvasInput(e: PointerEvent) {
  if (e.buttons !== 1) return;

  const rect = canvas.getBoundingClientRect();
  const scale = state.canvasSize / rect.width;
  const cellSize = state.canvasSize / state.gridSize;

  const x = (e.clientX - rect.left) * scale;
  const y = (e.clientY - rect.top) * scale;

  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  const cellIndex = row * state.gridSize + col;

  switch (state.paintMode) {
    case "custom-color":
      state.paintedCells.set(cellIndex, state.paintColor);
      break;
  }

  renderCanvas();
}

function setupEvents() {
  canvas.addEventListener("pointerdown", handleCanvasInput);
  canvas.addEventListener("pointermove", handleCanvasInput);
  paintColorInput.addEventListener("input", updatePaintColor);
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
