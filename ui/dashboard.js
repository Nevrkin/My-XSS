/**
 * @file dashboard.js
 * @description Main UI Dashboard
 * @version 8.0.0
 */

(function() {
    'use strict';

    class Dashboard {
        constructor(framework) {
            this.framework = framework;
            this.isVisible = false;
            this.container = null;
            this.activeTab = 'scan';
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎨 Create Dashboard
        // ═══════════════════════════════════════════════════════════════
        create() {
            if (this.container) return;

            this.container = document.createElement('div');
            this.container.id = 'elite-xss-dashboard';
            this.container.innerHTML = this.getTemplate();
            
            document.body.appendChild(this.container);
            this.attachEventListeners();
            this.loadStyles();
        }

        getTemplate() {
            return `
                <div class="exss-panel">
                    <div class="exss-header">
                        <h1>🎯 Elite XSS Framework v8.0</h1>
                        <div class="exss-actions">
                            <button class="exss-btn exss-btn-minimize" data-action="minimize">−</button>
                            <button class="exss-btn exss-btn-close" data-action="close">×</button>
                        </div>
                    </div>
                    
                    <div class="exss-tabs">
                        <button class="exss-tab active" data-tab="scan">🔍 Scan</button>
                        <button class="exss-tab" data-tab="payloads">💣 Payloads</button>
                        <button class="exss-tab" data-tab="results">📊 Results</button>
                        <button class="exss-tab" data-tab="settings">⚙️ Settings</button>
                    </div>
                    
                    <div class="exss-content">
                        <div class="exss-tab-content active" data-content="scan">
                            ${this.getScanTabContent()}
                        </div>
                        <div class="exss-tab-content" data-content="payloads">
                            ${this.getPayloadsTabContent()}
                        </div>
                        <div class="exss-tab-content" data-content="results">
                            ${this.getResultsTabContent()}
                        </div>
                        <div class="exss-tab-content" data-content="settings">
                            ${this.getSettingsTabContent()}
                        </div>
                    </div>
                    
                    <div class="exss-footer">
                        <div class="exss-status">
                            <span class="exss-status-indicator"></span>
                            <span class="exss-status-text">Ready</span>
                        </div>
                        <div class="exss-stats">
                            <span>Tests: <strong id="exss-test-count">0</strong></span>
                            <span>Vulnerable: <strong id="exss-vuln-count">0</strong></span>
                        </div>
                    </div>
                </div>
            `;
        }

        getScanTabContent() {
            return `
                <div class="exss-scan-panel">
                    <div class="exss-section">
                        <h3>🎯 Target Configuration</h3>
                        <div class="exss-form-group">
                            <label>Target URL</label>
                            <input type="text" id="exss-target-url" 
                                   value="${window.location.href}" 
                                   placeholder="https://example.com">
                        </div>
                        <div class="exss-form-group">
                            <label>Scan Mode</label>
                            <select id="exss-scan-mode">
                                <option value="quick">Quick Scan</option>
                                <option value="deep">Deep Scan</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="exss-section">
                        <h3>🔧 Options</h3>
                        <div class="exss-checkbox-group">
                            <label><input type="checkbox" id="exss-test-forms" checked> Test Forms</label>
                            <label><input type="checkbox" id="exss-test-inputs" checked> Test Inputs</label>
                            <label><input type="checkbox" id="exss-test-urls"> Test URL Parameters</label>
                            <label><input type="checkbox" id="exss-test-dom"> Test DOM XSS</label>
                            <label><input type="checkbox" id="exss-test-blind"> Test Blind XSS</label>
                            <label><input type="checkbox" id="exss-bypass-waf"> WAF Bypass Mode</label>
                        </div>
                    </div>
                    
                    <div class="exss-actions-bar">
                        <button class="exss-btn exss-btn-primary" id="exss-start-scan">
                            ▶️ Start Scan
                        </button>
                        <button class="exss-btn exss-btn-secondary" id="exss-stop-scan" disabled>
                            ⏸️ Stop
                        </button>
                        <button class="exss-btn exss-btn-secondary" id="exss-clear-results">
                            🗑️ Clear
                        </button>
                    </div>
                    
                    <div class="exss-progress" style="display:none;">
                        <div class="exss-progress-bar">
                            <div class="exss-progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="exss-progress-text">0 / 0 tests completed</div>
                    </div>
                </div>
            `;
        }

        getPayloadsTabContent() {
            return `
                <div class="exss-payload-panel">
                    <div class="exss-payload-search">
                        <input type="text" id="exss-payload-search" placeholder="🔍 Search payloads...">
                        <select id="exss-payload-category">
                            <option value="all">All Categories</option>
                            <option value="basic">Basic</option>
                            <option value="advanced">Advanced</option>
                            <option value="waf-bypass">WAF Bypass</option>
                            <option value="polyglot">Polyglot</option>
                            <option value="mutation">Mutation XSS</option>
                        </select>
                    </div>
                    <div class="exss-payload-list" id="exss-payload-list">
                        <!-- Populated dynamically -->
                    </div>
                    <div class="exss-payload-actions">
                        <button class="exss-btn exss-btn-primary" id="exss-add-payload">➕ Add Custom</button>
                        <button class="exss-btn exss-btn-secondary" id="exss-import-payloads">📥 Import</button>
                        <button class="exss-btn exss-btn-secondary" id="exss-export-payloads">📤 Export</button>
                    </div>
                </div>
            `;
        }

        getResultsTabContent() {
            return `
                <div class="exss-results-panel">
                    <div class="exss-results-filter">
                        <select id="exss-results-filter">
                            <option value="all">All Results</option>
                            <option value="vulnerable">Vulnerable Only</option>
                            <option value="safe">Safe Only</option>
                        </select>
                        <button class="exss-btn exss-btn-primary" id="exss-export-results">📄 Export Report</button>
                    </div>
                    <div class="exss-results-stats">
                        <div class="exss-stat-card">
                            <div class="exss-stat-value" id="exss-stat-total">0</div>
                            <div class="exss-stat-label">Total Tests</div>
                        </div>
                        <div class="exss-stat-card exss-stat-critical">
                            <div class="exss-stat-value" id="exss-stat-critical">0</div>
                            <div class="exss-stat-label">Critical</div>
                        </div>
                        <div class="exss-stat-card exss-stat-high">
                            <div class="exss-stat-value" id="exss-stat-high">0</div>
                            <div class="exss-stat-label">High</div>
                        </div>
                        <div class="exss-stat-card exss-stat-medium">
                            <div class="exss-stat-value" id="exss-stat-medium">0</div>
                            <div class="exss-stat-label">Medium</div>
                        </div>
                    </div>
                    <div class="exss-results-list" id="exss-results-list">
                        <!-- Populated dynamically -->
                    </div>
                </div>
            `;
        }

        getSettingsTabContent() {
            return `
                <div class="exss-settings-panel">
                    <div class="exss-section">
                        <h3>🔧 General Settings</h3>
                        <div class="exss-form-group">
                            <label>Theme</label>
                            <select id="exss-theme">
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                        <div class="exss-form-group">
                            <label>Max Concurrent Tests</label>
                            <input type="number" id="exss-max-concurrent" value="5" min="1" max="20">
                        </div>
                        <div class="exss-form-group">
                            <label>Request Timeout (ms)</label>
                            <input type="number" id="exss-timeout" value="10000" min="1000" max="60000">
                        </div>
                    </div>
                    
                    <div class="exss-section">
                        <h3>🎯 Blind XSS Settings</h3>
                        <div class="exss-form-group">
                            <label>Callback URL</label>
                            <input type="text" id="exss-callback-url" placeholder="https://your-server.com/callback">
                        </div>
                    </div>
                    
                    <div class="exss-actions-bar">
                        <button class="exss-btn exss-btn-primary" id="exss-save-settings">💾 Save Settings</button>
                        <button class="exss-btn exss-btn-danger" id="exss-reset-settings">🔄 Reset</button>
                    </div>
                </div>
            `;
        }

        // ───────────────────────────────────────────────────────────────
        // 🎧 Event Listeners
        // ───────────────────────────────────────────────────────────────
        attachEventListeners() {
            // Tab switching
            this.container.querySelectorAll('.exss-tab').forEach(tab => {
                tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
            });

            // Window controls
            this.container.querySelector('[data-action="close"]')
                .addEventListener('click', () => this.hide());
            
            this.container.querySelector('[data-action="minimize"]')
                .addEventListener('click', () => this.minimize());

            // Scan controls
            const startBtn = this.container.querySelector('#exss-start-scan');
            if (startBtn) {
                startBtn.addEventListener('click', () => this.startScan());
            }

            // Settings
            const saveBtn = this.container.querySelector('#exss-save-settings');
            if (saveBtn) {
                saveBtn.addEventListener('click', () => this.saveSettings());
            }
        }

        switchTab(tabName) {
            // Update tab buttons
            this.container.querySelectorAll('.exss-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === tabName);
            });

            // Update content
            this.container.querySelectorAll('.exss-tab-content').forEach(content => {
                content.classList.toggle('active', content.dataset.content === tabName);
            });

            this.activeTab = tabName;
        }

        // ───────────────────────────────────────────────────────────────
        // 🎬 Actions
        // ───────────────────────────────────────────────────────────────
        async startScan() {
            const config = this.getScanConfig();
            this.updateStatus('scanning', 'Scanning...');
            
            try {
                const orchestrator = await this.framework.loadModule('core', 'orchestrator');
                await orchestrator.startScan(config);
            } catch (error) {
                console.error('Scan failed:', error);
                this.updateStatus('error', 'Scan failed');
            }
        }

        getScanConfig() {
            return {
                url: this.container.querySelector('#exss-target-url').value,
                mode: this.container.querySelector('#exss-scan-mode').value,
                testForms: this.container.querySelector('#exss-test-forms').checked,
                testInputs: this.container.querySelector('#exss-test-inputs').checked,
                testURLs: this.container.querySelector('#exss-test-urls').checked,
                testDOM: this.container.querySelector('#exss-test-dom').checked,
                testBlind: this.container.querySelector('#exss-test-blind').checked,
                bypassWAF: this.container.querySelector('#exss-bypass-waf').checked
            };
        }

        saveSettings() {
            const settings = {
                theme: this.container.querySelector('#exss-theme').value,
                maxConcurrent: parseInt(this.container.querySelector('#exss-max-concurrent').value),
                timeout: parseInt(this.container.querySelector('#exss-timeout').value),
                callbackUrl: this.container.querySelector('#exss-callback-url').value
            };

            GM_setValue('elite_xss_settings', JSON.stringify(settings));
            this.updateStatus('success', 'Settings saved');
        }

        // ───────────────────────────────────────────────────────────────
        // 🎨 UI Controls
        // ───────────────────────────────────────────────────────────────
        toggle() {
            if (this.isVisible) {
                this.hide();
            } else {
                this.show();
            }
        }

        show() {
            if (!this.container) this.create();
            this.container.style.display = 'block';
            this.isVisible = true;
        }

        hide() {
            if (this.container) {
                this.container.style.display = 'none';
            }
            this.isVisible = false;
        }

        minimize() {
            this.container.classList.toggle('minimized');
        }

        updateStatus(type, text) {
            const indicator = this.container.querySelector('.exss-status-indicator');
            const statusText = this.container.querySelector('.exss-status-text');
            
            indicator.className = `exss-status-indicator exss-status-${type}`;
            statusText.textContent = text;
        }

        updateStats(stats) {
            if (stats.total !== undefined) {
                this.container.querySelector('#exss-test-count').textContent = stats.total;
            }
            if (stats.vulnerable !== undefined) {
                this.container.querySelector('#exss-vuln-count').textContent = stats.vulnerable;
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 🎨 Load Styles
        // ───────────────────────────────────────────────────────────────
        async loadStyles() {
            const styles = await this.framework.loadModule('ui', 'styles');
            if (styles && styles.inject) {
                styles.inject();
            }
        }
    }

    // Export
    exports.Dashboard = Dashboard;
    exports.create = (framework) => new Dashboard(framework);
})();