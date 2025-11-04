// Visitor Tracking and Analytics System
const ANALYTICS_STORAGE_KEY = 'hugo_analytics_data';
const VISITOR_SESSION_KEY = 'hugo_visitor_session';
const MAX_DAYS_TO_KEEP = 90; // Keep data for 90 days

// Initialize analytics tracking
function initAnalytics() {
  // Don't track admin page visits
  if (window.location.pathname.includes('admin.html')) {
    return;
  }

  trackVisit();
}

// Track a visit
async function trackVisit() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Parse UTM parameters (Google Analytics standard)
  const utmSource = urlParams.get('utm_source') || null;
  const utmMedium = urlParams.get('utm_medium') || null;
  const utmCampaign = urlParams.get('utm_campaign') || null;
  const utmTerm = urlParams.get('utm_term') || null;
  const utmContent = urlParams.get('utm_content') || null;
  
  // Detect traffic source
  const sourceInfo = detectTrafficSource(document.referrer, utmSource, utmMedium);
  
  const visit = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    page: window.location.pathname + window.location.search,
    referrer: document.referrer || 'direct',
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    sessionId: getOrCreateSessionId(),
    ip: null,
    country: null,
    countryCode: null,
    city: null,
    region: null,
    // UTM tracking parameters
    utmSource: utmSource,
    utmMedium: utmMedium,
    utmCampaign: utmCampaign,
    utmTerm: utmTerm,
    utmContent: utmContent,
    // Detected source information
    sourceType: sourceInfo.type, // 'email', 'social', 'search', 'direct', 'referral', 'unknown'
    sourceName: sourceInfo.name, // e.g., 'Gmail', 'Facebook', 'Google', etc.
    sourceCategory: sourceInfo.category, // 'email', 'social', 'search', 'direct', 'referral'
    isEmail: sourceInfo.isEmail,
    isSocial: sourceInfo.isSocial,
    isSearch: sourceInfo.isSearch
  };

  // Fetch IP and location data (non-blocking)
  try {
    const locationData = await fetchVisitorLocation();
    if (locationData) {
      visit.ip = locationData.ip || null;
      visit.country = locationData.country || null;
      visit.countryCode = locationData.countryCode || null;
      visit.city = locationData.city || null;
      visit.region = locationData.region || null;
    }
  } catch (error) {
    console.warn('Could not fetch visitor location:', error);
    // Continue without location data
  }

  saveVisit(visit);
}

// Detect traffic source from referrer and UTM parameters
function detectTrafficSource(referrer, utmSource, utmMedium) {
  const result = {
    type: 'unknown',
    name: 'Unknown',
    category: 'referral',
    isEmail: false,
    isSocial: false,
    isSearch: false
  };

  // Check UTM parameters first (most reliable)
  if (utmMedium) {
    if (utmMedium.toLowerCase() === 'email') {
      result.type = 'email';
      result.category = 'email';
      result.isEmail = true;
      result.name = utmSource || 'Email';
      return result;
    }
    if (utmMedium.toLowerCase().includes('social') || utmMedium.toLowerCase().includes('social-media')) {
      result.type = 'social';
      result.category = 'social';
      result.isSocial = true;
      result.name = utmSource || 'Social Media';
      return result;
    }
    if (utmMedium.toLowerCase() === 'cpc' || utmMedium.toLowerCase() === 'paid') {
      result.type = 'paid';
      result.category = 'paid';
      result.name = utmSource || 'Paid Ad';
      return result;
    }
  }

  // If no referrer, it's direct traffic
  if (!referrer || referrer === '') {
    result.type = 'direct';
    result.category = 'direct';
    result.name = 'Direct';
    return result;
  }

  try {
    const referrerUrl = new URL(referrer);
    const referrerDomain = referrerUrl.hostname.toLowerCase();
    const referrerPath = referrerUrl.pathname.toLowerCase();

    // Email client detection
    const emailDomains = [
      'mail.google.com', 'gmail.com',
      'outlook.com', 'outlook.live.com', 'hotmail.com', 'live.com',
      'yahoo.com', 'mail.yahoo.com',
      'icloud.com', 'mail.icloud.com',
      'protonmail.com', 'proton.me',
      'aol.com', 'mail.aol.com',
      'zoho.com', 'mail.zoho.com',
      'gmx.com', 'mail.gmx.com',
      'yandex.com', 'mail.yandex.com'
    ];

    if (emailDomains.some(domain => referrerDomain.includes(domain))) {
      result.type = 'email';
      result.category = 'email';
      result.isEmail = true;
      result.name = extractEmailClientName(referrerDomain);
      return result;
    }

    // Social media detection
    const socialPlatforms = {
      'facebook.com': 'Facebook',
      'fb.com': 'Facebook',
      'twitter.com': 'Twitter',
      'x.com': 'Twitter/X',
      'instagram.com': 'Instagram',
      'linkedin.com': 'LinkedIn',
      'pinterest.com': 'Pinterest',
      'reddit.com': 'Reddit',
      'tiktok.com': 'TikTok',
      'youtube.com': 'YouTube',
      'vimeo.com': 'Vimeo',
      'tumblr.com': 'Tumblr',
      'snapchat.com': 'Snapchat',
      'whatsapp.com': 'WhatsApp',
      'telegram.org': 'Telegram',
      'discord.com': 'Discord',
      'messenger.com': 'Facebook Messenger'
    };

    for (const [domain, name] of Object.entries(socialPlatforms)) {
      if (referrerDomain.includes(domain)) {
        result.type = 'social';
        result.category = 'social';
        result.isSocial = true;
        result.name = name;
        return result;
      }
    }

    // Search engine detection
    const searchEngines = {
      'google.com': 'Google',
      'google.': 'Google',
      'bing.com': 'Bing',
      'yahoo.com': 'Yahoo',
      'duckduckgo.com': 'DuckDuckGo',
      'baidu.com': 'Baidu',
      'yandex.com': 'Yandex',
      'ecosia.org': 'Ecosia',
      'startpage.com': 'Startpage'
    };

    for (const [domain, name] of Object.entries(searchEngines)) {
      if (referrerDomain.includes(domain)) {
        result.type = 'search';
        result.category = 'search';
        result.isSearch = true;
        result.name = name;
        return result;
      }
    }

    // Known referral site
    result.type = 'referral';
    result.category = 'referral';
    result.name = referrerDomain.replace('www.', '');
    return result;

  } catch (e) {
    // Invalid referrer URL
    result.type = 'direct';
    result.category = 'direct';
    result.name = 'Direct';
    return result;
  }
}

