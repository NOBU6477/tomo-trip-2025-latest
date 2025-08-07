// Complete error suppression for Replit interface errors
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
        'eval.kirk',
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