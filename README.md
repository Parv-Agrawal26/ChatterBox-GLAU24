# ChatterBox - Real-Time Chat Application

ChatterBox is a full-stack real-time messaging application built using ReactJS, Node.js, Express, MongoDB. The app allows users to register, log in, and engage in private chats with other active users. ChatterBox ensures secure communication with user authentication and supports real-time message delivery, user presence tracking, and instant notifications.

## Features

- **Real-time Messaging**: Send and receive messages instantly.
- **User Authentication**: Secure user registration and login using bcrypt for password hashing and JWT for session management.
- **Private Chats**: Engage in one-on-one chats with users.
- **Message History**: Access chat history between users.
- **Emoji Support**: Add fun to conversations with emoji integration.

## Tech Stack

### Backend
- **Node.js & Express**: Handles API routes, authentication, and communication with the database.
- **MongoDB & Mongoose**: Stores user data and messages.
- **JWT**: Used for secure authentication.

### Frontend
- **React**: The frontend is built using React for UI components and state management.
- **CSS & React-Slick**: Handles the styling and provides a sleek, responsive design for the features section.
- **Emoji-Picker**: Enables users to send emojis in their messages.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- MongoDB running locally or via a cloud provider (MongoDB Atlas).

### Installation

1. Clone the repository:

2. Navigate into the project directory:

3. Install the backend dependencies:

   ```bash
   cd backend
   npm install
   ```

4. Install the frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   node server.js
   ```

2. Start the React client:

   ```bash
   cd frontend
   npm start
   ```


## API Endpoints

### Auth Routes
- **POST** `/api/register`: Register a new user.
- **POST** `/api/login`: Log in an existing user.

### User Routes
- **GET** `/api/users`: Retrieve a list of active users.

### Message Routes
- **GET** `/api/messages/:userId`: Fetch all messages between the authenticated user and the target user.


## Future Enhancements

- Add functionality for deleting user account
- Improve overall UI
- Add login session management
