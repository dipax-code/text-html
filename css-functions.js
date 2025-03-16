// Enhanced CSS Adding Functionality with Fixes
// ---------------------------------

// Remove existing CSS panel if any
const existingCssPanel = document.querySelector(
  ".main-content > .control-panel:last-child"
);
if (existingCssPanel && existingCssPanel.querySelector("#css-area")) {
  existingCssPanel.remove();
}

// Add new CSS panel
document.querySelector(".main-content").insertAdjacentHTML(
  "beforeend",
  `
  <div class="control-panel" style="margin-top: 10px;">
    <div class="control-group">
      <label for="css-editor">CSS Editor</label>
      <div class="css-tools" style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 10px;">
        <select id="css-selector-type" class="dropdown">
          <option value="inline">Inline Style</option>
          <option value="id">ID Selector</option>
          <option value="class">Class Selector</option>
          <option value="tag">Tag Selector</option>
        </select>
        <div class="selector-container" style="position: relative; flex-grow: 1;">
          <input type="text" id="css-selector-value" placeholder="Selector value" style="width: 100%;">
          <div id="selector-suggestions" class="suggestions" style="display: none; position: absolute; z-index: 10; width: 100%; max-height: 150px; overflow-y: auto; background: white; border: 1px solid #ddd; border-top: none; box-shadow: 0 2px 5px rgba(0,0,0,0.1);"></div>
        </div>
        <div class="property-container" style="position: relative; flex-grow: 1;">
          <input type="text" id="css-property" placeholder="Property (e.g., color)" style="width: 100%;">
          <div id="property-suggestions" class="suggestions" style="display: none; position: absolute; z-index: 10; width: 100%; max-height: 150px; overflow-y: auto; background: white; border: 1px solid #ddd; border-top: none; box-shadow: 0 2px 5px rgba(0,0,0,0.1);"></div>
        </div>
        <div class="value-container" style="position: relative; flex-grow: 1;">
          <input type="text" id="css-value" placeholder="Value (e.g., #ff0000)" style="width: 100%;">
          <div id="value-suggestions" class="suggestions" style="display: none; position: absolute; z-index: 10; width: 100%; max-height: 150px; overflow-y: auto; background: white; border: 1px solid #ddd; border-top: none; box-shadow: 0 2px 5px rgba(0,0,0,0.1);"></div>
        </div>
        <button id="add-css">Add CSS</button>
        <button id="select-element">Select Element</button>
      </div>
    </div>
    <div class="control-group" style="width: 100%;">
      <textarea id="css-area" placeholder="/* Custom CSS will appear here */" style="height: 100px; width: 100%;"></textarea>
      <div class="toolbar" style="margin-top: 10px;">
        <button id="apply-css">Apply CSS</button>
        <button id="clear-css" class="secondary">Clear CSS</button>
        <button id="beautify-css">Beautify CSS & HTML</button>
        <button id="minify-css">Minify CSS & HTML</button>
      </div>
    </div>
  </div>
`
);

// Initialize CSS editor elements
const cssSelectorType = document.getElementById("css-selector-type");
const cssSelectorValue = document.getElementById("css-selector-value");
const cssProperty = document.getElementById("css-property");
const cssValue = document.getElementById("css-value");
const addCssButton = document.getElementById("add-css");
const selectElementButton = document.getElementById("select-element");
const cssArea = document.getElementById("css-area");
const applyCssButton = document.getElementById("apply-css");
const clearCssButton = document.getElementById("clear-css");
const beautifyCssButton = document.getElementById("beautify-css");
const minifyCssButton = document.getElementById("minify-css");

// Get suggestion containers
const selectorSuggestions = document.getElementById("selector-suggestions");
const propertySuggestions = document.getElementById("property-suggestions");
const valueSuggestions = document.getElementById("value-suggestions");

