# Cupid Crochy

A modern, fully-featured e-commerce platform for handmade crochet products, built with Next.js 16, MongoDB, and Stripe.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.21.0-47A248?style=for-the-badge&logo=mongodb)
![Stripe](https://img.shields.io/badge/Stripe-20.1.0-635BFF?style=for-the-badge&logo=stripe)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## 🌟 Overview

Cupid Crochy is a premium e-commerce application designed for selling handcrafted crochet items. It provides a complete shopping experience with a powerful admin dashboard, secure payments, and professional order management.

### Key Features
- 🛒 Beautiful, responsive storefront with advanced filtering
- 💳 Secure Stripe payment integration with coupon support
- 📦 Comprehensive order tracking and management
- 👤 User accounts with role-based access control
- 🎛️ Full-featured admin dashboard
- 📧 Backend discount system (no Stripe coupon complexity)
- 📧 Professional email notifications with PDF invoices
- 🎨 Custom UI/UX with smooth animations

---

## 📚 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [User Roles & Permissions](#-user-roles--permissions)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Development](#-development)

---

## ✨ Features

### Customer Experience

#### Shopping & Browsing
- **Product Catalog**
  - Dynamic categories (extracted from products)
  - Tag-based filtering with visual badges
  - Real-time search by name, category, or tags
  - Product detail pages with full specifications
  - Stock status indicators
- **Shopping Cart**
  - Persistent cart (localStorage)
  - Real-time total calculations
  - Quantity management
  - Add/remove items with animations
- **Wishlist**
  - Save favorite products
  - Persistent storage
- **Checkout Experience**
  - Stripe Checkout integration
  - Coupon validation and application
  - Shipping address collection
  - Order review before payment
- **Order Management**
  - Real-time order tracking
  - Search by order ID
  - Order history in user account
  - Download PDF invoices
  - View order details and shipping info

### Payment System

#### Backend-First Coupon System
Using MongoDB for coupon management (simpler than Stripe coupons):

- **Coupon Types**
  - Percentage discounts (10%, 20%, etc.)
  - Fixed amount discounts (৳500, ৳1000, etc.)
- **Validation Rules**
  - Minimum order amount requirements
  - Validity date ranges
  - Usage limits (0 for unlimited)
  - Active/inactive status
- **Application**
  - Applied during checkout
  - Stored in order metadata
  - Usage tracking in database

**Why Backend Coupons?**
- No Stripe sync required
- Flexible validation logic
- Easy admin management
- Simple refund calculations

### User Authentication

#### NextAuth.js Integration
- **Google OAuth** - Social login
- **Credential Auth** - Email/password
- **Role-Based Access**:
  - **Admin** - Full system access
  - **Staff** - Limited operational access
  - **User** - Shopping and account features
- **Session Management** - Secure, persistent
- **Account Features**
  - Order history
  - Payment history
  - Profile settings

### Admin Dashboard

#### Dashboard Overview
- Total revenue tracking
- Order statistics (total, pending)
- Product inventory count
- Recent orders and products
- Visual analytics

#### Product Management (Admin Only)
- Create, edit, delete products
- Upload multiple images
- Set pricing and stock
- Assign categories
- Add features/specifications
- Real-time stock updates

#### Order Management (Admin & Staff)
- View all orders with details
- **Admin**: Full status control (Pending → Processing → Shipped → Delivered → Cancelled)
- **Staff**: Process → Shipped updates only
- View customer information
- Download invoices
- Filter by status

#### Payment Management (Admin Only)
- View all payment transactions
- Payment status tracking
- Revenue analytics
- Filter by status (succeeded, failed, pending)
- View payment details

#### Coupon Management (Admin Only)
- Create discount codes
- Set percentage or fixed amount
- Configure usage limits
- Set validity periods
- Track coupon usage
- Delete coupons
- View coupon performance

#### User Management (Admin Only)
- View all registered users
- Update user roles
- Delete users
- View user details
- Filter by role

#### Settings (Admin Only)
- Store name and email
- Currency configuration
- Language preferences
- Regional settings

### Notifications

#### Toast System
- Custom toast notifications (react-hot-toast)
- Success, error, info, loading states
- Branded color scheme
- Smooth animations
- Non-intrusive positioning

#### Email Notifications
- Professional HTML emails
- **Branded Design** - Matching site colors (#5B1A1A maroon, #FFB6C1 pink)
- Order confirmation with details
- **PDF Invoice Attachment** - Beautiful, branded invoice
- Customer order summary
- Shipping address display
- Contact information

### UI/UX Features

#### Design System
- **Color Palette**
  - Brand Maroon: #5B1A1A
  - Brand Pink: #FFB6C1
  - Brand Beige: #F5F0E6
  - White: #FFFFFF
- **Typography**
  - Cookie - Decorative headings
  - Outfit - Modern sans-serif body text
- **Components**
  - Rounded corners (2xl, 3xl)
  - Soft shadows
  - Smooth transitions
  - Mobile-first responsive design

#### Animations
- Framer Motion for smooth transitions
- Page load animations
- Hover effects
- Modal animations
- Loading states
- Stagger effects for lists

#### Pages
- Home page with featured products
- Shop with filters and search
- Product detail pages
- Checkout flow
- Order tracking
- User authentication (login/register)
- User dashboard (orders, payments)
- 404 custom page

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16.1.1 (App Router)
  - Turbopack for fast builds
  - Server Components and Client Components
  - API Routes
  - Middleware for auth
- **Language**: TypeScript 5
  - **Styling**: Tailwind CSS 4
  - **Icons**: Lucide React
  - **Animations**: Framer Motion 12.23.26
  - **State Management**: React Context (Cart, Auth)
  - **Forms**: React Hook Form
  - **PDF Generation**: jsPDF + jspdf-autotable
  - **Notifications**: react-hot-toast

### Backend
- **API**: Next.js API Routes (server-side)
- **Authentication**: NextAuth.js 4.24.13
  - Google OAuth provider
  - Credentials provider
  - Session management
- **Database**: MongoDB with Mongoose 9.1.1
  - Connection pooling
  - Schema validation
- **Payment**: Stripe 20.1.0
  - Checkout Sessions
  - Webhook signature verification
  - Payment Intents
- **Email**: Resend API 6.6.0
  - Transactional emails
  - PDF attachments

### Key Dependencies
```json
{
  "next": "16.1.1",
  "react": "19.2.3",
  "next-auth": "^4.24.13",
  "stripe": "^20.1.0",
  "mongoose": "^9.1.1",
  "mongodb": "^6.21.0",
  "resend": "^6.6.0",
  "framer-motion": "^12.23.26",
  "react-hot-toast": "^2.5.1",
  "lucide-react": "^0.562.0",
  "jspdf": "^4.0.0",
  "jspdf-autotable": "^5.0.7",
  "bcryptjs": "^3.0.3",
  "tailwindcss": "^4"
}
```

---

## 📁 Project Structure

```
cupid-crochy/
├── app/                        # Next.js App Router
│   ├── (auth)/               # Authentication pages
│   ├── account/              # User dashboard pages
│   ├── admin/                # Admin dashboard
│   ├── api/                  # API routes
│   │   ├── auth/           # NextAuth configuration
│   │   ├── checkout/       # Stripe checkout
│   │   ├── coupons/        # Coupon management
│   │   ├── orders/         # Order operations
│   │   ├── payments/       # Payment operations
│   │   ├── products/       # Product CRUD
│   │   ├── users/          # User management
│   │   └── webhook/       # Stripe webhooks
│   ├── checkout/            # Checkout pages
│   ├── product/             # Product detail pages
│   ├── shop/               # Shop with filters
│   ├── order-tracking/       # Public tracking
│   ├── login/               # Login page
│   └── register/           # Registration
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   ├── cart/               # Shopping cart
│   ├── layout/             # Layout components (Header, Footer)
│   ├── product/            # Product-related components
│   ├── providers/           # Context providers
│   │   ├── AuthProvider
│   │   ├── CartProvider
│   │   └── ToastProvider
│   └── ui/                # Reusable UI components
│       ├── Modal
├── lib/                   # Utility functions
│   ├── mongodb.ts          # DB connection
│   ├── utils.ts            # Helper functions
│   └── pdf-generator.ts    # Invoice generation
├── models/                # Mongoose schemas
│   ├── User.ts
│   ├── Product.ts
│   ├── Order.ts
│   ├── Payment.ts
│   └── Coupon.ts
├── public/                # Static assets
├── scripts/               # Utility scripts
│   └── seed.ts            # Database seeding
└── .env                  # Environment variables
```

### Database Schema

#### User
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: "admin" | "staff" | "user"
  image: string
  wishlist: ObjectId[]
  cart: Array<{ productId, quantity }>
  timestamps: Date
}
```

#### Product
```typescript
{
  name: string
  description: string
  price: number
  stock: number
  category: string
  tags: string[]
  images: string[]
  features: string[]
  timestamps: Date
}
```

#### Order
```typescript
{
  userId: ObjectId (reference to User)
  userName: string
  userEmail: string
  items: Array<{
    productId: ObjectId (reference to Product)
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  stripePaymentId: string
  couponCode: string (optional)
  discountAmount: number (optional)
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  timestamps: Date
}
```

#### Payment
```typescript
{
  userId: ObjectId (reference to User)
  orderId: ObjectId (reference to Order)
  amount: number
  currency: string
  status: "succeeded" | "failed" | "pending" | "refunded" | "partially_refunded"
  paymentMethod: string
  stripePaymentId: string
  stripeCustomerId: string
  description: string
  metadata: {
    userName: string
    userEmail: string
  }
  timestamps: Date
}
```

#### Coupon
```typescript
{
  code: string (unique, uppercase)
  discount: number
  discountType: "percentage" | "fixed"
  minOrderAmount: number
  maxUses: number (0 = unlimited)
  usageCount: number
  validFrom: Date
  validUntil: Date
  isActive: boolean
  timestamps: Date
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn or pnpm
- MongoDB account (local or Atlas)
- Stripe account
- Resend account (for emails)
- Google Cloud project (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cupid-crochy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root directory:

   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cupid-crochy

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-random-string-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

   # Resend (Email)
   RESEND_API_KEY=re_...
   ```

4. **Seed Database**

   Run the seed script to populate your database with test data:

   ```bash
   npm run seed
   ```

   This creates:
   - 7 users (1 admin, 1 staff, 5 regular)
   - 8 products with tags and categories
   - 5 orders with various statuses
   - 5 payments linked to orders
   - 4 coupons (WELCOME10, SUMMER20, FLAT500, CUPIDLOVE)

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Start Stripe Webhook Listener** (for testing)

   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

---

## 👤 User Roles & Permissions

### Admin (God Mode)

**Full Access to Everything:**

- ✅ Dashboard analytics
- ✅ Product management (create, edit, delete)
- ✅ Order management (full status control)
- ✅ Payment management (view, refunds)
- ✅ Coupon management (create, delete, edit)
- ✅ User management (create, edit, delete, change roles)
- ✅ Access to all admin pages
- ✅ Store settings configuration
- ✅ View and manage all data

### Staff (Limited Admin)

**Operational Access Only:**

- ✅ View Dashboard
- ✅ View Orders (read-only)
- ✅ Update Order Status (Pending → Processing → Shipped)
  - Cannot mark as Cancelled or Delivered
- ✅ View Users (read-only)
  - Cannot change roles
  - Cannot delete users
- ✅ View Products (read-only)
  - Cannot create/edit/delete products
- ❌ No access to Payments
- ❌ No access to Coupons
- ❌ No access to Settings
- ❌ Cannot manage other staff or admins

### User (Customer)

**Standard Access:**

- ✅ Browse and search products
- ✅ Add items to cart
- ✅ Apply coupons
- ✅ Checkout with Stripe
- ✅ View order history
- ✅ View payment history
- ✅ Download invoices
- ✅ Track orders
- ✅ Manage account
- ❌ No admin access

---

## 📡 API Documentation

### Authentication

#### `POST /api/auth/[...nextauth]`
NextAuth.js configuration endpoint.

#### `POST /api/register`
Register a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Products

#### `GET /api/products`
Get all products.

**Response:**
```json
{
  "products": [
    {
      "_id": "...",
      "name": "Floral Crossbody Bag",
      "price": 2800,
      "category": "Crossbody",
      "tags": ["floral", "handmade"],
      "stock": 15,
      "images": ["..."]
    }
  ]
}
```

#### `GET /api/products/[id]`
Get a single product by ID.

#### `POST /api/products`
Create a new product (Admin only).

**Request:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 1000,
  "stock": 10,
  "category": "Category",
  "tags": ["tag1", "tag2"],
  "images": ["image1.jpg", "image2.jpg"],
  "features": ["Feature 1", "Feature 2"]
}
```

#### `PUT /api/products/[id]`
Update a product (Admin only).

#### `DELETE /api/products/[id]`
Delete a product (Admin only).

### Cart & Checkout

#### `POST /api/checkout`
Create a Stripe Checkout Session.

**Request:**
```json
{
  "items": [
    {
      "id": "product_id",
      "name": "Product Name",
      "price": 1000,
      "quantity": 1,
      "image": "image_url"
    }
  ],
  "couponCode": "WELCOME10"
}
```

**Response:**
```json
{
  "id": "cs_...",
  "url": "https://checkout.stripe.com/..."
}
```

### Coupons

#### `GET /api/coupons`
Get all coupons (Admin/Staff).

#### `POST /api/coupons/validate`
Validate a coupon code.

**Request:**
```json
{
  "code": "WELCOME10",
  "orderAmount": 2000
}
```

**Response:**
```json
{
  "code": "WELCOME10",
  "discountType": "percentage",
  "discount": 10,
  "discountAmount": 200,
  "finalAmount": 1800
}
```

#### `POST /api/coupons`
Create a new coupon (Admin only).

#### `DELETE /api/coupons/[id]`
Delete a coupon (Admin only).

### Orders

#### `GET /api/orders`
Get all orders (Admin/Staff).

#### `GET /api/orders/[id]`
Get a single order by ID.

#### `GET /api/orders/track?q={query}`
Search for orders (public).

#### `PUT /api/orders/[id]`
Update order status (Admin/Staff).

**Request:**
```json
{
  "status": "shipped"
}
```

### Payments

#### `GET /api/payments`
Get all payments (Admin).

#### `GET /api/payments`
Get current user's payments.

**Response:**
```json
{
  "payments": [...],
  "orders": [...]
}
```

### Users

#### `GET /api/users`
Get all users (Admin/Staff).

#### `PUT /api/users/[id]`
Update user role (Admin only).

**Request:**
```json
{
  "role": "staff"
}
```

#### `DELETE /api/users/[id]`
Delete a user (Admin only).

### Webhooks

#### `POST /api/webhook/stripe`
Stripe webhook handler for order confirmation.

**Events Handled:**
- `checkout.session.completed` - Creates order, payment, updates coupon usage, sends email with invoice PDF

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `MONGODB_URI`
     - `NEXTAUTH_URL` (set to production URL)
     - `NEXTAUTH_SECRET`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_WEBHOOK_SECRET`
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - `RESEND_API_KEY`

3. **Configure Webhook**
   - Add webhook endpoint: `https://your-domain.vercel.app/api/webhook/stripe`
   - Set events: `checkout.session.completed`
   - Add signing secret from your `.env`

4. **Deploy!**

### Other Platforms

The project can be deployed to any Next.js-compatible platform:
- Vercel (recommended)
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Render

---

## 💻 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with test data
```

### Development Tips

1. **Hot Reload**: The dev server supports hot module replacement
2. **TypeScript**: All code is typed for better developer experience
3. **Environment Variables**: Ensure all required variables are set in `.env`
4. **Database**: MongoDB Atlas is recommended for production
5. **Stripe Testing**: Use Stripe Test Mode for development

### Troubleshooting

**Common Issues:**

1. **MongoDB Connection**
   - Verify `MONGODB_URI` is correct
   - Check network connectivity
   - Ensure IP whitelist (for Atlas)

2. **Stripe Issues**
   - Verify API keys are correct
   - Check webhook secret matches
   - Ensure webhook endpoint is publicly accessible

3. **Build Errors**
   - Run `npm run lint` to check for issues
   - Clear `.next` directory: `rm -rf .next`
   - Delete `node_modules`: `rm -rf node_modules`
   - Reinstall: `npm install`

---

## 🔐 Security

- **Password Hashing**: All passwords hashed with bcrypt (cost factor: 10)
- **Session Security**: NextAuth.js with secure HTTP-only cookies
- **Role-Based Access**: Server-side validation on all protected routes
- **Stripe Verification**: Webhook signatures verified
- **Input Validation**: Zod schemas on API inputs
- **Environment Variables**: Sensitive data in `.env` (not committed)
- **API Rate Limiting**: Recommended for production
- **HTTPS**: Required for production (Stripe requirement)

---

## 📄 License

This project is proprietary and confidential.

---

## 👥 Support

For support and inquiries:
- Email: support@cupidcrochy.com
- Website: [cupidcrochy.com](https://cupidcrochy.com)

---

**Built with ❤️ for the crochet community**
