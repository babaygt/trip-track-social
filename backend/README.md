# Trip Track Backend

A Node.js-based backend for the Trip Track social platform, built with Express and TypeScript.

## 🚀 Features

- **RESTful API**: Full CRUD operations for routes and users
- **Authentication**: Secure session-based authentication
- **Social Features**: Follow system, likes, and comments
- **Chat**: Message system
- **File Upload**: Image upload handling with UploadThing
- **API Documentation**: Swagger/OpenAPI documentation
- **Testing**: Comprehensive Jest test suite

## 🛠️ Tech Stack

- **Runtime**: Node.js (v20.18.0)
- **Framework**: Express with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Express Session
- **Testing**: Jest and Supertest
- **Documentation**: Swagger/OpenAPI
- **File Upload**: UploadThing
- **Validation**: Zod

## 📦 Project Structure

```
src/
├── app.ts          # Express app setup
├── config/         # Configuration files
├── middleware/     # Middlewares
├── models/         # Mongoose models
├── public/         # Static files
├── routes/         # API route definitions
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── util/           # Utility functions
└── views/          # View templates

Docker Files:
├── Dockerfile         # Production Docker configuration
├── Dockerfile.dev     # Development Docker configuration
├── .dockerignore      # Docker ignore patterns
└── .gcloudignore      # Google Cloud ignore patterns

Test Files:
├── tests/              # Test directory
│   ├── services/       # Service tests
│   ├── routes/         # Route tests
│   ├── models/         # Model tests
│   ├── middleware/     # Middleware tests
│   └── setup.ts        # Test setup configuration
└── coverage/          # Test coverage reports
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v20.18.0 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/babaygt/trip-track-social.git
   cd trip-track-social/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create `.env` file:

   ```env
   MONGODB_CONNECTION_STRING=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key_here
   UPLOADTHING_SECRET=your_uploadthing_secret_key
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   UPLOADTHING_TOKEN=your_uploadthing_token
   CLIENT_URL=your_client_url
   CLOUD_RUN_URL=cloud_run_url
   ```

4. Start development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🐳 Docker

### Development with Docker

1. Build and run the development container:

   ```bash
   # Using docker-compose from root directory (recommended)
   docker compose up --build

   # Or using Dockerfile.dev directly
   docker build -t trip-track-backend-dev -f Dockerfile.dev .
   docker run -p 8080:8080 \
     --env-file .env \
     trip-track-backend-dev
   ```

### Production Docker Build

1. Build the production image:

   ```bash
   docker build -t trip-track-backend -f Dockerfile .
   ```

2. Run the production container:
   ```bash
   docker run -p 8080:8080 \
     --env-file .env \
     trip-track-backend
   ```

### Docker Configuration

The backend uses two Dockerfile configurations:

1. `Dockerfile.dev` - Development environment with:

   - Nodemon for hot reloading
   - Development dependencies
   - Source map support
   - Exposed port 8080

2. `Dockerfile` - Production environment with:
   - Multi-stage build for optimization
   - Production dependencies only
   - Compiled TypeScript
   - Exposed port 8080

## 📚 API Documentation

The API documentation is available at `/api-docs` when the server is running. It includes:

- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests

## 📚 Documentation

- [Architecture Overview](../docs/ARCHITECTURE.md)
- [Development Guide](../docs/DEVELOPMENT.md)
- [API Documentation](../docs/SWAGGER_TEMPLATE.md)
- [Contributing Guide](../docs/CONTRIBUTING.md)

## 🤝 Contributing

Please read our [Contributing Guide](../docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
