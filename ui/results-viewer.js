(function() {
    'use strict';

    class ResultsViewer {
        constructor(framework) {
            this.framework = framework;
            this.results = [];
        }

        addResult(result) {
            this.results.push(result);
            this.render();
        }

        render() {
            const container = document.getElementById('results-container');
            if (!container) return;

            container.innerHTML = this.results.map(r => this.renderResult(r)).join('');
        }

        renderResult(result) {
            const severityClass = `exss-severity-${result.severity}`;
            return `
                <div class="exss-result-card ${severityClass}">
                    <div class="exss-result-header">
                        <h4>${result.testName}</h4>
                        <span class="exss-badge ${severityClass}">${result.severity}</span>
                    </div>
                    <div class="exss-result-body">
                        <p><strong>Payload:</strong> <code>${this.escapeHTML(result.payload)}</code></p>
                        <p><strong>Target:</strong> ${result.target.url}</p>
                        ${result.evidence ? `<p><strong>Evidence:</strong> ${this.escapeHTML(result.evidence)}</p>` : ''}
                    </div>
                </div>
            `;
        }

        escapeHTML(str) {
            return str?.replace(/[&<>"']/g, m => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            })[m]) || '';
        }
    }

    exports.ResultsViewer = ResultsViewer;
    exports.create = (framework) => new ResultsViewer(framework);
})();