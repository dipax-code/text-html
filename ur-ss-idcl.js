
      // 1. Undo/Redo functionality with keyboard shortcuts
      const undoStack = [];
      const redoStack = [];
      let isUndoRedoAction = false;

      // Add undo/redo buttons to toolbar
      document.querySelector('.toolbar:first-of-type').insertAdjacentHTML('beforeend', `
        <button id="undo-button" title="Undo (Ctrl+Z)">↩</button>
        <button id="redo-button" title="Redo (Ctrl+Y)">↪</button>
      `);

      // Initialize buttons
      const undoButton = document.getElementById('undo-button');
      const redoButton = document.getElementById('redo-button');

      // Disable buttons initially
      undoButton.disabled = true;
      redoButton.disabled = true;

      // Save current state function
      function saveState() {
        if (isUndoRedoAction) return;

        // Push current text to undo stack
        undoStack.push(inputText.value);
        // Clear redo stack when new changes are made
        redoStack.length = 0;

        // Update button states
        undoButton.disabled = false;
        redoButton.disabled = true;
      }

      // Handle input changes to save state
      inputText.addEventListener('input', function(e) {
        if (!isUndoRedoAction) {
          saveState();
        }
        updatePreview();
      });

      // Undo function
      function performUndo() {
        if (undoStack.length === 0) return;

        isUndoRedoAction = true;

        // Save current state to redo stack
        redoStack.push(inputText.value);

        // Pop state from undo stack
        const previousState = undoStack.pop();
        inputText.value = previousState;

        // Update button states
        undoButton.disabled = undoStack.length === 0;
        redoButton.disabled = false;

        updatePreview();
        isUndoRedoAction = false;
      }

      // Redo function
      function performRedo() {
        if (redoStack.length === 0) return;

        isUndoRedoAction = true;

        // Save current state to undo stack
        undoStack.push(inputText.value);

        // Pop state from redo stack
        const nextState = redoStack.pop();
        inputText.value = nextState;

        // Update button states
        undoButton.disabled = false;
        redoButton.disabled = redoStack.length === 0;

        updatePreview();
        isUndoRedoAction = false;
      }

      // Add keyboard shortcuts
      document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'z') {
          e.preventDefault();
          performUndo();
        } else if (e.ctrlKey && e.key === 'y') {
          e.preventDefault();
          performRedo();
        }
      });

      // Add button event listeners
      undoButton.addEventListener('click', performUndo);
      redoButton.addEventListener('click', performRedo);

      // Init state for newly added elements
      document.querySelectorAll('.toolbar button:not(#undo-button):not(#redo-button), .table-generator button')
        .forEach(btn => {
        btn.addEventListener('click', saveState);
      });

      // 2. Insert Link Functionality
      // ---------------------------
      document.querySelector('.toolbar:first-of-type').insertAdjacentHTML('beforeend', `
        <button id="insert-link" title="Insert Link">🔗</button>
      `);

      const insertLinkButton = document.getElementById('insert-link');

      insertLinkButton.addEventListener('click', function() {
        const selection = getSelectedText();

        if (!selection.text) {
          showNotification('Select text first to create a link', 'error');
          return;
        }

        const url = prompt('Enter URL:', 'https://');
        if (!url) return;

        saveState();

        const linkTag = `<a href="${url}" target="_blank">${selection.text}</a>`;
        const textBefore = inputText.value.substring(0, selection.start);
        const textAfter = inputText.value.substring(selection.end);

        inputText.value = textBefore + linkTag + textAfter;
        inputText.focus();
        updatePreview();
      });

      // 3. Subscript and Superscript Functionality
      // -----------------------------------------
      document.querySelector('.toolbar:first-of-type').insertAdjacentHTML('beforeend', `
        <button id="format-subscript" title="Subscript">x₂</button>
        <button id="format-superscript" title="Superscript">x²</button>
      `);

      const formatSubscript = document.getElementById('format-subscript');
      const formatSuperscript = document.getElementById('format-superscript');

      formatSubscript.addEventListener('click', () => insertTag('sub'));
      formatSuperscript.addEventListener('click', () => insertTag('sup'));

      // 4. Add Identifiers (Class/ID) Functionality
      // ------------------------------------------
      document.querySelector('.toolbar:first-of-type').insertAdjacentHTML('beforeend', `
        <button id="add-identifier" title="Add Class/ID">ID/Class</button>
      `);

      const addIdentifierButton = document.getElementById('add-identifier');

      addIdentifierButton.addEventListener('click', function() {
        // First check if there's a tag at the cursor position
        const cursorPos = inputText.selectionStart;
        const textBefore = inputText.value.substring(0, cursorPos);

        // Try to find the last opening tag before cursor
        const lastTagPos = textBefore.lastIndexOf('<');
        if (lastTagPos === -1) {
          showNotification('Position cursor inside or right after an HTML tag', 'error');
          return;
        }

        // Extract tag portion
        const potentialTag = inputText.value.substring(lastTagPos);
        const tagEndPos = potentialTag.indexOf('>');
        if (tagEndPos === -1) {
          showNotification('No valid HTML tag found', 'error');
          return;
        }

        const tagContent = potentialTag.substring(0, tagEndPos);
        if (tagContent.includes('/')) {
          showNotification('Cannot add identifiers to closing tags', 'error');
          return;
        }

        // Prompt for class or ID
        const identifierType = prompt('Enter identifier type (class or id):', 'class');
        if (!identifierType || (identifierType !== 'class' && identifierType !== 'id')) {
          return;
        }

        const identifierValue = prompt(`Enter ${identifierType} value:`, identifierType === 'class' ? 'my-class' : 'my-id');
        if (!identifierValue) return;

        saveState();

        // Insert the identifier before the closing angle bracket
        const absoluteTagEndPos = lastTagPos + tagEndPos;
        const modifiedTag = tagContent + ` ${identifierType}="${identifierValue}"`;

        const textBeforeTag = inputText.value.substring(0, lastTagPos);
        const textAfterTag = inputText.value.substring(absoluteTagEndPos);

        inputText.value = textBeforeTag + modifiedTag + textAfterTag;
        updatePreview();
      });

    
