
      
// Add new structure tag buttons to the toolbar
document.querySelector('.toolbar:first-of-type').insertAdjacentHTML('beforeend', `
  <button id="insert-div" title="Insert Div">div</button>
  <button id="insert-article" title="Insert Article">article</button>
  <button id="insert-section" title="Insert Section">section</button>
  <button id="insert-details" title="Insert Details with Summary">details</button>
`);

// Initialize button references
const insertDivButton = document.getElementById('insert-div');
const insertArticleButton = document.getElementById('insert-article');
const insertSectionButton = document.getElementById('insert-section');
const insertDetailsButton = document.getElementById('insert-details');

// Add event listeners to the new buttons
insertDivButton.addEventListener('click', () => insertStructureTag('div'));
insertArticleButton.addEventListener('click', () => insertStructureTag('article'));
insertSectionButton.addEventListener('click', () => insertStructureTag('section'));
insertDetailsButton.addEventListener('click', insertDetailsWithSummary);

// Register the new buttons with the undo/redo functionality
[insertDivButton, insertArticleButton, insertSectionButton, insertDetailsButton].forEach(btn => {
  btn.addEventListener('click', saveState);
});

/**
 * Insert a structural HTML tag with proper indentation
 * @param {string} tagName - The name of the tag to insert (div, article, section)
 */
function insertStructureTag(tagName) {
  const selection = getSelectedText();
  let content = selection.text.trim();
  let newText;
  
  // If there's selected text, wrap it in the tag
  if (content) {
    // Add proper indentation
    const contentLines = content.split('\n');
    const indentedContent = contentLines.map(line => '  ' + line).join('\n');
    
    newText = `<${tagName}>\n${indentedContent}\n</${tagName}>`;
  } else {
    // If no selection, create an empty tag with placeholder
    newText = `<${tagName}>\n  Content goes here\n</${tagName}>`;
  }
  
  // Replace the selected text with the new tagged content
  const textBefore = inputText.value.substring(0, selection.start);
  const textAfter = inputText.value.substring(selection.end);
  
  inputText.value = textBefore + newText + textAfter;
  inputText.focus();
  
  // Place cursor inside the tag if there was no selection
  if (!content) {
    const cursorPosition = selection.start + tagName.length + 3 + 2; // +3 for "<>\n", +2 for indentation
    inputText.selectionStart = cursorPosition;
    inputText.selectionEnd = cursorPosition + "Content goes here".length;
  }
  
  updatePreview();
}

/**
 * Insert a details element with a summary
 */
function insertDetailsWithSummary() {
  const selection = getSelectedText();
  const content = selection.text.trim();
  let newText;
  
  // If there's selected text, use the first line as summary and the rest as content
  if (content) {
    const lines = content.split('\n');
    const summary = lines[0];
    const detailsContent = lines.length > 1 
      ? lines.slice(1).join('\n').trim() 
      : 'Content goes here';
    
    // Format with proper indentation
    newText = `<details>\n  <summary>${summary}</summary>\n  ${detailsContent}\n</details>`;
  } else {
    // If no selection, create empty details with placeholder
    newText = `<details>\n  <summary>Summary title</summary>\n  Content goes here\n</details>`;
  }
  
  // Replace the selected text with the new details element
  const textBefore = inputText.value.substring(0, selection.start);
  const textAfter = inputText.value.substring(selection.end);
  
  inputText.value = textBefore + newText + textAfter;
  inputText.focus();
  
  // Place cursor at the summary section if there was no selection
  if (!content) {
    const cursorPosition = selection.start + '<details>\n  <summary>'.length;
    inputText.selectionStart = cursorPosition;
    inputText.selectionEnd = cursorPosition + "Summary title".length;
  }
  
  updatePreview();
}
