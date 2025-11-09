// COMPLETE FIXED AUTH MANAGER - auth.js
class AuthManager {
    constructor() {
        if (AuthManager.instance) {
            return AuthManager.instance;
        }
        AuthManager.instance = this;

        console.log('🔧 AuthManager Constructor Started');
        this.currentUser = null;
        this.isInitialized = false;
        
        // Google provider setup
        this.googleProvider = new firebase.auth.GoogleAuthProvider();
        this.googleProvider.addScope('email');
        this.googleProvider.addScope('profile');
        this.googleProvider.setCustomParameters({
            prompt: 'select_account'
        });
        
        this.actionCodeSettings = {
            url: window.location.origin + '/auth/verify.html',
            handleCodeInApp: true
        };
        
        this.init();
    }

    async init() {
        if (this.isInitialized) {
            console.log('🔄 AuthManager already initialized');
            return;
        }

        console.log('🚀 AuthManager init started');
        
        try {
            // Test Firebase availability
            await this.testFirebase();
            
            // Setup auth state listener
            this.setupAuthStateListener();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Handle email verification from URL
            this.handleEmailVerificationFromURL();
            
            this.isInitialized = true;
            console.log('✅ AuthManager initialized successfully');
            
        } catch (error) {
            console.error('❌ AuthManager init failed:', error);
            this.showError('Auth initialization failed: ' + error.message);
        }
    }

    async testFirebase() {
        console.log('🧪 Testing Firebase...');
        
        if (typeof firebase === 'undefined') {
            throw new Error('Firebase is not loaded. Check your script tags.');
        }
        
        if (typeof firebase.auth !== 'function') {
            throw new Error('Firebase Auth is not available.');
        }
        
        try {
            const auth = firebase.auth();
            console.log('✅ Firebase Auth accessible');
            
            const currentUser = auth.currentUser;
            console.log('🔍 Current user:', currentUser);
            
            return true;
        } catch (error) {
            throw new Error('Firebase Auth test failed: ' + error.message);
        }
    }

    setupAuthStateListener() {
        console.log('🔧 Setting up auth state listener...');
        
        try {
            firebase.auth().onAuthStateChanged((user) => {
                console.log('🔄 Auth state changed:', user ? user.email : 'No user');
                this.currentUser = user;
                
                if (user) {
                    this.handleUserLogin(user);
                } else {
                    this.handleUserLogout();
                }
            });
            console.log('✅ Auth state listener setup complete');
        } catch (error) {
            console.error('❌ Auth state listener setup failed:', error);
        }
    }

    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Remove any existing listeners first
        this.removeEventListeners();
        
        // Store references to handlers for cleanup
        this.handlers = {};

