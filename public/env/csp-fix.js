// CSP and deployment compatibility fixes
console.log('🔧 CSP compatibility fix loaded');

// Suppress specific console errors that don't affect functionality
if (!window.originalConsoleError) {
    window.originalConsoleError = console.error;
}
console.error = function(...args) {
    const message = args.join(' ');
    
    // Suppress non-critical errors
    if (
        message.includes('beacon.js') ||
        message.includes('sandbox') ||
        message.includes('allow-downloads-without-user-activation') ||
        message.includes('WebGL') ||
        message.includes('Unrecognized feature') ||
        message.includes('GroupMarkerNotSet') ||
        message.includes('framework-')
    ) {
        return; // Skip these errors
    }
    
    window.originalConsoleError.apply(console, args);
};

// Handle iframe sandbox errors gracefully
window.addEventListener('error', function(event) {
    if (event.message && (
        event.message.includes('sandbox') ||
        event.message.includes('beacon') ||
        event.message.includes('allow-downloads')
    )) {
        event.preventDefault();
        return false;
    }
});