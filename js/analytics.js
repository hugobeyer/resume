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
function trackVisit() {
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
    sessionId: getOrCreateSessionId()
  };

  saveVisit(visit);
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

  filteredVisits.forEach(visit => {
    const date = new Date(visit.timestamp);
    
    // Page views
    const page = visit.page || '/';
    pageViews[page] = (pageViews[page] || 0) + 1;
    
    // Referrers
    const referrer = visit.referrer === 'direct' ? 'Direct' : extractDomain(visit.referrer);
    referrers[referrer] = (referrers[referrer] || 0) + 1;
    
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

  return {
    totalVisits: filteredVisits.length,
    uniqueVisitors: uniqueSessions, // Using sessions as proxy for unique visitors
    uniqueSessions: uniqueSessions,
    pageViews,
    referrers,
    hourlyData,
    dailyData,
    weeklyData,
    topPages,
    topReferrers,
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

