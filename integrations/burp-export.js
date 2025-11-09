/**
 * @file burp-export.js
 * @description Burp Suite integration for exporting findings
 * @version 8.0.0
 */

(function() {
    'use strict';

    class BurpExport {
        constructor(framework) {
            this.framework = framework;
        }

        // Generate Burp Suite XML format
        exportToBurp(results) {
            const xml = this.generateBurpXML(results);
            this.downloadXML(xml, 'elite-xss-burp-export.xml');
        }

        generateBurpXML(results) {
            const issues = results.map(r => this.createIssueXML(r)).join('\n');
            
            return `<?xml version="1.0" encoding="UTF-8"?>
<issues burpVersion="2023.1" exportTime="${new Date().toISOString()}">
${issues}
</issues>`;
        }

        createIssueXML(result) {
            return `  <issue>
    <serialNumber>${result.id}</serialNumber>
    <type>5243392</type>
    <name>Cross-site scripting (reflected)</name>
    <host>${new URL(result.target.url).host}</host>
    <path>${new URL(result.target.url).pathname}</path>
    <location>${result.target.url}</location>
    <severity>${this.mapSeverity(result.severity)}</severity>
    <confidence>${this.mapConfidence(result.confidence)}</confidence>
    <issueBackground>XSS vulnerability detected by Elite XSS Framework</issueBackground>
    <remediationBackground>Sanitize user input and implement CSP</remediationBackground>
    <issueDetail><![CDATA[${result.evidence || 'N/A'}]]></issueDetail>
    <requestresponse>
      <request>${btoa(result.request || '')}</request>
      <response>${btoa(result.response || '')}</response>
    </requestresponse>
  </issue>`;
        }

        mapSeverity(severity) {
            const map = { critical: 'High', high: 'High', medium: 'Medium', low: 'Low', info: 'Information' };
            return map[severity] || 'Medium';
        }

        mapConfidence(confidence) {
            const map = { high: 'Certain', medium: 'Firm', low: 'Tentative' };
            return map[confidence] || 'Firm';
        }

        downloadXML(xml, filename) {
            const blob = new Blob([xml], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    exports.BurpExport = BurpExport;
    exports.create = (framework) => new BurpExport(framework);
})();