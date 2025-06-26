# TomoTrip Local Guide Platform

## Overview
Tourism-focused matching application where local residents register as guides and tourists select them. Features comprehensive guide registration with phone verification and ID document upload, activity region selection covering all prefectures, simplified 6-language selection system, automatic photo upload with name extraction functionality, strict tourist authentication requirements with minimum ¥6000 session fee, TomoTrip branding with logo integration, coastal landscape theming, and mandatory login for guide details access with proper authentication flow.

## Recent Changes (December 26, 2025)
- **NEW FEATURE**: Added stylish sponsor registration and login buttons in bottom-right corner with modern design
- **DESIGN**: Implemented cool, futuristic sponsor button area with gradient backgrounds, glow effects, and smooth animations
- **UI/UX**: Added pulse animation and hover effects for sponsor buttons to make them highly visible and engaging
- **MAJOR FIX**: Resolved critical authentication persistence issue where tourist registration would complete but auth state would reset on homepage navigation
- Fixed access-control.js authentication logic that was incorrectly blocking authenticated tourists from accessing guide details  
- Implemented comprehensive authentication protection system with auth-protection-override.js to prevent competing scripts from clearing auth data
- Added multi-layered UI monitoring and automatic restoration system to maintain user login state display
- Enhanced authentication backup and recovery mechanisms across page navigation with beforeunload/pageshow event handlers
- Tourist authentication now properly persists across all page navigation, maintaining unlocked access to guide details

## Authentication System Architecture
The authentication system uses multiple layers of protection:

1. **Primary Storage**: localStorage['touristData'] contains main auth data
2. **Backup Storage**: Multiple backup locations for redundancy
3. **Protection Layer**: Scripts that prevent unauthorized deletion of auth data
4. **UI Monitoring**: Real-time monitoring and restoration of authentication UI state
5. **Navigation Protection**: Preservation of auth state during page transitions

## Key Files
- `index.html` - Main application with comprehensive authentication system
- `access-control.js` - Access control logic for guide details
- `auth-protection-override.js` - Prevents competing scripts from clearing auth data
- `auth-debug-tracer.js` - Debug tracing for authentication issues
- `auth-persistence-fix.js` - Additional persistence fixes for page navigation
- `auth-validator.js` - Modified to respect protection modes
- `force-logout-fix.js` - Modified to respect authentication protection

## User Preferences
- Focus on root cause identification and comprehensive solutions
- Implement multiple safety layers for critical functionality
- Provide detailed logging for debugging authentication issues
- Maintain user authentication state across all page navigation scenarios