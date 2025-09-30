# TomoTrip - Local Guide Matching Platform

A comprehensive bilingual (Japanese/English) travel guide web application connecting tourists with local guides for authentic discovery experiences.

## 🌟 Features

### Core Functionality
- **Bilingual Interface**: Complete language separation with Japanese (`index.html`) and English (`index-en.html`) versions
- **Guide Registration**: Comprehensive registration system with phone verification and ID document upload
- **Tourist Registration**: Simplified registration flow with complete English localization
- **Sponsor Management**: Store registration and management dashboard system
- **Language-Aware Routing**: Automatic detection and routing to appropriate language-specific pages

### Technical Highlights
- **Backend**: Node.js + Express + PostgreSQL with Drizzle ORM
- **Frontend**: Vanilla JavaScript with Bootstrap 5.3, ESM module architecture
- **Authentication**: Session-based authentication with database storage
- **Region Support**: All 47 Japanese prefectures with English translations
- **Responsive Design**: Mobile-first approach with touch-friendly interactions
- **Security**: CSP-compliant architecture with zero inline scripts

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x
- PostgreSQL database
- npm or yarn

### Installation
```bash
npm install
```

### Database Setup
```bash
npm run db:push
```

### Running the Application
```bash
npm start
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
├── public/              # Frontend assets
│   ├── assets/         # Images, CSS, JavaScript modules
│   ├── index.html      # Japanese homepage
│   ├── index-en.html   # English homepage
│   └── *.html          # Registration and other pages
├── server/             # Backend API
│   ├── guideAPI.js     # Guide-related endpoints
│   └── storage.ts      # Database operations
├── shared/             # Shared code
│   └── schema.ts       # Database schema (Drizzle ORM)
├── replit-server.js    # Main server entry point
└── package.json        # Dependencies
```

## 🌐 Language Support

The platform features complete language separation:
- Japanese interface: `index.html`, `tourist-registration-simple.html`, etc.
- English interface: `index-en.html`, `tourist-registration-simple-en.html`, etc.
- Automatic routing based on current page language
- Guide registration filters by language (guides appear only in their registration language)

## 🔒 Security

- No hardcoded credentials in client code
- Server-side authentication structure
- CSP-compliant architecture
- Environment-based secret management

## 📝 Recent Updates (2025-09-30)

- ✅ Language-aware registration routing implemented
- ✅ Complete English registration pages created
- ✅ Critical security fix: removed hardcoded credentials
- ✅ Tourist registration page 100% English
- ✅ Nationality dropdown fully translated
- ✅ Region filtering with English translations

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Frontend**: Vanilla JavaScript (ESM), Bootstrap 5.3
- **Styling**: Custom CSS with responsive design
- **Deployment**: Replit-ready configuration

## 📄 License

Proprietary - TomoTrip Platform

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.
