const canvas = document.querySelector<HTMLCanvasElement>(".canvas")!;
const ctx = canvas.getContext("2d")!;

const paintColorInput = document.querySelector<HTMLInputElement>("#paint-color")!;
const gridSizeLabel = document.querySelector<HTMLLabelElement>("label[for='grid-size']")!;
const gridSizeInput = document.querySelector<HTMLInputElement>("#grid-size")!;

const customColorBtn = document.querySelector<HTMLButtonElement>(".controls__btn--custom-color")!;
const randomColorBtn = document.querySelector<HTMLButtonElement>(".controls__btn--random-color")!;

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

function setPaintMode(mode: PaintMode) {
  state.paintMode = mode;
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

  paintColorInput.addEventListener("input", updatePaintColor);
  gridSizeInput.addEventListener("input", updateGridSize);
  gridSizeInput.addEventListener("change", updateGridSize);

  customColorBtn.addEventListener("click", () => setPaintMode("custom-color"));
  randomColorBtn.addEventListener("click", () => setPaintMode("random-color"));
}

function init() {
  drawCanvas();
  setupEvents();
}

init();
