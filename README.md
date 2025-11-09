# Elite XSS Framework v8.0

**Advanced XSS Testing Framework - Top 0.1% Techniques**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-8.0.0-brightgreen.svg)](#)
[![Tampermonkey](https://img.shields.io/badge/tampermonkey-required-orange.svg)](https://www.tampermonkey.net/)

## 🎯 Overview

The Elite XSS Framework is a cutting-edge cross-site scripting testing platform designed for security professionals and researchers. It incorporates advanced methodologies known only to elite security researchers while maintaining clean, maintainable code.

## 🚀 Key Features

### Advanced Methodologies (Top 0.1%)
- **Context-Aware Testing**: Automatically detects injection context (HTML, JS, CSS, SVG, etc.)
- **Mutation XSS Detection**: Advanced mXSS vectors that bypass sanitizers
- **Prototype Pollution**: Tests for prototype pollution vulnerabilities
- **DOM Clobbering**: Automated DOM clobbering vector generation
- **CSP Bypass Techniques**: Advanced CSP bypass strategies
- **WAF Fingerprinting**: Identifies and bypasses WAF/IDS/IPS
- **Blind XSS Infrastructure**: Out-of-band testing with callback server
- **Polyglot Payloads**: Multi-context exploitation vectors
- **Template Injection**: SSTI/CSTI detection and exploitation
- **Unicode Normalization**: Tests normalization vulnerabilities

### Architecture Benefits
- **Modular Design**: Each component is independent and testable
- **Lazy Loading**: Modules loaded on-demand for performance
- **Hot Reload**: Update modules without page refresh
- **Event-Driven**: Loosely coupled communication
- **Extensible**: Plugin architecture for custom modules
- **Professional UI**: Material Design-inspired interface
- **Multi-Tab Coordination**: Distributed testing across tabs
- **Real-Time Sync**: Live updates across instances
- **Advanced Reporting**: Comprehensive vulnerability reports
- **Zero Dependencies**: Pure vanilla JavaScript

## 📁 Project Structure

```
elite-xss-framework/
├── 📄 loader.user.js                    # Main TamperMonkey loader
├── 📁 core/
│   ├── 📄 engine.js                     # Core testing engine
│   ├── 📄 detection.js                  # Advanced detection system
│   ├── 📄 injection.js                  # Injection engine
│   ├── 📄 validator.js                  # Security validator
│   └── 📄 orchestrator.js               # Test orchestrator
├── 📁 modules/
│   ├── 📄 endpoint-discovery.js         # Endpoint scanning
│   ├── 📄 payload-manager.js            # Payload management
│   ├── 📄 bypass-engine.js              # WAF/Filter bypass
│   ├── 📄 mutation-fuzzer.js            # Advanced payload mutation
│   ├── 📄 context-analyzer.js           # Context-aware testing
│   └── 📄 polyglot-generator.js         # Polyglot payload creation
├── 📁 ui/
│   ├── 📄 dashboard.js                  # Main dashboard
│   ├── 📄 settings-panel.js             # Settings interface
│   ├── 📄 results-viewer.js             # Results display
│   ├── 📄 live-monitor.js               # Real-time monitoring
│   └── 📄 styles.js                     # Consolidated styles
├── 📁 utils/
│   ├── 📄 logger.js                     # Logging system
│   ├── 📄 storage.js                    # Data persistence
│   ├── 📄 sync.js                       # Multi-tab sync
│   ├── 📄 encoder.js                    # Encoding utilities
│   └── 📄 reporter.js                   # Report generation
├── 📁 payloads/
│   ├── 📄 base-payloads.js              # Base payload library
│   ├── 📄 advanced-payloads.js          # Advanced vectors
│   ├── 📄 waf-bypass.js                 # WAF bypass techniques
│   ├── 📄 prototype-pollution.js        # Prototype pollution vectors
│   ├── 📄 dom-clobbering.js             # DOM clobbering payloads
│   └── 📄 mutation-xss.js               # mXSS vectors
├── 📁 techniques/
│   ├── 📄 encoding-schemes.js           # Multiple encoding methods
│   ├── 📄 obfuscation.js                # Code obfuscation
│   ├── 📄 timing-attacks.js             # Timing-based detection
│   ├── 📄 blind-xss.js                  # Blind XSS techniques
│   └── 📄 csp-bypass.js                 # CSP bypass strategies
├── 📁 integrations/
│   ├── 📄 burp-export.js                # Burp Suite integration
│   ├── 📄 webhook-notify.js             # Webhook notifications
│   └── 📄 api-connector.js              # External API integration
└── 📁 config/
    ├── 📄 defaults.js                   # Default configuration
    ├── 📄 endpoints.js                  # Endpoint definitions
    └── 📄 profiles.js                   # Testing profiles
```

## 🛠 Installation

### Method 1: Tampermonkey (Recommended)

1. Install [Tampermonkey](https://www.tampermonkey.net/) extension in your browser
2. Create a new userscript
3. Copy the contents of `loader.user.js` into the userscript
4. Save and enable the script

### Method 2: Local Development

```bash
# Clone the repository
git clone https://github.com/Nevrkin/My-XSS.git
cd My-XSS

# Install dependencies (if any)
npm install

# Build the project (if needed)
npm run build
```

## 🎯 Usage

1. Navigate to any website
2. Press `Ctrl+Shift+X` to open the dashboard
3. Configure your scan settings
4. Start testing for XSS vulnerabilities

## ⌨️ Keyboard Shortcuts

- `Ctrl+Shift+X` - Toggle Dashboard
- `Ctrl+Shift+T` - Quick Test
- `Ctrl+Shift+S` - Toggle Safe Mode

## 📦 Development

### Project Setup

```bash
# Clone the repository
git clone https://github.com/Nevrkin/My-XSS.git
cd My-XSS

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Module Structure

Each module follows a consistent pattern:

```javascript
class ModuleName {
    constructor() {
        // Module initialization
    }
    
    init() {
        // Initialize module
    }
    
    // Module methods
}

// Export for use in other modules
window.ModuleName = ModuleName;
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Run specific test
npm test -- test/module.test.js
```

## 📤 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Legal Disclaimer

This tool is intended for educational and authorized security testing purposes only. Users must obtain proper authorization before testing any websites or applications. The authors are not responsible for any misuse or damage caused by this tool.

## 🤝 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check existing issues and documentation
- Contact the maintainers

## 📋 Recent Fixes

### v8.0.1 - Module Loading Fixes
- **Fixed Path Mapping**: Corrected UI module loading paths (`ui/` directory)
- **Added Fallback Methods**: Dashboard toggle method with multiple fallback options
- **Error Handling**: Improved error handling for 404 module loading
- **Corrupted Files**: Fixed corrupted `ui/styles.js` file
- **Enhanced Reliability**: Added simple dashboard fallback for module loading failures

---

**⚠️ Important**: This tool should only be used on websites you own or have explicit permission to test. Unauthorized testing may violate laws and terms of service.