const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let points = [];
const recognizedShapes = []; // Array to store the recognized shapes

let draggingShapeIndex = -1;

// // Event listeners to track mouse/touch movements
// canvas.addEventListener('mousedown', startDrawing);
// canvas.addEventListener('mousemove', draw);
// canvas.addEventListener('mouseup', endDrawing);
// canvas.addEventListener('touchstart', startDrawing);
// canvas.addEventListener('touchmove', draw);
// canvas.addEventListener('touchend', endDrawing);


// Event listeners to track mouse/touch movements for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', endDrawing);

// Event listeners to track mouse/touch movements for dragging
canvas.addEventListener('mousedown', startDragging);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', endDragging);
canvas.addEventListener('touchstart', startDragging);
canvas.addEventListener('touchmove', drag);
canvas.addEventListener('touchend', endDragging);
// Get the buttons container
const buttonsContainer = document.getElementById('buttonsContainer');

// Function to start drawing
function startDrawing(e) {
  isDrawing = true;
  points = [];
  const { offsetX, offsetY } = getCoordinates(e);
  points.push({ x: offsetX, y: offsetY });
  // Hide the buttons container when drawing starts
  // buttonsContainer.style.display = 'none';
  buttonsContainer.style.display = recognizedShapes.length === 0 ? 'block' : 'none';
}

// Function to draw on the canvas
function draw(e) {
  if (!isDrawing) return;
  const { offsetX, offsetY } = getCoordinates(e);
  points.push({ x: offsetX, y: offsetY });
  drawUserShape();
}

// Function to end drawing
function endDrawing() {
  isDrawing = false;

  // Show the buttons container when drawing ends
  buttonsContainer.style.display = 'block';
}

// Function to get the correct coordinates based on event type (mouse/touch)
function getCoordinates(e) {
  if (e.type.startsWith('touch')) {
    const touch = e.touches[0];
    return { offsetX: touch.clientX, offsetY: touch.clientY };
  } else {
    return { offsetX: e.offsetX, offsetY: e.offsetY };
  }
}

// Function to draw the user-drawn shape on the canvas
function drawUserShape() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  for (const shape of recognizedShapes) {
    if (shape.type === 'circle') {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (shape.type === 'square') {
      ctx.beginPath();
      ctx.rect(shape.centerX - shape.size / 2, shape.centerY - shape.size / 2, shape.size, shape.size);
      ctx.stroke();
    } else if (shape.type === 'RoundSquare') {
      ctx.beginPath();
      ctx.moveTo(shape.centerX - shape.size / 2 + shape.cornerRadius, shape.centerY - shape.size / 2);
      ctx.lineTo(shape.centerX + shape.size / 2 - shape.cornerRadius, shape.centerY - shape.size / 2);
      ctx.arc(
        shape.centerX + shape.size / 2 - shape.cornerRadius,
        shape.centerY - shape.size / 2 + shape.cornerRadius,
        shape.cornerRadius,
        1.5 * Math.PI,
        2 * Math.PI
      );
      ctx.lineTo(shape.centerX + shape.size / 2, shape.centerY + shape.size / 2 - shape.cornerRadius);
      ctx.arc(
        shape.centerX + shape.size / 2 - shape.cornerRadius,
        shape.centerY + shape.size / 2 - shape.cornerRadius,
        shape.cornerRadius,
        0,
        0.5 * Math.PI
      );
      ctx.lineTo(shape.centerX - shape.size / 2 + shape.cornerRadius, shape.centerY + shape.size / 2);
      ctx.arc(
        shape.centerX - shape.size / 2 + shape.cornerRadius,
        shape.centerY + shape.size / 2 - shape.cornerRadius,
        shape.cornerRadius,
        0.5 * Math.PI,
        Math.PI
      );
      ctx.lineTo(shape.centerX - shape.size / 2, shape.centerY - shape.size / 2 + shape.cornerRadius);
      ctx.arc(
        shape.centerX - shape.size / 2 + shape.cornerRadius,
        shape.centerY - shape.size / 2 + shape.cornerRadius,
        shape.cornerRadius,
        Math.PI,
        1.5 * Math.PI
      );
      ctx.stroke();
    } else if (shape.type === 'triangle') {
      // Draw triangle
      ctx.beginPath();
      ctx.moveTo(shape.centerX, shape.centerY - 50);
      ctx.lineTo(shape.centerX + 50, shape.centerY + 50);
      ctx.lineTo(shape.centerX - 50, shape.centerY + 50);
      ctx.closePath();
      ctx.stroke();
    } else if (shape.type === 'rhombus') {
      // Draw rhombus
      ctx.beginPath();
      ctx.moveTo(shape.centerX, shape.centerY - 50);
      ctx.lineTo(shape.centerX + 50, shape.centerY);
      ctx.lineTo(shape.centerX, shape.centerY + 50);
      ctx.lineTo(shape.centerX - 50, shape.centerY);
      ctx.closePath();
      ctx.stroke();
    } else if (shape.type === 'rectangle') {
      // Draw rectangle
      ctx.beginPath();
      ctx.rect(shape.centerX - 50, shape.centerY - 25, 100, 50);
      ctx.stroke();
    } else if (shape.type === 'line') {
      // Draw line
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    }
  }
}

