# DevConnector Backend API

A simple backend API built with **Node.js**, **Express**, and **MongoDB** for creating posts, liking/unliking posts, and adding/deleting comments.  
Tested using **Postman**.

---

## Features
- Create, read, update and delete posts
- Like and unlike posts
- Add and delete comments
- Get like counts and comment lists for each post
- MongoDB + Mongoose for database
- JWT authentication

---

## Tech Stack
- **Node.js** – Server runtime
- **Express** – Web framework
- **MongoDB** – Database
- **Mongoose** – ODM for MongoDB
- **JWT** – Authentication
- **Postman** – API testing

---

## Installation & Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/Hussnain83/dev-connector.git
cd dev-connector
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Add environment variables  
Create a `.env` file in the root directory:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4️⃣ Run the server
```bash
npm run server
```
Server will run at:  
`http://localhost:5000`

---
📊 API Structure
----------------

### 🧑‍💻 User Routes

| Model | Method | Endpoint | Description |
| --- | --- | --- | --- |
| User | POST | /api/users/signup | Signup new user ✅ |
|      | POST | /api/users/login | Login user and return JWT ✅ |
|      | GET  | /api/users/me    | Get current logged-in user ✅ |
|      | DELETE | /api/users/delete | Delete user account (and profile) ✅ |
|      | GET  | /api/users       | Get all users ✅ |

### 📝 Post Routes

| Model | Method | Endpoint | Description |
| --- | --- | --- | --- |
| Post | POST | /api/posts      | Create a new post ✅ |
|      | GET  | /api/posts      | Get all posts ✅ |
|      | GET  | /api/posts/:id  | Get post by ID ✅ |
|      | DELETE | /api/posts/:id | Delete a post ✅ |
|      | PUT  | /api/posts/like/:id | Like a post ✅ |
|      | PUT  | /api/posts/unlike/:id | Unlike a post ✅ |

### 💬 Comment Routes

| Model  | Method | Endpoint | Description |
| --- | --- | --- | --- |
| Comment | POST | /api/posts/comment/:id | Add a comment to a post ✅ |
|         | DELETE | /api/posts/comment/:id/:comment_id | Delete a comment ✅ |


## Testing with Postman
1. Import the API routes into Postman.
2. Register a new user to get the **JWT token**.
3. Use the token in the **Authorization Header** for protected routes.
4. Test creating, liking, commenting, and deleting posts.

---

## Example Post Schema
```js
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // The user who created the post
  },
  text: {
    type: String,
    required: true, // Content of the post
  },
  name: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Users who liked the post
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
        required: true, // Comment content
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

```

---


Muhammad Hussnain Dogar
