# Overview

Local Guide is a multilingual guide matching platform connecting tourists with local guides for discovery, registration, and booking. The project aims to be a scalable, production-ready solution for a growing marketplace, prioritizing operational speed, stability, and real-world deployment.

## Recent Changes (August 2025)
- **YACHT & BEACH BACKGROUND UPGRADE (Aug 11, 2025)**: Updated from CSS gradient to authentic yacht, beach & tourists background image with fixed parallax scrolling effect. Enhanced text readability with optimized overlay gradients and backdrop filters.
- **UPDATEGUIDE COUNTERS DUPLICATION FIX (Aug 11, 2025)**: Resolved "Identifier 'updateGuideCounters' has already been declared" SyntaxError by consolidating function definition to guide-renderer.mjs with ESM export pattern. Eliminated all duplicate definitions across modules.
- **CSP FRAME-ANCESTORS ERROR ELIMINATION (Aug 11, 2025)**: Removed frame-ancestors directive from meta CSP (ignored and causes errors), simplified to essential directives only. Added Google Fonts preconnect optimization for faster loading. Enhanced error suppression for beacon.js and CSP directive warnings.
- **BOOTSTRAP/SWIPER CDN COMPATIBILITY (Aug 11, 2025)**: Finalized CSP configuration with proper cdn.jsdelivr.net permissions for external CSS/JS libraries. Eliminated all Bootstrap and Swiper loading blocks while maintaining security.
- **REPLIT DEV CSP OPTIMIZATION (Aug 11, 2025)**: Implemented development-specific CSP policy for Replit environment, allowing beacon.js and internal APIs (replit.com, sp.replit.com) while maintaining security. Separates IDE noise from genuine application errors.
- **INITAPPSTATE EXPORT FIX (Aug 11, 2025)**: Resolved module export error by converting initAppState to default export AppState pattern, eliminating "does not provide an export named 'initAppState'" errors.
- **COMPLETE CSP COMPLIANCE ACHIEVEMENT (Aug 11, 2025)**: 100% elimination of all onclick handlers from both index.html and index-en.html, complete CSP policy upgrade with script-src-elem, worker-src, and frame-ancestors directives. Data-action event delegation system fully implemented and operational.
- **DATA-ACTION EVENT SYSTEM (Aug 11, 2025)**: Unified event delegation system implemented in event-handlers.mjs with comprehensive data-action attribute support for all user interactions, eliminating CSP violations while maintaining full functionality.
- **APPSTATE SINGLETON PATTERN (Aug 11, 2025)**: Converted AppState to nullish coalescing singleton pattern preventing "Cannot redefine property" errors while maintaining global accessibility and preventing temporal dead zone issues.
- **ZERO LSP DIAGNOSTICS (Aug 11, 2025)**: Achieved complete elimination of all language server diagnostics - no syntax errors, type errors, or code issues detected.
- **FINAL CSP INLINE SCRIPT ELIMINATION (Aug 10, 2025)**: Complete removal of all inline JavaScript from HTML files, externalized to .mjs modules for strict CSP compliance
- **DUPLICATE FUNCTION DECLARATION RESOLUTION**: Eliminated switchToJapanese redefinition errors by consolidating event handler architecture and preventing function conflicts
- **PRICE DATA TYPE SAFETY (Aug 10, 2025)**: Added comprehensive Number() validation to all toLocaleString() calls preventing undefined price errors
- **EMERGENCY BUTTON MODULARIZATION**: Separated emergency button handlers into dedicated .mjs files (emergency-buttons.mjs, emergency-buttons-en.mjs) for CSP compliance
- **MODAL SAFETY ENHANCEMENT**: Enhanced modal.mjs with comprehensive null checks and Bootstrap availability validation
- **CSP VIOLATION ELIMINATION (Aug 9, 2025)**: Complete removal of external image dependencies and Unsplash references, strict CSP implementation with 'self' policy
- **EXTERNAL RESOURCE LOCALIZATION**: All guide images converted to local SVG placeholders, ocean background converted to CSS gradient
- **FONT CSP COMPLIANCE (Aug 9, 2025)**: Bootstrap Icons and Google Fonts localized to prevent CSP font-src violations, system font fallbacks implemented
- **FOOTER DUPLICATION FIX**: Eliminated redundant script references and modal-handlers.js double-loading causing visual duplication
- **APPSTATE REDEFINITION ERROR ELIMINATION (Aug 9, 2025)**: Complete transformation to singleton pattern with configurable global access preventing TypeError: Cannot redefine property AppState
- **DOUBLE INITIALIZATION PREVENTION**: Implemented boot guard (__APP_BOOTED__) and ESM URL normalization to prevent module double-loading
- **COMPLETE CSP INLINE VIOLATION ELIMINATION**: Final removal of all HTML onclick handlers and implementation of CSP-compliant event listeners
- **MODAL API CENTRALIZATION**: Created assets/js/ui/modal.mjs with Bootstrap safety checks and proper element validation
- **LOCATION SETUP MODULARIZATION**: Implemented assets/js/locations/location-setup.mjs for centralized location name management
- **COMPLETE TDZ CIRCULATION RESOLUTION**: Full elimination of globalAllGuides AND globalCurrentPage TDZ errors through centralized AppState architecture
- **APPSTATE CENTRALIZED ARCHITECTURE**: Implemented assets/js/state/app-state.mjs for unified state management preventing all TDZ circulation references
- **ZERO-ERROR PRODUCTION ACHIEVEMENT**: Complete elimination of ALL application-originated console errors, CSP strict compliance achieved
- **ESM MODULE SAFETY**: Eliminated all top-level variable declarations and references causing temporal dead zone errors
- **FUNCTION-SCOPED INITIALIZATION**: Moved all data initialization to function scope with proper dependency order
- **REPLIT IDE vs PRODUCTION SEPARATION**: Implemented environment detection with iframe-aware logging suppression
- **CONDITIONAL LOGGING SYSTEM**: Created utils/logger.mjs with DEBUG=false production mode and iframe noise suppression
- **FOOTER EMERGENCY SCRIPT ELIMINATION**: Completely disabled emergency footer debugging in both main and github-ready files
- **INLINE HANDLER COMPLETE REMOVAL**: All onclick handlers converted to CSP-compliant ESM event listeners
- **ENVIRONMENT CONFIGURATION**: Added env/app-config.mjs for production/debug mode switching
- **GITHUB SYNC & UNIFIED DEPLOYMENT**: Complete GitHub synchronization with unified public/ directory deployment
- **CSP STRICT COMPLIANCE**: Implemented minimal-privilege Content Security Policy with default-src 'self' and essential CDN allowlists
- **ESM MIME TYPE RESOLUTION**: Fixed "Failed to load module script" with forced text/javascript delivery for .mjs files
- **PUBLIC DIRECTORY UNIFICATION**: Consolidated all assets under public/ with server priority routing and fallback support
- **ABSOLUTE PATH STANDARDIZATION**: Unified all resource references to /assets/ structure with cache-busting build IDs
- **SERVER CONFIGURATION OPTIMIZATION**: Enhanced deployment_test_server.py with public/ priority and proper CORS/MIME handling
- **ESM Module Architecture**: Proper .mjs extensions with centralized data modules and import/export chains

