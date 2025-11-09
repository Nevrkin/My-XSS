/**
 * @file styles.js
 * @description Consolidated UI styles
 * @version 8# 🎯 Elite XSS Framework - Modules, UI & Utils

## 📦 MODULES (6 Files)

### 1️⃣ **modules/endpoint-discovery.js**

```javascript
/**
 * @file endpoint-discovery.js
 * @description Advanced endpoint and attack surface discovery
 * @version 8.0.0
 */

(function() {
    'use strict';

    class EndpointDiscovery {
        constructor(framework) {
            this.framework = framework;
            this.discovered = new Map();
            this.scanDepth = 3;
            this.config = {
                scanForms: true,
                scanInputs: true,
                scanAjax: true,
                scanWebSocket: true,
                scanPostMessage: true,
                scanDOM: true,
                scanURLParams: true,
                scanCookies: true,
                scanLocalStorage: true,
                scanHeaders: true,
                maxDepth: 5,
                followRedirects: true,
                timeout: 15000
            };
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Main Discovery Entry Point
        // ═══════════════════════════════════════════════════════════════
        async discoverAll() {
            console.log('[Discovery] Starting comprehensive scan...');
            
            const results = {
                forms: [],
                inputs: [],
                ajax: [],
                websockets: [],
                postMessage: [],
                domSinks: [],
                urlParams: [],
                cookies: [],
                storage: [],
                headers: [],
                timestamp: new Date().toISOString()
            };

            // Parallel discovery
            await Promise.allSettled([
                this.config.scanForms && this.discoverForms().then(r => results.forms = r),
                this.config.scanInputs && this.discoverInputs().then(r => results.inputs = r),
                this.config.scanAjax && this.discoverAjaxEndpoints().then(r => results.ajax = r),
                this.config.scanWebSocket && this.discoverWebSockets().then(r => results.websockets = r),
                this.config.scanPostMessage && this.discoverPostMessage().then(r => results.postMessage = r),
                this.config.scanDOM && this.discoverDOMSinks().then(r => results.domSinks = r),
                this.config.scanURLParams && this.discoverURLParams().then(r => results.urlParams = r),
                this.config.scanCookies && this.discoverCookies().then(r => results.cookies = r),
                this.config.scanLocalStorage && this.discoverStorage().then(r => results.storage = r),
                this.config.scanHeaders && this.discoverHeaders().then(r => results.headers = r)
            ]);

            // Store results
            this.discovered.set('scan_' + Date.now(), results);
            
            this.framework.emit('discoveryComplete', results);
            
            console.log('[Discovery] ✅ Scan complete:', this.getSummary(results));
            return results;
        }

        // ───────────────────────────────────────────────────────────────
        // 📝 Form Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverForms() {
            const forms = [];
            const formElements = document.querySelectorAll('form');

            for (const form of formElements) {
                const formData = {
                    id: form.id || `form_${forms.length}`,
                    name: form.name,
                    action: form.action || window.location.href,
                    method: form.method?.toUpperCase() || 'GET',
                    enctype: form.enctype,
                    target: form.target,
                    inputs: [],
                    hasFileUpload: false,
                    hasHiddenFields: false,
                    csrfToken: null,
                    vulnerability: {
                        noCSRF: true,
                        autoComplete: form.autocomplete !== 'off',
                        targetBlank: form.target === '_blank'
                    },
                    xpath: this.getXPath(form)
                };

                // Analyze inputs
                const inputs = form.querySelectorAll('input, textarea, select');
                for (const input of inputs) {
                    const inputData = this.analyzeInput(input);
                    formData.inputs.push(inputData);
                    
                    if (input.type === 'file') formData.hasFileUpload = true;
                    if (input.type === 'hidden') formData.hasHiddenFields = true;
                    if (input.name?.match(/csrf|token|nonce/i)) formData.csrfToken = input.value;
                }

                formData.vulnerability.noCSRF = !formData.csrfToken && formData.method === 'POST';
                forms.push(formData);
            }

            return forms;
        }

        // ───────────────────────────────────────────────────────────────
        // 🔤 Input Discovery & Analysis
        // ───────────────────────────────────────────────────────────────
        async discoverInputs() {
            const inputs = [];
            const inputElements = document.querySelectorAll('input, textarea, select, [contenteditable="true"]');

            for (const input of inputElements) {
                inputs.push(this.analyzeInput(input));
            }

            return inputs;
        }

        analyzeInput(input) {
            const inputData = {
                id: input.id || `input_${Math.random().toString(36).substr(2, 9)}`,
                name: input.name,
                type: input.type || input.tagName.toLowerCase(),
                value: input.value,
                placeholder: input.placeholder,
                maxLength: input.maxLength,
                pattern: input.pattern,
                required: input.required,
                disabled: input.disabled,
                readonly: input.readOnly,
                contentEditable: input.contentEditable === 'true',
                vulnerability: {
                    noValidation: !input.pattern && !input.maxLength,
                    dangerousType: ['text', 'search', 'url', 'tel', 'email'].includes(input.type),
                    noSanitization: true, // Assumed until proven otherwise
                    reflected: this.checkReflection(input)
                },
                context: this.getInputContext(input),
                xpath: this.getXPath(input),
                attributes: this.getAttributes(input)
            };

            return inputData;
        }

        // ───────────────────────────────────────────────────────────────
        // 🌐 AJAX Endpoint Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverAjaxEndpoints() {
            const endpoints = new Set();
            const ajaxData = [];

            // Hook fetch
            const originalFetch = unsafeWindow.fetch;
            unsafeWindow.fetch = function(...args) {
                const url = args[0];
                const options = args[1] || {};
                
                endpoints.add(JSON.stringify({
                    url: url.toString(),
                    method: options.method || 'GET',
                    type: 'fetch'
                }));
                
                return originalFetch.apply(this, args);
            };

            // Hook XMLHttpRequest
            const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
            unsafeWindow.XMLHttpRequest.prototype.open = function(method, url) {
                endpoints.add(JSON.stringify({
                    url: url.toString(),
                    method: method.toUpperCase(),
                    type: 'xhr'
                }));
                
                return originalOpen.apply(this, arguments);
            };

            // Wait for AJAX calls to be made
            await this.delay(2000);

            // Analyze discovered endpoints
            for (const endpointStr of endpoints) {
                const endpoint = JSON.parse(endpointStr);
                ajaxData.push({
                    ...endpoint,
                    parameters: this.extractParameters(endpoint.url),
                    vulnerability: {
                        cors: await this.checkCORS(endpoint.url),
                        jsonp: endpoint.url.includes('callback='),
                        openRedirect: endpoint.url.match(/redirect|url|return|goto/i)
                    }
                });
            }

            return ajaxData;
        }

        // ───────────────────────────────────────────────────────────────
        // 🔌 WebSocket Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverWebSockets() {
            const sockets = [];
            
            // Hook WebSocket constructor
            const OriginalWebSocket = unsafeWindow.WebSocket;
            unsafeWindow.WebSocket = function(url, protocols) {
                sockets.push({
                    url: url,
                    protocols: protocols,
                    origin: window.location.origin,
                    vulnerability: {
                        noOriginCheck: true,
                        plaintext: url.startsWith('ws://'),
                        injection: true // Test later
                    },
                    timestamp: new Date().toISOString()
                });
                
                return new OriginalWebSocket(url, protocols);
            };

            await this.delay(1000);
            return sockets;
        }

        // ───────────────────────────────────────────────────────────────
        // 💬 PostMessage Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverPostMessage() {
            const messages = [];
            
            // Listen for postMessage
            window.addEventListener('message', (event) => {
                messages.push({
                    origin: event.origin,
                    data: event.data,
                    source: event.source?.location?.href,
                    vulnerability: {
                        noOriginCheck: true,
                        dangerousData: typeof event.data === 'string' && 
                                      event.data.match(/<script|javascript:|on\w+=/i)
                    },
                    timestamp: new Date().toISOString()
                });
            }, true);

            // Check for postMessage senders
            const scripts = Array.from(document.querySelectorAll('script'));
            for (const script of scripts) {
                if (script.textContent.includes('postMessage')) {
                    messages.push({
                        type: 'sender',
                        element: this.getXPath(script),
                        code: script.textContent.substring(0, 200)
                    });
                }
            }

            return messages;
        }

        // ───────────────────────────────────────────────────────────────
        // 🎯 DOM Sink Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverDOMSinks() {
            const sinks = [];
            const dangerousSinks = [
                'innerHTML', 'outerHTML', 'insertAdjacentHTML',
                'document.write', 'document.writeln',
                'eval', 'Function', 'setTimeout', 'setInterval',
                'location', 'location.href', 'location.assign',
                'document.location', 'window.location',
                'element.src', 'element.href', 'element.action',
                'element.formAction', 'element.setAttribute'
            ];

            // Scan all scripts
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                const code = script.textContent;
                
                for (const sink of dangerousSinks) {
                    if (code.includes(sink)) {
                        const context = this.extractSinkContext(code, sink);
                        
                        sinks.push({
                            sink: sink,
                            element: this.getXPath(script),
                            context: context,
                            controllable: this.checkControllable(context),
                            vulnerability: {
                                severity: this.getSinkSeverity(sink),
                                exploitable: this.checkExploitable(sink, context)
                            }
                        });
                    }
                }
            }

            return sinks;
        }

        // ───────────────────────────────────────────────────────────────
        // 🔗 URL Parameter Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverURLParams() {
            const params = [];
            const url = new URL(window.location.href);

            // Current URL params
            for (const [key, value] of url.searchParams.entries()) {
                params.push({
                    name: key,
                    value: value,
                    reflected: this.checkReflectionInDOM(value),
                    vulnerability: {
                        reflected: this.checkReflectionInDOM(value),
                        dangerousChars: /[<>"'`]/.test(value),
                        executed: this.checkExecution(value)
                    }
                });
            }

            // Discover params from links
            const links = document.querySelectorAll('a[href*="?"]');
            for (const link of links) {
                try {
                    const linkUrl = new URL(link.href);
                    for (const [key, value] of linkUrl.searchParams.entries()) {
                        if (!params.find(p => p.name === key)) {
                            params.push({
                                name: key,
                                value: value,
                                source: 'link',
                                href: link.href
                            });
                        }
                    }
                } catch (e) {}
            }

            return params;
        }

        // ───────────────────────────────────────────────────────────────
        // 🍪 Cookie Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverCookies() {
            const cookies = [];
            const cookieString = document.cookie;

            if (cookieString) {
                const cookiePairs = cookieString.split(';');
                
                for (const pair of cookiePairs) {
                    const [name, value] = pair.trim().split('=');
                    
                    cookies.push({
                        name: name,
                        value: decodeURIComponent(value || ''),
                        vulnerability: {
                            noHttpOnly: true, // Can be read by JS
                            noSecure: window.location.protocol !== 'https:',
                            noSameSite: true,
                            injectable: /[<>"'`]/.test(value)
                        }
                    });
                }
            }

            return cookies;
        }

        // ───────────────────────────────────────────────────────────────
        // 💾 Storage Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverStorage() {
            const storage = {
                localStorage: [],
                sessionStorage: []
            };

            // Local Storage
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    const value = localStorage.getItem(key);
                    
                    storage.localStorage.push({
                        key: key,
                        value: value,
                        vulnerability: {
                            sensitive: this.isSensitiveData(key, value),
                            injectable: /[<>"'`]/.test(value)
                        }
                    });
                }
            } catch (e) {}

            // Session Storage
            try {
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    const value = sessionStorage.getItem(key);
                    
                    storage.sessionStorage.push({
                        key: key,
                        value: value,
                        vulnerability: {
                            sensitive: this.isSensitiveData(key, value),
                            injectable: /[<>"'`]/.test(value)
                        }
                    });
                }
            } catch (e) {}

            return storage;
        }

        // ───────────────────────────────────────────────────────────────
        // 📋 Header Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverHeaders() {
            const headers = {};

            try {
                const response = await fetch(window.location.href, { method: 'HEAD' });
                
                response.headers.forEach((value, key) => {
                    headers[key] = {
                        value: value,
                        vulnerability: this.analyzeHeader(key, value)
                    };
                });
            } catch (e) {
                console.error('Header discovery failed:', e);
            }

            return headers;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🛠️ Helper Methods
        // ═══════════════════════════════════════════════════════════════
        
        getXPath(element) {
            if (!element) return '';
            if (element.id) return `//*[@id="${element.id}"]`;
            
            const paths = [];
            for (; element && element.nodeType === 1; element = element.parentNode) {
                let index = 0;
                for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                    if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === element.nodeName) {
                        index++;
                    }
                }
                const tagName = element.nodeName.toLowerCase();
                const pathIndex = index ? `[${index + 1}]` : '';
                paths.unshift(`${tagName}${pathIndex}`);
            }
            return paths.length ? `/${paths.join('/')}` : '';
        }

        getAttributes(element) {
            const attrs = {};
            for (const attr of element.attributes) {
                attrs[attr.name] = attr.value;
            }
            return attrs;
        }

        getInputContext(input) {
            const contexts = [];
            
            // Check if in form
            if (input.form) contexts.push('form');
            
            // Check if hidden
            if (input.type === 'hidden' || input.style.display === 'none') contexts.push('hidden');
            
            // Check if in iframe
            if (window.self !== window.top) contexts.push('iframe');
            
            // Check parent elements
            let parent = input.parentElement;
            while (parent) {
                if (parent.tagName === 'FORM') contexts.push('nested-form');
                if (parent.hasAttribute('contenteditable')) contexts.push('editable-parent');
                parent = parent.parentElement;
            }
            
            return contexts;
        }

        checkReflection(input) {
            const value = input.value;
            if (!value) return false;
            
            const html = document.documentElement.innerHTML;
            return html.includes(value);
        }

        checkReflectionInDOM(value) {
            if (!value) return false;
            const html = document.documentElement.innerHTML;
            return html.includes(value);
        }

        checkExecution(value) {
            // Check if value appears in executable context
            const scripts = Array.from(document.querySelectorAll('script'));
            return scripts.some(s => s.textContent.includes(value));
        }

        extractParameters(url) {
            try {
                const urlObj = new URL(url, window.location.origin);
                const params = [];
                
                for (const [key, value] of urlObj.searchParams.entries()) {
                    params.push({ key, value });
                }
                
                return params;
            } catch {
                return [];
            }
        }

        async checkCORS(url) {
            try {
                const response = await fetch(url, {
                    method: 'OPTIONS',
                    headers: { 'Origin': window.location.origin }
                });
                
                const acao = response.headers.get('Access-Control-Allow-Origin');
                return {
                    enabled: !!acao,
                    wildcard: acao === '*',
                    credentialsAllowed: response.headers.get('Access-Control-Allow-Credentials') === 'true'
                };
            } catch {
                return { enabled: false };
            }
        }

        extractSinkContext(code, sink) {
            const index = code.indexOf(sink);
            const start = Math.max(0, index - 50);
            const end = Math.min(code.length, index + sink.length + 50);
            return code.substring(start, end);
        }

        checkControllable(context) {
            const controllable = [
                'location', 'document.URL', 'window.name',
                'document.referrer', 'postMessage', 'localStorage',
                'sessionStorage', 'cookie', 'URLSearchParams'
            ];
            
            return controllable.some(c => context.includes(c));
        }

        getSinkSeverity(sink) {
            const critical = ['eval', 'Function', 'innerHTML', 'outerHTML', 'document.write'];
            const high = ['setTimeout', 'setInterval', 'insertAdjacentHTML'];
            const medium = ['location.href', 'element.src', 'element.href'];
            
            if (critical.includes(sink)) return 'critical';
            if (high.includes(sink)) return 'high';
            if (medium.includes(sink)) return 'medium';
            return 'low';
        }

        checkExploitable(sink, context) {
            // Simple heuristic - check if user-controllable data flows to sink
            return this.checkControllable(context);
        }

        isSensitiveData(key, value) {
            const sensitivePatterns = /token|password|secret|key|auth|session|jwt|api/i;
            return sensitivePatterns.test(key) || sensitivePatterns.test(value);
        }

        analyzeHeader(key, value) {
            const vulnerabilities = {};
            
            if (key.toLowerCase() === 'x-frame-options') {
                vulnerabilities.clickjacking = value === 'DENY' || value === 'SAMEORIGIN' ? false : true;
            }
            
            if (key.toLowerCase() === 'content-security-policy') {
                vulnerabilities.weakCSP = !value.includes('script-src') || value.includes('unsafe-inline');
            }
            
            if (key.toLowerCase() === 'x-xss-protection') {
                vulnerabilities.xssProtection = value === '0' || value === '1; mode=block' ? false : true;
            }
            
            return vulnerabilities;
        }

        getSummary(results) {
            return {
                forms: results.forms.length,
                inputs: results.inputs.length,
                ajax: results.ajax.length,
                websockets: results.websockets.length,
                domSinks: results.domSinks.length,
                urlParams: results.urlParams.length,
                cookies: results.cookies.length,
                storage: results.storage.localStorage.length + results.storage.sessionStorage.length
            };
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // Export
    exports.EndpointDiscovery = EndpointDiscovery;
    exports.create = (framework) => new EndpointDiscovery(framework);
})();