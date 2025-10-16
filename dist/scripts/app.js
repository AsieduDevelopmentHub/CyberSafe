class CyberSafeApp {
    constructor() {
        this.isInitialized = false;
        this.isDataLoaded = false;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing CyberSafe App...');
            this.updateLoadingText('Initializing security protocols...');
            
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                await this.initializeApp();
            }
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            
        }
    }

    async initializeApp() {
        try {
            this.updateLoadingText('Connecting to database...');
            
            // Wait for Firebase to be ready
            await this.waitForFirebase();
            
            // Initialize all managers in correct order
            this.initManagers();
            
            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Check authentication state
            await this.checkAuthState();
            
            this.isInitialized = true;
            console.log('✅ CyberSafe App initialized successfully');
            
        } catch (error) {
            console.error('❌ App initialization error:', error);
        
        }
    }

    waitForFirebase() {
        return new Promise((resolve, reject) => {
            const maxWaitTime = 10000;
            const startTime = Date.now();
            
            const checkFirebase = () => {
                if (typeof firebase !== 'undefined' && firebase.app) {
                    console.log('✅ Firebase initialized');
                    resolve();
                } else if (Date.now() - startTime > maxWaitTime) {
                    reject(new Error('Firebase initialization timeout'));
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            
            checkFirebase();
        });
    }

    initManagers() {
        console.log('🔧 Initializing managers...');
        this.updateLoadingText('Loading modules and content...');
        
        try {
            // Core services first
            window.firestoreService = new FirestoreService();
            
            // Then UI managers
            window.authManager = new AuthManager();
            window.dashboardManager = new DashboardManager();
            window.modulesManager = new ModulesManager();
            window.moduleContentManager = new ModuleContentManager();
            window.quizManager = new QuizManager();
            window.videoPlayerManager = new VideoPlayerManager();
            
            // Initialize YouTube API
            window.videoPlayerManager.initYouTubeAPI();
            
            console.log('✅ All managers initialized successfully');
            
        } catch (error) {
            console.error('❌ Manager initialization error:', error);
            throw error;
        }
    }

    setupGlobalEvents() {
        console.log('🔗 Setting up global events...');
        
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('🌍 Global error:', e.error);
            
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('🌍 Unhandled promise rejection:', e.reason);
            
            e.preventDefault();
        });

        // Online/offline handling
        window.addEventListener('online', () => {
            this.showSuccessToast('Back online - syncing data...');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.showWarningToast('You are currently offline');
        });

        // Featured modules click handler
        document.addEventListener('click', (e) => {
            // Handle featured modules in dashboard
            if (e.target.closest('.modules-grid .module-item')) {
                const moduleItem = e.target.closest('.module-item');
                const moduleId = moduleItem.getAttribute('data-module');
                console.log('🎯 Featured module clicked:', moduleId);
                
                if (window.moduleContentManager && moduleId) {
                    window.moduleContentManager.openModule(moduleId);
                }
            }

            // Handle continue learning button in dashboard
            if (e.target.closest('.btn-continue')) {
                const button = e.target.closest('.btn-continue');
                const moduleId = button.getAttribute('data-module');
                console.log('🎯 Continue learning button clicked:', moduleId);
                
                if (window.moduleContentManager && moduleId) {
                    window.moduleContentManager.openModule(moduleId);
                }
            }
        });

        // Service worker registration for future PWA capabilities
        // this.registerServiceWorker();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Ctrl/Cmd + D to toggle dark mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleDarkMode();
            }
        });

        console.log('✅ Global events setup completed');
    }

    async checkAuthState() {
        this.updateLoadingText('Checking authentication...');
        
        return new Promise((resolve) => {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) {
                    console.log('👤 User is signed in:', user.email);
                    await this.handleUserSignedIn(user);
                } else {
                    console.log('👤 No user signed in');
                    this.handleUserSignedOut();
                }
                resolve();
            });
        });
    }

    async handleUserSignedIn(user) {
        try {
            this.updateLoadingText('Loading your progress...');
            
            // Show app section
            this.showAppSection();
            
            // Load initial user data
            await this.loadInitialData(user);
            
            // Hide loading screen after data is loaded
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Error handling user sign in:', error);
            this.hideLoadingScreen();
        }
    }

    handleUserSignedOut() {
        this.showAuthSection();
        this.hideLoadingScreen();
    }

    async loadInitialData(user) {
        try {
            console.log('📥 Loading initial data for user:', user.uid);
            
            // Load user profile and progress
            if (window.firestoreService) {
                const userData = await window.firestoreService.getUserProfile(user.uid);
                console.log('📊 User data loaded:', userData);
                
                if (userData && window.dashboardManager) {
                    await window.dashboardManager.updateProgressUI(userData);
                }

                // Update user streak
                await window.firestoreService.updateUserStreak(user.uid);
                
                // Load modules with real progress
                if (window.modulesManager) {
                    await window.modulesManager.updateModulesWithRealProgress();
                }

                // Mark data as loaded
                this.isDataLoaded = true;
                
                console.log('✅ Initial data loaded successfully');
            }

        } catch (error) {
            console.error('❌ Error loading initial data:', error);
            // Continue even if data loading fails
            this.isDataLoaded = false;
        }
    }

    showAppSection() {
        document.getElementById('authSection').classList.remove('active');
        document.getElementById('appSection').classList.add('active');
    }

    showAuthSection() {
        document.getElementById('appSection').classList.remove('active');
        document.getElementById('authSection').classList.add('active');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }

    updateLoadingText(text) {
        const loadingText = document.getElementById('loadingText');
        if (loadingText) {
            loadingText.textContent = text;
        }
    }

    // ... (rest of the methods remain the same - closeAllModals, toggleDarkMode, toast methods, etc.)

    // Utility method to check app status
    getStatus() {
        return {
            initialized: this.isInitialized,
            dataLoaded: this.isDataLoaded,
            firebase: typeof firebase !== 'undefined' && !!firebase.app,
            user: firebase.auth().currentUser ? {
                uid: firebase.auth().currentUser.uid,
                email: firebase.auth().currentUser.email
            } : null,
            managers: {
                auth: !!window.authManager,
                dashboard: !!window.dashboardManager,
                modules: !!window.modulesManager,
                quiz: !!window.quizManager,
                video: !!window.videoPlayerManager
            }
        };
    }
}

// Initialize the app when everything is ready
let cyberSafeApp;

function initializeCyberSafeApp() {
    if (!cyberSafeApp) {
        cyberSafeApp = new CyberSafeApp();
    }
    return cyberSafeApp;
}

// Export for global access
window.CyberSafeApp = CyberSafeApp;
window.initializeCyberSafeApp = initializeCyberSafeApp;

// Initialize the app immediately
console.log('🎯 CyberSafe App starting...');
window.cyberSafeApp = initializeCyberSafeApp();