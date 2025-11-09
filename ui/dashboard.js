/**
 * Elite XSS Framework v8.0 - Professional Dashboard
 * Modern, responsive UI for complete testing control
 */

(function(exports, FRAMEWORK, GM_getValue, GM_setValue, GM_deleteValue, GM_notification, unsafeWindow) {
  'use strict';

  const Dashboard = {
    container: null,
    isVisible: false,
    isMinimized: false,
    updateInterval: null,
    animationFrame: null,

    /**
     * Initialize the dashboard
     */
    init: async () => {
      console.log('[Dashboard] Initializing...');
      
      // Create dashboard container
      Dashboard.createContainer();
      
      // Render initial UI
      Dashboard.render();
      
      // Attach event listeners
      Dashboard.attachEventListeners();
      
      // Start update loop
      Dashboard.startUpdateLoop();
      
      // Register for engine events
      Dashboard.registerEngineEvents();
      
      console.log('[Dashboard] Initialized successfully');
      
      return { success: true };
    },

    /**
     * Create the dashboard container
     */
    createContainer: () => {
      Dashboard.container = document.createElement('div');
      Dashboard.container.id = 'elite-dashboard';
      Dashboard.container.className = 'elite-dashboard';
      
      document.body?.appendChild(Dashboard.container);
    },

    /**
     * Render the complete dashboard UI
     */
    render: () => {
      const engineState = unsafeWindow.EliteEngine?.getState() || {
        running: false,
        testsExecuted: 0,
        vulnerabilitiesFound: 0,
        metrics: {}
      };

      Dashboard.container.innerHTML = `
        <div class="dashboard-wrapper ${Dashboard.isMinimized ? 'minimized' : ''}">
          <!-- Header -->
          <div class="dashboard-header" id="dashboard-header">
            <div class="header-left">
              <div class="logo">
                <span class="logo-icon">🎯</span>
                <span class="logo-text">Elite XSS v8.0</span>
              </div>
              <div class="status-indicator ${engineState.running ? 'active' : 'idle'}">
                <span class="status-dot"></span>
                <span class="status-text">${engineState.running ? 'Active' : 'Ready'}</span>
              </div>
            </div>
            <div class="header-right">
              <button class="header-btn" id="btn-settings" title="Settings (Ctrl+Shift+S)">
                <span class="icon">⚙️</span>
              </button>
              <button class="header-btn" id="btn-results" title="Results (Ctrl+Shift+R)">
                <span class="icon">📊</span>
              </button>
              <button class="header-btn" id="btn-minimize" title="Minimize">
                <span class="icon">−</span>
              </button>
              <button class="header-btn danger" id="btn-close" title="Close">
                <span class="icon">✕</span>
              </button>
            </div>
          </div>

          <!-- Main Content -->
          <div class="dashboard-body">
            ${Dashboard.isMinimized ? '' : Dashboard.renderMainContent(engineState)}
          </div>

          <!-- Footer -->
          ${Dashboard.isMinimized ? '' : `
            <div class="dashboard-footer">
              <div class="footer-info">
                <span class="footer-text">Session: ${engineState.sessionId || 'N/A'}</span>
                <span class="footer-separator">•</span>
                <span class="footer-text">Build: ${FRAMEWORK.BUILD}</span>
              </div>
              <div class="footer-actions">
                <button class="footer-btn" id="btn-export">
                  <span class="icon">💾</span> Export
                </button>
                <button class="footer-btn" id="btn-help">
                  <span class="icon">❓</span> Help
                </button>
              </div>
            </div>
          `}
        </div>
      `;
    },

    /**
     * Render main content area
     */
    renderMainContent: (engineState) => {
      const { running, paused, testsExecuted, vulnerabilitiesFound, metrics } = engineState;
      const queueRemaining = engineState.testQueue?.length || 0;
      const totalTests = testsExecuted + queueRemaining;
      const progress = totalTests > 0 ? (testsExecuted / totalTests) * 100 : 0;

      if (!running) {
        return Dashboard.renderStartScreen();
      }

      return `
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">📍</div>
            <div class="stat-content">
              <div class="stat-label">Tests Executed</div>
              <div class="stat-value">${testsExecuted.toLocaleString()}</div>
              <div class="stat-sub">of ${totalTests.toLocaleString()} total</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon success">🎯</div>
            <div class="stat-content">
              <div class="stat-label">Vulnerabilities</div>
              <div class="stat-value success">${vulnerabilitiesFound}</div>
              <div class="stat-sub">${totalTests > 0 ? ((vulnerabilitiesFound/totalTests)*100).toFixed(2) : 0}% hit rate</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">⚡</div>
            <div class="stat-content">
              <div class="stat-label">Speed</div>
              <div class="stat-value">${(metrics.testsPerSecond || 0).toFixed(2)}</div>
              <div class="stat-sub">tests/sec</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">⏱️</div>
            <div class="stat-content">
              <div class="stat-label">Avg Time</div>
              <div class="stat-value">${(metrics.avgTestTime || 0).toFixed(0)}ms</div>
              <div class="stat-sub">per test</div>
            </div>
          </div>
        </div>

        <!-- Progress Section -->
        <div class="progress-section">
          <div class="progress-header">
            <span class="progress-label">Testing Progress</span>
            <span class="progress-percentage">${progress.toFixed(1)}%</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${progress}%">
              <div class="progress-shimmer"></div>
            </div>
          </div>
          <div class="progress-details">
            <span>${queueRemaining} tests remaining</span>
            <span>${Dashboard.formatDuration(Date.now() - engineState.startTime)} elapsed</span>
          </div>
        </div>

        <!-- Control Panel -->
        <div class="control-panel">
          <div class="control-group">
            <button class="control-btn ${paused ? '' : 'active'}" id="btn-pause" ${!running ? 'disabled' : ''}>
              <span class="icon">⏸</span>
              <span class="label">Pause</span>
            </button>
            <button class="control-btn ${paused ? 'active' : ''}" id="btn-resume" ${!running || !paused ? 'disabled' : ''}>
              <span class="icon">▶️</span>
              <span class="label">Resume</span>
            </button>
            <button class="control-btn danger" id="btn-stop" ${!running ? 'disabled' : ''}>
              <span class="icon">⏹</span>
              <span class="label">Stop</span>
            </button>
          </div>
        </div>

        <!-- Live Activity Feed -->
        <div class="activity-section">
          <div class="section-header">
            <h3 class="section-title">Live Activity</h3>
            <button class="section-action" id="btn-clear-activity">Clear</button>
          </div>
          <div class="activity-feed" id="activity-feed">
            ${Dashboard.renderActivityFeed()}
          </div>
        </div>

        <!-- Recent Vulnerabilities -->
        ${vulnerabilitiesFound > 0 ? `
          <div class="vulnerabilities-section">
            <div class="section-header">
              <h3 class="section-title">Recent Vulnerabilities</h3>
              <button class="section-action" id="btn-view-all">View All</button>
            </div>
            <div class="vulnerability-list" id="vulnerability-list">
              ${Dashboard.renderVulnerabilities()}
            </div>
          </div>
        ` : ''}
      `;
    },

    /**
     * Render start screen (when engine is not running)
     */
    renderStartScreen: () => {
      return `
        <div class="start-screen">
          <div class="start-icon">🚀</div>
          <h2 class="start-title">Ready to Start Testing</h2>
          <p class="start-description">
            Elite XSS Framework is initialized and ready. Configure your test parameters below and click Start to begin scanning for vulnerabilities.
          </p>

          <!-- Quick Config -->
          <div class="quick-config">
            <div class="config-section">
              <h3 class="config-title">Quick Configuration</h3>
              
              <div class="config-group">
                <label class="config-label">
                  <input type="checkbox" id="cfg-advanced" checked>
                  <span>Enable Advanced Techniques</span>
                </label>
                <label class="config-label">
                  <input type="checkbox" id="cfg-waf-bypass" checked>
                  <span>WAF Bypass Mode</span>
                </label>
                <label class="config-label">
                  <input type="checkbox" id="cfg-context-aware" checked>
                  <span>Context-Aware Testing</span>
                </label>
                <label class="config-label">
                  <input type="checkbox" id="cfg-mutation" checked>
                  <span>Mutation Fuzzing</span>
                </label>
              </div>

              <div class="config-slider">
                <label class="slider-label">
                  <span>Concurrent Tests</span>
                  <span id="concurrent-value">5</span>
                </label>
                <input type="range" min="1" max="20" value="5" class="slider" id="cfg-concurrent">
              </div>

              <div class="config-slider">
                <label class="slider-label">
                  <span>Test Delay (ms)</span>
                  <span id="delay-value">1000</span>
                </label>
                <input type="range" min="0" max="5000" step="100" value="1000" class="slider" id="cfg-delay">
              </div>
            </div>

            <!-- Test Profiles -->
            <div class="config-section">
              <h3 class="config-title">Test Profiles</h3>
              <div class="profile-grid">
                <button class="profile-btn" data-profile="quick">
                  <span class="profile-icon">⚡</span>
                  <span class="profile-name">Quick Scan</span>
                  <span class="profile-desc">Fast, essential tests</span>
                </button>
                <button class="profile-btn" data-profile="balanced">
                  <span class="profile-icon">⚖️</span>
                  <span class="profile-name">Balanced</span>
                  <span class="profile-desc">Speed + Coverage</span>
                </button>
                <button class="profile-btn" data-profile="deep">
                  <span class="profile-icon">🔬</span>
                  <span class="profile-name">Deep Scan</span>
                  <span class="profile-desc">Maximum coverage</span>
                </button>
                <button class="profile-btn" data-profile="stealth">
                  <span class="profile-icon">🥷</span>
                  <span class="profile-name">Stealth</span>
                  <span class="profile-desc">Slow, undetectable</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Start Button -->
          <div class="start-actions">
            <button class="btn-start" id="btn-start">
              <span class="btn-icon">🚀</span>
              <span class="btn-text">Start Testing</span>
            </button>
            <button class="btn-secondary" id="btn-advanced-config">
              <span class="btn-icon">⚙️</span>
              <span class="btn-text">Advanced Settings</span>
            </button>
          </div>

          <!-- Info Cards -->
          <div class="info-cards">
            <div class="info-card">
              <div class="info-icon">🌐</div>
              <div class="info-content">
                <div class="info-title">Current Domain</div>
                <div class="info-value">${window.location.hostname}</div>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon">🔍</div>
              <div class="info-content">
                <div class="info-title">Endpoint Discovery</div>
                <div class="info-value">Automatic</div>
              </div>
            </div>
            <div class="info-card">
              <div class="info-icon">💣</div>
              <div class="info-content">
                <div class="info-title">Payload Library</div>
                <div class="info-value">15,000+ vectors</div>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    /**
     * Render activity feed
     */
    renderActivityFeed: () => {
      const activities = Dashboard.getRecentActivities();
      
      if (activities.length === 0) {
        return '<div class="activity-empty">No recent activity</div>';
      }

      return activities.slice(0, 10).map(activity => `
        <div class="activity-item ${activity.type}">
          <div class="activity-icon">${activity.icon}</div>
          <div class="activity-content">
            <div class="activity-message">${activity.message}</div>
            <div class="activity-time">${Dashboard.formatTime(activity.timestamp)}</div>
          </div>
        </div>
      `).join('');
    },

    /**
     * Render vulnerabilities list
     */
    renderVulnerabilities: () => {
      const vulnerabilities = Dashboard.getRecentVulnerabilities();
      
      return vulnerabilities.slice(0, 5).map((vuln, idx) => `
        <div class="vulnerability-item">
          <div class="vuln-header">
            <div class="vuln-badge">XSS-${idx + 1}</div>
            <div class="vuln-severity ${vuln.severity}">${vuln.severity}</div>
          </div>
          <div class="vuln-endpoint">${vuln.endpoint.name} (${vuln.endpoint.type})</div>
          <div class="vuln-payload">${vuln.payload.substring(0, 60)}...</div>
          <div class="vuln-actions">
            <button class="vuln-action-