        // Login form
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            this.handlers.loginForm = (e) => {
                e.preventDefault();
                this.handleEmailLogin();
            };
            loginForm.addEventListener('submit', this.handlers.loginForm);
            console.log('✅ Login form listener added');
        }

        // Signup form
        const signupForm = document.getElementById('signupFormElement');
        if (signupForm) {
            this.handlers.signupForm = (e) => {
                e.preventDefault();
                this.handleEmailSignup();
            };
            signupForm.addEventListener('submit', this.handlers.signupForm);
            console.log('✅ Signup form listener added');
        }

        // Google Sign In buttons - FIXED: Enhanced detection
        this.setupGoogleAuthListeners();

        // Logout button - FIXED: Enhanced detection
        this.setupLogoutListeners();

        // Forgot password
        const forgotPassword = document.getElementById('forgotPassword');
        if (forgotPassword) {
            this.handlers.forgotPassword = (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            };
            forgotPassword.addEventListener('click', this.handlers.forgotPassword);
            console.log('✅ Forgot password listener added');
        }

        // Resend verification
        const resendVerification = document.getElementById('resendVerification');
        if (resendVerification) {
            this.handlers.resendVerification = (e) => {
                e.preventDefault();
                this.resendVerificationEmail();
            };
            resendVerification.addEventListener('click', this.handlers.resendVerification);
            console.log('✅ Resend verification listener added');
        }

        // Form switching
        const showSignup = document.getElementById('showSignup');
        if (showSignup) {
            this.handlers.showSignup = (e) => {
                e.preventDefault();
                this.showSignupForm();
            };
            showSignup.addEventListener('click', this.handlers.showSignup);
        }

        const showLogin = document.getElementById('showLogin');
        if (showLogin) {
            this.handlers.showLogin = (e) => {
                e.preventDefault();
                this.showLoginForm();
            };
            showLogin.addEventListener('click', this.handlers.showLogin);
        }

        console.log('✅ All event listeners setup complete');
    }

    setupGoogleAuthListeners() {
        console.log('🔧 Setting up Google auth listeners...');
        
        // Try multiple possible button IDs and selectors
        const googleSelectors = [
            '#googleSignIn',
            '#googleSignUp',
            '.google-signin-btn',
            '.google-signup-btn',
            '.google-auth-btn',
            '.btn-google',
            '[data-provider="google"]',
            'button[onclick*="google"]',
            'button[class*="google"]'
        ];

        googleSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                if (!element.hasAttribute('data-auth-listener')) {
                    const handler = () => {
                        console.log(`🔐 Google auth button clicked: ${selector}`);
                        this.handleGoogleSignIn();
                    };
                    element.addEventListener('click', handler);
                    element.setAttribute('data-auth-listener', 'true');
                    this.handlers[`google_${selector}_${index}`] = { element, handler };
                    console.log(`✅ Google auth listener added: ${selector}`);
                }
            });
        });

        // Also check for specific IDs
        const specificIds = ['googleSignIn', 'googleSignUp'];
        specificIds.forEach(id => {
            const element = document.getElementById(id);
            if (element && !element.hasAttribute('data-auth-listener')) {
                const handler = () => {
                    console.log(`🔐 Google auth button clicked: ${id}`);
                    this.handleGoogleSignIn();
                };
                element.addEventListener('click', handler);
                element.setAttribute('data-auth-listener', 'true');
                this.handlers[`google_${id}`] = { element, handler };
                console.log(`✅ Google auth listener added: ${id}`);
            }
        });
    }

    setupLogoutListeners() {
        console.log('🔧 Setting up logout listeners...');
        
        // Try multiple possible button IDs and selectors
        const logoutSelectors = [
            '#logoutBtn',
            '.logout-btn',
            '.btn-logout',
            '.signout-btn',
            '.btn-signout',
            '[data-action="logout"]',
            '[data-action="signout"]',
            'button[onclick*="logout"]',
            'button[onclick*="signout"]',
            'button[class*="logout"]',
            'button[class*="signout"]'
        ];

        logoutSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                if (!element.hasAttribute('data-auth-listener')) {
                    const handler = () => {
                        console.log(`🚪 Logout button clicked: ${selector}`);
                        this.handleLogout();
                    };
                    element.addEventListener('click', handler);
                    element.setAttribute('data-auth-listener', 'true');
                    this.handlers[`logout_${selector}_${index}`] = { element, handler };
                    console.log(`✅ Logout listener added: ${selector}`);
                }
            });
        });

        // Also check for specific ID
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn && !logoutBtn.hasAttribute('data-auth-listener')) {
            const handler = () => {
                console.log('🚪 Logout button clicked: #logoutBtn');
                this.handleLogout();
            };
            logoutBtn.addEventListener('click', handler);
            logoutBtn.setAttribute('data-auth-listener', 'true');
            this.handlers.logoutBtn = { element: logoutBtn, handler };
            console.log('✅ Logout listener added: #logoutBtn');
        }
    }

    removeEventListeners() {
        console.log('🧹 Cleaning up existing event listeners...');
        
        if (this.handlers) {
            Object.values(this.handlers).forEach(({ element, handler }) => {
                if (element && handler) {
                    element.removeEventListener('click', handler);
                    element.removeAttribute('data-auth-listener');
                }
            });
            this.handlers = {};
        }
    }

    async handleEmailLogin() {
        console.log('🔐 Starting login...');
        
        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        
        console.log('📧 Email:', email);
        
        if (!email || !password) {
            this.showError('Please enter both email and password');
            return;
        }

        const loginButton = document.querySelector('#loginFormElement button[type="submit"]');
        this.setButtonState(loginButton, true, 'Signing in...');

        try {
            console.log('🔄 Calling Firebase signInWithEmailAndPassword...');
            
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log('✅ Login successful!', user.email);
            
            // Update user profile if firestore service exists
            if (window.firestoreService) {
                try {
                    await window.firestoreService.updateUserProgress(user.uid, {
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                        emailVerified: user.emailVerified
                    });
                } catch (firestoreError) {
                    console.warn('Firestore update failed:', firestoreError);
                }
            }
            
            this.showSuccess('Login successful! Welcome ' + (user.displayName || user.email));
            
        } catch (error) {
            console.error('❌ Login error:', error);
            this.handleAuthError(error, 'login');
        } finally {
            this.setButtonState(loginButton, false, 'Sign In');
        }
    }

    async handleEmailSignup() {
        console.log('📝 Starting signup...');
        
        const name = document.getElementById('signupName')?.value;
        const email = document.getElementById('signupEmail')?.value;
        const password = document.getElementById('signupPassword')?.value;
        const confirmPassword = document.getElementById('signupConfirmPassword')?.value;

        if (!name || !email || !password || !confirmPassword) {
            this.showError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError('Password should be at least 6 characters');
            return;
        }

        const signupButton = document.querySelector('#signupFormElement button[type="submit"]');
        this.setButtonState(signupButton, true, 'Creating account...');

        try {
            console.log('🔄 Calling Firebase createUserWithEmailAndPassword...');
            
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            console.log('✅ Signup successful! User created:', user.email);
            
            // Update profile with display name
            await user.updateProfile({
                displayName: name
            });
            
            // Send verification email
            await user.sendEmailVerification(this.actionCodeSettings);
            
            // Create user document if firestore service exists
            if (window.firestoreService) {
                try {
                    await window.firestoreService.createUserProfile(user, { 
                        name: name,
                        email: email,
                        emailVerified: false,
                        authProvider: 'email',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } catch (firestoreError) {
                    console.warn('Firestore creation failed:', firestoreError);
                }
            }
            
            this.showSuccess('Account created! Please check your email for verification.');
            
            // Switch to login form
            setTimeout(() => {
                this.showLoginForm();
                document.getElementById('loginEmail').value = email;
            }, 1000);
            
        } catch (error) {
            console.error('❌ Signup error:', error);
            this.handleAuthError(error, 'signup');
        } finally {
            this.setButtonState(signupButton, false, 'Create Account');
        }
    }

    async handleGoogleSignIn() {
        console.log('🔐 Starting Google sign-in...');
        
        // Disable Google buttons
        this.setGoogleButtonsState(true, 'Connecting...');

        try {
            console.log('🔄 Starting Google OAuth popup...');
            
            this.showInfo('Opening Google sign-in window... Please allow popups if blocked.');
            
            // Small delay to ensure user sees the message
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const result = await this.withTimeout(
                firebase.auth().signInWithPopup(this.googleProvider),
                45000 // 45 second timeout
            );
            
            const user = result.user;
            console.log('✅ Google sign-in successful:', user.email);
            
            // Handle user profile
            await this.handleOAuthUserProfile(user);
            
            this.showSuccess('Welcome, ' + (user.displayName || user.email) + '!');
            
        } catch (error) {
            console.error('❌ Google sign in failed:', error);
            this.handleGoogleSignInError(error);
        } finally {
            this.setGoogleButtonsState(false, 'Continue with Google');
        }
    }

    async handleOAuthUserProfile(user) {
        try {
            console.log('👤 Processing OAuth user profile...');
            
            if (window.firestoreService) {
                const userDoc = await window.firestoreService.getUserProfile(user.uid);
                if (!userDoc) {
                    console.log('📝 Creating new user profile for OAuth user');
                    await window.firestoreService.createUserProfile(user, {
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        emailVerified: user.emailVerified,
                        authProvider: 'google',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    console.log('🔄 Updating existing user profile');
                    await this.updateUserProfileData(user);
                }
            }
        } catch (profileError) {
            console.error('Error handling OAuth user profile:', profileError);
        }
    }

    async handleLogout() {
        console.log('🚪 Starting logout...');
        
        // FIXED: Show confirmation first, then success message after logout
        const shouldLogout = await this.showConfirm('Are you sure you want to log out?');
        
        if (!shouldLogout) {
            console.log('❌ Logout cancelled by user');
            return;
        }

        try {
            await firebase.auth().signOut();
            console.log('✅ Logout successful');
            this.showSuccess('Logged out successfully'); // This shows AFTER confirmation
        } catch (error) {
            console.error('❌ Logout error:', error);
            this.showError('Logout failed: ' + error.message);
        }
    }

    async handleForgotPassword() {
        const email = document.getElementById('loginEmail')?.value;
        
        if (!email) {
            this.showError('Please enter your email address');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        const shouldSend = await this.showConfirm(`Send password reset email to:\n${email}\n\nAre you sure?`);
        
        if (!shouldSend) {
            return;
        }

        const forgotPasswordBtn = document.getElementById('forgotPassword');
        this.setButtonState(forgotPasswordBtn, true, 'Sending...');

        try {
            console.log('📧 Sending password reset email to:', email);
            await firebase.auth().sendPasswordResetEmail(email, this.actionCodeSettings);
            this.showSuccess('Password reset email sent! Please check your inbox.');
            
            setTimeout(() => {
                this.setButtonState(forgotPasswordBtn, false, 'Forgot Password?');
            }, 30000);
            
        } catch (error) {
            console.error('Password reset error:', error);
            this.handleAuthError(error, 'password reset');
            setTimeout(() => {
                this.setButtonState(forgotPasswordBtn, false, 'Forgot Password?');
            }, 5000);
        }
    }

    async resendVerificationEmail() {
        const user = firebase.auth().currentUser;
        if (!user) {
            this.showError('Please log in to resend verification email.');
            return;
        }

        if (user.emailVerified) {
            this.showSuccess('Your email is already verified.');
            return;
        }

        const shouldResend = await this.showConfirm(`Resend verification email to:\n${user.email}\n\nAre you sure?`);
        
        if (!shouldResend) {
            return;
        }

        try {
            await user.sendEmailVerification(this.actionCodeSettings);
            this.showSuccess('Verification email sent! Please check your inbox.');
        } catch (error) {
            console.error('Resend verification error:', error);
            this.showError('Failed to send verification email: ' + error.message);
        }
    }

    handleEmailVerificationFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const oobCode = urlParams.get('oobCode');

        if (mode === 'verifyEmail' && oobCode) {
            this.applyEmailVerification(oobCode);
        }
    }

    async applyEmailVerification(oobCode) {
        try {
            this.showInfo('Verifying your email... Please wait.');
            await firebase.auth().applyActionCode(oobCode);
            this.showSuccess('Email verified successfully! You can now log in.');
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
            console.error('Email verification failed:', error);
            this.showError('Email verification failed. The link may have expired.');
        }
    }

    // UI Methods (using your custom alert/confirm system)
    showError(message) {
        console.error('❌ Error:', message);
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            alert('❌ ' + message); // Fallback
        }
    }

    showSuccess(message) {
        console.log('✅ Success:', message);
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        } else {
            alert('✅ ' + message); // Fallback
        }
    }

    showInfo(message) {
        console.log('🔔 Info:', message);
        if (typeof showNotification === 'function') {
            showNotification(message, 'info');
        } else {
            alert('🔔 ' + message); // Fallback
        }
    }

    async showConfirm(message) {
        console.log('❓ Confirm:', message);
        if (typeof showConfirmDialog === 'function') {
            return new Promise((resolve) => {
                showConfirmDialog(message, resolve);
            });
        } else {
            return confirm(message); // Fallback
        }
    }

    // ... (rest of the methods remain the same - handleUserLogin, handleUserLogout, updateUIForUser, etc.)

    handleUserLogin(user) {
        console.log('👤 User logged in:', user.email);
        this.currentUser = user;
        this.updateUIForUser(user);
        this.switchToApp();
        this.updateEmailVerificationStatus(user);
    }

    handleUserLogout() {
        console.log('👤 User logged out');
        this.currentUser = null;
        this.switchToAuth();
        this.hideEmailVerificationBanner();
    }

    updateUIForUser(user) {
        // Update profile name
        const profileName = document.getElementById('profileName');
        if (profileName) {
            profileName.textContent = user.displayName || user.email.split('@')[0];
        }

        // Update profile email
        const profileEmail = document.getElementById('profileEmail');
        if (profileEmail) {
            profileEmail.textContent = user.email;
        }

        // Update greeting
        const greeting = document.getElementById('greeting');
        if (greeting) {
            const userName = user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0];
            greeting.textContent = `Welcome back, ${userName}!`;
        }

        // Update avatars
        this.updateUserAvatar(user);
    }

    updateUserAvatar(user) {
        const avatarUrl = user.photoURL || 
                         `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=0A1F44&color=fff`;
        
        const avatars = ['userAvatar', 'profileAvatar'];
        avatars.forEach(avatarId => {
            const avatar = document.getElementById(avatarId);
            if (avatar) avatar.src = avatarUrl;
        });
    }

    updateEmailVerificationStatus(user) {
        const verificationStatus = document.getElementById('emailVerificationStatus');
        const verifyEmailBtn = document.getElementById('verifyEmailBtn');
        
        if (!verificationStatus || !verifyEmailBtn) return;

        if (user.emailVerified) {
            verificationStatus.className = 'verification-badge verified';
            verificationStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Email verified</span>';
            verifyEmailBtn.style.display = 'none';
            this.hideEmailVerificationBanner();
        } else {
            verificationStatus.className = 'verification-badge unverified';
            verificationStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Email not verified</span>';
            verifyEmailBtn.style.display = 'inline-flex';
            this.showEmailVerificationBanner();
        }
    }

    showEmailVerificationBanner() {
        const banner = document.getElementById('emailVerificationBanner');
        if (banner) banner.style.display = 'flex';
    }

    hideEmailVerificationBanner() {
        const banner = document.getElementById('emailVerificationBanner');
        if (banner) banner.style.display = 'none';
    }

    showLoginForm() {
        this.toggleForm('loginForm', 'signupForm');
    }

    showSignupForm() {
        this.toggleForm('signupForm', 'loginForm');
    }

    toggleForm(showId, hideId) {
        const showForm = document.getElementById(showId);
        const hideForm = document.getElementById(hideId);
        if (showForm && hideForm) {
            showForm.classList.add('active');
            hideForm.classList.remove('active');
        }
    }

    switchToApp() {
        console.log('🔄 Switching to app section...');
        const authSection = document.getElementById('authSection');
        const appSection = document.getElementById('appSection');
        if (authSection && appSection) {
            authSection.classList.remove('active');
            appSection.classList.add('active');
        }
    }

    switchToAuth() {
        console.log('🔄 Switching to auth section...');
        const authSection = document.getElementById('authSection');
        const appSection = document.getElementById('appSection');
        if (authSection && appSection) {
            appSection.classList.remove('active');
            authSection.classList.add('active');
            this.showLoginForm();
        }
    }

    // Utility Methods
    setGoogleButtonsState(disabled, text) {
        const googleSelectors = [
            '#googleSignIn',
            '#googleSignUp',
            '.google-signin-btn',
            '.google-signup-btn',
            '.google-auth-btn',
            '.btn-google',
            '[data-provider="google"]'
        ];

        googleSelectors.forEach(selector => {
            const buttons = document.querySelectorAll(selector);
            buttons.forEach(btn => {
                if (btn) {
                    btn.disabled = disabled;
                    if (disabled) {
                        btn.dataset.originalHtml = btn.innerHTML;
                        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
                    } else if (btn.dataset.originalHtml) {
                        btn.innerHTML = btn.dataset.originalHtml;
                    }
                }
            });
        });
    }

    setButtonState(button, disabled, text) {
        if (button) {
            button.disabled = disabled;
            if (disabled) {
                button.dataset.originalText = button.textContent;
                button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
            } else if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            }
        }
    }

    handleAuthError(error, type) {
        let errorMessage = type === 'login' ? 'Login failed: ' : 
                          type === 'signup' ? 'Signup failed: ' : 
                          'Authentication failed: ';
        
        switch (error.code) {
            case 'auth/invalid-email': errorMessage += 'Invalid email address'; break;
            case 'auth/user-disabled': errorMessage += 'This account has been disabled'; break;
            case 'auth/user-not-found': errorMessage += 'No account found with this email'; break;
            case 'auth/wrong-password': errorMessage += 'Incorrect password'; break;
            case 'auth/email-already-in-use': errorMessage += 'An account with this email already exists'; break;
            case 'auth/operation-not-allowed': errorMessage += 'Email/password accounts are not enabled'; break;
            case 'auth/weak-password': errorMessage += 'Password is too weak'; break;
            case 'auth/too-many-requests': errorMessage += 'Too many attempts. Please try again later'; break;
            case 'auth/network-request-failed': errorMessage += 'Network error. Check your connection'; break;
            default: errorMessage += error.message;
        }
        
        this.showError(errorMessage);
    }
    
    // In AuthManager class - add this method if missing
