<h1 align='center'>SmartServe: QR-Based Real-Time Restaurant Management System</h1>

<h3>Overview</h3>
<p font-size='50px'><b>SmartServe</b> is a modern, full-stack restaurant automation system designed to eliminate traditional menus. It features a seamless QR-based interface for customers to browse menus and place orders, backed by a robust Node.js and Express server. The system provides restaurant owners with a centralized real-time dashboard to manage orders, track inventory, and streamline kitchen operations efficiently.</p>
<div align='center'>
  <img src ='https://github.com/user-attachments/assets/0d075f0d-bb63-4f19-8b7f-2946d6afb5fb' alt='home-page'>
</div>

## Features

* **QR Code Scanning:** Scan QR codes at restaurant tables to access the menu.
* **Digital Menu:** Browse and explore restaurant menus digitally.
* **Table Booking:** Reserve tables in advance to avoid waiting times.
* **Order Management:** Place, modify, and track orders in real-time.
* **Admin Dashboard:** Manage menu items, monitor orders, and view booking statistics.

## Technologies Used

* **Frontend:** React.js with Redux Toolkit for state management.
* **Backend:** Node.js with Express.js for RESTful API development.
* **Database:** MongoDB for efficient data storage.
* **QR Code:** Integrated QR code generation and scanning libraries.
* **Authentication:** JSON Web Tokens (JWT) for secure user authentication.
<div align='center'>
  <img src="https://github.com/user-attachments/assets/e11abaf6-6bc9-4472-a51f-716993c85ec5" alt="mern-stack" height="240px">
</div>

## Demo and Screenshots
- **Live Demo**: [SmartServe live](http://scan-and-dine.onrender.com/)

## Installation

**Prerequisites**

* Node.js (v20 or above)
* MongoDB (Local or Cloud Instance)
* npm

**Steps**

1. Clone the repository:

    ```
    git clone https://github.com/tarunlkr6/SmartServe.git
    cd SmartServe
    ```
2. Install Dependencies:

    * Backend:
      
     ```
     cd backend
     npm install
     ```
    * Frontend:
  
     ```
     cd frontend
     npm install
     ```
    * Admin:
      
     ```
     cd admin
     npm install
     ```
3. Set up environment variables:
   * Create a ```.env``` file in the root directory and configure the following:
   ```
   NODE_ENV = development
   
   PORT = 8080
   
   MONGO_URI = <Your mongoDB connection string>
   
   CORS_ORIGIN = *
   
   ACCESS_TOKEN_SECRET =
   ACCESS_TOKEN_EXPIRY =
   
   REFRESH_TOKEN_SECRET = 
   REFRESH_TOKEN_EXPIRY =
   
   CLOUDINARY_CLOUD_NAME = 
   CLOUDINARY_API_KEY = 
   CLOUDINARY_API_SECRET = 
   BACKEND_URL = 
   BACKEND_LOCAL_URL = 'http://localhost:8080'
   
   SERVICE_MAIL = <your gmail>
   SENDER_NAME = SmartServe
   CLIENT_ID = <gmail api client id>
   CLIENT_SECRET = <gmail api client secret>
   REDIRECT_URI = https://developers.google.com/oauthplayground
   REFRESH_TOKEN = <oauthplaygroud refresh token string>
   PAYPAL_CLIENT_ID =
   ```
4. Run the application:
   ```
   npm run dev
   ```
5. Access the application:
   * Open your browser and navigate to http://localhost:5173
  

## Project Structure
```
SmartServe/
|-- admin/
|   |-- public/
|   |-- src/
|       |-- assets/
|       |-- components/
|       |-- pages/
|       |-- App.jsx
|       |-- Main.jsx
|       |-- index.css
|-- backed/
|    |-- src/
|        |-- controllers/
|        |-- db/
|        |-- mails/
|        |-- middlewares/
|        |-- models/
|        |-- routes/
|        |-- utils/
|        |-- app.js
|        |-- constants.js
|        |-- server.js
|-- frontend/
|     |-- public/
|     |-- src/
|          |-- assets/
|          |-- components/
|          |-- configs/
|          |-- context/
|          |-- lib/
|          |-- pages/
|          |-- slices/
|          |-- App.jsx
|          |-- constants.js
|          |-- store.js
|-- package.json
|-- Readme.md
```

## Usage
 * **For Customers**: Scan the QR code placed on restaurant tables to view the menu, book tables, and place orders effortlessly.
 * **For Restaurant Owners**: Use the admin dashboard to manage menus, view customer bookings, and monitor orders.

## Future Enhancements

* **Analytics**: Provide detailed analytics for restaurant owners.
* **Mobile App**: Develop native apps for Android and iOS platforms.


