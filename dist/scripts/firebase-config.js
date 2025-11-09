// scripts/firebase-config.js
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

// Enhanced initialization with better error handling
function initializeFirebase() {
    try {
        console.log('🔥 Initializing Firebase...');
        
        // Check if Firebase is already initialized
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase initialized successfully');
        } else {
            console.log('✅ Firebase already initialized');
        }
        
        // Configure auth
        const auth = firebase.auth();
        auth.useDeviceLanguage();
        
        console.log('✅ Firebase services ready');
        return { auth, db: firebase.firestore() };
        
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        alert('Firebase initialization failed: ' + error.message);
        throw error;
    }
}

// Initialize immediately
window.firebaseApp = initializeFirebase();