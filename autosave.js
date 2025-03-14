
    // Autosave functionality for HTML Converter
    document.addEventListener('DOMContentLoaded', function() {
      const inputText = document.getElementById('input-text');
      const AUTO_SAVE_KEY = 'htmlConverter_autoSave';
      const AUTO_SAVE_INTERVAL = 3000; // Save every 3 seconds
      
      // Load saved content when page loads
      loadSavedContent();
      
      // Set up autosave timer
      let autoSaveTimer;
      
      function startAutoSave() {
        // Clear any existing timer
        if (autoSaveTimer) {
          clearInterval(autoSaveTimer);
        }
        
        // Set up new timer
        autoSaveTimer = setInterval(saveContent, AUTO_SAVE_INTERVAL);
      }
      
      function saveContent() {
        if (inputText && inputText.value.trim() !== '') {
          try {
            localStorage.setItem(AUTO_SAVE_KEY, inputText.value);
            // Update the timestamp
            localStorage.setItem(AUTO_SAVE_KEY + '_timestamp', new Date().toISOString());
          } catch (error) {
            console.error('Error saving content:', error);
          }
        }
      }
      
      function loadSavedContent() {
        try {
          const savedContent = localStorage.getItem(AUTO_SAVE_KEY);
          if (savedContent && inputText) {
            inputText.value = savedContent;
            
            // Trigger the updatePreview function to display the saved content
            const event = new Event('input', {
              bubbles: true,
              cancelable: true,
            });
            inputText.dispatchEvent(event);
            
            // Show a notification about restored content
            const timestamp = localStorage.getItem(AUTO_SAVE_KEY + '_timestamp');
            if (timestamp) {
              const date = new Date(timestamp);
              const formattedDate = date.toLocaleString();
              showNotification(`Content restored from ${formattedDate}`);
            } else {
              showNotification('Previously saved content restored');
            }
          }
        } catch (error) {
          console.error('Error loading saved content:', error);
        }
      }
      
      // Function to clear autosaved content
      function clearAutoSavedContent() {
        try {
          localStorage.removeItem(AUTO_SAVE_KEY);
          localStorage.removeItem(AUTO_SAVE_KEY + '_timestamp');
        } catch (error) {
          console.error('Error clearing autosaved content:', error);
        }
      }
      
      // Add event listeners
      inputText.addEventListener('input', function() {
        // Reset the timer on user input
        startAutoSave();
      });
      
      // Handle clear button to also clear autosaved content
      const clearAllButton = document.getElementById('clear-all');
      if (clearAllButton) {
        // Store the original onclick function
        const originalClearFunction = clearAllButton.onclick;
        
        clearAllButton.onclick = function(event) {
          // Call the original function first
          if (originalClearFunction) {
            originalClearFunction.call(this, event);
          }
          
          // Then clear the autosaved content
          clearAutoSavedContent();
          showNotification('All content cleared including autosaved data');
        };
      }
      
      // Start autosave when the page loads
      startAutoSave();
      
      // Add autosave indicator to the UI
      const headerSubtitle = document.querySelector('.subtitle');
      if (headerSubtitle) {
        headerSubtitle.innerHTML += ' <span id="autosave-indicator" style="font-size: 12px; opacity: 0.8;">(Autosave enabled)</span>';
      }
      
      // Add autosave status to the control panel
      const controlPanel = document.querySelector('.control-panel');
      if (controlPanel) {
        const autosaveStatus = document.createElement('div');
        autosaveStatus.id = 'autosave-status';
        autosaveStatus.style.cssText = 'font-size: 12px; margin-top: 10px; color: #666; text-align: right;';
        autosaveStatus.innerHTML = 'Autosave: <span style="color: #2ecc71;">Enabled</span>';
        controlPanel.appendChild(autosaveStatus);
      }
      
      // Check if localStorage is available
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
      
      // Update UI if localStorage is not available
      if (!isLocalStorageAvailable()) {
        const autosaveIndicator = document.getElementById('autosave-indicator');
        if (autosaveIndicator) {
          autosaveIndicator.innerHTML = '(Autosave unavailable in private browsing)';
          autosaveIndicator.style.color = '#e74c3c';
        }
        
        const autosaveStatus = document.getElementById('autosave-status');
        if (autosaveStatus) {
          autosaveStatus.innerHTML = 'Autosave: <span style="color: #e74c3c;">Unavailable</span>';
        }
      }
    });
    
