class NotificationPanel {
    constructor() {
        this.container = null;
        this.init();
        this.overrideConsole();
        this.overrideAlerts();
    }

    init() {
        // Create container if it doesn't exist
        if (!document.querySelector('.notification-container')) {
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.notification-container');
        }

        // Add CSS styles if not already added
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('notification-styles')) return;

        const styles = `
            <style id="notification-styles">
                .notification-container {
                    position: fixed;
                    top: var(--space-lg);
                    right: var(--space-lg);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-sm);
                    z-index: 9999;
                    max-width: 400px;
                }

                .notification {
                    min-width: 250px;
                    max-width: 100%;
                    padding: var(--space-md);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    color: var(--surface);
                    opacity: 0;
                    transform: translateX(30px);
                    transition: all 0.3s ease;
                    border-left: 4px solid transparent;
                    backdrop-filter: blur(10px);
                }

                .notification.visible {
                    opacity: 1;
                    transform: translateX(0);
                }

                .notification.info {
                    background: var(--accent);
                    border-left-color: var(--primary);
                }

                .notification.success {
                    background: var(--success);
                    border-left-color: #059669;
                }

                .notification.warning {
                    background: var(--warning);
                    border-left-color: #D97706;
                    color: var(--text-primary);
                }

                .notification.error {
                    background: var(--error);
                    border-left-color: #DC2626;
                }

                .notification-content {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-sm);
                }

                .notification-icon {
                    font-size: 1.2em;
                    margin-top: 2px;
                    flex-shrink: 0;
                }

                .notification-message {
                    flex: 1;
                    line-height: 1.4;
                }

                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 1.1em;
                    cursor: pointer;
                    opacity: 0.7;
                    padding: 2px;
                    border-radius: var(--radius-sm);
                    transition: opacity 0.2s ease;
                    flex-shrink: 0;
                }

                .notification-close:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.2);
                }

                /* Confirm Dialog Styles */
                .confirm-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    backdrop-filter: blur(5px);
                }

                .confirm-dialog {
                    background: var(--surface);
                    border-radius: var(--radius-lg);
                    padding: var(--space-xl);
                    max-width: 400px;
                    width: 90%;
                    box-shadow: var(--shadow-lg);
                    border: 1px solid var(--border);
                }

                .confirm-title {
                    color: var(--text-primary);
                    margin: 0 0 var(--space-md) 0;
                    font-size: 1.25em;
                    font-weight: 600;
                }

                .confirm-message {
                    color: var(--text-secondary);
                    margin: 0 0 var(--space-lg) 0;
                    line-height: 1.5;
                }

                .confirm-buttons {
                    display: flex;
                    gap: var(--space-md);
                    justify-content: flex-end;
                }

                .confirm-btn {
                    padding: var(--space-sm) var(--space-lg);
                    border: none;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .confirm-btn.cancel {
                    background: var(--background);
                    color: var(--text-secondary);
                    border: 1px solid var(--border);
                }

                .confirm-btn.cancel:hover {
                    background: var(--border);
                }

                .confirm-btn.confirm {
                    background: var(--error);
                    color: white;
                }

                .confirm-btn.confirm:hover {
                    background: #DC2626;
                    transform: translateY(-1px);
                }

                .confirm-btn.success {
                    background: var(--success);
                    color: white;
                }

                .confirm-btn.success:hover {
                    background: #059669;
                    transform: translateY(-1px);
                }

                /* Loading Spinner */
                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: var(--space-sm);
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Progress Notification */
                .notification.progress .notification-content {
                    align-items: center;
                }

                .progress-bar {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                    overflow: hidden;
                    margin-top: var(--space-sm);
                }

                .progress-fill {
                    height: 100%;
                    background: rgba(255, 255, 255, 0.8);
                    transition: width 0.3s ease;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    show(message, type = 'info', duration = 4000) {
        this.init(); // Ensure container exists

        const note = document.createElement('div');
        note.className = `notification ${type}`;
        
        const icons = {
            info: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-exclamation-circle'
        };

        note.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon ${icons[type] || icons.info}"></i>
                <div class="notification-message">${message}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.container.appendChild(note);

        // Animate in
        requestAnimationFrame(() => note.classList.add('visible'));

        // Auto remove if duration is provided
        if (duration > 0) {
            setTimeout(() => {
                this.hide(note);
            }, duration);
        }

        return note;
    }

    hide(notificationElement) {
        if (notificationElement && notificationElement.parentNode) {
            notificationElement.classList.remove('visible');
            setTimeout(() => {
                if (notificationElement.parentNode) {
                    notificationElement.parentNode.removeChild(notificationElement);
                }
            }, 500);
        }
    }

    // Quick methods for common notification types
    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }

    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    }

    error(message, duration = 6000) {
        return this.show(message, 'error', duration);
    }

    // Loading notification (stays until manually hidden)
    loading(message = 'Loading...') {
        const note = document.createElement('div');
        note.className = 'notification info progress';
        note.innerHTML = `
            <div class="notification-content">
                <div class="loading-spinner"></div>
                <div class="notification-message">${message}</div>
            </div>
        `;

        this.container.appendChild(note);
        requestAnimationFrame(() => note.classList.add('visible'));

        return {
            hide: () => this.hide(note),
            update: (newMessage) => {
                const messageEl = note.querySelector('.notification-message');
                if (messageEl) messageEl.textContent = newMessage;
            }
        };
    }

    // Progress notification
    progress(message, progress = 0) {
        const note = document.createElement('div');
        note.className = 'notification info';
        note.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon fas fa-sync-alt"></i>
                <div class="notification-message">
                    ${message}
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            </div>
        `;

