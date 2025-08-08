// Complete error suppression for Replit interface errors
// Network error handling for ERR_NETWORK_CHANGED
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('ERR_NETWORK_CHANGED')) {
        console.log('🔄 Network changed, implementing retry logic...');
        setTimeout(() => {
            if (window.location.pathname === '/') {
                window.location.reload();
            }
        }, 2000);
        return;
    }
});

(function() {
    'use strict';
    
    // Override all console methods to suppress Replit errors
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info
    };
    
    const suppressedTerms = [
        'Could not find run command',
        'run command',
        'LaunchDarkly',
        'workspace_iframe',
        'Failed to load resource',
        'sandbox',
        'iframe',
        'replit.com',

        'stalwart',
        'WebGL',
        'GroupMarkerNotSet',
        'Unrecognized feature',
        'CenterDisplay',
        'crbug.com',
        'webglcontextlost',
        'enable-unsafe-swiftshader',
        'software WebGL'
    ];
    
    function shouldSuppress(message) {
        const msgStr = String(message || '');
        return suppressedTerms.some(term => msgStr.includes(term));
    }
    
    console.error = function(...args) {
        if (!shouldSuppress(args[0])) {
            originalConsole.error.apply(console, args);
        }
    };
    
    console.warn = function(...args) {
        if (!shouldSuppress(args[0])) {
            originalConsole.warn.apply(console, args);
        }
    };
    
    // Suppress window error events
    window.addEventListener('error', function(e) {
        if (shouldSuppress(e.message)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
    
    // Suppress unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        if (shouldSuppress(e.reason)) {
            e.preventDefault();
            return false;
        }
    });
    
})();