// scripts/navigation-manager.js
class NavigationManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        console.log('🧭 Initializing Hash Navigation...');
        this.setupHashNavigation();
        this.setupBackButton();
        this.setupModalCloseHandlers();
    }

    setupHashNavigation() {
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });

        // Handle initial load
        window.addEventListener('load', () => {
            this.handleHashChange();
        });

        // Override dashboard navigation to use hash
        this.overrideDashboardNavigation();
    }

    overrideDashboardNavigation() {
        if (window.dashboardManager) {
            const originalSwitchSection = window.dashboardManager.switchSection;
            
            window.dashboardManager.switchSection = (sectionName) => {
                // Use hash for navigation
                window.location.hash = sectionName;
                return originalSwitchSection.call(window.dashboardManager, sectionName);
            };
        }

        // Update bottom nav to use hash
        this.setupBottomNavHash();
    }

    setupBottomNavHash() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const originalHref = item.getAttribute('href');
            if (originalHref && originalHref.startsWith('#')) {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = originalHref.substring(1); // Remove the #
                    window.location.hash = section;
                });
            }
        });

        // Update "See All" link in dashboard
        const seeAllLink = document.querySelector('.see-all');
        if (seeAllLink && seeAllLink.getAttribute('href') === '#modules') {
            seeAllLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = 'modules';
            });
        }
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1) || 'dashboard';
        console.log('📍 Hash changed to:', hash);

        // List of valid sections
        const validSections = ['dashboard', 'modules', 'caseStudies', 'profile'];
        
        if (validSections.includes(hash)) {
            this.navigateToSection(hash);
        } else {
            // Default to dashboard if invalid hash
            window.location.hash = 'dashboard';
        }
    }

    navigateToSection(sectionName) {
        this.currentSection = sectionName;

        // Update dashboard manager
        if (window.dashboardManager) {
            window.dashboardManager.switchSection(sectionName);
        }

        // Update bottom nav active state
        this.updateBottomNavActiveState(sectionName);

        // Update back button visibility
        this.updateBackButtonVisibility();

        // NEW: Reset scroll position to top
        this.resetScrollPosition();

        console.log('✅ Navigated to:', sectionName);
    }

    // NEW: Reset scroll position when switching sections
    resetScrollPosition() {
        // Small delay to ensure the section is visible
        setTimeout(() => {
            // Get the main content area
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.scrollTop = 0;
            }
            
            // Also scroll window to top for safety
            window.scrollTo(0, 0);
            
            console.log('📜 Scroll position reset to top');
        }, 50);
    }

    updateBottomNavActiveState(activeSection) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const section = item.getAttribute('data-section');
            if (section === activeSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    setupBackButton() {
        // Handle hardware back button
        document.addEventListener('backbutton', this.handleHardwareBack.bind(this), false);

        // Handle keyboard escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleBack();
            }
        });
    }

    handleHardwareBack() {
        if (this.isAnyModalOpen()) {
            this.closeAllModals();
        } else {
            this.handleBack();
        }
    }

    handleBack() {
        const currentHash = window.location.hash.substring(1);
        
        if (currentHash === 'dashboard') {
            // If already on dashboard, show exit confirmation or minimize
            this.handleExit();
        } else {
            // Go back to dashboard
            window.location.hash = 'dashboard';
        }
    }

    handleExit() {
        if (this.isAppMode()) {
            if (confirm('Are you sure you want to exit CyberSafe?')) {
                this.exitApp();
            }
        } else {
            // For web, just go to dashboard (already there)
            console.log('Already on dashboard');
        }
    }

    isAppMode() {
        return window.cordova !== undefined || window.Capacitor !== undefined;
    }

    exitApp() {
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (window.plugins && window.plugins.appMinimize) {
            window.plugins.appMinimize.minimize();
        }
    }

    isAnyModalOpen() {
        const modals = document.querySelectorAll('.video-modal, .quiz-modal, .module-modal');
        return Array.from(modals).some(modal => 
            modal.style.display === 'flex' || modal.style.display === 'block'
        );
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.video-modal, .quiz-modal, .module-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });

        if (window.videoPlayerManager) {
            window.videoPlayerManager.closeVideoModal();
        }

        console.log('🔒 All modals closed');
    }

    setupModalCloseHandlers() {
        // Make sure modals don't interfere with hash navigation
        const closeButtons = document.querySelectorAll('.close-modal, .close-module-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Just close modal, don't affect navigation
                this.closeAllModals();
            });
        });

        // Close modals when clicking backdrop
        const modals = document.querySelectorAll('.video-modal, .quiz-modal, .module-modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
    }

    updateBackButtonVisibility() {
        const backButton = document.querySelector('.back-button');
        if (backButton) {
            const currentHash = window.location.hash.substring(1);
            // Show back button if NOT on dashboard
            backButton.style.display = currentHash !== 'dashboard' ? 'flex' : 'none';
        }
    }

    // Public method to navigate
    navigateTo(section) {
        window.location.hash = section;
    }

    // Get current section
    getCurrentSection() {
        return this.currentSection;
    }
}

// Initialize Navigation Manager
window.navigationManager = new NavigationManager();