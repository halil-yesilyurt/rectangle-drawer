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
  isNearBorder(x, y, rect) {
    // check if the cursor is near the border or corner of a rectangle
    return (
      x >= rect.left - this.MIN_SIZE && x <= rect.right + this.MIN_SIZE && y >= rect.top - this.MIN_SIZE && y <= rect.bottom + this.MIN_SIZE
    );
  }
  getResizeEdge(x, y, rect) {
    // determine which edge or corner of a rectangle the cursor is near
    const isNear = (a, b) => Math.abs(a - b) < this.resizeMargin;

    // check each edge and corner to see which one is closest to the cursor
    if (isNear(x, rect.left) && isNear(y, rect.top)) return 'top-left';
    if (isNear(x, rect.right) && isNear(y, rect.top)) return 'top-right';
    if (isNear(x, rect.left) && isNear(y, rect.bottom)) return 'bottom-left';
    if (isNear(x, rect.right) && isNear(y, rect.bottom)) return 'bottom-right';
    if (isNear(x, rect.left)) return 'left';
    if (isNear(x, rect.right)) return 'right';
    if (isNear(y, rect.top)) return 'top';
    if (isNear(y, rect.bottom)) return 'bottom';
    return null;
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
  // handle mouse move events for drawing, resizing, or moving rectangles
  mouseMove(e) {
    if (this.isDrawing) {
      // calculate the width and height of the rectangle while drawing
      let rectWidth = e.clientX + window.scrollX - this.startX;
      let rectHeight = e.clientY + window.scrollY - this.startY;

      // constrain the rectangle dimensions within the viewport
      rectWidth = Math.max(Math.min(rectWidth, window.innerWidth - this.startX), -this.startX);
      rectHeight = Math.max(Math.min(rectHeight, window.innerHeight - this.startY), -this.startY);

      // update the rectangle's dimension and position
      this.currentRect.style.width = `${Math.abs(rectWidth)}px`;
      this.currentRect.style.height = `${Math.abs(rectHeight)}px`;
      this.currentRect.style.left = `${Math.min(this.startX, this.startX + rectWidth)}px`;
      this.currentRect.style.top = `${Math.min(this.startY, this.startY + rectHeight)}px`;

      // update the size box content and position
      this.size.textContent = `${Math.abs(rectWidth)} x ${Math.abs(rectHeight)}`;
      this.updateSizeBoxPosition(this.currentRect);
    } else if (this.isResizing && this.resizingRect) {
      // get current dimensions of the rectangle and assign to temp variables
      const rect = this.resizingRect.getBoundingClientRect();
      let newLeft = rect.left;
      let newTop = rect.top;
      let newWidth = rect.width;
      let newHeight = rect.height;

      // update rectangle dimensions based on the resize edge
      switch (this.resizeEdge) {
        case 'top-left':
          newLeft = Math.max(0, e.clientX + window.scrollX);
          newTop = Math.max(0, e.clientY + window.scrollY);
          newWidth = Math.max(rect.right - newLeft, this.MIN_SIZE);
          newHeight = Math.max(rect.bottom - newTop, this.MIN_SIZE);
          this.setMinSizeStyle(rect, newWidth, newHeight, newLeft, newTop);
          break;

        case 'top-right':
          newTop = Math.max(0, e.clientY + window.scrollY);
          newWidth = Math.max(e.clientX + window.scrollX - rect.left, this.MIN_SIZE);
          newHeight = Math.max(rect.bottom - newTop, this.MIN_SIZE);
          this.setMinSizeStyle(rect, newWidth, newHeight, rect.left, newTop);
          break;

        case 'bottom-right':
          newWidth = Math.max(e.clientX + window.scrollX - rect.left, this.MIN_SIZE);
          newHeight = Math.max(e.clientY + window.scrollY - rect.top, this.MIN_SIZE);
          this.setMinSizeStyle(rect, newWidth, newHeight, rect.left, rect.top);
          break;

        case 'bottom-left':
          newLeft = Math.max(0, e.clientX + window.scrollX);
          newWidth = Math.max(rect.right - newLeft, this.MIN_SIZE);
          newHeight = Math.max(e.clientY + window.scrollY - rect.top, this.MIN_SIZE);
          this.setMinSizeStyle(rect, newWidth, newHeight, newLeft, rect.top);
          break;

        case 'left':
          newLeft = Math.max(0, e.clientX + window.scrollX);
          newWidth = Math.max(rect.right - newLeft, this.MIN_SIZE);
          this.setMinSizeStyle(rect, newWidth, rect.height, newLeft, rect.top);
          break;

        case 'right':
          newWidth = Math.max(e.clientX + window.scrollX - rect.left, this.MIN_SIZE);
          this.setMinSizeStyle(rect, newWidth, rect.height, rect.left, rect.top);
          break;

        case 'top':
          newTop = Math.max(0, e.clientY + window.scrollY);
          newHeight = Math.max(rect.bottom - newTop, this.MIN_SIZE);
          this.setMinSizeStyle(rect, rect.width, newHeight, rect.left, newTop);
          break;

        case 'bottom':
          newHeight = Math.max(e.clientY + window.scrollY - rect.top, this.MIN_SIZE);
          this.setMinSizeStyle(rect, rect.width, newHeight, rect.left, rect.top);
          break;

        default:
          return;
      }

      // apply new dimensions to the resizing rectangle
      this.resizingRect.style.width = `${newWidth}px`;
      this.resizingRect.style.height = `${newHeight}px`;

      // update the size box content and position
      this.size.textContent = `${newWidth} x ${newHeight}`;
      this.updateSizeBoxPosition(this.resizingRect);
    } else if (this.isMoving && this.resizingRect) {
      let newLeft = e.clientX - this.offsetX;
      let newTop = e.clientY - this.offsetY;

      // prevent the rectangle from moving outside the viewport
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - this.resizingRect.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - this.resizingRect.offsetHeight));

      // update the rectangle's position
      this.resizingRect.style.left = `${newLeft}px`;
      this.resizingRect.style.top = `${newTop}px`;
    }
  }
  hidePreviousSizeBox() {
    // hide the previous size box if it exists
    if (this.size) {
      this.size.classList.remove('active');
    }
  }
  updateSizeBoxPosition(rect) {
    // update the position of the size box relative to the rectangle
    const rectPos = rect.getBoundingClientRect();
    let sizePosLeft = rectPos.left;
    let sizePosTop = rectPos.top - 28;

    // adjust for scroll offsets
    const scrollLeft = window.scrollX;
    const scrollTop = window.scrollY;
    sizePosLeft += scrollLeft;
    sizePosTop += scrollTop;

    // ensure the size box remains within the viewport
    if (sizePosLeft + this.size.offsetWidth > window.innerWidth) {
      sizePosLeft = window.innerWidth - this.size.offsetWidth - 5 + scrollLeft;
    }
    if (sizePosTop < 0) {
      sizePosTop = 5 + scrollTop;
    }

    // set the size box position
    this.size.style.left = `${sizePosLeft}px`;
    this.size.style.top = `${sizePosTop}px`;
    this.size.classList.add('active');
  }
}
