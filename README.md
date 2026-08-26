# ☕ Smart Cafe Management System

A full-stack **Smart Cafe Management System** built with the **MERN stack** to simplify cafe operations such as staff authentication, menu management, cart handling, order processing, billing, and administration.

## ✨ Features

- Staff registration and login
- Secure authentication
- Menu management
- Search and filter menu items
- Add food and beverages to cart
- Place and manage orders
- Order and billing management
- Admin dashboard
- Admin menu and order managem  ent
- Responsive user interface
- RESTful API architecture
- MongoDB database integration

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Bootstrap

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB
- Mongoose

### Tools
- Git & GitHub
- VS Code
- Postman
- npm

## 📁 Project Structure

```text
Cafe-Management/
├── Frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── utils/
│       ├── assets/
│       ├── context/
│       └── App.jsx
│
├── Server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── README.md
```

## ⚙️ Installation

```bash
git clone https://github.com/raj-patel-dev/Cafe-Management.git
cd Cafe-Management
```

Install frontend dependencies:

```bash
cd Frontend
npm install
```

Install backend dependencies:

```bash
cd ../Server
npm install
```

## 🔐 Environment Variables

Create the required `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Never commit real credentials or API keys to GitHub.

## ▶️ Run Locally

Start the backend:

```bash
cd Server
npm run dev
```

Start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

Typical local URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

## 👨‍💼 Admin Module

Administrators can:

- Add menu items
- Update menu items
- Delete menu items
- View customer orders
- Update order status
- Manage cafe operations

## 📦 Order Flow

```text
Pending → Confirmed → Preparing → Ready → Completed
```

## 🗄️ Database

MongoDB is used for application data storage, with Mongoose providing schema definitions and database interaction.

Typical data entities include:

- Users
- Menu Items
- Orders
- Categories
- Payments

## 🔒 Security

- Password hashing
- JWT-based authentication
- Protected API routes
- Environment variables for sensitive configuration
- Server-side validation

## 🚀 Future Improvements

- Online payment integration
- Table reservation
- Real-time order notifications
- Sales and revenue analytics
- Customer reviews and ratings
- Inventory management
- Email/SMS notifications
- QR-based table ordering
- Advanced admin analytics

## 👨‍💻 Developer

**Raj Patel**

Full-Stack / MERN Developer

[GitHub](https://github.com/raj-patel-dev)