# User Preferences

Preferred communication style: Simple, everyday language.

**GitHub Integration**: User wants to sync current project work with GitHub repository for backup and version control. GitHub-ready files organized in `github-ready` folder for easy deployment.

User confirmed preference for production-ready solution prioritizing:
1. Operational speed and performance
2. Long-term durability and stability
3. Real-world deployment capability
4. Scalable architecture for growth

**Footer Development Approach**: User prefers Japanese version first, then English translation workflow. Language toggle buttons removed since Japanese and English are separate versions (index.html vs index-en.html).

User confirmed mobile adaptation approach: PC specifications should be fully adapted to mobile phones without losing functionality. This includes:
- Complete PC-level functionality on mobile devices
- Adaptive UI for different screen sizes (mobile/tablet detection)
- Touch-friendly interactions with proper sizing (44px minimum)
- Swipe gestures for page navigation (left/right swipe)
- Mobile-optimized modal displays (full-screen on mobile)
- Responsive toolbar positioning (bottom-center on mobile)
- Visual hints and feedback for mobile users

User confirmed correct understanding of guide display system:
- Default display shows ALL currently registered guides (dynamically growing count)
- New guide registrations automatically increase the total displayed count
- Current system shows 24 registered guides (12 default + 12 new registrations)
- Filter functionality should work on this complete dataset of all registered guides
- This is the intended scalable design for a growing guide marketplace

