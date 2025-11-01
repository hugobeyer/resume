// 🎮 VEX CONSOLE TYPING ANIMATION 🎮
const vexLines = document.querySelectorAll('.vex-line');
const vexScripts = [
  // Script 1: Wavefront Propagation
  [
    { code: '// WAVEFRONT PROPAGATION - Geodesic Distance', indent: 0 },
    { code: 'int neighbors[] = neighbours(0, @ptnum);', indent: 0 },
    { code: 'float wave_dist = f@geodist;', indent: 0 },
    { code: 'foreach(int nb; neighbors) {', indent: 0 },
    { code: 'float edge_len = distance(@P, point(0, "P", nb));', indent: 1 },
    { code: 'float new_dist = wave_dist + edge_len;', indent: 1 },
    { code: 'if(new_dist < nb_dist) setpointattrib(0, "geodist", nb, new_dist);', indent: 1 },
    { code: '}', indent: 0 }
  ],
  // Script 2: Density Selector
  [
    { code: '// DENSITY SELECTOR - Find high-density points', indent: 0 },
    { code: 'float max_density = 0; int start_pt = -1;', indent: 0 },
    { code: 'for (int i = 0; i < @numpt; i++) {', indent: 0 },
    { code: 'if (pt_density > max_density) { start_pt = i; }', indent: 1 },
    { code: '}', indent: 0 },
    { code: 'setpointattrib(0, "selected", start_pt, 1);', indent: 0 }
  ],
  // Script 3: Border Detection
  [
    { code: '// BORDER DETECTION - Edge analysis', indent: 0 },
    { code: 'int prims[] = pointprims(0, @ptnum);', indent: 0 },
    { code: 'if (shared_count == 1) is_border = 1;', indent: 0 },
    { code: 'float gradient = 1.0 - (min_dist / max_inward_dist);', indent: 0 },
    { code: '@mask = pow(clamp(gradient, 0, 1), falloff);', indent: 0 }
  ],
  // Script 4: Polypath Connection
  [
    { code: '// POLYPATH CONNECTION - Detail wrangle', indent: 0 },
    { code: 'int prim = addprim(0, "polyline");', indent: 0 },
    { code: 'for (int pt = 0; pt < total_points; pt++) {', indent: 0 },
    { code: 'addvertex(0, prim, pt);', indent: 1 },
    { code: '}', indent: 0 },
    { code: 'setprimattrib(0, "type", prim, "connected_curve");', indent: 0 },
    { code: 'printf("Created curve with %d points", total_points);', indent: 0 }
  ],
  // Script 5: Noise Displacement
  [
    { code: '// NOISE DISPLACEMENT', indent: 0 },
    { code: '@P += noise(@P * ch("freq")) * ch("amp");', indent: 0 },
    { code: 'vector offset = fit01(rand(@id), 0, ch("scatter_radius"));', indent: 0 },
    { code: '@P += offset * @N;', indent: 0 }
  ],
  // Script 6: Attribute Transfer
  [
    { code: '// ATTRIBUTE TRANSFER - Neighbor averaging', indent: 0 },
    { code: 'vector sum = {0, 0, 0};', indent: 0 },
    { code: 'foreach(int nb; i[]@neighbors) {', indent: 0 },
    { code: 'sum += point(0, "Cd", nb);', indent: 1 },
    { code: '}', indent: 0 },
    { code: '@Cd = sum / len(i[]@neighbors);', indent: 0 }
  ]
];

let currentScript = 0;
let currentLineInScript = 0;

let currentVexLine = 0;
const maxVisibleLines = 8; // Keep 4-8 lines visible

