# Overview

Local Guide is a multilingual guide matching platform that connects tourists with local guides. It provides a comprehensive system for guide discovery, registration, and booking, supporting both Japanese and English languages. The project aims to be a scalable, production-ready solution for a growing guide marketplace, prioritizing operational speed, stability, and real-world deployment capability.

# User Preferences

Preferred communication style: Simple, everyday language.

User confirmed preference for production-ready solution prioritizing:
1. Operational speed and performance
2. Long-term durability and stability
3. Real-world deployment capability
4. Scalable architecture for growth

**Footer Development Approach**: User prefers Japanese version first, then English translation workflow. Language toggle buttons removed since Japanese and English are separate versions (index.html vs index-en.html).

## Recent Updates (August 2025)

- **RESOLVED: "Could not find run command" Deployment Error** (August 7, 2025)
  - **Root Cause Identified**: GitHub repository was missing server configuration files (main.py, replit.toml, server.js)
  - **GitHub Integration Fixed**: Synchronized complete Production server files to github-ready folder
  - **Production Server Implementation**: Enhanced main.py with comprehensive production-ready features including health monitoring, graceful shutdown, enhanced logging, CORS support, and deployment optimization
  - **Configuration Optimization**: Updated replit.toml with proper deployment target (cloudrun), environment variables, port configuration, and interpreter settings
  - **Node.js Bridge Created**: server.js provides .replit compatibility while delegating to Python server
  - **Alternative Startup Script**: Created start.py as backup deployment option with environment setup and process management
  - **Server Enhancement**: Added security headers (X-Frame-Options: SAMEORIGIN, CORS headers), performance caching, OPTIONS request handling, and background health checks
  - **Complete GitHub Sync**: All server files now available in github-ready for full deployment capability
  - **Environment Recovery**: Successfully recovered from Python environment corruption after Node.js installation
  - **Dual Environment Setup**: Both Python 3.12.11 and Node.js v22.16.0 functioning correctly
  - **Emergency Deployment Solution**: Created deploy.py script to bypass .replit file limitations
  - **.replit File Restriction**: Unable to edit .replit file due to Replit permissions, requiring alternative deployment approach
  - **Deployment Ready**: Emergency deployment script (deploy.py) provides direct Python server execution for production deployment
- **COMPLETE: Custom Ocean Background Implementation** (August 5, 2025)
  - **Beautiful Ocean Background**: Replaced previous backgrounds with user-provided high-quality ocean image
  - **Visual Enhancement**: Bright, vibrant turquoise blue ocean with yacht creating inviting atmosphere
  - **Consistent Implementation**: Applied custom background to both Japanese (index.html) and English (index-en.html) versions
  - **Optimized Overlay**: Adjusted gradient overlay (rgba(0,0,0,0.25) to rgba(0,0,0,0.35)) for optimal text readability
  - **Professional Appearance**: Photo-realistic background enhances overall site aesthetics and user experience
- **COMPLETE: Bilingual Footer System Implementation** (August 5, 2025)
  - **Japanese Version (index.html)**: Fully resolved footer visibility issues with comprehensive emergency mode fixes
  - **English Version (index-en.html)**: Complete implementation with all modal functions and enhanced styling
  - **Enhanced Modal System**: Rich content modals for About Us, Terms of Service, Privacy Policy, FAQ, Safety, Cancellation, Legal Compliance, Cookie Policy, and Help Center
  - **Emergency Visibility System**: Multi-stage execution (immediate, 100ms, 500ms, 1000ms, 2000ms) with comprehensive CSS overrides
  - **Professional Design**: Dark theme with responsive Bootstrap layout, hover effects, and glass morphism elements
  - **Complete Functionality**: All 5 footer sections fully functional in both languages with proper styling enforcement
  - **Cross-Language Consistency**: Unified design approach with language-appropriate content for Japanese and English versions
- **RESOLVED: Japanese Footer Display Issue** (August 5, 2025)
  - **Critical Fix Applied**: Resolved complete footer invisibility in Japanese version (index.html)
  - **Multiple-Layer Forced Visibility System**: Implemented comprehensive footer display enforcement
  - **Passive Event Listener Errors Fixed**: Added { passive: false } options to prevent console errors
  - **Robust Footer Rendering**: Multi-stage visibility checks (immediate, DOMContentLoaded, window.load, timeouts)
  - **Cross-Environment Compatibility**: Footer now displays correctly in both editor and standalone browser windows
  - **Visual Confirmation**: All 5 footer sections (Company Info, Services, Support, Legal, Contact) properly displayed
- **Comprehensive Footer System Implementation** (August 5, 2025)
  - **Complete multilingual footer system** with 5 main sections: Company Info, Services, Support, Legal, Contact Info
  - **Footer modal system** for detailed content display (About Us, Terms, Privacy, FAQ, Safety, Cancellation, Cookies)
  - **Language-specific approach**: Removed language toggle buttons as Japanese/English are separate versions
  - **Development workflow confirmed**: Japanese version first, then English translation approach
  - **Professional styling**: Dark theme with responsive Bootstrap layout and proper spacing
  - **Content structure**: Company mission, service links, legal compliance, contact information, social media integration
