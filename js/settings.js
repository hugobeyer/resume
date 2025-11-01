// Settings management - Tagline and site configuration
const SETTINGS_STORAGE_KEY = 'hugo_site_settings';

// Default settings
const DEFAULT_SETTINGS = {
  taglineLine1: 'Technical / Environment Artist',
  taglineLine2: 'Procedural tools | Level | RT pipelines | Houdini | Maya | Unreal | Unity | Godot | Substance Designer'
};

// Get settings from localStorage
function getSettings() {
  const settingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!settingsJson) return DEFAULT_SETTINGS;
  try {
    const saved = JSON.parse(settingsJson);
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch (e) {
    console.error('Error parsing settings:', e);
    return DEFAULT_SETTINGS;
  }
}

// Save settings to localStorage
function saveSettings(settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

// Update tagline on page
function updateTagline() {
  const settings = getSettings();
  const taglines = document.querySelectorAll('.tagline');
  
  if (taglines.length >= 2) {
    taglines[0].textContent = settings.taglineLine1;
    taglines[1].textContent = settings.taglineLine2;
  } else if (taglines.length === 1) {
    // Fallback if only one tagline element exists
    taglines[0].innerHTML = `<div>${settings.taglineLine1}</div><div>${settings.taglineLine2}</div>`;
  }
}

// Initialize tagline on page load
document.addEventListener('DOMContentLoaded', function() {
  updateTagline();
});

// Also run immediately if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM is still loading, wait for DOMContentLoaded
} else {
  // DOM is already loaded
  updateTagline();
}
