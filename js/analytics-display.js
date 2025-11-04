// Analytics Display Functions for Admin Page
let analyticsCharts = {};

// Initialize analytics display
function initAnalyticsDisplay() {
  if (!document.getElementById('analytics-container')) {
    return; // Analytics section not on this page
  }

  loadAnalyticsData();
  setupTimeframeFilters();
}

// Load and display analytics data
function loadAnalyticsData(timeframe = 'all') {
  const stats = getAnalyticsStats(timeframe);
  
  // Update summary cards
  updateSummaryCards(stats);
  
  // Render charts
  renderCharts(stats, timeframe);
  
  // Update top pages and referrers
  updateTopPages(stats.topPages);
  updateTopReferrers(stats.topReferrers);
  
  // Update top countries
  updateTopCountries(stats.topCountries);
  
  // Update top sources
  updateTopSources(stats.topSources);
  
  // Update top campaigns
  updateTopCampaigns(stats.topCampaigns);
  
  // Update recent visits
  updateRecentVisits(stats.allVisits);
}

// Update summary cards
function updateSummaryCards(stats) {
  const totalVisitsEl = document.getElementById('total-visits');
  const uniqueVisitorsEl = document.getElementById('unique-visitors');
  const avgPerDayEl = document.getElementById('avg-per-day');
  const emailVisitsEl = document.getElementById('email-visits');
  const socialVisitsEl = document.getElementById('social-visits');
  const searchVisitsEl = document.getElementById('search-visits');
  
  if (totalVisitsEl) totalVisitsEl.textContent = stats.totalVisits.toLocaleString();
  if (uniqueVisitorsEl) uniqueVisitorsEl.textContent = stats.uniqueVisitors.toLocaleString();
  
  // Calculate average per day
  const days = Object.keys(stats.dailyData).length || 1;
  const avgPerDay = (stats.totalVisits / days).toFixed(1);
  if (avgPerDayEl) avgPerDayEl.textContent = avgPerDay;
  
  // Source statistics
  if (emailVisitsEl) emailVisitsEl.textContent = (stats.emailVisits || 0).toLocaleString();
  if (socialVisitsEl) socialVisitsEl.textContent = (stats.socialVisits || 0).toLocaleString();
  if (searchVisitsEl) searchVisitsEl.textContent = (stats.searchVisits || 0).toLocaleString();
}

// Setup timeframe filter buttons
function setupTimeframeFilters() {
  const buttons = document.querySelectorAll('.timeframe-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      buttons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Load data for selected timeframe
      const timeframe = this.getAttribute('data-timeframe');
      loadAnalyticsData(timeframe);
    });
  });
}

// Render all charts
function renderCharts(stats, timeframe) {
  renderDailyChart(stats.dailyData, timeframe);
  renderWeeklyChart(stats.weeklyData);
  renderHourlyChart(stats.hourlyData);
  renderReferrersChart(stats.referrers);
  renderCountriesChart(stats.countries);
  renderSourcesChart(stats.sourceCategories);
}

// Get CSS variable value
function getCSSVariable(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Render daily visits chart
function renderDailyChart(dailyData, timeframe) {
  const ctx = document.getElementById('daily-chart');
  if (!ctx) return;

  // Sort dates
  const sortedDates = Object.keys(dailyData).sort();
  const labels = sortedDates.map(date => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const data = sortedDates.map(date => dailyData[date]);

  // Destroy existing chart if it exists
  if (analyticsCharts.daily) {
    analyticsCharts.daily.destroy();
  }

  const accentColor = getCSSVariable('--accent') || '#ff6600';
  const mutedColor = getCSSVariable('--muted') || '#b3b3b3';
  const ruleColor = getCSSVariable('--rule') || '#404040';
  
  // Convert hex to rgba with transparency
  function hexToRgba(hex, alpha) {
    // Handle rgb() format
    if (hex.startsWith('rgb')) {
      return hex.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
    }
    // Handle hex format
    if (hex.startsWith('#')) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    // Fallback
    return `rgba(255, 102, 0, ${alpha})`;
  }
  const accentBg = hexToRgba(accentColor, 0.1);

  analyticsCharts.daily = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Visits',
        data: data,
        borderColor: accentColor,
        backgroundColor: accentBg,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: mutedColor
          },
          grid: {
            color: ruleColor
          }
        },
        x: {
          ticks: {
            color: mutedColor
          },
          grid: {
            color: ruleColor
          }
        }
      }
    }
  });
}

