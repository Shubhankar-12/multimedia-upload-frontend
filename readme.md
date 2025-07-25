# Multimedia Upload Frontend

A modern web application for uploading and managing multimedia files. Built with Next.js 15, Tailwind CSS, and shadcn/ui components.

## Features

- User authentication (login/register)
- Drag and drop file uploads
- File management dashboard
- Search and filter functionality
- Tag-based organization
- View count tracking
- Responsive design

## Technology Stack

- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **React Dropzone** - File upload handling
- **JWT Authentication** - Secure user sessions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend API server running

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Shubhankar-12/multimedia-upload-frontend.git
   cd multimedia-upload-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   Create `.env`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── login/           # Authentication pages
│   ├── register/
│   └── dashboard/       # Main application
├── components/          # Reusable UI components
│   ├── FileUploadForm/  # File upload component
│   ├── FileGrid/        # File display grid
│   ├── Header/          # Header component
│   ├── FileCard/        # File card component
│   └── SearchBar/       # Search and filter
├── lib/                 # Utilities and API helpers
├── hooks/               # Custom React hooks
└── styles/              # Global styles
```

## Key Pages

### Authentication

- `/login` - User login form
- `/register` - New user registration

### Dashboard

- `/dashboard` - Main file management interface
  - File upload area
  - Search and filtering
  - File grid with thumbnails
  - Delete and view tracking

## How to Use

1. **Create Account**: Register a new account or login with existing credentials
2. **Upload Files**: Drag and drop files or click to select
3. **Add Tags**: Organize files with comma-separated tags
4. **Manage Files**: Search, filter, and delete files as needed
5. **Track Views**: Click on files to increment view count

## Available Scripts

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Code formatting
pnpm format

# Linting
pnpm lint
```

## Filtering Options

- **Search**: Find files by name or tags
- **Type Filter**: Filter by file type (image, video, audio, PDF)
- **Sort Options**: Sort by newest first or most viewed

## Backend Integration

This frontend works with the Multimedia Upload Backend API. Make sure the backend server is running and accessible at the URL specified in your environment variables.

## Future Enhancements

- File pagination for large collections
- Real-time upload progress
- Bulk file operations
- User profile management
- Advanced search capabilities

## License

MIT License - see LICENSE file for details
