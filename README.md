# 🧩 MTalk – Real-Time Chat Application

**MTalk** is a modern, full-stack real-time chat application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It offers a secure and seamless messaging experience, enabling users to register, verify their email, and engage in one-on-one or group chats with real-time updates.

---

## 🚀 Features

### 🔐 User Registration & Email Verification
- Users must verify their email addresses before gaining access.
- Ensures only authenticated users can enter the chat environment.

### 🔑 Secure Login with JWT Authentication
- User credentials are hashed using **bcrypt**.
- **JWT tokens** maintain secure and stateless session authentication.

### 💬 One-on-One & Group Conversations
- Start private conversations or create group chats with selected members.
- Supports real-time sending and receiving of messages.

### ⚡ Real-Time Communication with Socket.IO
- Instant message delivery.
- Real-time updates like online/offline status and live typing indicators.

### 🖥️ Responsive & Intuitive UI
- Built with **React.js** and **TailwindCSS** for a smooth, mobile-friendly interface.
- Clean and modern design inspired by WhatsApp and Messenger.

### 🧪 Seeded Demo Data
- Pre-loaded with sample users like *Alice* and *Bob*.
- Includes chat history for quick testing and demonstration purposes.

---

## 🛠️ Tech Stack

-  | Layer         | Technology                          |
-  |---------------|--------------------------------------|
  -  | **Frontend**  | React.js, TailwindCSS                |
-  | **Backend**   | Node.js, Express.js                  |
-  | **Database**  | MongoDB (via Mongoose ODM)           |
-  | **Real-Time** | Socket.IO                            |
-  | **Auth**      | JSON Web Tokens (JWT), Bcrypt        |
-  | **Email**     | Nodemailer (Gmail SMTP Integration)  |

---

## 📂 Project Structure

mtalk/
├── client/ # React frontend
├── server/ # Node.js backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── utils/
├── socket/ # Socket.IO events
├── config/ # Environment & DB config
└── README.md # Project documentation



