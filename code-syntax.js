// Code Syntax Highlighting functionality
document.addEventListener("DOMContentLoaded", function () {
  // Add Prism.js CDN links to the head
  const head = document.head || document.getElementsByTagName("head")[0];

  // Add Prism CSS
  const prismCSS = document.createElement("link");
  prismCSS.rel = "stylesheet";
  prismCSS.href =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css";
  head.appendChild(prismCSS);

  // Add Prism JS
  const prismJS = document.createElement("script");
  prismJS.src =
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
  head.appendChild(prismJS);

  // Add language components
  const languages = [
    "javascript",
    "css",
    "markup",
    "python",
    "php",
    "java",
    "c",
    "cpp",
    "csharp",
    "json",
  ];
  languages.forEach((lang) => {
    const script = document.createElement("script");
    script.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
    head.appendChild(script);
  });

  // Add code syntax highlighting button to toolbar
  const toolbar = document.querySelector(".toolbar:first-of-type");
  toolbar.insertAdjacentHTML(
    "beforeend",
    `
      <select id="code-language" class="dropdown">
        <option value="">Code Block</option>
        <option value="javascript">JavaScript</option>
        <option value="css">CSS</option>
        <option value="html">HTML</option>
        <option value="python">Python</option>
        <option value="php">PHP</option>
        <option value="java">Java</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="csharp">C#</option>
        <option value="json">JSON</option>
      </select>
    `
  );

  // Get DOM references
  const codeLanguageSelect = document.getElementById("code-language");
  const inputText = document.getElementById("input-text");
  const previewContent = document.getElementById("preview-content");

  // Add event listener for language selection
  codeLanguageSelect.addEventListener("change", function () {
    if (this.value) {
      insertCodeBlock(this.value);
      this.value = ""; // Reset dropdown
    }
  });

  // Function to insert code block
  function insertCodeBlock(language) {
    const selection = getSelectedText();
    let codeContent;

    if (selection.text) {
      // Use selected text as code content
      codeContent = selection.text;
    } else {
      // Provide a sample code snippet based on language
      codeContent = getSampleCode(language);
    }

    // Create pre and code tags with appropriate class
    const codeBlock = `<pre><code class="language-${language}">${escapeHtml(
      codeContent
    )}</code></pre>`;

    if (selection.text) {
      const textBefore = inputText.value.substring(0, selection.start);
      const textAfter = inputText.value.substring(selection.end);

      inputText.value = textBefore + codeBlock + textAfter;
    } else {
      // Insert at cursor
      const cursorPos = inputText.selectionStart;
      const textBefore = inputText.value.substring(0, cursorPos);
      const textAfter = inputText.value.substring(cursorPos);

      inputText.value = textBefore + codeBlock + textAfter;
    }

    updatePreview();
    highlightCodeInPreview();

    // Save state for undo/redo if function exists
    if (typeof saveState === "function") {
      saveState();
    }
  }

  // Escape HTML special characters for code blocks
  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Sample code snippets for different languages
  function getSampleCode(language) {
    const samples = {
      javascript: `// JavaScript example
  function greet(name) {
    return \`Hello, \${name}!\`;
  }
  console.log(greet('World'));`,
      css: `/* CSS example */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
  }`,
      html: `<!-- HTML example -->
  <div class="container">
    <h1>Hello World</h1>
    <p>This is a paragraph.</p>
  </div>`,
      python: `# Python example
  def greet(name):
      return f"Hello, {name}!"
  print(greet("World"))`,
      php: `<?php
  // PHP example
  function greet($name) {
      return "Hello, " . $name . "!";
  }
  echo greet("World");
  ?>`,
      java: `// Java example
  public class HelloWorld {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }`,
      c: `// C example
  #include <stdio.h>
  int main() {
      printf("Hello, World!\\n");
      return 0;
  }`,
      cpp: `// C++ example
  #include <iostream>
  int main() {
      std::cout << "Hello, World!" << std::endl;
      return 0;
  }`,
      csharp: `// C# example
  using System;
  class Program {
      static void Main() {
          Console.WriteLine("Hello, World!");
      }
  }`,
      json: `{
    "name": "John Doe",
    "age": 30,
    "isActive": true,
    "address": {
      "city": "New York",
      "state": "NY"
    }
  }`,
    };

    return samples[language] || "// Add your code here";
  }

  // Function to highlight code in preview pane
  function highlightCodeInPreview() {
    // Wait for Prism to be loaded
    if (typeof Prism !== "undefined") {
      Prism.highlightAllUnder(previewContent);
    } else {
      // If Prism isn't loaded yet, try again after a delay
      setTimeout(highlightCodeInPreview, 500);
    }
  }

  // Override the existing updatePreview function to include syntax highlighting
  const originalUpdatePreview = window.updatePreview;
  window.updatePreview = function () {
    originalUpdatePreview();
    highlightCodeInPreview();
  };

  // Add a style section for better code block display
  const style = document.createElement("style");
  style.textContent = `
      pre {
        background-color: #f5f5f5;
        border-radius: 4px;
        padding: 1em;
        margin: 0.5em 0;
        overflow: auto;
        max-height: 400px;
      }
      code {
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        font-size: 0.9em;
      }
    `;
  head.appendChild(style);

  // Add "Copy Code" button functionality for code blocks in preview
  previewContent.addEventListener(
    "mouseenter",
    function (e) {
      if (e.target.tagName === "PRE") {
        // Check if the copy button already exists
        if (!e.target.querySelector(".copy-code-btn")) {
          // Create copy button
          const copyBtn = document.createElement("button");
          copyBtn.className = "copy-code-btn";
          copyBtn.textContent = "Copy";
          copyBtn.style.cssText =
            "position: absolute; top: 5px; right: 5px; padding: 3px 8px; background: #555; color: white; border: none; border-radius: 3px; opacity: 0.7; cursor: pointer;";

          // Position the pre tag relatively if it's not already
          e.target.style.position = "relative";

          // Add copy button to pre tag
          e.target.appendChild(copyBtn);

          // Add hover effect
          copyBtn.addEventListener("mouseenter", function () {
            this.style.opacity = "1";
          });

          copyBtn.addEventListener("mouseleave", function () {
            this.style.opacity = "0.7";
          });

          // Add click event to copy code
          copyBtn.addEventListener("click", function () {
            const code = this.parentNode.querySelector("code").textContent;
            navigator.clipboard
              .writeText(code)
              .then(() => {
                // Change button text temporarily
                const originalText = this.textContent;
                this.textContent = "Copied!";
                setTimeout(() => {
                  this.textContent = originalText;
                }, 1500);
              })
              .catch((err) => {
                console.error("Copy failed:", err);
              });
          });
        }
      }
    },
    true
  );

  // Remove copy button when leaving code block
  previewContent.addEventListener(
    "mouseleave",
    function (e) {
      if (e.target.tagName === "PRE") {
        const copyBtn = e.target.querySelector(".copy-code-btn");
        if (copyBtn) {
          e.target.removeChild(copyBtn);
        }
      }
    },
    true
  );
});
