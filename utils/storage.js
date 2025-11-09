(function() {
    'use strict';

    class Storage {
        set(key, value) {
            GM_setValue(`exss_${key}`, JSON.stringify(value));
        }

        get(key, defaultValue = null) {
            const data = GM_getValue(`exss_${key}`, null);
            return data ? JSON.parse(data) : defaultValue;
        }

        delete(key) {
            GM_deleteValue(`exss_${key}`);
        }

        clear() {
            const keys = GM_listValues();
            keys.filter(k => k.startsWith('exss_')).forEach(k => GM_deleteValue(k));
        }
    }

    exports.Storage = Storage;
    exports.create = () => new Storage();
})();