// CSS Property Database - Common properties and their values
const cssProperties = {
  color: [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "black",
    "white",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "rgb(255, 0, 0)",
    "rgba(255, 0, 0, 0.5)",
  ],
  "background-color": [
    "transparent",
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "black",
    "white",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "rgb(255, 0, 0)",
    "rgba(255, 0, 0, 0.5)",
  ],
  "font-size": [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "32px",
    "1em",
    "1.2em",
    "1.5em",
    "2em",
    "small",
    "medium",
    "large",
    "x-large",
  ],
  "font-weight": [
    "normal",
    "bold",
    "bolder",
    "lighter",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  "text-align": ["left", "center", "right", "justify"],
  margin: [
    "0",
    "5px",
    "10px",
    "15px",
    "20px",
    "1em",
    "2em",
    "auto",
    "0 auto",
    "10px 20px",
  ],
  padding: ["0", "5px", "10px", "15px", "20px", "1em", "2em", "10px 20px"],
  border: [
    "none",
    "1px solid black",
    "2px dashed red",
    "1px dotted blue",
    "3px double green",
  ],
  display: ["block", "inline", "inline-block", "flex", "grid", "none"],
  position: ["static", "relative", "absolute", "fixed", "sticky"],
  width: ["auto", "100%", "50%", "300px", "20em", "calc(100% - 20px)"],
  height: ["auto", "100%", "50%", "300px", "20em", "calc(100% - 20px)"],
  "flex-direction": ["row", "row-reverse", "column", "column-reverse"],
  "justify-content": [
    "flex-start",
    "flex-end",
    "center",
    "space-between",
    "space-around",
    "space-evenly",
  ],
  "align-items": ["flex-start", "flex-end", "center", "baseline", "stretch"],
  "text-decoration": ["none", "underline", "overline", "line-through"],
  "font-family": [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "serif",
    "sans-serif",
    "monospace",
  ],
  "border-radius": ["0", "3px", "5px", "10px", "50%", "10px 20px"],
  "box-shadow": [
    "none",
    "0 2px 5px rgba(0,0,0,0.1)",
    "0 0 10px rgba(0,0,0,0.3)",
    "5px 5px 10px #888",
  ],
  opacity: ["0", "0.5", "0.7", "1"],
  transition: ["all 0.3s ease", "color 0.2s", "transform 0.5s ease-in-out"],
  transform: [
    "none",
    "scale(1.2)",
    "rotate(45deg)",
    "translateX(10px)",
    "translateY(20px)",
  ],
};

// Get all common CSS properties as array
const allCssProperties = Object.keys(cssProperties);

// Improved CSS Parser and Manager
const cssManager = {
  // Parse existing CSS into an object for manipulation
  parseCSS: function (css) {
    const result = {};
    const rules = css.split("}").filter((rule) => rule.trim());

    rules.forEach((rule) => {
      const parts = rule.split("{");
      if (parts.length !== 2) return;

      const selector = parts[0].trim();
      const declarations = parts[1].trim();

      if (!selector || !declarations) return;

      result[selector] = declarations;
    });

    return result;
  },

  // Convert CSS object back to string
  stringifyCSS: function (cssObj) {
    return Object.entries(cssObj)
      .map(([selector, declarations]) => {
        return `${selector} {\n  ${declarations}\n}`;
      })
      .join("\n\n");
  },

  // Add or update a CSS rule
  addRule: function (css, selector, property, value) {
    const cssObj = this.parseCSS(css);

    if (cssObj[selector]) {
      // Check if property already exists
      const props = cssObj[selector].split(";").filter((p) => p.trim());
      const propExists =
        props.findIndex((p) => p.split(":")[0].trim() === property) !== -1;

      if (propExists) {
        // Update existing property
        const updatedProps = props.map((p) => {
          if (p.split(":")[0].trim() === property) {
            return `${property}: ${value}`;
          }
          return p;
        });
        cssObj[selector] = updatedProps.join(";\n  ");
      } else {
        // Add new property to existing selector
        cssObj[selector] = `${cssObj[selector].replace(
          /;?\s*$/,
          ""
        )};\n  ${property}: ${value}`;
      }
    } else {
      // Create new rule
      cssObj[selector] = `${property}: ${value}`;
    }

    return this.stringifyCSS(cssObj);
  },

  // Parse inline styles from an element
  parseInlineStyles: function (styleString) {
    if (!styleString) return {};

    const result = {};
    const styles = styleString.split(";").filter((s) => s.trim());

    styles.forEach((style) => {
      const [property, value] = style.split(":").map((s) => s.trim());
      if (property && value) {
        result[property] = value;
      }
    });

    return result;
  },
};

// Function to update preview with CSS
const updatePreviewWithCSS = function () {
  if (!inputText.value.trim()) {
    previewContent.innerHTML = "";
    htmlOutput.textContent = "";
    return;
  }

  // Convert line breaks to paragraphs if no HTML tags present
  let html = inputText.value;
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    html =
      "<p>" + html.replace(/\n\n+/g, "</p><p>").replace(/\n/g, "<br>") + "</p>";
  }

  // Add CSS if present
  if (cssArea.value.trim()) {
    html = `<style>${cssArea.value}</style>\n${html}`;
  }

  previewContent.innerHTML = html;
  htmlOutput.textContent = html;
};

