// 🎨 PALETTE-SMART THEME GENERATOR ALGORITHM 🎨
function generateSmartTheme() {
  // Pick random famous theme as base
  const base = famousThemes[Math.floor(Math.random() * famousThemes.length)];
  console.log(`Using ${base.name} inspired theme`);

  // Add slight variations to make each generation unique
  const bgHueVar = base.bg + (Math.random() - 0.5) * 15;
  const accentHueVar = base.accent + (Math.random() - 0.5) * 20;

  const palette = {
    hues: [bgHueVar, accentHueVar, base.text + (Math.random() - 0.5) * 10],
    baseLightness: 8 + Math.random() * 8
  };

  // BACKGROUND - Based on famous theme
  const bgHue = bgHueVar;
  const bgSat = base.bgSat * (0.8 + Math.random() * 0.4); // Slight variation
  const bgLight = palette.baseLightness;
  const bgColor = hslToHex(bgHue, bgSat, bgLight);

  // 💡 FOREGROUND - Clean, desaturated text
  const fgHue = palette.hues[2];
  const fgSat = base.textSat * (0.7 + Math.random() * 0.6);
  const fgLight = 90 + Math.random() * 8;
  const fgColor = hslToHex(fgHue, fgSat, fgLight);

  // 🔘 MUTED TEXT - Between bg and fg
  const mutedHue = palette.hues[2];
  const mutedSat = base.textSat * (1 + Math.random() * 0.5);
  const mutedLight = 60 + Math.random() * 15;
  const mutedColor = hslToHex(mutedHue, mutedSat, mutedLight);

  // ✨ ACCENT - Famous theme's signature color
  const accentHue = accentHueVar;
  const accentSat = base.accentSat * (0.9 + Math.random() * 0.2);
  const accentLight = 60 + Math.random() * 20;
  const accentColor = hslToHex(accentHue, accentSat, accentLight);

  // 🔗 LINKS - Related to accent
  const linkHue = accentHue + (Math.random() - 0.5) * 15;
  const linkSat = base.accentSat * (0.8 + Math.random() * 0.3);
  const linkLight = 65 + Math.random() * 18;
  const linkColor = hslToHex(linkHue, linkSat, linkLight);

  // 🎛️ UI ELEMENTS - Subtle depth layers, stay desaturated like background
  const chipHue = bgHue + (Math.random() - 0.5) * 15;
  const chipSat = Math.min(bgSat * 0.9, 10); // Keep even more desaturated
  const chipLight = bgLight + 2 + Math.random() * 5;
  const chipColor = hslToHex(chipHue, chipSat, chipLight);

  const ruleHue = bgHue + (Math.random() - 0.5) * 12;
  const ruleSat = Math.min(bgSat * 0.7, 8); // Very subtle
  const ruleLight = bgLight + 5 + Math.random() * 10;
  const ruleColor = hslToHex(ruleHue, ruleSat, ruleLight);

  const gutterHue = bgHue + (Math.random() - 0.5) * 8;
  const gutterSat = Math.min(bgSat * 1.1, 12); // Slightly more but capped
  const gutterLight = bgLight + 3 + Math.random() * 7;
  const gutterColor = hslToHex(gutterHue, gutterSat, gutterLight);

  // 🎭 ROLE COLOR - Dynamic with complementary gradient
  const roleHue = accentHue + (Math.random() - 0.5) * 30; // Related to accent but varied
  const roleSat = 70 + Math.random() * 30; // Vibrant saturation
  const roleLight = 55 + Math.random() * 20; // Medium brightness
  const roleColor = hslToHex(roleHue, roleSat, roleLight);

  // 🎨 COMPLEMENTARY COLOR - True color wheel complement
  const complementaryHue = (roleHue + 180) % 360; // 180 degrees opposite on color wheel
  const complementarySat = roleSat * (0.8 + Math.random() * 0.4); // Similar saturation with variation
  const complementaryLight = roleLight + (Math.random() - 0.5) * 20; // Similar brightness with variation
  const complementaryColor = hslToHex(complementaryHue, complementarySat, complementaryLight);

  // ✅ Validate contrast ratios - relaxed for more variety
  const fgContrast = getContrastRatio(fgColor, bgColor);
  const mutedContrast = getContrastRatio(mutedColor, bgColor);
  const accentContrast = getContrastRatio(accentColor, bgColor);

  console.log(`Contrast: FG=${fgContrast.toFixed(1)}, Muted=${mutedContrast.toFixed(1)}, Accent=${accentContrast.toFixed(1)}`);

  // Professional themes with good enough contrast (WCAG AA standard)
  if (fgContrast < 4.5 || mutedContrast < 3.0 || accentContrast < 3.0) {
    if (!generateSmartTheme.attempts) generateSmartTheme.attempts = 0;
    generateSmartTheme.attempts++;

    if (generateSmartTheme.attempts < 10) {
      console.log(`Regenerating... attempt ${generateSmartTheme.attempts}`);
      return generateSmartTheme();
    } else {
      console.log('Max attempts reached, using current theme');
      generateSmartTheme.attempts = 0;
    }
  } else {
    generateSmartTheme.attempts = 0;
  }

  return {
    bg: bgColor, fg: fgColor, muted: mutedColor, accent: accentColor,
    link: linkColor, chip: chipColor, rule: ruleColor, gutter: gutterColor,
    role: roleColor, complementary: complementaryColor
  };
}
