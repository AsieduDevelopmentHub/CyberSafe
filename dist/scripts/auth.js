class AuthManager {
    constructor() {
        // Prevent multiple instances
        if (window.authManagerInstance) {
            return window.authManagerInstance;
        }
        window.authManagerInstance = this;

        this.currentUser = null;
        this.actionCodeSettings = {
            url: window.location.origin + '/auth/verify.html',
            handleCodeInApp: true
        };
        
        // Simple Google provider setup
        this.googleProvider = new firebase.auth.GoogleAuthProvider();
        this.googleProvider.addScope('email');
        this.googleProvider.addScope('profile');
        
        this.init();
    }

    init() {
        console.log('🚀 AuthManager initializing...');
        
        // Simple auth state listener
        firebase.auth().onAuthStateChanged((user) => {
            console.log('🔄 Auth state changed:', user ? user.email : 'No user');
            
            if (user) {
                this.handleUserLogin(user);
            } else {
                this.handleUserLogout();
            }
        });

        // Handle email verification through URL
        this.handleEmailVerificationFromURL();

        // Form event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        console.log('🔄 Setting up auth event listeners...');
        
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

        // Google sign in - SIMPLE POPUP APPROACH
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

    // Handle email verification from URL
    async handleEmailVerificationFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const oobCode = urlParams.get('oobCode');

        if (mode === 'verifyEmail' && oobCode) {
            try {
                await firebase.auth().applyActionCode(oobCode);
                console.log('✅ Email verification successful via URL');
                
                this.showSuccess('Email verified successfully! You can now log in to your account.');
                
                // Clear the URL parameters
                window.history.replaceState({}, document.title, window.location.pathname);
                
            } catch (error) {
                console.error('❌ Email verification failed:', error);
                this.showError('Email verification failed. The link may have expired or already been used.');
            }
        }
    }

    async handleEmailLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            this.showError('Please enter both email and password');
            return;
        }

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
            
            console.log('✅ User logged in:', user.email);
            
            // Update user profile with last login
            if (window.firestoreService) {
                await window.firestoreService.updateUserProgress(user.uid, {
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    emailVerified: user.emailVerified
                });
            }

            // Check email verification status
            this.updateEmailVerificationStatus(user);
            
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed: ';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage += 'Invalid email address';
                    break;
                case 'auth/user-disabled':
                    errorMessage += 'This account has been disabled';
                    break;
                case 'auth/user-not-found':
                    errorMessage += 'No account found with this email';
                    break;
                case 'auth/wrong-password':
                    errorMessage += 'Incorrect password';
                    break;
                default:
                    errorMessage += error.message;
            }
            
            this.showError(errorMessage);
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

    async handleEmailSignup() {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

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

            this.showSuccess(`Account created! Verification email sent to ${email}. Please check your inbox and verify your email.`);
            
            // Auto-switch to login form after signup
            setTimeout(() => {
                this.showLoginForm();
                document.getElementById('loginEmail').value = email;
            }, 2000);
            
        } catch (error) {
            console.error('Signup error:', error);
            let errorMessage = 'Signup failed: ';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage += 'An account with this email already exists';
                    break;
                case 'auth/invalid-email':
                    errorMessage += 'Invalid email address';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage += 'Email/password accounts are not enabled';
                    break;
                case 'auth/weak-password':
                    errorMessage += 'Password is too weak';
                    break;
                default:
                    errorMessage += error.message;
            }
            
            this.showError(errorMessage);
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

    // SIMPLE Google Sign In with popup
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
                }, 5000);
            }
        });

        try {
            // Use simple popup method
            const result = await firebase.auth().signInWithPopup(this.googleProvider);
            const user = result.user;
            
            console.log('✅ Google sign-in successful:', user.email);

            // Handle user profile
            await this.handleOAuthUserProfile(user);
            
            this.showSuccess(`Welcome, ${user.displayName || user.email}!`);
            
        } catch (error) {
            console.error('❌ Google sign in failed:', error);
            
            let errorMessage = 'Google sign in failed: ';
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign in was cancelled.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Sign in popup was blocked. Please allow popups for this site.';
            } else {
                errorMessage += error.message;
            }
            
            this.showError(errorMessage);
            
            // Re-enable buttons on error
            const googleButtons = document.querySelectorAll('#googleSignIn, #googleSignUp');
            googleButtons.forEach(btn => {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = 'Continue with Google';
                }
            });
        }
    }

    // Handle OAuth user profile creation/update
    async handleOAuthUserProfile(user) {
        try {
            console.log('👤 Processing OAuth user profile...');
            
            // Check if user document exists
            if (window.firestoreService) {
                const userDoc = await window.firestoreService.getUserProfile(user.uid);
                if (!userDoc) {
                    console.log('📝 Creating new user profile for Google user');
                    await window.firestoreService.createUserProfile(user, {
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        emailVerified: user.emailVerified,
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

    async handleForgotPassword() {
        const email = document.getElementById('loginEmail').value;
        if (!email) {
            this.showError('Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('Please enter a valid email address');
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
            console.log('📧 Sending password reset email to:', email);
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
            console.error('Password reset error:', error);
            
            let errorMessage = 'Failed to send password reset email: ';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage += 'Invalid email address';
                    break;
                case 'auth/user-not-found':
                    errorMessage += 'No account found with this email';
                    break;
                case 'auth/too-many-requests':
                    errorMessage += 'Too many attempts. Please try again later';
                    break;
                default:
                    errorMessage += error.message;
            }
            
            this.showError(errorMessage);
            
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
            console.error('Logout error:', error);
            this.showError('Logout failed: ' + error.message);
        }
    }

    handleUserLogin(user) {
        console.log('👤 User logged in:', user.email);
        this.currentUser = user;
        this.updateUIForUser(user);
        this.switchToApp();
        this.ensureUserProfile(user);
        
        // Update verification status
        this.updateEmailVerificationStatus(user);
    }

    handleUserLogout() {
        console.log('👤 User logged out');
        this.currentUser = null;
        this.switchToAuth();
        this.hideEmailVerificationBanner();
    }

    async ensureUserProfile(user) {
        try {
            if (window.firestoreService) {
                const userDoc = await window.firestoreService.getUserProfile(user.uid);
                if (!userDoc) {
                    console.log('📝 Creating user profile for:', user.email);
                    await window.firestoreService.createUserProfile(user, {
                        name: user.displayName,
                        email: user.email,
                        emailVerified: user.emailVerified
                    });
                } else {
                    console.log('🔄 Updating user profile for:', user.email);
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
        this.updateEmailVerificationStatus(user);
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

    updateEmailVerificationStatus(user) {
        const verificationStatus = document.getElementById('emailVerificationStatus');
        const verifyEmailBtn = document.getElementById('verifyEmailBtn');
        
        if (!verificationStatus || !verifyEmailBtn) return;

        if (user.emailVerified) {
            verificationStatus.className = 'verification-badge verified';
            verificationStatus.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span class="status-text">Email verified</span>
            `;
            verifyEmailBtn.style.display = 'none';
            this.hideEmailVerificationBanner();
        } else {
            verificationStatus.className = 'verification-badge unverified';
            verificationStatus.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span class="status-text">Email not verified</span>
            `;
            verifyEmailBtn.style.display = 'inline-flex';
            this.showEmailVerificationBanner();
        }
    }

    async resendVerificationEmail() {
        const user = firebase.auth().currentUser;
        if (user) {
            try {
                await user.sendEmailVerification(this.actionCodeSettings);
                this.showSuccess(`Verification email sent to ${user.email}. Please check your inbox.`);
            } catch (error) {
                console.error('Resend verification error:', error);
                this.showError('Failed to send verification email: ' + error.message);
            }
        } else {
            this.showError('Please log in to resend verification email.');
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
        console.log('🔄 Switching to app section...');
        const authSection = document.getElementById('authSection');
        const appSection = document.getElementById('appSection');
        
        if (authSection && appSection) {
            authSection.classList.remove('active');
            appSection.classList.add('active');
            
            // Update URL to remove #auth hash
            if (window.location.hash === '#auth') {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
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

    showError(message) {
        console.error('❌ Error:', message);
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    showSuccess(message) {
        console.log('✅ Success:', message);
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        } else {
            alert(message);
        }
    }
}

// SINGLETON PATTERN
let authManagerInstance = null;

function initializeAuthManager() {
    if (!authManagerInstance) {
        console.log('🚀 Initializing AuthManager...');
        authManagerInstance = new AuthManager();
        window.authManager = authManagerInstance;
    }
    return authManagerInstance;
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuthManager);
} else {
    initializeAuthManager();
}