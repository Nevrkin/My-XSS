(function() {
    'use strict';

    class SettingsPanel {
        constructor(framework) {
            this.framework = framework;
            this.settings = this.loadSettings();
        }

        loadSettings() {
            return {
                autoDetectWAF: GM_getValue('setting_auto_detect_waf', true),
                safeMode: GM_getValue('setting_safe_mode', false),
                notifications: GM_getValue('setting_notifications', true),
                theme: GM_getValue('setting_theme', 'dark'),
                concurrency: GM_getValue('setting_concurrency', 5),
                delay: GM_getValue('setting_delay', 100)
            };
        }

        saveSetting(key, value) {
            this.settings[key] = value;
            GM_setValue(`setting_${key}`, value);
            this.framework.emit('settingChanged', { key, value });
        }

        getSetting(key) {
            return this.settings[key];
        }
    }

    exports.SettingsPanel = SettingsPanel;
    exports.create = (framework) => new SettingsPanel(framework);
})();