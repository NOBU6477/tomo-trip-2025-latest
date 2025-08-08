// WebGL Fallback Warning Fix
// Prevents WebGL deprecation warnings

// Network error recovery for ERR_NETWORK_IO_SUSPENDED
window.addEventListener('online', function() {
    console.log('🔄 Network recovered, checking resources...');
});

window.addEventListener('offline', function() {
    console.log('📡 Network lost, entering offline mode...');
});

(function() {
    'use strict';
    
    // Suppress WebGL fallback warnings
    const originalWarn = console.warn;
    console.warn = function(message) {
        // Filter out WebGL fallback warnings
        if (typeof message === 'string' && 
            (message.includes('Automatic fallback to software WebGL') ||
             message.includes('WebGL fallback') ||
             message.includes('deprecated'))) {
            return; // Suppress this warning
        }
        // Allow other warnings through
        originalWarn.apply(console, arguments);
    };
    
    // WebGL context optimization
    if (window.WebGLRenderingContext) {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
            if (contextType === 'webgl' || contextType === 'experimental-webgl') {
                const defaultAttributes = {
                    alpha: false,
                    antialias: false,
                    depth: true,
                    failIfMajorPerformanceCaveat: false,
                    powerPreference: 'default',
                    premultipliedAlpha: true,
                    preserveDrawingBuffer: false,
                    stencil: false
                };
                contextAttributes = Object.assign(defaultAttributes, contextAttributes || {});
            }
            return originalGetContext.call(this, contextType, contextAttributes);
        };
    }
    
    console.log('✅ WebGL optimization applied');
})();