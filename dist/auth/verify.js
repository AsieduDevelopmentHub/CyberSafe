// DOM Elements
const loadingState = document.getElementById('loadingState');
const successState = document.getElementById('successState');
const errorState = document.getElementById('errorState');
const alreadyVerifiedState = document.getElementById('alreadyVerifiedState');
const errorMessage = document.getElementById('errorMessage');
const resendBtn = document.getElementById('resendBtn');

// Check URL for mode and oobCode
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const oobCode = urlParams.get('oobCode');
const continueUrl = urlParams.get('continueUrl') || 'https://cybersafe.auralenx.com/success.html';

// Initialize verification
document.addEventListener('DOMContentLoaded', function() {
    if (!mode || !oobCode || mode !== 'verifyEmail') {
        showError('Invalid or expired verification link. Please request a new verification email.');
        return;
    }
    
    verifyEmail(oobCode);
});

async function verifyEmail(oobCode) {
    try {
        // Apply the verification code
        await firebase.auth().applyActionCode(oobCode);
        
        // Get the current user to check if email is verified
        const user = firebase.auth().currentUser;
        
        if (user) {
            // Reload user to get updated email verification status
            await user.reload();
            
            if (user.emailVerified) {
                showSuccess();
            } else {
                showError('Email verification failed. Please try again.');
            }
        } else {
            // User not signed in, but verification was successful
            showSuccess();
        }
        
    } catch (error) {
        console.error('Email verification error:', error);
        
        switch (error.code) {
            case 'auth/expired-action-code':
                showError('This verification link has expired. Please request a new verification email.', true);
                break;
            case 'auth/invalid-action-code':
                showError('Invalid verification link. Please request a new verification email.', true);
                break;
            case 'auth/user-disabled':
                showError('This account has been disabled. Please contact support.');
                break;
            case 'auth/user-not-found':
                showError('No account found with this email address. Please sign up again.');
                break;
            default:
                showError('Failed to verify email address. Please try again or contact support.', true);
        }
    }
}

function showSuccess() {
    loadingState.style.display = 'none';
    successState.style.display = 'block';
    
    // Track verification success (optional)
    console.log('Email verification successful');
}

function showError(message, showResend = false) {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    errorMessage.textContent = message;
    
    if (showResend) {
        resendBtn.style.display = 'block';
    } else {
        resendBtn.style.display = 'none';
    }
}

function showAlreadyVerified() {
    loadingState.style.display = 'none';
    alreadyVerifiedState.style.display = 'block';
}

async function requestNewVerification() {
    const user = firebase.auth().currentUser;
    
    if (!user) {
        showError('Please sign in to request a new verification email.');
        return;
    }
    
    resendBtn.disabled = true;
    resendBtn.innerHTML = 'Sending...';
    
    try {
        await user.sendEmailVerification();
        showError('A new verification email has been sent to your email address.', false);
    } catch (error) {
        console.error('Error sending verification email:', error);
        showError('Failed to send verification email. Please try again later.', true);
    } finally {
        resendBtn.disabled = false;
        resendBtn.innerHTML = 'Send New Verification Email';
    }
}

// Handle auth state changes
firebase.auth().onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
        // User is signed in and email is verified
        console.log('User is verified:', user.email);
    }
});