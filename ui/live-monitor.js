(function() {
    'use strict';

    class LiveMonitor {
        constructor(framework) {
            this.framework = framework;
            this.logs = [];
            this.maxLogs = 100;
        }

        log(message, level = 'info') {
            const entry = {
                timestamp: new Date().toISOString(),
                level,
                message
            };
            
            this.logs.unshift(entry);
            if (this.logs.length > this.maxLogs) this.logs.pop();
            
            this.render();
        }

        render() {
            const container = document.getElementById('monitor-log');
            if (!container) return;

            container.innerHTML = this.logs.map(log => `
                <div class="exss-log-entry exss-log-${log.level}">
                    <span class="exss-log-time">${new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span class="exss-log-message">${log.message}</span>
                </div>
            `).join('');
        }
    }

    exports.LiveMonitor = LiveMonitor;
    exports.create = (framework) => new LiveMonitor(framework);
})();