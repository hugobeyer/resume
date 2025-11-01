// Blog functionality - Display and storage
const BLOG_STORAGE_KEY = 'hugo_blog_posts';

// Get all blog posts from localStorage
function getBlogPosts() {
  const postsJson = localStorage.getItem(BLOG_STORAGE_KEY);
  if (!postsJson) return [];
  try {
    return JSON.parse(postsJson);
  } catch (e) {
    console.error('Error parsing blog posts:', e);
    return [];
  }
}

// Save blog posts to localStorage
function saveBlogPosts(posts) {
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
}

// Add a new blog post
function addBlogPost(title, content, image, tags, youtubeUrl, vimeoUrl, links, category, published = true) {
  const posts = getBlogPosts();
  const newPost = {
    id: Date.now().toString(),
    title: title,
    content: content,
    image: image, // base64 encoded image
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
    youtubeUrl: youtubeUrl || null,
    vimeoUrl: vimeoUrl || null,
    links: links ? links.split('\n').map(l => l.trim()).filter(l => l) : [],
    category: category || '',
    date: new Date().toISOString(),
    published: published
  };
  posts.unshift(newPost); // Add to beginning
  saveBlogPosts(posts);
  return newPost;
}

// Update a blog post
function updateBlogPost(postId, updates) {
  const posts = getBlogPosts();
  const index = posts.findIndex(p => p.id === postId);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates };
    saveBlogPosts(posts);
    return posts[index];
  }
  return null;
}

// Delete a blog post
function deleteBlogPost(postId) {
  const posts = getBlogPosts();
  const filtered = posts.filter(p => p.id !== postId);
  saveBlogPosts(filtered);
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Convert image file to base64
function imageToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Extract Vimeo video ID from URL
function getVimeoVideoId(url) {
  if (!url) return null;
  const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// Generate YouTube embed HTML
function generateYouTubeEmbed(url) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
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
}

// Generate Vimeo embed HTML
function generateVimeoEmbed(url) {
  const videoId = getVimeoVideoId(url);
  if (!videoId) return null;
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
}

// Check if URL is a YouTube or Vimeo link
function isVideoUrl(url) {
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
}

// Generate link preview HTML (simplified - uses iframe for preview)
function generateLinkPreview(url) {
  if (!url) return null;
  if (isVideoUrl(url)) return null; // Videos handled separately
  
  // Extract domain for display
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
}

// Display blog posts on blog.html
function displayBlogPosts(filter = '', category = '') {
  const container = document.getElementById('blog-posts-container');
  if (!container) return;

  let posts = getBlogPosts().filter(p => p.published);
  
  // Apply category filter
  if (category) {
    posts = posts.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
  }
  
  // Apply search filter
  if (filter) {
    const filterLower = filter.toLowerCase();
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(filterLower) ||
      p.content.toLowerCase().includes(filterLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(filterLower)) ||
      (p.category && p.category.toLowerCase().includes(filterLower))
    );
  }
  
  if (posts.length === 0) {
    container.innerHTML = '<p style="opacity: 0.5; color: var(--muted); padding-left: 30px;">No posts found. Try a different search or category.</p>';
    return;
  }

  container.innerHTML = posts.map(post => `
    <article class="blog-post">
      <div class="blog-post-header">
        <h3>${escapeHtml(post.title)}</h3>
        <div class="blog-post-meta">
          <span class="blog-date">${formatDate(post.date)}</span>
          ${post.category ? `<span class="blog-category">${escapeHtml(post.category)}</span>` : ''}
          ${post.tags.length > 0 ? `<div class="blog-tags">${post.tags.map(t => `<span class="blog-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        </div>
      </div>
      ${post.image ? `<div class="blog-image"><img src="${post.image}" alt="${escapeHtml(post.title)}"></div>` : ''}
      ${post.youtubeUrl ? generateYouTubeEmbed(post.youtubeUrl) : ''}
      ${post.vimeoUrl ? generateVimeoEmbed(post.vimeoUrl) : ''}
      <div class="blog-content">${formatBlogContent(post.content)}</div>
      ${post.links && post.links.length > 0 ? post.links.map(link => generateLinkPreview(link)).join('') : ''}
    </article>
  `).join('');
}

// Initialize blog filters
function initBlogFilters() {
  const searchInput = document.getElementById('blog-search');
  const categoryFilter = document.getElementById('category-filter');
  
  // Get all unique categories
  const posts = getBlogPosts().filter(p => p.published);
  const categories = [...new Set(posts.map(p => p.category).filter(c => c))];
  
  // Populate category filter
  if (categoryFilter) {
    categories.forEach(category => {
      const btn = document.createElement('button');
      btn.className = 'category-btn';
      btn.textContent = category;
      btn.setAttribute('data-category', category);
      btn.addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const activeCategory = this.getAttribute('data-category');
        const searchTerm = searchInput ? searchInput.value : '';
        displayBlogPosts(searchTerm, activeCategory);
      });
      categoryFilter.appendChild(btn);
    });
  }
  
  // Handle search input
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const activeCategoryBtn = document.querySelector('.category-btn.active');
        const activeCategory = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-category') : '';
        displayBlogPosts(this.value, activeCategory);
      }, 300);
    });
  }
  
  // Initial "All Posts" button click handler
  const allPostsBtn = document.querySelector('.category-btn[data-category=""]');
  if (allPostsBtn) {
    allPostsBtn.addEventListener('click', function() {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const searchTerm = searchInput ? searchInput.value : '';
      displayBlogPosts(searchTerm, '');
    });
  }
}

// Format blog content (preserve line breaks, detect URLs, and basic formatting)
function formatBlogContent(content) {
  if (!content) return '';
  
  let formatted = escapeHtml(content);
  
  // Detect URLs in content and convert to links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  formatted = formatted.replace(urlRegex, (url) => {
    if (isVideoUrl(url)) {
      return url; // Keep video URLs as-is, they're handled separately
    }
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="external-link">${url}</a>`;
  });
  
  // Format paragraphs
  formatted = formatted
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
  
  return formatted;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize blog display if on blog page
if (document.getElementById('blog-posts-container')) {
  displayBlogPosts();
  initBlogFilters();
}