// Override the default updatePreview function
window.updatePreview = updatePreviewWithCSS;

// Function to analyze HTML and extract selectors
function analyzeHTML() {
  const html = inputText.value;
  const tagRegex = /<([a-z][a-z0-9]*)\b[^>]*>/gi;
  const idRegex = /id\s*=\s*["']([^"']+)["']/gi;
  const classRegex = /class\s*=\s*["']([^"']+)["']/gi;

  const tags = new Set();
  const ids = new Set();
  const classes = new Set();

  // Extract tags
  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    if (match[1] && !match[1].startsWith("/")) {
      tags.add(match[1].toLowerCase());
    }
  }

  // Extract ids
  while ((match = idRegex.exec(html)) !== null) {
    if (match[1]) {
      match[1].split(/\s+/).forEach((id) => {
        if (id) ids.add(id);
      });
    }
  }

  // Extract classes
  while ((match = classRegex.exec(html)) !== null) {
    if (match[1]) {
      match[1].split(/\s+/).forEach((cls) => {
        if (cls) classes.add(cls);
      });
    }
  }

  return {
    tags: Array.from(tags),
    ids: Array.from(ids),
    classes: Array.from(classes),
  };
}

// Function to show suggestions based on input
function showSuggestions(input, suggestionContainer, suggestions) {
  const value = input.value.toLowerCase();

  if (!value) {
    suggestionContainer.style.display = "none";
    return;
  }

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(value));

  if (filtered.length === 0) {
    suggestionContainer.style.display = "none";
    return;
  }

  suggestionContainer.innerHTML = "";
  filtered.forEach((suggestion) => {
    const div = document.createElement("div");
    div.textContent = suggestion;
    div.style.padding = "5px 10px";
    div.style.cursor = "pointer";
    div.style.borderBottom = "1px solid #eee";
    div.addEventListener("mouseover", () => {
      div.style.backgroundColor = "#f0f0f0";
    });
    div.addEventListener("mouseout", () => {
      div.style.backgroundColor = "white";
    });
    div.addEventListener("click", () => {
      input.value = suggestion;
      suggestionContainer.style.display = "none";
      if (input === cssProperty) {
        // When property is selected, show value suggestions
        updateValueSuggestions();
      }
    });
    suggestionContainer.appendChild(div);
  });

  suggestionContainer.style.display = "block";
}

// Function to update selector suggestions based on type
function updateSelectorSuggestions() {
  const type = cssSelectorType.value;
  const selectors = analyzeHTML();

  if (type === "inline") {
    selectorSuggestions.style.display = "none";
    return;
  }

  let suggestions = [];
  switch (type) {
    case "id":
      suggestions = selectors.ids;
      break;
    case "class":
      suggestions = selectors.classes;
      break;
    case "tag":
      suggestions = selectors.tags;
      break;
  }

  showSuggestions(cssSelectorValue, selectorSuggestions, suggestions);
}

// Function to update property suggestions
function updatePropertySuggestions() {
  showSuggestions(cssProperty, propertySuggestions, allCssProperties);
}

// Function to update value suggestions based on selected property
function updateValueSuggestions() {
  const property = cssProperty.value;
  const values = cssProperties[property] || [];

  showSuggestions(cssValue, valueSuggestions, values);
}

// Variable to track inline styling element selection mode
let inlineSelectionMode = false;
let selectedElement = null;

// Helper function to get selected text and range
function getSelectedTextInfo() {
  const selection = window.getSelection();

  if (!selection.rangeCount) {
    return { text: "", range: null };
  }

  const range = selection.getRangeAt(0);
  const text = range.toString();

  return { text, range };
}

