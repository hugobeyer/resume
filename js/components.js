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
          // Determine icon based on URL
          let icon = '';
          if (link.href.includes('gumroad.com')) {
            icon = '<svg class="link-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><text x="2" y="18" font-family="Arial, sans-serif" font-size="20" font-weight="bold">G</text></svg>';
          } else if (link.href.includes('linkedin.com')) {
            icon = '<svg class="link-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
          } else if (link.href.includes('youtube.com') || link.href.includes('youtu.be')) {
            icon = '<svg class="link-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM8 16V8l8 4-8 4z"/></svg>';
          } else if (link.href.includes('artstation.com')) {
            icon = '<svg class="link-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.142-1.289H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887z"/></svg>';
          }
          
          html += `<a href="${link.href}" class="social-link">`;
          if (icon) html += icon;
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
