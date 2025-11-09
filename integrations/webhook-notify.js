/**
 * @file webhook-notify.js
 * @description Webhook notifications for findings
 * @version 8.0.0
 */

(function() {
    'use strict';

    class WebhookNotify {
        constructor(framework) {
            this.framework = framework;
            this.webhooks = this.loadWebhooks();
        }

        loadWebhooks() {
            const saved = GM_getValue('webhooks', '[]');
            return JSON.parse(saved);
        }

        addWebhook(url, options = {}) {
            this.webhooks.push({ url, ...options });
            GM_setValue('webhooks', JSON.stringify(this.webhooks));
        }

        async sendNotification(result) {
            const payload = this.formatPayload(result);
            
            for (const webhook of this.webhooks) {
                try {
                    await this.sendToWebhook(webhook.url, payload, webhook.format || 'json');
                } catch (error) {
                    console.error(`Webhook failed: ${webhook.url}`, error);
                }
            }
        }

        formatPayload(result) {
            return {
                title: '🎯 XSS Vulnerability Detected',
                severity: result.severity,
                url: result.target.url,
                payload: result.payload,
                timestamp: new Date().toISOString(),
                framework: 'Elite XSS Framework v8.0'
            };
        }

        async sendToWebhook(url, payload, format = 'json') {
            const formatters = {
                json: (p) => JSON.stringify(p),
                slack: (p) => JSON.stringify({
                    text: `${p.title}\nSeverity: ${p.severity}\nURL: ${p.url}\nPayload: \`${p.payload}\``
                }),
                discord: (p) => JSON.stringify({
                    content: `${p.title}`,
                    embeds: [{
                        title: 'XSS Detected',
                        fields: [
                            { name: 'Severity', value: p.severity },
                            { name: 'URL', value: p.url },
                            { name: 'Payload', value: `\`\`\`${p.payload}\`\`\`` }
                        ],
                        color: this.getSeverityColor(p.severity)
                    }]
                }),
                teams: (p) => JSON.stringify({
                    "@type": "MessageCard",
                    "@context": "https://schema.org/extensions",
                    "summary": p.title,
                    "sections": [{
                        "activityTitle": p.title,
                        "facts": [
                            { "name": "Severity", "value": p.severity },
                            { "name": "URL", "value": p.url },
                            { "name": "Payload", "value": p.payload }
                        ]
                    }]
                })
            };

            const body = formatters[format] ? formatters[format](payload) : JSON.stringify(payload);

            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            });
        }

        getSeverityColor(severity) {
            const colors = { critical: 0xFF0000, high: 0xFF6600, medium: 0xFFCC00, low: 0x00FF00, info: 0x0099FF };
            return colors[severity] || 0x808080;
        }
    }

    exports.WebhookNotify = WebhookNotify;
    exports.create = (framework) => new WebhookNotify(framework);
})();