// Toggle selection mode for inline styling
function toggleSelectionMode() {
  inlineSelectionMode = !inlineSelectionMode;

  if (inlineSelectionMode) {
    selectElementButton.textContent = "Cancel Selection";
    selectElementButton.style.backgroundColor = "#e74c3c";
    showNotification("Click on an element in the preview to style it", "info");

    // Add click event to preview content
    previewContent.style.cursor = "crosshair";
    previewContent.addEventListener("click", handleElementSelection);
  } else {
    selectElementButton.textContent = "Select Element";
    selectElementButton.style.backgroundColor = "";

    // Remove click event from preview content
    previewContent.style.cursor = "";
    previewContent.removeEventListener("click", handleElementSelection);
  }
}

// Handle element selection in preview
function handleElementSelection(e) {
  e.preventDefault();
  e.stopPropagation();

  selectedElement = e.target;

  // Highlight the selected element
  const originalBorder = selectedElement.style.border;
  const originalOutline = selectedElement.style.outline;

  selectedElement.style.outline = "2px solid #3498db";

  // FIXED: Show current inline styles in the CSS editor
  const elementTagName = selectedElement.tagName.toLowerCase();

  // Display element info in the selector value field
  if (selectedElement.id) {
    cssSelectorValue.value = `${elementTagName}#${selectedElement.id}`;
  } else if (selectedElement.className) {
    cssSelectorValue.value = `${elementTagName}.${selectedElement.className.replace(
      /\s+/g,
      "."
    )}`;
  } else {
    cssSelectorValue.value = elementTagName;
  }

  // Extract and display existing styles in the CSS area
  if (selectedElement.hasAttribute("style")) {
    const inlineStyles = selectedElement.getAttribute("style");
    const formattedStyles = inlineStyles
      .split(";")
      .filter((style) => style.trim())
      .map((style) => `  ${style.trim()};`)
      .join("\n");

    cssArea.value = `/* Current inline styles for selected element */\n${formattedStyles}`;
  } else {
    cssArea.value = `/* No existing inline styles for selected element */`;
  }

  showNotification(`Selected element: <${elementTagName}>`, "success");

  // Exit selection mode
  toggleSelectionMode();

  // Restore original styling after brief highlight but keep element selected
  setTimeout(() => {
    if (originalOutline) {
      selectedElement.style.outline = originalOutline;
    } else {
      selectedElement.style.outline = "";
    }
  }, 1500);
}

// FIXED: Improved inline style application to selected element
function applyInlineStyle(property, value) {
  if (!selectedElement) {
    showNotification(
      'No element selected. Use "Select Element" first.',
      "error"
    );
    return false;
  }

  // Apply style directly to element in preview
  const camelCaseProp = property.replace(/-([a-z])/g, (g) =>
    g[1].toUpperCase()
  );
  selectedElement.style[camelCaseProp] = value;

  // Update the style attribute in the HTML source
  const elementTagName = selectedElement.tagName.toLowerCase();
  let elementIdentifier = elementTagName;
  const elementId = selectedElement.id;
  const elementClasses = selectedElement.className
    ? selectedElement.className.split(/\s+/).filter((c) => c)
    : [];

  if (elementId) {
    elementIdentifier += `#${elementId}`;
  } else if (elementClasses.length > 0) {
    elementIdentifier += `.${elementClasses.join(".")}`;
  }

  // Get HTML content
  let html = inputText.value;

  // Construct a regex pattern to find the element in HTML
  let pattern;

  if (elementId) {
    // If element has ID, it's easier to find
    pattern = new RegExp(
      `<${elementTagName}([^>]*id=["']${elementId}["'][^>]*)>`,
      "i"
    );
  } else if (elementClasses.length > 0) {
    // If element has classes
    const classPattern = elementClasses.join("\\s+");
    pattern = new RegExp(
      `<${elementTagName}([^>]*class=["'][^"']*${classPattern}[^"']*["'][^>]*)>`,
      "i"
    );
  } else {
    // Basic tag matching (less reliable for multiple elements)
    pattern = new RegExp(`<${elementTagName}([^>]*)>`, "i");
  }

  // Replace the element with updated style attribute
  html = html.replace(pattern, (match, attributes) => {
    // Check if style attribute exists
    if (attributes.includes("style=")) {
      // Update existing style attribute
      return match.replace(
        /style=["']([^"']*)["']/i,
        (styleMatch, currentStyles) => {
          const stylesObj = cssManager.parseInlineStyles(currentStyles);
          stylesObj[property] = value;

          // Convert styles object back to string
          const newStyles = Object.entries(stylesObj)
            .map(([prop, val]) => `${prop}: ${val}`)
            .join("; ");

          return `style="${newStyles}"`;
        }
      );
    } else {
      // Add new style attribute
      return `<${elementTagName}${attributes} style="${property}: ${value}">`;
    }
  });

  // Update input text
  inputText.value = html;
  updatePreviewWithCSS();

  return true;
}

