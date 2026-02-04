# Cupid Crochy 🧶

> A premium e-commerce platform for handmade crochet treasures.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.21.0-47A248?style=for-the-badge&logo=mongodb)
![Stripe](https://img.shields.io/badge/Stripe-20.1.0-635BFF?style=for-the-badge&logo=stripe)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## 📖 Documentation

The detailed documentation for this project has been organized into the `docs/` folder to keep this README clean.

- **[Full Documentation](./docs/full_documentation.md)**: Comprehensive guide on features, architecture, API endpoints, and user roles.
- **[Project Status](./docs/project_status.md)**: Current development milestones and checklist.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or Local)
- Stripe Account
- Resend Account (Email)

### Installation

1.  **Clone & Install**

    ```bash
    git clone <your-repo-url>
    cd cupid-crochy
    npm install
    ```

2.  **Environment Setup**
    Create a `.env.local` file (see `.env.example` if available, or check docs).

3.  **Seed Database**

    ```bash
    npm run seed
    ```

    _Creates Admin, Staff, Products, and Coupons._

4.  **Run Development Server**

    ```bash
    npm run dev
    ```

    Visit [http://localhost:3000](http://localhost:3000).

5.  **Stripe Webhook (Local)**
    ```bash
    stripe listen --forward-to localhost:3000/api/webhook/stripe
    ```

## 🔑 Default Credentials

| Role      | Email                       | Password   |
| :-------- | :-------------------------- | :--------- |
| **Admin** | `admin@cupidcrochy.com`     | `admin123` |
| **Staff** | `staff@cupidcrochy.com`     | `staff123` |
| **User**  | `sarah.johnson@example.com` | `user123`  |

---

_Handcrafted with ❤️ by Cupid Crochy Team_
