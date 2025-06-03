# Hotel Booking & Reservation System

A full-stack hotel booking system built with Node.js, Express, MySQL, HTML, CSS, and JavaScript.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **Room Management**: Add and view available hotel rooms
- **Customer Registration**: Register new customers with contact information
- **Booking System**: Make reservations with date selection
- **Booking Management**: View all current bookings and their status
- **System Monitoring**: Real-time API and database status monitoring
- **Responsive Design**: Mobile-friendly interface
- **Automatic Setup**: Database and tables created automatically

## 📁 Project Structure

```
hbrs/
├── backEnd/
│   ├── server.js              # Node.js Express server
│   ├── package.json           # Backend dependencies
│   ├── .gitignore            # Git ignore for backend
│   └── database/
│       └── schema.sql        # Database schema (reference)
├── public/
│   ├── index.html            # Main HTML file
│   ├── styles.css            # CSS styling
│   └── script.js             # Frontend JavaScript
├── .gitignore                # Root git ignore
└── README.md                 # This documentation
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)

  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **MySQL Server** (v5.7 or higher)

  - Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
  - Or install MySQL Workbench for GUI management
  - Verify installation: `mysql --version`

- **Git** (optional, for version control)
  - Download from [git-scm.com](https://git-scm.com/)

## 🚀 Installation & Setup

### Step 1: Clone or Download the Project

```bash
# If using Git
git clone <your-repository-url>
cd hbrs

# Or download and extract the ZIP file
```

### Step 2: Setup MySQL Database

1. **Start MySQL Server**

   - Windows: Start MySQL service from Services panel
   - macOS: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

2. **Create MySQL User (Optional)**

   ```sql
   -- Login to MySQL as root
   mysql -u root -p

   -- Create a new user for the application
   CREATE USER 'hotel_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON *.* TO 'hotel_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### Step 3: Configure Database Connection

1. Navigate to the backend folder:

   ```bash
   cd backEnd
   ```

2. Open `server.js` and update the database configuration (line 14-18):
   ```javascript
   const db = mysql.createConnection({
     host: "localhost",
     user: "root", // or your MySQL username
     password: "your_password", // Replace with your MySQL password
     multipleStatements: true,
   });
   ```

### Step 4: Install Backend Dependencies

```bash
# Make sure you're in the backEnd directory
cd backEnd

# Install Node.js dependencies
npm install
```

## 🏃‍♂️ Running the Application

### Method 1: Development Mode (with auto-restart)

```bash
# In the backEnd directory
npm run dev
```

### Method 2: Production Mode

```bash
# In the backEnd directory
npm start
```

### Access the Application

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. The application should load with the hotel booking interface

## 🔗 API Endpoints

### Health & Status

- `GET /api/health` - API health check
- `GET /api/database/status` - Database connection status
- `GET /api/database/tables` - Database tables information
- `GET /api/stats` - System statistics

### Rooms

- `GET /api/rooms` - Get all available rooms
- `POST /api/rooms` - Add a new room

### Customers & Bookings

- `POST /api/customers` - Create new customer
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings

### Services

- `POST /api/services` - Add service to booking

## 🗄️ Database Schema

The application automatically creates these tables:

- **rooms**: Store room information (number, type, price, amenities)
- **customers**: Store customer details (name, email, phone, address)
- **bookings**: Store reservation information (dates, amounts, status)
- **services**: Store additional services for bookings

## 📖 Usage Guide

### 1. Adding Rooms

1. Click "Add Room" in the navigation
2. Fill in room details (number, type, price, capacity, amenities)
3. Click "Add Room" to save

### 2. Making Reservations

1. Click "Make Booking" in the navigation
2. Fill in customer information
3. Select room, check-in/out dates
4. Add any special requests
5. Click "Book Now" to confirm

### 3. Viewing Bookings

1. Click "View Bookings" to see all reservations
2. View customer details, room info, and booking status

### 4. System Monitoring

1. Click "System Status" to view:
   - API connection status
   - Database connection status
   - System statistics
   - Database table information

## 🔧 Troubleshooting

### Common Issues

**1. "Database connection failed"**

```bash
# Check if MySQL is running
# Windows
net start mysql

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

**2. "Port 3000 already in use"**

```bash
# Kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**3. "Cannot find module" errors**

```bash
# Reinstall dependencies
cd backEnd
rm -rf node_modules
npm install
```

**4. "Access denied for user" (MySQL)**

- Check your MySQL username and password in `server.js`
- Ensure MySQL user has proper permissions
- Try connecting with MySQL Workbench first to verify credentials

### Debug Mode

To see detailed error messages, you can run the server with additional logging:

```bash
# In backEnd directory
DEBUG=* npm start
```

## 🤝 Support

If you encounter any issues:

1. Check the browser console for JavaScript errors
2. Check the terminal/command prompt for server errors
3. Verify MySQL is running and accessible
4. Ensure all dependencies are installed correctly

## 📝 Notes

- The database and tables are created automatically on first run
- No manual database setup is required
- The application uses port 3000 by default
- All data is stored in MySQL database named `hotel_booking_system`

---

**Happy Booking! 🏨**
