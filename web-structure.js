// Structural HTML Elements Addition Script
// This script adds header, footer, aside, nav, and main structural elements
// to the Advanced Text to HTML Converter

// Add a new dropdown for structural elements to the toolbar
document.querySelector('.control-panel').insertAdjacentHTML('beforeend', `
  <div class="control-group">
    <label for="structure-elements">Page Structure</label>
    <div class="toolbar">
      <select id="structure-select" class="dropdown">
        <option value="">Add Structure</option>
        <option value="header">Header</option>
        <option value="footer">Footer</option>
        <option value="aside">Aside</option>
        <option value="nav">Navigation</option>
        <option value="main">Main Content</option>
      </select>
    </div>
  </div>
`);

// Initialize structure dropdown
const structureSelect = document.getElementById('structure-select');

// Add event listener for structure selection
structureSelect.addEventListener('change', function() {
  if (this.value) {
    insertStructuralElement(this.value);
    this.value = ''; // Reset dropdown after selection
    saveState(); // Save for undo/redo functionality
  }
});

/**
 * Insert a structural HTML element based on the selected type
 * @param {string} elementType - The type of structural element to insert (header, footer, etc.)
 */
function insertStructuralElement(elementType) {
  const selection = getSelectedText();
  let content = selection.text.trim();
  let newText;
  
  // Prepare the template based on the selected element type
  switch (elementType) {
    case 'header':
      newText = createHeaderTemplate(content);
      break;
    case 'footer':
      newText = createFooterTemplate(content);
      break;
    case 'aside':
      newText = createAsideTemplate(content);
      break;
    case 'nav':
      newText = createNavTemplate(content);
      break;
    case 'main':
      newText = createMainTemplate(content);
      break;
  }
  
  // Replace the selected text with the new element
  const textBefore = inputText.value.substring(0, selection.start);
  const textAfter = inputText.value.substring(selection.end);
  
  inputText.value = textBefore + newText + textAfter;
  inputText.focus();
  
  // If no content was selected, position cursor inside the element
  if (!content) {
    // Position cursor after the opening tag and indentation
    const cursorPosition = selection.start + elementType.length + 12; // <elementType>\n  plus some adjustment
    inputText.selectionStart = cursorPosition;
    inputText.selectionEnd = cursorPosition;
  }
  
  updatePreview();
  
  // Show a helpful notification
  showNotification(`${elementType.charAt(0).toUpperCase() + elementType.slice(1)} element inserted`);
}

/**
 * Create a header element template
 * @param {string} content - The content to include in the header
 * @returns {string} - The formatted header HTML
 */
function createHeaderTemplate(content) {
  if (content) {
    return `<header>\n  ${content.split('\n').join('\n  ')}\n</header>`;
  } else {
    return `<header>\n  <h1>Website Title</h1>\n  <p>Tagline or subtitle</p>\n</header>`;
  }
}

/**
 * Create a footer element template
 * @param {string} content - The content to include in the footer
 * @returns {string} - The formatted footer HTML
 */
function createFooterTemplate(content) {
  if (content) {
    return `<footer>\n  ${content.split('\n').join('\n  ')}\n</footer>`;
  } else {
    return `<footer>\n  <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>\n  <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>\n</footer>`;
  }
}

/**
 * Create an aside element template
 * @param {string} content - The content to include in the aside
 * @returns {string} - The formatted aside HTML
 */
function createAsideTemplate(content) {
  if (content) {
    return `<aside>\n  ${content.split('\n').join('\n  ')}\n</aside>`;
  } else {
    return `<aside>\n  <h3>Sidebar Heading</h3>\n  <ul>\n    <li><a href="#">Related Link 1</a></li>\n    <li><a href="#">Related Link 2</a></li>\n    <li><a href="#">Related Link 3</a></li>\n  </ul>\n</aside>`;
  }
}

/**
 * Create a nav element template
 * @param {string} content - The content to include in the nav
 * @returns {string} - The formatted nav HTML
 */
