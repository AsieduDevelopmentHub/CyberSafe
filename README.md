# CyberSafe – Cybersecurity Awareness Web & Mobile App

## 🧩 Overview
CyberSafe is a modern authentication-based learning platform designed to educate users on cybersecurity awareness. The system is built as a responsive web application with planned APK conversion using Capacitor, making it capable of running on web, Android, and iOS with a single codebase.

The platform integrates **Firebase Authentication** and **Firestore**, enabling secure multi-user login and future-ready real-time features such as quiz tracking, progress storage, and gamification rewards.

---

## 🚀 Core Features

### ✅ Authentication System
- Firebase Email/Password login & registration
- Session persistence (users stay logged in after refresh)
- Modular Firebase config for clean code reuse

### 📊 Dashboard Interface
- Redirect-based login handling
- User session validation (planned UI improvement for auto-hide login page after authentication)
- Ready for personalized panels like “Progress”, “Badges”, or “Quizzes Completed”

### 🎮 Quiz & Learning Engine (Foundational Module Shell Included)
- Prepared `quiz-system.js` for future expansion
- Designed to integrate with Firestore for storing quiz responses and analytics
- Ideal for gamified learning modules, badges, and achievement systems

### 📱 APK & Cross-Platform Ready
- Follows `www/` source and `dist/` build convention
- Capacitor setup done to wrap into a mobile application without code rewrites

### 🎨 UI/UX Ready for Theming
- SVG-based branding for high clarity
- UI files structured for upcoming implementation of gradients, dark mode, and animated transitions
- Dashboard and Auth pages separated for clean scalability

---

## 🏗 Project Structure Overview
.
├── android
├── capacitor.config.json
├── dist
│   ├── assets
│   │   └── icons
│   ├── index.html
│   ├── scripts
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── firebase-config.js
│   │   └── modules.js
│   └── styles
│       ├── auth.css
│       ├── dashboard.css
│       └── main.css
├── ios
└── package.json

8 directories, 10 files