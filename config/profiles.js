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
                testDOM: true,
                autoDetectWAF: true,
                autoBypass: true,
                mutationTesting: true
            },
            payloads: {
                categories: ['base-payloads', 'advanced-payloads', 'waf-bypass'],
                maxPayloadsPerTest: 100,
                contextAware: true,
                mutationFuzzing: true
            },
            reporting: {
                autoSave: true,
                includeRequestResponse: true
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🛡️ Safe Scan Profile
        // ═══════════════════════════════════════════════════════════════
        safe: {
            name: 'Safe Scan',
            description: 'Non-intrusive scan for sensitive environments',
            icon: '🛡️',
            scanning: {
                maxConcurrent: 1,
                delayBetweenTests: 1000,
                testForms: true,
                testInputs: true,
                testURLParams: false,
                testDOM: false,
                autoDetectWAF: true,
                autoBypass: false,
                mutationTesting: false
            },
            payloads: {
                categories: ['base-payloads'],
                maxPayloadsPerTest: 5,
                contextAware: true
            },
            reporting: {
                autoSave: true,
                includeRequestResponse: false
            }
        },

        // ═══════════════════════════════════════════════════════════════
        // 🎯 Targeted Scan Profile
        // ═══════════════════════════════════════════════════════════════
        targeted: {
            name: 'Targeted Scan',
            description: 'Focused scan on specific parameters',
            icon: '🎯',
            scanning: {
                maxConcurrent: 3,
                delayBetweenTests: 200,
                testForms: false,
                testInputs: false,
                testURLParams: true,
                testDOM: false,
                autoDetectWAF: true,
                autoBypass: true,
                mutationTesting: true
            },
            payloads: {
                categories: ['base-payloads', 'advanced-payloads'],
                maxPayloadsPerTest: 50,
                contextAware: true
            },
            reporting: {
                autoSave: true,
                includeRequestResponse: true
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // 🎯 Profile Management Functions
    // ═══════════════════════════════════════════════════════════════════
    
    function getProfiles() {
        return { ...PROFILES };
    }

    function getProfile(name) {
        return PROFILES[name] ? { ...PROFILES[name] } : null;
    }

    function createProfile(name, profile) {
        if (!name || !profile) {
            throw new Error('Profile name and configuration required');
        }
        
        PROFILES[name] = {
            ...profile,
            custom: true
        };
        
        return { ...PROFILES[name] };
    }

    function updateProfile(name, updates) {
        if (!PROFILES[name]) {
            throw new Error(`Profile ${name} not found`);
        }
        
        PROFILES[name] = {
            ...PROFILES[name],
            ...updates
        };
        
        return { ...PROFILES[name] };
    }

    function deleteProfile(name) {
        if (!PROFILES[name]) {
            return false;
        }
        
        if (PROFILES[name].custom !== true) {
            throw new Error('Cannot delete built-in profiles');
        }
        
        delete PROFILES[name];
        return true;
    }

    function exportProfile(name) {
        if (!PROFILES[name]) {
            throw new Error(`Profile ${name} not found`);
        }
        
        return JSON.stringify(PROFILES[name], null, 2);
    }

    function importProfile(profileData) {
        let data;
        try {
            data = typeof profileData === 'string' ? JSON.parse(profileData) : profileData;
        } catch (error) {
            throw new Error('Invalid profile data format');
        }
        
        if (!data.profile || !data.profile.name) {
            throw new Error('Invalid profile structure');
        }
        
        const profileName = data.profile.name.toLowerCase().replace(/\s+/g, '-');
        PROFILES[profileName] = {
            ...data.profile,
            custom: true,
            imported: true
        };
        
        return profileName;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 Export
    // ═══════════════════════════════════════════════════════════════════
    exports.PROFILES = PROFILES;
    exports.getProfiles = getProfiles;
    exports.getProfile = getProfile;
    exports.createProfile = createProfile;
    exports.updateProfile = updateProfile;
    exports.deleteProfile = deleteProfile;
    exports.exportProfile = exportProfile;
    exports.importProfile = importProfile;
})();