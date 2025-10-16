// scripts/app-enhancements.js
class AppEnhancements {
    constructor() {
        this.isApp = false;
        this.init();
    }

    init() {
        this.detectAppEnvironment();
        this.setupAppFeatures();
        this.setupSwipeGestures();
    }

    detectAppEnvironment() {
        // Check if running in Capacitor/Cordova
        this.isApp = window.Capacitor !== undefined || window.cordova !== undefined;
        
        if (this.isApp) {
            document.body.classList.add('app-mode');
            console.log('📱 Running in app mode');
        }
    }

    setupAppFeatures() {
        if (!this.isApp) return;

        // Status bar styling (for Capacitor)
        if (window.Capacitor && window.Capacitor.Plugins.StatusBar) {
            window.Capacitor.Plugins.StatusBar.setStyle({ 
                style: 'DARK' 
            });
            window.Capacitor.Plugins.StatusBar.setBackgroundColor({ 
                color: '#0A1F44' 
            });
        }

        // Prevent zooming
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }

        // Disable text selection
        document.body.style.webkitUserSelect = 'none';
        document.body.style.userSelect = 'none';
    }

    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only consider horizontal swipes with minimal vertical movement
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left - go forward (if needed)
                    console.log('➡️ Swipe left detected');
                } else {
                    // Swipe right - go back
                    console.log('⬅️ Swipe right detected - going back');
                    if (window.navigationManager) {
                        window.navigationManager.goBack();
                    }
                }
            }

            startX = 0;
            startY = 0;
        });
    }

    // Fullscreen mode for videos
    setupFullscreenVideo() {
        document.addEventListener('webkitpresentationmodechanged', (e) => {
            if (e.target.webkitPresentationMode === 'fullscreen') {
                console.log('🎬 Video entered fullscreen');
            }
        });
    }
}

// Initialize App Enhancements
window.appEnhancements = new AppEnhancements();