onAuthStateChanged(listener) {
    this.authStateListeners.push(listener);
    
    // Immediately call with current user if available
    if (this.currentUser) {
        setTimeout(() => listener(this.currentUser), 0);
    }
    
    // Return unsubscribe function
    return () => {
        const index = this.authStateListeners.indexOf(listener);
        if (index > -1) {
            this.authStateListeners.splice(index, 1);
        }
    };
}

    handleGoogleSignInError(error) {
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                console.log('User closed the popup window');
                break;
            case 'auth/popup-blocked':
                this.showError('Popup blocked! Please allow popups for this site.');
                break;
            case 'auth/unauthorized-domain':
                this.showError('Domain not authorized! Please contact support.');
                break;
            case 'auth/network-request-failed':
                this.showError('Network error! Please check your internet connection.');
                break;
            case 'auth/operation-not-allowed':
                this.showError('Google sign-in not enabled! Please contact support.');
                break;
            default:
                this.showError('Google sign-in failed! Error: ' + (error.message || 'Unknown error'));
        }
    }

    withTimeout(promise, timeoutMs) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new Error('Operation timed out. Please try again.'));
            }, timeoutMs);

            promise.then(resolve, reject).finally(() => {
                clearTimeout(timeoutId);
            });
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async updateUserProfileData(user) {
        if (!window.firestoreService) return;
        
        try {
            const updates = {
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                emailVerified: user.emailVerified
            };
            
            if (user.email) updates.email = user.email;
            if (user.displayName) updates.name = user.displayName;
            if (user.photoURL) updates.photoURL = user.photoURL;
            
            await window.firestoreService.updateUserProgress(user.uid, updates);
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    }
}

// Singleton pattern
AuthManager.instance = null;

function initializeAuthManager() {
    if (!AuthManager.instance) {
        console.log('🚀 Initializing AuthManager...');
        try {
            AuthManager.instance = new AuthManager();
            window.authManager = AuthManager.instance;
        } catch (error) {
            console.error('❌ Failed to create AuthManager:', error);
            // Use custom error notification if available
            if (typeof showNotification === 'function') {
                showNotification('Authentication system failed to initialize.', 'error');
            } else {
                alert('❌ Authentication system failed to initialize.');
            }
        }
    }
    return AuthManager.instance;
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuthManager);
} else {
    initializeAuthManager();
}

// Global access
window.AuthManager = AuthManager;
window.initializeAuthManager = initializeAuthManager;