// Render weekly visits chart
function renderWeeklyChart(weeklyData) {
  const ctx = document.getElementById('weekly-chart');
  if (!ctx) return;

  const sortedWeeks = Object.keys(weeklyData).sort();
  const labels = sortedWeeks;
  const data = sortedWeeks.map(week => weeklyData[week]);

  if (analyticsCharts.weekly) {
    analyticsCharts.weekly.destroy();
  }

  const accentColor = getCSSVariable('--accent') || '#ff6600';
  const mutedColor = getCSSVariable('--muted') || '#b3b3b3';
  const ruleColor = getCSSVariable('--rule') || '#404040';

  analyticsCharts.weekly = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Visits',
        data: data,
        backgroundColor: accentColor,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: mutedColor
          },
          grid: {
            color: ruleColor
          }
        },
        x: {
          ticks: {
            color: mutedColor
          },
          grid: {
            color: ruleColor
          }
        }
      }
    }
  });
}

// Render hourly visits chart
function renderHourlyChart(hourlyData) {
  const ctx = document.getElementById('hourly-chart');
  if (!ctx) return;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const labels = hours.map(h => `${h.toString().padStart(2, '0')}:00`);
  const data = hours.map(h => hourlyData[h] || 0);

  if (analyticsCharts.hourly) {
    analyticsCharts.hourly.destroy();
  }

  const linkColor = getCSSVariable('--link') || '#ffaa00';
  const mutedColor = getCSSVariable('--muted') || '#b3b3b3';
  const ruleColor = getCSSVariable('--rule') || '#404040';

  analyticsCharts.hourly = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Visits',
        data: data,
        backgroundColor: linkColor,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: mutedColor
          },
          grid: {
            color: ruleColor
          }
        },
        x: {
          ticks: {
            color: mutedColor
          },
          grid: {
            color: ruleColor
          }
        }
      }
    }
  });
}

// Render countries chart
function renderCountriesChart(countries) {
  const ctx = document.getElementById('countries-chart');
  if (!ctx) return;

  const sorted = Object.entries(countries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const labels = sorted.map(([country]) => country);
  const data = sorted.map(([, count]) => count);

  if (analyticsCharts.countries) {
    analyticsCharts.countries.destroy();
  }

  const accentColor = getCSSVariable('--accent') || '#ff6600';
  const linkColor = getCSSVariable('--link') || '#ffaa00';
  const roleColor = getCSSVariable('--role') || '#35dacc';
  const fgColor = getCSSVariable('--fg') || '#e6e6e6';

  analyticsCharts.countries = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Visits',
        data: data,
        backgroundColor: [
          accentColor,
          linkColor,
          roleColor,
          '#ff8c42',
          '#ffb366',
          '#ffcc99',
          '#ffe6cc',
          '#cc5500',
          '#993300',
          '#661100'
        ],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: getCSSVariable('--muted') || '#b3b3b3'
          },
          grid: {
            color: getCSSVariable('--rule') || '#404040'
          }
        },
        x: {
          ticks: {
            color: getCSSVariable('--muted') || '#b3b3b3'
          },
          grid: {
            color: getCSSVariable('--rule') || '#404040'
          }
        }
      }
    }
  });
}

