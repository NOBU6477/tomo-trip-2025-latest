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