# Trip Track Frontend

A modern React-based frontend for the Trip Track social platform, built with TypeScript and Vite.

## 🚀 Features

- **Route Management**: Create, view, and share travel routes
- **Social Features**: Follow users, like routes, and comment
- **Real-time Chat**: Message other users (WebSocket integration planned)
- **Interactive Maps**: Route visualization using Google Maps
- **Responsive Design**: Mobile-first UI using Tailwind CSS
- **Modern Stack**: React 18, TypeScript, Vite, and Zustand

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**:
  - Zustand for global state
  - React Query for server state
- **Styling**:
  - Tailwind CSS
  - Shadcn/ui components
- **Maps**: Google Maps API
- **File Upload**: UploadThing
- **Testing**: Vitest and React Testing Library

## 📦 Project Structure

```
src/
├── assets/           # Static assets (images, icons)
├── components/       # Reusable UI components
│   ├── auth/        # Authentication components
│   ├── error/       # Error handling components
│   ├── layout/      # Layout components
│   ├── maps/        # Map-related components
│   ├── ui/          # Shadcn/ui components
│   └── upload/      # File upload components
├── features/        # Feature-based modules
│   ├── auth/        # Authentication features
│   ├── chat/        # Chat and messaging features
│   ├── home/        # Home page features
│   ├── profile/     # User profile features
│   └── route/       # Route management features
├── hooks/           # Global custom hooks
├── lib/            # Utility functions and configs
│   ├── utils.ts    # Utility functions
│   ├── axios.ts    # Axios configuration
│   └── validations/ # Form validations
├── routes/         # Route definitions and components
├── services/       # API service layer
├── stores/         # Global state management
└── types/          # TypeScript type definitions

Configuration Files:
├── .env                 # Development environment variables
├── .env.production      # Production environment variables
├── components.json      # Shadcn/ui configuration
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript base configuration
├── tsconfig.app.json    # App-specific TypeScript config
├── tsconfig.node.json   # Node-specific TypeScript config
├── vite.config.ts       # Vite configuration
└── eslint.config.js     # ESLint configuration

Docker Files:
├── Dockerfile          # Production Docker configuration
├── Dockerfile.dev      # Development Docker configuration
└── .dockerignore       # Docker ignore patterns
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v20.18.0 or higher)
- npm or yarn
- Google Maps API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/babaygt/trip-track-social.git
   cd trip-track-social/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create `.env` file:

   ```env
   VITE_API_URL=http://localhost:8080
   VITE_GOOGLE_MAPS_API_KEY=your_api_key
   ```

4. Start development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🐳 Docker

### Development with Docker

1. Build and run the development container:

   ```bash
   # Using docker-compose from root directory (recommended)
   docker compose up --build

   # Or using Dockerfile.dev directly from frontend directory
   docker build -t trip-track-frontend-dev -f Dockerfile.dev .
   docker run -p 5173:5173 \
     -e VITE_API_URL=http://localhost:8080 \
     -e VITE_GOOGLE_MAPS_API_KEY=your_key \
     trip-track-frontend-dev
   ```

2. Access the application:
   - Frontend: http://localhost:5173 (Vite's default development port)

### Production Docker Build

1. Build the production image:

   ```bash
   docker build -t trip-track-frontend -f Dockerfile .
   ```

2. Run the production container:
   ```bash
   docker run -p 8080:8080 \
     -e VITE_API_URL=https://api.example.com \
     -e VITE_GOOGLE_MAPS_API_KEY=your_key \
     trip-track-frontend
   ```

### Docker Configuration

The frontend uses two Dockerfile configurations:

1. `Dockerfile.dev` - Development environment with:

   - Hot reloading (Vite dev server)
   - Development dependencies
   - Volume mounting for live changes
   - Exposed port 5173

2. `Dockerfile` - Production environment with:
   - Multi-stage build for optimization
   - Static file serving with `serve`
   - Optimized bundle size
   - Exposed port 8080

### Port Configuration

- Development (Dockerfile.dev):

  - Internal/External Port: 5173 (Vite's default)
  - Access URL: http://localhost:5173

- Production (Dockerfile):
  - Internal/External Port: 8080 (serve static files)
  - Access URL: http://localhost:8080

## 📚 Documentation

- [Architecture Overview](../docs/ARCHITECTURE.md)
- [Development Guide](../docs/DEVELOPMENT.md)
- [API Documentation](../docs/SWAGGER_TEMPLATE.md)
- [Contributing Guide](../docs/CONTRIBUTING.md)

## 🤝 Contributing

Please read our [Contributing Guide](../docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