// Event listeners for input fields
cssSelectorType.addEventListener("change", function () {
  updateSelectorSuggestions();
  if (this.value === "inline") {
    cssSelectorValue.placeholder = "Selected element info";
    cssSelectorValue.disabled = true;
    selectElementButton.style.display = "block";
  } else {
    cssSelectorValue.placeholder = "Selector value";
    cssSelectorValue.disabled = false;
    selectElementButton.style.display = "none";
    inlineSelectionMode = false;
  }
});

cssSelectorValue.addEventListener("input", updateSelectorSuggestions);
cssSelectorValue.addEventListener("focus", updateSelectorSuggestions);

cssProperty.addEventListener("input", updatePropertySuggestions);
cssProperty.addEventListener("focus", updatePropertySuggestions);

cssValue.addEventListener("input", updateValueSuggestions);
cssValue.addEventListener("focus", updateValueSuggestions);

// Select element button event
selectElementButton.addEventListener("click", toggleSelectionMode);

// Hide suggestions when clicking elsewhere
document.addEventListener("click", function (e) {
  if (
    !e.target.matches(
      "#css-selector-value, #css-property, #css-value, .suggestions, .suggestions *"
    )
  ) {
    selectorSuggestions.style.display = "none";
    propertySuggestions.style.display = "none";
    valueSuggestions.style.display = "none";
  }
});

// Add CSS button event
addCssButton.addEventListener("click", function () {
  const type = cssSelectorType.value;
  const selector = cssSelectorValue.value.trim();
  const prop = cssProperty.value.trim();
  const val = cssValue.value.trim();

  if (!prop || !val) {
    showNotification("Property and value are required", "error");
    return;
  }

  saveState();

  if (type === "inline") {
    // For inline styles, we need a selected element
    if (applyInlineStyle(prop, val)) {
      showNotification(`Applied ${prop}: ${val} to selected element`);
      // Update CSS area to reflect new style
      if (selectedElement && selectedElement.hasAttribute("style")) {
        const inlineStyles = selectedElement.getAttribute("style");
        const formattedStyles = inlineStyles
          .split(";")
          .filter((style) => style.trim())
          .map((style) => `  ${style.trim()};`)
          .join("\n");

        cssArea.value = `/* Current inline styles for selected element */\n${formattedStyles}`;
      }
    }
  } else {
    // For CSS selectors
    if (!selector && (type === "id" || type === "class")) {
      showNotification("Selector value is required", "error");
      return;
    }

    // Create selector string
    let selectorStr = "";
    switch (type) {
      case "id":
        selectorStr = `#${selector}`;
        break;
      case "class":
        selectorStr = `.${selector}`;
        break;
      case "tag":
        selectorStr = selector || "body";
        break;
    }

    // Add or update CSS rule
    cssArea.value = cssManager.addRule(cssArea.value, selectorStr, prop, val);
    updatePreviewWithCSS();
  }

  // Reset property and value fields
  cssProperty.value = "";
  cssValue.value = "";
});

// Apply CSS button event
applyCssButton.addEventListener("click", function () {
  updatePreviewWithCSS();
  showNotification("CSS applied to preview");
});

// Clear CSS button event
clearCssButton.addEventListener("click", function () {
  if (confirm("Are you sure you want to clear all CSS?")) {
    cssArea.value = "";
    updatePreviewWithCSS();
    showNotification("CSS cleared");
  }
});

