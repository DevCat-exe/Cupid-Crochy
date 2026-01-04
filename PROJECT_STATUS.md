# Cupid Crochy — Project Status

## Objective

Deliver a pixel-perfect, responsive e-commerce site that mirrors the existing Vite design, powered by Next.js App Router, MongoDB, Stripe, and Resend.

## Core Tech Stack

- **Frontend**: Next.js 16 App Router, Tailwind CSS v4, Framer Motion
- **Backend**: MongoDB Atlas, Mongoose
- **Auth**: NextAuth with Role-Based Access Control
- **Payments**: Stripe Checkout & Webhooks
- **Email/PDF**: Resend & jsPDF

---

## Task Checklist

### Milestone 1: Repo Initialization & Skeleton

- [x] Scaffold Next.js 16 App Router
- [x] Configure Tailwind CSS v4
- [x] Set up Google Fonts (`Cookie`, `Outfit`)
- [x] Implement Global Layout (Header, Footer)

### Milestone 2: Design Parity (UI Migration)

- [x] Migrate Navbar, Hero, and Product Cards from Vite
- [x] Integrate Framer Motion animations

### Milestone 3: Backend & Data Layer

- [x] Setup MongoDB connection & Mongoose models
- [x] Configure NextAuth with MongoDB Adapter & Roles
- [x] Implement core API routes

### Milestone 4: Commerce Flows

- [x] Product listing, details, and search/filters
- [x] Persistent Shopping Cart
- [x] Stripe Checkout flows
- [x] Admin Dashboard (Products, Orders, Users, Coupons management)

### Milestone 5: Polish & Messaging

- [x] Resend integration (Receipts & Tracking emails)
- [x] PDF Invoice generation
- [x] Public Order tracking page
- [x] Review & Ratings system

### Milestone 6: Verification & Final Polish

- [ ] End-to-end testing of major flows
- [/] Systematic Lint fixing and Technical Debt resolution
- [ ] Final security audit
- [ ] Update README with deployment guide

---

## Implementation Details

### Mongoose Models

- **User**: Name, email, password, role, wishlist, persistent cart.
- **Product**: Details, images, rating, reviews[], category, stock.
- **Order**: User details, items, subtotal, status, tracking, payment info.
- **Coupon**: Code, discount type/value, expiry, tracking.

### Admin Features

- **Order Management**: View all orders, update status, add tracking links, download invoices.
- **User Management**: View users, promote to staff/admin, delete accounts.
- **Coupon Management**: Create/Delete discount campaigns with progress tracking.
- **Product Management**: Multi-image upload support, category management.

### Customer Features

- **Order Tracking**: Search order by ID, interactive timeline, download invoice.
- **Product Reviews**: Submit star ratings and comments (authenticated), average rating auto-calculated.
- **Premium UI**: HSL-based brand colors, glassmorphism, Framer Motion transitions.
