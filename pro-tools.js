document.addEventListener("DOMContentLoaded", function () {
  // 1. Template Gallery
  // 2. Character Counter
  // 3. Code Validation
  // 4. Responsive Preview

  // Add new section for templates and tools
  document.querySelector(".control-panel").insertAdjacentHTML(
    "beforeend",
    `
    <div class="control-group">
      <label>Professional Tools</label>
      <div class="toolbar">
        <button id="template-gallery" title="Template Gallery">📋</button>
        <button id="code-validator" title="Validate HTML">✓</button>
        <button id="responsive-preview" title="Responsive Preview">📱</button>
        <span id="char-counter" title="Character Count" style="margin-left: 10px; font-size: 12px; color: #666;"></span>
      </div>
    </div>
  `
  );

  // Initialize buttons
  const templateGalleryButton = document.getElementById("template-gallery");
  const codeValidatorButton = document.getElementById("code-validator");
  const responsivePreviewButton = document.getElementById("responsive-preview");
  const charCounter = document.getElementById("char-counter");
  const inputText = document.getElementById("input-text");

  // 1. Template Gallery functionality
  const templates = {
    "Blog Post": `<h1>Blog Post Title</h1>
<p class="meta">Posted on <time datetime="2025-03-13">March 13, 2025</time> by Author Name</p>
<img src="https://via.placeholder.com/800x400" alt="Featured Image" style="max-width: 100%; height: auto;">
<p>Introduction paragraph goes here. This is where you introduce your topic and grab the reader's attention.</p>
<h2>First Section Heading</h2>
<p>This is the first section of your blog post. Add your content here.</p>
<h2>Second Section Heading</h2>
<p>This is the second section of your blog post. Add your content here.</p>
<h3>Subsection</h3>
<p>You can add subsections to organize your content further.</p>
<h2>Conclusion</h2>
<p>Summarize your main points and provide a call to action.</p>
<div class="author-bio">
  <h3>About the Author</h3>
  <p>Author bio goes here.</p>
</div>`,
    "Product Page": `<div class="product-container">
  <h1 class="product-title">Product Name</h1>
  <div class="product-gallery">
    <img src="https://via.placeholder.com/500x500" alt="Product Image" class="main-image">
    <div class="thumbnails">
      <img src="https://via.placeholder.com/100x100" alt="Thumbnail 1">
      <img src="https://via.placeholder.com/100x100" alt="Thumbnail 2">
      <img src="https://via.placeholder.com/100x100" alt="Thumbnail 3">
    </div>
  </div>
  <div class="product-info">
    <p class="price">$99.99</p>
    <div class="rating">★★★★☆ (4.5/5)</div>
    <p class="description">Product description goes here. Highlight the key features and benefits.</p>
    <ul class="features">
      <li>Feature 1</li>
      <li>Feature 2</li>
      <li>Feature 3</li>
    </ul>
    <button class="buy-button">Add to Cart</button>
  </div>
  <div class="tabs">
    <div class="tab active">Description</div>
    <div class="tab">Specifications</div>
    <div class="tab">Reviews</div>
  </div>
  <div class="tab-content">
    <p>Detailed product description goes here.</p>
  </div>
</div>`,
    "Contact Form": `<div class="contact-form">
  <h2>Contact Us</h2>
  <form>
    <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
      <label for="subject">Subject:</label>
      <input type="text" id="subject" name="subject">
    </div>
    <div class="form-group">
      <label for="message">Message:</label>
      <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    <button type="submit">Send Message</button>
  </form>
</div>`,
  };

  templateGalleryButton.addEventListener("click", function () {
    const templateDialog = document.createElement("div");
    templateDialog.className = "template-dialog";
    templateDialog.style.cssText = `
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

    templateDialog.innerHTML = `
      <h3 style="margin-top: 0; margin-bottom: 15px;">Template Gallery</h3>
      <div style="margin-bottom: 10px;">
        <label style="display: block; margin-bottom: 5px;">Select a Template:</label>
        <select id="template-select" style="width: 100%; padding: 8px;">
          <option value="">Choose a template...</option>
          ${Object.keys(templates)
            .map((name) => `<option value="${name}">${name}</option>`)
            .join("")}
        </select>
      </div>
      <div id="template-preview" style="margin-top: 15px; max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; display: none;"></div>
      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button id="load-template" style="padding: 8px 15px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Load Template</button>
        <button id="cancel-template" style="padding: 8px 15px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
      </div>
    `;

    document.body.appendChild(templateDialog);

    const templateSelect = document.getElementById("template-select");
    const templatePreview = document.getElementById("template-preview");

    templateSelect.addEventListener("change", function () {
      const selectedTemplate = this.value;
      if (selectedTemplate && templates[selectedTemplate]) {
        templatePreview.innerHTML = templates[selectedTemplate];
        templatePreview.style.display = "block";
      } else {
        templatePreview.style.display = "none";
      }
    });

    document
      .getElementById("load-template")
      .addEventListener("click", function () {
        const selectedTemplate = templateSelect.value;
        if (selectedTemplate && templates[selectedTemplate]) {
          // Check if content exists and offer to replace or append
          if (inputText.value.trim()) {
            if (confirm("Replace existing content with template?")) {
              inputText.value = templates[selectedTemplate];
            } else {
              inputText.value += "\n\n" + templates[selectedTemplate];
            }
          } else {
            inputText.value = templates[selectedTemplate];
          }

          // Trigger update
          inputText.dispatchEvent(new Event("input"));

          // Show notification
          showNotification(`Template "${selectedTemplate}" loaded`);
        } else {
          showNotification("Please select a template", "error");
        }

        document.body.removeChild(templateDialog);
      });

    document
      .getElementById("cancel-template")
      .addEventListener("click", function () {
        document.body.removeChild(templateDialog);
      });
  });

  // 2. Character Counter functionality
  function updateCharCounter() {
    const text = inputText.value;
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    charCounter.textContent = `${charCount} chars | ${wordCount} words`;
  }

  inputText.addEventListener("input", updateCharCounter);
  updateCharCounter(); // Initial count

  // 3. Code Validation functionality
  codeValidatorButton.addEventListener("click", function () {
    const html = inputText.value.trim();
    if (!html) {
      showNotification("No HTML content to validate", "error");
      return;
    }

    // Simple HTML validation
    let validationResult = validateHTML(html);

    // Show validation results
    const validationDialog = document.createElement("div");
    validationDialog.className = "validation-dialog";
    validationDialog.style.cssText = `
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
      width: 500px;
    `;

    validationDialog.innerHTML = `
      <h3 style="margin-top: 0; margin-bottom: 15px;">HTML Validation Results</h3>
      <div style="margin-bottom: 10px; max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;">
        ${
          validationResult.valid
            ? '<div style="color: #2ecc71; font-weight: bold;">✓ HTML is valid</div>'
            : `<div style="color: #e74c3c; font-weight: bold;">× HTML validation issues found:</div>
             <ul style="margin-top: 10px;">${validationResult.errors
               .map((error) => `<li>${error}</li>`)
               .join("")}</ul>`
        }
      </div>
      <div style="display: flex; justify-content: center; margin-top: 20px;">
        <button id="close-validation" style="padding: 8px 15px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
      </div>
    `;

    document.body.appendChild(validationDialog);

    document
      .getElementById("close-validation")
      .addEventListener("click", function () {
        document.body.removeChild(validationDialog);
      });
  });

  // 4. Responsive Preview functionality
  responsivePreviewButton.addEventListener("click", function () {
    const html = inputText.value.trim();
    if (!html) {
      showNotification("No HTML content to preview", "error");
      return;
    }

    const previewDialog = document.createElement("div");
    previewDialog.className = "responsive-preview-dialog";
    previewDialog.style.cssText = `
      position: fixed;
      top: 5%;
      left: 5%;
      width: 90%;
      height: 90%;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 1000;
      display: flex;
      flex-direction: column;
    `;

    previewDialog.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0;">Responsive Preview</h3>
        <div>
          <button id="mobile-preview" style="padding: 5px 10px; margin-right: 5px;">Mobile</button>
          <button id="tablet-preview" style="padding: 5px 10px; margin-right: 5px;">Tablet</button>
          <button id="desktop-preview" style="padding: 5px 10px; margin-right: 5px;">Desktop</button>
          <button id="close-preview" style="padding: 5px 10px;">Close</button>
        </div>
      </div>
      <div style="flex-grow: 1; border: 1px solid #ddd; overflow: hidden; position: relative;">
        <iframe id="preview-frame" style="width: 100%; height: 100%; border: none; transition: width 0.3s ease;"></iframe>
      </div>
    `;

    document.body.appendChild(previewDialog);

    const previewFrame = document.getElementById("preview-frame");
    const mobileButton = document.getElementById("mobile-preview");
    const tabletButton = document.getElementById("tablet-preview");
    const desktopButton = document.getElementById("desktop-preview");
    const closeButton = document.getElementById("close-preview");

    // Set iframe content
    previewFrame.onload = function () {
      // Apply any additional styles for preview
      try {
        const frameDoc =
          previewFrame.contentDocument || previewFrame.contentWindow.document;
        const style = frameDoc.createElement("style");
        style.textContent = `
          body { margin: 0; padding: 10px; }
          * { box-sizing: border-box; }
        `;
        frameDoc.head.appendChild(style);
      } catch (e) {
        console.error("Could not modify iframe styles:", e);
      }
    };

    previewFrame.srcdoc = html;

    // Device preview buttons
    mobileButton.addEventListener("click", function () {
      previewFrame.style.width = "375px";
      previewFrame.style.margin = "0 auto";
    });

    tabletButton.addEventListener("click", function () {
      previewFrame.style.width = "768px";
      previewFrame.style.margin = "0 auto";
    });

    desktopButton.addEventListener("click", function () {
      previewFrame.style.width = "100%";
      previewFrame.style.margin = "0";
    });

    closeButton.addEventListener("click", function () {
      document.body.removeChild(previewDialog);
    });
  });

  // Helper function for basic HTML validation
  function validateHTML(html) {
    const errors = [];

    // Check for balanced tags
    const openTags = [];
    const voidTags = [
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ];

    // Extract all tags
    const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    let match;
    let line = 1;
    let lastIndex = 0;

    while ((match = tagRegex.exec(html)) !== null) {
      // Count lines
      line += (html.substring(lastIndex, match.index).match(/\n/g) || [])
        .length;
      lastIndex = match.index;

      const fullTag = match[0];
      const tagName = match[1].toLowerCase();

      // Check if it's a closing tag
      if (fullTag.indexOf("</") === 0) {
        if (openTags.length === 0) {
          errors.push(
            `Line ${line}: Unexpected closing tag </strong>${tagName}</strong> without matching opening tag`
          );
        } else if (openTags[openTags.length - 1] !== tagName) {
          errors.push(
            `Line ${line}: Expected closing tag </strong>${
              openTags[openTags.length - 1]
            }</strong>, found </strong>${tagName}</strong>`
          );
        } else {
          openTags.pop();
        }
      }
      // Check if it's an opening tag (and not a void tag)
      else if (
        fullTag.indexOf("/>") === -1 &&
        voidTags.indexOf(tagName) === -1
      ) {
        openTags.push(tagName);
      }
    }

    // Check if all tags are closed
    if (openTags.length > 0) {
      errors.push(`Unclosed tags: <strong>${openTags.join(", ")}</strong>`);
    }

    // Check for proper DOCTYPE
    if (!html.match(/<!DOCTYPE\s+html>/i)) {
      errors.push("Missing <!DOCTYPE html> declaration");
    }

    // Check for basic required tags
    if (!html.match(/<html[\s>]/i)) {
      errors.push("Missing <html> tag");
    }

    if (!html.match(/<head[\s>]/i)) {
      errors.push("Missing <head> tag");
    }

    if (!html.match(/<body[\s>]/i)) {
      errors.push("Missing <body> tag");
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  // Helper function to show notifications
  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 20px;
      background-color: ${type === "success" ? "#2ecc71" : "#e74c3c"};
      color: white;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  }

  // Add CSS animations for notifications
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(styleElement);
});
