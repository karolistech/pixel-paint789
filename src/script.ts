const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
const ctx = canvas.getContext("2d")!;

const canvasColorInput = document.querySelector<HTMLInputElement>("#canvas-color")!;
const paintColorInput = document.querySelector<HTMLInputElement>("#paint-color")!;
const gridSizeLabel = document.querySelector<HTMLLabelElement>("label[for='grid-size']")!;
const gridSizeInput = document.querySelector<HTMLInputElement>("#grid-size")!;
const customColorBtn = document.querySelector<HTMLButtonElement>(".controls__btn--custom-color")!;
const randomColorBtn = document.querySelector<HTMLButtonElement>(".controls__btn--random-color")!;
const eraserBtn = document.querySelector<HTMLButtonElement>(".controls__btn--eraser")!;
const clearBtn = document.querySelector<HTMLButtonElement>(".controls__btn--clear")!;
const saveBtn = document.querySelector<HTMLButtonElement>(".controls__btn--save")!;
const gridlinesBtn = document.querySelector<HTMLButtonElement>(".controls__btn--gridlines")!;

const gridSizes = [8, 16, 32, 48, 64] as const;

type PaintMode = "custom-color" | "random-color" | "eraser";

const state = {
  canvasSize: 576,
  canvasColor: canvasColorInput.value,
  gridSize: gridSizes[gridSizeInput.valueAsNumber],
  gridlines: true,
  gridlinesColor: "#aaa",
  paintMode: "custom-color" as PaintMode,
  paintColor: paintColorInput.value,
  paintedCells: new Map<number, string>(),
  lastPaintedCellIndex: null as number | null
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

  if (state.gridlines === true) {
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
}

function updateCanvasColor() {
  state.canvasColor = canvasColorInput.value;

  renderCanvas();
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
  state.paintedCells.clear();

  renderCanvas();
}

function setPaintMode(mode: PaintMode) {
  state.paintMode = mode;

  customColorBtn.classList.toggle("controls__btn--selected", state.paintMode === "custom-color");
  randomColorBtn.classList.toggle("controls__btn--selected", state.paintMode === "random-color");
  eraserBtn.classList.toggle("controls__btn--selected", state.paintMode === "eraser");
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
  if (col < 0 || col >= state.gridSize || row < 0 || row >= state.gridSize) return;

  const cellIndex = row * state.gridSize + col;
  if (cellIndex === state.lastPaintedCellIndex) return;

  state.lastPaintedCellIndex = cellIndex;

  switch (state.paintMode) {
    case "custom-color":
      state.paintedCells.set(cellIndex, state.paintColor);
      break;
    case "random-color":
      state.paintedCells.set(cellIndex, getRandomColor());
      break;
    case "eraser":
      state.paintedCells.delete(cellIndex);
  }

  renderCanvas();
}

function resetLastPaintedCellIndex() {
  state.lastPaintedCellIndex = null;
}

function getRandomColor(): string {
  const randomNumber = Math.floor(Math.random() * 0xffffff);
  const hexCode = `#${randomNumber.toString(16).padStart(6, "0")}`;

  return hexCode;
}

function clear() {
  state.paintedCells.clear();

  renderCanvas();
}

function save() {
  const link = document.createElement("a");

  link.href = canvas.toDataURL("image/png");
  link.download = "pixel-art.png";
  link.click();
}

function toggleGridlines() {
  state.gridlines = !state.gridlines;

  gridlinesBtn.classList.toggle("controls__btn--selected", state.gridlines === true);
  renderCanvas();
}

function setupEvents() {
  canvas.addEventListener("pointerdown", handleCanvasInput);
  canvas.addEventListener("pointermove", handleCanvasInput);
  canvas.addEventListener("pointerup", resetLastPaintedCellIndex);
  canvas.addEventListener("pointerleave", resetLastPaintedCellIndex);

  canvasColorInput.addEventListener("input", updateCanvasColor);
  paintColorInput.addEventListener("input", updatePaintColor);
  gridSizeInput.addEventListener("input", updateGridSizeLabel);
  gridSizeInput.addEventListener("change", updateGridSize);

  customColorBtn.addEventListener("click", () => setPaintMode("custom-color"));
  randomColorBtn.addEventListener("click", () => setPaintMode("random-color"));
  eraserBtn.addEventListener("click", () => setPaintMode("eraser"));
  clearBtn.addEventListener("click", clear);
  saveBtn.addEventListener("click", save);
  gridlinesBtn.addEventListener("click", toggleGridlines);
}

function init() {
  canvas.width = state.canvasSize;
  canvas.height = state.canvasSize;

  renderCanvas();
  setupEvents();
}

init();
