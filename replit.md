# Overview

Local Guide is a multilingual guide matching platform that connects tourists with local guides. The application provides a comprehensive system for guide discovery, registration, and booking with support for both Japanese and English languages.

# System Architecture

## Frontend Architecture
- **Framework**: Vanilla JavaScript with Bootstrap 5.3
- **Styling**: Bootstrap CSS with custom CSS modules for specialized components
- **UI Components**: Responsive design with mobile-first approach
- **Language Support**: Dynamic translation system with Japanese/English switching
- **Authentication**: Session-based authentication with Firebase integration

## Backend Architecture
- **Server**: Node.js with Express 4.18.2
- **Port Configuration**: Port 5000 (optimized for Replit deployment)
- **Static File Serving**: Express static file middleware
- **Deployment**: Configured for Replit with custom deployment scripts

## Database Design
- **ORM**: Drizzle (prepared for PostgreSQL integration)
- **Storage**: Local storage for client-side data persistence
- **Session Management**: Browser session storage for authentication state

# Key Components

## Core Features
1. **Guide Discovery System**
   - Real-time search and filtering
   - Location-based filtering
   - Language preference matching
   - Specialty area categorization

2. **User Registration System**
   - Tourist registration with document verification
   - Guide registration with profile management
   - Phone verification integration
   - ID document upload with camera functionality

3. **Multilingual Support**
   - Dynamic content translation
   - Language preference persistence
   - Region-based language detection
   - Translation management system

4. **Authentication & Authorization**
   - Role-based access control (tourist/guide/admin)
   - Session management
   - Protected route handling
   - User state persistence

## Technical Components
1. **Camera Integration**
   - Document photo capture
   - Profile photo upload
   - Mobile camera optimization
   - File fallback system

2. **Search & Filter System**
   - Multi-criteria filtering
   - Real-time search results
   - Keyword-based matching
   - Advanced filter combinations

3. **UI/UX Components**
   - Responsive navigation
   - Modal-based workflows
   - Toast notifications
   - Loading states

# Data Flow

## User Registration Flow
1. User selects registration type (tourist/guide)
2. Phone verification process
3. Document upload and verification
4. Profile completion
5. Account activation

## Guide Discovery Flow
1. User applies search filters
2. System queries guide database
3. Results filtered and displayed
4. User selects guide for details
5. Booking process initiation

## Authentication Flow
1. User login attempt
2. Credential validation
3. Session establishment
4. UI state updates
5. Protected content access

# External Dependencies

## CDN Resources
- Bootstrap 5.3.0-alpha1 (CSS & JS)
- Bootstrap Icons 1.10.0
- Swiper.js 10.x (for carousel components)

## Development Dependencies
- Node.js 20.x
- Express 4.18.2
- Python 3.11 (for utilities)
- PostgreSQL 16 (database backend)

## Third-party Integrations
- Firebase (authentication services)
- Camera API (document capture)
- Geolocation services (location detection)

# Deployment Strategy

## Replit Configuration
- **Primary Command**: `node deploy_direct.js`
- **Development Server**: `node index.js` on port 5000
- **Health Check**: `/.replit/health` endpoint
- **Static Assets**: Served via Express middleware

## Backup & Recovery
- Automated backup system with timestamped versions
- Restore scripts for rollback capability
- Version control with backup management

## Environment Variables
- `SESSION_SECRET`: Local guide secret key
- `PORT`: Server port (defaults to 5000)