function createNavTemplate(content) {
  if (content) {
    return `<nav>\n  ${content.split('\n').join('\n  ')}\n</nav>`;
  } else {
    return `<nav>\n  <ul>\n    <li><a href="#">Home</a></li>\n    <li><a href="#">About</a></li>\n    <li><a href="#">Services</a></li>\n    <li><a href="#">Contact</a></li>\n  </ul>\n</nav>`;
  }
}

/**
 * Create a main element template
 * @param {string} content - The content to include in the main
 * @returns {string} - The formatted main HTML
 */
function createMainTemplate(content) {
  if (content) {
    return `<main>\n  ${content.split('\n').join('\n  ')}\n</main>`;
  } else {
    return `<main>\n  <section>\n    <h2>Section Title</h2>\n    <p>Main content goes here. This is the primary content of your page.</p>\n  </section>\n</main>`;
  }
}

// Add CSS styles for the structural elements preview
const styleElement = document.createElement('style');
styleElement.textContent = `
  /* Preview styles for structural elements */
  #preview-content header {
    background-color: #f8f9fa;
    padding: 10px;
    margin-bottom: 15px;
    border-bottom: 1px solid #dee2e6;
  }
  
  #preview-content footer {
    background-color: #f8f9fa;
    padding: 10px;
    margin-top: 15px;
    border-top: 1px solid #dee2e6;
    font-size: 0.9em;
  }
  
  #preview-content aside {
    background-color: #f7f7f9;
    padding: 10px;
    width: 30%;
    float: right;
    margin-left: 15px;
    border-left: 1px solid #dee2e6;
  }
  
  #preview-content nav {
    background-color: #343a40;
    padding: 10px;
    margin-bottom: 15px;
  }
  
  #preview-content nav ul {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
  }
  
  #preview-content nav li {
    margin-right: 15px;
  }
  
  #preview-content nav a {
    color: white;
    text-decoration: none;
  }
  
  #preview-content main {
    min-height: 300px;
    padding: 10px;
  }
`;
document.head.appendChild(styleElement);

// Register this new dropdown with the undo/redo functionality
structureSelect.addEventListener('change', saveState);

// Add to keyboard shortcuts documentation if it exists
if (typeof updateKeyboardShortcutsHelp === 'function') {
  updateKeyboardShortcutsHelp('structure-elements', [
    { keys: 'Ctrl+Shift+H', description: 'Insert Header element' },
    { keys: 'Ctrl+Shift+F', description: 'Insert Footer element' },
    { keys: 'Ctrl+Shift+A', description: 'Insert Aside element' },
    { keys: 'Ctrl+Shift+N', description: 'Insert Nav element' },
    { keys: 'Ctrl+Shift+M', description: 'Insert Main element' }
  ]);
}

// Add keyboard shortcuts for structural elements
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.shiftKey) {
    switch (e.key.toUpperCase()) {
      case 'H': // Header
        if (!e.target.matches('input, textarea#input-text')) {
          e.preventDefault();
          insertStructuralElement('header');
        }
        break;
      case 'F': // Footer
        e.preventDefault();
        insertStructuralElement('footer');
        break;
      case 'A': // Aside
        e.preventDefault();
        insertStructuralElement('aside');
        break;
      case 'N': // Nav
        e.preventDefault();
        insertStructuralElement('nav');
        break;
      case 'M': // Main
        e.preventDefault();
        insertStructuralElement('main');
        break;
    }
  }
});

// Add the new structural elements to the right-click context menu if it exists
if (typeof addContextMenuItem === 'function') {
  addContextMenuItem('Insert Header', () => insertStructuralElement('header'));
  addContextMenuItem('Insert Footer', () => insertStructuralElement('footer'));
  addContextMenuItem('Insert Aside', () => insertStructuralElement('aside'));
  addContextMenuItem('Insert Nav', () => insertStructuralElement('nav'));
  addContextMenuItem('Insert Main', () => insertStructuralElement('main'));
}

