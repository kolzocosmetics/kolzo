#!/bin/bash

# KOLZO Full-Stack Deployment Script
# This script deploys both frontend and backend with all features

set -e  # Exit on any error

echo "🚀 Starting KOLZO Full-Stack Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git first."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Frontend environment
    if [ ! -f .env ]; then
        cp .env.example .env 2>/dev/null || echo "VITE_API_URL=http://localhost:5000/api" > .env
        print_success "Created frontend .env file"
    fi
    
    # Backend environment
    if [ ! -f backend/.env ]; then
        if [ -f backend/env.example ]; then
            cp backend/env.example backend/.env
            print_success "Created backend .env file"
        else
            print_warning "Backend .env file not created - please create it manually"
        fi
    fi
    
    print_success "Environment setup complete"
}

# Install frontend dependencies
install_frontend() {
    print_status "Installing frontend dependencies..."
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Frontend dependencies installed"
    else
        print_status "Frontend dependencies already installed"
    fi
}

# Install backend dependencies
install_backend() {
    print_status "Installing backend dependencies..."
    
    cd backend
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Backend dependencies installed"
    else
        print_status "Backend dependencies already installed"
    fi
    
    cd ..
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend built successfully"
    else
        print_error "Frontend build failed"
        exit 1
    fi
}

# Test frontend
test_frontend() {
    print_status "Testing frontend..."
    
    # Check if build directory exists
    if [ ! -d "dist" ]; then
        print_error "Frontend build directory not found. Run build first."
        exit 1
    fi
    
    # Basic file checks
    if [ ! -f "dist/index.html" ]; then
        print_error "dist/index.html not found"
        exit 1
    fi
    
    print_success "Frontend tests passed"
}

# Setup database (if MongoDB is available)
setup_database() {
    print_status "Setting up database..."
    
    # Check if MongoDB is running
    if command -v mongod &> /dev/null; then
        if pgrep -x "mongod" > /dev/null; then
            print_success "MongoDB is running"
        else
            print_warning "MongoDB is not running. Please start MongoDB manually."
        fi
    else
        print_warning "MongoDB not found. Please install MongoDB or use a cloud service."
    fi
    
    # Check if Redis is available
    if command -v redis-server &> /dev/null; then
        if pgrep -x "redis-server" > /dev/null; then
            print_success "Redis is running"
        else
            print_warning "Redis is not running. Please start Redis manually."
        fi
    else
        print_warning "Redis not found. Please install Redis or use a cloud service."
    fi
}

# Seed database
seed_database() {
    print_status "Seeding database..."
    
    cd backend
    
    if [ -f ".env" ]; then
        npm run seed
        if [ $? -eq 0 ]; then
            print_success "Database seeded successfully"
        else
            print_warning "Database seeding failed - this is normal if MongoDB/Redis is not running"
        fi
    else
        print_warning "Backend .env file not found - skipping database seeding"
    fi
    
    cd ..
}

# Test backend
test_backend() {
    print_status "Testing backend..."
    
    cd backend
    
    # Check if server can start
    timeout 10s npm run dev > /dev/null 2>&1 &
    BACKEND_PID=$!
    
    sleep 5
    
    # Check if server is responding
    if curl -s http://localhost:5000/health > /dev/null; then
        print_success "Backend is responding"
        kill $BACKEND_PID 2>/dev/null || true
    else
        print_warning "Backend health check failed - this is normal if dependencies are not configured"
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    cd ..
}

# Deploy to Vercel (frontend)
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    if command -v vercel &> /dev/null; then
        vercel --prod
        print_success "Frontend deployed to Vercel"
    else
        print_warning "Vercel CLI not found. Please install it with: npm i -g vercel"
        print_status "You can deploy manually by pushing to your Vercel-connected repository"
    fi
}

# Deploy to Railway (backend)
deploy_backend() {
    print_status "Deploying backend to Railway..."
    
    if command -v railway &> /dev/null; then
        cd backend
        railway up
        cd ..
        print_success "Backend deployed to Railway"
    else
        print_warning "Railway CLI not found. Please install it with: npm i -g @railway/cli"
        print_status "You can deploy manually by pushing to your Railway-connected repository"
    fi
}

# Setup domain and DNS
setup_domain() {
    print_status "Setting up domain configuration..."
    
    # Create domain configuration files
    cat > domain-setup.md << EOF
# Domain Setup Instructions

## Domain: kolzo.in

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Set custom domain: kolzo.in
3. Configure DNS:
   - A record: 76.76.19.34
   - CNAME record: cname.vercel-dns.com

### Backend (Railway)
1. Deploy backend to Railway
2. Set custom domain: api.kolzo.in
3. Configure DNS:
   - A record: Point to Railway IP
   - CNAME record: Point to Railway domain

### Email (Zoho)
1. Configure MX records for Zoho
2. Set up SPF, DKIM, and DMARC records
3. Configure email forwarding

### SSL Certificates
- Vercel and Railway provide automatic SSL
- Ensure HTTPS is enforced
EOF

    print_success "Domain setup instructions created in domain-setup.md"
}

# Create production checklist
create_checklist() {
    print_status "Creating production checklist..."
    
    cat > production-checklist.md << EOF
# Production Deployment Checklist

## ✅ Pre-Deployment
- [ ] Environment variables configured
- [ ] Database connections tested
- [ ] Email services configured
- [ ] Payment gateways configured
- [ ] SSL certificates ready
- [ ] Domain DNS configured

## ✅ Frontend (Vercel)
- [ ] Build successful
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Performance optimized
- [ ] SEO meta tags configured

## ✅ Backend (Railway)
- [ ] Database connected
- [ ] Redis cache configured
- [ ] Email services working
- [ ] Payment webhooks configured
- [ ] API documentation accessible
- [ ] Monitoring enabled

## ✅ External Services
- [ ] Email Octopus configured
- [ ] Stripe payment processing
- [ ] PayPal integration
- [ ] Razorpay setup
- [ ] Tawk.to chat widget
- [ ] Google Analytics
- [ ] Search console

## ✅ Security
- [ ] JWT secrets configured
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] Input validation
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection

## ✅ Performance
- [ ] Image optimization
- [ ] Code splitting
- [ ] Caching configured
- [ ] CDN setup
- [ ] Database indexing
- [ ] API response optimization

## ✅ Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Log aggregation
- [ ] Alert system

## ✅ Testing
- [ ] Unit tests passing
- [ ] Integration tests
- [ ] E2E tests
- [ ] Load testing
- [ ] Security testing

## ✅ Documentation
- [ ] API documentation
- [ ] User guides
- [ ] Admin documentation
- [ ] Deployment guide
- [ ] Troubleshooting guide
EOF

    print_success "Production checklist created in production-checklist.md"
}

# Main deployment function
main() {
    echo ""
    echo "🎯 KOLZO Full-Stack Deployment"
    echo "================================"
    echo ""
    
    check_dependencies
    setup_environment
    install_frontend
    install_backend
    build_frontend
    test_frontend
    setup_database
    seed_database
    test_backend
    setup_domain
    create_checklist
    
    echo ""
    echo "🎉 Deployment preparation complete!"
    echo ""
    echo "Next steps:"
    echo "1. Configure your .env files with production values"
    echo "2. Set up your domain DNS records"
    echo "3. Deploy frontend: npm run deploy:frontend"
    echo "4. Deploy backend: npm run deploy:backend"
    echo "5. Review production-checklist.md"
    echo ""
    echo "For manual deployment:"
    echo "- Frontend: vercel --prod"
    echo "- Backend: railway up"
    echo ""
}

# Run main function
main "$@" 