// ==UserScript==
// @name         Elite XSS Framework v8.0 - Professional Edition
// @namespace    https://elite-xss.framework
// @version      8.0.0
// @description  🎯 Advanced XSS Testing Framework | Modular Architecture | Professional UI | Top 0.1% Techniques
// @author       Elite Security Research Team
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// ==/UserScript==

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // 🎯 ELITE XSS FRAMEWORK v8.0 - MAIN LOADER
  // ═══════════════════════════════════════════════════════════════

  const FRAMEWORK = {
    VERSION: '8.0.0',
    NAME: 'Elite XSS Framework',
    BUILD: '2025.01',
    
    // CDN Configuration (use your own CDN or local server)
    CDN_BASE: 'https://raw.githubusercontent.com/Nevrkin/My-XSS/main/',
    USE_LOCAL: false, // Set to true for local development
    LOCAL_BASE: 'http://localhost:8080/elite-xss-framework/',
    
    // Module Registry
    MODULES: {
      // Core modules (always loaded)
      core: {
        engine: 'core/engine.js',
        detection: 'core/detection.js',
        injection: 'core/injection.js',
        validator: 'core/validator.js',
        orchestrator: 'core/orchestrator.js'
      },
      
      // Feature modules (lazy loaded)
      modules: {
        endpointDiscovery: 'modules/endpoint-discovery.js',
        payloadManager: 'modules/payload-manager.js',
        bypassEngine: 'modules/bypass-engine.js',
        mutationFuzzer: 'modules/mutation-fuzzer.js',
        contextAnalyzer: 'modules/context-analyzer.js',
        polyglotGenerator: 'modules/polyglot-generator.js'
      },
      
      // UI modules
      ui: {
        dashboard: 'ui/dashboard.js',
        settingsPanel: 'ui/settings-panel.js',
        resultsViewer: 'ui/results-viewer.js',
        liveMonitor: 'ui/live-monitor.js',
        styles: 'ui/styles.js'
      },
      
      // Utility modules
      utils: {
        logger: 'utils/logger.js',
        storage: 'utils/storage.js',
        sync: 'utils/sync.js',
        encoder: 'utils/encoder.js',
        reporter: 'utils/reporter.js'
      },
      
      // Payload libraries (lazy loaded)
      payloads: {
        base: 'payloads/base-payloads.js',
        advanced: 'payloads/advanced-payloads.js',
        wafBypass: 'payloads/waf-bypass.js',
        prototypePollution: 'payloads/prototype-pollution.js',
        domClobbering: 'payloads/dom-clobbering.js',
        mutationXss: 'payloads/mutation-xss.js'
      },
      
      // Advanced techniques (lazy loaded)
      techniques: {
        encodingSchemes: 'techniques/encoding-schemes.js',
        obfuscation: 'techniques/obfuscation.js',
        timingAttacks: 'techniques/timing-attacks.js',
        blindXss: 'techniques/blind-xss.js',
        cspBypass: 'techniques/csp-bypass.js'
      },
      
      // Integrations (lazy loaded)
      integrations: {
        burpExport: 'integrations/burp-export.js',
        webhookNotify: 'integrations/webhook-notify.js',
        apiConnector: 'integrations/api-connector.js'
      },
      
      // Configuration
      config: {
        defaults: 'config/defaults.js',
        endpoints: 'config/endpoints.js',
        profiles: 'config/profiles.js'
      }
    },
    
    // State management
    state: {
      initialized: false,
      loadedModules: new Set(),
      pendingLoads: new Map(),
      moduleCache: new Map(),
      readyCallbacks: [],
      errorCallbacks: []
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 📦 MODULE LOADER - Advanced Dynamic Import System
  // ═══════════════════════════════════════════════════════════════

  const ModuleLoader = {
    
    /**
     * Get base URL for module loading
     */
    getBaseURL: () => {
      return FRAMEWORK.USE_LOCAL ? FRAMEWORK.LOCAL_BASE : FRAMEWORK.CDN_BASE;
    },
    
    /**
     * Load a single module with caching and error handling
     */
    loadModule: async (modulePath, moduleName) => {
      // Check cache first
      if (FRAMEWORK.state.moduleCache.has(moduleName)) {
        return FRAMEWORK.state.moduleCache.get(moduleName);
      }
      
      // Check if already loading
      if (FRAMEWORK.state.pendingLoads.has(moduleName)) {
        return FRAMEWORK.state.pendingLoads.get(moduleName);
      }
      
      const loadPromise = new Promise((resolve, reject) => {
        const fullURL = ModuleLoader.getBaseURL() + modulePath;
        
        GM_xmlhttpRequest({
          method: 'GET',
          url: fullURL,
          timeout: 10000,
          onload: (response) => {
            if (response.status === 200) {
              try {
                // Execute module code in isolated scope
                const moduleExports = {};
                const moduleFunc = new Function('exports', 'FRAMEWORK', 'GM_getValue', 'GM_setValue', 
                  'GM_deleteValue', 'GM_notification', 'unsafeWindow', response.responseText + '\nreturn exports;');
                
                const result = moduleFunc(moduleExports, FRAMEWORK, GM_getValue, GM_setValue, 
                  GM_deleteValue, GM_notification, unsafeWindow);
                
                // Cache the module
                FRAMEWORK.state.moduleCache.set(moduleName, result);
                FRAMEWORK.state.loadedModules.add(moduleName);
                
                console.log(`✅ [Elite XSS] Loaded module: ${moduleName}`);
                resolve(result);
              } catch (error) {
                console.error(`❌ [Elite XSS] Error executing module ${moduleName}:`, error);
                reject(error);
              }
            } else {
              reject(new Error(`HTTP ${response.status}: ${modulePath}`));
            }
          },
          onerror: (error) => {
            console.error(`❌ [Elite XSS] Network error loading ${moduleName}:`, error);
            reject(error);
          },
          ontimeout: () => {
            reject(new Error(`Timeout loading ${moduleName}`));
          }
        });
      });
      
      FRAMEWORK.state.pendingLoads.set(moduleName, loadPromise);
      
      try {
        const result = await loadPromise;
        FRAMEWORK.state.pendingLoads.delete(moduleName);
        return result;
      } catch (error) {
        FRAMEWORK.state.pendingLoads.delete(moduleName);
        throw error;
      }
    },
    
    /**
     * Load multiple modules in parallel
     */
    loadModules: async (moduleGroup) => {
      const loadPromises = Object.entries(moduleGroup).map(([name, path]) => 
        ModuleLoader.loadModule(path, name)
          .then(module => ({ name, module, success: true }))
          .catch(error => ({ name, error, success: false }))
      );
      
      const results = await Promise.all(loadPromises);
      
      const loaded = {};
      const failed = [];
      
      results.forEach(result => {
        if (result.success) {
          loaded[result.name] = result.module;
        } else {
          failed.push({ name: result.name, error: result.error });
        }
      });
      
      return { loaded, failed };
    },
    
    /**
     * Lazy load a module on demand
     */
    require: async (moduleName) => {
      // Search for module in all groups
      for (const [groupName, modules] of Object.entries(FRAMEWORK.MODULES)) {
        if (modules[moduleName]) {
          return await ModuleLoader.loadModule(modules[moduleName], moduleName);
        }
      }
      
      throw new Error(`Module not found: ${moduleName}`);
    },
    
    /**
     * Preload specific modules
     */
    preload: async (moduleNames) => {
      const promises = moduleNames.map(name => ModuleLoader.require(name));
      return await Promise.all(promises);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🚀 FRAMEWORK INITIALIZER
  // ═══════════════════════════════════════════════════════════════

  const FrameworkInit = {
    
    /**
     * Initialize the framework
     */
    init: async () => {
      if (FRAMEWORK.state.initialized) {
        console.warn('[Elite XSS] Framework already initialized');
        return;
      }
      
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('  🎯 ELITE XSS FRAMEWORK v8.0 - PROFESSIONAL EDITION');
      console.log('  📦 Modular Architecture | 🔬 Advanced Techniques | 💎 Top 0.1%');
      console.log('═══════════════════════════════════════════════════════════════');
      
      try {
        // Stage 1: Load core utilities first
        console.log('⚙️  Stage 1: Loading core utilities...');
        const { loaded: utils, failed: utilsFailed } = await ModuleLoader.loadModules(FRAMEWORK.MODULES.utils);
        
        if (utilsFailed.length > 0) {
          console.warn('⚠️  Some utility modules failed to load:', utilsFailed);
        }
        
        // Initialize logger
        if (utils.logger) {
          window.EliteLogger = typeof utils.logger.create === 'function' ? 
            utils.logger.create(FRAMEWORK) : 
            (typeof utils.logger.Logger === 'function' ? new utils.logger.Logger(FRAMEWORK) : utils.logger);
          EliteLogger.success('Logger initialized');
        }
        
        // Initialize storage
        if (utils.storage) {
          window.EliteStorage = typeof utils.storage.create === 'function' ? 
            utils.storage.create() : 
            (typeof utils.storage.Storage === 'function' ? new utils.storage.Storage() : utils.storage);
          EliteLogger?.success('Storage system initialized');
        }
        
        // Stage 2: Load configuration
        console.log('⚙️  Stage 2: Loading configuration...');
        const { loaded: config } = await ModuleLoader.loadModules(FRAMEWORK.MODULES.config);
        window.EliteConfig = config.defaults || {};
        EliteLogger?.success('Configuration loaded');
        
        // Stage 3: Load core modules
        console.log('⚙️  Stage 3: Loading core engine...');
        const { loaded: core, failed: coreFailed } = await ModuleLoader.loadModules(FRAMEWORK.MODULES.core);
        
        if (coreFailed.length > 0) {
          throw new Error(`Critical core modules failed: ${coreFailed.map(f => f.name).join(', ')}`);
        }
        
        // Register core modules globally
        window.EliteEngine = core.engine;
        window.EliteDetection = core.detection;
        window.EliteInjection = core.injection;
        window.EliteValidator = core.validator;
        window.EliteOrchestrator = core.orchestrator;
        
        EliteLogger?.success('Core engine initialized');
        
        // Stage 4: Load UI modules
        console.log('⚙️  Stage 4: Loading UI components...');
        const { loaded: ui, failed: uiFailed } = await ModuleLoader.loadModules(FRAMEWORK.MODULES.ui);
        
        if (uiFailed.length > 0) {
          EliteLogger?.warn('Some UI modules failed to load:', uiFailed);
        }
        
        // Apply styles first
        if (ui.styles) {
          ui.styles.apply();
          EliteLogger?.success('Styles applied');
        }
        
        // Initialize dashboard
        if (ui.dashboard) {
          window.EliteDashboard = ui.dashboard;
          await EliteDashboard.init();
          EliteLogger?.success('Dashboard initialized');
        }
        
        // Initialize other UI components
        if (ui.settingsPanel) {
          window.EliteSettings = ui.settingsPanel;
        }
        
        if (ui.resultsViewer) {
          window.EliteResults = ui.resultsViewer;
        }
        
        if (ui.liveMonitor) {
          window.EliteMonitor = ui.liveMonitor;
        }
        
        // Stage 5: Initialize sync system
        if (utils.sync) {
          window.EliteSync = typeof utils.sync.create === 'function' ? 
            utils.sync.create(FRAMEWORK) : 
            (typeof utils.sync.Sync === 'function' ? new utils.sync.Sync(FRAMEWORK) : utils.sync);
          EliteLogger?.success('Multi-tab sync initialized');
        }
        
        // Stage 6: Load feature modules in background
        console.log('⚙️  Stage 5: Loading feature modules...');
        setTimeout(() => {
          ModuleLoader.loadModules(FRAMEWORK.MODULES.modules)
            .then(({ loaded, failed }) => {
              Object.assign(window, {
                EliteEndpointDiscovery: loaded.endpointDiscovery,
                ElitePayloadManager: loaded.payloadManager,
                EliteBypassEngine: loaded.bypassEngine,
                EliteMutationFuzzer: loaded.mutationFuzzer,
                EliteContextAnalyzer: loaded.contextAnalyzer,
                ElitePolyglotGenerator: loaded.polyglotGenerator
              });
              
              EliteLogger?.success(`Feature modules loaded: ${Object.keys(loaded).length}`);
              
              if (failed.length > 0) {
                EliteLogger?.warn('Some feature modules failed:', failed);
              }
            });
        }, 1000);
        
        // Mark as initialized
        FRAMEWORK.state.initialized = true;
        
        // Execute ready callbacks
        FRAMEWORK.state.readyCallbacks.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('[Elite XSS] Error in ready callback:', error);
          }
        });
        
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('  ✅ FRAMEWORK READY | Use EliteDashboard to start testing');
        console.log('═══════════════════════════════════════════════════════════════');
        
        // Show notification
        GM_notification({
          text: 'Elite XSS Framework v8.0 is ready. Click the dashboard icon to start.',
          title: '🎯 Elite XSS Framework',
          timeout: 5000
        });
        
      } catch (error) {
        console.error('❌ [Elite XSS] Fatal initialization error:', error);
        
        // Execute error callbacks
        FRAMEWORK.state.errorCallbacks.forEach(callback => {
          try {
            callback(error);
          } catch (e) {
            console.error('[Elite XSS] Error in error callback:', e);
          }
        });
        
        // Show error notification
        GM_notification({
          text: `Framework initialization failed: ${error.message}`,
          title: '❌ Elite XSS Framework Error',
          timeout: 10000
        });
      }
    },
    
    /**
     * Register callback for when framework is ready
     */
    ready: (callback) => {
      if (FRAMEWORK.state.initialized) {
        callback();
      } else {
        FRAMEWORK.state.readyCallbacks.push(callback);
      }
    },
    
    /**
     * Register error callback
     */
    onError: (callback) => {
      FRAMEWORK.state.errorCallbacks.push(callback);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🌐 GLOBAL API
  // ═══════════════════════════════════════════════════════════════

  window.EliteXSS = {
    version: FRAMEWORK.VERSION,
    init: FrameworkInit.init,
    ready: FrameworkInit.ready,
    onError: FrameworkInit.onError,
    loadModule: ModuleLoader.require,
    preload: ModuleLoader.preload,
    getLoadedModules: () => Array.from(FRAMEWORK.state.loadedModules),
    
    // Quick access methods
    start: () => {
      if (window.EliteOrchestrator) {
        return EliteOrchestrator.start();
      } else {
        console.error('[Elite XSS] Orchestrator not loaded');
      }
    },
    
    stop: () => {
      if (window.EliteOrchestrator) {
        return EliteOrchestrator.stop();
      }
    },
    
    openDashboard: () => {
      if (window.EliteDashboard) {
        EliteDashboard.show();
      }
    },
    
    openSettings: () => {
      if (window.EliteSettings) {
        EliteSettings.show();
      }
    },
    
    getResults: () => {
      if (window.EliteResults) {
        return EliteResults.getAll();
      }
      return [];
    },
    
    exportResults: (format = 'json') => {
      if (window.EliteResults) {
        return EliteResults.export(format);
      }
    },
    
    clearSession: () => {
      if (window.EliteStorage) {
        EliteStorage.clearSession();
      }
    }
  };

  // Expose for debugging
  unsafeWindow.EliteXSS = window.EliteXSS;
  unsafeWindow.EliteFramework = FRAMEWORK;

  // ═══════════════════════════════════════════════════════════════
  // 🎬 AUTO-INITIALIZE
  // ═══════════════════════════════════════════════════════════════

  const autoInit = () => {
    // Check if we should auto-init on this domain
    const autoInitEnabled = GM_getValue('elite_auto_init', true);
    
    if (autoInitEnabled) {
      FrameworkInit.init();
    } else {
      console.log('[Elite XSS] Auto-init disabled. Call EliteXSS.init() manually.');
      
      // Show minimal UI to allow manual init
      const initButton = document.createElement('div');
      initButton.id = 'elite-init-button';
      initButton.innerHTML = '🎯';
      initButton.title = 'Click to initialize Elite XSS Framework';
      initButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        z-index: 2147483647;
        transition: transform 0.3s, box-shadow 0.3s;
      `;
      
      initButton.addEventListener('mouseenter', () => {
        initButton.style.transform = 'scale(1.1)';
        initButton.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
      });
      
      initButton.addEventListener('mouseleave', () => {
        initButton.style.transform = 'scale(1)';
        initButton.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
      });
      
      initButton.addEventListener('click', () => {
        initButton.remove();
        FrameworkInit.init();
      });
      
      document.body?.appendChild(initButton);
    }
  };

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    setTimeout(autoInit, 500);
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (window.EliteSync) {
      EliteSync.cleanup();
    }
    
    if (window.EliteOrchestrator) {
      EliteOrchestrator.stop();
    }
  });

  // Global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+E: Open Dashboard
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
      e.preventDefault();
      if (window.EliteDashboard) {
        EliteDashboard.toggle();
      }
    }
    
    // Ctrl+Shift+S: Open Settings
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      if (window.EliteSettings) {
        EliteSettings.toggle();
      }
    }
    
    // Ctrl+Shift+R: Open Results
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      if (window.EliteResults) {
        EliteResults.toggle();
      }
    }
  });

})();