function typeVexCode() {
  // Fade out old lines when we have too many
  if (currentVexLine >= maxVisibleLines) {
    const oldestLine = vexLines[currentVexLine - maxVisibleLines];
    oldestLine.classList.add('fading');
    oldestLine.classList.remove('visible');

    setTimeout(() => {
      oldestLine.innerHTML = '';
      oldestLine.classList.remove('fading');
    }, 800);
  }

  // Get current script and line
  const script = vexScripts[currentScript];
  const snippet = script[currentLineInScript];
  const code = snippet.code;
  const indent = snippet.indent;

  const lineElement = vexLines[currentVexLine % vexLines.length];

  // Set line number and indent
  lineElement.setAttribute('data-line-num', (currentVexLine + 1).toString().padStart(3, ' '));
  lineElement.setAttribute('data-indent', indent);

  lineElement.classList.remove('fading');
  lineElement.classList.add('typing');
  lineElement.innerHTML = '';

  // Type character by character with HUMAN VARIANCE
  let charIndex = 0;

  function typeNextChar() {
    if (charIndex < code.length) {
      // HUMAN-LIKE typing - varied speed per character
      let charSpeed = 40 + Math.random() * 80; // 40-120ms base

      // Slow down on punctuation and special chars
      const char = code[charIndex];
      if (char === '(' || char === ')' || char === '{' || char === '}') {
        charSpeed += 50 + Math.random() * 80; // Pause at brackets
      } else if (char === ';' || char === ',' || char === '.') {
        charSpeed += 30 + Math.random() * 60; // Pause at punctuation
      } else if (char === ' ') {
        charSpeed = 20 + Math.random() * 30; // Faster on spaces
      }

      // Occasional random pauses (like thinking)
      if (Math.random() < 0.1) {
        charSpeed += 150 + Math.random() * 200; // Random hesitation
      }

      // Occasional bursts of speed
      if (Math.random() < 0.15) {
        charSpeed = 15 + Math.random() * 25; // Fast typing burst
      }

      lineElement.innerHTML = code.substring(0, charIndex + 1) + '<span class="typing-cursor"></span>';
      charIndex++;
      setTimeout(typeNextChar, charSpeed);
    } else {
      // Remove cursor when done, mark as visible
      lineElement.innerHTML = code;
      lineElement.classList.remove('typing');
      lineElement.classList.add('visible');

      // Move to next line in script
      currentLineInScript++;
      currentVexLine++;

      // Check if script is complete
      if (currentLineInScript >= script.length) {
        currentLineInScript = 0;
        currentScript = (currentScript + 1) % vexScripts.length; // Next script

        // Longer pause between scripts
        const pauseTime = 1500 + Math.random() * 2000;
        setTimeout(typeVexCode, pauseTime);
      } else {
        // Shorter pause between lines in same script
        const pauseTime = 400 + Math.random() * 1000;
        setTimeout(typeVexCode, pauseTime);
      }
    }
  }

  typeNextChar();
}

// 🔢 POPULATE LINE NUMBERS - SIMPLE 1-128
function populateLineNumbers() {
  const lineNumberColumn = document.getElementById('lineNumbers');

  lineNumberColumn.innerHTML = '';

  // Simple 1-128 line numbers
  for (let i = 1; i <= 128; i++) {
    const lineNum = document.createElement('div');
    lineNum.textContent = i;
    lineNum.className = 'line-num';
    lineNumberColumn.appendChild(lineNum);
  }
}

// 🎮 BUTTON ANIMATION EFFECTS 🎮
const themeButton = document.querySelector('.theme-switcher');

function triggerButtonEffect() {
  // Remove any existing animation classes
  themeButton.classList.remove('blink', 'jitter');

  // Randomly choose blink or jitter (higher probability)
  const rand = Math.random();
  if (rand < 0.5) { // 50% chance to blink
    themeButton.classList.add('blink');
    setTimeout(() => themeButton.classList.remove('blink'), 2000);
  } else { // 50% chance to jitter
    themeButton.classList.add('jitter');
    setTimeout(() => themeButton.classList.remove('jitter'), 1500);
  }
}

// Start button effect loop - trigger every 2-4 seconds (more frequent)
function buttonEffectLoop() {
  triggerButtonEffect();
  const nextEffect = 2000 + Math.random() * 2000; // 2-4 seconds
  setTimeout(buttonEffectLoop, nextEffect);
}
