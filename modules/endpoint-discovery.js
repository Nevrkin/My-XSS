/**
 * Elite XSS Framework v8.0 - Advanced Endpoint Discovery
 * Discovers 25+ injection point types using cutting-edge techniques
 */

(function(exports, FRAMEWORK, GM_getValue, GM_setValue, GM_deleteValue, GM_notification, unsafeWindow) {
  'use strict';

  const EndpointDiscovery = {
    // Discovery categories
    CATEGORIES: {
      URL: 'URL & Navigation',
      FORMS: 'Forms & Inputs',
      DOM: 'DOM Manipulation',
      STORAGE: 'Web Storage',
      MESSAGING: 'Cross-Context Communication',
      ADVANCED: 'Advanced Vectors',
      API: 'API & AJAX',
      TEMPLATES: 'Template Engines',
      MODERN: 'Modern Web APIs'
    },

    // Endpoint types with metadata
    ENDPOINT_TYPES: {
      // URL & Navigation
      url_parameter: { category: 'URL', risk: 'high', context: 'url' },
      hash_parameter: { category: 'URL', risk: 'high', context: 'url' },
      path_segment: { category: 'URL', risk: 'medium', context: 'url' },
      referrer: { category: 'URL', risk: 'medium', context: 'url' },
      window_name: { category: 'URL', risk: 'medium', context: 'javascript' },
      history_state: { category: 'URL', risk: 'medium', context: 'javascript' },

      // Forms & Inputs
      form_input: { category: 'FORMS', risk: 'high', context: 'html' },
      textarea: { category: 'FORMS', risk: 'high', context: 'html' },
      select_option: { category: 'FORMS', risk: 'medium', context: 'html' },
      hidden_input: { category: 'FORMS', risk: 'medium', context: 'html' },
      file_input: { category: 'FORMS', risk: 'high', context: 'html' },
      contenteditable: { category: 'FORMS', risk: 'critical', context: 'html' },

      // DOM
      inner_html: { category: 'DOM', risk: 'critical', context: 'html' },
      text_content: { category: 'DOM', risk: 'low', context: 'text' },
      attribute: { category: 'DOM', risk: 'high', context: 'attribute' },
      data_attribute: { category: 'DOM', risk: 'medium', context: 'attribute' },
      dom_clobbering: { category: 'DOM', risk: 'high', context: 'javascript' },

      // Storage
      local_storage: { category: 'STORAGE', risk: 'high', context: 'storage' },
      session_storage: { category: 'STORAGE', risk: 'high', context: 'storage' },
      indexed_db: { category: 'STORAGE', risk: 'medium', context: 'storage' },
      cookie: { category: 'STORAGE', risk: 'high', context: 'cookie' },
      cache_api: { category: 'STORAGE', risk: 'medium', context: 'storage' },

      // Messaging
      post_message: { category: 'MESSAGING', risk: 'critical', context: 'javascript' },
      broadcast_channel: { category: 'MESSAGING', risk: 'high', context: 'javascript' },
      message_channel: { category: 'MESSAGING', risk: 'high', context: 'javascript' },
      web_socket: { category: 'MESSAGING', risk: 'high', context: 'javascript' },
      sse: { category: 'MESSAGING', risk: 'medium', context: 'javascript' },

      // Advanced
      svg_injection: { category: 'ADVANCED', risk: 'critical', context: 'svg' },
      css_injection: { category: 'ADVANCED', risk: 'high', context: 'css' },
      jsonp_callback: { category: 'ADVANCED', risk: 'critical', context: 'javascript' },
      xml_injection: { category: 'ADVANCED', risk: 'high', context: 'xml' },
      prototype_pollution: { category: 'ADVANCED', risk: 'critical', context: 'javascript' },

      // API & AJAX
      xhr_response: { category: 'API', risk: 'high', context: 'javascript' },
      fetch_response: { category: 'API', risk: 'high', context: 'javascript' },
      graphql_query: { category: 'API', risk: 'high', context: 'javascript' },
      rest_endpoint: { category: 'API', risk: 'high', context: 'javascript' },

      // Templates
      angular_template: { category: 'TEMPLATES', risk: 'critical', context: 'template' },
      vue_template: { category: 'TEMPLATES', risk: 'critical', context: 'template' },
      react_props: { category: 'TEMPLATES', risk: 'high', context: 'template' },
      handlebars: { category: 'TEMPLATES', risk: 'critical', context: 'template' },

      // Modern APIs
      service_worker: { category: 'MODERN', risk: 'high', context: 'javascript' },
      web_worker: { category: 'MODERN', risk: 'medium', context: 'javascript' },
      shared_worker: { category: 'MODERN', risk: 'medium', context: 'javascript' },
      notification_api: { category: 'MODERN', risk: 'low', context: 'javascript' },
      file_system_api: { category: 'MODERN', risk: 'medium', context: 'javascript' }
    },

    /**
     * Main discovery function - finds all testable endpoints
     */
    discover: async (config = {}) => {
      console.log('[EndpointDiscovery] Starting comprehensive scan...');
      
      const endpoints = [];
      const startTime = Date.now();

      try {
        // Run all discovery methods
        const discoveryMethods = [
          EndpointDiscovery.discoverURLEndpoints,
          EndpointDiscovery.discoverFormEndpoints,
          EndpointDiscovery.discoverDOMEndpoints,
          EndpointDiscovery.discoverStorageEndpoints,
          EndpointDiscovery.discoverMessagingEndpoints,
          EndpointDiscovery.discoverAdvancedEndpoints,
          EndpointDiscovery.discoverAPIEndpoints,
          EndpointDiscovery.discoverTemplateEndpoints,
          EndpointDiscovery.discoverModernAPIs
        ];

        // Run discovery methods in parallel
        const results = await Promise.allSettled(
          discoveryMethods.map(method => method(config))
        );

        // Collect all endpoints
        results.forEach((result, idx) => {
          if (result.status === 'fulfilled') {
            endpoints.push(...result.value);
          } else {
            console.warn(`[EndpointDiscovery] Method ${idx} failed:`, result.reason);
          }
        });

        // Deduplicate endpoints
        const uniqueEndpoints = EndpointDiscovery.deduplicateEndpoints(endpoints);

        // Enrich endpoint metadata
        const enrichedEndpoints = EndpointDiscovery.enrichEndpoints(uniqueEndpoints, config);

        // Apply filters if specified
        const filteredEndpoints = EndpointDiscovery.filterEndpoints(enrichedEndpoints, config);

        const duration = Date.now() - startTime;
        console.log(`[EndpointDiscovery] Found ${filteredEndpoints.length} unique endpoints in ${duration}ms`);

        return filteredEndpoints;

      } catch (error) {
        console.error('[EndpointDiscovery] Discovery failed:', error);
        return [];
      }
    },

    /**
     * Discover URL-based endpoints
     */
    discoverURLEndpoints: async (config) => {
      const endpoints = [];

      // URL Parameters
      const url = new URL(window.location.href);
      url.searchParams.forEach((value, key) => {
        endpoints.push({
          id: `url_param_${key}_${Date.now()}`,
          type: 'url_parameter',
          name: key,
          value: value,
          location: window.location.href,
          testable: true,
          injectionPoint: 'url_param',
          extractionMethod: 'url_search_params'
        });
      });

      // Hash Parameters
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        hashParams.forEach((value, key) => {
          endpoints.push({
            id: `hash_param_${key}_${Date.now()}`,
            type: 'hash_parameter',
            name: key,
            value: value,
            location: window.location.href,
            testable: true,
            injectionPoint: 'url_hash',
            extractionMethod: 'url_hash_params'
          });
        });
      }

      // Path segments (for RESTful APIs)
      const pathSegments = window.location.pathname.split('/').filter(s => s);
      pathSegments.forEach((segment, idx) => {
        if (!/^\d+$/.test(segment) && segment.length > 2) {
          endpoints.push({
            id: `path_${idx}_${Date.now()}`,
            type: 'path_segment',
            name: `path_${idx}`,
            value: segment,
            location: window.location.pathname,
            testable: true,
            injectionPoint: 'url_path',
            extractionMethod: 'pathname_split'
          });
        }
      });

      // Document referrer
      if (document.referrer) {
        endpoints.push({
          id: `referrer_${Date.now()}`,
          type: 'referrer',
          name: 'document.referrer',
          value: document.referrer,
          location: document.referrer,
          testable: true,
          injectionPoint: 'referrer',
          extractionMethod: 'document_referrer'
        });
      }

      // Window.name
      if (window.name) {
        endpoints.push({
          id: `window_name_${Date.now()}`,
          type: 'window_name',
          name: 'window.name',
          value: window.name,
          location: 'window.name',
          testable: true,
          injectionPoint: 'window_name',
          extractionMethod: 'window_property'
        });
      }

      // History state
      if (history.state) {
        endpoints.push({
          id: `history_state_${Date.now()}`,
          type: 'history_state',
          name: 'history.state',
          value: JSON.stringify(history.state),
          location: 'history.state',
          testable: true,
          injectionPoint: 'history_state',
          extractionMethod: 'history_api'
        });
      }

      return endpoints;
    },

    /**
     * Discover form-based endpoints
     */
    discoverFormEndpoints: async (config) => {
      const endpoints = [];

      // Text inputs and textareas
      document.querySelectorAll('input[type="text"], input[type="search"], input:not([type]), textarea').forEach((elem, idx) => {
        const name = elem.name || elem.id || `input_${idx}`;
        const type = elem.tagName.toLowerCase() === 'textarea' ? 'textarea' : 'form_input';
        
        endpoints.push({
          id: `${type}_${name}_${idx}_${Date.now()}`,
          type: type,
          name: name,
          value: elem.value,
          element: elem,
          form: elem.form?.name || null,
          location: elem.getAttribute('name') || elem.getAttribute('id'),
          testable: true,
          injectionPoint: 'form_value',
          extractionMethod: 'dom_query',
          attributes: EndpointDiscovery.getElementAttributes(elem)
        });
      });

      // Select elements
      document.querySelectorAll('select').forEach((select, idx) => {
        const name = select.name || select.id || `select_${idx}`;
        endpoints.push({
          id: `select_${name}_${idx}_${Date.now()}`,
          type: 'select_option',
          name: name,
          value: select.value,
          element: select,
          form: select.form?.name || null,
          options: Array.from(select.options).map(o => o.value),
          location: select.getAttribute('name') || select.getAttribute('id'),
          testable: true,
          injectionPoint: 'form_value',
          extractionMethod: 'dom_query'
        });
      });

      // Hidden inputs (often used for CSRF tokens, session IDs)
      document.querySelectorAll('input[type="hidden"]').forEach((hidden, idx) => {
        const name = hidden.name || hidden.id || `hidden_${idx}`;
        endpoints.push({
          id: `hidden_${name}_${idx}_${Date.now()}`,
          type: 'hidden_input',
          name: name,
          value: hidden.value,
          element: hidden,
          form: hidden.form?.name || null,
          location: hidden.getAttribute('name'),
          testable: true,
          injectionPoint: 'form_value',
          extractionMethod: 'dom_query'
        });
      });

      // File inputs
      document.querySelectorAll('input[type="file"]').forEach((file, idx) => {
        const name = file.name || file.id || `file_${idx}`;
        endpoints.push({
          id: `file_${name}_${idx}_${Date.now()}`,
          type: 'file_input',
          name: name,
          value: null,
          element: file,
          accept: file.accept,
          location: file.getAttribute('name'),
          testable: true,
          injectionPoint: 'file_metadata',
          extractionMethod: 'dom_query',
          advanced: true
        });
      });

      // ContentEditable elements
      document.querySelectorAll('[contenteditable="true"]').forEach((editable, idx) => {
        const name = editable.id || `contenteditable_${idx}`;
        endpoints.push({
          id: `ce_${name}_${idx}_${Date.now()}`,
          type: 'contenteditable',
          name: name,
          value: editable.innerHTML,
          element: editable,
          location: editable.getAttribute('id') || `nth:${idx}`,
          testable: true,
          injectionPoint: 'inner_html',
          extractionMethod: 'dom_query'
        });
      });

      return endpoints;
    },

    /**
     * Discover DOM manipulation endpoints
     */
    discoverDOMEndpoints: async (config) => {
      const endpoints = [];

      // Elements with dynamic innerHTML
      const dynamicElements = document.querySelectorAll('[data-content], [data-html], [data-text]');
      dynamicElements.forEach((elem, idx) => {
        endpoints.push({
          id: `dom_innerHTML_${idx}_${Date.now()}`,
          type: 'inner_html',
          name: elem.id || elem.className || `element_${idx}`,
          value: elem.innerHTML,
          element: elem,
          location: elem.getAttribute('id') || `class:${elem.className}`,
          testable: true,
          injectionPoint: 'inner_html',
          extractionMethod: 'dom_query'
        });
      });

      // Data attributes (often reflect user input)
      document.querySelectorAll('[data-user], [data-input], [data-value]').forEach((elem, idx) => {
        const dataAttrs = EndpointDiscovery.getDataAttributes(elem);
        Object.entries(dataAttrs).forEach(([attr, value]) => {
          endpoints.push({
            id: `data_attr_${attr}_${idx}_${Date.now()}`,
            type: 'data_attribute',
            name: attr,
            value: value,
            element: elem,
            location: `data-${attr}`,
            testable: true,
            injectionPoint: 'attribute',
            extractionMethod: 'data_attribute'
          });
        });
      });

      // DOM Clobbering candidates
      const clobberableForms = document.querySelectorAll('form[name], form[id]');
      clobberableForms.forEach((form, idx) => {
        endpoints.push({
          id: `dom_clob_form_${idx}_${Date.now()}`,
          type: 'dom_clobbering',
          name: form.name || form.id,
          value: null,
          element: form,
          location: form.name || form.id,
          testable: true,
          injectionPoint: 'dom_property',
          extractionMethod: 'dom_analysis',
          advanced: true
        });
      });

      // Named elements (images, anchors)
      document.querySelectorAll('img[name], a[name]').forEach((elem, idx) => {
        endpoints.push({
          id: `named_elem_${idx}_${Date.now()}`,
          type: 'dom_clobbering',
          name: elem.name,
          value: elem.src || elem.href,
          element: elem,
          location: elem.name,
          testable: true,
          injectionPoint: 'dom_property',
          extractionMethod: 'named_elements'
        });
      });

      return endpoints;
    },

    /**
     * Discover storage-based endpoints
     */
    discoverStorageEndpoints: async (config) => {
      const endpoints = [];

      // LocalStorage
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          endpoints.push({
            id: `ls_${key}_${Date.now()}`,
            type: 'local_storage',
            name: key,
            value: localStorage.getItem(key),
            location: 'localStorage',
            testable: true,
            injectionPoint: 'storage_value',
            extractionMethod: 'storage_api'
          });
        }
      } catch (e) {
        console.warn('[EndpointDiscovery] LocalStorage access denied');
      }

      // SessionStorage
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          endpoints.push({
            id: `ss_${key}_${Date.now()}`,
            type: 'session_storage',
            name: key,
            value: sessionStorage.getItem(key),
            location: 'sessionStorage',
            testable: true,
            injectionPoint: 'storage_value',
            extractionMethod: 'storage_api'
          });
        }
      } catch (e) {
        console.warn('[EndpointDiscovery] SessionStorage access denied');
      }

      // Cookies
      const cookies = document.cookie.split(';');
      cookies.forEach(cookie => {
        const [name, value] = cookie.split('=').map(s => s.trim());
        if (name) {
          endpoints.push({
            id: `cookie_${name}_${Date.now()}`,
            type: 'cookie',
            name: name,
            value: value,
            location: 'document.cookie',
            testable: true,
            injectionPoint: 'cookie_value',
            extractionMethod: 'cookie_parse'
          });
        }
      });

      // IndexedDB databases
      try {
        const databases = await indexedDB.databases();
        databases.forEach(db => {
          endpoints.push({
            id: `idb_${db.name}_${Date.now()}`,
            type: 'indexed_db',
            name: db.name,
            value: null,
            location: 'indexedDB',
            testable: false, // Requires async operations
            injectionPoint: 'idb_store',
            extractionMethod: 'indexed_db_api',
            advanced: true
          });
        });
      } catch (e) {
        console.warn('[EndpointDiscovery] IndexedDB enumeration failed');
      }

      return endpoints;
    },

    /**
     * Discover messaging-based endpoints
     */
    discoverMessagingEndpoints: async (config) => {
      const endpoints = [];

      // postMessage listener detection
      if (window.addEventListener.toString().includes('[native code]')) {
        endpoints.push({
          id: `postmessage_${Date.now()}`,
          type: 'post_message',
          name: 'window.postMessage',
          value: null,
          location: 'window',
          testable: true,
          injectionPoint: 'message_data',
          extractionMethod: 'event_listener',
          targetOrigin: '*'
        });
      }

      // BroadcastChannel detection
      if (typeof BroadcastChannel !== 'undefined') {
        endpoints.push({
          id: `broadcast_${Date.now()}`,
          type: 'broadcast_channel',
          name: 'BroadcastChannel',
          value: null,
          location: 'BroadcastChannel',
          testable: true,
          injectionPoint: 'message_data',
          extractionMethod: 'broadcast_api'
        });
      }

      // WebSocket detection (check for ws:// or wss:// in scripts)
      const scripts = Array.from(document.scripts);
      const hasWebSocket = scripts.some(script => 
        script.textContent.includes('WebSocket') || 
        script.textContent.includes('ws://') ||
        script.textContent.includes('wss://')
      );
      
      if (hasWebSocket) {
        endpoints.push({
          id: `websocket_${Date.now()}`,
          type: 'web_socket',
          name: 'WebSocket',
          value: null,
          location: 'WebSocket',
          testable: false, // Requires active connection
          injectionPoint: 'ws_message',
          extractionMethod: 'code_analysis'
        });
      }

      // Server-Sent Events
      const hasSSE = scripts.some(script => 
        script.textContent.includes('EventSource')
      );
      
      if (hasSSE) {
        endpoints.push({
          id: `sse_${Date.now()}`,
          type: 'sse',
          name: 'Server-Sent Events',
          value: null,
          location: 'EventSource',
          testable: false,
          injectionPoint: 'sse_message',
          extractionMethod: 'code_analysis'
        });
      }

      return endpoints;
    },

    /**
     * Discover advanced injection vectors
     */
    discoverAdvancedEndpoints: async (config) => {
      const endpoints = [];

      // SVG elements
      document.querySelectorAll('svg').forEach((svg, idx) => {
        endpoints.push({
          id: `svg_${idx}_${Date.now()}`,
          type: 'svg_injection',
          name: `SVG_${idx}`,
          value: svg.outerHTML.substring(0, 200),
          element: svg,
          location: svg.id || `nth:${idx}`,
          testable: true,
          injectionPoint: 'svg_content',
          extractionMethod: 'dom_query'
        });
      });

      // Inline styles (CSS injection)
      document.querySelectorAll('[style]').forEach((elem, idx) => {
        if (elem.getAttribute('style')) {
          endpoints.push({
            id: `css_inline_${idx}_${Date.now()}`,
            type: 'css_injection',
            name: `CSS_${idx}`,
            value: elem.getAttribute('style'),
            element: elem,
            location: elem.id || elem.className,
            testable: true,
            injectionPoint: 'style_attribute',
            extractionMethod: 'dom_query'
          });
        }
      });

      // JSONP callbacks
      document.querySelectorAll('script[src*="callback="]').forEach((script, idx) => {
        const src = script.src;
        const callbackMatch = src.match(/callback=([^&]*)/);
        if (callbackMatch) {
          endpoints.push({
            id: `jsonp_${idx}_${Date.now()}`,
            type: 'jsonp_callback',
            name: `JSONP_${callbackMatch[1]}`,
            value: callbackMatch[1],
            element: script,
            scriptSrc: src,
            location: src,
            testable: true,
            injectionPoint: 'callback_function',
            extractionMethod: 'script_src_analysis'
          });
        }
      });

      // Prototype pollution candidates
      const hasJSONParse = scripts.some(script => 
        script.textContent.includes('JSON.parse')
      );
      
      if (hasJSONParse) {
        endpoints.push({
          id: `proto_pollution_${Date.now()}`,
          type: 'prototype_pollution',
          name: 'Prototype Pollution',
          value: null,
          location: 'JSON.parse',
          testable: true,
          injectionPoint: 'json_parse',
          extractionMethod: 'code_analysis',
          advanced: true
        });
      }

      return endpoints;
    },

    /**
     * Discover API and AJAX endpoints
     */
    discoverAPIEndpoints: async (config) => {
      const endpoints = [];

      // Hook XHR to detect AJAX endpoints
      // This would need to be done earlier in page load
      // For now, we'll just mark that API testing is available
      
      if (typeof XMLHttpRequest !== 'undefined') {
        endpoints.push({
          id: `xhr_generic_${Date.now()}`,
          type: 'xhr_response',
          name: 'XHR Responses',
          value: null,
          location: 'XMLHttpRequest',
          testable: false, // Requires request interception
          injectionPoint: 'xhr_response',
          extractionMethod: 'xhr_hook',
          advanced: true
        });
      }

      // Fetch API
      if (typeof fetch !== 'undefined') {
        endpoints.push({
          id: `fetch_generic_${Date.now()}`,
          type: 'fetch_response',
          name: 'Fetch Responses',
          value: null,
          location: 'fetch',
          testable: false,
          injectionPoint: 'fetch_response',
          extractionMethod: 'fetch_hook',
          advanced: true
        });
      }

      return endpoints;
    },

    /**
     * Discover template engine endpoints
     */
    discoverTemplateEndpoints: async (config) => {
      const endpoints = [];
      const scripts = Array.from(document.scripts);
      const htmlContent = document.documentElement.innerHTML;

      // Angular.js
      if (window.angular || htmlContent.includes('ng-') || htmlContent.includes('ng-app')) {
        endpoints.push({
          id: `angular_${Date.now()}`,
          type: 'angular_template',
          name: 'Angular Template',
          value: null,
          location: 'Angular.js',
          testable: true,
          injectionPoint: 'template_expression',
          extractionMethod: 'framework_detection',
          payloadExample: '{{constructor.constructor(\'alert(1)\')()}}'
        });
      }

      // Vue.js
      if (window.Vue || htmlContent.includes('v-') || htmlContent.includes('id="app"')) {
        endpoints.push({
          id: `vue_${Date.now()}`,
          type: 'vue_template',
          name: 'Vue Template',
          value: null,
          location: 'Vue.js',
          testable: true,
          injectionPoint: 'template_expression',
          extractionMethod: 'framework_detection',
          payloadExample: '{{_c.constructor(\'alert(1)\')()}}'
        });
      }

      // React
      if (window.React || htmlContent.includes('data-reactroot') || htmlContent.includes('data-reactid')) {
        endpoints.push({
          id: `react_${Date.now()}`,
          type: 'react_props',
          name: 'React Props',
          value: null,
          location: 'React',
          testable: true,
          injectionPoint: 'component_props',
          extractionMethod: 'framework_detection'
        });
      }

      // Handlebars
      if (window.Handlebars || scripts.some(s => s.textContent.includes('Handlebars'))) {
        endpoints.push({
          id: `handlebars_${Date.now()}`,
          type: 'handlebars',
          name: 'Handlebars Template',
          value: null,
          location: 'Handlebars',
          testable: true,
          injectionPoint: 'template_expression',
          extractionMethod: 'framework_detection'
        });
      }

      return endpoints;
    },

    /**
     * Discover modern web API endpoints
     */
    discoverModernAPIs: async (config) => {
      const endpoints = [];

      // Service Worker
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          registrations.forEach((reg, idx) => {
            endpoints.push({
              id: `sw_${idx}_${Date.now()}`,
              type: 'service_worker',
              name: `ServiceWorker_${idx}`,
              value: reg.scope,
              scope: reg.scope,
              location: 'ServiceWorker',
              testable: false,
              injectionPoint: 'sw_message',
              extractionMethod: 'sw_api'
            });
          });
        } catch (e) {}
      }

      // Web Workers
      if (typeof Worker !== 'undefined') {
        endpoints.push({
          id: `worker_generic_${Date.now()}`,
          type: 'web_worker',
          name: 'Web Worker',
          value: null,
          location: 'Worker',
          testable: false,
          injectionPoint: 'worker_message',
          extractionMethod: 'worker_api'
        });
      }

      // Notification API
      if ('Notification' in window) {
        endpoints.push({
          id: `notification_${Date.now()}`,
          type: 'notification_api',
          name: 'Notification API',
          value: null,
          location: 'Notification',
          testable: true,
          injectionPoint: 'notification_data',
          extractionMethod: 'notification_api'
        });
      }

      return endpoints;
    },

    /**
     * Helper: Get element attributes
     */
    getElementAttributes: (elem) => {
      const attrs = {};
      Array.from(elem.attributes).forEach(attr => {
        attrs[attr.name] = attr.value;
      });
      return attrs;
    },

    /**
     * Helper: Get data attributes
     */
    getDataAttributes: (elem) => {
      const dataAttrs = {};
      Array.from(elem.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          const key = attr.name.substring(5);
          dataAttrs[key] = attr.value;
        }
      });
      return dataAttrs;
    },

    /**
     * Deduplicate endpoints based on unique identifiers
     */
    deduplicateEndpoints: (endpoints) => {
      const seen = new Set();
      const unique = [];

      endpoints.forEach(endpoint => {
        const signature = `${endpoint.type}_${endpoint.name}_${endpoint.location}`;
        
        if (!seen.has(signature)) {
          seen.add(signature);
          unique.push(endpoint);
        }
      });

      return unique;
    },

    /**
     * Enrich endpoints with additional metadata
     */
    enrichEndpoints: (endpoints, config) => {
      return endpoints.map(endpoint => {
        const typeInfo = EndpointDiscovery.ENDPOINT_TYPES[endpoint.type] || {};
        
        return {
          ...endpoint,
          category: typeInfo.category || 'UNKNOWN',
          risk: endpoint.risk || typeInfo.risk || 'medium',
          context: endpoint.context || typeInfo.context || 'html',
          priority: EndpointDiscovery.calculatePriority(endpoint),
          detectionMethods: EndpointDiscovery.getDetectionMethods(endpoint),
          recommendedPayloads: EndpointDiscovery.getRecommendedPayloads(endpoint),
          metadata: {
            discovered: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
          }
        };
      });
    },

    /**
     * Calculate endpoint priority for testing
     */
    calculatePriority: (endpoint) => {
      let priority = 50;

      // Risk-based priority
      const riskScores = {
        critical: 100,
        high: 75,
        medium: 50,
        low: 25
      };
      priority = riskScores[endpoint.risk] || 50;

      // Context-based adjustments
      if (endpoint.context === 'javascript') priority += 20;
      if (endpoint.context === 'html') priority += 15;
      if (endpoint.context === 'svg') priority += 10;

      // Type-based adjustments
      if (endpoint.type.includes('template')) priority += 25;
      if (endpoint.type.includes('prototype')) priority += 20;
      if (endpoint.type === 'jsonp_callback') priority += 15;
      if (endpoint.type === 'post_message') priority += 15;

      return Math.min(priority, 100);
    },

    /**
     * Get appropriate detection methods for endpoint
     */
    getDetectionMethods: (endpoint) => {
      const methods = ['dom_check'];

      // Context-specific detection
      switch (endpoint.context) {
        case 'javascript':
          methods.push('popup_hook', 'console_hook', 'error_hook');
          break;
        case 'html':
          methods.push('mutation_observer', 'attribute_monitor');
          break;
        case 'svg':
          methods.push('script_execution', 'event_trigger');
          break;
        case 'css':
          methods.push('style_leak', 'computed_style');
          break;
        case 'template':
          methods.push('expression_evaluation', 'sandbox_escape');
          break;
      }

      // Storage endpoints
      if (endpoint.category === 'STORAGE') {
        methods.push('storage_read_hook', 'storage_event');
      }

      // Messaging endpoints
      if (endpoint.category === 'MESSAGING') {
        methods.push('message_hook', 'event_listener');
      }

      return methods;
    },

    /**
     * Get recommended payload types for endpoint
     */
    getRecommendedPayloads: (endpoint) => {
      const payloads = ['base'];

      // Context-specific payloads
      switch (endpoint.context) {
        case 'javascript':
          payloads.push('javascript_context', 'polyglot');
          break;
        case 'html':
          payloads.push('html_injection', 'tag_based');
          break;
        case 'svg':
          payloads.push('svg_specific', 'xml_injection');
          break;
        case 'css':
          payloads.push('css_injection', 'expression');
          break;
        case 'attribute':
          payloads.push('attribute_breaking', 'event_handler');
          break;
        case 'url':
          payloads.push('url_encoding', 'protocol_handler');
          break;
        case 'template':
          payloads.push('template_expression', 'ssti');
          break;
      }

      // Advanced techniques
      if (endpoint.type === 'prototype_pollution') {
        payloads.push('prototype_pollution');
      }
      if (endpoint.type.includes('dom_clobbering')) {
        payloads.push('dom_clobbering');
      }
      if (endpoint.type === 'jsonp_callback') {
        payloads.push('jsonp_specific');
      }

      // WAF bypass if enabled
      if (endpoint.risk === 'critical' || endpoint.risk === 'high') {
        payloads.push('waf_bypass');
      }

      // mXSS for innerHTML endpoints
      if (endpoint.injectionPoint === 'inner_html') {
        payloads.push('mutation_xss');
      }

      return payloads;
    },

    /**
     * Filter endpoints based on configuration
     */
    filterEndpoints: (endpoints, config) => {
      let filtered = endpoints;

      // Filter by target endpoints if specified
      if (config.targetEndpoints && config.targetEndpoints.length > 0) {
        filtered = filtered.filter(ep => 
          config.targetEndpoints.some(target => 
            ep.name.includes(target) || ep.type === target
          )
        );
      }

      // Exclude specified endpoints
      if (config.excludeEndpoints && config.excludeEndpoints.length > 0) {
        filtered = filtered.filter(ep => 
          !config.excludeEndpoints.some(exclude => 
            ep.name.includes(exclude) || ep.type === exclude
          )
        );
      }

      // Filter by risk level
      if (config.minRiskLevel) {
        const riskOrder = ['low', 'medium', 'high', 'critical'];
        const minIndex = riskOrder.indexOf(config.minRiskLevel);
        filtered = filtered.filter(ep => 
          riskOrder.indexOf(ep.risk) >= minIndex
        );
      }

      // Filter testable only
      if (config.testableOnly !== false) {
        filtered = filtered.filter(ep => ep.testable);
      }

      // Filter by category
      if (config.categories && config.categories.length > 0) {
        filtered = filtered.filter(ep => 
          config.categories.includes(ep.category)
        );
      }

      return filtered;
    },

    /**
     * Get endpoint statistics
     */
    getStatistics: (endpoints) => {
      const stats = {
        total: endpoints.length,
        testable: endpoints.filter(e => e.testable).length,
        byCategory: {},
        byRisk: {},
        byContext: {},
        byType: {},
        highPriority: endpoints.filter(e => e.priority >= 75).length
      };

      // Group by category
      endpoints.forEach(ep => {
        stats.byCategory[ep.category] = (stats.byCategory[ep.category] || 0) + 1;
        stats.byRisk[ep.risk] = (stats.byRisk[ep.risk] || 0) + 1;
        stats.byContext[ep.context] = (stats.byContext[ep.context] || 0) + 1;
        stats.byType[ep.type] = (stats.byType[ep.type] || 0) + 1;
      });

      return stats;
    },

    /**
     * Generate endpoint report
     */
    generateReport: (endpoints) => {
      const stats = EndpointDiscovery.getStatistics(endpoints);
      
      return {
        summary: {
          totalEndpoints: stats.total,
          testableEndpoints: stats.testable,
          highPriorityEndpoints: stats.highPriority,
          categoryCoverage: Object.keys(stats.byCategory).length,
          riskDistribution: stats.byRisk
        },
        details: {
          byCategory: stats.byCategory,
          byRisk: stats.byRisk,
          byContext: stats.byContext,
          byType: stats.byType
        },
        endpoints: endpoints.map(ep => ({
          id: ep.id,
          name: ep.name,
          type: ep.type,
          category: ep.category,
          risk: ep.risk,
          priority: ep.priority,
          testable: ep.testable,
          location: ep.location
        })),
        timestamp: new Date().toISOString(),
        url: window.location.href
      };
    }
  };

  // Export the module
  exports.discover = EndpointDiscovery.discover;
  exports.getStatistics = EndpointDiscovery.getStatistics;
  exports.generateReport = EndpointDiscovery.generateReport;
  exports.ENDPOINT_TYPES = EndpointDiscovery.ENDPOINT_TYPES;
  exports.CATEGORIES = EndpointDiscovery.CATEGORIES;

})(exports, FRAMEWORK, GM_getValue, GM_setValue, GM_deleteValue, GM_notification, unsafeWindow);