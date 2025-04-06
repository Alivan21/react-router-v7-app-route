# React Router v7 App Route Dashboard

A modern, feature-rich boilerplate for creating single page application dashboards using React 19, React Router v7, and ShadCN UI. This project adopts a file-based routing approach similar to Next.js, making it intuitive to organize and structure your application.

## Features

- 🚀 **React 19** with latest features
- 🔄 **React Router v7** with file-based routing
- 🎨 **ShadCN UI** components for a clean, modern interface
- 📱 **Responsive design** that works across devices
- 🔒 **Authentication** with protected routes
- 📊 **Dashboard layout** with customizable sidebar
- 📋 **Data tables** with sorting, filtering, and pagination
- 📝 **Form handling** with validation
- 🌐 **API integration** ready
- 📁 **File-based routing** similar to Next.js app route
- 🛣️ **Middleware** for route protection and redirection
- 🔍 **TypeScript** for type safety
- ⚡ **Vite** for fast development and building
- 🧹 **ESLint & Prettier** for code quality

## Tech Stack

- **React 19**: Latest version with improved performance
- **React Router v7**: Advanced routing capabilities with file-based routing
- **TypeScript**: For type safety and better developer experience
- **Vite**: Fast, modern build tool
- **TanStack Query**: For data fetching, caching, and state management
- **TanStack Table**: For powerful table experiences
- **React Hook Form**: For form handling with validation
- **Zod**: For schema validation
- **ShadCN UI**: Component library built on Radix UI and TailwindCSS
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: For API requests
- **React Hot Toast**: For notifications
- **date-fns**: For date formatting and manipulation

## Project Structure

```
src/
├── api/                 # API integration layer
├── app/                 # File-based routes
│   ├── (auth)/          # Authentication routes
│   ├── (protected)/     # Protected routes
│   ├── 404.tsx          # Not found page
│   ├── error.tsx        # Error handling
│   └── loading.tsx      # Loading states
├── common/              # Shared constants and types
├── components/          # Reusable components
│   ├── ui/              # UI components (ShadCN)
│   └── ...              # Other components
├── hooks/               # Custom React hooks
├── libs/                # Library configurations
├── utils/               # Utility functions
├── index.css            # Global styles
├── main.tsx             # Application entry point
├── middleware.ts        # Route middleware
└── vite-env.d.ts        # Vite type declarations
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/react-router-v7-app-route.git
   cd react-router-v7-app-route
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Create a `.env` file from the example

   ```bash
   cp .env.example .env
   ```

4. Start the development server
   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm preview` - Preview the production build locally

## Environment Variables

| Variable          | Description               | Default                |
| ----------------- | ------------------------- | ---------------------- |
| VITE_BASE_API_URL | Base URL for API requests | http://api.example.com |

## Authentication

The application comes with a built-in authentication system using JWT tokens stored in cookies. The middleware automatically handles:

- Redirecting unauthenticated users to the login page
- Redirecting authenticated users away from public pages
- Preserving the intended destination after login

## File-Based Routing

This project uses a file-based routing approach similar to Next.js, making it intuitive to organize your application:

- Files named `page.tsx` become route components
- Files named `layout.tsx` provide shared UI for child routes
- Group folders using parentheses like `(auth)` and `(protected)`
- Special files like `error.tsx` and `loading.tsx` for handling states

## Customization

### Theme

The project uses Tailwind CSS for styling. You can customize the theme in the `index.css` file.

### Components

ShadCN UI components can be customized according to your needs. They are located in the `src/components/ui` directory.

### Sidebar

You can customize the sidebar items in `src/common/constants/sidebar-items.ts`.

## API Integration

The project is set up to work with a REST API. The API integration layer is organized in the `src/api` directory, with hooks for data fetching in the `src/hooks/api` directory.

## License

MIT

## Contributing

Contributions are welcome!. Please open an issue or submit a pull request for any improvements or bug fixes.
Feel free to reach out if you have any questions or suggestions.
