// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// DOM Elements
const resetForm = document.getElementById('resetForm');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');

// Password strength indicators
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

// Requirement elements
const reqLength = document.getElementById('reqLength');
const reqUpper = document.getElementById('reqUpper');
const reqLower = document.getElementById('reqLower');
const reqNumber = document.getElementById('reqNumber');
const reqSpecial = document.getElementById('reqSpecial');

// Check URL for mode and oobCode
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const oobCode = urlParams.get('oobCode');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    if (!mode || !oobCode || mode !== 'resetPassword') {
        showMessage('Invalid or expired password reset link. Please request a new one.', 'error');
        disableForm();
        return;
    }
    
    showMessage('Please enter your new password below.', 'info');
});

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
}

// Check password strength
newPasswordInput.addEventListener('input', function() {
    const password = this.value;
    checkPasswordStrength(password);
    checkPasswordMatch();
});

// Check password match
confirmPasswordInput.addEventListener('input', checkPasswordMatch);

function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Update requirement indicators
    reqLength.className = requirements.length ? 'valid' : 'invalid';
    reqUpper.className = requirements.upper ? 'valid' : 'invalid';
    reqLower.className = requirements.lower ? 'valid' : 'invalid';
    reqNumber.className = requirements.number ? 'valid' : 'invalid';
    reqSpecial.className = requirements.special ? 'valid' : 'invalid';

    // Calculate strength
    strength += requirements.length ? 20 : 0;
    strength += requirements.upper ? 20 : 0;
    strength += requirements.lower ? 20 : 0;
    strength += requirements.number ? 20 : 0;
    strength += requirements.special ? 20 : 0;

    // Update strength bar and text
    strengthFill.style.width = `${strength}%`;
    
    if (strength < 40) {
        strengthFill.style.background = '#e53e3e';
        strengthText.textContent = 'Weak';
        strengthText.style.color = '#e53e3e';
    } else if (strength < 80) {
        strengthFill.style.background = '#d69e2e';
        strengthText.textContent = 'Medium';
        strengthText.style.color = '#d69e2e';
    } else {
        strengthFill.style.background = '#38a169';
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#38a169';
    }
}

function checkPasswordMatch() {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const matchElement = document.getElementById('passwordMatch');

    if (!confirmPassword) {
        matchElement.textContent = '';
        matchElement.style.color = '';
        return;
    }

    if (newPassword === confirmPassword) {
        matchElement.textContent = '✓ Passwords match';
        matchElement.style.color = '#38a169';
    } else {
        matchElement.textContent = '✗ Passwords do not match';
        matchElement.style.color = '#e53e3e';
    }
}

function showMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
}

function setLoading(loading) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    if (loading) {
        btnText.textContent = 'Resetting Password...';
        btnSpinner.style.display = 'block';
        submitBtn.disabled = true;
    } else {
        btnText.textContent = 'Reset Password';
        btnSpinner.style.display = 'none';
        submitBtn.disabled = false;
    }
}

function disableForm() {
    newPasswordInput.disabled = true;
    confirmPasswordInput.disabled = true;
    submitBtn.disabled = true;
}

// Handle form submission
resetForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validation
    if (newPassword !== confirmPassword) {
        showMessage('Passwords do not match. Please check and try again.', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showMessage('Password must be at least 8 characters long.', 'error');
        return;
    }

    setLoading(true);

    try {
        // Confirm the password reset code is valid
        await firebase.auth().verifyPasswordResetCode(oobCode);
        
        // Save the new password
        await firebase.auth().confirmPasswordReset(oobCode, newPassword);
        
        showMessage('✅ Password reset successfully! Redirecting...', 'success');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
            window.location.href = 'https://cybersafe.auralenx.com/auth/success.html';
        }, 3000);
        
    } catch (error) {
        console.error('Password reset error:', error);
        
        switch (error.code) {
            case 'auth/expired-action-code':
                showMessage('The password reset link has expired. Please request a new one.', 'error');
                break;
            case 'auth/invalid-action-code':
                showMessage('Invalid password reset link. Please request a new one.', 'error');
                break;
            case 'auth/weak-password':
                showMessage('Password is too weak. Please choose a stronger password.', 'error');
                break;
            default:
                showMessage('Error resetting password. Please try again or contact support.', 'error');
        }
        
        setLoading(false);
    }
});

// Handle Firebase auth state changes (optional)
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in (optional handling)
        console.log('User is signed in:', user.email);
    }
});