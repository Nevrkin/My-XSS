/**
 * Elite XSS Framework - Example Usage
 * 
 * Example script demonstrating how to use the Elite XSS Framework.
 */

// Example 1: Basic framework initialization
console.log('=== Elite XSS Framework Example ===');

// Check if framework is available
if (window.EliteXSS) {
    console.log('✅ Elite XSS Framework is available');
    
    // Initialize the framework (if not already initialized)
    window.EliteXSS.init().then(() => {
        console.log('✅ Framework initialized');
        
        // Access core modules
        if (window.EliteXSS.modules) {
            console.log('✅ Core modules loaded:');
            console.log('   - Engine:', !!window.EliteXSS.modules.engine);
            console.log('   - Detection:', !!window.EliteXSS.modules.detection);
            console.log('   - Injection:', !!window.EliteXSS.modules.injection);
            console.log('   - Validator:', !!window.EliteXSS.modules.validator);
            console.log('   - Orchestrator:', !!window.EliteXSS.modules.orchestrator);
        }
        
        // Example 2: Using the logger
        if (window.EliteXSS.modules && window.EliteXSS.modules.logger) {
            const logger = window.EliteXSS.modules.logger;
            logger.info('This is an info message');
            logger.warn('This is a warning message');
            logger.error('This is an error message');
        }
        
        // Example 3: Using the encoder
        if (window.EliteXSS.modules && window.EliteXSS.modules.encoder) {
            const encoder = window.EliteXSS.modules.encoder;
            const testString = '<script>alert("XSS")</script>';
            console.log('Original:', testString);
            console.log('HTML Encoded:', encoder.htmlEncode(testString));
            console.log('URL Encoded:', encoder.urlEncode(testString));
            console.log('Base64 Encoded:', encoder.base64Encode(testString));
        }
        
        // Example 4: Using payloads
        if (window.EliteXSS.modules && window.EliteXSS.modules.basePayloads) {
            const payloads = window.EliteXSS.modules.basePayloads;
            payloads.init();
            const allPayloads = payloads.getAllPayloads();
            console.log(`Loaded ${allPayloads.length} base payloads`);
            
            // Show first 3 payloads
            allPayloads.slice(0, 3).forEach((payload, index) => {
                console.log(`  ${index + 1}. ${payload.name}: ${payload.payload}`);
            });
        }
        
        // Example 5: Using the reporter
        if (window.EliteXSS.modules && window.EliteXSS.modules.reporter) {
            const reporter = window.EliteXSS.modules.reporter;
            const sampleResults = [
                {
                    severity: 'high',
                    url: 'https://example.com/vulnerable',
                    parameter: 'input',
                    payload: '<script>alert(1)</script>',
                    description: 'Basic XSS vulnerability'
                },
                {
                    severity: 'medium',
                    url: 'https://example.com/form',
                    parameter: 'query',
                    payload: '" onmouseover="alert(1)',
                    description: 'Attribute-based XSS'
                }
            ];
            
            const report = reporter.generateReport(sampleResults);
            console.log('Generated sample report with', report.summary.total, 'vulnerabilities');
        }
    }).catch((error) => {
        console.error('❌ Framework initialization failed:', error);
    });
} else {
    console.log('❌ Elite XSS Framework is not available');
    console.log('Please ensure the framework is properly loaded');
}

// Example 6: Event listeners
document.addEventListener('xss-framework-ready', () => {
    console.log('🎯 Framework is ready for use');
});

document.addEventListener('xss-vulnerability-found', (event) => {
    console.log('🚨 Vulnerability detected:', event.detail);
});

document.addEventListener('xss-scan-started', (event) => {
    console.log('🔍 Scan started for:', event.detail.target);
});

console.log('=== End of Example ===');