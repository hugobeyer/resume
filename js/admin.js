// Admin functionality - Create and manage blog posts
let currentImageBase64 = null;

// Admin credentials
const ADMIN_USERNAME = 'bugo';
const ADMIN_PASSWORD = '!123Carthug';
const AUTH_KEY = 'admin_authenticated';

// Check if user is authenticated
function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

// Set authentication status
function setAuthenticated(authenticated) {
  if (authenticated) {
    sessionStorage.setItem(AUTH_KEY, 'true');
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('login-error');
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    setAuthenticated(true);
    showAdminContent();
    errorDiv.textContent = '';
  } else {
    errorDiv.textContent = 'Invalid username or password';
    errorDiv.style.display = 'block';
  }
}

// Show admin content and hide login
function showAdminContent() {
  const loginContainer = document.getElementById('login-container');
  const adminContent = document.getElementById('admin-content');
  
  if (loginContainer) loginContainer.style.display = 'none';
  if (adminContent) adminContent.style.display = 'block';
  
  // Initialize admin functionality
  initAdmin();
  
  // Initialize analytics display if available
  if (typeof initAnalyticsDisplay === 'function') {
    setTimeout(initAnalyticsDisplay, 100);
  }
}

// Show login and hide admin content
function showLogin() {
  const loginContainer = document.getElementById('login-container');
  const adminContent = document.getElementById('admin-content');
  
  if (loginContainer) loginContainer.style.display = 'block';
  if (adminContent) adminContent.style.display = 'none';
}

// Logout function
function logout() {
  setAuthenticated(false);
  showLogin();
  // Clear form
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.reset();
  const errorDiv = document.getElementById('login-error');
  if (errorDiv) errorDiv.textContent = '';
}

// Initialize admin page
function initAdmin() {
  const form = document.getElementById('post-form');
  const imageInput = document.getElementById('post-image');
  const imagePreview = document.getElementById('image-preview');
  const publishedCheckbox = document.getElementById('post-published');
  const submitBtn = document.querySelector('.submit-btn');

  if (form) {
    form.addEventListener('submit', handlePostSubmit);
  }

  if (imageInput && imagePreview) {
    imageInput.addEventListener('change', handleImageUpload);
  }

  // Update button text based on publish status
  if (publishedCheckbox && submitBtn) {
    publishedCheckbox.addEventListener('change', function() {
      submitBtn.textContent = this.checked ? 'Publish Post' : 'Save as Draft';
    });
  }

  // Load existing posts for management
  displayPostsList();

  // Initialize settings form
  initSettingsForm();

  // Initialize preview button
  const previewBtn = document.getElementById('preview-btn');
  if (previewBtn) {
    previewBtn.addEventListener('click', showPostPreview);
  }
}

// Initialize settings form
function initSettingsForm() {
  const settingsForm = document.getElementById('settings-form');
  const taglineLine1 = document.getElementById('tagline-line1');
  const taglineLine2 = document.getElementById('tagline-line2');

  if (!settingsForm) return;

  // Load current settings
  const settings = getSettings();
  if (taglineLine1) taglineLine1.value = settings.taglineLine1;
  if (taglineLine2) taglineLine2.value = settings.taglineLine2;

  // Handle settings form submission
  settingsForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const line1 = taglineLine1.value.trim();
    const line2 = taglineLine2.value.trim();

    if (!line1 || !line2) {
      alert('Please fill in both tagline lines.');
      return;
    }

    saveSettings({
      taglineLine1: line1,
      taglineLine2: line2
    });

    // Update tagline on current page
    updateTagline();

    showMessage('Settings saved successfully! Changes will appear on all pages.', 'success');
  });
}

// Show post preview in modal
function showPostPreview() {
  // Collect form data
  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();
  const tags = document.getElementById('post-tags').value.trim();
  const youtubeUrl = document.getElementById('post-youtube').value.trim();
  const vimeoUrl = document.getElementById('post-vimeo').value.trim();
  const links = document.getElementById('post-links').value.trim();
  const category = document.getElementById('post-category').value.trim();
  const imagePreview = document.getElementById('image-preview');
  const image = imagePreview && imagePreview.querySelector('img') ? imagePreview.querySelector('img').src : null;

  // Validate required fields
  if (!title || !content) {
    alert('Please fill in at least the title and content to preview.');
    return;
  }

  // Create temporary post object for preview
  const imagePosition = document.getElementById('post-image-position').value || 'banner';
  const previewPost = {
    title: title,
    content: content,
    image: image,
    imagePosition: imagePosition,
    tags: tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [],
    youtubeUrl: youtubeUrl || null,
    vimeoUrl: vimeoUrl || null,
    links: links ? links.split('\n').map(l => l.trim()).filter(l => l) : [],
    category: category || '',
    date: new Date().toISOString()
  };

  // Create modal HTML
  const modalHTML = `
    <div class="preview-modal" id="preview-modal">
      <div class="preview-modal-content">
        <button class="preview-modal-close" onclick="closePostPreview()">&times;</button>
        ${renderPostPreview(previewPost)}
      </div>
    </div>
  `;

  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Close modal on escape key
  document.addEventListener('keydown', function closeOnEscape(e) {
    if (e.key === 'Escape') {
      closePostPreview();
      document.removeEventListener('keydown', closeOnEscape);
    }
  });

  // Close modal on backdrop click
  const modal = document.getElementById('preview-modal');
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closePostPreview();
    }
  });
}