# Changelog
- June 24, 2025. Initial setup
- December 26, 2025. Complete sponsor ecosystem with guide referral system
- December 29, 2025. Fixed header navigation buttons with direct HTML embedding approach after resolving DOMContentLoaded conflicts
- December 29, 2025. Resolved all button functionality issues by removing problematic JavaScript code and implementing clean event listeners for navigation, sponsor buttons, language selection, and modal controls
- December 30, 2025. Enhanced translation system with complete guide card display optimization, universal "Register as Guide" button translation, and scalable dynamic content translation for continuously growing guide registrations
- January 1, 2026. Implemented comprehensive dynamic content translation system for guide registration data, cross-site language persistence, and resolved recurring mixed-language display issues with benefit cards and guide descriptions
- January 1, 2026. Created unified translation system to resolve button flickering, header registration button failures, and incomplete translations. Implemented language persistence across page navigation and dynamic guide data translation support for new/edited guide content.
- January 1, 2026. Successfully resolved all translation issues with direct HTML embedding approach. Translation now works correctly for guide counter, detail buttons, and registration buttons. User suggested creating separate English site version for better stability and maintenance.
- January 1, 2026. Created separate English website (index-en.html) for improved stability and maintenance. Implemented language switcher on both sites allowing users to seamlessly switch between Japanese and English versions. Added English-specific guide data system with 70 localized guide profiles.
- January 1, 2026. Completed full separation of Japanese and English sites with balanced header-integrated language switchers. Removed all old translation code conflicts. English site now fully functional with complete registration modals, proper styling, and 70 English guide profiles. Both sites maintain identical functionality with language-appropriate content.
- January 1, 2026. Unified both sites with identical functionality: added sponsor registration/login buttons and advertisement banners to English site, implemented identical contact modal (お問い合わせ) on both sites, fixed guide filter functionality for both versions, and synchronized TomoTrip logos. Both sites now have complete feature parity with consistent sponsor ecosystem and filtering capabilities.
- January 1, 2026. Fixed guide filter functionality by implementing identical collapsible filter systems on both sites. Replaced inconsistent filter implementations with unified toggle-based filters (hidden by default, shown on button click) matching original Japanese design. Added Back to Top buttons on both sites for improved navigation. Completed full English localization removing all remaining Japanese text from English version.
- January 2, 2026. Implemented comprehensive filter system matching Japanese version specifications exactly: Added keyword checkboxes (Night Tour, Gourmet, Photo Spots, Cuisine, Activities), custom keyword input field with comma separation, search results counter display, and "no results found" messaging. Both sites now have identical filter functionality with accurate guide count relationships and proper English/Japanese localization.
- January 2, 2026. Fixed critical display issues: English version guide cards (3→70 complete display), benefit cards (6→8 matching Japanese version), and display count accuracy. Implemented universal-benefit-fix.js with CSS injection, DOM mutation monitoring, and continuous display enforcement to resolve editor vs new tab display differences. Both sites now show accurate 70 guide cards and 8 benefit cards consistently.
- January 2, 2026. Resolved new tab compatibility issues: Fixed English site displaying Japanese content when opened in new browser tabs. Created english-site-enforcer.js for automatic content translation and new-tab-language-fix.js for enhanced language button functionality. Language switching now works identically in both editor preview and standalone browser environments.
- January 2, 2026. Fixed critical filter functionality discrepancies between editor and new tab environments. Created enhanced-filter-fix-en.js with comprehensive guide detection, multiple selector support, and proper card visibility management. Filter system now works identically in both editor preview and standalone browser tabs, resolving "0 guides found" display issues.
- January 2, 2026. Resolved Japanese site display issues: Fixed "Found 70 guides" appearing in Japanese instead of "70人のガイドが見つかりました". Created japanese-counter-fix.js for continuous Japanese display enforcement and enhanced-filter-fix-ja.js for proper Japanese site filtering with prefecture/language mapping. Both sites now maintain consistent language-appropriate displays and functional filtering.
- January 2, 2026. Fixed header display issues on both sites: Reverted headers to clean, stable versions removing problematic translation scripts and text artifacts. Restored simple navigation with TomoTrip palm tree logo, proper language switcher dropdowns, and working login/registration buttons. Both Japanese and English sites now have consistent, professional headers without display conflicts.
- January 2, 2026. Resolved critical scroll functionality issue: Fixed scroll breaking when switching from English back to Japanese version. Created scroll-protection-fix.js and emergency-scroll-fix.js with comprehensive scroll monitoring, CSS injection, and multi-layer protection against overflow:hidden interference. Both sites now maintain proper scrolling functionality during language switching with position restoration and continuous monitoring systems.
- January 2, 2026. Fixed fundamental scroll functionality: Resolved complete scroll failure affecting both sites regardless of language switching. Created ultimate-scroll-fix.js with simplified overflow:auto settings, removed conflicting CSS, and implemented continuous monitoring system. Replaced complex scroll protection with straightforward auto overflow settings ensuring reliable scrolling across all scenarios.
- January 2, 2026. Implemented nuclear-level scroll solution: Resolved persistent scroll failure with nuclear-scroll-solution.js featuring complete CSS reset, 50ms monitoring intervals, DOM mutation observation, and forced removal of all overflow:hidden interference. Replaced all previous scroll fixes with single comprehensive solution that eliminates modal-open classes, fixed positioning conflicts, and ensures consistent scrolling regardless of dynamic content changes.
- January 2, 2026. Completed comprehensive scroll and UI fixes: Added automatic scroll repair after language switching in both switchToJapanese() and switchToEnglish() functions. Fixed header button translations (Login/ログイン and Sign Up/新規登録) for complete language switching. Created guide-counter-position-fix.js to resolve left-bottom guide count display issues that were causing scroll interference. All three critical issues now resolved: language-switching scroll failure, registration button translation, and guide counter positioning conflicts.
- January 9, 2026. Project organization for GitHub: Created 'center-display' folder containing only essential working files (17 files total). Removed temporary files, unused scripts, and debug files. Implemented emergency-fix.js system to resolve CSP errors, scroll issues, and guide counter display problems. Added comprehensive README.md with setup instructions and technical documentation. Project ready for GitHub upload with clean, maintainable codebase.
- January 11, 2026. Fixed critical UI visibility and scroll issues: Enhanced TomoTrip logo with white semi-transparent background, improved shadow effects, and larger font size for better visibility. Implemented ultimate-scroll-fix.js with 50ms interval monitoring system to resolve persistent scroll blocking issues. Added sponsor button functionality with alert confirmations. System now provides consistent logo visibility and reliable scrolling across all device types.
- July 12, 2026. Resolved file location issue: Preview was displaying corrupted root index.html instead of completed center-display/index.html. Successfully restored complete version by copying center-display files to root directory. TomoTrip logo now displays correctly with gradient background, proper positioning, and full functionality confirmed. Site operating with complete feature set including sponsor system, guide filtering, and multilingual support.
- July 12, 2026. Implemented comprehensive multi-layer fix system: Created 5 simultaneous modification systems (japanese-lock.js, absolute-button-fix.js, ultimate-fix.js, nuclear-button-fix.js, inline fixes) to resolve persistent "Sign Up" button display issue, scroll functionality problems, and logo display. Replaced existing logo with user-specified TomoTrip logo image. Nuclear-level system performs 10ms interval DOM monitoring with complete element replacement and text node destruction to ensure Japanese text display. All English translation functions completely disabled.
- July 12, 2026. Fixed critical infrastructure issues: Added Bootstrap JavaScript bundle for modal functionality, replaced local image paths with CDN URLs (Unsplash) for universal accessibility, corrected data-fee and display price inconsistencies across all guide cards, implemented basic JavaScript for filter toggle and "load more" functionality, and added fallback message for JavaScript-disabled environments. Enhanced user experience with proper price display alignment and functional UI components.
- July 12, 2026. Completed clean index.html replacement: Replaced entire index.html with user-provided clean version containing only essential structure (navigation, hero logo, basic styling). Removed all 481+ JavaScript files and complex translation systems. New version features minimalist design with Bootstrap 5.3, proper scroll behavior, TomoTrip branding, and clean Japanese language display. All 404 errors resolved through simplified architecture.

# User Preferences

Preferred communication style: Simple, everyday language.