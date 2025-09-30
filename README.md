# [WorkLoy](https://workloy-51802.web.app/)

## Project Overview
**WorkLoy** is a Micro-Task and Earning Platform designed to provide users with opportunities to complete small tasks and earn rewards. The platform accommodates three distinct roles — **Worker**, **Buyer**, and **Admin** — each with tailored functionalities to ensure seamless task management, task creation, and platform administration.

### Purpose
The main purpose of WorkLoy is to create a reliable ecosystem where individuals can earn money by completing micro-tasks, while buyers can efficiently outsource small jobs and manage payments, and admins can oversee the overall platform integrity.

### Main Features
- **Worker**
  - Browse and complete available tasks
  - Submit tasks for review
  - Withdraw earned coins
  - Receive notifications for task updates

- **Buyer**
  - Create and manage tasks
  - Review task submissions
  - Pay workers and purchase coins
  - Report issues and resolve disputes

- **Admin**
  - Manage user roles and permissions
  - Monitor platform activity
  - Handle reports and maintain system integrity

### Problem it Solves
WorkLoy bridges the gap between task seekers and task providers by providing a structured, secure, and easy-to-use platform for micro-tasking and earning, ensuring transparency, timely payments, and a smooth workflow for all users.

### WorkLoy Home Page

![WorkLoy Dashboard](https://i.ibb.co.com/XZNRpbm6/readme.png)

## 🚀 Features / Key Functionality

### 🎨 Frontend
- Modern and responsive UI built with **React & Tailwind CSS**
- Role-based dashboards for **Worker**, **Buyer**, and **Admin**
- Interactive components (task listings, forms, modals, notifications)
- Real-time updates using **TanStack Query** (data fetching & caching)
- Secure authentication with protected routes
- Mobile-friendly design for seamless accessibility

### 🛠 Backend
- **Node.js & Express.js** RESTful API
- Role-based authentication & authorization
- Secure user management (Workers, Buyers, Admins)
- Task lifecycle management (creation, submission, approval, payment)
- Withdrawal and transaction handling
- Data persistence using **MongoDB**
- Admin controls for monitoring and handling reports

### 🔗 Integrations
- **Stripe** payment gateway for coin purchases and worker payouts
- **Firebase Admin SDK** for secure authentication & notifications
- **Cloudinary / ImgBB** (optional) for task image uploads
- **CORS & dotenv** for secure environment configuration


## 🛠 Technology Stack

### 🎨 Frontend
- **React.js** – Component-based UI development
- **Tailwind CSS** – Modern utility-first styling
- **React Router** – Client-side routing
- **TanStack Query** – Data fetching and caching
- **Axios / Fetch API** – API communication

### 🛠 Backend
- **Node.js** – JavaScript runtime environment
- **Express.js** – RESTful API framework
- **Firebase Admin SDK** – Authentication & notifications
- **Stripe SDK** – Payment gateway integration

### 🗄 Database
- **MongoDB** – NoSQL database for scalable data storage

### ⚙️ Others - Tools
- **JWT (JSON Web Token)** – Authentication & authorization
- **dotenv** – Environment configuration
- **CORS** – Secure cross-origin requests
- **ImgBB** – Image hosting
- **Git & GitHub** – Version control & collaboration

## ⚡ Installation / Setup

### Clone the Repository

##### Client Setup:
```bash
git clone https://github.com/shamsuttabriz/workloy.git
cd workloy
```

```bash
cd client
npm install
```
Create a .env file inside the client folder
Example:
```bash
VITE_API_URL=https://server-seven-tau-43.vercel.app
```

```bash
npm run dev
```

##### Server Setup:

```bash
cd server
npm install
```
Create a .env file inside the server folder
Example:

```bash
PORT=5001
MONGO_URI=your_mongodb_connection_string
PAYMENT_GATEWAY_KEY=your_stripe_secret_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

```bash
npm run dev
```
