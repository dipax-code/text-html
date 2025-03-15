
 
// Add the text formatting dropdown to the toolbar
document.querySelector('.toolbar:first-of-type').insertAdjacentHTML('beforeend', `
  <select id="text-format-select" class="dropdown">
    <option value="">Text Format</option>
    <option value="mark">Mark (Highlight)</option>
    <option value="strong">Strong</option>
    <option value="em">Emphasis</option>
    <option value="blockquote">Blockquote</option>
    <option value="abbr">Abbreviation</option>
    <option value="cite">Citation</option>
    <option value="time">Time</option>
  </select>
`);

// Initialize the dropdown reference
const textFormatSelect = document.getElementById('text-format-select');

// Add event listener to the dropdown
textFormatSelect.addEventListener('change', function() {
  if (this.value) {
    applyTextFormatting(this.value);
    this.value = ''; // Reset dropdown after selection
    saveState(); // Add to undo stack
  }
});

//Apply text formatting based on the selected tag
// @param {string} formatType - The type of formatting to apply
function applyTextFormatting(formatType) {
  const selection = getSelectedText();
  const hasSelection = selection.text.trim().length > 0;
  
  switch(formatType) {
    case 'mark':
      insertTag('mark');
      break;
      
    case 'strong':
      insertTag('strong');
      break;
      
    case 'em':
      insertTag('em');
      break;
      
    case 'blockquote':
      insertBlockquote();
      break;
      
    case 'abbr':
      insertAbbreviation();
      break;
      
    case 'cite':
      insertTag('cite');
      break;
      
    case 'time':
      insertTimeElement();
      break;
  }
}

// Insert a blockquote element
 
function insertBlockquote() {
  const selection = getSelectedText();
  const content = selection.text.trim();
  let newText;
  
  if (content) {
    // Add proper indentation for blockquote content
    const contentLines = content.split('\n');
    const indentedContent = contentLines.map(line => '  ' + line).join('\n');
    
    newText = `<blockquote>\n${indentedContent}\n</blockquote>`;
  } else {
    // Create empty blockquote with placeholder
    newText = `<blockquote>\n  Quote goes here\n</blockquote>`;
  }
  
  // Replace the selected text with the new blockquote
  const textBefore = inputText.value.substring(0, selection.start);
  const textAfter = inputText.value.substring(selection.end);
  
  inputText.value = textBefore + newText + textAfter;
  inputText.focus();
  
  // Place cursor inside the blockquote if there was no selection
  if (!content) {
    const cursorPosition = selection.start + '<blockquote>\n  '.length;
    inputText.selectionStart = cursorPosition;
    inputText.selectionEnd = cursorPosition + "Quote goes here".length;
  }
  
  updatePreview();
}

// Insert an abbreviation element with title attribute
 
function insertAbbreviation() {
  const selection = getSelectedText();
  const selectedText = selection.text.trim();
  
  if (selectedText) {
    // If text is selected, prompt for the full form
    const fullForm = prompt('Enter the full form of the abbreviation:', '');
    if (fullForm === null) return; // User canceled
    
    const newText = `<abbr title="${fullForm}">${selectedText}</abbr>`;
    
    // Replace the selected text with the abbr element
    const textBefore = inputText.value.substring(0, selection.start);
    const textAfter = inputText.value.substring(selection.end);
    
    inputText.value = textBefore + newText + textAfter;
  } else {
    // If no text is selected, create a sample abbreviation
    const abbr = prompt('Enter the abbreviation:', 'HTML');
    if (abbr === null) return; // User canceled
    
    const fullForm = prompt('Enter the full form:', 'Hypertext Markup Language');
    if (fullForm === null) return; // User canceled
    
    const newText = `<abbr title="${fullForm}">${abbr}</abbr>`;
    insertAtCursor(newText);
  }
  
  updatePreview();
}

// Insert a time element with datetime attribute
 
function insertTimeElement() {
  const selection = getSelectedText();
  const selectedText = selection.text.trim();
  
  if (selectedText) {
    // If text is selected, prompt for the machine-readable datetime
    const datetime = prompt('Enter ISO datetime (e.g., 2023-03-25T12:00:00):', 
                           new Date().toISOString().slice(0, 16));
    if (datetime === null) return; // User canceled
    
    const newText = `<time datetime="${datetime}">${selectedText}</time>`;
    
    // Replace the selected text with the time element
    const textBefore = inputText.value.substring(0, selection.start);
    const textAfter = inputText.value.substring(selection.end);
    
    inputText.value = textBefore + newText + textAfter;
  } else {
    // If no text is selected, use current date/time as an example
    const now = new Date();
    const readableTime = now.toLocaleString();
    const machineTime = now.toISOString();
    
    const newText = `<time datetime="${machineTime}">${readableTime}</time>`;
    insertAtCursor(newText);
  }
  
  updatePreview();
}
