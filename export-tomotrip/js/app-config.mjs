// TomoTrip Application Configuration - Environment Flags
export const APP_CONFIG = {
    DEBUG_LOG: false,          // Production mode - no debug logs (set to true only when debugging)
    ALLOW_IFRAME_LOG: false,   // Suppress logs in Replit preview iframe to reduce noise
    FOOTER_EMERGENCY: false,   // Disable footer emergency scripts in production
    ENV_TYPE: 'production'     // Environment type for conditional behavior
};