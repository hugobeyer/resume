// 🎮 Theme management
let currentThemeData = null;

function applyTheme(themeData) {
  // Apply to document root with !important to override CSS
  const root = document.documentElement;
  Object.keys(themeData).forEach(key => {
    root.style.setProperty(`--${key}`, themeData[key]);
  });
  currentThemeData = themeData;
  localStorage.setItem('themeData', JSON.stringify(themeData));
}

// 🔥 THEME SWITCHER WITH SASSY MESSAGES 🔥
const sassyMessages = [
  'dont you dare!',
  'ohhh you did!',
  'and AGAIN!',
  'you are indeed stubborn',
  'come on now!',
  'Stop it!',
  'really?',
  'ANOTHER one?',
  'you cant help yourself',
  'here we go again',
  'ok fine',
  'SERIOUSLY?',
  'wow',
  'alright alright',
  'one more time',
  'you love this dont you',
  'i see you',
  'AGAIN?!',
  'make up your mind',
  'this is the one right?',
  'nope try again',
  'getting warmer',
  'so close',
  'ah yes this one',
  'perfect... NOT',
  'keep going',
  'dont stop now',
  'youre on fire',
  'CLICK CLICK CLICK',
  'theme machine go brrr',
  'colors everywhere',
  'my eyes',
  'beautiful chaos',
  'chefs kiss',
  'immaculate',
  'wait go back',
  'no THIS one',
  'actually maybe not',
  'indecisive much?',
  'commitment issues',
  'just pick one already',
  'FINE',
  'whatever you say',
  'boss move',
  'bold choice',
  'interesting',
  'hmmmm',
  'questionable',
  'valid',
  'respectable',
  'i feel that',
  'mood',
  'big if true',
  'based',
  'no cap',
  'fr fr',
  'SHEESH',
  'go off',
  'slay',
  'ate and left no crumbs',
  'period',
  'OBSESSED',
  'iconic',
  'legendary',
  'godlike',
  'galaxy brain',
  'next level',
  '200 IQ',
  'built different',
  'just vibing',
  'living your best life',
  'main character energy',
  'unstoppable',
  'on a roll',
  'cant be stopped',
  'DANGER ZONE',
  'maximum overdrive',
  'FULL SEND',
  'no brakes',
  'pedal to the metal',
  'GOING NUCLEAR',
  'absolute madlad',
  'respect',
  'salute',
  'you win',
  'im done',
  'fine you broke me',
  'OKAY OKAY',
  'chill',
  'relax',
  'take a breath',
  'maybe stop?',
  'please?',
  'pretty please?',
  'im begging you',
  'HAVE MERCY',
  'spare me',
  'im just a humble algorithm',
  'doing my best here',
  'working overtime',
  'the grind never stops',
  'hustle culture',
  'sigma mindset',
  'youre unstoppable',
  'cant stop wont stop',
  'the button calls to you',
  'resistance is futile',
  'welcome to the dark side',
  'youre one of us now',
  'the clicking has begun',
  'no turning back',
  'commitment level: maximum',
  'youre all in',
  'the dice have been cast',
  'fate has spoken',
  'the prophecy unfolds',
  'you are the chosen one',
  'the button chose you',
  'destiny awaits',
  'your journey begins',
  'level up',
  'achievement unlocked',
  'new personal record',
  'youre on fire',
  'hot streak incoming',
  'lucky number seven',
  'the stars align',
  'cosmic convergence',
  'universal approval',
  'the matrix has you',
  'reality is bending',
  'physics be damned',
  'defying gravity',
  'breaking the laws',
  'rebel without a cause',
  'troublemaker extraordinaire',
  'professional button clicker',
  'certified theme enthusiast',
  'color theory expert',
  'design wizard',
  'UI sorcerer',
  'frontend magician',
  'code conjurer',
  'pixel perfect',
  'attention to detail',
  'quality assurance',
  'beta tester supreme',
  'user experience guru',
  'interaction designer',
  'behavioral psychologist',
  'human factors expert',
  'ergonomics champion',
  'usability ninja',
  'accessibility advocate',
  'inclusive design pioneer',
  'universal design master',
  'empathy engineer',
  'user-centered designer',
  'human-computer interaction',
  'cognitive load manager',
  'mental model mapper',
  'information architect',
  'content strategist',
  'communication designer',
  'visual storyteller',
  'brand experience creator',
  'customer journey mapper',
  'touchpoint optimizer',
  'conversion rate hacker',
  'growth hacker',
  'marketing technologist',
  'digital strategist',
  'social media sorcerer',
  'content creator',
  'storyteller supreme',
  'narrative architect',
  'experience curator',
  'cultural commentator',
  'trend forecaster',
  'future thinker',
  'innovation catalyst',
  'disruptive thinker',
  'change agent',
  'transformation leader',
  'strategic visionary',
  'business innovator',
  'market disruptor',
  'industry shaker',
  'paradigm shifter',
  'status quo breaker',
  'conventional wisdom challenger',
  'creative revolutionary',
  'artistic anarchist',
  'design rebel',
  'aesthetic revolutionary',
  'visual provocateur',
  'color revolutionary',
  'typography terrorist',
  'layout liberator',
  'grid breaker',
  'whitespace warrior',
  'negative space ninja',
  'contrast commander',
  'hierarchy hero',
  'balance master',
  'proportion prince',
  'scale sultan',
  'rhythm ruler',
  'pattern pioneer',
  'texture titan',
  'material master',
  'surface specialist',
  'finish fanatic',
  'detail demon',
  'precision perfectionist',
  'quality queen',
  'excellence emperor',
  'mastery monarch',
  'skill sovereign',
  'talent titan',
  'genius guru',
  'brilliance baron',
  'intelligence icon',
  'wisdom wizard',
  'knowledge knight',
  'learning lord',
  'curiosity champion',
  'discovery duke',
  'exploration earl',
  'adventure admiral',
  'quest captain',
  'journey general',
  'pathfinder prince',
  'trailblazer king'
];

