// First script: Line break and horizontal rule functionalities

// Add new buttons to the toolbar
document.querySelector(".toolbar:first-of-type").insertAdjacentHTML(
  "beforeend",
  `
  <button id="insert-break" title="Line Break">↵</button>
  <button id="insert-hr" title="Horizontal Rule">—</button>
`
);

// Initialize buttons
const insertBreakButton = document.getElementById("insert-break");
const insertHrButton = document.getElementById("insert-hr");

// Line Break functionality
insertBreakButton.addEventListener("click", function () {
  saveState(); // Save current state for undo/redo
  insertAtCursor("<br>");
  updatePreview();
});

// Horizontal Rule functionality
insertHrButton.addEventListener("click", function () {
  saveState(); // Save current state for undo/redo
  insertAtCursor("<hr>");
  updatePreview();
});

// Add keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl+Shift+B - Insert Break
  if (e.ctrlKey && e.shiftKey && e.key === "B") {
    e.preventDefault();
    insertBreakButton.click();
  }
  // Ctrl+Shift+H - Insert Horizontal Rule
  else if (e.ctrlKey && e.shiftKey && e.key === "H") {
    e.preventDefault();
    insertHrButton.click();
  }
});

// Add event listeners to make sure state is saved before using the buttons
[insertBreakButton, insertHrButton].forEach((button) => {
  button.addEventListener("click", function () {
    saveState();
  });
});