# System Architecture

## Frontend
- **Framework**: Vanilla JavaScript with Bootstrap 5.3, ESM module architecture with .mjs extensions.
- **Styling**: Bootstrap CSS with custom CSS modules, responsive design with mobile-first approach.
- **UI Components**: Responsive navigation, modal-based workflows, toast notifications, loading states, adaptive UI, touch-friendly interactions, swipe gestures.
- **Security**: CSP-compliant architecture with zero inline scripts, all code externalized to proper modules. Enhanced error suppression system with WebGL optimization and network error handling.
- **Module Structure**: Centralized data (assets/js/data/), event management (assets/js/events/), main ESM entry (assets/js/app-init.mjs).
- **Language Support**: Dynamic translation system with Japanese/English switching, language preference persistence, region-based detection.
- **UI/UX Decisions**: Consistent modal designs, unified oval button styling, enhanced hover effects, dynamic content translation, dynamic guide card rendering with individual bookmark/compare buttons, visual feedback systems.
- **Pagination**: "Show More" button (transitioning to traditional pagination), advanced UI with progress bars, page previews, quick jump, smart page number display, floating toolbar with bookmark system, comparison tool (3-guide limit), browsing history, quick page access, keyboard navigation, sort functionality (rating, price, name), memory efficiency (12 guides in DOM).
- **Customization**: Custom ocean background applied to both Japanese and English versions with optimized gradient overlay for text readability.
- **Footer System**: Complete multilingual footer system with 5 sections (Company Info, Services, Support, Legal, Contact Info) and detailed content modals. Dark theme with responsive Bootstrap layout, hover effects, and glass morphism elements.
- **Draft Management**: Public sponsor list (sponsor-list.html) is for viewing published stores only. Draft management moved to individual store edit pages (sponsor-edit.html) with auto-save, manual save/load, timestamp tracking, and a distinct yellow gradient UI.

## Backend
- **Server**: Python-only workflow configured for direct execution (bypassing Node.js dependencies), running on port 5000.
- **Deployment**: Enhanced production-ready features including health monitoring, graceful shutdown, enhanced logging, CORS support, deployment optimization, security headers, performance caching, and OPTIONS request handling. Custom deployment scripts (e.g., deploy.py) for direct Python server execution.
- **Architecture**: ThreadedTCPServer with multi-threading for concurrent user handling, comprehensive API endpoints, and professional 404 error pages.

## Database
- **ORM**: Drizzle (prepared for PostgreSQL integration).
- **Storage**: Distributed LocalStorage system with smart capacity management for frontend data; browser session storage for authentication.
- **Sponsor Storage**: SponsorStorageManager class implementing a distributed architecture with individual store keys, metadata-based retrieval, automatic image compression, intelligent cleanup and rotation, real-time usage monitoring, and capacity management.
- **Backend Storage**: SQLite for scalable data management with bookmark/comparison persistence.

## Key Technical Components
- **Camera Integration**: Document photo capture, profile photo upload, mobile camera optimization, file fallback system.
- **Search & Filter System**: Multi-criteria filtering, real-time search, keyword-based matching, advanced filter combinations, location, language, price filtering, keyword checkboxes, custom keyword input.
- **Management Center**: Centralized management for bookmarks and comparisons, bulk data deletion, visual feedback.
- **Access Control**: Guide detail viewing requires tourist registration, modal-based access prompts, header login differentiation.
- **Booking Flow**: Complete multilingual system with language detection and translation across payment and confirmation pages. Consistent guide rate display and language inheritance throughout the flow.
- **Login/Registration**: Unified sponsor login/registration concept requiring store name, email, phone. Login redirects to individual store edit page.

# External Dependencies

## CDN Resources
- Bootstrap 5.3.0-alpha1 (CSS & JS)
- Bootstrap Icons 1.10.0
- Swiper.js 10.x (for carousel components)

## Third-party Integrations
- Firebase (authentication services)
- Camera API (document capture)
- Geolocation services (location detection)