        this.container.appendChild(note);
        requestAnimationFrame(() => note.classList.add('visible'));

        return {
            hide: () => this.hide(note),
            update: (newProgress, newMessage = null) => {
                const progressFill = note.querySelector('.progress-fill');
                const messageEl = note.querySelector('.notification-message');
                
                if (progressFill) progressFill.style.width = `${newProgress}%`;
                if (newMessage && messageEl) {
                    messageEl.firstChild.textContent = newMessage;
                }
            }
        };
    }

    // Confirm dialog replacement
    async confirm(message, title = 'Confirm Action', confirmText = 'Confirm', cancelText = 'Cancel', type = 'error') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'confirm-overlay';
            
            const confirmBtnClass = type === 'success' ? 'success' : 'error';
            
            overlay.innerHTML = `
                <div class="confirm-dialog">
                    <h3 class="confirm-title">${title}</h3>
                    <p class="confirm-message">${message}</p>
                    <div class="confirm-buttons">
                        <button class="confirm-btn cancel">${cancelText}</button>
                        <button class="confirm-btn ${confirmBtnClass}">${confirmText}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const close = (result) => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
                resolve(result);
            };

            // Event listeners
            overlay.querySelector('.confirm-btn.cancel').addEventListener('click', () => close(false));
            overlay.querySelector(`.confirm-btn.${confirmBtnClass}`).addEventListener('click', () => close(true));
            
            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close(false);
            });

            // Close on escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    close(false);
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    }

    // Alert replacement
    async alert(message, title = 'Information', buttonText = 'OK') {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'confirm-overlay';
            
            overlay.innerHTML = `
                <div class="confirm-dialog">
                    <h3 class="confirm-title">${title}</h3>
                    <p class="confirm-message">${message}</p>
                    <div class="confirm-buttons">
                        <button class="confirm-btn success" style="margin-left: auto;">${buttonText}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const close = () => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
                resolve();
            };

            // Event listeners
            overlay.querySelector('.confirm-btn.success').addEventListener('click', close);
            
            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close();
            });

            // Close on escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    close();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
        });
    }

    // Override console methods
    overrideConsole() {
        const originalConsole = {
            log: console.log
        };
        // Keep original log for debugging
        console.log = originalConsole.log;
    }

    // Override native alert and confirm
    overrideAlerts() {
        // Store original functions
        const originalAlert = window.alert;
        const originalConfirm = window.confirm;

        // Override alert
        window.alert = (message) => {
            console.warn('Using custom alert instead of native alert');
            return this.alert(message);
        };

        // Override confirm
        window.confirm = (message) => {
            console.warn('Using custom confirm instead of native confirm');
            return this.confirm(message, 'Confirm Action', 'Yes', 'No');
        };

        // Return function to restore originals if needed
        return {
            restore: () => {
                window.alert = originalAlert;
                window.confirm = originalConfirm;
            }
        };
    }

    // Clear all notifications
    clear() {
        if (this.container) {
            const notifications = this.container.querySelectorAll('.notification');
            notifications.forEach(notification => {
                this.hide(notification);
            });
        }
    }

    // Get notification count
    get count() {
        return this.container ? this.container.querySelectorAll('.notification').length : 0;
    }
}

// Initialize immediately and make globally available
window.NotificationPanel = new NotificationPanel();

// Shortcut methods for quick access
window.notify = {
    info: (msg, duration) => window.NotificationPanel.info(msg, duration),
    success: (msg, duration) => window.NotificationPanel.success(msg, duration),
    warning: (msg, duration) => window.NotificationPanel.warning(msg, duration),
    error: (msg, duration) => window.NotificationPanel.error(msg, duration),
    loading: (msg) => window.NotificationPanel.loading(msg),
    progress: (msg, progress) => window.NotificationPanel.progress(msg, progress),
    confirm: (msg, title, confirmText, cancelText, type) => 
        window.NotificationPanel.confirm(msg, title, confirmText, cancelText, type),
    alert: (msg, title, buttonText) => 
        window.NotificationPanel.alert(msg, title, buttonText),
    clear: () => window.NotificationPanel.clear()
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.NotificationPanel.init();
    });
} else {
    window.NotificationPanel.init();
}