/**
 * @file engine.js
 * @description Core XSS Testing Engine - Advanced vulnerability detection
 * @version 8.0.0
 */

(function() {
    'use strict';

    class XSSTestingEngine {
        constructor(framework) {
            this.framework = framework;
            this.tests = new Map();
            this.results = [];
            this.isRunning = false;
            this.config = {
                maxConcurrent: 5,
                timeout: 10000,
                retryAttempts: 2,
                delayBetweenTests: 100,
                respectRobots: true,
                userAgent: 'Elite-XSS-Framework/8.0'
            };
        }

        // ───────────────────────────────────────────────────────────────
        // 🎯 Test Registration System
        // ───────────────────────────────────────────────────────────────
        registerTest(name, testFunction, options = {}) {
            this.tests.set(name, {
                name,
                function: testFunction,
                priority: options.priority || 5,
                category: options.category || 'general',
                tags: options.tags || [],
                enabled: options.enabled !== false,
                metadata: options.metadata || {}
            });
        }

        // ───────────────────────────────────────────────────────────────
        // 🚀 Execute Test Suite
        // ───────────────────────────────────────────────────────────────
        async runTests(targets, options = {}) {
            if (this.isRunning) {
                throw new Error('Tests already running');
            }

            this.isRunning = true;
            this.results = [];
            
            const startTime = performance.now();
            
            try {
                // Get enabled tests sorted by priority
                const tests = Array.from(this.tests.values())
                    .filter(t => t.enabled)
                    .sort((a, b) => b.priority - a.priority);

                // Create test queue
                const queue = this.createTestQueue(targets, tests);
                
                // Execute with concurrency control
                await this.executeQueue(queue, options);
                
                const duration = performance.now() - startTime;
                
                // Generate summary
                const summary = this.generateSummary(duration);
                
                this.framework.emit('testsComplete', { summary, results: this.results });
                
                return summary;

            } finally {
                this.isRunning = false;
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 📋 Create Test Queue
        // ───────────────────────────────────────────────────────────────
        createTestQueue(targets, tests) {
            const queue = [];
            
            for (const target of targets) {
                for (const test of tests) {
                    queue.push({
                        id: `${test.name}_${target.id || queue.length}`,
                        test: test,
                        target: target,
                        attempts: 0,
                        status: 'pending'
                    });
                }
            }
            
            return queue;
        }

        // ───────────────────────────────────────────────────────────────
        // ⚡ Queue Executor with Concurrency Control
        // ───────────────────────────────────────────────────────────────
        async executeQueue(queue, options) {
            const maxConcurrent = options.maxConcurrent || this.config.maxConcurrent;
            const running = new Set();
            let index = 0;

            const executeNext = async () => {
                if (index >= queue.length) return;
                
                const item = queue[index++];
                running.add(item);
                
                try {
                    await this.executeTest(item, options);
                } catch (error) {
                    console.error(`Test ${item.id} failed:`, error);
                    item.status = 'error';
                    item.error = error.message;
                } finally {
                    running.delete(item);
                    
                    // Continue with next
                    if (index < queue.length) {
                        await executeNext();
                    }
                }
            };

            // Start initial batch
            const initialBatch = Math.min(maxConcurrent, queue.length);
            const promises = [];
            
            for (let i = 0; i < initialBatch; i++) {
                promises.push(executeNext());
            }

            await Promise.all(promises);
        }

        // ───────────────────────────────────────────────────────────────
        // 🔬 Execute Individual Test
        // ───────────────────────────────────────────────────────────────
        async executeTest(item, options) {
            const { test, target } = item;
            const startTime = performance.now();

            try {
                // Add delay if configured
                if (this.config.delayBetweenTests > 0) {
                    await this.delay(this.config.delayBetweenTests);
                }

                // Create test context
                const context = this.createTestContext(target, options);
                
                // Execute with timeout
                const result = await this.executeWithTimeout(
                    test.function(context),
                    options.timeout || this.config.timeout
                );

                const duration = performance.now() - startTime;

                // Process result
                const testResult = {
                    id: item.id,
                    testName: test.name,
                    target: target,
                    status: 'completed',
                    vulnerable: result.vulnerable || false,
                    severity: result.severity || 'info',
                    confidence: result.confidence || 'low',
                    payload: result.payload || null,
                    evidence: result.evidence || null,
                    context: result.context || null,
                    recommendations: result.recommendations || [],
                    duration: duration,
                    timestamp: new Date().toISOString()
                };

                this.results.push(testResult);
                this.framework.emit('testComplete', testResult);

                item.status = 'completed';
                return testResult;

            } catch (error) {
                item.attempts++;
                
                // Retry logic
                if (item.attempts < this.config.retryAttempts) {
                    await this.delay(1000 * item.attempts);
                    return this.executeTest(item, options);
                }

                throw error;
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 🔧 Test Context Creator
        // ───────────────────────────────────────────────────────────────
        createTestContext(target, options) {
            return {
                target: target,
                url: target.url || window.location.href,
                dom: document,
                window: unsafeWindow,
                options: options,
                framework: this.framework,
                
                // Utility methods
                inject: (payload, element) => this.inject(payload, element),
                detect: (patterns) => this.detect(patterns),
                fetch: (url, opts) => this.safeFetch(url, opts),
                encode: (str, method) => this.encode(str, method),
                
                // Logging
                log: (msg, level = 'info') => this.log(msg, level, target),
                
                // Result helpers
                vulnerable: (data) => ({ vulnerable: true, ...data }),
                safe: (data) => ({ vulnerable: false, ...data })
            };
        }

        // ───────────────────────────────────────────────────────────────
        // ⏱️ Timeout Wrapper
        // ───────────────────────────────────────────────────────────────
        executeWithTimeout(promise, timeout) {
            return Promise.race([
                promise,
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Test timeout')), timeout)
                )
            ]);
        }

        // ───────────────────────────────────────────────────────────────
        // 💉 Safe Injection Method
        // ───────────────────────────────────────────────────────────────
        inject(payload, target) {
            if (!target) return false;

            const originalValue = target.value || target.innerHTML;
            
            try {
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                    target.value = payload;
                    target.dispatchEvent(new Event('input', { bubbles: true }));
                    target.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    target.innerHTML = payload;
                }
                
                return true;
            } catch (error) {
                console.error('Injection failed:', error);
                // Restore original
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                    target.value = originalValue;
                } else {
                    target.innerHTML = originalValue;
                }
                return false;
            }
        }

        // ───────────────────────────────────────────────────────────────
        // 🔍 Detection Helper
        // ───────────────────────────────────────────────────────────────
        detect(patterns) {
            const results = [];
            
            for (const [name, pattern] of Object.entries(patterns)) {
                const elements = document.querySelectorAll(pattern.selector || '*');
                
                for (const el of elements) {
                    const content = el.innerHTML + el.outerHTML + (el.value || '');
                    
                    if (pattern.regex) {
                        const matches = content.match(pattern.regex);
                        if (matches) {
                            results.push({
                                name,
                                element: el,
                                matches,
                                context: this.getElementContext(el)
                            });
                        }
                    }
                }
            }
            
            return results;
        }

        // ───────────────────────────────────────────────────────────────
        // 🌐 Safe Fetch Wrapper
        // ───────────────────────────────────────────────────────────────
        safeFetch(url, options = {}) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: options.method || 'GET',
                    url: url,
                    headers: {
                        'User-Agent': this.config.userAgent,
                        ...options.headers
                    },
                    data: options.body,
                    timeout: options.timeout || this.config.timeout,
                    onload: (response) => {
                        resolve({
                            status: response.status,
                            headers: response.responseHeaders,
                            body: response.responseText,
                            json: () => {
                                try {
                                    return JSON.parse(response.responseText);
                                } catch {
                                    return null;
                                }
                            }
                        });
                    },
                    onerror: reject,
                    ontimeout: () => reject(new Error('Request timeout'))
                });
            });
        }

        // ───────────────────────────────────────────────────────────────
        // 📊 Generate Test Summary
        // ───────────────────────────────────────────────────────────────
        generateSummary(duration) {
            const total = this.results.length;
            const vulnerable = this.results.filter(r => r.vulnerable).length;
            const safe = total - vulnerable;
            
            const bySeverity = {
                critical: this.results.filter(r => r.severity === 'critical').length,
                high: this.results.filter(r => r.severity === 'high').length,
                medium: this.results.filter(r => r.severity === 'medium').length,
                low: this.results.filter(r => r.severity === 'low').length,
                info: this.results.filter(r => r.severity === 'info').length
            };

            return {
                total,
                vulnerable,
                safe,
                duration: Math.round(duration),
                bySeverity,
                timestamp: new Date().toISOString()
            };
        }

        // ───────────────────────────────────────────────────────────────
        // 🛠️ Utility Methods
        // ───────────────────────────────────────────────────────────────
        getElementContext(element) {
            const path = [];
            let current = element;
            
            while (current && current !== document.body) {
                let selector = current.tagName.toLowerCase();
                if (current.id) selector += `#${current.id}`;
                if (current.className) selector += `.${current.className.split(' ').join('.')}`;
                path.unshift(selector);
                current = current.parentElement;
            }
            
            return path.join(' > ');
        }

        encode(str, method) {
            const encoders = {
                html: (s) => s.replace(/[&<>"']/g, m => ({
                    '&': '&amp;', '<': '&lt;', '>': '&gt;',
                    '"': '&quot;', "'": '&#39;'
                })[m]),
                url: (s) => encodeURIComponent(s),
                base64: (s) => btoa(s),
                hex: (s) => Array.from(s).map(c => c.charCodeAt(0).toString(16)).join('')
            };
            
            return encoders[method] ? encoders[method](str) : str;
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        log(message, level, target) {
            const logEntry = {
                timestamp: new Date().toISOString(),
                level,
                message,
                target: target.url || target.id
            };
            
            this.framework.emit('log', logEntry);
        }
    }

    // Export
    exports.XSSTestingEngine = XSSTestingEngine;
    exports.create = (framework) => new XSSTestingEngine(framework);
})();