class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
        this.actionCodeSettings = {
            url: window.location.origin,
            handleCodeInApp: true
        };
    }

    init() {
        // Check auth state and handle email verification
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.handleUserLogin(user);
                this.checkEmailVerification(user);
            } else {
                this.handleUserLogout();
            }
        });

        // Handle email verification through URL
        if (window.location.search.includes('mode=verifyEmail')) {
            this.handleEmailVerificationLink(window.location.href);
        }

        // Form event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginFormElement');
        const signupForm = document.getElementById('signupFormElement');
        const forgotPasswordLink = document.getElementById('forgotPassword');
        const resendVerificationLink = document.getElementById('resendVerification');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmailLogin();
            });
        }

        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }

        if (resendVerificationLink) {
            resendVerificationLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.resendVerificationEmail();
            });
        }

        // Signup form
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmailSignup();
            });
        }

        // Google sign in
        const googleSignIn = document.getElementById('googleSignIn');
        const googleSignUp = document.getElementById('googleSignUp');
        
        if (googleSignIn) {
            googleSignIn.addEventListener('click', () => {
                this.handleGoogleSignIn();
            });
        }

        if (googleSignUp) {
            googleSignUp.addEventListener('click', () => {
                this.handleGoogleSignIn();
            });
        }

        // Form switching
        const showSignup = document.getElementById('showSignup');
        const showLogin = document.getElementById('showLogin');
        
        if (showSignup) {
            showSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignupForm();
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    }

    async handleEmailLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log('User logged in:', userCredential.user);
            
            // Update user profile with last login
            if (window.firestoreService) {
                await window.firestoreService.updateUserProgress(userCredential.user.uid, {
                    lastLogin: new Date()
                });
            }
        } catch (error) {
            this.showError('Login failed: ' + error.message);
        }
    }

    async handleEmailSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError('Password should be at least 6 characters');
            return;
        }

        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update profile
            await user.updateProfile({
                displayName: name
            });

            // Send verification email
            await user.sendEmailVerification(this.actionCodeSettings);

            // Create user document in Firestore
            if (window.firestoreService) {
                await window.firestoreService.createUserProfile(user, { 
                    name: name,
                    email: email,
                    emailVerified: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            this.showSuccess('Verification email sent. Please check your inbox.');
            console.log('User created:', user);
        } catch (error) {
            this.showError('Signup failed: ' + error.message);
        }
    }

    async handleGoogleSignIn() {
        try {
            const result = await firebase.auth().signInWithPopup(googleProvider);
            const user = result.user;
            
            console.log('🔐 Google user data:', {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });

            // Check if user document exists
            if (window.firestoreService) {
                const userDoc = await window.firestoreService.getUserProfile(user.uid);
                if (!userDoc) {
                    // Create new user document with ALL Google data
                    await window.firestoreService.createUserProfile(user, {
                        name: user.displayName,
                        email: user.email, // Explicitly include email
                        photoURL: user.photoURL
                    });
                } else {
                    // Update existing user with current Google data
                    await this.updateUserProfileData(user);
                }
            }
        } catch (error) {
            console.error('Google sign in failed:', error);
            this.showError('Google sign in failed: ' + error.message);
        }
    }

    async handleLogout() {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            this.showError('Logout failed: ' + error.message);
        }
    }

    handleUserLogin(user) {
        this.logUserData(user, 'handleUserLogin'); // Debug logging
        this.currentUser = user;
        this.updateUIForUser(user);
        this.switchToApp();
        this.ensureUserProfile(user);
    }

    handleUserLogout() {
        this.currentUser = null;
        this.switchToAuth();
    }

    async ensureUserProfile(user) {
        try {
            if (window.firestoreService) {
                const userDoc = await window.firestoreService.getUserProfile(user.uid);
                if (!userDoc) {
                    // Create new user profile with all data
                    await window.firestoreService.createUserProfile(user, {
                        name: user.displayName,
                        email: user.email // Ensure email is included
                    });
                } else {
                    // Update existing profile with current data
                    await this.updateUserProfileData(user);
                }
            }
        } catch (error) {
            console.error('Error ensuring user profile:', error);
        }
    }

    async updateUserProfileData(user) {
        try {
            const userRef = firebase.firestore().collection('users').doc(user.uid);
            const updates = {
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Update email if it's different or missing
            if (user.email) {
                updates.email = user.email;
            }
            
            // Update display name if it's different
            if (user.displayName) {
                updates.name = user.displayName;
            }
            
            // Update photo URL if available
            if (user.photoURL) {
                updates.photoURL = user.photoURL;
            }
            
            await userRef.update(updates);
            console.log('✅ User profile updated with:', updates);
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    }

    updateUIForUser(user) {
        // Update profile information
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const greeting = document.getElementById('greeting');
        const userAvatar = document.getElementById('userAvatar');
        const profileAvatar = document.getElementById('profileAvatar');

        console.log('🎯 Updating UI with user data:', {
            displayName: user.displayName,
            email: user.email
        });

        // Update name
        if (user.displayName && profileName) {
            profileName.textContent = user.displayName;
        } else if (user.email && profileName) {
            // Fallback to email username if no display name
            profileName.textContent = user.email.split('@')[0];
        }

        // Update email - CRITICAL FIX
        if (user.email && profileEmail) {
            profileEmail.textContent = user.email;
            console.log('✅ Email set in UI:', user.email);
        } else {
            // If no email in user object, try to get from Firestore
            console.log('⚠️ No email in user object, fetching from Firestore...');
            this.fetchUserEmailFromFirestore(user.uid, profileEmail);
        }

        // Update greeting
        if (greeting) {
            const userName = user.displayName ? user.displayName.split(' ')[0] : 
                            user.email ? user.email.split('@')[0] : 'User';
            greeting.textContent = `Welcome back, ${userName}!`;
        }

        // Update avatar
        this.updateUserAvatar(user, userAvatar, profileAvatar);
    }

    async fetchUserEmailFromFirestore(uid, profileEmailElement) {
        try {
            if (window.firestoreService && profileEmailElement) {
                const userData = await window.firestoreService.getUserProfile(uid);
                if (userData && userData.email) {
                    profileEmailElement.textContent = userData.email;
                    console.log('✅ Email loaded from Firestore:', userData.email);
                } else {
                    console.log('❌ No email found in Firestore for user:', uid);
                }
            }
        } catch (error) {
            console.error('Error fetching user email from Firestore:', error);
        }
    }

    updateUserAvatar(user, userAvatar, profileAvatar) {
        if (user.photoURL) {
            if (userAvatar) userAvatar.src = user.photoURL;
            if (profileAvatar) profileAvatar.src = user.photoURL;
        } else {
            // Use default avatar with name
            const name = user.displayName || user.email || 'User';
            const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A1F44&color=fff`;
            if (userAvatar) userAvatar.src = defaultAvatar;
            if (profileAvatar) profileAvatar.src = defaultAvatar;
        }
    }

    logUserData(user, source) {
        console.log(`🔍 User Data from ${source}:`, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            providerData: user.providerData ? user.providerData.map(p => ({
                providerId: p.providerId,
                email: p.email,
                displayName: p.displayName
            })) : 'No provider data'
        });
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        
        if (loginForm && signupForm) {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        }
    }

    showSignupForm() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        
        if (loginForm && signupForm) {
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    switchToApp() {
        const authSection = document.getElementById('authSection');
        const appSection = document.getElementById('appSection');
        
        if (authSection && appSection) {
            authSection.classList.remove('active');
            appSection.classList.add('active');
        }
    }

    switchToAuth() {
        const authSection = document.getElementById('authSection');
        const appSection = document.getElementById('appSection');
        
        if (authSection && appSection) {
            appSection.classList.remove('active');
            authSection.classList.add('active');
            this.showLoginForm();
        }
    }

    showError(message) {
        alert(message);
    }

    showSuccess(message) {
        alert(message); // You might want to create a better UI for success messages
    }

    async handleForgotPassword() {
        const email = document.getElementById('loginEmail').value;
        if (!email) {
            this.showError('Please enter your email address');
            return;
        }

        try {
            await firebase.auth().sendPasswordResetEmail(email, this.actionCodeSettings);
            this.showSuccess('Password reset email sent. Please check your inbox.');
        } catch (error) {
            this.showError('Failed to send password reset email: ' + error.message);
        }
    }

    async resendVerificationEmail() {
        const user = firebase.auth().currentUser;
        if (user && !user.emailVerified) {
            try {
                await user.sendEmailVerification(this.actionCodeSettings);
                this.showSuccess('Verification email sent. Please check your inbox.');
            } catch (error) {
                this.showError('Failed to send verification email: ' + error.message);
            }
        }
    }

    async handleEmailVerificationLink(link) {
        try {
            if (firebase.auth().isSignInWithEmailLink(link)) {
                await firebase.auth().signInWithEmailLink(email, link);
                this.showSuccess('Email verified successfully!');
            }
        } catch (error) {
            this.showError('Failed to verify email: ' + error.message);
        }
    }

    async checkEmailVerification(user) {
        if (user && !user.emailVerified) {
            // You might want to show a banner or message in the UI
            console.log('Email not verified');
            this.showEmailVerificationBanner();
        } else {
            this.hideEmailVerificationBanner();
        }
    }

    showEmailVerificationBanner() {
        const banner = document.getElementById('emailVerificationBanner');
        if (banner) {
            banner.style.display = 'flex';
        }
    }

    hideEmailVerificationBanner() {
        const banner = document.getElementById('emailVerificationBanner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    async handleEmailLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            if (!user.emailVerified) {
                this.showError('Please verify your email before logging in.');
                await this.handleLogout();
                return;
            }

            console.log('User logged in:', user);
            
            // Update user profile with last login
            if (window.firestoreService) {
                await window.firestoreService.updateUserProgress(user.uid, {
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        } catch (error) {
            this.showError('Login failed: ' + error.message);
        }
    }
}

// Initialize Auth Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});