# Overview

Local Guide is a multilingual guide matching platform connecting tourists with local guides for discovery, registration, and booking. The project aims to be a scalable, production-ready solution for a growing marketplace, prioritizing operational speed, stability, and real-world deployment.

## Recent Changes (2025-08-28)
- **Language Version Unification**: Completely unified English and Japanese versions with identical Bootstrap structure, filtering system, and pagination layout
- **Language Switcher Fix**: Resolved center positioning issue for language toggle buttons using enhanced CSS with !important declarations
- **Filter System Alignment**: Standardized all filter options, price ranges, and language selections between both versions
- **Navigation Consistency**: Unified navigation elements, dropdown menus, and button layouts across both language versions
- **Dashboard Implementation**: Added Dashboard button to both language versions with authentication flow
- **Authentication System**: Simplified to login-only system with localStorage-based session management
- **Access Control**: Dashboard button shows disabled state until sponsor authentication is completed
- **Registration Removal**: Removed dual sponsor registration system per user request - deleted sponsor-registration.html and disabled all registration workflows
- **Modal System Fix**: Fixed modal positioning issues with proper z-index management and centered display using auth-modal.css
- **Store Dashboard Authentication Fix**: Fixed logout button functionality by adding proper event listener
- **Tourism Guide Features**: Enhanced store dashboard with tourism-specific functionality including guide registration, reservation management, and tourism statistics
- **Guide Registration System**: Created dedicated guide-registration.html for recruiting new tourism guides with comprehensive application form

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