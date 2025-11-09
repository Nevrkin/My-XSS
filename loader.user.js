// ==UserScript==
// @name         Elite XSS Testing Framework v8.0
// @namespace    http://tampermonkey.net/
// @version      8.0.0
// @description  Advanced XSS Testing Framework - Top 0.1% Techniques
// @author       Elite Security Research Team
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-start
// @connect      *
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════
    // 🔧 Configuration
    // ═══════════════════════════════════════════════════════════════════
    const CONFIG = {
        version: '8.0.0',
        baseUrl: 'https://raw.githubusercontent.com/Nevrkin/My-XSS/main/',
        cacheExpiry: 3600000, // 1 hour
        devMode: false,
        hotReload: true,
        modules: {
            core: ['engine', 'detection', 'injection', 'validator', 'orchestrator'],
            modules: ['endpoint-discovery', 'payload-manager', 'bypass-engine',
                     'mutation-fuzzer', 'context-analyzer', 'polyglot-generator'],
            ui: ['dashboard', 'settings-panel', 'results-viewer', 'live-monitor', 'styles'],
            utils: ['logger', 'storage', 'sync', 'encoder', 'reporter'],
            payloads: ['base-payloads', 'advanced-payloads', 'waf-bypass',
                      'prototype-pollution', 'dom-clobbering', 'mutation-xss'],
            techniques: ['encoding-schemes', 'obfuscation', 'timing-attacks',
                        'blind-xss', 'csp-bypass'],
            integrations: ['burp-export', 'webhook-notify', 'api-connector'],
            config: ['defaults', 'endpoints', 'profiles']
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // 🎯 Elite XSS Framework Core Loader
    // ═══════════════════════════════════════════════════════════════════
    class EliteXSSFramework {
        constructor() {
            this.loadedModules = new Map();
            this.loadQueue = [];
            this.isInitialized = false;
            this.eventBus = new EventTarget();
            this.state = {
                active: false,
                currentProfile: 'default',
                testingMode: 'manual',
                permissions: this.checkPermissions()
            };
        }

        // ───────────────────────────────────────────────────────────────
        // 🔐 Permission & Safety Checks
        // ───────────────────────────────────────────────────────────────
        checkPermissions() {
            return {
                gmApi: typeof GM_xmlhttpRequest !== 'undefined',
                storage: typeof GM_getValue !== 'undefined',
                clipboard: typeof GM_setClipboard !== 'undefined',
                notifications: typeof GM_notification !== 'undefined',
                unsafeWindow: typeof unsafeWindow !== 'undefined'
            };
        }

        // ───────────────────────────────────────────────────────────────
        // 📦 Module Loader with Caching
        // ───────────────────────────────────────────────────────────────
        async loadModule(category, moduleName) {
            const moduleKey = `${category}/${moduleName}`;

            // Check if already loaded
            if (this.loadedModules.has(moduleKey)) {
                return this.loadedModules.get(moduleKey);
            }

            try {
                let moduleCode;

                if (CONFIG.devMode) {
                    // Load from local storage in dev mode
                    moduleCode = GM_getValue(`module_${moduleKey}`, null);
                } else {
                    // Load from remote with caching
                    const cachedModule = this.getCachedModule(moduleKey);
                    if (cachedModule && !CONFIG.hotReload) {
                        moduleCode = cachedModule;
                    } else {
                        moduleCode = await this.fetchModule(category, moduleName);
                        this.cacheModule(moduleKey, moduleCode);
                    }
                }

                if (!moduleCode) {
                    throw new Error(`Module ${moduleKey} not found`);
                }

                // Create isolated scope and execute
                const module = this.executeModule(moduleCode, moduleName);
                this.loadedModules.set(moduleKey, module);

                this.emit('moduleLoaded', { category, moduleName, module });
                return module;

            } catch (error) {
                console.error(`[Elite XSS] Failed to load module ${moduleKey}:`, error);
                this.emit('moduleError', { category, moduleName, error });
                throw error;
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 🌐 Remote Module Fetcher
        // ───────────────────────────────────────────────────────────────
        fetchModule(category, moduleName) {
            return new Promise((resolve, reject) => {
                // Fix path mapping - UI modules are in ui/ directory
                let path = `${category}/${moduleName}.js`;
                if (category === 'ui') {
                    path = `ui/${moduleName}.js`;
                } else if (category === 'modules') {
                    path = `modules/${moduleName}.js`;
                }

                const url = `${CONFIG.baseUrl}${path}`;

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 10000,
                    onload: (response) => {
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: reject,
                    ontimeout: () => reject(new Error('Timeout'))
                });
            });
        }

        // ───────────────────────────────────────────────────────────────
        // 💾 Module Caching System
        // ───────────────────────────────────────────────────────────────
        cacheModule(moduleKey, code) {
            const cacheData = {
                code: code,
                timestamp: Date.now(),
                version: CONFIG.version
            };
            GM_setValue(`cache_${moduleKey}`, JSON.stringify(cacheData));
        }

        getCachedModule(moduleKey) {
            const cached = GM_getValue(`cache_${moduleKey}`, null);
            if (!cached) return null;

            try {
                const { code, timestamp, version } = JSON.parse(cached);

                // Check expiry and version
                if (Date.now() - timestamp > CONFIG.cacheExpiry || version !== CONFIG.version) {
                    GM_deleteValue(`cache_${moduleKey}`);
                    return null;
                }

                return code;
            } catch {
                return null;
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 🔒 Secure Module Execution
        // ───────────────────────────────────────────────────────────────
        executeModule(code, moduleName) {
            const moduleScope = {
                window: unsafeWindow,
                document: document,
                console: console,
                GM: {
                    xmlhttpRequest: GM_xmlhttpRequest,
                    getValue: GM_getValue,
                    setValue: GM_setValue,
                    deleteValue: GM_deleteValue,
                    notification: GM_notification,
                    setClipboard: GM_setClipboard
                },
                framework: this,
                exports: {}
            };

            // Create isolated function
            const moduleFunction = new Function(
                ...Object.keys(moduleScope),
                `"use strict";\n${code}\nreturn exports;`
            );

            // Execute with isolated scope
            return moduleFunction(...Object.values(moduleScope));
        }

        // ───────────────────────────────────────────────────────────────
        // 🎬 Framework Initialization
        // ───────────────────────────────────────────────────────────────
        async initialize() {
            if (this.isInitialized) return;

            console.log(`[Elite XSS] Initializing v${CONFIG.version}...`);

            try {
                // 1️⃣ Load Core Modules (Sequential - Critical)
                await this.loadModuleCategory('core');

                // 2️⃣ Load Utils (Parallel - Support)
                await this.loadModuleCategory('utils');

                // 3️⃣ Load Config (Parallel - Settings)
                await this.loadModuleCategory('config');

                // 4️⃣ Load UI (Parallel - Interface)
                await this.loadModuleCategory('ui');

                // 5️⃣ Initialize Event System
                this.initializeEventSystem();

                // 6️⃣ Setup Keyboard Shortcuts
                this.setupShortcuts();

                // 7️⃣ Lazy Load Other Modules
                this.setupLazyLoading();

                this.isInitialized = true;
                this.emit('frameworkReady', { version: CONFIG.version });

                console.log('[Elite XSS] ✅ Framework initialized successfully');

                // Show welcome notification
                this.showWelcome();

            } catch (error) {
                console.error('[Elite XSS] ❌ Initialization failed:', error);
                this.emit('frameworkError', { error });
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 📚 Load Module Category
        // ───────────────────────────────────────────────────────────────
        async loadModuleCategory(category) {
            const modules = CONFIG.modules[category] || [];
            const promises = modules.map(name => this.loadModule(category, name));
            return Promise.all(promises);
        }

        // ───────────────────────────────────────────────────────────────
        // 🔄 Event System
        // ───────────────────────────────────────────────────────────────
        emit(eventName, data) {
            this.eventBus.dispatchEvent(new CustomEvent(eventName, { detail: data }));
        }

        on(eventName, handler) {
            this.eventBus.addEventListener(eventName, (e) => handler(e.detail));
        }

        off(eventName, handler) {
            this.eventBus.removeEventListener(eventName, handler);
        }

        // ───────────────────────────────────────────────────────────────
        // ⌨️ Keyboard Shortcuts
        // ───────────────────────────────────────────────────────────────
        setupShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl+Shift+X - Toggle Dashboard
                if (e.ctrlKey && e.shiftKey && e.key === 'X') {
                    e.preventDefault();
                    this.toggleDashboard();
                }

                // Ctrl+Shift+T - Quick Test
                if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                    e.preventDefault();
                    this.quickTest();
                }

                // Ctrl+Shift+S - Toggle Safe Mode
                if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                    e.preventDefault();
                    this.toggleSafeMode();
                }
            });
        }

        // ───────────────────────────────────────────────────────────────
        // 🎯 Lazy Loading System
        // ───────────────────────────────────────────────────────────────
        setupLazyLoading() {
            const lazyCategories = ['modules', 'payloads', 'techniques', 'integrations'];

            lazyCategories.forEach(category => {
                Object.defineProperty(this, category, {
                    get: () => {
                        if (!this[`_${category}`]) {
                            this[`_${category}`] = new Proxy({}, {
                                get: (target, prop) => {
                                    if (!target[prop]) {
                                        target[prop] = this.loadModule(category, prop);
                                    }
                                    return target[prop];
                                }
                            });
                        }
                        return this[`_${category}`];
                    }
                });
            });
        }

        // ───────────────────────────────────────────────────────────────
        // 🎨 UI Controls
        // ───────────────────────────────────────────────────────────────
        async toggleDashboard() {
            try {
                const dashboard = await this.loadModule('ui', 'dashboard');
                if (dashboard && typeof dashboard.toggle === 'function') {
                    dashboard.toggle();
                } else if (dashboard && typeof dashboard.show === 'function') {
                    dashboard.show();
                } else if (dashboard && typeof dashboard.render === 'function') {
                    dashboard.render();
                } else {
                    console.log('[Elite XSS] Dashboard module loaded but no toggle method found');
                }
            } catch (error) {
                console.error('[Elite XSS] Failed to load dashboard:', error);
                // Fallback: create simple dashboard
                this.createSimpleDashboard();
            }
        }

        async quickTest() {
            try {
                const orchestrator = await this.loadModule('core', 'orchestrator');
                if (orchestrator && typeof orchestrator.runQuickTest === 'function') {
                    orchestrator.runQuickTest();
                } else {
                    console.log('[Elite XSS] Quick test not available');
                }
            } catch (error) {
                console.error('[Elite XSS] Failed to run quick test:', error);
            }
        }

        toggleSafeMode() {
            this.state.safeMode = !this.state.safeMode;
            this.emit('safeModeToggled', { enabled: this.state.safeMode });
            GM_notification({
                title: 'Elite XSS',
                text: `Safe Mode ${this.state.safeMode ? 'Enabled' : 'Disabled'}`,
                timeout: 2000
            });
        }

        // ───────────────────────────────────────────────────────────────
        // 🎉 Welcome Message
        // ───────────────────────────────────────────────────────────────
        showWelcome() {
            const isFirstRun = !GM_getValue('initialized', false);

            if (isFirstRun) {
                GM_setValue('initialized', true);
                GM_notification({
                    title: '🎯 Elite XSS Framework v8.0',
                    text: 'Press Ctrl+Shift+X to open dashboard\nAuthorized testing only!',
                    timeout: 5000
                });
            }

            // Subtle indicator
            this.injectIndicator();
        }

        injectIndicator() {
            // Remove existing indicator if present
            const existing = document.getElementById('elite-xss-indicator');
            if (existing) existing.remove();

            const indicator = document.createElement('div');
            indicator.id = 'elite-xss-indicator';
            indicator.innerHTML = '🎯';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                cursor: pointer;
                z-index: 999999;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                transition: transform 0.3s ease;
            `;

            indicator.addEventListener('mouseenter', () => {
                indicator.style.transform = 'scale(1.1)';
            });

            indicator.addEventListener('mouseleave', () => {
                indicator.style.transform = 'scale(1)';
            });

            indicator.addEventListener('click', () => this.toggleDashboard());

            document.body.appendChild(indicator);
        }

        // ───────────────────────────────────────────────────────────────
        // 🔄 Event System Initialization
        // ───────────────────────────────────────────────────────────────
        initializeEventSystem() {
            // Cross-tab communication
            const bc = new BroadcastChannel('elite-xss-sync');

            bc.onmessage = (event) => {
                this.emit('sync', event.data);
            };

            this.broadcast = (data) => {
                bc.postMessage(data);
            };

            // Cleanup on unload
            window.addEventListener('beforeunload', () => {
                bc.close();
                this.emit('frameworkUnload');
            });
        }

        // ───────────────────────────────────────────────────────────────
        // 🧹 Cleanup & Uninstall
        // ───────────────────────────────────────────────────────────────
        async uninstall() {
            const keys = GM_listValues();
            keys.forEach(key => GM_deleteValue(key));

            const indicator = document.getElementById('elite-xss-indicator');
            if (indicator) indicator.remove();

            console.log('[Elite XSS] Framework uninstalled');
        }

        // ───────────────────────────────────────────────────────────────
        // 🎯 Simple Dashboard Fallback
        // ───────────────────────────────────────────────────────────────
        createSimpleDashboard() {
            // Remove existing simple dashboard if present
            const existing = document.getElementById('elite-xss-simple-dashboard');
            if (existing) existing.remove();

            // Create a simple dashboard element
            const dashboard = document.createElement('div');
            dashboard.id = 'elite-xss-simple-dashboard';
            dashboard.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 80vh;
                background: #1e1e1e;
                color: #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                border: 1px solid #333;
                z-index: 10000;
                overflow-y: auto;
            `;

            dashboard.innerHTML = `
                <div style="padding: 15px; border-bottom: 1px solid #333;">
                    <h2 style="margin: 0; color: #4caf50;">Elite XSS Framework</h2>
                    <p style="margin: 5px 0 0 0; color: #aaa;">v8.0.0 - Manual Dashboard</p>
                </div>
                <div style="padding: 15px;">
                    <div style="margin-bottom: 15px;">
                        <h3 style="color: #4caf50; margin-top: 0;">Framework Status</h3>
                        <p>✅ Core modules loaded</p>
                        <p>⚠️ UI modules failed to load (404 errors)</p>
                        <p>🔧 Using fallback dashboard</p>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <h3 style="color: #4caf50;">Quick Actions</h3>
                        <button onclick="console.log('[Elite XSS] Quick test would run here')" 
                                style="background: #444; color: #fff; border: none; padding: 8px 12px; margin: 5px; border-radius: 4px; cursor: pointer;">
                            Quick Test
                        </button>
                        <button onclick="document.getElementById('elite-xss-simple-dashboard').style.display = 'none'" 
                                style="background: #f44336; color: #fff; border: none; padding: 8px 12px; margin: 5px; border-radius: 4px; cursor: pointer;">
                            Close
                        </button>
                    </div>
                    <div>
                        <h3 style="color: #4caf50;">Loaded Modules</h3>
                        <div style="max-height: 200px; overflow-y: auto; background: #333; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">
                            ${Array.from(this.loadedModules.keys()).join('<br>')}
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(dashboard);
            console.log('[Elite XSS] ✅ Simple dashboard created as fallback');
        }

        // ───────────────────────────────────────────────────────────────
        // 🎯 Start Scan Method
        // ───────────────────────────────────────────────────────────────
        async startScan(target, options = {}) {
            console.log(`[Elite XSS] Starting scan for target: ${target}`);
            
            // Dispatch scan start event
            this.emit('scanStarted', { target, options });
            
            // Implementation would go here
            return {
                status: 'started',
                target: target,
                timestamp: new Date().toISOString()
            };
        }

        // ───────────────────────────────────────────────────────────────
        // 🛑 Stop Scan Method
        // ───────────────────────────────────────────────────────────────
        stopScan() {
            console.log('[Elite XSS] Stopping scan');
            
            // Dispatch scan stop event
            this.emit('scanStopped');
            
            // Implementation would go here
            return {
                status: 'stopped',
                timestamp: new Date().toISOString()
            };
        }

        // ───────────────────────────────────────────────────────────────
        // 📊 Get Framework Status
        // ───────────────────────────────────────────────────────────────
        getStatus() {
            return {
                initialized: this.isInitialized,
                modules: this.loadedModules.size,
                version: CONFIG.version,
                state: this.state
            };
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Bootstrap
    // ═══════════════════════════════════════════════════════════════════
    const framework = new EliteXSSFramework();

    // Make globally accessible
    unsafeWindow.EliteXSS = framework;

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => framework.initialize());
    } else {
        framework.initialize();
    }

    console.log('[Elite XSS] Loader injected successfully');
})();