(function() {
    'use strict';

    class Reporter {
        constructor(framework) {
            this.framework = framework;
        }

        generateHTML(results) {
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Elite XSS Test Report</title>
                    <style>
                        body { font-family: Arial; padding: 20px; }
                        .vuln { background: #fee; padding: 10px; margin: 10px 0; border-left: 4px solid red; }
                    </style>
                </head>
                <body>
                    <h1>🎯 Elite XSS Test Report</h1>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                    ${results.map(r => `
                        <div class="vuln">
                            <h3>${r.testName}</h3>
                            <p><strong>Severity:</strong> ${r.severity}</p>
                            <p><strong>Payload:</strong> <code>${this.escape(r.payload)}</code></p>
                        </div>
                    `).join('')}
                </body>
                </html>
            `;
        }

        exportHTML() {
            const results = []; // Get from framework
            const html = this.generateHTML(results);
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `xss-report-${Date.now()}.html`;
            a.click();
        }

        escape(str) {
            return str?.replace(/[<>&"']/g, m => ({
                '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;'
            })[m]) || '';
        }
    }

    exports.Reporter = Reporter;
    exports.create = (framework) => new Reporter(framework);
})();