// Reset click count on page load (doesn't persist)
let clickCount = 0;
let messageTimeout; // Store timeout ID to reset timing

window.switchTheme = function() {
  try {
    // Background color flash on click (subtle, slow)
    document.body.style.transition = 'none';
    const currentBg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    // Slightly lighter version of background
    document.body.style.backgroundColor = currentBg || '#1a1a1a';
    document.body.style.filter = 'brightness(1.3)';

    setTimeout(() => {
      document.body.style.transition = 'background-color 1.2s ease, color 1s ease, filter 1.5s ease-out';
      document.body.style.backgroundColor = '';
      document.body.style.filter = '';
    }, 100);

    const newTheme = generateSmartTheme();
    applyTheme(newTheme);

    // Show sassy message - first 6 in order, then random
    let message;
    if (clickCount < 8) {
      message = sassyMessages[clickCount];
    } else {
      message = sassyMessages[Math.floor(Math.random() * sassyMessages.length)];
    }

    // Display message after button with typewriter effect
    const msgElement = document.getElementById('sassyMsg');
    if (!msgElement) {
      console.warn('Sassy message element not found');
      return;
    }
    
    msgElement.classList.add('show');

    // Clear any existing timeout and reset timing
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }

    // Typewriter effect
    let charIndex = 0;
    msgElement.textContent = '';

    function typeWriter() {
      if (charIndex < message.length) {
        msgElement.textContent += message.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50 + Math.random() * 50); // Random typing speed
      } else {
        // Stop cursor blinking when typing is done
        msgElement.classList.add('done-typing');
        // Fade out after 3 seconds when typing is complete
        messageTimeout = setTimeout(() => {
          msgElement.classList.remove('show');
        }, 3000);
      }
    }

    typeWriter();

    clickCount++;

  } catch (error) {
    console.error('Theme generation failed:', error);
    applyTheme({
      bg: '#0f1419', fg: '#e2e8f0', muted: '#94a3b8', accent: '#60a5fa',
      link: '#3b82f6', chip: '#1e293b', rule: '#334155', gutter: '#1e293b', role: '#ffffff'
    });
  }
}
