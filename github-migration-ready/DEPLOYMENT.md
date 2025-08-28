# TomoTrip Deployment Guide

## 🚀 Deployment Options

### Option 1: Replit Deployment (Recommended)

1. **Import to Replit**
   - Create new Repl from GitHub repository
   - Select Node.js as the language

2. **Configure Environment**
   - Go to Secrets tab in Replit
   - Add the following environment variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   PGHOST=your_host
   PGPORT=5432
   PGUSER=your_username
   PGPASSWORD=your_password
   PGDATABASE=your_database_name
   SESSION_SECRET=your_random_secret_key
   PORT=5000
   ```

3. **Initialize Database**
   ```bash
   npm run db:push
   ```

4. **Start the Application**
   - Click the "Run" button in Replit
   - Your app will be available at the generated Replit URL

### Option 2: Traditional Cloud Deployment

#### Railway Deployment

1. **Connect Repository**
   - Go to Railway.app
   - Connect your GitHub repository

2. **Add PostgreSQL Database**
   - Add PostgreSQL service from Railway marketplace
   - Note the connection details

3. **Configure Environment Variables**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   SESSION_SECRET=your_random_secret_key
   PORT=5000
   ```

4. **Deploy**
   - Railway will automatically deploy on git push

#### Heroku Deployment

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set SESSION_SECRET=your_random_secret_key
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## 🗄️ Database Setup

### PostgreSQL Requirements
- PostgreSQL 12+ recommended
- Required extensions: uuid-ossp (for UUID generation)

### Initial Database Setup
1. Create database and user
2. Set appropriate permissions
3. Run schema migration:
   ```bash
   npm run db:push
   ```

### Environment Variables Required
```env
DATABASE_URL=postgresql://user:password@host:port/database
PGHOST=your_host
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=your_database
SESSION_SECRET=your_64_character_random_string
PORT=5000
```

## 🔧 Production Configuration

### Security Headers
The application includes security headers:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### Session Security
- Secure session cookies
- HttpOnly flags
- SameSite protection
- Session expiration

### Database Security
- Connection pooling
- Prepared statements
- Input validation
- SQL injection protection

## 📊 Monitoring & Maintenance

### Health Checks
- `/health` endpoint for uptime monitoring
- Database connection status
- Memory usage monitoring

### Logs
- Application logs to console
- Error tracking and reporting
- Performance metrics

### Backups
- Regular PostgreSQL backups recommended
- Environment variable backup
- Code repository backup via Git

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Confirm database exists

2. **Session Errors**
   - Ensure SESSION_SECRET is set
   - Check session storage configuration
   - Verify cookie settings

3. **Static Files Not Loading**
   - Check public directory structure
   - Verify CSS/JS file paths
   - Confirm Express static middleware

### Debug Mode
```bash
NODE_ENV=development npm start
```

### Database Debug
```bash
npm run db:studio
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Stateless application design
- Session store in database
- Load balancer compatible

### Performance Optimization
- Enable gzip compression
- CDN for static assets
- Database query optimization
- Connection pooling

### Resource Requirements
- **Minimum**: 512MB RAM, 1 CPU core
- **Recommended**: 1GB RAM, 2 CPU cores
- **Database**: Separate instance recommended for production

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Deploy to Railway
      run: railway deploy
```

## ✅ Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Session secret generated (64+ characters)
- [ ] SSL/TLS certificates configured
- [ ] Domain name configured (if applicable)
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Error tracking configured

## 📞 Support

For deployment assistance:
- Check GitHub Issues
- Review application logs
- Contact development team

---

**Happy Deploying! 🚀**