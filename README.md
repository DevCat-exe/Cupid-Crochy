# Cupid Crochy

A premium, high-fidelity e-commerce application for handcrafted crochet products, built with the latest Next.js 16 App Router, MongoDB, and Tailwind CSS v4.

![Cupid Crochy Banner](/public/hero-pattern.svg)

## Features

- **Storefront**: Responsive, animated UI with Framer Motion, persistent shopping cart, and product search/filtering.
- **Admin Dashboard**: Comprehensive management for Products, Orders, Users, and Coupons.
- **Authentication**: Secure role-based access (Admin, Staff, User) using NextAuth.js.
- **Payments**: Integrated Stripe Checkout for secure transactions and webhook processing.
- **Order Tracking**: Public order tracking page with real-time status updates.
- **Invoices**: Automated PDF invoice generation and branded email notifications via Resend.
- **Review System**: Verified purchase reviews with star ratings.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB Atlas (Mongoose)
- **Auth**: NextAuth.js
- **Payment**: Stripe
- **Email**: Resend
- **State Management**: React Context (Cart)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas Account
- Stripe Account
- Resend Account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DevCat-exe/Cupid-Crochy.git
   cd Cupid-Crochy
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   # Database
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/cupid-crochy

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key

   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

   # Resend
   RESEND_API_KEY=re_...
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Admin Access

To access the admin dashboard:

1. Register a new user account.
2. Manually update the user's `role` to `admin` in your MongoDB database.
3. Refresh the session (log out and log back in).
4. Navigate to `/admin`.

## Deployment

The application is optimized for deployment on Vercel.

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the environment variables in the Vercel project settings.
4. Deploy!

## License

This project is licensed under the MIT License.
