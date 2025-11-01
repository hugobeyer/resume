// 🎮 SPREADING CHARACTER GLITCH WITH PARALLEL TIMINGS 🎮
function triggerCharGlitch() {
  const glitchableElements = document.querySelectorAll('h1 > *:not(.theme-switcher), h2, h3, .role, .tagline, .where, p, li');

  if (glitchableElements.length === 0) return;

  // Pick random element
  const randomElement = glitchableElements[Math.floor(Math.random() * glitchableElements.length)];
  const text = randomElement.textContent;

  if (!text || text.length === 0) return;

  // Add noise overlay to entire row
  randomElement.classList.add('glitch-row-active');

  // Pick center position for glitch
  const centerPos = Math.floor(Math.random() * text.length);

  // TIGHTER spread range (4-10 characters) - more focused bursts
  const spreadRange = 4 + Math.floor(Math.random() * 7);

  // Wrap characters with EXTREME varied classes and timing offsets
  let newHTML = '';
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      newHTML += ' ';
      continue;
    }

    const distance = Math.abs(i - centerPos);
    const isLeft = i < centerPos;

    if (distance <= spreadRange) {
      // FULLY RANDOM timing per character - your dash pattern!
      const randomDelay = Math.random() * 1.125; // 0-1.5s random delay
      const randomDuration = 0.233 + Math.random() * 0.467; // 0.2-0.6s duration
      const randomOpacity = 0.435 + Math.random() * 0.715; // 0.5-1.0 opacity

      newHTML += `<span class="char-glitch" style="animation-delay: ${randomDelay}s; animation-duration: ${randomDuration}s; opacity: ${randomOpacity};">${text[i]}</span>`;
    } else {
      newHTML += text[i];
    }
  }

  // Store original
  if (!randomElement.dataset.originalHtml) {
    randomElement.dataset.originalHtml = randomElement.innerHTML;
  }

  // Apply glitch
  randomElement.innerHTML = newHTML;

  // SUPER LONG lifespan for random cascade timings (up to 1.5s delay + 0.6s animation)
  const lifespan = 2100;

  // Restore after animation
  setTimeout(() => {
    randomElement.innerHTML = randomElement.dataset.originalHtml || text;
    randomElement.classList.remove('glitch-row-active');
  }, lifespan);
}

// BURST GLITCHES with FULLY RANDOM INDIVIDUAL TIMINGS
function glitchLoop() {
  // Burst of 2-5 glitches
  const burstCount = 2 + Math.floor(Math.random() * 4);

  for (let p = 0; p < burstCount; p++) {
    // COMPLETELY RANDOM stagger per glitch (0-300ms)
    const randomStagger = Math.random() * 352;

    setTimeout(() => {
      triggerCharGlitch();
    }, randomStagger);
  }

  // RANDOM GAP before next burst (1-4 seconds)
  const nextBurst = 1750 + Math.random() * 3412;
  setTimeout(glitchLoop, nextBurst);
}

// 🎮 ROW EFFECTS - BLINK, WATERFALL CASCADE, OR VSYNC 🎮
function triggerRowEffect() {
  const blinkableElements = document.querySelectorAll('h1, h2, h3, .role, .tagline, .where, p, li, .subline');

  if (blinkableElements.length === 0) return;

  // Randomly choose effect type
  const rand = Math.random();
  let effectType = 'blink';
  if (rand < 0.2) effectType = 'waterfall'; // 20% waterfall
  else if (rand < 0.35) effectType = 'vsync';   // 15% vsync tear

  if (effectType === 'waterfall') {
    // WATERFALL: 5-10 rows cascading down
    const waterfallCount = 5 + Math.floor(Math.random() * 6);

    for (let i = 0; i < waterfallCount; i++) {
      const randomElement = blinkableElements[Math.floor(Math.random() * blinkableElements.length)];

      // Stagger each row's waterfall (0-300ms apart)
      const cascadeDelay = i * (30 + Math.random() * 54);

      setTimeout(() => {
        randomElement.classList.add('row-waterfall');
        setTimeout(() => randomElement.classList.remove('row-waterfall'), 612);
      }, cascadeDelay);
    }

  } else {
    // BLINK or VSYNC: 1-3 rows
    const effectCount = 1 + Math.floor(Math.random() * 3);

    for (let i = 0; i < effectCount; i++) {
      const randomElement = blinkableElements[Math.floor(Math.random() * blinkableElements.length)];

      if (effectType === 'vsync') {
        randomElement.classList.add('vsync-glitch');
        setTimeout(() => randomElement.classList.remove('vsync-glitch'), 220);
      } else {
        randomElement.classList.add('row-blink');
        setTimeout(() => randomElement.classList.remove('row-blink'), 212);
      }
    }
  }
}

// Row effect loop
function rowEffectLoop() {
  triggerRowEffect();

  // Random interval (0.8-3 seconds)
  const nextEffect = 880 + Math.random() * 2420;
  setTimeout(rowEffectLoop, nextEffect);
}
