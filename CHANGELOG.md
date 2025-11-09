# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [8.0.2] - 2025-11-10

### Fixed
- **Orchestrator Method Issues**: Resolved `TypeError: orchestrator.startScan is not a function` by correcting method calls
- **Dashboard Scan Functionality**: Fixed dashboard to use framework's `startScan` method instead of orchestrator module directly
- **Quick Test Implementation**: Enhanced quick test implementation with proper orchestrator initialization
- **Module Method Detection**: Improved detection of available methods in loaded modules

### Changed
- **Dashboard Integration**: Updated dashboard to properly interface with framework methods
- **Orchestrator Usage**: Corrected orchestrator usage patterns with proper dependency injection
- **Error Handling**: Enhanced error handling for module method calls

### Added
- **Framework Method Validation**: Added validation for available framework methods before calling them
- **Better Debug Information**: Improved error messages and debugging information for module issues

## [8.0.1] - 2025-11-10

### Fixed
- **Module Path Mapping**: Corrected UI module loading paths to properly map `ui/` directory
- **404 Error Resolution**: Fixed loader configuration to prevent HTTP 404 errors when loading modules
- **Dashboard Toggle Method**: Added fallback methods for dashboard toggle functionality with enhanced detection
- **Quick Test Method**: Improved orchestrator method detection with multiple fallback options
- **Corrupted Files**: Fixed corrupted `ui/styles.js` file with proper CSS styles
- **Error Handling**: Improved error handling for module loading failures with better user feedback
- **Event Listener Conflicts**: Fixed `TypeError: ev.target.closest is not a function` by using more robust event listeners
- **Keyboard Shortcut Conflicts**: Enhanced keyboard shortcut handling to avoid conflicts with other extensions

### Changed
- **Loader Configuration**: Updated module path resolution logic
- **Dashboard Initialization**: Enhanced dashboard initialization with multiple fallback methods
- **Module Loading Robustness**: Improved module loading with better error handling and fallback mechanisms
- **Event System**: Enhanced event listener robustness to avoid conflicts with other scripts

### Added
- **Enhanced Reliability**: Added robust error handling and fallback mechanisms
- **Better User Experience**: Improved error messages and user feedback
- **Module Instance Detection**: Enhanced detection of module instances and methods
- **Simple Dashboard Fallback**: Improved fallback dashboard with better module information display

## [8.0.0] - 2025-11-09

### Added
- Complete modular architecture with lazy loading
- Advanced XSS detection engine with context-aware testing
- Mutation XSS (mXSS) detection capabilities
- Prototype pollution testing module
- DOM clobbering vector generation
- CSP bypass techniques and strategies
- WAF fingerprinting and bypass mechanisms
- Blind XSS infrastructure with callback server support
- Polyglot payload generation for multi-context exploitation
- Template injection (SSTI/CSTI) detection
- Unicode normalization vulnerability testing
- Real-time monitoring dashboard with multi-tab coordination
- Advanced reporting system with multiple export formats
- Integration with Burp Suite, webhooks, and external APIs
- Comprehensive payload library with categorization
- Encoding and obfuscation techniques
- Timing-based attack methods
- Professional Material Design UI with dark/light themes
- Cross-tab synchronization via BroadcastChannel API
- Persistent storage with localStorage
- Comprehensive logging system
- Configuration profiles for different testing scenarios
- Git integration files (.gitignore, .gitattributes)
- Comprehensive documentation (README, CONTRIBUTING, etc.)

### Changed
- Updated loader to fetch modules from GitHub repository
- Improved module caching system with version control
- Enhanced security with isolated module execution
- Optimized performance with lazy loading architecture
- Refined UI/UX with responsive design
- Strengthened error handling and validation

### Fixed
- Syntax errors in configuration files
- Module loading issues
- Bracket and parentheses balancing
- Property name syntax errors
- Corrupted profile configuration files

### Removed
- Dependency on external libraries
- Complex initialization sequences
- Unnecessary permissions