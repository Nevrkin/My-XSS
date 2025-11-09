(function() {
    'use strict';

    class Logger {
        constructor(framework) {
            this.framework = framework;
            this.logs = [];
        }

        log(message, level = 'info', context = {}) {
            const entry = {
                timestamp: Date.now(),
                level,
                message,
                context,
                url: window.location.href
            };
            
            this.logs.push(entry);
            this.framework.emit('log', entry);
            
            console.log(`[Elite XSS][${level.toUpperCase()}]`, message, context);
        }

        error(message, context) { this.log(message, 'error', context); }
        warn(message, context) { this.log(message, 'warn', context); }
        info(message, context) { this.log(message, 'info', context); }
        debug(message, context) { this.log(message, 'debug', context); }

        export() {
            return JSON.stringify(this.logs, null, 2);
        }
    }

    exports.Logger = Logger;
    exports.create = (framework) => new Logger(framework);
})();