// Function to recognize a circle and add it to the recognized shapes
function recognizeCircle() {
  // Assume that the points array contains the user-drawn circle data

  // Calculate the center of the user-drawn circle by averaging the x and y coordinates
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;

  // Calculate the radius of the user-drawn circle using the distance from the center to any point on the circle
  const radius = Math.sqrt(
    points.reduce((sum, point) => sum + (point.x - centerX) ** 2 + (point.y - centerY) ** 2, 0) / points.length
  );
    console.log(points)
  // Store the recognized circle in the array
  recognizedShapes.push({ type: 'circle', centerX, centerY, radius });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  recognizedShapes.push({ type: 'circle', centerX, centerY, radius });
  // Redraw the recognized shapes without clearing the canvas
  recShape();

  buttonsContainer.style.display = 'none';
}

// Function to recognize a square and add it to the recognized shapes
function recognizeSquare() {
  // Assume that the points array contains the user-drawn square data

  // Calculate the center of the user-drawn square (similar to recognizing a circle)
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;

  // Calculate the bounding box size of the user-drawn square
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  const size = Math.max(maxX - minX, maxY - minY);

  // Store the recognized square in the array
  recognizedShapes.push({ type: 'square', centerX, centerY, size });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  recognizedShapes.push({ type: 'square', centerX, centerY, size });
  // Redraw the recognized shapes without clearing the canvas
  recShape();

  buttonsContainer.style.display = 'none';
}

// Function to recognize a rounded square and add it to the recognized shapes
function recognizeRoundSquare() {
  // Assume that the points array contains the user-drawn square data

  // Calculate the center of the user-drawn square (similar to recognizing a circle)
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;

  // Calculate the bounding box size of the user-drawn square
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  const size = Math.max(maxX - minX, maxY - minY);

  // Calculate the rounded corner radius (assuming a quarter of the size)
  const cornerRadius = size / 4;

  // Store the recognized square in the array with the correct type 'RoundSquare'
  recognizedShapes.push({ type: 'RoundSquare', centerX, centerY, size, cornerRadius });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  recognizedShapes.push({ type: 'RoundSquare', centerX, centerY, size, cornerRadius });
  // Redraw all recognized shapes without clearing the canvas
  recShape();

  buttonsContainer.style.display = 'none';
}

// Function to recognize a triangle and add it to the recognized shapes
function recognizeTriangle() {
  // Assume that the points array contains the user-drawn triangle data

  // Calculate the center of the user-drawn triangle (similar to recognizing a circle)
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;

  // Store the recognized triangle in the array
  recognizedShapes.push({ type: 'triangle', centerX, centerY });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  recognizedShapes.push({ type: 'triangle', centerX, centerY });
  // Redraw the recognized shapes without clearing the canvas
  recShape();

  buttonsContainer.style.display = 'none';
}

// Function to recognize a rhombus and add it to the recognized shapes
function recognizeRhombus() {
  // Assume that the points array contains the user-drawn rhombus data

  // Calculate the center of the user-drawn rhombus (similar to recognizing a circle)
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;

  // Store the recognized rhombus in the array
  recognizedShapes.push({ type: 'rhombus', centerX, centerY });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  recognizedShapes.push({ type: 'rhombus', centerX, centerY });
  // Redraw the recognized shapes without clearing the canvas
  recShape();

  buttonsContainer.style.display = 'none';
}

