The Rectangle Drawer is a JavaScript application that allows users to draw, resize, and interact with rectangles on a webpage. Developed in pure JavaScript without any third-party libraries or frameworks, this project demonstrates object-oriented programming principles and DOM manipulation techniques.

## Features

- Drawing Rectangles: Users can draw new rectangles by clicking and dragging the mouse on the screen. The size of the rectangle is dynamically displayed above the rectangle during the drawing process.

- Resizing Rectangles: Existing rectangles can be resized by grabbing their edges or corners. The cursor changes to indicate the possible resizing direction (e.g., col-size, row-size).

- Moving Rectangles: Rectangles can be moved when the top left corner is grabbed while holding the Ctrl or Cmd key. This allows for easy repositioning of existing rectangles.

- Size Indicator: The size of the rectangle (width x height) is only visible during drawing or resizing. It is positioned slightly above the rectangle and does not overflow the screen, even near the browser edges.

- Minimum Size Constraint: Rectangles must have a minimum size of 10x10 pixels. If a rectangle smaller than this size is attempted, it will be automatically removed. Additionally, resizing cannot reduce the rectangle's size below this minimum dimension.

- Viewport Constraints: Rectangles cannot be drawn outside the browser viewport. However, if the browser window is resized, the application allows scrolling in both axes.

## File Structure

- HTML: The HTML file contains only basic initialization tags, providing a clean and minimal structure.

- CSS: The CSS file defines styles for rectangles, size indicators, and cursor changes.

- JavaScript: The JavaScript file implements the functionality in an object-oriented manner, using the RectDrawer class.

## Usage

**1. Drawing:** Click and drag to draw a new rectangle. If the cursor is not over an existing rectangle, a new one will start from the mouse down point.

**2. Resizing:** Click on an existing rectangle's edge or corner. The cursor will change to indicate the resize direction. Drag to resize the rectangle.

**3. Constraints:** The minimum size for any rectangle is 10x10 pixels. Any smaller rectangle will be automatically removed.
