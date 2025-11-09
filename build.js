/**
 * Elite XSS Framework - Build Script
 * 
 * Simple build script to concatenate framework files.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SRC_DIR = '.';
const BUILD_DIR = 'dist';
const OUTPUT_FILE = 'elite-xss-framework.user.js';

// Create build directory if it doesn't exist
if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR);
}

// Read the loader file
const loaderContent = fs.readFileSync(path.join(SRC_DIR, 'loader.user.js'), 'utf8');

// List of framework files to include
const frameworkFiles = [
    // Core modules
    'core/engine.js',
    'core/detection.js',
    'core/injection.js',
    'core/validator.js',
    'core/orchestrator.js',
    
    // Utility modules
    'utils/logger.js',
    'utils/storage.js',
    'utils/sync.js',
    'utils/encoder.js',
    'utils/reporter.js',
    
    // UI modules
    'ui/styles.js',
    'ui/dashboard.js',
    'ui/settings-panel.js',
    'ui/results-viewer.js',
    'ui/live-monitor.js',
    
    // Payload modules
    'payloads/base-payloads.js',
    'payloads/advanced-payloads.js',
    'payloads/waf-bypass.js',
    'payloads/prototype-pollution.js',
    'payloads/dom-clobbering.js',
    'payloads/mutation-xss.js',
    
    // Technique modules
    'techniques/encoding-schemes.js',
    'techniques/obfuscation.js',
    'techniques/timing-attacks.js',
    'techniques/blind-xss.js',
    'techniques/csp-bypass.js',
    
    // Module components
    'modules/endpoint-discovery.js',
    'modules/payload-manager.js',
    'modules/bypass-engine.js',
    'modules/mutation-fuzzer.js',
    'modules/context-analyzer.js',
    'modules/polyglot-generator.js',
    
    // Integration modules
    'integrations/burp-export.js',
    'integrations/webhook-notify.js',
    'integrations/api-connector.js',
    
    // Configuration
    'config/defaults.js',
    'config/endpoints.js',
    'config/profiles.js',
    
    // Main framework
    'main.js'
];

// Start with the loader content
let bundledContent = loaderContent;

// Append each framework file
frameworkFiles.forEach(file => {
    const filePath = path.join(SRC_DIR, file);
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        // Extract just the class/function definitions (skip comments and metadata)
        const cleanContent = fileContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '') // Remove comments
                                        .replace(/^\s*[\r\n]/gm, ''); // Remove empty lines
        bundledContent += '\n\n' + cleanContent;
    } else {
        console.warn(`Warning: File not found - ${file}`);
    }
});

// Write the bundled file
const outputPath = path.join(BUILD_DIR, OUTPUT_FILE);
fs.writeFileSync(outputPath, bundledContent);

console.log(`Build completed: ${outputPath}`);
console.log(`Total files processed: ${frameworkFiles.length + 1}`);