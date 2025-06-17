<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Job Application Portal - Copilot Instructions

This is a full-stack job application portal built with:

## Frontend (Client)

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **File Structure**: Component-based architecture with pages, components, and utilities

## Backend (Server)

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt for password hashing
- **File Upload**: Multer middleware
- **Validation**: Regex validation for email, phone, and name fields

## Key Features

1. **Public Application Form** (`/apply`) - Candidates can submit applications with file uploads
2. **Candidate Login/Dashboard** (`/login`, `/profile`) - Track application status and update profile
3. **Admin Panel** (`/admin`) - Manage applications, schedule interviews, export data
4. **File Upload System** - Handle PDF/JPG documents with validation
5. **Auto-generated Credentials** - System creates username/password for candidates

## Important Notes

- Use proper error handling with try-catch blocks
- Implement proper form validation on both frontend and backend
- Follow RESTful API conventions
- Use Tailwind CSS classes for styling
- Implement proper JWT authentication middleware
- Handle file uploads with proper validation and security

## API Endpoints

- `/api/auth/*` - Authentication routes
- `/api/applications/*` - Application management
- `/api/admin/*` - Admin-only routes

When working on this project, ensure proper validation, error handling, and follow the established patterns for consistency.
