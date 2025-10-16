// scripts/firebase-config.js
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC0ScXmzo0-O2Vsxjpp2nTDmJkLETobEQg",
    authDomain: "v0ai-real.firebaseapp.com",
    databaseURL: "https://v0ai-real-default-rtdb.firebaseio.com",
    projectId: "v0ai-real",
    storageBucket: "v0ai-real.firebasestorage.app",
    messagingSenderId: "151198275979",
    appId: "1:151198275979:web:54cdffc9acc5b246fb378e",
    measurementId: "G-1828HQE7KH"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Firebase Auth Providers
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Export for use in other files
window.firebaseAuth = auth;
window.firebaseDb = db;
window.googleProvider = googleProvider;