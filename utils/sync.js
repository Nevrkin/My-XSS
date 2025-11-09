(function() {
    'use strict';

    class Sync {
        constructor(framework) {
            this.channel = new BroadcastChannel('elite-xss-sync');
            this.framework = framework;
            this.setupListeners();
        }

        setupListeners() {
            this.channel.onmessage = (event) => {
                this.framework.emit('sync', event.data);
            };
        }

        broadcast(type, data) {
            this.channel.postMessage({ type, data, timestamp: Date.now() });
        }
    }

    exports.Sync = Sync;
    exports.create = (framework) => new Sync(framework);
})();