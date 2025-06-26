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

# User Preferences

Preferred communication style: Simple, everyday language.