// Render post preview HTML (reuses blog.js functions)
function renderPostPreview(post) {
  // Use functions from blog.js if available, otherwise define inline versions
  const escapeHtml = window.escapeHtml || function(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const formatDate = window.formatDate || function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatBlogContent = window.formatBlogContent || function(content) {
    if (!content) return '';
    let formatted = escapeHtml(content);
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    formatted = formatted.replace(urlRegex, (url) => {
      if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
        return url;
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="external-link">${url}</a>`;
    });
    formatted = formatted
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
    return formatted;
  };

  const generateYouTubeEmbed = window.generateYouTubeEmbed || function(url) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    if (!videoId) return '';
    return `
      <div class="video-embed youtube-embed">
        <iframe 
          src="https://www.youtube.com/embed/${videoId}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    `;
  };

  const generateVimeoEmbed = window.generateVimeoEmbed || function(url) {
    if (!url) return '';
    const regExp = /(?:vimeo\.com\/)(\d+)/;
    const match = url.match(regExp);
    const videoId = match ? match[1] : null;
    if (!videoId) return '';
    return `
      <div class="video-embed vimeo-embed">
        <iframe 
          src="https://player.vimeo.com/video/${videoId}" 
          frameborder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    `;
  };

  const generateLinkPreview = window.generateLinkPreview || function(url) {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) return '';
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      return `
        <div class="link-preview">
          <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="link-preview-link">
            <div class="link-preview-content">
              <div class="link-preview-icon">🔗</div>
              <div class="link-preview-info">
                <div class="link-preview-domain">${escapeHtml(domain)}</div>
                <div class="link-preview-url">${escapeHtml(url)}</div>
              </div>
              <div class="link-preview-arrow">→</div>
            </div>
          </a>
        </div>
      `;
    } catch (e) {
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="external-link">${escapeHtml(url)}</a>`;
    }
  };

  // Helper function to generate image HTML
  const generateBlogImage = function(image, title, position = 'banner') {
    if (!image) return '';
    const positionClass = `blog-image-${position}`;
    return `<div class="blog-image ${positionClass}"><img src="${image}" alt="${escapeHtml(title)}"></div>`;
  };
  
  // Helper function to insert image inline
  const insertImageInContent = function(content, imageHtml) {
    const firstPClose = content.indexOf('</p>');
    if (firstPClose !== -1) {
      return content.slice(0, firstPClose + 4) + imageHtml + content.slice(firstPClose + 4);
    }
    return imageHtml + content;
  };
  
  const imagePosition = post.imagePosition || 'banner';
  const imageHtml = generateBlogImage(post.image, post.title, imagePosition);
  
  // Structure based on image position
  let contentStructure = '';
  
  if (imagePosition === 'banner') {
    contentStructure = `
      ${imageHtml}
      ${post.youtubeUrl ? generateYouTubeEmbed(post.youtubeUrl) : ''}
      ${post.vimeoUrl ? generateVimeoEmbed(post.vimeoUrl) : ''}
      <div class="blog-content">${formatBlogContent(post.content)}</div>
      ${post.links && post.links.length > 0 ? post.links.map(link => generateLinkPreview(link)).join('') : ''}
    `;
  } else if (imagePosition === 'side') {
    contentStructure = `
      <div class="blog-content-with-side-image">
        ${imageHtml}
        <div class="blog-content-wrapper">
          ${post.youtubeUrl ? generateYouTubeEmbed(post.youtubeUrl) : ''}
          ${post.vimeoUrl ? generateVimeoEmbed(post.vimeoUrl) : ''}
          <div class="blog-content">${formatBlogContent(post.content)}</div>
          ${post.links && post.links.length > 0 ? post.links.map(link => generateLinkPreview(link)).join('') : ''}
        </div>
      </div>
    `;
  } else {
    const content = formatBlogContent(post.content);
    const contentWithImage = insertImageInContent(content, imageHtml);
    contentStructure = `
      ${post.youtubeUrl ? generateYouTubeEmbed(post.youtubeUrl) : ''}
      ${post.vimeoUrl ? generateVimeoEmbed(post.vimeoUrl) : ''}
      <div class="blog-content">${contentWithImage}</div>
      ${post.links && post.links.length > 0 ? post.links.map(link => generateLinkPreview(link)).join('') : ''}
    `;
  }

  return `
    <article class="blog-post">
      <div class="blog-post-header">
        <h3>${escapeHtml(post.title)}</h3>
        <div class="blog-post-meta">
          <span class="blog-date">${formatDate(post.date)}</span>
          ${post.category ? `<span class="blog-category">${escapeHtml(post.category)}</span>` : ''}
          ${post.tags.length > 0 ? `<div class="blog-tags">${post.tags.map(t => `<span class="blog-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
      ${contentStructure}
    </article>
  `;
}

// Close post preview modal
function closePostPreview() {
  const modal = document.getElementById('preview-modal');
  if (modal) {
    modal.remove();
  }
}

// Make closePostPreview globally accessible
window.closePostPreview = closePostPreview;

// Initialize authentication check on page load
function initAuth() {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Check if already authenticated
  if (isAuthenticated()) {
    showAdminContent();
  } else {
    showLogin();
  }
}

// Initialize authentication when page loads
if (document.getElementById('login-form') || document.getElementById('post-form')) {
  initAuth();
}

// Handle image upload
async function handleImageUpload(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('image-preview');
  
  if (!file) {
    currentImageBase64 = null;
    preview.innerHTML = '';
    return;
  }

  try {
    currentImageBase64 = await imageToBase64(file);
    preview.innerHTML = `
      <img src="${currentImageBase64}" alt="Preview" style="max-width: 100%; max-height: 300px; border-radius: 6px; margin-top: 10px;">
      <button type="button" onclick="removeImage()" class="remove-image-btn">Remove Image</button>
    `;
  } catch (error) {
    console.error('Error loading image:', error);
    alert('Error loading image. Please try again.');
  }
}

// Remove image
function removeImage() {
  const imageInput = document.getElementById('post-image');
  const preview = document.getElementById('image-preview');
  
  if (imageInput) imageInput.value = '';
  if (preview) preview.innerHTML = '';
  currentImageBase64 = null;
}

// Handle post form submission
async function handlePostSubmit(event) {
  event.preventDefault();

  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();
  const tags = document.getElementById('post-tags').value.trim();
  const youtubeUrl = document.getElementById('post-youtube').value.trim();
  const vimeoUrl = document.getElementById('post-vimeo').value.trim();
  const links = document.getElementById('post-links').value.trim();
  const category = document.getElementById('post-category').value.trim();
  const imagePosition = document.getElementById('post-image-position').value || 'banner';
  const published = document.getElementById('post-published').checked;

  if (!title || !content) {
    alert('Please fill in title and content.');
    return;
  }

  const form = document.getElementById('post-form');
  const editingPostId = form.getAttribute('data-editing-post-id');

  try {
    if (editingPostId) {
      // Update existing post
      const updatedPost = {
        title: title,
        content: content,
        image: currentImageBase64,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        youtubeUrl: youtubeUrl || null,
        vimeoUrl: vimeoUrl || null,
        links: links ? links.split('\n').map(l => l.trim()).filter(l => l) : [],
        category: category || '',
        imagePosition: imagePosition || 'banner',
        published: published
      };
      
      updateBlogPost(editingPostId, updatedPost);
      form.removeAttribute('data-editing-post-id');
      showMessage('Post updated successfully!', 'success');
    } else {
      // Create new post
      addBlogPost(title, content, currentImageBase64, tags, youtubeUrl, vimeoUrl, links, category, imagePosition, published);
      showMessage(published ? 'Post published successfully!' : 'Post saved as draft!', 'success');
    }
    
    // Reset form
    document.getElementById('post-form').reset();
    removeImage();
    
    // Refresh posts list
    displayPostsList();
  } catch (error) {
    console.error('Error saving post:', error);
    alert('Error saving post. Please try again.');
  }
}

// Display list of posts for management
function displayPostsList() {
  const container = document.getElementById('posts-list-container');
  if (!container) return;

  const posts = getBlogPosts();
  
  if (posts.length === 0) {
    container.innerHTML = '<p style="opacity: 0.5; color: var(--muted); padding-left: 30px;">No posts yet.</p>';
    return;
  }

  container.innerHTML = posts.map(post => `
    <div class="post-item">
      <div class="post-item-header">
        <h4>${escapeHtml(post.title)} ${!post.published ? '<span class="draft-badge">DRAFT</span>' : ''}</h4>
        <div class="post-item-actions">
          <span class="post-date">${formatDate(post.date)}</span>
          ${post.category ? `<span class="blog-category">${escapeHtml(post.category)}</span>` : ''}
          <button onclick="editPost('${post.id}')" class="edit-btn">Edit</button>
          <button onclick="togglePublishStatus('${post.id}')" class="publish-btn ${post.published ? 'published' : 'draft'}">
            ${post.published ? 'Unpublish' : 'Publish'}
          </button>
          <button onclick="deletePost('${post.id}')" class="delete-btn">Delete</button>
        </div>
      </div>
      <div class="post-item-content">${escapeHtml(post.content.substring(0, 150))}${post.content.length > 150 ? '...' : ''}</div>
      ${post.tags.length > 0 ? `<div class="post-item-tags">${post.tags.map(t => `<span class="blog-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
      ${post.youtubeUrl ? '<span class="post-media-indicator">📺 YouTube</span>' : ''}
      ${post.vimeoUrl ? '<span class="post-media-indicator">🎬 Vimeo</span>' : ''}
      ${post.links && post.links.length > 0 ? `<span class="post-media-indicator">🔗 ${post.links.length} Link(s)</span>` : ''}
    </div>
  `).join('');
}

// Toggle publish status
function togglePublishStatus(postId) {
  const posts = getBlogPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.published = !post.published;
    updateBlogPost(postId, { published: post.published });
    displayPostsList();
    showMessage(post.published ? 'Post published!' : 'Post unpublished (draft)', 'success');
  }
}

// Edit a post
function editPost(postId) {
  const posts = getBlogPosts();
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    alert('Post not found.');
    return;
  }

  // Populate form with post data
  document.getElementById('post-title').value = post.title || '';
  document.getElementById('post-content').value = post.content || '';
  document.getElementById('post-tags').value = post.tags ? post.tags.join(', ') : '';
  document.getElementById('post-category').value = post.category || '';
  document.getElementById('post-youtube').value = post.youtubeUrl || '';
  document.getElementById('post-vimeo').value = post.vimeoUrl || '';
  document.getElementById('post-links').value = post.links ? post.links.join('\n') : '';
  document.getElementById('post-published').checked = post.published !== false;
  
  // Set image position if available
  const imagePositionSelect = document.getElementById('post-image-position');
  if (imagePositionSelect && post.imagePosition) {
    imagePositionSelect.value = post.imagePosition;
  }
  
  // Handle image preview
  if (post.image) {
    currentImageBase64 = post.image;
    const preview = document.getElementById('image-preview');
    if (preview) {
      preview.innerHTML = `
        <img src="${post.image}" alt="Preview" style="max-width: 100%; max-height: 300px; border-radius: 6px; margin-top: 10px;">
        <button type="button" onclick="removeImage()" class="remove-image-btn">Remove Image</button>
      `;
    }
  }
  
  // Store the post ID being edited
  const form = document.getElementById('post-form');
  if (form) {
    form.setAttribute('data-editing-post-id', postId);
  }
  
  // Update submit button text
  const submitBtn = form.querySelector('.submit-btn');
  if (submitBtn) {
    submitBtn.textContent = 'Update Post';
  }
  
  // Show cancel button
  showCancelEditButton();
  
  // Scroll to form
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  showMessage('Editing post. Update and click "Update Post" to save changes.', 'success');
}

// Show cancel edit button
function showCancelEditButton() {
  const form = document.getElementById('post-form');
  if (!form) return;
  
  // Check if cancel button already exists
  if (document.getElementById('cancel-edit-btn')) return;
  
  const buttonContainer = form.querySelector('div[style*="display: flex"]');
  if (buttonContainer) {
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.id = 'cancel-edit-btn';
    cancelBtn.className = 'cancel-edit-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = cancelEdit;
    buttonContainer.insertBefore(cancelBtn, buttonContainer.firstChild);
  }
}

// Cancel editing
function cancelEdit() {
  const form = document.getElementById('post-form');
  if (form) {
    form.removeAttribute('data-editing-post-id');
    form.reset();
  }
  
  // Remove cancel button
  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.remove();
  
  // Reset submit button text
  const submitBtn = form.querySelector('.submit-btn');
  if (submitBtn) {
    const publishCheckbox = document.getElementById('post-published');
    submitBtn.textContent = publishCheckbox && publishCheckbox.checked ? 'Publish Post' : 'Save as Draft';
  }
  
  removeImage();
  showMessage('Edit cancelled.', 'success');
}

// Delete a post
function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this post?')) {
    return;
  }

  deleteBlogPost(postId);
  displayPostsList();
  showMessage('Post deleted successfully!', 'success');
}

// Show message notification
function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `admin-message admin-message-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: var(--accent);
    color: var(--bg);
    border-radius: 6px;
    z-index: 10000;
    font-family: inherit;
    font-size: 14px;
  `;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.style.opacity = '0';
    messageDiv.style.transition = 'opacity 0.3s';
    setTimeout(() => messageDiv.remove(), 300);
  }, 3000);
}

