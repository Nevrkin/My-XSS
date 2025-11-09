/**
 * @file endpoints.js
 * @description API and service endpoints configuration
 * @version 8.0.0
 */

(function() {
    'use strict';

    const ENDPOINTS = {
        // ═══════════════════════════════════════════════════════════════
        // 🌐 Framework Services
        // ═══════════════════════════════════════════════════════════════
        framework: {
            updateCheck: 'https://api.github.com/repos/Nevrkin/My-XSS/releases/latest',
            payloadLibrary: 'https://raw.githubusercontent.com/Nevrkin/My-XSS/main/payloads/',
            documentation: 'https://docs.elite-xss.com',
            support: 'https://support.elite-xss.com',
            community: 'https://discord.gg/elite-xss',
            issues: 'https://github.com/Nevrkin/My-XSS/issues'
        },

        // ═══════════════════════════════════════════════════════════════
        // 🔌 Integration Endpoints
        // ═══════════════════════════════════════════════════════════════
        integrations: {
            burpSuite: 'http://localhost:8080/burp',
            webhook: 'https://hooks.example.com/xss',
            slack: 'https://hooks.slack.com/services/',
            discord: 'https://discord.com/api/webhooks/',
            teams: 'https://outlook.office.com/webhook/',
            custom: []
        },

        // ═══════════════════════════════════════════════════════════════
        // 👁️ Blind XSS Services
        // ═══════════════════════════════════════════════════════════════
        blindXSS: {
            defaultCallback: 'https://xss.example.com/callback',
            alternatives: [
                'https://xsshunter.com/api/record',
                'https://ezxss.example.com/callback',
                'https://burpcollaborator.net'
            ]
        },

        // ═══════════════════════════════════════════════════════════════
        // 🎯 JSONP Endpoints (for CSP bypass)
        // ═══════════════════════════════════════════════════════════════
        jsonp: {
            google: [
                'https://www.google.com/complete/search?client=chrome&jsonp=',
                'https://accounts.google.com/o/oauth2/revoke?callback=',
                'https://www.googleapis.com/customsearch/v1?callback=',
                'https://maps.googleapis.com/maps/api/js?callback='
            ],
            youtube: [
                'https://www.youtube.com/oembed?callback='
            ],
            twitter: [
                'https://cdn.syndication.twimg.com/timeline/profile?callback='
            ],
            facebook: [
                'https://connect.facebook.net/en_US/sdk.js?callback='
            ]
        },

        // ═══════════════════════════════════════════════════════════════
        // 🛡️ WAF Detection Endpoints
        // ═══════════════════════════════════════════════════════════════
        wafDetection: {
            cloudflare: {
                identifier: 'cloudflare',
                testUrls: [
                    'https://www.cloudflare.com/cdn-cgi/trace'
                ]
            },
            akamai: {
                identifier: 'akamai',
                testUrls: []
            },
            imperva: {
                identifier: 'imperva',
                testUrls: []
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 📊 Analytics & Telemetry (Optional)
        // ═══════════════════════════════════════════════════════════════
        telemetry: {
            endpoint: 'https://telemetry.elite-xss.com/collect',
            enabled: false,
            anonymous: true
        },

        // ═══════════════════════════════════════════════════════════════
        // 🔄 CDN & Resources
        // ═══════════════════════════════════════════════════════════════
        cdn: {
            libraries: {
                html2canvas: 'https://html2canvas.hertzen.com/dist/html2canvas.min.js',
                jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
                prismjs: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js'
            },
            fonts: {
                inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // 🎯 Helper Functions
    // ═══════════════════════════════════════════════════════════════════
    
    function get(path) {
        const keys = path.split('.');
        let value = ENDPOINTS;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }

    function getAll() {
        return JSON.parse(JSON.stringify(ENDPOINTS));
    }

    function getCategory(category) {
        return ENDPOINTS[category] ? JSON.parse(JSON.stringify(ENDPOINTS[category])) : {};
    }

    function addCustomEndpoint(category, name, url) {
        if (!ENDPOINTS[category]) {
            ENDPOINTS[category] = {};
        }
        
        if (Array.isArray(ENDPOINTS[category])) {
            ENDPOINTS[category].push({ name, url });
        } else if (typeof ENDPOINTS[category] === 'object') {
            ENDPOINTS[category][name] = url;
        }
    }

    function removeCustomEndpoint(category, name) {
        if (ENDPOINTS[category] && ENDPOINTS[category][name]) {
            delete ENDPOINTS[category][name];
            return true;
        }
        return false;
    }

    function validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    function getAllJSONPEndpoints() {
        const jsonp = [];
        for (const category in ENDPOINTS.jsonp) {
            if (Array.isArray(ENDPOINTS.jsonp[category])) {
                jsonp.push(...ENDPOINTS.jsonp[category]);
            }
        }
        return jsonp;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    
    exports.ENDPOINTS = ENDPOINTS;
    exports.get = get;
    exports.getAll = getAll;
    exports.getCategory = getCategory;
    exports.addCustom = addCustomEndpoint;
    exports.removeCustom = removeCustomEndpoint;
    exports.validate = validateURL;
    exports.getAllJSONP = getAllJSONPEndpoints;
})();