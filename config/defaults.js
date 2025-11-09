/**
 * @file defaults.js
 * @description Default configuration for Elite XSS Framework
 * @version 8.0.0
 */

(function() {
    'use strict';

    const DEFAULTS = {
        // ═══════════════════════════════════════════════════════════════
        // 🎯 Scanning Configuration
        // ═══════════════════════════════════════════════════════════════
        scanning: {
            maxConcurrent: 5,
            requestTimeout: 10000,
            delayBetweenTests: 100,
            retryAttempts: 2,
            respectRobots: true,
            maxRequestsPerSecond: 10,
            scanDepth: 3,
            followRedirects: true,
            maxRedirects: 5,
            userAgent: 'Elite-XSS-Framework/8.0',
            
            // Target selection
            scanForms: true,
            scanInputs: true,
            scanURLParams: true,
            scanDOM: true,
            scanAjax: false,
            scanWebSocket: false,
            scanPostMessage: false,
            scanCookies: false,
            scanLocalStorage: false,
            scanHeaders: false,
            
            // Scan modes
            quickScan: {
                enabled: false,
                maxTests: 50,
                priorityPayloads: true
            },
            
            deepScan: {
                enabled: false,
                maxTests: 1000,
                allPayloads: true,
                mutation: true,
                encoding: true
            },
            
            stealthScan: {
                enabled: false,
                maxConcurrent: 1,
                delay: 2000,
                randomDelay: true
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 💉 Payload Configuration
        // ═══════════════════════════════════════════════════════════════
        payloads: {
            categories: {
                base: true,
                advanced: true,
                wafBypass: true,
                prototypePollution: false,
                domClobbering: false,
                mutationXSS: false
            },
            
            encoding: {
                enabled: true,
                schemes: ['html', 'url', 'unicode', 'hex'],
                multilayer: false,
                maxLayers: 3
            },
            
            obfuscation: {
                enabled: false,
                level: 'medium', // low, medium, high, extreme
                techniques: ['stringConcat', 'charCode', 'eval']
            },
            
            contextAware: true,
            dynamicGeneration: true,
            customPayloads: true,
            
            filtering: {
                minLength: 5,
                maxLength: 1000,
                excludePatterns: [],
                onlyPatterns: []
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🛡️ Bypass Configuration
        // ═══════════════════════════════════════════════════════════════
        bypass: {
            autoDetectWAF: true,
            autoBypass: false,
            wafFingerprinting: true,
            
            techniques: {
                caseManipulation: true,
                encoding: true,
                nullBytes: true,
                comments: true,
                whitespace: true,
                concatenation: true
            },
            
            targeted: {
                cloudflare: true,
                akamai: true,
                awsWAF: true,
                modsecurity: true,
                imperva: true,
                wordfence: true
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🔍 Detection Configuration
        // ═══════════════════════════════════════════════════════════════
        detection: {
            methods: ['dom', 'response', 'timing', 'error'],
            
            dom: {
                enabled: true,
                checkScriptExecution: true,
                checkDOMChanges: true,
                checkConsoleOutput: true
            },
            
            response: {
                enabled: true,
                checkReflection: true,
                checkHeaders: true,
                checkStatusCode: true
            },
            
            timing: {
                enabled: false,
                threshold: 100,
                samples: 10
            },
            
            error: {
                enabled: true,
                checkJSErrors: true,
                checkConsoleErrors: true
            },
            
            confidence: {
                high: ['dom', 'response'],
                medium: ['timing'],
                low: ['error']
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 👁️ Blind XSS Configuration
        // ═══════════════════════════════════════════════════════════════
        blindXSS: {
            enabled: false,
            callbackUrl: '',
            exfiltrate: ['cookies', 'localStorage', 'dom'],
            screenshot: false,
            keylogger: false,
            persistent: false,
            
            verification: {
                enabled: true,
                checkInterval: 60000, // 1 minute
                maxChecks: 10
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🎨 UI Configuration
        // ═══════════════════════════════════════════════════════════════
        ui: {
            theme: 'dark', // dark, light, auto
            position: 'bottom-right', // top-left, top-right, bottom-left, bottom-right
            minimized: false,
            notifications: true,
            sounds: false,
            autoSave: true,
            
            dashboard: {
                showProgress: true,
                showStats: true,
                showLogs: true,
                maxLogEntries: 100
            },
            
            results: {
                groupBy: 'severity', // severity, type, target
                sortBy: 'timestamp', // timestamp, severity, name
                filterBy: 'all', // all, vulnerable, safe
                showEvidence: true,
                showRecommendations: true
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 📊 Reporting Configuration
        // ═══════════════════════════════════════════════════════════════
        reporting: {
            autoGenerate: false,
            format: 'json', // json, html, pdf, xml, csv
            
            include: {
                summary: true,
                vulnerabilities: true,
                evidence: true,
                recommendations: true,
                payloads: true,
                timeline: true,
                statistics: true
            },
            
            export: {
                burpSuite: false,
                markdown: false,
                jira: false
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🔔 Notification Configuration
        // ═══════════════════════════════════════════════════════════════
        notifications: {
            enabled: true,
            desktop: true,
            sound: false,
            
            on: {
                scanStart: false,
                scanComplete: true,
                vulnerabilityFound: true,
                wafDetected: true,
                error: true
            },
            
            webhooks: {
                enabled: false,
                urls: [],
                format: 'slack' // slack, discord, teams, generic
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 💾 Storage Configuration
        // ═══════════════════════════════════════════════════════════════
        storage: {
            enabled: true,
            maxResults: 1000,
            resultExpiry: 604800000, // 7 days in ms
            compress: true,
            
            sync: {
                enabled: true,
                crossTab: true,
                cloudSync: false
            },
            
            cache: {
                enabled: true,
                expiry: 3600000, // 1 hour
                payloads: true,
                results: false
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🔒 Security Configuration
        // ═══════════════════════════════════════════════════════════════
        security: {
            safeMode: false,
            requireConfirmation: false,
            
            limits: {
                maxPayloadSize: 10000,
                maxTargets: 100,
                maxTestsPerTarget: 1000
            },
            
            blacklist: {
                enabled: false,
                domains: [],
                patterns: []
            },
            
            whitelist: {
                enabled: false,
                domains: [],
                patterns: []
            },
            
            privacy: {
                doNotTrack: true,
                anonymizeData: false,
                telemetry: false
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🔧 Advanced Configuration
        // ═══════════════════════════════════════════════════════════════
        advanced: {
            debugMode: false,
            verboseLogging: false,
            experimentalFeatures: false,
            
            performance: {
                enableWorkers: false,
                lazy LoadModules: true,
                cacheResults: true
            },
            
            compatibility: {
                legacyBrowsers: false,
                polyfills: false
            },
            
            integrations: {
                burpSuite: false,
                zap: false,
                customAPI: false
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Testing Profiles
        // ═══════════════════════════════════════════════════════════════
        profiles: {
            current: 'balanced',
            
            available: {
                minimal: {
                    name: 'Minimal',
                    description: 'Minimal testing with basic payloads',
                    maxTests: 20,
                    payloadCategories: ['base'],
                    encoding: false,
                    bypass: false
                },
                
                balanced: {
                    name: 'Balanced',
                    description: 'Balanced approach with moderate coverage',
                    maxTests: 100,
                    payloadCategories: ['base', 'advanced'],
                    encoding: true,
                    bypass: true
                },
                
                comprehensive: {
                    name: 'Comprehensive',
                    description: 'Thorough testing with all techniques',
                    maxTests: 1000,
                    payloadCategories: ['base', 'advanced', 'wafBypass', 'mutationXSS'],
                    encoding: true,
                    bypass: true,
                    mutation: true
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 📝 Metadata
        // ═══════════════════════════════════════════════════════════════
        metadata: {
            version: '8.0.0',
            author: 'Elite Security Research Team',
            license: 'MIT',
            repository: 'https://github.com/elite-xss/framework',
            documentation: 'https://docs.elite-xss.com',
            
            lastUpdated: '2025-01-09',
            configVersion: 1
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // 🎯 Helper Functions
    // ═══════════════════════════════════════════════════════════════════
    
    function getDefaults() {
        return JSON.parse(JSON.stringify(DEFAULTS)); // Deep copy
    }

    function getDefault(path) {
        const keys = path.split('.');
        let value = DEFAULTS;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }

    function mergeWithDefaults(userConfig) {
        return deepMerge(getDefaults(), userConfig);
    }

    function deepMerge(target, source) {
        const output = Object.assign({}, target);
        
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        
        return output;
    }

    function isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    function validateConfig(config) {
        const errors = [];
        
        // Validate required fields
        if (!config.metadata || !config.metadata.version) {
            errors.push('Missing metadata.version');
        }
        
        // Validate value ranges
        if (config.scanning && config.scanning.maxConcurrent) {
            if (config.scanning.maxConcurrent < 1 || config.scanning.maxConcurrent > 20) {
                errors.push('scanning.maxConcurrent must be between 1 and 20');
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    exports.DEFAULTS = DEFAULTS;
    exports.getDefaults = getDefaults;
    exports.getDefault = getDefault;
    exports.mergeWithDefaults = mergeWithDefaults;
    exports.validateConfig = validateConfig;
})();