// Extract email client name from domain
function extractEmailClientName(domain) {
  if (domain.includes('gmail') || domain.includes('google')) return 'Gmail';
  if (domain.includes('outlook') || domain.includes('hotmail') || domain.includes('live')) return 'Outlook';
  if (domain.includes('yahoo')) return 'Yahoo Mail';
  if (domain.includes('icloud')) return 'iCloud Mail';
  if (domain.includes('proton')) return 'ProtonMail';
  if (domain.includes('aol')) return 'AOL Mail';
  if (domain.includes('zoho')) return 'Zoho Mail';
  if (domain.includes('gmx')) return 'GMX';
  if (domain.includes('yandex')) return 'Yandex Mail';
  return 'Email';
}

// Fetch visitor IP and location data
async function fetchVisitorLocation() {
  try {
    // Using ipapi.co free API (no API key required for basic usage)
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Location API failed');
    }

    const data = await response.json();
    
    return {
      ip: data.ip || null,
      country: data.country_name || null,
      countryCode: data.country_code || null,
      city: data.city || null,
      region: data.region || null
    };
  } catch (error) {
    // Fallback to alternative API
    try {
      const fallbackResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await fallbackResponse.json();
      
      // Try to get country from ip-api.com
      const geoResponse = await fetch(`https://ip-api.com/json/${ipData.ip}?fields=status,message,country,countryCode,city,regionName`);
      const geoData = await geoResponse.json();
      
      if (geoData.status === 'success') {
        return {
          ip: ipData.ip || null,
          country: geoData.country || null,
          countryCode: geoData.countryCode || null,
          city: geoData.city || null,
          region: geoData.regionName || null
        };
      }
    } catch (fallbackError) {
      console.warn('Fallback location API also failed:', fallbackError);
    }
    
    return null;
  }
}

// Get or create session ID
function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem(VISITOR_SESSION_KEY);
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem(VISITOR_SESSION_KEY, sessionId);
  }
  return sessionId;
}

// Save visit to localStorage
function saveVisit(visit) {
  try {
    let visits = getVisits();
    
    // Add new visit
    visits.push(visit);
    
    // Clean old data (older than MAX_DAYS_TO_KEEP)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - MAX_DAYS_TO_KEEP);
    visits = visits.filter(v => new Date(v.timestamp) >= cutoffDate);
    
    // Check storage size
    const dataString = JSON.stringify(visits);
    const sizeInMB = new Blob([dataString]).size / (1024 * 1024);
    
    if (sizeInMB > 4) {
      // If too large, keep only most recent 60 days
      const recentCutoff = new Date();
      recentCutoff.setDate(recentCutoff.getDate() - 60);
      visits = visits.filter(v => new Date(v.timestamp) >= recentCutoff);
    }
    
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(visits));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('Analytics storage quota exceeded. Cleaning old data...');
      // Remove oldest 50% of data
      let visits = getVisits();
      visits = visits.slice(Math.floor(visits.length / 2));
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(visits));
      // Try saving again
      try {
        visits.push(visit);
        localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(visits));
      } catch (e) {
        console.error('Failed to save analytics data:', e);
      }
    } else {
      console.error('Error saving analytics data:', error);
    }
  }
}