// Render referrers chart
function renderReferrersChart(referrers) {
  const ctx = document.getElementById('referrers-chart');
  if (!ctx) return;

  const sorted = Object.entries(referrers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const labels = sorted.map(([ref]) => ref);
  const data = sorted.map(([, count]) => count);

  if (analyticsCharts.referrers) {
    analyticsCharts.referrers.destroy();
  }

  const accentColor = getCSSVariable('--accent') || '#ff6600';
  const linkColor = getCSSVariable('--link') || '#ffaa00';
  const roleColor = getCSSVariable('--role') || '#35dacc';
  const fgColor = getCSSVariable('--fg') || '#e6e6e6';

  analyticsCharts.referrers = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          accentColor,
          linkColor,
          roleColor,
          '#ff8c42',
          '#ffb366',
          '#ffcc99',
          '#ffe6cc',
          '#cc5500',
          '#993300',
          '#661100'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: fgColor,
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

// Update top pages list
function updateTopPages(topPages) {
  const container = document.getElementById('top-pages-list');
  if (!container) return;

  if (topPages.length === 0) {
    container.innerHTML = '<p style="opacity: 0.5; padding-left: 20px;">No page views yet.</p>';
    return;
  }

  container.innerHTML = topPages.map((item, index) => `
    <div class="analytics-list-item">
      <span class="analytics-rank">${index + 1}</span>
      <span class="analytics-page">${escapeHtml(item.page)}</span>
      <span class="analytics-count">${item.count.toLocaleString()}</span>
    </div>
  `).join('');
}

// Update top referrers list
function updateTopReferrers(topReferrers) {
  const container = document.getElementById('top-referrers-list');
  if (!container) return;

  if (topReferrers.length === 0) {
    container.innerHTML = '<p style="opacity: 0.5; padding-left: 20px;">No referrers yet.</p>';
    return;
  }

  container.innerHTML = topReferrers.map((item, index) => `
    <div class="analytics-list-item">
      <span class="analytics-rank">${index + 1}</span>
      <span class="analytics-referrer">${escapeHtml(item.referrer)}</span>
      <span class="analytics-count">${item.count.toLocaleString()}</span>
    </div>
  `).join('');
}

// Update top countries list
function updateTopCountries(topCountries) {
  const container = document.getElementById('top-countries-list');
  if (!container) return;

  if (topCountries.length === 0) {
    container.innerHTML = '<p style="opacity: 0.5; padding-left: 20px;">No country data yet.</p>';
    return;
  }

  container.innerHTML = topCountries.map((item, index) => `
    <div class="analytics-list-item">
      <span class="analytics-rank">${index + 1}</span>
      <span class="analytics-country">${escapeHtml(item.country)}</span>
      <span class="analytics-count">${item.count.toLocaleString()}</span>
    </div>
  `).join('');
}

// Update top sources list
function updateTopSources(topSources) {
  const container = document.getElementById('top-sources-list');
  if (!container) return;

  if (topSources.length === 0) {
    container.innerHTML = '<p style="opacity: 0.5; padding-left: 20px;">No source data yet.</p>';
    return;
  }

  container.innerHTML = topSources.map((item, index) => `
    <div class="analytics-list-item">
      <span class="analytics-rank">${index + 1}</span>
      <span class="analytics-source">${escapeHtml(item.source)}</span>
      <span class="analytics-count">${item.count.toLocaleString()}</span>
    </div>
  `).join('');
}

// Update top campaigns list
function updateTopCampaigns(topCampaigns) {
  const container = document.getElementById('top-campaigns-list');
  if (!container) return;

  if (topCampaigns.length === 0) {
    container.innerHTML = '<p style="opacity: 0.5; padding-left: 20px;">No campaigns yet.</p>';
    return;
  }

  container.innerHTML = topCampaigns.map((item, index) => `
    <div class="analytics-list-item">
      <span class="analytics-rank">${index + 1}</span>
      <span class="analytics-campaign">${escapeHtml(item.campaign)}</span>
      <span class="analytics-count">${item.count.toLocaleString()}</span>
    </div>
  `).join('');
}

// Render sources chart (source categories)
function renderSourcesChart(sourceCategories) {
  const ctx = document.getElementById('sources-chart');
  if (!ctx) return;

  const sorted = Object.entries(sourceCategories)
    .sort((a, b) => b[1] - a[1]);
  
  const labels = sorted.map(([category]) => category.charAt(0).toUpperCase() + category.slice(1));
  const data = sorted.map(([, count]) => count);

  if (analyticsCharts.sources) {
    analyticsCharts.sources.destroy();
  }

  const accentColor = getCSSVariable('--accent') || '#ff6600';
  const linkColor = getCSSVariable('--link') || '#ffaa00';
  const roleColor = getCSSVariable('--role') || '#35dacc';
  const mutedColor = getCSSVariable('--muted') || '#b3b3b3';
  const ruleColor = getCSSVariable('--rule') || '#404040';

  analyticsCharts.sources = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          accentColor,
          linkColor,
          roleColor,
          '#ff8c42',
          '#ffb366',
          '#ffcc99',
          '#ffe6cc'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: getCSSVariable('--fg') || '#e6e6e6',
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

// Update recent visits list
function updateRecentVisits(visits) {
  const container = document.getElementById('recent-visits-list');
  if (!container) return;

  // Get most recent 20 visits
  const recent = visits
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20);

  if (recent.length === 0) {
    container.innerHTML = '<p style="opacity: 0.5; padding-left: 20px;">No visits yet.</p>';
    return;
  }

  container.innerHTML = recent.map(visit => {
    let sourceBadge = '';
    if (visit.isEmail) {
      sourceBadge = '<span class="source-badge email-badge">📧 Email</span>';
    } else if (visit.isSocial) {
      sourceBadge = '<span class="source-badge social-badge">📱 Social</span>';
    } else if (visit.isSearch) {
      sourceBadge = '<span class="source-badge search-badge">🔍 Search</span>';
    }
    
    const sourceInfo = visit.sourceName ? `<span class="visit-source">From: ${escapeHtml(visit.sourceName)}</span>` : '';
    const campaignInfo = visit.utmCampaign ? `<span class="visit-campaign">Campaign: ${escapeHtml(visit.utmCampaign)}</span>` : '';
    
    return `
    <div class="analytics-visit-item">
      <div class="visit-info">
        <span class="visit-page">${escapeHtml(visit.page)}</span>
        <span class="visit-time">${formatDateForDisplay(visit.timestamp)}</span>
        ${sourceBadge}
      </div>
      <div class="visit-meta">
        ${visit.ip ? `<span class="visit-ip">IP: ${escapeHtml(visit.ip)}</span>` : ''}
        ${visit.country ? `<span class="visit-country">${escapeHtml(visit.country)}${visit.city ? `, ${escapeHtml(visit.city)}` : ''}</span>` : ''}
        ${sourceInfo}
        ${campaignInfo}
        <span class="visit-referrer">${escapeHtml(visit.referrer === 'direct' ? 'Direct' : extractDomain(visit.referrer))}</span>
        <span class="visit-device">${getDeviceInfo(visit.userAgent)}</span>
      </div>
    </div>
  `;
  }).join('');
}

// Get device info from user agent
function getDeviceInfo(userAgent) {
  if (!userAgent) return 'Unknown';
  
  if (/mobile|android|iphone|ipad/i.test(userAgent)) {
    return 'Mobile';
  } else if (/tablet|ipad/i.test(userAgent)) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
}

// Export analytics data
function exportAnalyticsData() {
  const visits = getVisits();
  const dataStr = JSON.stringify(visits, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// Clear analytics data
function clearAnalyticsData() {
  if (!confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
    return;
  }
  
  localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  loadAnalyticsData();
  if (typeof showMessage === 'function') {
    showMessage('Analytics data cleared successfully!', 'success');
  }
}

// Make functions globally accessible
window.exportAnalyticsData = exportAnalyticsData;
window.clearAnalyticsData = clearAnalyticsData;

// Initialize analytics display when admin page loads
function setupAnalyticsInitialization() {
  // Check if we're on admin page and authenticated
  if (document.getElementById('analytics-container')) {
    // Check if already authenticated
    if (typeof isAuthenticated === 'function' && isAuthenticated()) {
      // Already authenticated, initialize now
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          setTimeout(initAnalyticsDisplay, 200);
        });
      } else {
        setTimeout(initAnalyticsDisplay, 200);
      }
    } else {
      // Wait for authentication
      const checkAuth = setInterval(() => {
        if (typeof isAuthenticated === 'function' && isAuthenticated()) {
          clearInterval(checkAuth);
          setTimeout(initAnalyticsDisplay, 200);
        }
      }, 100);
      
      // Stop checking after 10 seconds
      setTimeout(() => clearInterval(checkAuth), 10000);
    }
  }
}

// Setup initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupAnalyticsInitialization);
} else {
  setupAnalyticsInitialization();
}

