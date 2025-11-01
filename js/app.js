// Initialize the application
console.log('Script loaded successfully');

// Remove all title attributes from links
function removeLinkTitles() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.removeAttribute('title');
  });
}

// Remove link titles on page load and after components load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    removeLinkTitles();
    // Also remove after a short delay to catch dynamically loaded links
    setTimeout(removeLinkTitles, 500);
  });
} else {
  removeLinkTitles();
  setTimeout(removeLinkTitles, 500);
}

// Initialize theme
switchTheme();

// Start glitch effects
setTimeout(() => {
  glitchLoop();
  rowEffectLoop();
}, 1000);

// Start VEX console typing
setTimeout(typeVexCode, 2000);

// Populate line numbers
populateLineNumbers();

// Start button effects
buttonEffectLoop();

// Hidden hotkey to access admin page: Ctrl+Shift+Alt+H
function setupAdminHotkey() {
  function handleHotkey(event) {
    // Check for Ctrl+Shift+Alt+H
    // Using both key and code for better compatibility
    const key = (event.key && event.key.toLowerCase()) || '';
    const code = (event.code && event.code.toLowerCase()) || '';
    
    if (event.ctrlKey && event.shiftKey && event.altKey && (key === 'h' || code === 'keyh')) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      console.log('Admin hotkey triggered!');
      window.location.href = 'admin.html';
      return false;
    }
  }
  
  // Add listener in capture phase to catch event early
  document.addEventListener('keydown', handleHotkey, true);
  window.addEventListener('keydown', handleHotkey, true);
  
  console.log('Admin hotkey listener attached (Ctrl+Shift+Alt+H)');
}

// Setup hotkey when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupAdminHotkey);
} else {
  setupAdminHotkey();
}
