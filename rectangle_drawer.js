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

    // initialize the size box for showing rectangle dimensions
    this.size = document.createElement('span');
    this.size.classList.add('size-box');
    document.body.appendChild(this.size);
  }
  mouseDown(e) {
    this.startX = e.clientX + window.scrollX;
    this.startY = e.clientY + window.scrollY;

    let isOnExistingRect = false;

    // iterate through all child nodes in the document body
    for (let i = 0; i < document.body.childNodes.length; i++) {
      const node = document.body.childNodes[i];

      // check if the node is a DIV element with absolute positioning
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' && window.getComputedStyle(node).position === 'absolute') {
        // get the bounding rectangle of the node
        const rect = node.getBoundingClientRect();

        if (this.isNearBorder(e.clientX, e.clientY, rect)) {
          // check if the cursor is near the rectangle
          this.resizingRect = node;
          this.resizeEdge = this.getResizeEdge(e.clientX, e.clientY, rect);

          // enable moving if Ctrl or Cmd key is pressed
          if (this.resizeEdge && (e.ctrlKey || e.metaKey)) {
            this.isMoving = true;
            this.offsetX = e.clientX - rect.left;
            this.offsetY = e.clientY - rect.top;
          } else {
            this.isResizing = true;

            // initialize the size box if not already created
            this.size = document.querySelector('.size-box') || document.createElement('span');
            this.size.classList.add('size-box');
            if (!document.body.contains(this.size)) {
              document.body.appendChild(this.size);
            }

            // update the size box position
            this.updateSizeBoxPosition(this.resizingRect);
          }
          isOnExistingRect = true;
          break;
        }
      }
    }
    // if not on an existing rectangle, start drawing a new one
    if (!isOnExistingRect) {
      // hide the previous size box if any
      this.hidePreviousSizeBox();

      // create a new rectangle element
      this.currentRect = document.createElement('div');
      this.currentRect.className = 'rectangle';
      this.currentRect.style.left = `${this.startX}px`;
      this.currentRect.style.top = `${this.startY}px`;
      document.body.appendChild(this.currentRect);

      // store reference to the new rectangle
      this.rectangles.push(this.currentRect);

      // initialize the size box if not already created
      this.size = document.querySelector('.size-box') || document.createElement('span');
      this.size.classList.add('size-box');
      if (!document.body.contains(this.size)) {
        document.body.appendChild(this.size);
      }

      this.isDrawing = true;
    }
  }
}
