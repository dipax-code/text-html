// Second script: Save and load draft functionalities

// Add new section for drafts
document.querySelector('.control-panel').insertAdjacentHTML('beforeend', `
  <div class="control-group">
    <label>Storage</label>
    <div class="toolbar">
      <button id="save-draft" title="Save Draft">💾</button>
      <button id="load-draft" title="Load Draft">📂</button>
      <button id="export-html" title="Export HTML">📤</button>
    </div>
  </div>
`);

// Initialize buttons
const saveDraftButton = document.getElementById('save-draft');
const loadDraftButton = document.getElementById('load-draft');
const exportHtmlButton = document.getElementById('export-html');

// Save HTML as draft functionality
saveDraftButton.addEventListener('click', function() {
  const htmlContent = inputText.value;
  if (!htmlContent.trim()) {
    showNotification('No content to save', 'error');
    return;
  }
  
  const draftName = prompt('Enter a name for this draft:', 'Draft ' + new Date().toLocaleDateString());
  if (!draftName) return;
  
  try {
    // Get existing drafts
    const existingDrafts = JSON.parse(localStorage.getItem('htmlGeneratorDrafts') || '{}');
    
    // Add new draft
    existingDrafts[draftName] = {
      content: htmlContent,
      savedAt: new Date().toISOString()
    };
    
    // Save back to localStorage
    localStorage.setItem('htmlGeneratorDrafts', JSON.stringify(existingDrafts));
    
    showNotification(`Draft "${draftName}" saved successfully`);
  } catch (error) {
    console.error('Error saving draft:', error);
    showNotification('Failed to save draft', 'error');
  }
});

// Load HTML from draft functionality
loadDraftButton.addEventListener('click', function() {
  try {
    // Get existing drafts
    const existingDrafts = JSON.parse(localStorage.getItem('htmlGeneratorDrafts') || '{}');
    const draftNames = Object.keys(existingDrafts);
    
    if (draftNames.length === 0) {
      showNotification('No saved drafts found', 'error');
      return;
    }
    
    // Create a draft selection dropdown
    const draftSelector = document.createElement('div');
    draftSelector.className = 'draft-selector';
    draftSelector.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 1000;
      max-width: 80%;
      width: 400px;
    `;
    
    draftSelector.innerHTML = `
      <h3 style="margin-top: 0; margin-bottom: 15px;">Select a Draft to Load</h3>
      <select id="draft-select" style="width: 100%; padding: 8px; margin-bottom: 15px;">
        ${draftNames.map(name => `<option value="${name}">${name} (${new Date(existingDrafts[name].savedAt).toLocaleString()})</option>`).join('')}
      </select>
      <div style="display: flex; justify-content: space-between;">
        <button id="load-selected-draft" style="padding: 8px 15px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Load</button>
        <button id="delete-selected-draft" style="padding: 8px 15px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
        <button id="cancel-draft-selection" style="padding: 8px 15px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
      </div>
    `;
    
    document.body.appendChild(draftSelector);
    
    // Event listeners for draft selection dialog
    document.getElementById('load-selected-draft').addEventListener('click', function() {
      const selectedDraft = document.getElementById('draft-select').value;
      if (selectedDraft && existingDrafts[selectedDraft]) {
        saveState(); // Save current state for undo/redo
        inputText.value = existingDrafts[selectedDraft].content;
        updatePreview();
        showNotification(`Draft "${selectedDraft}" loaded successfully`);
      }
      document.body.removeChild(draftSelector);
    });
    
    document.getElementById('delete-selected-draft').addEventListener('click', function() {
      const selectedDraft = document.getElementById('draft-select').value;
      if (selectedDraft && existingDrafts[selectedDraft]) {
        if (confirm(`Are you sure you want to delete the draft "${selectedDraft}"?`)) {
          delete existingDrafts[selectedDraft];
          localStorage.setItem('htmlGeneratorDrafts', JSON.stringify(existingDrafts));
          showNotification(`Draft "${selectedDraft}" deleted successfully`);
          
          // Close the dialog if no drafts remain
          if (Object.keys(existingDrafts).length === 0) {
            document.body.removeChild(draftSelector);
          } else {
            // Refresh the select options
            document.getElementById('draft-select').innerHTML = Object.keys(existingDrafts)
              .map(name => `<option value="${name}">${name} (${new Date(existingDrafts[name].savedAt).toLocaleString()})</option>`)
              .join('');
          }
        }
      }
    });
    
    document.getElementById('cancel-draft-selection').addEventListener('click', function() {
      document.body.removeChild(draftSelector);
    });
    
  } catch (error) {
    console.error('Error loading drafts:', error);
    showNotification('Failed to load drafts', 'error');
  }
});

// Export HTML functionality
exportHtmlButton.addEventListener('click', function() {
  const htmlContent = inputText.value;
  if (!htmlContent.trim()) {
    showNotification('No content to export', 'error');
    return;
  }
  
  const fileName = prompt('Enter file name:', 'my-html-document.html');
  if (!fileName) return;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  
  URL.revokeObjectURL(url);
  showNotification(`HTML exported as ${fileName}`);
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl+Shift+S - Save Draft
  if (e.ctrlKey && e.shiftKey && e.key === 'S') {
    e.preventDefault();
    saveDraftButton.click();
  }
  // Ctrl+Shift+L - Load Draft
  else if (e.ctrlKey && e.shiftKey && e.key === 'L') {
    e.preventDefault();
    loadDraftButton.click();
  }
});

// Function to check if localStorage is available
function isLocalStorageAvailable() {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}

// Check if localStorage is available and update UI accordingly
if (!isLocalStorageAvailable()) {
  saveDraftButton.disabled = true;
  loadDraftButton.disabled = true;
  saveDraftButton.title += ' (Not available in private browsing)';
  loadDraftButton.title += ' (Not available in private browsing)';
}

// Helper function to create a modal dialog
function createModal(title, content, buttons) {
  const modal = document.createElement('div');
  modal.className = 'custom-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 80%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  `;
  
  // Add title
  const titleElement = document.createElement('h3');
  titleElement.innerText = title;
  titleElement.style.marginTop = '0';
  titleElement.style.marginBottom = '15px';
  modalContent.appendChild(titleElement);
  
  // Add content
  if (typeof content === 'string') {
    const contentElement = document.createElement('div');
    contentElement.innerHTML = content;
    modalContent.appendChild(contentElement);
  } else {
    modalContent.appendChild(content);
  }
  
  // Add buttons
  if (buttons && buttons.length) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    `;
    
    buttons.forEach(button => {
      const buttonElement = document.createElement('button');
      buttonElement.innerText = button.text;
      buttonElement.style.cssText = `
        padding: 8px 15px;
        background: ${button.primary ? '#3498db' : '#95a5a6'};
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      `;
      buttonElement.addEventListener('click', () => {
        if (button.onClick) button.onClick();
        document.body.removeChild(modal);
      });
      buttonContainer.appendChild(buttonElement);
    });
    
    modalContent.appendChild(buttonContainer);
  }
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  return modal;
}