// Get all visits
function getVisits() {
  const visitsJson = localStorage.getItem(ANALYTICS_STORAGE_KEY);
  if (!visitsJson) return [];
  try {
    return JSON.parse(visitsJson);
  } catch (e) {
    console.error('Error parsing analytics data:', e);
    return [];
  }
}

// Get analytics statistics
function getAnalyticsStats(timeframe = 'all') {
  const visits = getVisits();
  if (visits.length === 0) {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      uniqueSessions: 0,
      pageViews: {},
      referrers: {},
      hourlyData: {},
      dailyData: {},
      weeklyData: {},
      topPages: [],
      topReferrers: []
    };
  }

  let filteredVisits = visits;
  const now = new Date();

  // Filter by timeframe
  if (timeframe === 'today') {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    filteredVisits = visits.filter(v => new Date(v.timestamp) >= today);
  } else if (timeframe === 'week') {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    filteredVisits = visits.filter(v => new Date(v.timestamp) >= weekAgo);
  } else if (timeframe === 'month') {
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    filteredVisits = visits.filter(v => new Date(v.timestamp) >= monthAgo);
  }

  // Calculate statistics
  const uniqueSessions = new Set(filteredVisits.map(v => v.sessionId)).size;
  const pageViews = {};
  const referrers = {};
  const hourlyData = {};
  const dailyData = {};
  const weeklyData = {};
  const countries = {};
  const ips = {};
  const sources = {}; // Traffic sources (email, social, search, etc.)
  const sourceCategories = {}; // Source categories
  const campaigns = {}; // UTM campaigns
  const mediums = {}; // UTM mediums

  filteredVisits.forEach(visit => {
    const date = new Date(visit.timestamp);
    
    // Page views
    const page = visit.page || '/';
    pageViews[page] = (pageViews[page] || 0) + 1;
    
    // Referrers
    const referrer = visit.referrer === 'direct' ? 'Direct' : extractDomain(visit.referrer);
    referrers[referrer] = (referrers[referrer] || 0) + 1;
    
    // Traffic sources
    const sourceName = visit.sourceName || visit.utmSource || 'Unknown';
    sources[sourceName] = (sources[sourceName] || 0) + 1;
    
    // Source categories
    const category = visit.sourceCategory || 'direct';
    sourceCategories[category] = (sourceCategories[category] || 0) + 1;
    
    // Campaigns
    if (visit.utmCampaign) {
      campaigns[visit.utmCampaign] = (campaigns[visit.utmCampaign] || 0) + 1;
    }
    
    // Mediums
    if (visit.utmMedium) {
      mediums[visit.utmMedium] = (mediums[visit.utmMedium] || 0) + 1;
    }
    
    // Countries
    if (visit.country) {
      const countryKey = visit.country;
      countries[countryKey] = (countries[countryKey] || 0) + 1;
    }
    
    // IP addresses (for unique visitor tracking)
    if (visit.ip) {
      ips[visit.ip] = (ips[visit.ip] || 0) + 1;
    }
    
    // Hourly data
    const hour = date.getHours();
    hourlyData[hour] = (hourlyData[hour] || 0) + 1;
    
    // Daily data
    const dayKey = date.toISOString().split('T')[0];
    dailyData[dayKey] = (dailyData[dayKey] || 0) + 1;
    
    // Weekly data
    const weekKey = getWeekKey(date);
    weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
  });

  // Get top pages
  const topPages = Object.entries(pageViews)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }));

  // Get top referrers
  const topReferrers = Object.entries(referrers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([referrer, count]) => ({ referrer, count }));

  // Get top countries
  const topCountries = Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));

  // Get top sources
  const topSources = Object.entries(sources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([source, count]) => ({ source, count }));

  // Get top campaigns
  const topCampaigns = Object.entries(campaigns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([campaign, count]) => ({ campaign, count }));

  // Count unique IPs
  const uniqueIPs = Object.keys(ips).length;

  // Count email visits
  const emailVisits = filteredVisits.filter(v => v.isEmail).length;
  const socialVisits = filteredVisits.filter(v => v.isSocial).length;
  const searchVisits = filteredVisits.filter(v => v.isSearch).length;

  return {
    totalVisits: filteredVisits.length,
    uniqueVisitors: uniqueIPs > 0 ? uniqueIPs : uniqueSessions, // Use IPs if available, else sessions
    uniqueSessions: uniqueSessions,
    uniqueIPs: uniqueIPs,
    emailVisits: emailVisits,
    socialVisits: socialVisits,
    searchVisits: searchVisits,
    pageViews,
    referrers,
    countries,
    sources,
    sourceCategories,
    campaigns,
    mediums,
    hourlyData,
    dailyData,
    weeklyData,
    topPages,
    topReferrers,
    topCountries,
    topSources,
    topCampaigns,
    allVisits: filteredVisits
  };
}

// Extract domain from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return 'Unknown';
  }
}

// Get week key (year-week format)
function getWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
}

// Format date for display
function formatDateForDisplay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Initialize analytics when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
  initAnalytics();
}

