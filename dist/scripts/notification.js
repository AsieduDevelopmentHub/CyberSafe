class NotificationPanel {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 4000) {
        const note = document.createElement('div');
        note.className = `notification ${type}`;
        note.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
        `;
        this.container.appendChild(note);

        // Animate in
        requestAnimationFrame(() => note.classList.add('visible'));

        // Auto remove
        setTimeout(() => {
            note.classList.remove('visible');
            setTimeout(() => note.remove(), 500);
        }, duration);
    }
}

window.NotificationPanel = new NotificationPanel();