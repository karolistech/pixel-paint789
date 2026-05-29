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
  gridSize: gridSizes[gridSizeInput.valueAsNumber],
  canvasSize: 576,
  canvasColor: canvasColorInput.value,
  gridlines: true,
  gridlinesColor: "#aaa",
  paintMode: "custom-color" as PaintMode,
  paintColor: paintColorInput.value,
  painted: null as number | null,
  cells: new Map<number, string>()
};

function renderCanvas() {
  const cellSize = state.canvasSize / state.gridSize;

  ctx.fillStyle = state.canvasColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const [cell, color] of state.cells) {
    const col = cell % state.gridSize;
    const row = Math.floor(cell / state.gridSize);

    ctx.fillStyle = color;
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
  }

  if (state.gridlines === true) {
    ctx.beginPath();

    for (let i = 0; i <= state.gridSize; i++) {
      const p = i * cellSize;

      ctx.moveTo(p, 0);
      ctx.lineTo(p, canvas.height);

      ctx.moveTo(0, p);
      ctx.lineTo(canvas.width, p);
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
  state.cells.clear();

  renderCanvas();
}

function setPaintMode(mode: PaintMode) {
  state.paintMode = mode;

  customColorBtn.classList.toggle("controls__btn--selected", state.paintMode === "custom-color");
  randomColorBtn.classList.toggle("controls__btn--selected", state.paintMode === "random-color");
  eraserBtn.classList.toggle("controls__btn--selected", state.paintMode === "eraser");
}

function paint(e: PointerEvent) {
  if (e.buttons !== 1) return;

  const rect = canvas.getBoundingClientRect();
  const scale = canvas.width / rect.width;
  const cellSize = state.canvasSize / state.gridSize;

  const x = (e.clientX - rect.left) * scale;
  const y = (e.clientY - rect.top) * scale;

  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  if (col < 0 || col >= state.gridSize || row < 0 || row >= state.gridSize) return;

  const cell = row * state.gridSize + col;
  if (cell === state.painted) return;

  state.painted = cell;

  switch (state.paintMode) {
    case "custom-color":
      state.cells.set(cell, state.paintColor);
      break;
    case "random-color":
      state.cells.set(cell, getRandomColor());
      break;
    case "eraser":
      state.cells.delete(cell);
  }

  renderCanvas();
}

function resetPainted() {
  state.painted = null;
}

function getRandomColor(): string {
  const randomNumber = Math.floor(Math.random() * 0xffffff);
  const hexCode = `#${randomNumber.toString(16).padStart(6, "0")}`;

  return hexCode;
}

function clear() {
  state.cells.clear();

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
