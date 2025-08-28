# TomoTrip - Multilingual Tourism Guide Platform

A sophisticated multilingual web platform connecting tourists with local Japanese and international guides, offering immersive cross-cultural interactions through intelligent matching and dynamic language experiences.

## 🌊 Features

### Core Platform
- **Multilingual Support**: Complete Japanese/English language switching with dynamic content
- **Ocean Theme Design**: Beautiful flowing gradient backgrounds with wave animations
- **Mobile-First Responsive**: Optimized for all devices with touch-friendly interactions
- **Real-time Data**: PostgreSQL database integration with live updates

### Store Management System
- **Individual Store Accounts**: Each sponsor gets their own management dashboard
- **Real Data Persistence**: All information stored in PostgreSQL database
- **Profile Management**: Edit store details, contact info, business hours
- **Tourism Guide Registration**: Link guides to specific stores

### Authentication & Security
- **Session Management**: Secure login system with localStorage sessions
- **Data Isolation**: Individual store data access and editing
- **Role-based Access**: Separate dashboards for operations and store management
- **CSP Compliant**: All JavaScript externalized for security

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- npm package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/tomotrip-platform.git
cd tomotrip-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env file with your database credentials
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your_host
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=your_database
SESSION_SECRET=your_session_secret
PORT=5000
```

4. **Initialize database**
```bash
npm run db:push
```

5. **Start the server**
```bash
npm start
```

Visit `http://localhost:5000` to see the application.

## 📁 Project Structure

```
tomotrip-platform/
├── public/                 # Frontend files
│   ├── assets/            # CSS, JS, and image assets
│   ├── index.html         # Japanese homepage
│   ├── index-en.html      # English homepage
│   ├── sponsor-registration.html  # Store registration
│   ├── store-dashboard.html       # Store management
│   └── sponsor-list.html          # Public store listing
├── server/                # Backend configuration (future expansion)
├── shared/                # Shared schemas and types
│   └── schema.ts          # Drizzle ORM database schema
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🗄️ Database Schema

### Stores Table
- **id**: UUID primary key (auto-generated)
- **storeName**: Store display name
- **email**: Contact email address
- **phone**: Contact phone number
- **address**: Physical address
- **category**: Business category
- **status**: active/pending
- **createdAt/updatedAt**: Timestamps

### Tourism Guides Table
- **id**: UUID primary key
- **storeId**: Foreign key to stores
- **guideName**: Guide's name
- **languages**: Supported languages
- **experience**: Years of experience
- **specialties**: Areas of expertise

### Reservations Table
- **id**: UUID primary key
- **storeId**: Foreign key to stores
- **guideId**: Foreign key to tourism guides
- **customerInfo**: Booking details
- **dateTime**: Reservation date and time
- **status**: confirmed/pending/cancelled

## 🛠️ API Endpoints

### Store Management
- `POST /api/sponsor-stores` - Create new store
- `GET /api/sponsor-stores` - List all active stores
- `GET /api/sponsor-stores/:id` - Get specific store details
- `PUT /api/sponsor-stores/:id` - Update store information

### Tourism Guides
- `POST /api/tourism-guides` - Register new guide
- `GET /api/tourism-guides/store/:storeId` - Get guides for specific store

### Reservations
- `POST /api/reservations` - Create new reservation
- `GET /api/reservations/store/:storeId` - Get reservations for specific store

## 🎨 Design Features

### Ocean Theme
- Flowing gradient backgrounds
- Wave animations and effects
- Blue-green color palette
- Glass morphism elements

### Multilingual Experience
- Dynamic language switching
- Persistent language preferences
- Region-based auto-detection
- Complete UI translation

### Mobile Optimization
- Touch-friendly interfaces
- Responsive breakpoints
- Mobile-specific optimizations
- Progressive Web App features

## 🔧 Development Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server
npm run db:push    # Push schema changes to database
npm run db:studio  # Open Drizzle Studio (database GUI)
```

## 📋 Environment Configuration

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- Database credentials (`PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`)

Optional:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## 🚀 Deployment

### Replit Deployment
1. Import repository to Replit
2. Set environment variables in Secrets tab
3. Run the project

### Traditional Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Railway, etc.)

## 📈 Current Status

**Production Ready Features:**
- ✅ Complete database integration
- ✅ Working authentication system
- ✅ Individual store management
- ✅ Real data persistence
- ✅ Mobile-responsive design
- ✅ Multilingual support
- ✅ Tourism guide functionality
- ✅ Reservation system

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: TomoTrip Platform Developers
- **Design**: Ocean-themed responsive interface
- **Architecture**: Modern Node.js + PostgreSQL stack

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

---

**Built with ❤️ for connecting tourists with authentic local experiences**