// Function to recognize a rectangle and add it to the recognized shapes
function recognizeRectangle() {
  // Assume that the points array contains the user-drawn rectangle data

  // Calculate the center of the user-drawn rectangle (similar to recognizing a circle)
  const centerX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const centerY = points.reduce((sum, point) => sum + point.y, 0) / points.length;

  // Store the recognized rectangle in the array
  recognizedShapes.push({ type: 'rectangle', centerX, centerY });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  recognizedShapes.push({ type: 'rectangle', centerX, centerY });
  // Redraw the recognized shapes without clearing the canvas
  recShape();

  buttonsContainer.style.display = 'none';
}

// Function to recognize a straight line and add it to the recognized shapes
function recognizeLine() {
  // Assume that the points array contains the user-drawn line data

  // Calculate the starting and ending points of the line
  const startX = points[0].x;
  const startY = points[0].y;
  const endX = points[points.length - 1].x;
  const endY = points[points.length - 1].y;

  // Store the recognized line in the array
  recognizedShapes.push({ type: 'line', startX, startY, endX, endY });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  recognizedShapes.push({ type: 'line', startX, startY, endX, endY });
  // Redraw the recognized shapes without clearing the canvas
  recShape();

  buttonsContainer.style.display = 'block';
}

// Function to draw all recognized shapes on the canvas
function recShape() {
  for (const shape of recognizedShapes) {
    if (shape.type === 'circle') {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (shape.type === 'square') {
      ctx.beginPath();
      ctx.rect(shape.centerX - shape.size / 2, shape.centerY - shape.size / 2, shape.size, shape.size);
      ctx.stroke();
    } else if (shape.type === 'RoundSquare') {
      ctx.beginPath();
      ctx.moveTo(shape.centerX - shape.size / 2 + shape.cornerRadius, shape.centerY - shape.size / 2);
      ctx.lineTo(shape.centerX + shape.size / 2 - shape.cornerRadius, shape.centerY - shape.size / 2);
      ctx.arc(
        shape.centerX + shape.size / 2 - shape.cornerRadius,
        shape.centerY - shape.size / 2 + shape.cornerRadius,
        shape.cornerRadius,
        1.5 * Math.PI,
        2 * Math.PI
      );
      ctx.lineTo(shape.centerX + shape.size / 2, shape.centerY + shape.size / 2 - shape.cornerRadius);
      ctx.arc(
        shape.centerX + shape.size / 2 - shape.cornerRadius,
        shape.centerY + shape.size / 2 - shape.cornerRadius,
        shape.cornerRadius,
        0,
        0.5 * Math.PI
      );
      ctx.lineTo(shape.centerX - shape.size / 2 + shape.cornerRadius, shape.centerY + shape.size / 2);
      ctx.arc(
        shape.centerX - shape.size / 2 + shape.cornerRadius,
        shape.centerY + shape.size / 2 - shape.cornerRadius,
        shape.cornerRadius,
        0.5 * Math.PI,
        Math.PI
      );
      ctx.lineTo(shape.centerX - shape.size / 2, shape.centerY - shape.size / 2 + shape.cornerRadius);
      ctx.arc(
        shape.centerX - shape.size / 2 + shape.cornerRadius,
        shape.centerY - shape.size / 2 + shape.cornerRadius,
        shape.cornerRadius,
        Math.PI,
        1.5 * Math.PI
      );
      ctx.stroke();
    }
    else if (shape.type === 'triangle') {
      // Draw triangle
      ctx.beginPath();
      ctx.moveTo(shape.centerX, shape.centerY - 50);
      ctx.lineTo(shape.centerX + 50, shape.centerY + 50);
      ctx.lineTo(shape.centerX - 50, shape.centerY + 50);
      ctx.closePath();
      ctx.stroke();
    } else if (shape.type === 'rhombus') {
      // Draw rhombus
      ctx.beginPath();
      ctx.moveTo(shape.centerX, shape.centerY - 50);
      ctx.lineTo(shape.centerX + 50, shape.centerY);
      ctx.lineTo(shape.centerX, shape.centerY + 50);
      ctx.lineTo(shape.centerX - 50, shape.centerY);
      ctx.closePath();
      ctx.stroke();
    } else if (shape.type === 'rectangle') {
      // Draw rectangle
      ctx.beginPath();
      ctx.rect(shape.centerX - 50, shape.centerY - 25, 100, 50);
      ctx.stroke();
    }
    else if (shape.type === 'line') {
      // Draw straight line
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    }
  }
}

// Event listener for the "Recognize Circle" button
const recognizeButton = document.getElementById('recognizeButton');
recognizeButton.addEventListener('click', recognizeCircle);

// Event listener for the "Recognize Square" button
const recognizeButton1 = document.getElementById('recognizeButton1');
recognizeButton1.addEventListener('click', recognizeSquare);

// Event listener for the "Recognize RoundedSquare" button
const recognizeButton2 = document.getElementById('recognizeButton2');
recognizeButton2.addEventListener('click', recognizeRoundSquare);

// Event listener for the "Recognize Triangle" button
const recognizeButton3 = document.getElementById('recognizeButton3');
recognizeButton3.addEventListener('click', recognizeTriangle);

// Event listener for the "Recognize Rectangle" button
const recognizeButton4 = document.getElementById('recognizeButton4');
recognizeButton4.addEventListener('click', recognizeRectangle);

// Event listener for the "Recognize Rhombus" button
const recognizeButton5 = document.getElementById('recognizeButton5');
recognizeButton5.addEventListener('click', recognizeRhombus);

// Event listener for the "Recognize Line" button
const recognizeButton6 = document.getElementById('recognizeButton6');
recognizeButton6.addEventListener('click', recognizeLine);

function startDragging(e) {
  const { offsetX, offsetY } = getCoordinates(e);

  // Check if the user clicked on any recognized shape
  for (let i = 0; i < recognizedShapes.length; i++) {
    const shape = recognizedShapes[i];

    if (shape.type === 'circle') {
      const distance = Math.sqrt((offsetX - shape.centerX) ** 2 + (offsetY - shape.centerY) ** 2);
      if (distance <= shape.radius) {
        // Set the draggingShapeIndex and initial offset from the center of the shape
        draggingShapeIndex = i;
        recognizedShapes[draggingShapeIndex].offsetX = offsetX - shape.centerX;
        recognizedShapes[draggingShapeIndex].offsetY = offsetY - shape.centerY;
        break;
      }
    } else if (shape.type === 'square') {
      // Check if the user clicked inside the bounding box of the square
      if (
        offsetX >= shape.centerX - shape.size / 2 &&
        offsetX <= shape.centerX + shape.size / 2 &&
        offsetY >= shape.centerY - shape.size / 2 &&
        offsetY <= shape.centerY + shape.size / 2
      ) {
        // Set the draggingShapeIndex and initial offset from the center of the shape
        draggingShapeIndex = i;
        recognizedShapes[draggingShapeIndex].offsetX = offsetX - shape.centerX;
        recognizedShapes[draggingShapeIndex].offsetY = offsetY - shape.centerY;
        break;
      }
    } else if (shape.type === 'RoundSquare') {
      // Check if the user clicked inside the bounding box of the rounded square
      const minX = shape.centerX - shape.size / 2;
      const minY = shape.centerY - shape.size / 2;
      const maxX = shape.centerX + shape.size / 2;
      const maxY = shape.centerY + shape.size / 2;

      // Check if the click is inside the bounding box of the rounded square
      if (offsetX >= minX && offsetX <= maxX && offsetY >= minY && offsetY <= maxY) {
        // Check if the click is inside any of the rounded corners
        const cornerRadius = shape.cornerRadius;
        const corners = [
          { x: minX + cornerRadius, y: minY },
          { x: maxX - cornerRadius, y: minY },
          { x: minX + cornerRadius, y: maxY },
          { x: maxX - cornerRadius, y: maxY },
        ];

        for (const corner of corners) {
          const distance = Math.sqrt((offsetX - corner.x) ** 2 + (offsetY - corner.y) ** 2);
          if (distance <= cornerRadius) {
            // Set the draggingShapeIndex and initial offset from the center of the shape
            draggingShapeIndex = i;
            recognizedShapes[draggingShapeIndex].offsetX = offsetX - shape.centerX;
            recognizedShapes[draggingShapeIndex].offsetY = offsetY - shape.centerY;
            break;
          }
        }
      }
    } else if (shape.type === 'triangle') {
      // Check if the user clicked inside the bounding triangle
      const centerX = shape.centerX;
      const centerY = shape.centerY - 50;
      const leftX = shape.centerX - 50;
      const rightX = shape.centerX + 50;
      const bottomY = shape.centerY + 50;
      const point1 = { x: centerX, y: centerY };
      const point2 = { x: rightX, y: bottomY };
      const point3 = { x: leftX, y: bottomY };
      const isInsideTriangle = isPointInsideTriangle({ x: offsetX, y: offsetY }, point1, point2, point3);
      
      if (isInsideTriangle) {
        draggingShapeIndex = i;
        recognizedShapes[draggingShapeIndex].offsetX = offsetX - shape.centerX;
        recognizedShapes[draggingShapeIndex].offsetY = offsetY - shape.centerY;
        break;
      }
    } else if (shape.type === 'rhombus') {
      // Check if the user clicked inside the bounding rhombus
      const centerX = shape.centerX;
      const centerY = shape.centerY - 50;
      const leftX = shape.centerX - 50;
      const rightX = shape.centerX + 50;
      const topY = shape.centerY - 50;
      const bottomY = shape.centerY + 50;
      const point1 = { x: centerX, y: centerY };
      const point2 = { x: rightX, y: shape.centerY };
      const point3 = { x: centerX, y: bottomY };
      const point4 = { x: leftX, y: shape.centerY };
      const isInsideRhombus = isPointInsideRhombus({ x: offsetX, y: offsetY }, point1, point2, point3, point4);
      
      if (isInsideRhombus) {
        draggingShapeIndex = i;
        recognizedShapes[draggingShapeIndex].offsetX = offsetX - shape.centerX;
        recognizedShapes[draggingShapeIndex].offsetY = offsetY - shape.centerY;
        break;
      }
    } else if (shape.type === 'rectangle') {
      // Check if the user clicked inside the bounding rectangle
      if (
        offsetX >= shape.centerX - 50 &&
        offsetX <= shape.centerX + 50 &&
        offsetY >= shape.centerY - 25 &&
        offsetY <= shape.centerY + 25
      ) {
        // Set the draggingShapeIndex and initial offset from the center of the shape
        draggingShapeIndex = i;
        recognizedShapes[draggingShapeIndex].offsetX = offsetX - shape.centerX;
        recognizedShapes[draggingShapeIndex].offsetY = offsetY - shape.centerY;
        break;
      }
    } else if (shape.type === 'line') {
      // Check if the user clicked near the line
      const startX = shape.startX;
      const startY = shape.startY;
      const endX = shape.endX;
      const endY = shape.endY;
      const distanceToLine = distanceToSegment({ x: offsetX, y: offsetY }, { x: startX, y: startY }, { x: endX, y: endY });

      // Set the tolerance for line selection (adjust as needed)
      const lineTolerance = 5;

      if (distanceToLine <= lineTolerance) {
        // Set the draggingShapeIndex and initial offset from the center of the shape
        draggingShapeIndex = i;
        recognizedShapes[draggingShapeIndex].offsetX = offsetX - shape.startX;
        recognizedShapes[draggingShapeIndex].offsetY = offsetY - shape.startY;
        break;
      }
    }
  }
}

// Function to handle dragging of the recognized shape
function drag(e) {
  if (draggingShapeIndex !== -1) {
    const { offsetX, offsetY } = getCoordinates(e);

    // Update the position of the dragged shape based on the mouse/touch movement
    recognizedShapes[draggingShapeIndex].centerX = offsetX - recognizedShapes[draggingShapeIndex].offsetX;
    recognizedShapes[draggingShapeIndex].centerY = offsetY - recognizedShapes[draggingShapeIndex].offsetY;

    // Redraw the canvas with the updated shape positions
    drawUserShape();
  }
}

// Function to handle the end of dragging
function endDragging() {
  // Reset the draggingShapeIndex to indicate dragging has ended
  draggingShapeIndex = -1;
}
