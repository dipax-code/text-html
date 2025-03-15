
document.addEventListener('DOMContentLoaded', function() {
  // Add multimedia dropdown to the toolbar
  const controlPanel = document.querySelector('.control-panel');
  if (controlPanel) {
    controlPanel.insertAdjacentHTML('beforeend', `
      <div class="control-group">
        <label for="multimedia-select">Multimedia Elements</label>
        <select id="multimedia-select" class="dropdown">
          <option value="">Insert Multimedia</option>
          <option value="image">Image</option>
          <option value="figure">Figure with Caption</option>
          <option value="audio">Audio Player</option>
          <option value="video">Video Player</option>
          <option value="youtube">YouTube Video</option>
          <option value="picture">Picture (Responsive)</option>
          <option value="iframe">Iframe</option>
        </select>
      </div>
    `);
  }

  // Get reference to the multimedia dropdown
  const multimediaSelect = document.getElementById('multimedia-select');
  if (!multimediaSelect) return;

  // Add event listener for multimedia dropdown
  multimediaSelect.addEventListener('change', function() {
    if (this.value) {
      const elementType = this.value;
      // Reset dropdown value after getting the selection
      setTimeout(() => {
        this.value = '';
      }, 100);
      
      // Call the appropriate function based on selection
      switch(elementType) {
        case 'image': insertImageElement(); break;
        case 'figure': insertFigureElement(); break;
        case 'audio': insertAudioElement(); break;
        case 'video': insertVideoElement(); break;
        case 'youtube': insertYouTubeVideo(); break;
        case 'picture': insertPictureElement(); break;
        case 'iframe': insertIframeElement(); break;
      }
    }
  });

  // Save the original insertAtCursor function reference
  const originalInsertAtCursor = window.insertAtCursor;

  // Function to insert image element
  function insertImageElement() {
    const imgSrc = prompt('Enter image URL:', 'https://example.com/image.jpg');
    if (!imgSrc) return;
    
    const imgAlt = prompt('Enter alt text for accessibility:', 'Description of image');
    const width = prompt('Enter width (optional, e.g., 300 or 100%):');
    const height = prompt('Enter height (optional):');
    
    let imgHtml = `<img src="${imgSrc}" alt="${imgAlt || ''}"`;
    
    if (width) imgHtml += ` width="${width}"`;
    if (height) imgHtml += ` height="${height}"`;
    
    imgHtml += '>';
    
    insertAtCursor(imgHtml);
    updatePreview();
  }

  // Function to insert figure with caption
  function insertFigureElement() {
    const imgSrc = prompt('Enter image URL:', 'https://example.com/image.jpg');
    if (!imgSrc) return;
    
    const imgAlt = prompt('Enter alt text for accessibility:', 'Description of image');
    const caption = prompt('Enter caption text:', 'Figure caption');
    
    const figureHtml = `<figure>
  <img src="${imgSrc}" alt="${imgAlt || ''}">
  <figcaption>${caption || ''}</figcaption>
</figure>`;
    
    insertAtCursor(figureHtml);
    updatePreview();
  }

  // Function to insert audio element
  function insertAudioElement() {
    const audioSrc = prompt('Enter audio file URL:', 'https://example.com/audio.mp3');
    if (!audioSrc) return;
    
    const controls = confirm('Include player controls?');
    const autoplay = confirm('Enable autoplay? (Note: may be blocked by browsers)');
    const loop = confirm('Enable loop?');
    
    let audioHtml = `<audio src="${audioSrc}"`;
    
    if (controls) audioHtml += ' controls';
    if (autoplay) audioHtml += ' autoplay';
    if (loop) audioHtml += ' loop';
    
    audioHtml += '>\n  Your browser does not support the audio element.\n</audio>';
    
    insertAtCursor(audioHtml);
    updatePreview();
  }

  // Function to insert video element
  function insertVideoElement() {
    const videoSrc = prompt('Enter video file URL:', 'https://example.com/video.mp4');
    if (!videoSrc) return;
    
    const width = prompt('Enter width (e.g., 640):', '640');
    const height = prompt('Enter height (e.g., 360):', '360');
    const controls = confirm('Include player controls?');
    const autoplay = confirm('Enable autoplay? (Note: may be blocked by browsers)');
    const muted = confirm('Mute video? (Required for autoplay in many browsers)');
    
    let videoHtml = `<video`;
    
    if (width) videoHtml += ` width="${width}"`;
    if (height) videoHtml += ` height="${height}"`;
    if (controls) videoHtml += ' controls';
    if (autoplay) videoHtml += ' autoplay';
    if (muted) videoHtml += ' muted';
    
    videoHtml += `>
  <source src="${videoSrc}" type="video/mp4">
  Your browser does not support the video element.
</video>`;
    
    insertAtCursor(videoHtml);
    updatePreview();
  }

  // Function to insert YouTube video
  function insertYouTubeVideo() {
    const youtubeUrl = prompt('Enter YouTube video URL or ID:', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    if (!youtubeUrl) return;
    
    // Extract video ID from various YouTube URL formats
    let videoId = youtubeUrl;
    
    if (youtubeUrl.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(youtubeUrl.split('?')[1]);
      videoId = urlParams.get('v');
    } else if (youtubeUrl.includes('youtu.be/')) {
      videoId = youtubeUrl.split('youtu.be/')[1];
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    }
    
    if (!videoId) {
      alert('Could not extract YouTube video ID. Please check the URL.');
      return;
    }
    
    const width = prompt('Enter width:', '560');
    const height = prompt('Enter height:', '315');
    
    const youtubeEmbed = `<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    
    insertAtCursor(youtubeEmbed);
    updatePreview();
  }

  // Function to insert picture element (responsive images)
  function insertPictureElement() {
    const defaultSrc = prompt('Enter default image URL:', 'https://example.com/default.jpg');
    if (!defaultSrc) return;
    
    const altText = prompt('Enter alt text for accessibility:', 'Description of image');
    const sourcesCount = parseInt(prompt('Number of additional source variants (for different screen sizes):', '1')) || 0;
    
    let pictureHtml = '<picture>\n';
    
    for (let i = 0; i < sourcesCount; i++) {
      const mediaQuery = prompt(`Enter media query for source ${i+1} (e.g., '(min-width: 800px)'):`);
      const sourceSrc = prompt(`Enter image URL for source ${i+1}:`);
      
      if (mediaQuery && sourceSrc) {
        pictureHtml += `  <source media="${mediaQuery}" srcset="${sourceSrc}">\n`;
      }
    }
    
    pictureHtml += `  <img src="${defaultSrc}" alt="${altText || ''}">\n</picture>`;
    
    insertAtCursor(pictureHtml);
    updatePreview();
  }

  // Function to insert iframe element
  function insertIframeElement() {
    const src = prompt('Enter iframe URL:', 'https://example.com');
    if (!src) return;
    
    const width = prompt('Enter width:', '600');
    const height = prompt('Enter height:', '400');
    
    const iframeHtml = `<iframe src="${src}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
    
    insertAtCursor(iframeHtml);
    updatePreview();
  }

  // Apply CSS styles for multimedia elements
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      /* Multimedia elements styling */
      figure {
        display: block;
        margin: 1em 0;
        text-align: center;
      }
      
      figcaption {
        font-style: italic;
        text-align: center;
        margin-top: 0.5em;
        font-size: 0.9em;
        color: #555;
      }
      
      .preview-section img,
      .preview-section video,
      .preview-section iframe {
        max-width: 100%;
        height: auto;
      }
      
      .preview-section audio {
        width: 100%;
        margin: 1em 0;
      }
    </style>
  `);

  // Helper function to ensure we're using the correct global insertAtCursor
  function insertAtCursor(text) {
    // If the original function exists, use it
    if (typeof originalInsertAtCursor === 'function') {
      originalInsertAtCursor(text);
    } else if (typeof window.insertAtCursor === 'function') {
      window.insertAtCursor(text);
    } else {
      // Fallback implementation
      const inputText = document.getElementById('input-text');
      if (!inputText) return;
      
      const cursorPos = inputText.selectionStart;
      const textBefore = inputText.value.substring(0, cursorPos);
      const textAfter = inputText.value.substring(inputText.selectionEnd);
      
      inputText.value = textBefore + text + textAfter;
      inputText.focus();
      
      // Position cursor after the inserted text
      const newCursorPos = cursorPos + text.length;
      inputText.selectionStart = newCursorPos;
      inputText.selectionEnd = newCursorPos;
    }
  }

  // Helper function to ensure we're using the correct global updatePreview
  function updatePreview() {
    if (typeof window.updatePreview === 'function') {
      window.updatePreview();
    } else {
      // Fallback implementation
      const inputText = document.getElementById('input-text');
      const previewContent = document.getElementById('preview-content');
      const htmlOutput = document.getElementById('html-output');
      
      if (!inputText || !previewContent || !htmlOutput) return;
      
      const html = inputText.value;
      previewContent.innerHTML = html;
      htmlOutput.textContent = html;
    }
  }
});
