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
        this.engine.init();
        this.detection.init();
        this.injection.init();
        this.validator.init();
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
                if (!this.validator.validateTarget(test.target)) {
                    console.warn(`[Elite XSS] Invalid target: ${test.target}`);
                    continue;
                }
                
                // Validate payload
                if (!this.validator.validatePayload(test.payload)) {
                    console.warn(`[Elite XSS] Invalid payload for test: ${test.id}`);
                    continue;
                }
                
                // Inject payload
                const injectionResult = this.injection.injectPayload(test.target, test.payload);
                
                // Register with engine
                this.engine.registerTest(test);
                
                // Run test
                const testResults = await this.engine.runTests();
                
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
}

// Export for use in other modules
window.XSSOrchestrator = XSSOrchestrator;