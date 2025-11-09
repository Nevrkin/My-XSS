/**
 * @file encoding-schemes.js
 * @description Advanced encoding techniques for WAF bypass
 * @version 8.0.0
 */

(function() {
    'use strict';

    class EncodingSchemes {
        constructor() {
            this.encoders = this.initializeEncoders();
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Initialize All Encoding Schemes
        // ═══════════════════════════════════════════════════════════════
        initializeEncoders() {
            return {
                html: this.htmlEncode,
                htmlEntity: this.htmlEntityEncode,
                htmlEntityDecimal: this.htmlEntityDecimalEncode,
                htmlEntityHex: this.htmlEntityHexEncode,
                url: this.urlEncode,
                urlDouble: this.urlDoubleEncode,
                urlUnicode: this.urlUnicodeEncode,
                base64: this.base64Encode,
                base64Url: this.base64UrlEncode,
                hex: this.hexEncode,
                hexCss: this.hexCssEncode,
                unicode: this.unicodeEncode,
                unicodeEs6: this.unicodeEs6Encode,
                utf7: this.utf7Encode,
                utf16: this.utf16Encode,
                octal: this.octalEncode,
                jsFuck: this.jsFuckEncode,
                charCode: this.charCodeEncode,
                fromCharCode: this.fromCharCodeEncode,
                mixed: this.mixedEncode,
                nested: this.nestedEncode,
                rot13: this.rot13Encode,
                reverse: this.reverseEncode
            };
        }

        // ═══════════════════════════════════════════════════════════════
        // 📝 HTML Encoding Family
        // ═══════════════════════════════════════════════════════════════
        htmlEncode(str) {
            return str.replace(/[&<>"']/g, char => {
                const entities = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                };
                return entities[char] || char;
            });
        }

        htmlEntityEncode(str) {
            return str.split('').map(char => {
                return `&${this.getEntityName(char)};`;
            }).join('');
        }

        htmlEntityDecimalEncode(str) {
            return str.split('').map(char => {
                return `&#${char.charCodeAt(0)};`;
            }).join('');
        }

        htmlEntityHexEncode(str) {
            return str.split('').map(char => {
                return `&#x${char.charCodeAt(0).toString(16)};`;
            }).join('');
        }

        getEntityName(char) {
            const entities = {
                ' ': 'nbsp', '<': 'lt', '>': 'gt', '&': 'amp',
                '"': 'quot', "'": 'apos', '©': 'copy', '®': 'reg'
            };
            return entities[char] || `#${char.charCodeAt(0)}`;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🌐 URL Encoding Family
        // ═══════════════════════════════════════════════════════════════
        urlEncode(str) {
            return encodeURIComponent(str);
        }

        urlDoubleEncode(str) {
            return encodeURIComponent(encodeURIComponent(str));
        }

        urlUnicodeEncode(str) {
            return str.split('').map(char => {
                const code = char.charCodeAt(0);
                if (code > 127) {
                    return '%u' + ('0000' + code.toString(16)).slice(-4).toUpperCase();
                }
                return encodeURIComponent(char);
            }).join('');
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔐 Base64 Encoding Family
        // ═══════════════════════════════════════════════════════════════
        base64Encode(str) {
            try {
                return btoa(unescape(encodeURIComponent(str)));
            } catch (e) {
                return btoa(str);
            }
        }

        base64UrlEncode(str) {
            return this.base64Encode(str)
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=/g, '');
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔢 Hex Encoding Family
        // ═══════════════════════════════════════════════════════════════
        hexEncode(str) {
            return str.split('').map(char => {
                return '\\x' + ('00' + char.charCodeAt(0).toString(16)).slice(-2);
            }).join('');
        }

        hexCssEncode(str) {
            return str.split('').map(char => {
                return '\\' + char.charCodeAt(0).toString(16) + ' ';
            }).join('');
        }

        // ═══════════════════════════════════════════════════════════════
        // 🌍 Unicode Encoding Family
        // ═══════════════════════════════════════════════════════════════
        unicodeEncode(str) {
            return str.split('').map(char => {
                return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
            }).join('');
        }

        unicodeEs6Encode(str) {
            return str.split('').map(char => {
                const code = char.charCodeAt(0);
                if (code > 0xFFFF) {
                    return '\\u{' + code.toString(16) + '}';
                }
                return '\\u' + ('0000' + code.toString(16)).slice(-4);
            }).join('');
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎭 Advanced Encoding Techniques
        // ═══════════════════════════════════════════════════════════════
        utf7Encode(str) {
            // Simplified UTF-7 encoding for XSS bypass
            const encoded = btoa(str);
            return '+' + encoded.replace(/=+$/, '') + '-';
        }

        utf16Encode(str) {
            return str.split('').map(char => {
                const code = char.charCodeAt(0);
                return '%u' + ('0000' + code.toString(16)).slice(-4);
            }).join('');
        }

        octalEncode(str) {
            return str.split('').map(char => {
                return '\\' + char.charCodeAt(0).toString(8);
            }).join('');
        }

        // ═══════════════════════════════════════════════════════════════
        // 🧙 JavaScript Obfuscation Encoding
        // ═══════════════════════════════════════════════════════════════
        jsFuckEncode(str) {
            // Simplified JSFuck-style encoding (partial implementation)
            const jsfuckMap = {
                'a': '(![]+[])[+[]]',
                'b': '({}+[])[+!+[]]',
                'c': '([![]]+[][[]])[+!+[]+[+[]]]',
                'd': '([][[]]+[])[+!+[]]',
                'e': '(!![]+[])[+!+[]+!+[]+!+[]]',
                'f': '(![]+[])[+[]]',
                // ... more mappings would be here
            };

            return str.toLowerCase().split('').map(char => {
                return jsfuckMap[char] || char;
            }).join('+');
        }

        charCodeEncode(str) {
            return str.split('').map(char => {
                return char.charCodeAt(0);
            }).join(',');
        }

        fromCharCodeEncode(str) {
            const codes = this.charCodeEncode(str);
            return `String.fromCharCode(${codes})`;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎨 Mixed & Nested Encoding
        // ═══════════════════════════════════════════════════════════════
        mixedEncode(str) {
            // Mix different encoding types
            return str.split('').map((char, index) => {
                switch(index % 5) {
                    case 0: return char; // Plain
                    case 1: return `&#${char.charCodeAt(0)};`; // HTML decimal
                    case 2: return `%${char.charCodeAt(0).toString(16)}`; // URL hex
                    case 3: return `\\x${('00' + char.charCodeAt(0).toString(16)).slice(-2)}`; // Hex
                    case 4: return `\\u${('0000' + char.charCodeAt(0).toString(16)).slice(-4)}`; // Unicode
                    default: return char;
                }
            }).join('');
        }

        nestedEncode(str, levels = 3) {
            let result = str;
            for (let i = 0; i < levels; i++) {
                result = this.urlEncode(result);
            }
            return result;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔄 Transformation Encoding
        // ═══════════════════════════════════════════════════════════════
        rot13Encode(str) {
            return str.replace(/[a-zA-Z]/g, char => {
                const start = char <= 'Z' ? 65 : 97;
                return String.fromCharCode(start + (char.charCodeAt(0) - start + 13) % 26);
            });
        }

        reverseEncode(str) {
            return str.split('').reverse().join('');
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Context-Aware Encoding
        // ═══════════════════════════════════════════════════════════════
        encodeForContext(str, context) {
            const contextEncoders = {
                'html': () => this.htmlEncode(str),
                'attribute': () => this.htmlEntityEncode(str),
                'javascript': () => this.unicodeEncode(str),
                'url': () => this.urlEncode(str),
                'css': () => this.hexCssEncode(str),
                'json': () => JSON.stringify(str),
                'xml': () => this.htmlEntityEncode(str)
            };

            const encoder = contextEncoders[context];
            return encoder ? encoder() : str;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔧 Utility Methods
        // ═══════════════════════════════════════════════════════════════
        encode(str, scheme) {
            const encoder = this.encoders[scheme];
            if (!encoder) {
                console.warn(`Unknown encoding scheme: ${scheme}`);
                return str;
            }

            return encoder.call(this, str);
        }

        encodeMultiple(str, schemes) {
            return schemes.reduce((result, scheme) => {
                return this.encode(result, scheme);
            }, str);
        }

        // ═══════════════════════════════════════════════════════════════
        // 📊 Generate All Encoding Variants
        // ═══════════════════════════════════════════════════════════════
        generateAllVariants(str) {
            const variants = [];

            for (const [name, encoder] of Object.entries(this.encoders)) {
                try {
                    const encoded = encoder.call(this, str);
                    variants.push({
                        name: name,
                        encoded: encoded,
                        original: str
                    });
                } catch (error) {
                    console.error(`Encoding ${name} failed:`, error);
                }
            }

            return variants;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🧪 Test Encoding Effectiveness
        // ═══════════════════════════════════════════════════════════════
        testEncoding(str, testFunction) {
            const results = [];

            for (const [name, encoder] of Object.entries(this.encoders)) {
                try {
                    const encoded = encoder.call(this, str);
                    const effective = testFunction(encoded);
                    
                    results.push({
                        scheme: name,
                        encoded: encoded,
                        effective: effective
                    });
                } catch (error) {
                    results.push({
                        scheme: name,
                        error: error.message
                    });
                }
            }

            return results.filter(r => r.effective);
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎲 Random Encoding Selection
        // ═══════════════════════════════════════════════════════════════
        randomEncode(str, count = 3) {
            const schemes = Object.keys(this.encoders);
            const selected = [];

            for (let i = 0; i < count; i++) {
                const random = schemes[Math.floor(Math.random() * schemes.length)];
                if (!selected.includes(random)) {
                    selected.push(random);
                }
            }

            return this.encodeMultiple(str, selected);
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔍 Decode Functions (for testing)
        // ═══════════════════════════════════════════════════════════════
        decode(str, scheme) {
            const decoders = {
                html: (s) => s.replace(/&(amp|lt|gt|quot|#39);/g, m => ({
                    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'"
                })[m]),
                url: decodeURIComponent,
                base64: (s) => atob(s),
                rot13: (s) => this.rot13Encode(s), // ROT13 is its own inverse
                reverse: (s) => s.split('').reverse().join('')
            };

            const decoder = decoders[scheme];
            return decoder ? decoder(str) : str;
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    const instance = new EncodingSchemes();

    exports.EncodingSchemes = EncodingSchemes;
    exports.encode = (str, scheme) => instance.encode(str, scheme);
    exports.encodeMultiple = (str, schemes) => instance.encodeMultiple(str, schemes);
    exports.generateAllVariants = (str) => instance.generateAllVariants(str);
    exports.encodeForContext = (str, context) => instance.encodeForContext(str, context);
    exports.randomEncode = (str, count) => instance.randomEncode(str, count);
})();