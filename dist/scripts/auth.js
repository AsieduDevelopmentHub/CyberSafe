class AuthManager {
    constructor() {
        // Prevent multiple instances
        if (window.authManagerInstance) {
            return window.authManagerInstance;
        }
        window.authManagerInstance = this;

        this.currentUser = null;
        this.actionCodeSettings = {
            url: 'https://cybersafe.auralenx.com/auth/verify.html',
            handleCodeInApp: true
        };
        
        // Track if listeners are already set up
        this.listenersInitialized = false;
        
        // Track event listeners for cleanup
        this.eventListeners = new Map();
        
        // Track last action timestamps to prevent duplicates
        this.lastActionTimestamps = {
            forgotPassword: 0,
            signup: 0,
            login: 0,
            googleSignIn: 0
        };
        
        this.init();
    }

    init() {
        // Check auth state and handle email verification
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.handleUserLogin(user);
                
                // Reload user to get latest email verification status
                user.reload().then(() => {
                    this.checkEmailVerification(user);
                });
            } else {
                this.handleUserLogout();
            }
        });

        // Handle email verification through URL
        this.handleEmailVerificationFromURL();

        // Form event listeners - only setup once
        if (!this.listenersInitialized) {
            this.setupEventListeners();
            this.listenersInitialized = true;
        }
    }

    // SINGLE EVENT LISTENER SETUP WITH DEBOUNCING
    setupEventListeners() {
        console.log('🔄 Setting up auth event listeners...');
        
        // Use event delegation to prevent multiple listeners
        document.addEventListener('click', (e) => {
            this.handleGlobalClick(e);
        });

        document.addEventListener('submit', (e) => {
            this.handleGlobalSubmit(e);
        });
    }

    handleGlobalClick(e) {
        const target = e.target;
        const now = Date.now();

        // Forgot Password
        if (target.id === 'forgotPassword' || target.closest('#forgotPassword')) {
            e.preventDefault();
            if (now - this.lastActionTimestamps.forgotPassword > 5000) {
                this.lastActionTimestamps.forgotPassword = now;
                this.handleForgotPassword();
            }
            return;
        }

        // Resend Verification
        if (target.id === 'resendVerification' || target.closest('#resendVerification')) {
            e.preventDefault();
            this.resendVerificationEmail();
            return;
        }

        // Google Sign In
        if (target.id === 'googleSignIn' || target.closest('#googleSignIn')) {
            if (now - this.lastActionTimestamps.googleSignIn > 2000) {
                this.lastActionTimestamps.googleSignIn = now;
                this.handleGoogleSignIn();
            }
            return;
        }

        // Google Sign Up
        if (target.id === 'googleSignUp' || target.closest('#googleSignUp')) {
            if (now - this.lastActionTimestamps.googleSignIn > 2000) {
                this.lastActionTimestamps.googleSignIn = now;
                this.handleGoogleSignIn();
            }
            return;
        }

        // Show Signup Form
        if (target.id === 'showSignup' || target.closest('#showSignup')) {
            e.preventDefault();
            this.showSignupForm();
            return;
        }

        // Show Login Form
        if (target.id === 'showLogin' || target.closest('#showLogin')) {
            e.preventDefault();
            this.showLoginForm();
            return;
        }

        // Logout
        if (target.id === 'logoutBtn' || target.closest('#logoutBtn')) {
            this.handleLogout();
            return;
        }
    }

    handleGlobalSubmit(e) {
        const form = e.target;
        const now = Date.now();

        // Login Form
        if (form.id === 'loginFormElement') {
            e.preventDefault();
            if (now - this.lastActionTimestamps.login > 2000) {
                this.lastActionTimestamps.login = now;
                this.handleEmailLogin();
            }
            return;
        }

        // Signup Form
        if (form.id === 'signupFormElement') {
            e.preventDefault();
            if (now - this.lastActionTimestamps.signup > 2000) {
                this.lastActionTimestamps.signup = now;
                this.handleEmailSignup();
            }
            return;
        }
    }

    // FIXED: Email verification URL handler
    async handleEmailVerificationFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const oobCode = urlParams.get('oobCode');

        if (mode === 'verifyEmail' && oobCode) {
            try {
                await firebase.auth().applyActionCode(oobCode);
                console.log('✅ Email verification successful via URL');
                
                this.showSuccess('Email verified successfully! You can now log in to your account.');
                
                // Refresh profile verification status if user is logged in
                const user = firebase.auth().currentUser;
                if (user) {
                    await user.reload();
                    await this.refreshProfileVerificationStatus();
                }
                
                window.history.replaceState({}, document.title, window.location.pathname);
                
                setTimeout(() => {
                    window.location.href = 'https://cybersafe.auralenx.com/#auth';
                }, 3000);
                
            } catch (error) {
                console.error('❌ Email verification failed:', error);
            }
        }
    }

    // FIXED: Email login with single execution
    async handleEmailLogin() {
        console.log('🔐 Login attempt');
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Disable login button temporarily
        const loginButton = document.querySelector('#loginFormElement button[type="submit"]');
        const originalText = loginButton ? loginButton.innerHTML : '';
        
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        }

        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // RELOAD USER to get latest verification status
            await user.reload();
            
            console.log('🔍 Post-reload verification status:', user.emailVerified);
            
            if (!user.emailVerified) {
                console.log('⚠️ User logged in but email not verified');
                this.showSuccess('Login successful! Please verify your email to access all features.');
                this.showEmailVerificationBanner();
            } else {
                console.log('✅ User logged in with verified email');
                this.hideEmailVerificationBanner();
            }

            // Update user profile with last login
            if (window.firestoreService) {
                await window.firestoreService.updateUserProgress(user.uid, {
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    emailVerified: user.emailVerified
                });
            }
            
        } catch (error) {
            this.showError('Login failed: ' + error.message);
        } finally {
            // Re-enable login button
            if (loginButton) {
                setTimeout(() => {
                    loginButton.disabled = false;
                    loginButton.innerHTML = originalText;
                }, 2000);
            }
        }
    }

    // Track signup attempts
    lastSignupAttempt = 0;
    signupAttempts = 0;
    
    async handleEmailSignup() {
        console.log('📝 Signup attempt');
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        // Check if we're within the rate limit
        const now = Date.now();
        if (now - this.lastSignupAttempt < 1000) {
            this.showError('Please wait a moment before trying again');
            return;
        }
        
        if (now - this.lastSignupAttempt > 300000) {
            this.signupAttempts = 0;
        }
        
        if (this.signupAttempts >= 5) {
            this.showError('Too many signup attempts. Please try again in 5 minutes');
            return;
        }

        this.lastSignupAttempt = now;
        this.signupAttempts++;

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError('Password should be at least 6 characters');
            return;
        }

        // Disable the signup button and show loading state
        const signupButton = document.querySelector('#signupFormElement button[type="submit"]');
        const originalText = signupButton ? signupButton.innerHTML : '';
        
        if (signupButton) {
            signupButton.disabled = true;
            signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        }

        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update profile
            await user.updateProfile({
                displayName: name
            });

            // Send verification email with proper settings
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

            this.showSuccess(`Account created! Verification email sent to ${email}. Please check your inbox and verify your email.`);
            
            // Auto-switch to login form after signup
            setTimeout(() => {
                this.showLoginForm();
                document.getElementById('loginEmail').value = email;
            }, 2000);
            
        } catch (error) {
            this.showError('Signup failed: ' + error.message);
        } finally {
            // Re-enable signup button after delay
            setTimeout(() => {
                if (signupButton) {
                    signupButton.disabled = false;
                    signupButton.innerHTML = originalText;
                }
            }, 3000);
        }
    }

    async handleGoogleSignIn() {
        console.log('🔐 Google sign-in attempt');
        
        // Disable Google buttons temporarily
        const googleButtons = document.querySelectorAll('#googleSignIn, #googleSignUp');
        googleButtons.forEach(btn => {
            if (btn) {
                btn.disabled = true;
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalHTML;
                }, 3000);
            }
        });

        try {
            const result = await firebase.auth().signInWithPopup(googleProvider);
            const user = result.user;
            
            console.log('🔐 Google user data:', {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified
            });

            // Check if user document exists
            if (window.firestoreService) {
                const userDoc = await window.firestoreService.getUserProfile(user.uid);
                if (!userDoc) {
                    await window.firestoreService.createUserProfile(user, {
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        emailVerified: user.emailVerified,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    await this.updateUserProfileData(user);
                }
            }
        } catch (error) {
            console.error('Google sign in failed:', error);
            this.showError('Google sign in failed: ' + error.message);
        }
    }

    // FIXED: Forgot password with robust click prevention
    async handleForgotPassword() {
        console.log('🔑 Forgot password attempt');
        
        const email = document.getElementById('loginEmail').value;
        if (!email) {
            this.showError('Please enter your email address');
            return;
        }

        // Disable the button and show loading
        const forgotPasswordBtn = document.getElementById('forgotPassword');
        const originalText = forgotPasswordBtn ? forgotPasswordBtn.innerHTML : '';
        
        if (forgotPasswordBtn) {
            forgotPasswordBtn.disabled = true;
            forgotPasswordBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        try {
            await firebase.auth().sendPasswordResetEmail(email, this.actionCodeSettings);
            this.showSuccess('Password reset email sent. Please check your inbox.');

            // Keep button disabled for 30 seconds to prevent spam
            setTimeout(() => {
                if (forgotPasswordBtn) {
                    forgotPasswordBtn.disabled = false;
                    forgotPasswordBtn.innerHTML = originalText;
                }
            }, 30000);
            
        } catch (error) {
            this.showError('Failed to send password reset email: ' + error.message);
            
            // Re-enable button on error after 5 seconds
            setTimeout(() => {
                if (forgotPasswordBtn) {
                    forgotPasswordBtn.disabled = false;
                    forgotPasswordBtn.innerHTML = originalText;
                }
            }, 5000);
        }
    }

    async handleLogout() {
        try {
            await firebase.auth().signOut();
            this.showSuccess('Logged out successfully');
        } catch (error) {
            this.showError('Logout failed: ' + error.message);
        }
    }

    handleUserLogin(user) {
        this.logUserData(user, 'handleUserLogin');
        this.currentUser = user;
        this.updateUIForUser(user);
        this.switchToApp();
        this.ensureUserProfile(user);
        
        // Check verification status but don't block access
        this.checkEmailVerification(user);
    }

    handleUserLogout() {
        this.currentUser = null;
        this.switchToAuth();
        this.hideEmailVerificationBanner();
    }

    async ensureUserProfile(user) {
        try {
            if (window.firestoreService) {
                const userDoc = await window.firestoreService.getUserProfile(user.uid);
                if (!userDoc) {
                    await window.firestoreService.createUserProfile(user, {
                        name: user.displayName,
                        email: user.email,
                        emailVerified: user.emailVerified
                    });
                } else {
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
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                emailVerified: user.emailVerified
            };
            
            if (user.email) updates.email = user.email;
            if (user.displayName) updates.name = user.displayName;
            if (user.photoURL) updates.photoURL = user.photoURL;
            
            await userRef.update(updates);
            console.log('✅ User profile updated with:', updates);
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    }

    updateUIForUser(user) {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const greeting = document.getElementById('greeting');
        const userAvatar = document.getElementById('userAvatar');
        const profileAvatar = document.getElementById('profileAvatar');

        console.log('🎯 Updating UI with user data:', {
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified
        });

        if (user.displayName && profileName) {
            profileName.textContent = user.displayName;
        } else if (user.email && profileName) {
            profileName.textContent = user.email.split('@')[0];
        }

        if (user.email && profileEmail) {
            profileEmail.textContent = user.email;
        } else {
            this.fetchUserEmailFromFirestore(user.uid, profileEmail);
        }

        if (greeting) {
            const userName = user.displayName ? user.displayName.split(' ')[0] : 
                            user.email ? user.email.split('@')[0] : 'User';
            greeting.textContent = `Welcome back, ${userName}!`;
        }

        this.updateUserAvatar(user, userAvatar, profileAvatar);
        this.updateVerificationStatusUI(user.emailVerified);
    }

    async fetchUserEmailFromFirestore(uid, profileEmailElement) {
        try {
            if (window.firestoreService && profileEmailElement) {
                const userData = await window.firestoreService.getUserProfile(uid);
                if (userData && userData.email) {
                    profileEmailElement.textContent = userData.email;
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
            const name = user.displayName || user.email || 'User';
            const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A1F44&color=fff`;
            if (userAvatar) userAvatar.src = defaultAvatar;
            if (profileAvatar) profileAvatar.src = defaultAvatar;
        }
    }

    updateVerificationStatusUI(isVerified) {
        const verificationBadge = document.getElementById('emailVerificationBadge');
        if (verificationBadge) {
            if (isVerified) {
                verificationBadge.innerHTML = '✅ Email Verified';
                verificationBadge.style.color = '#38a169';
            } else {
                verificationBadge.innerHTML = '⚠️ Email Not Verified';
                verificationBadge.style.color = '#d69e2e';
            }
        }
    }

    logUserData(user, source) {
        console.log(`🔍 User Data from ${source}:`, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL
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
        console.error('❌ Error:', message);
        // Replace with your toast notification system
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    showSuccess(message) {
        console.log('✅ Success:', message);
        // Replace with your toast notification system
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        } else {
            alert(message);
        }
    }

    async resendVerificationEmail() {
        const user = firebase.auth().currentUser;
        if (user) {
            try {
                await user.sendEmailVerification(this.actionCodeSettings);
                this.showSuccess(`Verification email sent to ${user.email}. Please check your inbox.`);
            } catch (error) {
                this.showError('Failed to send verification email: ' + error.message);
            }
        } else {
            this.showError('Please log in to resend verification email.');
        }
    }

    async checkEmailVerification(user) {
        console.log('🔍 Checking email verification for:', user.email);
        console.log('📧 Current verification status:', user.emailVerified);
        
        if (user && !user.emailVerified) {
            console.log('⚠️ Email not verified - showing banner');
            this.showEmailVerificationBanner();
            this.handleUnverifiedAccess();
        } else {
            console.log('✅ Email verified - hiding banner');
            this.hideEmailVerificationBanner();
            this.handleVerifiedAccess();
        }
    }

    async refreshProfileVerificationStatus() {
        const user = firebase.auth().currentUser;
        if (user && window.profileManager) {
            await user.reload();
            window.profileManager.updateEmailVerificationStatus(user);
        }
    }

    handleUnverifiedAccess() {
        const restrictedElements = document.querySelectorAll('[data-requires-verification]');
        restrictedElements.forEach(element => {
            element.style.opacity = '0.5';
            element.style.pointerEvents = 'none';
        });
    }

    handleVerifiedAccess() {
        const restrictedElements = document.querySelectorAll('[data-requires-verification]');
        restrictedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.pointerEvents = 'auto';
        });
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
}

// SINGLETON PATTERN - Only one instance allowed
let authManagerInstance = null;

function initializeAuthManager() {
    if (!authManagerInstance) {
        authManagerInstance = new AuthManager();
        window.authManager = authManagerInstance;
    }
    return authManagerInstance;
}

// Initialize only once when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuthManager);
} else {
    initializeAuthManager();
}