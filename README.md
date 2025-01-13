# Trip Track

Trip Track is a full-stack web application that allows users to create, share, and discover travel routes. Users can plan their journeys using interactive maps, share their routes with others, and engage with the community through comments, likes, and chat.

## 📚 Documentation Overview

- **[API Documentation](http://localhost:8080/api-docs)** - Interactive OpenAPI/Swagger documentation
- **[Data Models](docs/DATA_DOCUMENTATION.md)** - Detailed documentation of data structures and relationships
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System architecture and design decisions
- **[Contributing Guide](docs/CONTRIBUTING.md)** - Guidelines for contributing to the project
- **[Development Guide](docs/DEVELOPMENT.md)** - Setup and development workflow

## 🎯 Key Features

- **Route Planning & Sharing:**

  - Interactive map-based route creation
  - Multiple travel modes (driving, cycling, walking, transit)
  - Route visibility controls and sharing options

- **Social Features:**

  - User profiles and following system
  - Route comments and likes
  - Real-time chat between users
  - Route bookmarking

- **Developer Experience:**
  - Interactive API documentation with Swagger UI
  - Comprehensive data models and type safety
  - Modern development stack with hot reloading
  - Docker support for easy deployment

## 🚀 Tech Stack

### Frontend

- **React 18** with **TypeScript**
- **Vite** for build tooling
- **TanStack Query** for data fetching
- **Tailwind CSS** with **shadcn/ui** components
- **Google Maps API** (@vis.gl/react-google-maps)
- **UploadThing** for file uploads
- **Zustand** for state management
- **React Router** for navigation
- **React Hook Form** with **Zod** validation

### Backend

- **Node.js** with **Express**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **Jest** for testing
- **Express Session** for authentication
- **Express Validator** for request validation
- **UploadThing** for file uploads

## 🏗️ Architecture

Trip Track follows a modern client-server architecture with:

- **Frontend:** React-based SPA with TypeScript
- **Backend:** Express.js REST API with OpenAPI documentation
- **Database:** MongoDB with Mongoose ODM
- **Real-time:** WebSocket-based chat system (not implemented yet)
- **Authentication:** Session-based with secure cookie handling

For detailed architecture documentation, see our [Architecture Overview](docs/ARCHITECTURE.md).

### Domain Models

- **Users** with authentication and social features
- **Routes** with waypoints and travel modes
- **Comments** and messaging system
- **Real-time updates** for messages (not implemented yet)

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v20.18.0 or higher)
- **MongoDB**
- **npm** or **yarn**
- **Docker** (optional)

### Environment Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/babaygt/trip-track-social.git
   cd trip-track-social
   ```

2. **Install dependencies:**

   - **Frontend:**

     ```bash
     cd frontend
     npm install
     ```

   - **Backend:**

     ```bash
     cd ../backend
     npm install
     ```

3. **Configure Environment Variables:**

   - **Frontend:**

     Create a `.env` file in the `frontend` directory and add the following variables:

     ```env
     VITE_API_URL=http://localhost:8080/
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
     ```

   - **Backend:**

     Create a `.env` file in the `backend` directory and add the following variables:

     ```env
     PORT=8080
     MONGODB_URI=your_mongodb_uri
     SESSION_SECRET=your_session_secret
     UPLOADTHING_SECRET=your_uploadthing_secret_key_here
     UPLOADTHING_APP_ID=your_uploadthing_app_id_here
     UPLOADTHING_TOKEN=your_uploadthing_token_here
     CLIENT_URL=http://localhost:5173
     ```

4. **Run the Application:**

   - **Using npm:**

     - **Frontend:**

       ```bash
       cd frontend
       npm run dev
       ```

     - **Backend:**

       ```bash
       cd ../backend
       npm run start
       ```

   - **Using Docker (Optional):**

     Ensure you have Docker installed and run:

     ```bash
     docker-compose up --build
     ```

     This will set up both frontend and backend services along with MongoDB.

5. **Access the Application:**

   Open your browser and navigate to `http://localhost:5173` to access the frontend and `http://localhost:8080` for the backend API.

## 🧪 Running Tests

- **Backend Tests:**

  ```bash
  cd backend
  npm run test
  ```

## 📚 Documentation

### API Endpoints

Detailed documentation of the API endpoints can be found [here](http://localhost:8080/api-docs). It is generated with Swagger.

#### Swagger Template

You can use the Swagger template to generate your own API documentation. You can find the template [here](docs/SWAGGER_TEMPLATE.md).

### Data Documentation

Detailed documentation of the data models can be found [here](docs/DATA_DOCUMENTATION.md).

### Development Guide

Detailed documentation of the development guide can be found [here](docs/DEVELOPMENT.md).

### Architecture

Detailed documentation of the architecture can be found [here](docs/ARCHITECTURE.md).

### Component Library

The frontend utilizes **shadcn/ui** components. Refer to the [component library documentation](https://ui.shadcn.com/) for more details.

## 🌟 Features

- **User Authentication:**

  - Sign up, login, and logout functionalities.
  - Protected routes to ensure secure access.

- **Route Management:**

  - Create, edit, and delete travel routes.
  - Add waypoints with different travel modes.
  - Set visibility levels for routes.
  - Share routes with others.

- **Social Interaction:**

  - Comment on routes.
  - Like and bookmark favorite routes.
  - Messaging between users.

- **Interactive Maps:**
  - Plan journeys using Google Maps integration.
  - Visualize routes with waypoints and travel paths.

## 🛠️ Contributing

For contributing to the project, please follow the [Contributing Guide](docs/CONTRIBUTING.md).

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📧 Contact

For any inquiries or feedback, please contact [yigitbaba.contact@gmail.com](mailto:yigitbaba.contact@gmail.com).