// Beautify CSS function
function beautifyCSS(css) {
  // Simple CSS beautifier
  css = css.replace(/\s+/g, " ");
  css = css.replace(/\{\s*/g, " {\n  ");
  css = css.replace(/;\s*/g, ";\n  ");
  css = css.replace(/\s*\}/g, "\n}");
  css = css.replace(/\n  \n/g, "\n");
  css = css.replace(/{\n  }/g, "{ }");

  return css;
}

// Minify CSS function
function minifyCSS(css) {
  // Simple CSS minifier
  css = css.replace(/\/\*[\s\S]*?\*\//g, ""); // Remove comments
  css = css.replace(/\s+/g, " "); // Collapse whitespace
  css = css.replace(/\s*{\s*/g, "{"); // Remove spaces around braces
  css = css.replace(/\s*;\s*/g, ";"); // Remove spaces around semicolons
  css = css.replace(/\s*:\s*/g, ":"); // Remove spaces around colons
  css = css.replace(/\s*,\s*/g, ","); // Remove spaces around commas
  css = css.replace(/\s*}\s*/g, "}"); // Remove spaces around closing braces

  return css;
}

// // FIXED: Beautify HTML function
// function beautifyHTML(html) {
//   // Simple HTML beautifier
//   let result = '';
//   let indent = 0;
//   let inTag = false;
//   let inContent = false;
//   let currentChar;
//   let nextChar;

//   // Remove excessive whitespace first
//   html = html.replace(/\s+/g, ' ').trim();

//   for (let i = 0; i < html.length; i++) {
//     currentChar = html[i];
//     nextChar = html[i + 1];

//     if (currentChar === '<' && nextChar !== '/') {
//       // Opening tag
//       if (inContent) result += '\n';
//       result += '\n' + ' '.repeat(indent * 2) + currentChar;
//       indent++;
//       inTag = true;
//       inContent = false;
//     } else if (currentChar === '<' && nextChar === '/') {
//       // Closing tag
//       indent--;
//       if (inContent) result += '\n';
//       result += '\n' + ' '.repeat(indent * 2) + currentChar;
//       inTag = true;
//       inContent = false;
//     } else if (currentChar === '>' && inTag) {
//       // End of tag
//       result += currentChar;
//       inTag = false;
//       if (html[i + 1] !== '<') {
//         inContent = true;
//       }
//     } else {
//       result += currentChar;
//     }
//   }

//   // Handle style tag contents
//   result = result.replace(/(<style[^>]*>)([^<]*)<\/style>/gi, function(match, styleTag, cssContent) {
//     return styleTag + '\n' + beautifyCSS(cssContent) + '\n</style>';
//   });

//   return result;
// }

function minifyCSS(css) {
  return css
    .replace(/\s+/g, " ") // Collapse whitespace
    .replace(/\s*{\s*/g, "{") // Remove spaces around `{`
    .replace(/\s*}\s*/g, "}") // Remove spaces around `}`
    .replace(/\s*;\s*/g, ";") // Remove spaces around `;`
    .replace(/\s*:\s*/g, ":") // Remove spaces around `:`
    .trim();
}

// function minifyHTML(html) {
//   // Simple HTML minifier
//   html = html.replace(/\s+/g, ' '); // Collapse whitespace
//   html = html.replace(/>\s+</g, '><'); // Remove whitespace between tags
//   html = html.replace(/<!--[\s\S]*?-->/g, ''); // Remove comments

//   // Handle style tag contents
//   html = html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, function(match, styleTag, cssContent, endTag) {
//     return styleTag + minifyCSS(cssContent) + endTag;
//   });

//   return html.trim();
// }

// FIXED: Update beautify CSS button to also beautify HTML
beautifyCssButton.addEventListener("click", function () {
  const css = cssArea.value;
  if (css.trim()) {
    cssArea.value = beautifyCSS(css);
    showNotification("CSS beautified");
  }

  // Also beautify HTML content
  const html = inputText.value;
  if (html.trim()) {
    inputText.value = beautifyHTML(html);
    showNotification("HTML beautified");
    updatePreviewWithCSS();
  }
});

// FIXED: Update minify CSS button to also minify HTML
minifyCssButton.addEventListener("click", function () {
  const css = cssArea.value;
  if (css.trim()) {
    cssArea.value = minifyCSS(css);
    showNotification("CSS minified");
  }

  // Also minify HTML content
  const html = inputText.value;
  if (html.trim()) {
    inputText.value = minifyHTML(html);
    showNotification("HTML minified");
    updatePreviewWithCSS();
  }
});

// Update copy function to include CSS
window.copyHtmlToClipboard = function () {
  const htmlCode = htmlOutput.textContent;
  if (!htmlCode) {
    showNotification("No HTML to copy", "error");
    return;
  }

  navigator.clipboard
    .writeText(htmlCode)
    .then(() => {
      showNotification("HTML with CSS copied to clipboard!");
    })
    .catch((err) => {
      showNotification("Failed to copy HTML", "error");
      console.error("Copy failed: ", err);
    });
};

// Add CSS syntax highlighting (simple version)
cssArea.addEventListener("input", function () {
  // This is a placeholder for a more advanced syntax highlighter
  // In a real implementation, you might want to use a library like highlight.js
});

// Initialize the preview function
updatePreviewWithCSS();

// Add an observer for the input text to update selector suggestions when HTML changes
const inputTextObserver = new MutationObserver(function (mutations) {
  updateSelectorSuggestions();
});

// Configure and start the observer
const observerConfig = { characterData: true, childList: true, subtree: true };
inputTextObserver.observe(inputText, observerConfig);

// FIXED: Add a helper function to scan and extract inline styles from the selected element
function extractInlineStyles(element) {
  if (!element || !element.style) return {};

  const result = {};
  const computedStyle = window.getComputedStyle(element);

  // Get only explicitly set styles (not computed ones)
  const inlineStyles = element.getAttribute("style");
  if (!inlineStyles) return result;

  // Parse inline styles
  const styleArray = inlineStyles.split(";").filter((s) => s.trim());
  styleArray.forEach((style) => {
    const [property, value] = style.split(":").map((s) => s.trim());
    if (property && value) {
      result[property] = value;
    }
  });

  return result;
}

// Add a keyboard shortcut for applying CSS (Alt+A)
document.addEventListener("keydown", function (e) {
  if (e.altKey && e.key === "a") {
    e.preventDefault();
    updatePreviewWithCSS();
    showNotification("CSS applied (Alt+A shortcut)", "info");
  }
});

// FIXED: Add keyboard shortcut for selecting an element (Alt+S)
document.addEventListener("keydown", function (e) {
  if (e.altKey && e.key === "s") {
    e.preventDefault();
    if (cssSelectorType.value === "inline" && !inlineSelectionMode) {
      toggleSelectionMode();
      showNotification(
        "Element selection mode activated (Alt+S shortcut)",
        "info"
      );
    }
  }
});

// FIXED: Add event listener to display element path on hover in preview
previewContent.addEventListener("mouseover", function (e) {
  if (inlineSelectionMode) {
    const target = e.target;
    const tagName = target.tagName.toLowerCase();
    let path = tagName;

    if (target.id) {
      path += `#${target.id}`;
    } else if (target.className) {
      path += `.${target.className.replace(/\s+/g, ".")}`;
    }

    // Show hover effect
    target.dataset.originalOutline = target.style.outline;
    target.style.outline = "1px dashed #3498db";

    // Show element path in status bar or somewhere visible
    const statusBar =
      document.querySelector(".status-bar") || createStatusBar();
    statusBar.textContent = `Element: ${path}`;
    statusBar.style.display = "block";
  }
});

// Create status bar if it doesn't exist
function createStatusBar() {
  const statusBar = document.createElement("div");
  statusBar.className = "status-bar";
  statusBar.style.position = "fixed";
  statusBar.style.bottom = "0";
  statusBar.style.left = "0";
  statusBar.style.right = "0";
  statusBar.style.backgroundColor = "#f8f9fa";
  statusBar.style.padding = "5px 10px";
  statusBar.style.borderTop = "1px solid #ddd";
  statusBar.style.fontSize = "12px";
  statusBar.style.zIndex = "1000";
  document.body.appendChild(statusBar);
  return statusBar;
}

// Remove hover effect when mouse leaves
previewContent.addEventListener("mouseout", function (e) {
  if (inlineSelectionMode) {
    const target = e.target;
    if (target.dataset.originalOutline) {
      target.style.outline = target.dataset.originalOutline;
      delete target.dataset.originalOutline;
    } else {
      target.style.outline = "";
    }

    // Hide status bar
    const statusBar = document.querySelector(".status-bar");
    if (statusBar) {
      statusBar.style.display = "none";
    }
  }
});

// FIXED: Improve the notification system
function showNotification(message, type = "success") {
  // Check if a notification already exists and remove it
  const existingNotification = document.querySelector(".css-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create the notification element
  const notification = document.createElement("div");
  notification.className = "css-notification";
  notification.textContent = message;

  // Set styles based on notification type
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.padding = "10px 20px";
  notification.style.borderRadius = "4px";
  notification.style.zIndex = "9999";
  notification.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  notification.style.animation = "fadeIn 0.3s, fadeOut 0.3s 2.7s";

  // Add animation styles
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-20px); }
    }
  `;
  document.head.appendChild(styleSheet);

  // Set colors based on notification type
  switch (type) {
    case "error":
      notification.style.backgroundColor = "#e74c3c";
      notification.style.color = "white";
      break;
    case "warning":
      notification.style.backgroundColor = "#f39c12";
      notification.style.color = "white";
      break;
    case "info":
      notification.style.backgroundColor = "#3498db";
      notification.style.color = "white";
      break;
    case "success":
    default:
      notification.style.backgroundColor = "#2ecc71";
      notification.style.color = "white";
      break;
  }

  // Add close button
  const closeButton = document.createElement("span");
  closeButton.textContent = "×";
  closeButton.style.marginLeft = "10px";
  closeButton.style.cursor = "pointer";
  closeButton.style.fontWeight = "bold";
  closeButton.addEventListener("click", () => notification.remove());
  notification.appendChild(closeButton);

  // Add notification to the page
  document.body.appendChild(notification);

  // Automatically remove after 3 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 3000);
}

// FIXED: Ensure the select element button is shown by default for inline styling
if (cssSelectorType.value === "inline") {
  cssSelectorValue.placeholder = "Selected element info";
  cssSelectorValue.disabled = true;
  selectElementButton.style.display = "block";
} else {
  selectElementButton.style.display = "none";
}

// FIXED: Add reset button for inline styling selection
document.querySelector(".css-tools").insertAdjacentHTML(
  "beforeend",
  `
  <button id="reset-selection" style="display: none;">Reset Selection</button>
