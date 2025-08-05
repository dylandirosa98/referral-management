# Roofing Referral Management System

A complete web-based referral management system for roofing companies to manage partnerships with other service businesses (HVAC, Solar, Plumbing, etc.). Partners can submit referrals and track commissions through a dedicated portal, while the roofing company manages all relationships and referrals through an internal dashboard.

## 🚀 Features

### Internal Dashboard
- **Partner Management**: Add/manage service business partners
- **Referral Tracking**: Track leads from submission to completion with status pipeline
- **Commission Management**: Automatic commission calculation based on partner tiers
- **Analytics Dashboard**: Performance metrics and reporting
- **Email Notifications**: Automated email communications for referral updates

### Partner Portal
- **Secure Login**: Partners can access their dedicated portal
- **Referral Submission**: Easy form to submit new leads
- **Status Tracking**: Real-time updates on submitted referrals
- **Earnings Dashboard**: Commission tracking and payment history
- **Tier Progression**: Bronze/Silver/Gold partner tiers with increasing commission rates

### Key Benefits
- **Automated Workflows**: Email notifications, commission calculations, tier upgrades
- **Scalable Architecture**: Built with modern tech stack for growth
- **Professional UI**: Modern, responsive design with excellent UX
- **Secure**: Row-level security, input validation, CSRF protection

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Railway PostgreSQL + Prisma ORM
- **Email**: Resend
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query
- **Deployment**: Railway

## 📋 Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd referral-management
npm install
```

### 2. Set up Railway Database

1. **Create Railway Account**:
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**:
   - Click "Deploy from GitHub repo"
   - Connect your GitHub repository
   - Add PostgreSQL database service

3. **Database Setup**:
   - Railway will automatically create your PostgreSQL database
   - The `DATABASE_URL` will be auto-generated
   - Prisma will handle all migrations and schema setup

### 3. Set up Environment Variables

Add these environment variables in your Railway dashboard:

```env
# Database (Railway auto-generates this)
DATABASE_URL=postgresql://user:password@host:port/database

# Email Configuration (Your API Key)
RESEND_API_KEY=re_ED6ykQHo_8n3U7F78t76487gjCzXhcvp6
RESEND_FROM_EMAIL=info@pythonwebsolutions.com

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-railway-app.railway.app
NEXTAUTH_SECRET=your-random-secret-key-here

# Node Environment
NODE_ENV=production
```

**To generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 4. Deploy to Railway

1. **Create Railway Account**:
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Your App**:
   - Connect your GitHub repository
   - Railway will automatically detect it's a Next.js app
   - Add all your environment variables in Railway dashboard

3. **Set Production URL**:
   - After deployment, update `NEXT_PUBLIC_APP_URL` in Railway environment variables
   - Redeploy the application

### 5. Configure Email Domain (Optional but Recommended)

1. **Add Custom Domain to Resend**:
   - Go to your Resend dashboard
   - Add `pythonwebsolutions.com` as a verified domain
   - Follow DNS configuration instructions

2. **Or Update Email Configuration**:
   - Change `RESEND_FROM_EMAIL` to use a domain you control
   - Update the email service in `src/lib/email.ts` if needed

## 🎯 Default Access

### Internal Dashboard
- Access at: `https://your-app.railway.app/dashboard`
- Currently no authentication (add Supabase Auth integration for production)

### Partner Portal
- Access at: `https://your-app.railway.app/partner-portal`
- Partners can register and login
- Each partner gets a unique portal URL: `/partner-portal/[company-slug]`

## 📊 Database Schema

The system includes these main tables:

- **partners**: Service businesses that refer customers
- **referrals**: Customer leads submitted by partners
- **payments**: Commission payment tracking
- **system_settings**: Configuration and email templates

### Partner Tiers:
- **Bronze (5%)**: 0+ referrals
- **Silver (6%)**: 5+ referrals  
- **Gold (7%)**: 15+ referrals

## 🔧 Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
```

## 📧 Email Templates

Pre-configured email templates for:
- Welcome new partners
- Referral status updates
- Tier upgrade congratulations
- New referral confirmations
- Commission payment notifications

## 🚀 Production Ready Features

- **Row Level Security (RLS)**: Data isolation between partners
- **Input Validation**: Zod schemas for all forms
- **Error Handling**: Comprehensive error boundaries
- **Email Automation**: Triggered by database changes
- **Responsive Design**: Works on all devices
- **Commission Automation**: Automatic calculations and tier upgrades

## 🔒 Security Features

- **Authentication**: Supabase Auth integration ready
- **Authorization**: Row-level security policies
- **Validation**: Server-side input validation
- **CSRF Protection**: Built into Next.js
- **Rate Limiting**: Can be added via middleware

## 📈 Scaling Considerations

- **Database**: Supabase scales automatically
- **CDN**: Railway includes CDN
- **File Storage**: Supabase Storage for documents/photos
- **Background Jobs**: Can add Supabase Edge Functions
- **Monitoring**: Add error tracking (Sentry) and analytics

## 🆘 Support

For issues or questions:
- Email: info@pythonwebsolutions.com
- Check the application logs in Railway dashboard
- Review Supabase logs for database issues

## 🔧 Customization

The system is built to be easily customizable:

1. **Branding**: Update colors and logos in `tailwind.config.ts`
2. **Email Templates**: Modify templates in `src/lib/email.ts`
3. **Business Logic**: Adjust commission rates in database
4. **UI Components**: All components are in `src/components/`
5. **Business Types**: Add more partner types in database enums

This system provides a solid foundation for managing referral partnerships and can be extended with additional features as your business grows.
