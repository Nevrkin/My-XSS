/**
 * @file styles.js
 * @description Consolidated UI styles for Elite XSS Framework
 * @version 8.0.0
 */

(function() {
    'use strict';

    class UIStyles {
        constructor() {
            this.injected = false;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎨 Inject Styles
        // ═══════════════════════════════════════════════════════════════
        inject() {
            if (this.injected) return;

            const style = document.createElement('style');
            style.id = 'elite-xss-styles';
            style.textContent = this.getCSS();

            document.head.appendChild(style);
            this.injected = true;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎨 CSS Styles
        // ═══════════════════════════════════════════════════════════════
        getCSS() {
            return `
                /* Elite XSS Framework Styles */
                #elite-xss-dashboard {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 500px;
                    max-height: 80vh;
                    background: #1e1e1e;
                    color: #e0e0e0;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                    border: 1px solid #333;
                    z-index: 10000;
                    overflow: hidden;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                #elite-xss-dashboard.minimized {
                    height: 60px;
                }

                .exss-panel {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                /* Header */
                .exss-header {
                    background: linear-gradient(135deg, #2c3e50, #34495e);
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #333;
                }

                .exss-header h1 {
                    margin: 0;
                    font-size: 18px;
                    color: #4caf50;
                    font-weight: 600;
                }

                .exss-actions {
                    display: flex;
                    gap: 8px;
                }

                .exss-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #e0e0e0;
                    padding: 6px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }

                .exss-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .exss-btn-close:hover {
                    background: #f44336;
                }

                .exss-btn-minimize:hover {
                    background: #ff9800;
                }

                /* Tabs */
                .exss-tabs {
                    display: flex;
                    background: #252525;
                    border-bottom: 1px solid #333;
                }

                .exss-tab {
                    flex: 1;
                    padding: 12px;
                    background: transparent;
                    border: none;
                    color: #aaa;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .exss-tab:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #e0e0e0;
                }

                .exss-tab.active {
                    background: #1e1e1e;
                    color: #4caf50;
                    border-bottom: 2px solid #4caf50;
                }

                /* Content */
                .exss-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }

                .exss-tab-content {
                    display: none;
                }

                .exss-tab-content.active {
                    display: block;
                }

                /* Sections */
                .exss-section {
                    margin-bottom: 20px;
                    padding: 15px;
                    background: #2d2d2d;
                    border-radius: 6px;
                    border: 1px solid #3a3a3a;
                }

                .exss-section h3 {
                    margin: 0 0 15px 0;
                    color: #4caf50;
                    font-size: 16px;
                    font-weight: 500;
                }

                /* Form Elements */
                .exss-form-group {
                    margin-bottom: 15px;
                }

                .exss-form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: #e0e0e0;
                }

                .exss-form-group input,
                .exss-form-group select {
                    width: 100%;
                    padding: 10px;
                    background: #333;
                    border: 1px solid #444;
                    border-radius: 4px;
                    color: #e0e0e0;
                    font-size: 14px;
                }

                .exss-form-group input:focus,
                .exss-form-group select:focus {
                    outline: none;
                    border-color: #4caf50;
                    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
                }

                .exss-checkbox-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }

                .exss-checkbox-group label {
                    display: flex;
                    align-items: center;
                    margin: 0;
                    font-size: 13px;
                    color: #ccc;
                }

                .exss-checkbox-group input {
                    margin-right: 8px;
                }

                /* Actions */
                .exss-actions-bar {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                .exss-btn-primary {
                    background: #4caf50;
                    color: #000;
                    font-weight: 600;
                }

                .exss-btn-primary:hover {
                    background: #45a049;
                }

                .exss-btn-secondary {
                    background: #444;
                    color: #e0e0e0;
                }

                .exss-btn-danger {
                    background: #f44336;
                    color: #fff;
                }

                .exss-btn-danger:hover {
                    background: #da190b;
                }

                /* Progress */
                .exss-progress {
                    margin-top: 20px;
                    padding: 15px;
                    background: #2d2d2d;
                    border-radius: 6px;
                    border: 1px solid #3a3a3a;
                }

                .exss-progress-bar {
                    width: 100%;
                    height: 20px;
                    background: #333;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 10px;
                }

                .exss-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4caf50, #8bc34a);
                    transition: width 0.3s ease;
                }

                .exss-progress-text {
                    text-align: center;
                    font-size: 14px;
                    color: #aaa;
                }

                /* Results */
                .exss-results-filter {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    gap: 10px;
                }

                .exss-results-filter select,
                .exss-results-filter button {
                    padding: 8px 12px;
                    border-radius: 4px;
                }

                .exss-results-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .exss-stat-card {
                    background: #2d2d2d;
                    padding: 15px;
                    border-radius: 6px;
                    text-align: center;
                    border: 1px solid #3a3a3a;
                }

                .exss-stat-value {
                    font-size: 24px;
                    font-weight: bold;
                    color: #4caf50;
                    margin-bottom: 5px;
                }

                .exss-stat-label {
                    font-size: 12px;
                    color: #aaa;
                }

                .exss-stat-critical .exss-stat-value {
                    color: #f44336;
                }

                .exss-stat-high .exss-stat-value {
                    color: #ff9800;
                }

                .exss-stat-medium .exss-stat-value {
                    color: #ffc107;
                }

                .exss-results-list {
                    max-height: 400px;
                    overflow-y: auto;
                }

                .exss-result-item {
                    background: #2d2d2d;
                    border-radius: 6px;
                    padding: 15px;
                    margin-bottom: 15px;
                    border: 1px solid #3a3a3a;
                }

                .exss-result-high {
                    border-left: 4px solid #f44336;
                }

                .exss-result-medium {
                    border-left: 4px solid #ff9800;
                }

                .exss-result-low {
                    border-left: 4px solid #4caf50;
                }

                .exss-result-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .exss-result-id {
                    font-weight: bold;
                    color: #4caf50;
                }

                .exss-result-severity {
                    text-transform: uppercase;
                    font-size: 12px;
                    font-weight: bold;
                    padding: 2px 8px;
                    border-radius: 10px;
                    background: #333;
                }

                .exss-result-details {
                    font-size: 14px;
                }

                .exss-result-target {
                    color: #2196f3;
                    margin-bottom: 5px;
                    word-break: break-all;
                }

                .exss-result-payload {
                    background: #333;
                    padding: 8px;
                    border-radius: 4px;
                    margin-bottom: 5px;
                    font-family: monospace;
                    font-size: 12px;
                    word-break: break-all;
                }

                .exss-result-evidence {
                    color: #aaa;
                    font-size: 13px;
                }

                /* Payloads */
                .exss-payload-search {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .exss-payload-list {
                    max-height: 300px;
                    overflow-y: auto;
                    background: #2d2d2d;
                    border-radius: 6px;
                    padding: 10px;
                    margin-bottom: 15px;
                }

                .exss-payload-actions {
                    display: flex;
                    gap: 10px;
                }

                /* Footer */
                .exss-footer {
                    background: #252525;
                    padding: 12px 20px;
                    border-top: 1px solid #333;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 13px;
                }

                .exss-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .exss-status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #4caf50;
                }

                .exss-status-indicator.exss-status-error {
                    background: #f44336;
                }

                .exss-status-indicator.exss-status-warning {
                    background: #ff9800;
                }

                .exss-status-indicator.exss-status-scanning {
                    background: #2196f3;
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }

                .exss-stats {
                    display: flex;
                    gap: 15px;
                }

                .exss-stats span {
                    color: #aaa;
                }

                .exss-stats strong {
                    color: #4caf50;
                }

                /* Utility Classes */
                .hidden {
                    display: none !important;
                }
            `;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎨 Theme Management
        // ═══════════════════════════════════════════════════════════════
        toggleTheme(dark = true) {
            const style = document.getElementById('elite-xss-styles');
            if (style) {
                style.textContent = this.getCSS();
            }
        }
    }

    // Export
    exports.UIStyles = UIStyles;
    exports.create = () => new UIStyles();
})();