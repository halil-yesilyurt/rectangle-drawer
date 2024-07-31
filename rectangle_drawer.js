class RectDrawer {
  constructor() {
    // initialize instance properties
    this.startX = 0;
    this.statY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.currentRect = null;
    this.size = null;
    this.resizingRect = null;
    this.resizeEdge = null;
    this.isDrawing = false;
    this.isResizing = false;
    this.isMoving = false;
    this.rectangles = [];
    this.MIN_SIZE = 10;
    this.resizeMargin = 6;
  }
  init() {
    // add event listeners for mouse events
    document.addEventListener('mousedown', this.mouseDown.bind(this));
    document.addEventListener('mousemove', this.mouseMove.bind(this));
    document.addEventListener('mouseup', this.mouseUp.bind(this));
    document.addEventListener('mousemove', this.updateCursor.bind(this));
  }
}
