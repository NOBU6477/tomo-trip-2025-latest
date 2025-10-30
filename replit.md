# Overview

Local Guide is a multilingual guide matching platform connecting tourists with local guides for discovery, registration, and booking. The project aims to be a scalable, production-ready solution for a growing marketplace, prioritizing operational speed, stability, and real-world deployment.

## Recent Changes (2025-10-30)
- **Sponsor Registration Redirect Fix**: Fixed critical issue where newly registered stores were not redirected to correct dashboard
  - Modified sponsor-registration.html and sponsor-registration-en.html to pass storeId as URL parameter
  - Enhanced store-dashboard.html to accept storeId from URL and save to localStorage
  - New registration flow now correctly shows the newly created store's dashboard instead of default store
  - Seamless transition from registration to personalized store management

## Previous Changes (2025-10-30)
- **Scalable Sponsor Store List Page**: Complete implementation of scalable display system for growing number of stores
  - Pagination system: 12 stores per page with smart page number display and navigation
  - Search functionality: Real-time store name search with debounce (300ms)
  - Filter system: Category filter with active filter badges
  - Sort options: Registration date (newest/oldest), store name, views, bookings
  - Performance optimized: Only renders visible items, efficient DOM updates
  - Responsive design: Mobile-friendly layout with adaptive cards
  - Statistics dashboard: Total stores, displayed count, active stores
- **Sponsor Store API Enhancement**: Complete CRUD operations with soft-delete support
  - Created `server/sponsorStoreAPI.js` for sponsor store operations (create, read, update, delete, list)
  - File-based storage system using JSON (data/sponsor-stores.json) for persistence
  - Integrated into main server (replit-server.js) alongside Guide API
  - Endpoints: POST/GET /api/sponsor-stores, GET/PUT/DELETE /api/sponsor-stores/:id
  - Soft delete functionality: Sets isActive=false while preserving data
  - Email duplication checking, proper error responses, logging
- **Sponsor Registration Error Handling Fixed**: Complete fix for registration failure issues
  - Added proper HTTP status code checking with `response.ok` validation
  - Specific error messages for duplicate email addresses and server errors
  - Success modal now includes navigation options: Store Dashboard, Sponsor List, and Home
  - Both Japanese (sponsor-registration.html) and English (sponsor-registration-en.html) versions updated
  - Direct links to sponsor-list.html added in registration completion flow
- **Prefecture Selection System Verified**: Confirmed 124 location options working correctly
  - All 47 prefectures + remote island regions loading properly
  - English translations (Hokkaido, Aomori, Tokyo...) displaying on English pages
  - Japanese names (北海道、青森県、東京都...) displaying on Japanese pages
  - Debug logging added to track option generation and selection

## Previous Changes (2025-10-28)
- **Profile Photo System Complete**: Full implementation of guide profile photo upload and display using Google Cloud Storage
  - Profile photos uploaded to GCS at `/objects/tomotrip-private/uploads/profiles/profile_{uuid}_{filename}`
  - Direct file upload via ObjectStorageService.uploadFileBuffer method
  - Multi-level fallback system: profileImageUrl → profilePhoto.profileImageUrl → profilePhoto → default image
  - Fixed critical bug where uploaded photo URLs were not saved to guide records
  - Profile photos now consistently displayed across both Japanese and English versions
- **Guide Edit Page Localization**: Complete English version (guide-edit-en.html) fully translated
  - All UI elements, labels, buttons, placeholders translated to English
  - JavaScript alert/error messages localized
  - Proper language-aware redirects (index-en.html vs index.html)
  - English location defaults and language/specialty mappings
- **Registration Flow Enhancement**: Profile photo upload integrated into guide registration
  - Both guide-registration-perfect.html and guide-registration-perfect-en.html support photo upload
  - Uploaded profileImageUrl properly stored in sessionStorage and included in registration data
  - Seamless integration with existing registration workflow

## Previous Changes (2025-09-30)
- **Language-Aware Registration Routing Implemented**: Button routing now detects current page language and directs users to appropriate registration pages
  - Tourist, Guide, and Sponsor registration buttons route to *-en.html pages when on English version
  - Language detection based on pathname (index-en.html vs index.html)
  - Smooth user flow maintained across language boundaries
- **English Registration Pages Created**: Complete English versions of all three registration types
  - tourist-registration-simple-en.html: Fully translated with step indicators, form labels, nationality dropdown
  - guide-registration-perfect-en.html: English title and lang attribute set (content translation in progress)
  - sponsor-registration-en.html: English title and lang attribute set (content translation in progress)
- **Critical Security Fix**: Removed hardcoded administrator credentials from client-side code
  - Deleted test credentials display in sponsor login modal
  - Replaced client-side authentication with server-side API call structure
  - Added security comments and proper implementation guidance
- **Tourist Registration Page 100% English**: Complete translation of all UI elements
  - Step indicators: Basic Information, Phone Verification, ID Document
  - All form labels and validation messages in English
  - Nationality dropdown fully translated (Japan, China, South Korea, etc.)
  - Mixed-language text corrected
