/**
 * @file endpoint-discovery.js
 * @description Advanced endpoint & parameter discovery for XSS testing
 * @version 8.0.0
 */

(function() {
    'use strict';

    class EndpointDiscovery {
        constructor(framework) {
            this.framework = framework;
            this.discovered = new Map();
            this.patterns = {
                forms: 'form',
                inputs: 'input, textarea, [contenteditable="true"]',
                urls: 'a[href], link[href], script[src], img[src], iframe[src]',
                ajax: /\.ajax\(|fetch\(|XMLHttpRequest/g,
                params: /[?&]([^=]+)=/g,
                jsonEndpoints: /\/api\/|\.json/i,
                postMessage: /postMessage\(/g
            };
            this.scanResults = {
                forms: [],
                inputs: [],
                urls: [],
                parameters: new Set(),
                apiEndpoints: [],
                eventHandlers: [],
                postMessageTargets: []
            };
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔍 Main Discovery Orchestrator
        // ═══════════════════════════════════════════════════════════════
        async discover(options = {}) {
            console.log('[Discovery] Starting comprehensive scan...');
            
            const startTime = performance.now();
            
            try {
                await Promise.all([
                    this.discoverForms(),
                    this.discoverInputs(),
                    this.discoverURLs(),
                    this.discoverParameters(),
                    this.discoverAPIEndpoints(),
                    this.discoverEventHandlers(),
                    this.discoverPostMessageChannels(),
                    this.discoverDynamicContent(),
                    this.discoverWebSockets(),
                    this.discoverLocalStorage()
                ]);

                // Advanced techniques
                if (options.deep) {
                    await this.deepScan();
                }

                const duration = performance.now() - startTime;
                const summary = this.generateSummary(duration);

                this.framework.emit('discoveryComplete', { 
                    summary, 
                    results: this.scanResults 
                });

                return summary;

            } catch (error) {
                console.error('[Discovery] Scan failed:', error);
                throw error;
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 📝 Form Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverForms() {
            const forms = document.querySelectorAll('form');
            
            for (const form of forms) {
                const formData = {
                    id: form.id || this.generateId('form'),
                    name: form.name,
                    action: form.action,
                    method: form.method.toUpperCase() || 'GET',
                    enctype: form.enctype,
                    inputs: [],
                    context: this.getElementContext(form),
                    securityHeaders: this.analyzeFormSecurity(form)
                };

                // Extract all inputs
                const inputs = form.querySelectorAll('input, textarea, select');
                for (const input of inputs) {
                    formData.inputs.push({
                        name: input.name,
                        type: input.type || 'text',
                        value: input.value,
                        required: input.required,
                        pattern: input.pattern,
                        maxLength: input.maxLength,
                        validation: this.detectValidation(input)
                    });
                }

                this.scanResults.forms.push(formData);
                this.discovered.set(formData.id, { type: 'form', data: formData });
            }

            console.log(`[Discovery] Found ${forms.length} forms`);
        }

        // ───────────────────────────────────────────────────────────────
        // 🎯 Input Discovery (All Injectable Points)
        // ───────────────────────────────────────────────────────────────
        async discoverInputs() {
            const inputs = document.querySelectorAll(this.patterns.inputs);
            
            for (const input of inputs) {
                const inputData = {
                    id: input.id || this.generateId('input'),
                    element: input,
                    tagName: input.tagName.toLowerCase(),
                    type: input.type || 'text',
                    name: input.name,
                    value: input.value || input.textContent,
                    placeholder: input.placeholder,
                    context: this.detectInputContext(input),
                    sinks: this.identifyNearestSinks(input),
                    sanitization: this.detectSanitization(input),
                    eventListeners: this.extractEventListeners(input),
                    dataAttributes: this.extractDataAttributes(input),
                    reflectedIn: this.findReflections(input.value || input.textContent)
                };

                this.scanResults.inputs.push(inputData);
                this.discovered.set(inputData.id, { type: 'input', data: inputData });
            }

            console.log(`[Discovery] Found ${inputs.length} input points`);
        }

        // ───────────────────────────────────────────────────────────────
        // 🌐 URL & Parameter Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverURLs() {
            const elements = document.querySelectorAll(this.patterns.urls);
            const urls = new Set();

            for (const el of elements) {
                const url = el.href || el.src;
                if (url && !url.startsWith('data:') && !url.startsWith('javascript:')) {
                    urls.add(url);
                    
                    // Extract parameters
                    this.extractParameters(url);
                }
            }

            this.scanResults.urls = Array.from(urls);
            console.log(`[Discovery] Found ${urls.size} unique URLs`);
        }

        // ───────────────────────────────────────────────────────────────
        // 🔑 Parameter Extraction
        // ───────────────────────────────────────────────────────────────
        async discoverParameters() {
            // From current URL
            this.extractParameters(window.location.href);
            
            // From all links
            const links = document.querySelectorAll('a[href]');
            for (const link of links) {
                this.extractParameters(link.href);
            }

            // From JavaScript code
            this.extractParametersFromJS();

            console.log(`[Discovery] Found ${this.scanResults.parameters.size} parameters`);
        }

        extractParameters(url) {
            try {
                const urlObj = new URL(url, window.location.origin);
                urlObj.searchParams.forEach((value, key) => {
                    this.scanResults.parameters.add({
                        name: key,
                        value: value,
                        url: url,
                        reflected: this.isParameterReflected(key, value)
                    });
                });
            } catch (e) {
                // Invalid URL
            }
        }

        extractParametersFromJS() {
            const scripts = document.querySelectorAll('script');
            
            for (const script of scripts) {
                const matches = script.textContent.matchAll(this.patterns.params);
                for (const match of matches) {
                    this.scanResults.parameters.add({
                        name: match[1],
                        source: 'javascript',
                        context: 'code'
                    });
                }
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 🔌 API Endpoint Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverAPIEndpoints() {
            const endpoints = new Set();

            // From fetch/XHR in scripts
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                const content = script.textContent;
                
                // Find fetch calls
                const fetchMatches = content.matchAll(/fetch\s*\(\s*['"`]([^'"`]+)['"`]/g);
                for (const match of fetchMatches) {
                    endpoints.add(match[1]);
                }

                // Find XHR open calls
                const xhrMatches = content.matchAll(/\.open\s*\(\s*['"`](\w+)['"`]\s*,\s*['"`]([^'"`]+)['"`]/g);
                for (const match of xhrMatches) {
                    endpoints.add(match[2]);
                }

                // Find axios calls
                const axiosMatches = content.matchAll(/axios\.[a-z]+\s*\(\s*['"`]([^'"`]+)['"`]/g);
                for (const match of axiosMatches) {
                    endpoints.add(match[1]);
                }
            }

            // From data-api attributes
            const apiElements = document.querySelectorAll('[data-api], [data-url], [data-endpoint]');
            for (const el of apiElements) {
                const api = el.dataset.api || el.dataset.url || el.dataset.endpoint;
                if (api) endpoints.add(api);
            }

            // Analyze each endpoint
            for (const endpoint of endpoints) {
                this.scanResults.apiEndpoints.push({
                    url: endpoint,
                    method: this.guessMethod(endpoint),
                    isJSON: this.patterns.jsonEndpoints.test(endpoint),
                    parameters: this.extractEndpointParams(endpoint)
                });
            }

            console.log(`[Discovery] Found ${endpoints.size} API endpoints`);
        }

        // ───────────────────────────────────────────────────────────────
        // 🎪 Event Handler Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverEventHandlers() {
            const handlers = [];

            // Inline handlers
            const elements = document.querySelectorAll('*');
            for (const el of elements) {
                for (const attr of el.attributes) {
                    if (attr.name.startsWith('on')) {
                        handlers.push({
                            element: el,
                            event: attr.name,
                            handler: attr.value,
                            context: this.getElementContext(el),
                            injectable: this.isHandlerInjectable(attr.value)
                        });
                    }
                }
            }

            // Attached handlers via getEventListeners (if available)
            if (typeof getEventListeners === 'function') {
                for (const el of elements) {
                    const listeners = getEventListeners(el);
                    for (const [event, list] of Object.entries(listeners)) {
                        for (const listener of list) {
                            handlers.push({
                                element: el,
                                event: event,
                                handler: listener.listener.toString(),
                                context: this.getElementContext(el),
                                useCapture: listener.useCapture
                            });
                        }
                    }
                }
            }

            this.scanResults.eventHandlers = handlers;
            console.log(`[Discovery] Found ${handlers.length} event handlers`);
        }

        // ───────────────────────────────────────────────────────────────
        // 📨 PostMessage Channel Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverPostMessageChannels() {
            const channels = [];
            const scripts = document.querySelectorAll('script');

            for (const script of scripts) {
                const content = script.textContent;
                
                // Find postMessage senders
                const senders = content.matchAll(/(\w+)\.postMessage\s*\(/g);
                for (const match of senders) {
                    channels.push({
                        type: 'sender',
                        target: match[1],
                        context: 'discovered in script'
                    });
                }

                // Find message listeners
                if (content.includes('addEventListener') && content.includes('message')) {
                    channels.push({
                        type: 'listener',
                        hasOriginCheck: /event\.origin/.test(content),
                        vulnerable: !/event\.origin\s*[!=]==/.test(content)
                    });
                }
            }

            // Monitor for runtime postMessage
            this.setupPostMessageMonitor();

            this.scanResults.postMessageTargets = channels;
            console.log(`[Discovery] Found ${channels.length} postMessage channels`);
        }

        setupPostMessageMonitor() {
            window.addEventListener('message', (event) => {
                this.framework.emit('postMessageDetected', {
                    origin: event.origin,
                    data: event.data,
                    source: event.source
                });
            });
        }

        // ───────────────────────────────────────────────────────────────
        // 🔄 Dynamic Content Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverDynamicContent() {
            // Monitor DOM mutations
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                this.analyzeDynamicElement(node);
                            }
                        });
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'href', 'data-*']
            });

            // Store observer for cleanup
            this.mutationObserver = observer;
        }

        analyzeDynamicElement(element) {
            // Check if it contains injectable points
            const inputs = element.querySelectorAll(this.patterns.inputs);
            if (inputs.length > 0) {
                this.framework.emit('dynamicInputsDetected', {
                    count: inputs.length,
                    parent: element
                });
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 🔌 WebSocket Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverWebSockets() {
            const originalWebSocket = window.WebSocket;
            const wsConnections = [];

            window.WebSocket = function(...args) {
                const ws = new originalWebSocket(...args);
                
                wsConnections.push({
                    url: args[0],
                    protocols: args[1],
                    timestamp: Date.now()
                });

                // Monitor messages
                ws.addEventListener('message', (event) => {
                    framework.emit('websocketMessage', {
                        url: args[0],
                        data: event.data
                    });
                });

                return ws;
            };

            this.scanResults.websockets = wsConnections;
        }

        // ───────────────────────────────────────────────────────────────
        // 💾 LocalStorage/SessionStorage Discovery
        // ───────────────────────────────────────────────────────────────
        async discoverLocalStorage() {
            const storage = {
                localStorage: {},
                sessionStorage: {},
                cookies: {}
            };

            // LocalStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                storage.localStorage[key] = {
                    value: localStorage.getItem(key),
                    reflected: this.isValueReflected(localStorage.getItem(key))
                };
            }

            // SessionStorage
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                storage.sessionStorage[key] = {
                    value: sessionStorage.getItem(key),
                    reflected: this.isValueReflected(sessionStorage.getItem(key))
                };
            }

            // Cookies
            document.cookie.split(';').forEach(cookie => {
                const [key, value] = cookie.trim().split('=');
                storage.cookies[key] = {
                    value: value,
                    httpOnly: false, // Can't detect from JS
                    secure: window.location.protocol === 'https:',
                    reflected: this.isValueReflected(value)
                };
            });

            this.scanResults.storage = storage;
        }

        // ───────────────────────────────────────────────────────────────
        // 🕵️ Deep Scan (Advanced Techniques)
        // ───────────────────────────────────────────────────────────────
        async deepScan() {
            console.log('[Discovery] Running deep scan...');

            await Promise.all([
                this.scanFrameworks(),
                this.scanServiceWorkers(),
                this.scanWebWorkers(),
                this.scanShadowDOM(),
                this.scanCustomElements()
            ]);
        }

        async scanFrameworks() {
            const frameworks = {
                react: !!document.querySelector('[data-reactroot], [data-reactid]'),
                vue: !!window.Vue || !!document.querySelector('[data-v-]'),
                angular: !!window.angular || !!document.querySelector('[ng-app], [ng-controller]'),
                jquery: !!window.jQuery,
                backbone: !!window.Backbone,
                ember: !!window.Ember
            };

            this.scanResults.frameworks = frameworks;
        }

        async scanServiceWorkers() {
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                this.scanResults.serviceWorkers = registrations.map(reg => ({
                    scope: reg.scope,
                    active: !!reg.active,
                    scriptURL: reg.active?.scriptURL
                }));
            }
        }

        async scanWebWorkers() {
            // Intercept Worker creation
            const originalWorker = window.Worker;
            const workers = [];

            window.Worker = function(...args) {
                workers.push({ scriptURL: args[0], timestamp: Date.now() });
                return new originalWorker(...args);
            };

            this.scanResults.workers = workers;
        }

        async scanShadowDOM() {
            const shadowRoots = [];
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_ELEMENT
            );

            let node;
            while (node = walker.nextNode()) {
                if (node.shadowRoot) {
                    shadowRoots.push({
                        host: node,
                        mode: node.shadowRoot.mode,
                        innerHTML: node.shadowRoot.innerHTML
                    });
                }
            }

            this.scanResults.shadowRoots = shadowRoots;
        }

        async scanCustomElements() {
            const customElements = [];
            const allElements = document.querySelectorAll('*');

            for (const el of allElements) {
                if (el.tagName.includes('-')) {
                    customElements.push({
                        tagName: el.tagName.toLowerCase(),
                        attributes: Array.from(el.attributes).map(a => ({
                            name: a.name,
                            value: a.value
                        }))
                    });
                }
            }

            this.scanResults.customElements = customElements;
        }

        // ───────────────────────────────────────────────────────────────
        // 🔧 Helper Methods
        // ───────────────────────────────────────────────────────────────
        detectInputContext(input) {
            const parent = input.parentElement;
            const contexts = [];

            // Check parent tags
            if (parent.tagName === 'SCRIPT') contexts.push('javascript');
            if (parent.tagName === 'STYLE') contexts.push('css');
            if (parent.tagName === 'TEXTAREA') contexts.push('html');
            if (parent.getAttribute('contenteditable')) contexts.push('html');

            // Check for template contexts
            if (input.textContent.includes('{{') || input.textContent.includes('${')) {
                contexts.push('template');
            }

            return contexts.length > 0 ? contexts : ['html'];
        }

        identifyNearestSinks(element) {
            const sinks = [];
            const dangerousSinks = ['innerHTML', 'outerHTML', 'document.write', 'eval'];
            
            // Check element's own properties
            for (const sink of dangerousSinks) {
                if (element[sink]) {
                    sinks.push({ type: sink, element: element });
                }
            }

            return sinks;
        }

        detectSanitization(input) {
            const parent = input.parentElement;
            const scripts = document.querySelectorAll('script');
            
            for (const script of scripts) {
                const content = script.textContent;
                if (content.includes(input.name) || content.includes(input.id)) {
                    // Check for sanitization functions
                    if (/DOMPurify|sanitize|escape|encode/.test(content)) {
                        return {
                            detected: true,
                            method: content.match(/DOMPurify|sanitize|escape|encode/)?.[0]
                        };
                    }
                }
            }

            return { detected: false };
        }

        extractEventListeners(element) {
            const listeners = [];
            
            for (const attr of element.attributes) {
                if (attr.name.startsWith('on')) {
                    listeners.push({
                        event: attr.name.substring(2),
                        handler: attr.value,
                        inline: true
                    });
                }
            }

            return listeners;
        }

        extractDataAttributes(element) {
            const dataAttrs = {};
            
            for (const attr of element.attributes) {
                if (attr.name.startsWith('data-')) {
                    dataAttrs[attr.name] = attr.value;
                }
            }

            return dataAttrs;
        }

        findReflections(value) {
            if (!value) return [];
            
            const reflections = [];
            const bodyText = document.body.innerHTML;
            
            if (bodyText.includes(value)) {
                // Find all occurrences
                const regex = new RegExp(this.escapeRegex(value), 'g');
                let match;
                while ((match = regex.exec(bodyText)) !== null) {
                    reflections.push({
                        position: match.index,
                        context: bodyText.substring(
                            Math.max(0, match.index - 50),
                            Math.min(bodyText.length, match.index + value.length + 50)
                        )
                    });
                }
            }

            return reflections;
        }

        isParameterReflected(key, value) {
            const bodyHTML = document.body.innerHTML;
            return bodyHTML.includes(value);
        }

        isValueReflected(value) {
            if (!value || value.length < 3) return false;
            return document.body.innerHTML.includes(value);
        }

        isHandlerInjectable(handlerCode) {
            // Check if handler uses eval or similar dangerous functions
            return /eval|Function|setTimeout|setInterval/.test(handlerCode);
        }

        guessMethod(endpoint) {
            if (endpoint.includes('/api/') || endpoint.includes('.json')) {
                return endpoint.includes('delete') ? 'DELETE' :
                       endpoint.includes('update') || endpoint.includes('edit') ? 'PUT' :
                       endpoint.includes('create') || endpoint.includes('add') ? 'POST' : 'GET';
            }
            return 'GET';
        }

        extractEndpointParams(endpoint) {
            const params = [];
            const matches = endpoint.matchAll(/[?&]([^=]+)=/g);
            for (const match of matches) {
                params.push(match[1]);
            }
            return params;
        }

        analyzeFormSecurity(form) {
            return {
                hasCSRFToken: !!form.querySelector('[name*="csrf"], [name*="token"]'),
                usesHTTPS: form.action.startsWith('https://'),
                hasHoneypot: !!form.querySelector('[style*="display:none"], [type="hidden"]'),
                hasCaptcha: !!form.querySelector('[class*="captcha"], [class*="recaptcha"]')
            };
        }

        detectValidation(input) {
            return {
                clientSide: !!(input.pattern || input.maxLength || input.required),
                pattern: input.pattern || null,
                maxLength: input.maxLength || null,
                min: input.min || null,
                max: input.max || null
            };
        }

        getElementContext(element) {
            const path = [];
            let current = element;
            
            while (current && current !== document.body) {
                let selector = current.tagName.toLowerCase();
                if (current.id) selector += `#${current.id}`;
                else if (current.className) {
                    selector += `.${Array.from(current.classList).join('.')}`;
                }
                path.unshift(selector);
                current = current.parentElement;
            }
            
            return path.join(' > ');
        }

        generateId(prefix) {
            return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
        }

        escapeRegex(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        // ───────────────────────────────────────────────────────────────
        // 📊 Generate Summary
        // ───────────────────────────────────────────────────────────────
        generateSummary(duration) {
            return {
                duration: Math.round(duration),
                forms: this.scanResults.forms.length,
                inputs: this.scanResults.inputs.length,
                urls: this.scanResults.urls.length,
                parameters: this.scanResults.parameters.size,
                apiEndpoints: this.scanResults.apiEndpoints.length,
                eventHandlers: this.scanResults.eventHandlers.length,
                postMessageChannels: this.scanResults.postMessageTargets.length,
                timestamp: new Date().toISOString()
            };
        }

        // ───────────────────────────────────────────────────────────────
        // 🧹 Cleanup
        // ───────────────────────────────────────────────────────────────
        cleanup() {
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
            }
        }
    }

    // Export
    exports.EndpointDiscovery = EndpointDiscovery;
    exports.create = (framework) => new EndpointDiscovery(framework);
})();