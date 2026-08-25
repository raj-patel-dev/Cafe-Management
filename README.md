# ☕ Smart Cafe Management System

A modern **Smart Cafe Management System** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. The system helps cafes efficiently manage customers, menu items, orders, billing, and day-to-day cafe operations through an easy-to-use web interface.

## 🚀 Features

* 👤 User registration and login
* 🔐 Secure authentication
* 🍔 Menu management
* 🛒 Add items to cart
* 📦 Place and manage orders
* 🧾 Order and billing management
* 📊 Admin dashboard
* 👨‍💼 Admin management of menu and orders
* 🔍 Search and filter menu items
* 📱 Responsive user interface
* 💾 MongoDB database integration
* ⚡ RESTful API architecture

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Bootstrap

### Backend

* Node.js
* Express.js
* REST API

### Database

* MongoDB
* Mongoose

### Tools

* Git & GitHub
* VS Code
* Postman
* npm

## 📂 Project Structure

```text
Smart-Cafe-Management/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── assets/
│       └── App.jsx
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/smart-cafe-management.git
```

### 2. Navigate to the project

```bash
cd smart-cafe-management
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Install backend dependencies

```bash
cd ../server
npm install
```

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace the values with your own MongoDB connection string and secret key.

## ▶️ Running the Application

### Start the Backend

```bash
cd server
npm run dev
```

### Start the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The application will normally be available at:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

## 👨‍💼 Admin Module

The admin panel allows cafe administrators to:

* Add new menu items
* Update menu items
* Delete menu items
* View customer orders
* Update order status
* Manage cafe operations
* Monitor overall orders

## 👨‍🍳 Order Management

Customers can browse the available menu, select food and beverages, add them to their cart, and place orders.

The system provides order tracking through different statuses such as:

```text
Pending → Confirmed → Preparing → Ready → Completed
```

## 🗄️ Database

The application uses **MongoDB** for storing application data.

Main collections may include:

* Users
* Menu Items
* Orders
* Categories
* Payments

Mongoose is used to define schemas and communicate with MongoDB.

## 🔐 Security

The system implements basic security practices including:

* Password hashing
* JWT-based authentication
* Protected API routes
* Environment variables for sensitive configuration
* Server-side validation

## 📸 Screenshots

Add screenshots of your project here:

```text
screenshots/
├── home.png
├── menu.png
├── cart.png
├── login.png
├── orders.png
└── admin-dashboard.png
```

Example:

```markdown
![Home Page](screenshots/home.png)
![Admin Dashboard](screenshots/admin-dashboard.png)
```

## 🎯 Project Objective

The main objective of the **Smart Cafe Management System** is to digitize and simplify cafe operations. It reduces manual work involved in managing menus, customer orders, and billing while providing administrators with a centralized platform to manage cafe activities.

## 🔮 Future Enhancements

* Online payment integration
* Table reservation system
* Real-time order notifications
* Sales and revenue analytics
* Customer reviews and ratings
* Inventory management
* Email/SMS notifications
* QR-based table ordering
* Advanced admin analytics

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add new feature"
```

5. Push the branch

```bash
git push origin feature/new-feature
```

6. Open a Pull Request

## 📄 License

This project is developed for educational and portfolio purposes.

## 👨‍💻 Developer

**Raj Patel**

MERN Stack Developer | Full-Stack Developer

---

⭐ If you find this project useful, consider giving the repository a star!
