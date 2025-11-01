// Component loader for reusable header and sidebar
(function() {
  'use strict';

  // Page-specific configurations
  const PAGE_CONFIG = {
    'index.html': {
      headerLinks: [
        { href: 'blog.html', text: 'Blog' },
        { href: 'https://hugobeyer.gumroad.com/', text: 'hugobeyer.gumroad.com', class: 'social-link' },
        { href: 'https://www.linkedin.com/in/hugobeyer/', text: 'www.linkedin.com/in/hugobeyer', class: 'social-link' },
        { href: 'https://www.artstation.com/hugobeyer', text: 'www.artstation.com/hugobeyer', class: 'social-link' },
        { href: 'https://youtube.com/@hugobeyer', text: 'youtube.com/@hugobeyer', class: 'social-link' }
      ],
      sidebarSections: [
        {
          title: 'Skills',
          type: 'chips',
          content: [
            'Houdini (VEX/OpenCL/PDG)',
            'Unreal (BP/Shaders)',
            'Unity (C#)',
            'Godot (GDS)',
            'Python',
            'GLSL/HLSL',
            'Git',
            'AI tooling'
          ]
        },
        {
          title: 'Education',
          type: 'item',
          content: [
            { role: 'Universidade Positivo', where: 'Curitiba' }
          ]
        },
        {
          title: 'Highlights',
          type: 'bullets',
          content: [
            'Procedural/Modular tools focused on artist workflows.',
            'End‑to‑end real‑time pipeline familiarity.',
            'Comfortable bridging DDC ↔ engine with automation.'
          ]
        },
        {
          title: 'Links',
          type: 'links',
          content: [
            { href: 'https://hugobeyer.gumroad.com/', text: 'Gumroad' },
            { href: 'https://www.linkedin.com/in/hugobeyer/', text: 'LinkedIn' },
            { href: 'https://www.youtube.com/@hugobeyer', text: 'YouTube' },
            { href: 'https://www.artstation.com/hugobeyer', text: 'ArtStation' }
          ]
        },
        {
          title: '',
          type: 'printable',
          content: []
        }
      ]
    },
    'blog.html': {
      headerLinks: [
        { href: 'index.html', text: 'Resume' },
        { href: 'blog.html', text: 'Blog' },
        { href: 'https://hugobeyer.gumroad.com/', text: 'hugobeyer.gumroad.com', class: 'social-link' },
        { href: 'https://www.linkedin.com/in/hugobeyer/', text: 'www.linkedin.com/in/hugobeyer', class: 'social-link' },
        { href: 'https://www.artstation.com/hugobeyer', text: 'www.artstation.com/hugobeyer', class: 'social-link' },
        { href: 'https://youtube.com/@hugobeyer', text: 'youtube.com/@hugobeyer', class: 'social-link' }
      ],
      sidebarSections: [
        {
          title: 'Search',
          type: 'search',
          content: []
        },
        {
          title: 'Categories',
          type: 'categories',
          content: []
        },
        {
          title: 'Skills',
          type: 'chips',
          content: [
            'Houdini (VEX/OpenCL/PDG)',
            'Unreal (BP/Shaders)',
            'Unity (C#)',
            'Godot (GDS)',
            'Python',
            'GLSL/HLSL',
            'Git',
            'AI tooling'
          ]
        },
        {
          title: 'Education',
          type: 'item',
          content: [
            { role: 'Universidade Positivo', where: 'Curitiba' }
          ]
        },
        {
          title: 'Highlights',
          type: 'bullets',
          content: [
            'Procedural/Modular tools focused on artist workflows.',
            'End‑to‑end real‑time pipeline familiarity.',
            'Comfortable bridging DDC ↔ engine with automation.'
          ]
        },
        {
          title: 'Links',
          type: 'links',
          content: [
            { href: 'https://hugobeyer.gumroad.com/', text: 'Gumroad' },
            { href: 'https://www.linkedin.com/in/hugobeyer/', text: 'LinkedIn' },
            { href: 'https://www.youtube.com/@hugobeyer', text: 'YouTube' },
            { href: 'https://www.artstation.com/hugobeyer', text: 'ArtStation' }
          ]
        }
      ]
    },
    'admin.html': {
      headerLinks: [
        { href: 'index.html', text: 'Resume' },
        { href: 'blog.html', text: 'Blog' },
        { href: 'admin.html', text: 'Admin' },
        { href: 'https://hugobeyer.gumroad.com/', text: 'hugobeyer.gumroad.com', class: 'social-link' },
        { href: 'https://www.linkedin.com/in/hugobeyer/', text: 'www.linkedin.com/in/hugobeyer', class: 'social-link' },
        { href: 'https://www.artstation.com/hugobeyer', text: 'www.artstation.com/hugobeyer', class: 'social-link' },
        { href: 'https://youtube.com/@hugobeyer', text: 'youtube.com/@hugobeyer', class: 'social-link' }
      ],
      sidebarSections: [
        {
          title: 'Skills',
          type: 'chips',
          content: [
            'Houdini (VEX/OpenCL/PDG)',
            'Unreal (BP/Shaders)',
            'Unity (C#)',
            'Godot (GDS)',
            'Python',
            'GLSL/HLSL',
            'Git',
            'AI tooling'
          ]
        },
        {
          title: 'Education',
          type: 'item',
          content: [
            { role: 'Universidade Positivo', where: 'Curitiba' }
          ]
        },
        {
          title: 'Highlights',
          type: 'bullets',
          content: [
            'Procedural/Modular tools focused on artist workflows.',
            'End‑to‑end real‑time pipeline familiarity.',
            'Comfortable bridging DDC ↔ engine with automation.'
          ]
        },
        {
          title: 'Links',
          type: 'links',
          content: [
            { href: 'https://hugobeyer.gumroad.com/', text: 'Gumroad' },
            { href: 'https://www.linkedin.com/in/hugobeyer/', text: 'LinkedIn' },
            { href: 'https://www.youtube.com/@hugobeyer', text: 'YouTube' },
            { href: 'https://www.artstation.com/hugobeyer', text: 'ArtStation' }
          ]
        }
      ]
    }
  };

  // Get current page config
  function getPageConfig() {
    const pathname = window.location.pathname;
    const fileName = pathname.split('/').pop() || 'index.html';
    const hash = window.location.hash;
    
    // Handle cases where pathname might be empty or just '/'
    const actualFileName = fileName || (pathname === '/' ? 'index.html' : 'index.html');
    
    console.log('Detected page:', actualFileName, 'Available configs:', Object.keys(PAGE_CONFIG));
    
    const config = PAGE_CONFIG[actualFileName] || PAGE_CONFIG['index.html'];
    if (!config) {
      console.warn('No config found for', actualFileName, 'using index.html config');
      return PAGE_CONFIG['index.html'];
    }
    
    return config;
  }

  // Load header component
  async function loadHeader() {
    console.log('loadHeader called');
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) {
      console.warn('Header placeholder not found');
      return;
    }

    try {
      console.log('Attempting to fetch header component...');
      const response = await fetch('components/header.html');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const header = tempDiv.querySelector('header');
      if (header) {
        headerPlaceholder.parentNode.replaceChild(header, headerPlaceholder);

        // Populate header links
        const config = getPageConfig();
        const linksContainer = document.getElementById('header-links');
        if (linksContainer) {
          linksContainer.innerHTML = config.headerLinks.map(link => {
            let html = `<a href="${link.href}"`;
            if (link.class) html += ` class="${link.class}"`;
            html += `>${link.text}</a>`;
            return html;
          }).join('');
        }

        // Update tagline from settings
        if (typeof updateTagline === 'function') {
          updateTagline();
        }
        
        // Remove all title attributes from links
        removeAllLinkTitles();
        
        console.log('Header loaded successfully');
      }
    } catch (error) {
      console.error('Error loading header component:', error);
      // Fallback: render header directly without fetch
      console.log('Using fallback: rendering header directly');
      renderHeaderDirectly();
    }
  }

  // Render header directly (fallback when fetch fails)
  function renderHeaderDirectly() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    const config = getPageConfig();
    const settings = typeof getSettings === 'function' ? getSettings() : {
      taglineLine1: 'Technical / Environment Artist',
      taglineLine2: 'Procedural tools | Level | RT pipelines | Houdini | Maya | Unreal | Unity | Godot | Substance Designer'
    };

    const headerHTML = `
      <header class="header">
        <div class="title">
          <h1>hugobeyer<button class="theme-switcher" onclick="switchTheme()">>> DONT CLICK HERE! <<</button><span class="sassy-message" id="sassyMsg"></span></h1>
          <p class="tagline">${settings.taglineLine1}</p>
          <p class="tagline">${settings.taglineLine2}</p>
        </div>
        <div class="meta">
          <div>Curitiba, Brazil | Open to remote</div>
          <div class="links" id="header-links">
            ${config.headerLinks.map(link => {
              let html = `<a href="${link.href}"`;
              if (link.class) html += ` class="${link.class}"`;
              html += `>${link.text}</a>`;
              return html;
            }).join('')}
          </div>
        </div>
      </header>
    `;

    headerPlaceholder.outerHTML = headerHTML;
  }

  // Render sidebar section based on type
  function renderSidebarSection(section) {
    let html = `<section><h2>${section.title}</h2>`;

    switch (section.type) {
      case 'chips':
        html += '<div class="chips">';
        html += section.content.map(chip => `<span class="chip">${chip}</span>`).join('');
        html += '</div>';
        break;

      case 'item':
        html += '<div class="item">';
        section.content.forEach(item => {
          html += `<div class="role">${item.role}</div>`;
          if (item.where) html += `<div class="where">${item.where}</div>`;
        });
        html += '</div>';
        break;

      case 'bullets':
        html += '<ul class="bullets">';
        html += section.content.map(bullet => `<li>${bullet}</li>`).join('');
        html += '</ul>';
        break;

      case 'links':
        html += '<div class="links">';
        section.content.forEach(link => {
          html += `<a href="${link.href}" class="social-link">`;
          html += `<span class="link-text">${link.text}</span>`;
          html += `<span class="blink-arrows blink-${Math.floor(Math.random() * 3) + 1}">&lt;&lt;&lt;</span>`;
          html += '</a>';
        });
        html += '</div>';
        break;

      case 'search':
        html += '<input type="text" id="blog-search" class="form-input" placeholder="Search posts...">';
        break;

      case 'categories':
        html += '<div id="category-filter" class="category-filter">';
        html += '<button class="category-btn active" data-category="">All Posts</button>';
        html += '</div>';
        break;

      case 'printable':
        html = '<section style="margin-top: 20px;">';
        html += '<button id="printable-version-btn" class="printable-btn">Printable Version</button>';
        html += '</section>';
        return html;
    }

    html += '</section>';
    return html;
  }

  // Load sidebar component
  async function loadSidebar() {
    console.log('loadSidebar called');
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (!sidebarPlaceholder) {
      console.warn('Sidebar placeholder not found');
      return;
    }

    try {
      console.log('Attempting to fetch sidebar component...');
      const response = await fetch('components/sidebar.html');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const sidebar = tempDiv.querySelector('aside');
      if (sidebar) {
        // Populate sidebar with page-specific sections
        const config = getPageConfig();
        sidebar.innerHTML = config.sidebarSections.map(renderSidebarSection).join('');

        sidebarPlaceholder.parentNode.replaceChild(sidebar, sidebarPlaceholder);
        console.log('Sidebar loaded successfully');
        
        // Remove all title attributes from links
        removeAllLinkTitles();
        
        // Initialize printable version button if it exists
        const printableBtn = document.getElementById('printable-version-btn');
        if (printableBtn) {
          printableBtn.addEventListener('click', togglePrintableVersion);
        }
      }
    } catch (error) {
      console.error('Error loading sidebar component:', error);
      // Fallback: render sidebar directly without fetch
      console.log('Using fallback: rendering sidebar directly');
      renderSidebarDirectly();
    }
  }

  // Render sidebar directly (fallback when fetch fails)
  function renderSidebarDirectly() {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (!sidebarPlaceholder) return;

    const config = getPageConfig();
    const sidebarHTML = `<aside class="sidebar">${config.sidebarSections.map(renderSidebarSection).join('')}</aside>`;
    
    sidebarPlaceholder.outerHTML = sidebarHTML;
    
    // Remove all title attributes from links
    removeAllLinkTitles();
    
    // Initialize printable version button if it exists
    const printableBtn = document.getElementById('printable-version-btn');
    if (printableBtn) {
      printableBtn.addEventListener('click', togglePrintableVersion);
    }
  }

  // Toggle printable version (black text, white background, no effects)
  function togglePrintableVersion() {
    const body = document.body;
    const isPrintable = body.classList.contains('printable-mode');
    
    if (isPrintable) {
      // Exit printable mode
      body.classList.remove('printable-mode');
      this.textContent = 'Printable Version';
    } else {
      // Enter printable mode
      body.classList.add('printable-mode');
      this.textContent = 'Exit Printable Version';
    }
  }

  // Make togglePrintableVersion globally accessible
  window.togglePrintableVersion = togglePrintableVersion;

  // Remove all title attributes from links
  function removeAllLinkTitles() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.removeAttribute('title');
    });
  }

  // Make removeAllLinkTitles globally accessible
  window.removeAllLinkTitles = removeAllLinkTitles;

  // Initialize components when DOM is ready
  function initComponents() {
    console.log('Initializing components...', document.readyState);
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded fired, loading components');
        loadHeader();
        loadSidebar();
      });
    } else {
      console.log('DOM already ready, loading components immediately');
      loadHeader();
      loadSidebar();
    }
  }

  // Export for use in other scripts
  window.ComponentLoader = {
    loadHeader,
    loadSidebar,
    initComponents
  };

  // Auto-initialize
  initComponents();
})();
