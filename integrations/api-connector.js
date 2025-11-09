/**
 * @file api-connector.js
 * @description API integration for external tools
 * @version 8.0.0
 */

(function() {
    'use strict';

    class APIConnector {
        constructor(framework) {
            this.framework = framework;
            this.apiKey = GM_getValue('api_key', null);
            this.baseUrl = GM_getValue('api_base_url', 'https://api.example.com');
        }

        setApiKey(key) {
            this.apiKey = key;
            GM_setValue('api_key', key);
        }

        async sendResults(results) {
            if (!this.apiKey) {
                throw new Error('API key not configured');
            }

            const response = await fetch(`${this.baseUrl}/vulnerabilities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    source: 'Elite XSS Framework',
                    version: '8.0.0',
                    results: results,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            return await response.json();
        }

        async getPayloads(category) {
            const response = await fetch(`${this.baseUrl}/payloads/${category}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });

            if (response.ok) {
                return await response.json();
            }

            return [];
        }
    }

    exports.APIConnector = APIConnector;
    exports.create = (framework) => new APIConnector(framework);
})();