# RIVETO

[![License](https://img.shields.io/github/license/Nsanjayboruds/RIVETO)](LICENSE)
[![Issues](https://img.shields.io/github/issues/Nsanjayboruds/RIVETO)](https://github.com/Nsanjayboruds/RIVETO/issues)
[![Stars](https://img.shields.io/github/stars/Nsanjayboruds/RIVETO)](https://github.com/Nsanjayboruds/RIVETO/stargazers)
---


## 🚀 Overview

**RIVETO** is a modern, fullstack web application built for scalability, advanced analytics.  
It features a robust admin panel for management, user tracking, advanced UI components, and secure file/image upload via Cloudinary.

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Tracking:** Custom analytics & event tracking
- **UI:** Advanced, responsive design with Tailwind
- **Image Uploads:** [Cloudinary](https://cloudinary.com/) for secure and performant media management

---

## 🏗️ Architecture

<img width="3596" height="4077" alt="image" src="https://github.com/user-attachments/assets/65429204-b3b5-4b63-9bd1-f4249e68362f" />

---

## ⚙️ Features

- 📊 **Admin Panel:** Manage users, payments, analytics, and more
- 📈 **Advanced Tracking:** User behavior, transactions, and event analytics
- 🎨 **Modern UI:** Responsive, accessible, and beautiful interface (Tailwind)
- 🖼️ **Cloudinary Image Upload:** Fast, secure, and optimized media storage
- 🔐 **Authentication & Authorization:** Secure user and admin access
- 📝 **RESTful API:** Powerful backend for frontend and mobile clients

---

## 🚦 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Nsanjayboruds/RIVETO.git
cd RIVETO
```

### 2. Set up the environment

- Copy and edit environment files:
  - For backend:
    ```bash
    cp backend/.env.example backend/.env
    ```
  - For frontend:
    ```bash
    cp frontend/.env.example frontend/.env
    ```
- Fill in your MongoDB, Razorpay keys, Cloudinary credentials, JWT secrets, etc.

### 3. Install dependencies

```bash
# In root
cd backend
npm install

cd ../frontend
npm install
```

### 4. Start development servers

```bash
# Backend (Node.js/Express)
cd backend
npm run dev

# Frontend (React)
cd ../frontend
npm start
```

- Backend: [http://localhost:5000](http://localhost:5000)
- Frontend: [http://localhost:3000](http://localhost:3000)

---

## 🖼️ Image Upload with Cloudinary

### Backend Integration

- Uses the [cloudinary npm package](https://www.npmjs.com/package/cloudinary).
- Secure image upload endpoints with authentication/middleware.
- Stores Cloudinary URLs in MongoDB model fields.

**Sample Endpoint (Express.js):**

```js
// /backend/routes/upload.js
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Cloudinary config (use your .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "riveto_uploads",
    allowed_formats: ["jpg", "png", "jpeg", "svg", "webp"],
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("image"), (req, res) => {
  res.json({ url: req.file.path });
});
```

### Frontend Integration

- Use a file input and upload images using a form or fetch/Axios to the backend `/upload` endpoint.
- Store the returned Cloudinary URL for use in UI or database.

**Sample Usage:**

```js
const handleUpload = async (event) => {
  const formData = new FormData();
  formData.append("image", event.target.files[0]);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  setImageUrl(data.url); // Save/display Cloudinary URL
};
```



## 🧪 Testing

Run lint checks:

```bash
npm run lint
```



## 📂 Project Structure

```
RIVETO/
├── backend/
│   ├── controller/
│   ├── model/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── .env.example
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   ├── .env.example
│   └── ...
├── README.md
└── ...
```

---

## 🛡️ Environment Configuration

### Backend (`backend/.env.example`)

```
MONGODB_URI=
JWT_SECRET=
BASE_URL=http://localhost:5000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`frontend/.env.example`)

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY=
```

---

## 🎨 UI/UX

- Fully responsive admin panel
- Advanced dashboard with analytics charts
- Dark/light mode with Tailwind CSS
- Custom components for user and payment management

---

## 📈 Tracking

- Custom event logging and analytics
- Admin dashboard for real-time tracking

---
## 🤝 Feedback and Community

We welcome bug reports, feature requests, and community feedback.

### 🐛 Report Issues

If you find a bug or security issue, please open an issue on GitHub with:

* Steps to reproduce
* Expected behavior
* Screenshots/logs if applicable

GitHub Issues:
https://github.com/Nsanjayboruds/RIVETO/issues

### 💡 Feature Requests

Have an idea for improving RIVETO?
Open a feature request issue and describe your suggestion.

### 💬 Discussions

Use GitHub Discussions for:

* Questions
* Community help
* Project ideas
* Feedback

GitHub Discussions:
https://github.com/Nsanjayboruds/RIVETO/discussions


## 📝 Contribution Guidelines

Before contributing, please star the repository ⭐
1. Fork the project
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

Please review [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 🌟 Our Amazing Contributors

Thank you to all contributors who have helped make RIVETO better! 🚀

<a href="https://github.com/Nsanjayboruds/RIVETO/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Nsanjayboruds/RIVETO" />
</a>

### 🏆 Special Recognition

- 🎯 **First Contributor:** Madhav Majumdar ([@madhav2348](https://github.com/madhav2348)) - For being the first to join and contribute to RIVETO!
- 💡 **Most Innovative:** Md Ashad ([@asadanwarr0](https://github.com/asadanwarr0)) - For enhancing the About, Contact, and Home sections.
- 🎨 **UI/UX Champion:** Vedant ([@vedantbudhabaware](https://github.com/vedantbudhabaware)) - For fixing critical UI issues and optimizing the mobile experience.

_Want to see your name here? Check out our [Contributing Guide](contribute.md)!_

---

## 🚀 Deployment

- **Docker Compose** and cloud deployment instructions coming soon!
- Easily deploy to [Vercel](https://vercel.com/) (frontend) and [Render](https://render.com/) or [Heroku](https://heroku.com/) (backend).

---

## 📝 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🙋‍♂️ Contact

- Nishant Sanjay Borude – [@Nsanjayboruds](https://github.com/Nsanjayboruds)

---

> _Built with React, Tailwind, Node.js, Express, MongoDB, Razorpay, and Cloudinary_