- **Language Switching System Fixed**: Resolved critical redirect issue where English page immediately redirected back to Japanese
  - Root cause: Conflict between HTML onclick attributes and JavaScript addEventListener
  - Solution: Removed onclick attributes from language buttons, implemented page-aware event listeners
  - Language buttons now correctly detect current page and prevent unnecessary redirects
- **Console Errors Eliminated**: Fixed all TypeError null reference errors by adding proper element existence checks
  - Added null checks for registerSubmitBtn, loginSubmitBtn, contactSubmitBtn, and other form elements
  - Improved code robustness with defensive programming patterns
- **Bilingual Interface Complete**: index.html (Japanese) and index-en.html (English) fully functional
  - All static HTML text translated (100+ text elements)
  - Smart language switching with user-friendly alerts when already on target language
- **PostgreSQL Database Migration Complete**: Full transition from localStorage to PostgreSQL with Drizzle ORM integration
- **Individual Store Account System**: Each sponsor now gets dedicated store account with UUID identification and data isolation
- **Real Database Operations**: All store registrations, profile edits, and data management now persist to actual PostgreSQL database
- **Store Dashboard Integration**: Individual store management dashboards now load and edit real store data from database
- **API Server Implementation**: Complete Express.js REST API with endpoints for stores, guides, and reservations
- **Authentication System Overhaul**: Session-based authentication with database storage and proper logout functionality
- **Store Listing Page**: Public sponsor-list.html page displaying all registered stores with statistics
- **Production Architecture**: Node.js + Express + PostgreSQL stack ready for immediate deployment

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
- **Styling**: Bootstrap CSS with custom CSS modules, responsive design with mobile-first approach, custom ocean background.
- **UI Components**: Responsive navigation, modal-based workflows, toast notifications, loading states, adaptive UI, touch-friendly interactions, swipe gestures.
- **Security**: CSP-compliant architecture with zero inline scripts, all code externalized. Enhanced error suppression system.
- **Module Structure**: Centralized data, event management, main ESM entry.
- **Language Support**: Dynamic translation system with Japanese/English switching, language preference persistence, region-based detection.
- **UI/UX Decisions**: Consistent modal designs, unified oval button styling, enhanced hover effects, dynamic content translation, dynamic guide card rendering with individual bookmark/compare buttons, visual feedback systems.
- **Pagination**: "Show More" button (transitioning to traditional pagination), advanced UI with progress bars, page previews, quick jump, smart page number display, floating toolbar with bookmark system, comparison tool (3-guide limit), browsing history, quick page access, keyboard navigation, sort functionality (rating, price, name), memory efficiency (12 guides in DOM).
- **Footer System**: Complete multilingual footer with 5 sections (Company Info, Services, Support, Legal, Contact Info) and detailed content modals. Dark theme with responsive Bootstrap layout, hover effects, and glass morphism elements.
- **Draft Management**: Public sponsor list for published stores. Draft management moved to individual store edit pages with auto-save, manual save/load, timestamp tracking, and distinct yellow gradient UI.

## Backend
- **Server**: Python-only workflow configured for direct execution on port 5000.
- **Deployment**: Enhanced production-ready features including health monitoring, graceful shutdown, enhanced logging, CORS support, deployment optimization, security headers, performance caching, and OPTIONS request handling. Custom deployment scripts.
- **Architecture**: ThreadedTCPServer with multi-threading, comprehensive API endpoints, professional 404 error pages.

## Database
- **ORM**: Drizzle (prepared for PostgreSQL integration).
- **Storage**: Distributed LocalStorage system with smart capacity management for frontend data; browser session storage for authentication. SponsorStorageManager for distributed sponsor data with image compression, cleanup, and real-time monitoring.
- **Backend Storage**: SQLite for scalable data management with bookmark/comparison persistence.

## Key Technical Components
- **Camera Integration**: Document photo capture, profile photo upload, mobile camera optimization, file fallback system.
- **Search & Filter System**: Multi-criteria filtering, real-time search, keyword-based matching, advanced filter combinations, location, language, price filtering, keyword checkboxes, custom keyword input.
- **Management Center**: Centralized management for bookmarks and comparisons, bulk data deletion, visual feedback.
- **Access Control**: Guide detail viewing requires tourist registration, modal-based access prompts, header login differentiation.
- **Booking Flow**: Complete multilingual system with language detection and translation across payment and confirmation pages. Consistent guide rate display and language inheritance.
- **Login/Registration**: Unified sponsor login/registration concept requiring store name, email, phone. Login redirects to individual store edit page.
- **Dual Dashboard System**: 
  - sponsor-dashboard.html: Admin/operations dashboard for TomoTrip team to manage all stores
  - store-dashboard.html: Individual store dashboard for each sponsor to manage their own store
  - Role-based access control with different permission levels and feature sets

# External Dependencies

## CDN Resources
- Bootstrap 5.3.0-alpha1 (CSS & JS)
- Bootstrap Icons 1.10.0
- Swiper.js 10.x (for carousel components)

## Third-party Integrations
- Firebase (authentication services)
- Camera API (document capture)
- Geolocation services (location detection)