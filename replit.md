# Overview

Local Guide is a multilingual guide matching platform connecting tourists with local guides for discovery, registration, and booking. The project aims to be a scalable, production-ready solution for a growing marketplace, prioritizing operational speed, stability, and real-world deployment.

## Recent Changes (August 2025)
- **COMPLETE TDZ CIRCULATION RESOLUTION (Aug 9, 2025)**: Full elimination of globalAllGuides AND globalCurrentPage TDZ errors through centralized AppState architecture
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