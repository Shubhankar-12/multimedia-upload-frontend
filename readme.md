# Multimedia Upload Frontend

A modern web application for uploading and managing multimedia files. Built with Next.js 15, Tailwind CSS, and shadcn/ui components.

## Features

- **Secure Authentication**: User Login and Registration.
- **Bulk Upload**: Drag & drop support for multiple files (Images, Videos, Audio, PDFs, Spreadsheets).
- **File Sharing**: Share files securely via Email or generate public links.
- **Smart Management**: Filter files by type, search by tags, and sort by views or date.
- **Responsive Design**: Clean UI built with Tailwind CSS and shadcn/ui.
- **Public Shared View**: Dedicated access page for shared links.

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
│   ├── dashboard/       # Main application
│   └── shared/          # Shared file viewer
├── components/          # Reusable UI components
│   ├── FileUploadForm/  # File upload component
│   ├── FileGrid/        # File display grid
│   ├── ShareDialog/     # Sharing modal
│   ├── Header/          # Header component
│   ├── FileCard/        # File card component
│   └── SearchBar/       # Search and filter
├── lib/                 # Utilities and API helpers
└── hooks/               # Custom React hooks
```

## Key Pages

### Authentication

- `/login` - User login form
- `/register` - New user registration

### Dashboard

- `/dashboard` - Main file management interface
  - **Bulk Upload**: Supports up to 10 files (Images, Videos, PDFs, CSV/Excel).
  - **Filtering**: Type, Search, and Sort controls.
  - **Sharing**: Generate links or invite users via email.

### Shared View

- `/shared/[token]` - Public read-only view for shared files.

## How to Use

1. **Create Account**: Register a new account or login.
2. **Upload Files**: Drag and drop multiple files (including spreadsheets).
3. **Share Files**: Click the menu on any file card to open the Share Dialog.
   - **Invite**: Enter an email to share privately.
   - **Link**: Copy a generated public link.
4. **Manage**: Filter by "Spreadsheets" or other types, search tags, or sort by views.

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

- **Search**: Find files by name or tags.
- **Type Filter**: Images, Videos, Audio, PDFs, Spreadsheets.
- **Sort Options**: Newest First, Most/Least Views, Size.

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
