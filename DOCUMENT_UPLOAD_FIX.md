# Document Upload Fix - Testing Guide

## Problem Fixed

The document upload was failing because:

1. **Strict PDF-only validation** for resumes
2. **Missing error handling** for multer file validation errors
3. **No PNG support** despite allowing common image formats

## Changes Made

### Backend (`server/routes/applications.js`)

1. **Relaxed file validation**: Now allows PDF, JPG, JPEG, and PNG for ALL document types
2. **Added multer error handling middleware**: Properly catches and responds to file validation errors
3. **Improved error messages**: More specific error details
4. **Added debugging**: Server logs show file upload attempts and results

### Frontend (`client/src/pages/CandidateProfile.jsx` & `ApplicationForm.jsx`)

1. **Updated file input accept attributes**: Now includes `.png`
2. **Updated labels**: Show "PDF/JPG/PNG" instead of just "PDF/JPG"
3. **Resume field**: Now accepts images as well as PDFs

## Supported File Types

✅ **PDF** - `.pdf` (application/pdf)
✅ **JPEG** - `.jpg`, `.jpeg` (image/jpeg)  
✅ **PNG** - `.png` (image/png)

## Testing Steps

1. Go to candidate profile page (`/profile`)
2. Try uploading different file types:
   - PDF files should work
   - JPG/JPEG images should work
   - PNG images should work
   - Other formats (like .txt, .doc) should show specific error messages

## Error Handling

- **Invalid file types**: Shows specific error like "resume must be a PDF, JPG, or PNG file"
- **File size**: 5MB limit (existing)
- **Network errors**: Proper error messages displayed to user
- **File cleanup**: Failed uploads are automatically cleaned up

## Server Logs

The server now shows detailed logs for file uploads:

```
File upload attempt - Field: resume, Type: application/pdf, Name: my-resume.pdf
✓ File accepted: my-resume.pdf
```

Or for rejected files:

```
File upload attempt - Field: resume, Type: text/plain, Name: resume.txt
✗ File rejected: resume.txt (text/plain)
```

This makes debugging much easier!
