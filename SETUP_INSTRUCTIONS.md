# Client Inquiries & Email Setup Instructions

## What Was Added

### 1. **Client Inquiries Panel** in Admin Dashboard
- New "Inquiries" tab showing all client messages
- Display unread count in tab badge
- Mark inquiries as read/unread
- Delete inquiries
- Send replies to clients with automatic email
- Auto-delete read inquiries after 7 days
- Show inquiry details: name, phone, email, services, project brief
- Display admin replies with timestamps

### 2. **File Upload API** (`/api/upload`)
- Upload images and videos directly from admin dashboard
- Files saved to `public/images/` and `public/videos/`
- Automatic filename generation with timestamps
- File validation (image/video types only)

### 3. **Email Sending APIs**
- `/api/send-email` - Send replies to clients
- `/api/send-client-email` - Notify admin of new inquiries

### 4. **Updated Portfolio Form**
- Added email field to client inquiry form
- Inquiries now saved to localStorage
- Admin notified via email when client submits inquiry

## Required Setup

### Step 1: Install Nodemailer
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Step 2: Set Environment Variables
Create a `.env.local` file in your project root:

```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=hamzatehafeko8@gmail.com
```

**Important:** 
- Use Gmail App Password (not your regular password)
- Enable 2-Factor Authentication on your Gmail account
- Generate App Password here: https://myaccount.google.com/apppasswords

### Step 3: Update Admin Password (Optional)
In `app/admin/login/page.tsx`, change:
```typescript
const ADMIN_PASSWORD = "Hamza@#6561";
```

### Step 4: Initialize Inquiries in Dashboard
The inquiries array is now part of the portfolio data. It will auto-initialize when you first save.

## How It Works

### Client Submits Inquiry
1. Client fills form on portfolio website
2. Inquiry saved to localStorage
3. Admin receives email notification
4. Inquiry appears in admin dashboard

### Admin Replies
1. Admin goes to "Inquiries" tab in dashboard
2. Clicks "Send Reply & Email" button
3. Types reply message
4. Client receives email with reply
5. Reply saved in dashboard

### Auto-Delete
- Read inquiries automatically deleted after 7 days
- Happens when admin clicks "Save Changes"

## Testing

### Test Email Sending
1. Make sure `.env.local` is configured
2. Submit a test inquiry from the portfolio
3. Check your email for the notification
4. Reply from admin dashboard
5. Check client email for the reply

### Test File Upload
1. Go to Admin Dashboard → Projects tab
2. Select media type (Image or Video)
3. Click upload area to select file
4. File uploads and path is auto-filled
5. Add project details and save

## Troubleshooting

### Email Not Sending
- Check `.env.local` file exists and has correct credentials
- Verify Gmail App Password is correct
- Check browser console for errors
- Make sure 2FA is enabled on Gmail account

### File Upload Fails
- Check file size (should be reasonable)
- Verify file type is supported (images: png, jpg, gif, webp; videos: mp4, webm)
- Check `public/images/` and `public/videos/` folders exist

### Inquiries Not Showing
- Make sure you've saved at least once from dashboard
- Check browser localStorage (DevTools → Application → Local Storage)
- Refresh the page

## Next Steps

1. Install nodemailer: `npm install nodemailer @types/nodemailer`
2. Create `.env.local` with email credentials
3. Test the system
4. Deploy to production with proper email service

## Notes

- Currently uses localStorage for data (temporary)
- Ready to migrate to Firebase later
- Email service uses Gmail (can be changed to other providers)
- All inquiries stored locally until migrated to database
