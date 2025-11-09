/**
 * Elite XSS Framework - Test Script
 * 
 * Simple test script to verify framework functionality.
 */

// Test the framework initialization
console.log('[Elite XSS Test] Starting framework test...');

// Check if the framework is available
if (typeof window.EliteXSSFramework !== 'undefined') {
    console.log('[Elite XSS Test] ✅ Framework class is available');
} else {
    console.log('[Elite XSS Test] ❌ Framework class is not available');
}

// Check if the global instance is available
if (typeof window.EliteXSS !== 'undefined') {
    console.log('[Elite XSS Test] ✅ Global framework instance is available');
} else {
    console.log('[Elite XSS Test] ❌ Global framework instance is not available');
}

// Test core module classes
const coreModules = [
    'XSSEngine', 
    'XSSDetection', 
    'XSSInjection', 
    'XSSValidator', 
    'XSSOrchestrator'
];

coreModules.forEach(module => {
    if (typeof window[module] !== 'undefined') {
        console.log(`[Elite XSS Test] ✅ ${module} is available`);
    } else {
        console.log(`[Elite XSS Test] ❌ ${module} is not available`);
    }
});

// Test utility classes
const utilModules = [
    'Logger',
    'StorageUtil',
    'SyncUtil',
    'EncoderUtil',
    'ReporterUtil'
];

utilModules.forEach(module => {
    if (typeof window[module] !== 'undefined') {
        console.log(`[Elite XSS Test] ✅ ${module} is available`);
    } else {
        console.log(`[Elite XSS Test] ❌ ${module} is not available`);
    }
});

// Test if document is ready
if (document.readyState === 'loading') {
    console.log('[Elite XSS Test] 📄 Document is still loading');
} else {
    console.log('[Elite XSS Test] ✅ Document is ready');
}

console.log('[Elite XSS Test] Framework test completed');