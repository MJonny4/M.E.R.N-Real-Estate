M.E.R.N Real Estate
===================

M.E.R.N Real Estate is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides a platform for managing real estate properties (houses) and user data with CRUD functionality for both houses and users.

Features
--------

- **Houses CRUD:** Create, Read, Update, and Delete real estate listings for both sale and rent.
- **Users CRUD:** Manage user information and authentication.

Technologies Used
-----------------

- **Frontend:**
  - React with TypeScript

- **Backend:**
  - Node.js with JavaScript for handling server logic
  - Express.js for building RESTful APIs
  - MongoDB for data storage

Installation
------------

1. **Clone the Repository:**
   ``bash
   git clone https://github.com/your-username/M.E.R.N-Real-Estate.git
   cd M.E.R.N-Real-Estate
   ``

2. **Install Dependencies:**  
   ``bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ``

3. **Set Up Environment Variables:**

   Create a `.env` file in the `server` directory with the necessary configuration (e.g., MongoDB connection string, server port).

4. **Run the Application:**
   ``bash
    # Start the server (from the 'server' directory)
    npm start

    # Start the client (from the 'client' directory)
    npm start

    The application will be accessible at http://localhost:3000.
    ``

Contributing
------------
Contributions are welcome! If you'd like to contribute to M.E.R.N Real Estate, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature-name"`.
4. Push to your fork: `git push origin feature-name`.
5. Submit a pull request.

License
-------
This project is licensed under the MIT License - see the `LICENSE` file for details.

Acknowledgments
---------------
Special thanks to the open-source community and the creators of the MERN stack for providing powerful tools to build modern web applications.

Happy coding!