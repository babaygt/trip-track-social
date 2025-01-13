# Development Guide

This guide will help you set up your development environment and understand the development workflow for Trip Track.

## Prerequisites

- Node.js (v20.18.0 or higher)
- MongoDB
- Docker and Docker Compose (optional)
- Git
- A code editor (VS Code recommended)
- Google Maps API key
- UploadThing account and API keys

## Initial Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/trip-track-v2.git
   cd trip-track-v2
   ```

2. **Environment Configuration**

   Create `.env` files in both frontend and backend directories:

   Frontend (.env):

   ```env
   VITE_API_URL=http://localhost:8080/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

   Backend (.env):

   ```env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/triptrack
   SESSION_SECRET=your_session_secret
   UPLOADTHING_SECRET=your_uploadthing_secret_key_here
   UPLOADTHING_APP_ID=your_uploadthing_app_id_here
   UPLOADTHING_TOKEN=your_uploadthing_token_here
   CLIENT_URL=http://localhost:5173
   ```

3. **Install Dependencies**

   ```bash
   # Frontend dependencies
   cd frontend
   npm install

   # Backend dependencies
   cd ../backend
   npm install
   ```

## Development Workflow

### Running the Application

1. **Using Local Development Server**

   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev

   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

   The application will be available at:

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/api-docs

2. **Using Docker**

   ```bash
   # Development
   docker compose up --build

   # Production
   docker compose -f docker-compose.prod.yml up --build
   ```

### Code Style and Linting

We use ESLint and Prettier for code formatting:

```bash
# Backend
cd backend
npm run lint        # Check for issues
npm run lint:fix    # Fix issues automatically

# Frontend
cd frontend
npm run lint
npm run lint:fix
```

### Testing

1. **Running Tests**

   ```bash
   # Backend tests
   cd backend
   npm run test              # Run all tests
   npm run test:watch        # Watch mode
   npm run test:coverage     # Coverage report

   # Frontend tests
   cd frontend
   npm run test
   ```

2. **Writing Tests**
   - Place tests next to the code they test
   - Follow the naming convention: `*.test.ts` or `*.spec.ts`
   - Use Jest's describe/it syntax
   - Mock external dependencies

### Database Management

1. **Local MongoDB**

   - Start MongoDB service
   - Use MongoDB Compass for visualization
   - Default URL: `mongodb://localhost:27017/triptrack`

2. **Database Backup/Restore**

   ```bash
   # Backup
   mongodump --uri="mongodb://localhost:27017/triptrack" --out=./backup

   # Restore
   mongorestore --uri="mongodb://localhost:27017/triptrack" ./backup
   ```

### API Development

1. **Adding New Endpoints**

   - Create route file in `backend/src/routes`
   - Add controller logic in `backend/src/controllers`
   - Add service methods in `backend/src/services`
   - Document using Swagger annotations
   - Update tests

2. **API Documentation**
   - Available at: `http://localhost:8080/api-docs`
   - Update annotations in route files
   - Follow OpenAPI 3.0 specification

### Frontend Development

1. **Component Development**

   - Use functional components with hooks
   - Follow atomic design principles
   - Place components in appropriate feature folders
   - Include prop types and documentation

2. **State Management**
   - Use Zustand for global state
   - Use React Query for API state
   - Follow store organization pattern

### Common Tasks

1. **Adding a New Feature**

   - Create feature branch
   - Update documentation
   - Add tests
   - Create pull request

2. **Debugging**

   - Use Chrome DevTools for frontend
   - Use VS Code debugger for backend
   - Check logs in `docker compose logs`

3. **Performance Optimization**
   - Run Lighthouse audits
   - Profile React components
   - Monitor API response times

## Deployment

1. **Production Build**

   ```bash
   # Frontend
   cd frontend
   npm run build

   # Backend
   cd backend
   npm run build
   ```

2. **Docker Production**
   ```bash
   docker compose -f docker-compose.prod.yml up --build
   ```

## Troubleshooting

Common issues and their solutions:

1. **MongoDB Connection Issues**

   - Check if MongoDB is running
   - Verify connection string
   - Check network settings

2. **Build Errors**

   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify environment variables

3. **API Errors**

   - Check API logs
   - Verify request format
   - Check authentication

4. **UploadThing Issues**
   - Verify API keys
   - Check file size limits
   - Verify allowed file types

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [UploadThing Documentation](https://docs.uploadthing.com/)
