# 🚀 Job Application Portal (2025)

A modern full-stack job application system built with React, Node.js, Express, and MongoDB. Allows candidates to apply for jobs via a public form and track their application status through a personalized dashboard.

## ✨ Latest Enhancements (June 2025)

- 🛡️ **Enhanced Security**: Improved JWT token management and validation
- 🔄 **Error Boundaries**: React error boundaries for graceful error handling
- 📝 **Input Validation**: Comprehensive server-side and client-side validation
- 🚨 **Global Error Handler**: Centralized error handling for better debugging
- 📁 **Better File Management**: Improved file upload with proper cleanup
- 🔒 **Secure Environment**: Enhanced environment variable management
- 📦 **Dependency Cleanup**: Removed unnecessary dependencies and fixed package issues

## 📦 Tech Stack

### Frontend

- **Vite + React 18** - Modern React development with fast HMR
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications
- **Error Boundaries** - Graceful error handling

### Backend

- **Node.js + Express** - Server-side JavaScript runtime and framework
- **MongoDB + Mongoose** - NoSQL database with ODM
- **JWT + bcrypt** - Authentication and password hashing
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **Global Error Handler** - Centralized error management
- **Input Validation** - Comprehensive request validation

## 🌟 Features

### For Candidates

- **Public Application Form** - Apply without registration
- **Document Upload** - Resume (required), marksheets, Aadhar card
- **Auto-generated Credentials** - System creates login credentials
- **Application Tracking** - View status (Pending/Accepted/Rejected/Scheduled)
- **Profile Management** - Update optional fields and change password
- **Interview Scheduling** - View scheduled interview details

### For Admins

- **Admin Dashboard** - Comprehensive application management
- **Search & Filter** - Find applications by name, email, phone, or status
- **Status Management** - Accept/reject applications
- **Interview Scheduling** - Set specific date/time or "next 30 minutes"
- **Data Export** - Export applications to CSV
- **Statistics** - View application counts by status

## 🏗️ Project Structure

```
job-application-portal/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API utilities
│   │   └── ...
│   ├── public/
│   └── package.json
├── server/                # Node.js backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # File storage directory
│   └── server.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd job-application-portal
   ```

2. **Set up the backend**

   ```bash
   cd server
   npm install

   # Create .env file and configure environment variables
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret

   # Create admin user
   node seedAdmin.js

   # Start the server
   npm run dev
   ```

3. **Set up the frontend**

   ```bash
   cd ../client
   npm install

   # Create .env file
   echo "VITE_API_URL=http://localhost:5000/api" > .env

   # Start the development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

**Server (.env)**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your-super-secure-jwt-secret-key
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Client (.env)**

```env
VITE_API_URL=http://localhost:5000/api
```

### Default Admin Credentials

- **Username**: admin
- **Password**: admin123
- ⚠️ **Important**: Change these credentials after first login!

## 📋 Available Departments

- Cyber Security
- Web Development
- App Development
- Full Stack Development
- Digital Marketing
- AI & Automation
- Sales Executive
- Other (with custom field)

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/login` - Candidate login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/change-password` - Change password

### Applications

- `POST /api/applications/submit` - Submit new application
- `GET /api/applications/profile` - Get candidate profile
- `PATCH /api/applications/profile` - Update candidate profile

### Admin (Protected)

- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/applications/:id` - Get single application
- `PATCH /api/admin/applications/:id/status` - Update application status
- `PATCH /api/admin/applications/:id/schedule` - Schedule interview
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/export` - Export applications to CSV

## 📄 File Upload Specifications

### Supported Formats

- **Resume**: PDF only (required)
- **Marksheets**: PDF or JPG
- **Aadhar Card**: PDF or JPG (optional)

### File Size Limits

- Maximum file size: 5MB per file
- Total upload limit: 20MB per application

## 🔍 Form Validation

### Client-side Validation

- **Name**: Letters and spaces only
- **Email**: Valid email format
- **Phone**: Exactly 10 digits
- **Department**: Required selection
- **Resume**: Required PDF file

### Server-side Validation

- Regex validation for all input fields
- File type and size validation
- Duplicate email prevention
- Required field enforcement

## 🎨 UI/UX Features

### Modern Design

- Clean, professional interface
- Responsive design for all devices
- Tailwind CSS for consistent styling
- Loading states and error handling
- Toast notifications for user feedback

### User Experience

- Intuitive navigation
- Clear form validation messages
- Real-time status updates
- Easy file upload with drag-and-drop
- Accessible design principles

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway/DigitalOcean)

```bash
cd server
# Set environment variables in your hosting platform
# Ensure MongoDB is accessible
# Deploy the server/ folder
```

### Environment Configuration

- Update `VITE_API_URL` in client/.env for production
- Configure CORS settings for production domains
- Set up proper MongoDB connection string
- Use secure JWT secrets in production

## 🛠️ Development

### Running in Development Mode

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Code Structure Guidelines

- Follow React functional components with hooks
- Use async/await for API calls
- Implement proper error boundaries
- Add loading states for better UX
- Use TypeScript for better development experience (optional)

## 📊 Features in Detail

### Application Flow

1. Candidate visits `/apply` and fills out the form
2. System validates input and uploads files
3. Auto-generates unique username/password
4. Candidate can login at `/login` to track status
5. Admin manages applications through `/admin` dashboard

### Admin Capabilities

- View all applications with filtering and search
- Update application status in real-time
- Schedule interviews with date/time picker
- Export application data to CSV
- View dashboard statistics and metrics

### Security Features

- JWT-based authentication
- Password hashing with bcrypt
- File upload validation and sanitization
- Protected routes with middleware
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 🆘 Support & Troubleshooting

### Common Issues & Solutions

**❌ MongoDB Connection Error**

```bash
Error: MongoNetworkError: connect ECONNREFUSED
```

**Solution**:

- Ensure MongoDB is running: `mongod` (or start MongoDB service)
- Check connection string in `server/.env`
- For cloud MongoDB, verify network access and credentials

**❌ File Upload Issues**

```bash
Error: File too large / Invalid file type
```

**Solution**:

- Check file size (max 5MB per file)
- Verify file formats: PDF for resume, PDF/JPG for others
- Ensure `server/uploads/` directory exists and has write permissions

**❌ Port Already in Use**

```bash
Error: listen EADDRINUSE :::5000
```

**Solution**:

- Kill process using port: `npx kill-port 5000`
- Or change PORT in `server/.env`

**❌ Frontend Build Errors**

```bash
Error: Module not found
```

**Solution**:

- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Check Node.js version (16+ required)

**❌ JWT Token Issues**

```bash
Error: Token is not valid
```

**Solution**:

- Clear browser localStorage
- Ensure JWT_SECRET is set in `server/.env`
- Check token expiration (24h default)

### Performance Tips

- Use MongoDB indexes for better query performance
- Implement file compression for faster uploads
- Enable Redis caching for session management (production)
- Use CDN for static file delivery (production)

### Security Checklist

- ✅ Change default admin credentials
- ✅ Use strong JWT secret in production
- ✅ Implement rate limiting
- ✅ Validate all user inputs
- ✅ Use HTTPS in production
- ✅ Regular security updates

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information

---

## 🎉 Success!

Your job application portal is now ready to help candidates find their dream jobs! 🚀

Built with ❤️ using modern web technologies.

**Key Features Implemented:**

- ✅ Secure authentication system
- ✅ File upload with validation
- ✅ Admin dashboard with full CRUD
- ✅ Real-time application tracking
- ✅ CSV export functionality
- ✅ Mobile-responsive design
- ✅ Error handling & validation
- ✅ Professional UI/UX