`
);

const resetSelectionButton = document.getElementById("reset-selection");

resetSelectionButton.addEventListener("click", function () {
  selectedElement = null;
  this.style.display = "none";
  cssSelectorValue.value = "";
  cssArea.value = "/* No element selected */";
  showNotification("Element selection cleared", "info");
});

// FIXED: Update selected element management
function updateSelectedElementState() {
  if (selectedElement) {
    resetSelectionButton.style.display = "block";
    cssSelectorValue.value = getElementSelector(selectedElement);
  } else {
    resetSelectionButton.style.display = "none";
    if (cssSelectorType.value === "inline") {
      cssSelectorValue.value = "";
    }
  }
}

// Get selector string for an element
function getElementSelector(element) {
  const tagName = element.tagName.toLowerCase();
  let selector = tagName;

  if (element.id) {
    selector += `#${element.id}`;
  } else if (element.className) {
    selector += `.${element.className.replace(/\s+/g, ".")}`;
  }

  return selector;
}

// Call this function initially and when selection changes
updateSelectedElementState();

// Make sure we update the state when selector type changes
cssSelectorType.addEventListener("change", function () {
  if (this.value === "inline") {
    updateSelectedElementState();
  }
});

// FIXED: Handle the case when the preview is updated and selected element might be lost
const originalUpdatePreview = window.updatePreview;
window.updatePreview = function () {
  const result = originalUpdatePreview.apply(this, arguments);

  // After preview update, the selected element reference is invalid
  // We should reset it or try to find equivalent element
  if (selectedElement) {
    selectedElement = null;
    cssSelectorValue.value = "";
    resetSelectionButton.style.display = "none";
    showNotification(
      "Element selection was reset due to content change",
      "info"
    );
  }

  return result;
};

// Initialize the element selection state on load
updateSelectedElementState();