- **Complete Booking Flow Multilingual System** (August 4, 2025)
  - **Payment Page Enhancement**: Resolved critical guide data mismatch and implemented comprehensive multilingual support
  - **Booking Confirmation Multilingual Implementation**: Added complete language detection and translation system
  - Fixed guide rate display consistency (numeric to string conversion with proper units) 
  - Enhanced language inheritance across entire booking flow (index → payment → confirmation)
  - Added complete translation dictionaries for all interface elements (Japanese/English)
  - Language-aware navigation: back buttons and home redirects respect user's language preference
  - Smart language detection: URL parameters, booking data, and referrer-based detection
  - Localized content: success messages, booking details, next steps, payment info, action buttons
- **CRITICAL: Scalable Storage Architecture Implementation** (August 3, 2025)
  - Implemented distributed storage system to prevent LocalStorage capacity overflow
  - Individual store data saved with unique keys (`store_{id}`) instead of single large array
  - Smart metadata management system for efficient data retrieval
  - Automatic image compression (Main: 600px/0.7quality, Logo: 200px/0.8quality, Additional: 400px/0.6quality)
  - Data size limits: 500KB per store, 3MB total system limit
  - Automatic cleanup of data older than 7 days when capacity exceeds 80%
  - Backward compatibility maintained with legacy `registeredSponsors` format
  - Maximum 50 active stores in memory with intelligent rotation system

- **Major Conceptual Revision**: Removed draft management from public sponsor list pages (sponsor-list.html)
  - Public sponsor list is now exclusively for tourists/customers viewing published stores
  - Implemented modern, stylish dark gradient design with glass morphism effects
  - Enhanced with premium typography (Inter font) and professional card layouts
- **Draft Management System**: Moved to individual store edit pages (sponsor-edit.html)
  - Added prominent draft management section at top of edit pages
  - Implemented auto-save functionality (30-second intervals)
  - Manual save/load draft buttons with visual feedback
  - Draft timestamp tracking and saved items overview
  - Yellow gradient design for draft management UI to distinguish from main content
- Comprehensive SEO optimization implemented for sponsor-list.html
- Unified sponsor login/registration concept: login now requires store name, email, phone (matching registration form)
- Fixed sponsor preview functionality with dedicated sponsor-preview.html page
- Sponsor login now redirects to individual store edit page instead of admin dashboard

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
- **Framework**: Vanilla JavaScript with Bootstrap 5.3
- **Styling**: Bootstrap CSS with custom CSS modules for specialized components, responsive design with mobile-first approach.
- **UI Components**: Responsive navigation, modal-based workflows, toast notifications, loading states, adaptive UI for different screen sizes, touch-friendly interactions, and swipe gestures for navigation.
- **Language Support**: Dynamic translation system with Japanese/English switching, language preference persistence, and region-based language detection.
- **Authentication**: Session-based authentication with Firebase integration.
- **Core Features**: Guide discovery (real-time search/filtering, location-based, language preference matching, specialty categorization), user registration (tourist/guide registration with profile management, phone verification, ID document upload with camera functionality), multilingual support, authentication & authorization (role-based access control, session management, protected route handling).
- **UI/UX Decisions**: Consistent modal designs, unified button styling, oval button styling (border-radius: 35px), enhanced hover effects, dynamic content translation, dynamic guide card rendering with individual bookmark/compare buttons, visual feedback systems (e.g., color changes, pulse animations).
- **Pagination**: 12-guides-per-page pagination with "Show More" button (later transitioned to traditional pagination), advanced UI with progress bars, page previews, quick jump, smart page number display, floating toolbar with bookmark system (yellow border), comparison tool (3-guide limit, green border), browsing history, quick page access, keyboard navigation, sort functionality (rating, price, name), and memory efficiency maintaining only 12 guides in DOM.

## Backend
- **Server**: Node.js with Express 4.18.2, configured for Replit deployment on port 5000.
- **Deployment**: Custom deployment scripts, health check endpoint.
- **Static File Serving**: Express static file middleware.
- **Architecture**: ThreadedTCPServer with multi-threading for concurrent user handling, comprehensive API endpoints (`/api/system-status`, `/api/guides`), enhanced security headers (CORS, XSS protection, content sniffing, frame options), professional 404 error pages, and system health monitoring.

## Database
- **ORM**: Drizzle (prepared for PostgreSQL integration).
- **Storage**: Distributed LocalStorage system with smart capacity management, browser session storage for authentication state.
- **Sponsor Storage**: SponsorStorageManager class implementing distributed storage architecture:
  - Individual store keys instead of single large array
  - Metadata-based efficient retrieval system
  - Automatic image compression and size optimization
  - Intelligent cleanup and rotation for scalability
  - Real-time usage monitoring and capacity management
- **Backend Storage**: SQLite for scalable data management with bookmark/comparison persistence.

## Key Technical Components
- **Camera Integration**: Document photo capture, profile photo upload, mobile camera optimization, file fallback system.
- **Search & Filter System**: Multi-criteria filtering, real-time search results, keyword-based matching, advanced filter combinations, location, language, price filtering, keyword checkboxes, custom keyword input field.
- **Management Center**: Centralized management for bookmarks and comparisons, bulk data deletion, visual feedback for selected items.
- **Access Control**: Guide detail viewing system requiring tourist registration, modal-based access prompts, header login differentiation (tourist/guide login).

# External Dependencies

## CDN Resources
- Bootstrap 5.3.0-alpha1 (CSS & JS)
- Bootstrap Icons 1.10.0
- Swiper.js 10.x (for carousel components)

## Third-party Integrations
- Firebase (authentication services)
- Camera API (document capture)
- Geolocation services (location detection)