// Meta Tags Manager functionality
document.addEventListener("DOMContentLoaded", function () {
  // Add Meta Tags section to the control panel
  document.querySelector(".control-panel").insertAdjacentHTML(
    "beforeend",
    `
    <div class="control-group">
      <label>Meta Tags Manager</label>
      <div class="toolbar">
        <button id="manage-meta-tags" title="Manage Meta Tags">📋</button>
        <button id="insert-meta-tags" title="Insert Meta Tags">🏷️</button>
        <select id="meta-template" class="dropdown">
          <option value="">Meta Templates</option>
          <option value="basic">Basic SEO</option>
          <option value="social">Social Media</option>
          <option value="responsive">Responsive Design</option>
        </select>
      </div>
    </div>
  `
  );

  // Initialize buttons and dropdown
  const manageMetaTagsButton = document.getElementById("manage-meta-tags");
  const insertMetaTagsButton = document.getElementById("insert-meta-tags");
  const metaTemplateSelect = document.getElementById("meta-template");

  // Storage for meta tags
  let metaTags = [];

  // Try to load saved meta tags
  try {
    const savedMetaTags = localStorage.getItem("htmlGeneratorMetaTags");
    if (savedMetaTags) {
      metaTags = JSON.parse(savedMetaTags);
    }
  } catch (error) {
    console.error("Error loading saved meta tags:", error);
  }

  // Event listener for meta template dropdown
  metaTemplateSelect.addEventListener("change", function () {
    if (!this.value) return;

    saveState(); // Call parent function to save state for undo/redo

    let templateTags = [];

    switch (this.value) {
      case "basic":
        templateTags = [
          {
            name: "description",
            content: "Enter your page description here",
            type: "name",
          },
          {
            name: "keywords",
            content: "keyword1, keyword2, keyword3",
            type: "name",
          },
          { name: "author", content: "Your Name", type: "name" },
          { name: "robots", content: "index, follow", type: "name" },
        ];
        break;
      case "social":
        templateTags = [
          { name: "og:title", content: "Your Page Title", type: "property" },
          {
            name: "og:description",
            content: "Your page description for social media",
            type: "property",
          },
          {
            name: "og:image",
            content: "https://example.com/image.jpg",
            type: "property",
          },
          {
            name: "og:url",
            content: "https://example.com/page",
            type: "property",
          },
          {
            name: "twitter:card",
            content: "summary_large_image",
            type: "name",
          },
        ];
        break;
      case "responsive":
        templateTags = [
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
            type: "name",
          },
          { name: "theme-color", content: "#3498db", type: "name" },
        ];
        break;
    }

    metaTags = [...metaTags, ...templateTags];
    saveTags();
    showNotification(`Added ${templateTags.length} meta tags from template`);
    this.value = ""; // Reset dropdown
  });

  // Event listener for manage meta tags button
  manageMetaTagsButton.addEventListener("click", function () {
    showMetaTagsManager();
  });

  // Event listener for insert meta tags button
  insertMetaTagsButton.addEventListener("click", function () {
    if (metaTags.length === 0) {
      showNotification(
        "No meta tags to insert. Please add tags first.",
        "error"
      );
      return;
    }

    // Generate meta tags HTML
    let metaTagsHtml = "\n";
    metaTags.forEach((tag) => {
      if (tag.type === "name") {
        metaTagsHtml += `  <meta name="${tag.name}" content="${tag.content}">\n`;
      } else if (tag.type === "property") {
        metaTagsHtml += `  <meta property="${tag.name}" content="${tag.content}">\n`;
      } else if (tag.type === "http-equiv") {
        metaTagsHtml += `  <meta http-equiv="${tag.name}" content="${tag.content}">\n`;
      }
    });

    // Get input text and find where to insert meta tags
    const inputText = document.getElementById("input-text");
    const content = inputText.value;

    saveState(); // Call parent function to save state for undo/redo

    // If there's a head tag, insert inside it
    if (content.includes("<head>") && content.includes("</head>")) {
      const headEndPos = content.indexOf("</head>");
      const newContent =
        content.substring(0, headEndPos) +
        metaTagsHtml +
        content.substring(headEndPos);
      inputText.value = newContent;
    }
    // If there's no head tag but there is an HTML tag, create head tag
    else if (content.includes("<html") && content.includes("</html>")) {
      const htmlStartPos =
        content.indexOf("<html") +
        content.substring(content.indexOf("<html")).indexOf(">") +
        1;
      const newContent =
        content.substring(0, htmlStartPos) +
        "\n<head>" +
        metaTagsHtml +
        "  <title>Page Title</title>\n</head>" +
        content.substring(htmlStartPos);
      inputText.value = newContent;
    }
    // If there's no html tag, add minimal HTML structure
    else {
      const docType =
        '<!DOCTYPE html>\n<html lang="en">\n<head>' +
        metaTagsHtml +
        "  <title>Page Title</title>\n</head>\n<body>\n";

      // If content exists, wrap it in body tags
      if (content.trim()) {
        inputText.value = docType + content + "\n</body>\n</html>";
      } else {
        inputText.value = docType + "  \n</body>\n</html>";
      }
    }

    // Trigger update to preview
    inputText.dispatchEvent(new Event("input"));
    showNotification(`Inserted ${metaTags.length} meta tags`);
  });

  // Function to show meta tags manager dialog
  function showMetaTagsManager() {
    // Create modal container
    const modal = document.createElement("div");
    modal.className = "meta-tags-modal";
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

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.className = "meta-tags-modal-content";
    modalContent.style.cssText = `
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 700px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    `;

    // Add title and buttons
    modalContent.innerHTML = `
      <h3 style="margin-top: 0; margin-bottom: 15px;">Meta Tags Manager</h3>
      <div style="margin-bottom: 15px;">
        <button id="add-meta-tag" style="padding: 8px 15px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Add New Tag</button>
        <button id="close-meta-manager" style="padding: 8px 15px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
      </div>
      <div class="meta-tags-list" style="margin-bottom: 15px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Type</th>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Name/Property</th>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Content</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #ddd;">Actions</th>
            </tr>
          </thead>
          <tbody id="meta-tags-table-body">
            <!-- Meta tags will be inserted here -->
          </tbody>
        </table>
      </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Populate table with existing meta tags
    refreshTagsTable();

    // Event listener for add meta tag button
    document
      .getElementById("add-meta-tag")
      .addEventListener("click", function () {
        showAddEditTagModal();
      });

    // Event listener for close button
    document
      .getElementById("close-meta-manager")
      .addEventListener("click", function () {
        document.body.removeChild(modal);
      });

    // Function to refresh the tags table
    function refreshTagsTable() {
      const tableBody = document.getElementById("meta-tags-table-body");
      tableBody.innerHTML = "";

      if (metaTags.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="4" style="text-align: center; padding: 15px;">No meta tags added yet.</td>
          </tr>
        `;
        return;
      }

      metaTags.forEach((tag, index) => {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid #eee";

        // Type column
        const typeCell = document.createElement("td");
        typeCell.style.padding = "10px";
        typeCell.textContent = tag.type;
        row.appendChild(typeCell);

        // Name column
        const nameCell = document.createElement("td");
        nameCell.style.padding = "10px";
        nameCell.textContent = tag.name;
        row.appendChild(nameCell);

        // Content column
        const contentCell = document.createElement("td");
        contentCell.style.padding = "10px";
        contentCell.textContent = tag.content;
        row.appendChild(contentCell);

        // Actions column
        const actionsCell = document.createElement("td");
        actionsCell.style.padding = "10px";
        actionsCell.style.textAlign = "center";
        actionsCell.innerHTML = `
          <button class="edit-tag" data-index="${index}" style="background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; padding: 5px 10px; margin-right: 5px;">Edit</button>
          <button class="delete-tag" data-index="${index}" style="background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; padding: 5px 10px;">Delete</button>
        `;
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
      });

      // Add event listeners to edit and delete buttons
      document.querySelectorAll(".edit-tag").forEach((button) => {
        button.addEventListener("click", function () {
          const index = parseInt(this.dataset.index);
          showAddEditTagModal(index);
        });
      });

      document.querySelectorAll(".delete-tag").forEach((button) => {
        button.addEventListener("click", function () {
          const index = parseInt(this.dataset.index);
          if (confirm("Are you sure you want to delete this meta tag?")) {
            metaTags.splice(index, 1);
            saveTags();
            refreshTagsTable();
          }
        });
      });
    }

    // Function to show add/edit tag modal
    function showAddEditTagModal(index = null) {
      const isEditing = index !== null;
      const tag = isEditing
        ? metaTags[index]
        : { type: "name", name: "", content: "" };

      // Create modal
      const tagModal = document.createElement("div");
      tagModal.className = "add-edit-tag-modal";
      tagModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
      `;

      // Create modal content
      const tagModalContent = document.createElement("div");
      tagModalContent.className = "tag-modal-content";
      tagModalContent.style.cssText = `
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      `;

      // Add form
      tagModalContent.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 15px;">${
          isEditing ? "Edit" : "Add"
        } Meta Tag</h3>
        <form id="meta-tag-form">
          <div style="margin-bottom: 15px;">
            <label for="tag-type" style="display: block; margin-bottom: 5px;">Type:</label>
            <select id="tag-type" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              <option value="name" ${
                tag.type === "name" ? "selected" : ""
              }>name</option>
              <option value="property" ${
                tag.type === "property" ? "selected" : ""
              }>property</option>
              <option value="http-equiv" ${
                tag.type === "http-equiv" ? "selected" : ""
              }>http-equiv</option>
            </select>
          </div>
          <div style="margin-bottom: 15px;">
            <label for="tag-name" style="display: block; margin-bottom: 5px;">Name/Property:</label>
            <input type="text" id="tag-name" value="${
              tag.name
            }" placeholder="e.g. description, og:title" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <div style="margin-bottom: 15px;">
            <label for="tag-content" style="display: block; margin-bottom: 5px;">Content:</label>
            <textarea id="tag-content" placeholder="Tag content" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 80px;">${
              tag.content
            }</textarea>
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button type="button" id="cancel-tag-form" style="padding: 8px 15px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Cancel</button>
            <button type="submit" style="padding: 8px 15px; background: #2ecc71; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
          </div>
        </form>
      `;

      tagModal.appendChild(tagModalContent);
      document.body.appendChild(tagModal);

      // Focus on the name field
      document.getElementById("tag-name").focus();

      // Event listener for cancel button
      document
        .getElementById("cancel-tag-form")
        .addEventListener("click", function () {
          document.body.removeChild(tagModal);
        });

      // Event listener for form submission
      document
        .getElementById("meta-tag-form")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const type = document.getElementById("tag-type").value;
          const name = document.getElementById("tag-name").value.trim();
          const content = document.getElementById("tag-content").value.trim();

          // Validate input
          if (!name) {
            alert("Please enter a name or property for the meta tag.");
            return;
          }

          // Create or update tag
          const updatedTag = { type, name, content };

          if (isEditing) {
            metaTags[index] = updatedTag;
          } else {
            metaTags.push(updatedTag);
          }

          // Save tags and refresh table
          saveTags();
          refreshTagsTable();

          // Close modal
          document.body.removeChild(tagModal);
        });
    }
  }

  // Function to save meta tags to localStorage
  function saveTags() {
    try {
      localStorage.setItem("htmlGeneratorMetaTags", JSON.stringify(metaTags));
    } catch (error) {
      console.error("Error saving meta tags:", error);
      showNotification("Error saving meta tags to local storage", "error");
    }
  }

  // Function to export meta tags
  function exportMetaTags() {
    if (metaTags.length === 0) {
      showNotification("No meta tags to export", "error");
      return;
    }

    try {
      const dataStr = JSON.stringify(metaTags, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportLink = document.createElement("a");
      exportLink.setAttribute("href", dataUri);
      exportLink.setAttribute("download", "meta-tags-export.json");
      exportLink.style.display = "none";

      document.body.appendChild(exportLink);
      exportLink.click();
      document.body.removeChild(exportLink);

      showNotification("Meta tags exported successfully");
    } catch (error) {
      console.error("Error exporting meta tags:", error);
      showNotification("Error exporting meta tags", "error");
    }
  }

  // Function to import meta tags
  function importMetaTags() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.style.display = "none";

    input.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          const importedTags = JSON.parse(event.target.result);

          // Validate imported data
          if (!Array.isArray(importedTags)) {
            throw new Error("Invalid import format");
          }

          // Verify each tag has required properties
          const validTags = importedTags.filter(
            (tag) =>
              tag &&
              typeof tag === "object" &&
              tag.name &&
              typeof tag.name === "string" &&
              tag.type &&
              ["name", "property", "http-equiv"].includes(tag.type) &&
              tag.content !== undefined
          );

          if (validTags.length === 0) {
            showNotification(
              "No valid meta tags found in import file",
              "error"
            );
            return;
          }

          // Add confirmation if there are already tags
          if (metaTags.length > 0) {
            if (
              confirm(
                `You currently have ${metaTags.length} meta tags. Do you want to replace them with the ${validTags.length} imported tags?`
              )
            ) {
              metaTags = validTags;
            } else if (
              confirm(
                `Would you like to merge the ${validTags.length} imported tags with your existing tags?`
              )
            ) {
              metaTags = [...metaTags, ...validTags];
            } else {
              return;
            }
          } else {
            metaTags = validTags;
          }

          saveTags();
          showNotification(
            `Successfully imported ${validTags.length} meta tags`
          );

          // Refresh tags table if meta tags manager is open
          const metaTagsTableBody = document.getElementById(
            "meta-tags-table-body"
          );
          if (metaTagsTableBody) {
            refreshTagsTable();
          }
        } catch (error) {
          console.error("Error importing meta tags:", error);
          showNotification(
            "Error importing meta tags. Please check file format.",
            "error"
          );
        }
      };

      reader.readAsText(file);
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  // Add export/import buttons to meta tags manager
  function enhanceMetaTagsManager() {
    const manageMetaTagsButton = document.getElementById("manage-meta-tags");
    const originalClickHandler = manageMetaTagsButton.onclick;

    manageMetaTagsButton.onclick = function () {
      // Call original handler to open the manager
      originalClickHandler.call(this);

      // Add export/import buttons
      setTimeout(() => {
        const modal = document.querySelector(".meta-tags-modal");
        if (!modal) return;

        const buttonContainer = modal.querySelector(
          ".meta-tags-modal-content > div"
        );
        if (!buttonContainer) return;

        // Check if buttons already exist
        if (!document.getElementById("export-meta-tags")) {
          buttonContainer.insertAdjacentHTML(
            "beforeend",
            `
            <button id="export-meta-tags" style="padding: 8px 15px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Export</button>
            <button id="import-meta-tags" style="padding: 8px 15px; background: #9b59b6; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Import</button>
          `
          );

          // Add event listeners
          document
            .getElementById("export-meta-tags")
            .addEventListener("click", exportMetaTags);
          document
            .getElementById("import-meta-tags")
            .addEventListener("click", importMetaTags);
        }
      }, 100);
    };
  }

  // Call the function to enhance the meta tags manager
  enhanceMetaTagsManager();

  // Function to show notification (from parent app)
  function showNotification(message, type = "success") {
    // Check if the parent app has a notification function
    if (typeof window.showNotification === "function") {
      window.showNotification(message, type);
    } else {
      // Fallback notification
      const notification = document.createElement("div");
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background-color: ${type === "error" ? "#e74c3c" : "#2ecc71"};
        color: white;
        border-radius: 4px;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      `;

      document.body.appendChild(notification);

      // Remove after 3 seconds
      setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 3000);
    }
  }

  // Function to save state (assumed to be defined in parent app)
  function saveState() {
    // Check if the parent app has a saveState function
    if (typeof window.saveState === "function") {
      window.saveState();
    } else {
      console.log("State saved (from Meta Tags Manager)");
    }
  }
});
