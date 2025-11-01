# Hugo Beyer - Technical Artist Resume

An interactive, glitch-themed resume website for Hugo Beyer, a Technical Artist specializing in procedural tools and real-time workflows.

## Features

- **Dynamic Theme Generator**: Randomly generates themes inspired by popular coding editors (VS Code, Sublime, Atom, etc.)
- **Glitch Effects**: Character-level text glitching with customizable timings
- **VEX Console Animation**: Simulated Houdini VEX code typing animation
- **Responsive Design**: Works on desktop and mobile devices
- **Print Styles**: Optimized for printing

## Project Structure

```
resume/
├── index.html          # Main HTML file
├── README.md           # This file
├── css/
│   ├── styles.css      # Main styles (layout, typography, components)
│   ├── animations.css  # Keyframe animations and glitch effects
│   └── print.css       # Print-specific styles
└── js/
    ├── color-utils.js      # Color conversion utilities
    ├── theme-data.js       # Famous theme presets
    ├── theme-generator.js  # Theme generation algorithm
    ├── theme-manager.js    # Theme switching and management
    ├── glitch-effects.js   # Text glitching animations
    ├── vex-console.js      # VEX code typing simulation
    └── app.js              # Main application initialization
```

## How to Run

Simply open `index.html` in any modern web browser. No server required - it's a static website.

## Development

The project is organized with separate CSS and JavaScript files for maintainability:

- **CSS**: Split into logical components (base styles, animations, print styles)
- **JavaScript**: Modular architecture with separate files for different functionalities
- **HTML**: Clean and semantic, with external resource references

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, animations, responsive design
- **JavaScript (ES6+)**: Modular code, DOM manipulation, animations

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+

Requires CSS Custom Properties support for theme functionality.
