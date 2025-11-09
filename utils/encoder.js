(function() {
    'use strict';

    class Encoder {
        html(str) {
            return str.replace(/[&<>"']/g, m => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            })[m]);
        }

        url(str) { return encodeURIComponent(str); }
        base64(str) { return btoa(str); }
        hex(str) { return Array.from(str).map(c => c.charCodeAt(0).toString(16)).join(''); }
        unicode(str) { return str.split('').map(c => `\\u${('0000' + c.charCodeAt(0).toString(16)).slice(-4)}`).join(''); }
    }

    exports.Encoder = Encoder;
    exports.create = () => new Encoder();
})();