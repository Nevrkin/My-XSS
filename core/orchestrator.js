/**
 * Elite XSS Framework - Test Orchestrator
 *
 * This module orchestrates the execution of XSS tests.
 */

class XSSOrchestrator {
    constructor(engine, detection, injection, validator) {
        this.engine = engine;
        this.detection = detection;
        this.injection = injection;
        this.validator = validator;
        this.testQueue = [];
    }

    /**
     * Initialize the orchestrator
     */
    init() {
        console.log('[Elite XSS] Test orchestrator initialized');

        // Initialize components
        if (this.engine && typeof this.engine.init === 'function') this.engine.init();
        if (this.detection && typeof this.detection.init === 'function') this.detection.init();
        if (this.injection && typeof this.injection.init === 'function') this.injection.init();
        if (this.validator && typeof this.validator.init === 'function') this.validator.init();
    }

    /**
     * Schedule a test for execution
     * @param {Object} test - Test configuration
     */
    scheduleTest(test) {
        this.testQueue.push(test);
    }

    /**
     * Execute all scheduled tests
     */
    async executeTests() {
        console.log(`[Elite XSS] Executing ${this.testQueue.length} tests`);

        const results = [];

        for (const test of this.testQueue) {
            try {
                // Validate test target
                if (this.validator && typeof this.validator.validateTarget === 'function') {
                    if (!this.validator.validateTarget(test.target)) {
                        console.warn(`[Elite XSS] Invalid target: ${test.target}`);
                        continue;
                    }
                }

                // Validate payload
                if (this.validator && typeof this.validator.validatePayload === 'function') {
                    if (!this.validator.validatePayload(test.payload)) {
                        console.warn(`[Elite XSS] Invalid payload for test: ${test.id}`);
                        continue;
                    }
                }

                // Inject payload
                let injectionResult = null;
                if (this.injection && typeof this.injection.injectPayload === 'function') {
                    injectionResult = this.injection.injectPayload(test.target, test.payload);
                }

                // Register with engine
                if (this.engine && typeof this.engine.registerTest === 'function') {
                    this.engine.registerTest(test);
                }

                // Run test
                let testResults = [];
                if (this.engine && typeof this.engine.runTests === 'function') {
                    testResults = await this.engine.runTests();
                }

                results.push({
                    test: test,
                    injection: injectionResult,
                    engineResults: testResults
                });

            } catch (error) {
                console.error(`[Elite XSS] Test execution failed: ${error.message}`);
            }
        }

        return results;
    }

    /**
     * Start a scan (compatibility method to prevent errors)
     * @param {Object} config - Scan configuration
     */
    async startScan(config) {
        console.log('[Elite XSS] Orchestrator startScan called with config:', config);
        
        // For compatibility, create a simple test and execute it
        if (config && config.url) {
            const test = {
                id: 'scan-' + Date.now(),
                target: config.url,
                payload: '<script>alert(1)</script>',
                type: 'scan'
            };
            
            this.scheduleTest(test);
            return await this.executeTests();
        }
        
        return [];
    }

    /**
     * Run quick test (compatibility method to prevent errors)
     */
    async runQuickTest() {
        console.log('[Elite XSS] Orchestrator runQuickTest called');
        
        const test = {
            id: 'quick-' + Date.now(),
            target: window.location.href,
            payload: '<script>alert(1)</script>',
            type: 'quick'
        };
        
        this.scheduleTest(test);
        return await this.executeTests();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.XSSOrchestrator = XSSOrchestrator;
}

// Module export
if (typeof exports !== 'undefined') {
    exports.XSSOrchestrator = XSSOrchestrator;
    exports.create = (engine, detection, injection, validator) => {
        return new XSSOrchestrator(engine, detection, injection, validator);
    };
}