# University Student Activity Tracker

## Overview

This is a full-stack web application designed to help university students manage their academic and social activities. The application features a mobile-first design with a tabbed interface covering study schedules, social events, club activities, and a unified home dashboard.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for hot reloading during development
- **Production**: esbuild for optimized server bundling

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured but currently using in-memory storage)
- **Schema**: Centralized schema definitions in `/shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Frontend Components
- **Multi-tab Interface**: Home, Study, Social, and Clubs pages
- **Activity Management**: Forms for adding various types of activities
- **Responsive Design**: Mobile-first with bottom navigation
- **Toast Notifications**: User feedback for actions
- **Modal System**: Dialog and drawer components for different screen sizes

### Backend Components
- **Express Server**: RESTful API with middleware for logging and error handling
- **Storage Interface**: Abstract storage layer with in-memory implementation
- **Route Registration**: Modular route system for API endpoints
- **Vite Integration**: Development server with HMR support

### Shared Components
- **Type Definitions**: Shared TypeScript types and schemas
- **Validation**: Zod schemas for runtime type checking
- **Database Schema**: User management with extensible design

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **Server Processing**: Express routes handle requests and interact with storage layer
3. **Data Storage**: Currently uses in-memory storage, designed for PostgreSQL integration
4. **State Management**: TanStack Query manages client-side cache and synchronization
5. **UI Updates**: React components re-render based on query state changes

## External Dependencies

### UI and Styling
- **shadcn/ui**: Pre-built accessible components
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Low-level UI primitives
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Build tool with plugin ecosystem
- **TypeScript**: Static type checking
- **ESLint/Prettier**: Code quality and formatting
- **Replit Integration**: Development environment support

### Database and Validation
- **Drizzle ORM**: Type-safe database toolkit
- **Zod**: Runtime type validation
- **@neondatabase/serverless**: PostgreSQL connection (for future use)

## Deployment Strategy

### Development
- Vite dev server with HMR for frontend
- tsx for backend hot reloading
- Replit-specific plugins for development environment

### Production
- Frontend: Vite build output served as static files
- Backend: esbuild bundled server with external packages
- Database: PostgreSQL with Drizzle migrations
- Environment: Node.js with ES modules

### Build Process
1. `npm run build`: Builds both frontend and backend
2. Frontend assets compiled to `dist/public`
3. Backend bundled to `dist/index.js`
4. `npm start`: Runs production server

## Changelog
- June 28, 2025. Initial setup
- June 28, 2025. Successfully migrated from Lovable to Replit environment
  - Converted routing from React Router to Wouter for better compatibility
  - Installed missing dependencies (react-router-dom, sonner, nanoid)
  - Set up proper TanStack Query configuration
  - Fixed navigation functions throughout the application
  - Verified app functionality with tabbed interface working correctly

## User Preferences

Preferred communication style: Simple, everyday language.