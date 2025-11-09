/**
 * @file obfuscation.js
 * @description Advanced JavaScript obfuscation techniques
 * @version 8.0.0
 */

(function() {
    'use strict';

    class Obfuscation {
        constructor() {
            this.techniques = this.initializeTechniques();
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Initialize Obfuscation Techniques
        // ═══════════════════════════════════════════════════════════════
        initializeTechniques() {
            return {
                stringConcat: this.stringConcatenation,
                charCodeArray: this.charCodeArray,
                evalBase64: this.evalBase64,
                constructorChain: this.constructorChain,
                propertyAccess: this.propertyAccess,
                hexEscape: this.hexEscape,
                unicodeEscape: this.unicodeEscape,
                templateLiterals: this.templateLiterals,
                arrowFunction: this.arrowFunction,
                iife: this.immediatelyInvokedFunctionExpression,
                jsonParse: this.jsonParse,
                regexObfuscation: this.regexObfuscation,
                commentInjection: this.commentInjection,
                whitespaceManipulation: this.whitespaceManipulation,
                variableRenaming: this.variableRenaming,
                deadCodeInjection: this.deadCodeInjection,
                controlFlowFlattening: this.controlFlowFlattening,
                stringArray: this.stringArray,
                numberObfuscation: this.numberObfuscation,
                booleanObfuscation: this.booleanObfuscation
            };
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎨 String Obfuscation Techniques
        // ═══════════════════════════════════════════════════════════════
        stringConcatenation(code) {
            // Split strings and concatenate with +
            return code.replace(/'([^']+)'/g, (match, str) => {
                return str.split('').map(c => `'${c}'`).join('+');
            });
        }

        charCodeArray(code) {
            // Convert string to array of character codes
            const chars = code.split('');
            const codes = chars.map(c => c.charCodeAt(0)).join(',');
            return `String.fromCharCode(${codes})`;
        }

        evalBase64(code) {
            // Encode in base64 and eval
            const encoded = btoa(code);
            return `eval(atob('${encoded}'))`;
        }

        hexEscape(code) {
            // Convert to hex escape sequences
            return code.split('').map(c => {
                return '\\x' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('');
        }

        unicodeEscape(code) {
            // Convert to unicode escape sequences
            return code.split('').map(c => {
                return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
            }).join('');
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔧 Constructor & Property Access Obfuscation
        // ═══════════════════════════════════════════════════════════════
        constructorChain(code) {
            // Use constructor property chain
            return `[].constructor.constructor('${code}')()`;
        }

        propertyAccess(code) {
            // Replace dot notation with bracket notation
            return code.replace(/(\w+)\.(\w+)/g, (match, obj, prop) => {
                return `${obj}['${prop}']`;
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎭 Advanced Obfuscation Techniques
        // ═══════════════════════════════════════════════════════════════
        templateLiterals(code) {
            // Use template literals with expressions
            return code.replace(/'([^']+)'/g, (match, str) => {
                return '`' + str.split('').map(c => `${'\\x' + c.charCodeAt(0).toString(16)}`).join('') + '`';
            });
        }

        arrowFunction(code) {
            // Wrap in arrow function
            return `(()=>{${code}})()`;
        }

        immediatelyInvokedFunctionExpression(code) {
            // Wrap in IIFE
            return `(function(){${code}})()`;
        }

        jsonParse(code) {
            // Use JSON.parse for string obfuscation
            const jsonStr = JSON.stringify(code);
            return `JSON.parse(${jsonStr})`;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🧩 Regex & Comment Obfuscation
        // ═══════════════════════════════════════════════════════════════
        regexObfuscation(code) {
            // Use regex for string manipulation
            return code.replace(/['"]([^'"]+)['"]/g, (match, str) => {
                return `/${str}/.source`;
            });
        }

        commentInjection(code) {
            // Inject comments between code
            return code.split('').map((c, i) => {
                if (i % 5 === 0) return `/**/` + c;
                return c;
            }).join('');
        }

        whitespaceManipulation(code) {
            // Replace whitespace with different characters
            return code
                .replace(/ /g, '\t')
                .replace(/\n/g, '\r\n');
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Variable & Control Flow Obfuscation
        // ═══════════════════════════════════════════════════════════════
        variableRenaming(code) {
            // Rename variables to confusing names
            const vars = code.match(/\b([a-z_][a-zA-Z0-9_]*)\b/g) || [];
            const uniqueVars = [...new Set(vars)];
            
            let obfuscated = code;
            uniqueVars.forEach((v, i) => {
                const newName = '_0x' + i.toString(16);
                obfuscated = obfuscated.replace(new RegExp(`\\b${v}\\b`, 'g'), newName);
            });
            
            return obfuscated;
        }

        deadCodeInjection(code) {
            // Inject dead code branches
            const deadCode = `
                if (false) {
                    console.log('Never executed');
                }
            `;
            return deadCode + code;
        }

        controlFlowFlattening(code) {
            // Flatten control flow (simplified)
            return `
                var _0x1 = 0;
                while (true) {
                    switch (_0x1) {
                        case 0:
                            ${code}
                            _0x1 = 1;
                            break;
                        case 1:
                            return;
                    }
                }
            `;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔢 String Array & Number Obfuscation
        // ═══════════════════════════════════════════════════════════════
        stringArray(code) {
            // Store strings in array and reference by index
            const strings = code.match(/'([^']+)'/g) || [];
            const uniqueStrings = [...new Set(strings)];
            
            let obfuscated = code;
            const arrayName = '_0xStrings';
            const arrayDeclaration = `var ${arrayName} = [${uniqueStrings.join(',')}];`;
            
            uniqueStrings.forEach((str, i) => {
                obfuscated = obfuscated.replace(str, `${arrayName}[${i}]`);
            });
            
            return arrayDeclaration + obfuscated;
        }

        numberObfuscation(code) {
            // Obfuscate numbers
            return code.replace(/\b(\d+)\b/g, (match, num) => {
                const n = parseInt(num);
                // Use bitwise operations
                return `(${n}^0)`;
            });
        }

        booleanObfuscation(code) {
            // Obfuscate booleans
            return code
                .replace(/\btrue\b/g, '!![]')
                .replace(/\bfalse\b/g, '![]');
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎨 Complex Obfuscation Chains
        // ═══════════════════════════════════════════════════════════════
        obfuscateChain(code, techniques = []) {
            let result = code;
            
            for (const technique of techniques) {
                const method = this.techniques[technique];
                if (method) {
                    result = method.call(this, result);
                }
            }
            
            return result;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🚀 Advanced Obfuscation Patterns
        // ═══════════════════════════════════════════════════════════════
        jsFuckStyle(code) {
            // Simplified JSFuck-style obfuscation
            const basics = {
                'false': '![]',
                'true': '!![]',
                'undefined': '[][[]]',
                'NaN': '+[![]]',
                'Infinity': '+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]]+[+[]])'
            };

            let result = code;
            Object.entries(basics).forEach(([key, value]) => {
                result = result.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
            });

            return result;
        }

        aaencode(text) {
            // Simplified aaencode implementation
            const encoded = [];
            for (let i = 0; i < text.length; i++) {
                const c = text.charCodeAt(i);
                encoded.push('ﾟωﾟﾉ=/｀ｍ´）ﾉ~┻━┻//*´∇｀*/');
            }
            return encoded.join('');
        }

        jjEncode(code) {
            // Simplified JJEncode
            const globalVar = '$';
            const encoded = code.split('').map((char, i) => {
                return `${globalVar}[${i}]`;
            }).join('+');
            
            return `${globalVar}="${code}";eval(${encoded})`;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Context-Specific Obfuscation
        // ═══════════════════════════════════════════════════════════════
        obfuscateForContext(code, context) {
            const strategies = {
                'html': () => this.obfuscateChain(code, ['hexEscape', 'commentInjection']),
                'javascript': () => this.obfuscateChain(code, ['evalBase64', 'constructorChain']),
                'attribute': () => this.obfuscateChain(code, ['unicodeEscape', 'charCodeArray']),
                'url': () => this.obfuscateChain(code, ['evalBase64']),
                'aggressive': () => this.obfuscateChain(code, [
                    'stringArray',
                    'variableRenaming',
                    'controlFlowFlattening',
                    'deadCodeInjection'
                ])
            };

            const strategy = strategies[context];
            return strategy ? strategy() : code;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔍 Anti-Debug Techniques
        // ═══════════════════════════════════════════════════════════════
        antiDebug(code) {
            const antiDebugCode = `
                (function() {
                    var _0x1 = function() {
                        var _0x2 = function() {
                            return 'dev' + 'tools';
                        };
                        var _0x3 = function() {
                            return 'open';
                        };
                        var _0x4 = new RegExp(_0x2() + _0x3());
                        return _0x4.test(navigator.userAgent);
                    };
                    
                    if (_0x1()) {
                        while (true) {
                            debugger;
                        }
                    }
                })();
                
                ${code}
            `;
            
            return antiDebugCode;
        }

        domainLock(code, domain) {
            const lockCode = `
                (function() {
                    if (window.location.hostname !== '${domain}') {
                        throw new Error('Invalid domain');
                    }
                })();
                
                ${code}
            `;
            
            return lockCode;
        }

        timeBomb(code, expiryDate) {
            const bombCode = `
                (function() {
                    if (Date.now() > ${expiryDate.getTime()}) {
                        throw new Error('Code expired');
                    }
                })();
                
                ${code}
            `;
            
            return bombCode;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🧪 Obfuscation Testing
        // ═══════════════════════════════════════════════════════════════
        testObfuscation(original, obfuscated) {
            try {
                // Test if obfuscated code is functionally equivalent
                const originalResult = eval(original);
                const obfuscatedResult = eval(obfuscated);
                
                return {
                    success: true,
                    functionallyEquivalent: originalResult === obfuscatedResult,
                    originalLength: original.length,
                    obfuscatedLength: obfuscated.length,
                    ratio: (obfuscated.length / original.length).toFixed(2)
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // 📊 Generate All Obfuscation Variants
        // ═══════════════════════════════════════════════════════════════
        generateAllVariants(code) {
            const variants = [];

            for (const [name, technique] of Object.entries(this.techniques)) {
                try {
                    const obfuscated = technique.call(this, code);
                    variants.push({
                        name: name,
                        obfuscated: obfuscated,
                        original: code,
                        length: obfuscated.length
                    });
                } catch (error) {
                    console.error(`Obfuscation ${name} failed:`, error);
                }
            }

            return variants.sort((a, b) => b.length - a.length);
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎲 Random Obfuscation
        // ═══════════════════════════════════════════════════════════════
        randomObfuscate(code, complexity = 3) {
            const techniques = Object.keys(this.techniques);
            const selected = [];

            for (let i = 0; i < complexity; i++) {
                const random = techniques[Math.floor(Math.random() * techniques.length)];
                if (!selected.includes(random)) {
                    selected.push(random);
                }
            }

            return this.obfuscateChain(code, selected);
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔧 Main Obfuscation Entry Point
        // ═══════════════════════════════════════════════════════════════
        obfuscate(code, options = {}) {
            const {
                techniques = ['stringConcat', 'evalBase64'],
                context = 'javascript',
                complexity = 'medium',
                antiDebug = false,
                domainLock: lockDomain = null,
                expiryDate = null
            } = options;

            let result = code;

            // Apply selected techniques
            if (techniques.length > 0) {
                result = this.obfuscateChain(result, techniques);
            } else {
                // Use context-specific obfuscation
                result = this.obfuscateForContext(result, context);
            }

            // Apply anti-debug
            if (antiDebug) {
                result = this.antiDebug(result);
            }

            // Apply domain lock
            if (lockDomain) {
                result = this.domainLock(result, lockDomain);
            }

            // Apply time bomb
            if (expiryDate) {
                result = this.timeBomb(result, expiryDate);
            }

            return result;
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    const instance = new Obfuscation();

    exports.Obfuscation = Obfuscation;
    exports.obfuscate = (code, options) => instance.obfuscate(code, options);
    exports.generateAllVariants = (code) => instance.generateAllVariants(code);
    exports.randomObfuscate = (code, complexity) => instance.randomObfuscate(code, complexity);
})();