# 🌐 Mini Social Media App
### *(Node.js + Express + EJS + MongoDB + JWT + Multer)*

A **fully functional mini social media web app** built with **Node.js, Express, EJS, MongoDB, JWT authentication, and Multer for profile picture uploads**.
Users can **register, log in, create/edit posts, like/unlike posts, and upload a profile picture**, all securely handled.

---

## ✨ Features

### 🔐 User Management

* 👤 **Register, Login & Logout**
* 🔒 **JWT Authentication** stored in cookies
* 🔐 **Protected Routes** — only authenticated users can access profiles
* 🖼️ **Profile Picture Upload** using **Multer with disk storage**

### 📝 Post Management

* 🖊️ **Create, Edit & Update Posts**
* ❤️ **Like & Unlike** posts

---

## 🧩 Tech Stack

| Purpose           | Technology                              |
| ----------------- | --------------------------------------- |
| Backend           | **Node.js**, **Express.js**             |
| Database          | **MongoDB + Mongoose**                  |
| Frontend          | **EJS (Embedded JavaScript Templates)** |
| Authentication    | **JWT (jsonwebtoken)**                  |
| Password Security | **bcrypt**                              |
| Cookies           | **cookie-parser**                       |
| File Upload       | **Multer (Disk Storage)**               |
| Security/Unique   | **crypto** for unique filenames         |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Add environment variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

### 4️⃣ Start the server

```bash
node app.js
```

Open in your browser 👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧠 How It Works

1. **Registration:** Users sign up with username, email, and password (hashed with bcrypt).
2. **Login:** JWT token is generated and stored in cookies.
3. **Protected Routes:** Middleware verifies JWT before access.
4. **Profile Picture:** Users can upload a profile picture; Multer stores it with a unique filename using **crypto**.
5. **Posts:** Users can create, edit, and like/unlike posts.

---

## 📁 Folder Structure

```
├── models/
│   ├── user.js
│   └── post.js
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── profile.ejs
│   └── edit.ejs
├── public/
│   └── images/uploads/       # profile images
├── app.js
└── package.json
```

---

## 💡 Key Learnings

* Implementing **JWT Authentication** in Express
* Using **bcrypt** for password hashing
* Creating **protected routes** with middleware
* Handling **CRUD operations** (except delete) in MongoDB
* Managing **likes/unlikes** and post editing
* Uploading and serving **profile images using Multer** with **disk storage**
* Generating **unique filenames** using **crypto**

---

## 👩‍💻 Author

**Sweta Dahal**
🎓 B.Sc. CSIT Student | 💻 MERN Stack Learner
🌐 [YouTube: Sweta Dahal](https://www.youtube.com/@SwetaDahal)

---

## 🤝 Contribute

Want to improve this project?
Fork → Create a branch → Commit → Submit a PR.
Feedback and contributions are always welcome! 💬

