class DashboardManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.themeToggleInitialized = false; // Prevent multiple initializations
        this.init();
    }

    async init() {
        this.setupNavigation();
        this.setupThemeToggle(); // Setup theme FIRST
        await this.loadUserProgress();
        this.setupEventListeners();
        
        // Wait for navigation manager to be ready
        setTimeout(() => {
            if (window.navigationManager) {
                console.log('✅ Navigation manager integrated');
            }
        }, 100);
        
        const user = firebase.auth().currentUser;
        if (user) {
            await this.loadProfileData();
        }
    }

    setupEventListeners() {
        // "See All" link
        const seeAllLink = document.querySelector('.see-all');
        if (seeAllLink) {
            seeAllLink.addEventListener('click', (e) => {
                e.preventDefault();
            });
        }
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.switchSection(section);
                
                navItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');
            });
        });

        const seeAllLink = document.querySelector('.see-all');
        if (seeAllLink) {
            seeAllLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection('modules');
                
                navItems.forEach(navItem => navItem.classList.remove('active'));
                const modulesNav = document.querySelector('[data-section="modules"]');
                if (modulesNav) modulesNav.classList.add('active');
            });
        }
    }

    switchSection(sectionName) {
        console.log('🔄 Dashboard switching to section:', sectionName);
        
        this.currentSection = sectionName;
        
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));

        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.loadSectionContent(sectionName);
        }
    }

    loadSectionContent(sectionName) {
        console.log('📂 Loading section:', sectionName);
        
        switch(sectionName) {
            case 'modules':
                if (window.modulesManager) {
                    window.modulesManager.loadModules();
                }
                break;
            case 'caseStudies':
                if (window.modulesManager) {
                    window.modulesManager.loadCaseStudies();
                }
                break;
            case 'profile':
                this.loadProfileData();
                break;
            case 'dashboard':
                this.refreshDashboard();
                break;
        }
    }

    async loadUserProgress() {
        const user = firebase.auth().currentUser;
        if (!user) {
            console.log('👤 No user logged in, skipping progress load');
            return;
        }

        try {
            console.log('📥 Loading user progress for:', user.uid);
            
            if (window.firestoreService) {
                const userData = await window.firestoreService.getUserProfile(user.uid);
                console.log('📊 User data from Firestore:', userData);
                
                if (userData) {
                    await this.updateProgressUI(userData);
                    this.updateUserInfoFromFirestore(userData);
                } else {
                    console.log('❌ No user data found in Firestore');
                }

                await window.firestoreService.updateUserStreak(user.uid);
            }
        } catch (error) {
            console.error('❌ Error loading user progress:', error);
        }
    }

    updateUserInfoFromFirestore(userData) {
        console.log('👤 Updating user info from Firestore:', userData);
        
        const profileEmail = document.getElementById('profileEmail');
        if (profileEmail && userData.email) {
            if (!profileEmail.textContent || profileEmail.textContent === 'user@example.com') {
                profileEmail.textContent = userData.email;
            }
        }
        
        const profileName = document.getElementById('profileName');
        if (profileName && userData.name) {
            if (!profileName.textContent || profileName.textContent === 'User Name') {
                profileName.textContent = userData.name;
            }
        }

        const profileAvatar = document.getElementById('profileAvatar');
        const userAvatar = document.getElementById('userAvatar');
        if (userData.photoURL) {
            if (profileAvatar) profileAvatar.src = userData.photoURL;
            if (userAvatar) userAvatar.src = userData.photoURL;
        }
    }

    async updateProgressUI(userData) {
        console.log('📈 Updating progress UI with user data:', userData);
        
        const progress = userData.progress || {};
        const modulesProgress = await this.getModulesProgress(userData.uid);
        const scores = await this.calculateAverageScore(userData.uid);
        
        // Update progress circle
        const progressCircle = document.querySelector('.circle-progress');
        if (progressCircle) {
            progressCircle.style.setProperty('--progress', `${scores.averagePercentage}%`);
            const percentage = document.querySelector('.percentage');
            if (percentage) {
                percentage.textContent = `${scores.averagePercentage}%`;
            }
        }

        // Update stats cards
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 3) {
            const streak = progress.currentStreak || 0;
            statCards[0].querySelector('.value').textContent = streak;
            
            const badgeCount = progress.completedModules ? progress.completedModules.length : 0;
            statCards[1].querySelector('.value').textContent = badgeCount;
            
            statCards[2].querySelector('.value').textContent = `${scores.averageScore}%`;
        }

        // Update profile stats
        const profileStats = document.querySelectorAll('.stat-item');
        if (profileStats.length >= 3) {
            if (progress.overall !== undefined) {
                profileStats[0].querySelector('.stat-value').textContent = `${scores.averagePercentage}%`;
            }
            if (progress.currentStreak !== undefined) {
                profileStats[1].querySelector('.stat-value').textContent = progress.currentStreak;
            }
            if (progress.completedModules) {
                profileStats[2].querySelector('.stat-value').textContent = `${progress.completedModules.length}/6`;
            }
        }

        this.updateContinueLearningSection(userData.uid, modulesProgress);
    }

    async getModulesProgress(uid) {
        try {
            if (!window.firestoreService) return [];
            
            const modulesSnapshot = await firebase.firestore()
                .collection('user_progress')
                .doc(uid)
                .collection('modules')
                .get();
            
            return modulesSnapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Error getting modules progress:', error);
            return [];
        }
    }

    async calculateAverageScore(uid) {
        try {
            if (!window.firestoreService) return { averagePercentage: 0, averageScore: 0 };
            
            const modulesProgress = await this.getModulesProgress(uid);
            if (modulesProgress.length === 0) return { averagePercentage: 0, averageScore: 0 };
            
            const completedModules = modulesProgress.filter(module => module.completed && module.score);
            if (completedModules.length === 0) return { averagePercentage: 0, averageScore: 0 };
            
            const totalScore = completedModules.reduce((sum, module) => {
                const score = Number(module.score) || 0;
                return sum + score;
            }, 0);
            
            const averageScore = Math.round(totalScore / completedModules.length);
            const averagePercentage = Math.round((completedModules.length / 6) * 100);
            
            return {
                averagePercentage: averagePercentage,
                averageScore: averageScore
            }; 
            
        } catch (error) {
            console.error('Error calculating average score:', error);
            return { averagePercentage: 0, averageScore: 0 };
        }
    }

    async updateContinueLearningSection(uid, modulesProgress) {
        try {
            const continueLearningCard = document.querySelector('.module-card.active-module');
            if (!continueLearningCard) return;

            let continueModule = null;
            
            if (modulesProgress && modulesProgress.length > 0) {
                const sortedModules = modulesProgress
                    .filter(module => !module.completed)
                    .sort((a, b) => {
                        if (a.progress !== b.progress) {
                            return b.progress - a.progress;
                        }
                        if (a.lastUpdated && b.lastUpdated) {
                            return b.lastUpdated.toDate() - a.lastUpdated.toDate();
                        }
                        return 0;
                    });
                
                continueModule = sortedModules[0];
            }

            if (continueModule) {
                const moduleInfo = continueLearningCard.querySelector('.module-info');
                const progressBar = continueLearningCard.querySelector('.progress-fill');
                const progressText = continueLearningCard.querySelector('.module-progress span');
                
                if (moduleInfo) {
                    const title = moduleInfo.querySelector('h4');
                    if (title) title.textContent = this.getModuleTitle(continueModule.moduleId);
                }
                
                if (progressBar) {
                    progressBar.style.width = `${continueModule.progress}%`;
                }
                
                if (progressText) {
                    progressText.textContent = `${continueModule.progress}% complete`;
                }
                
                const continueBtn = continueLearningCard.querySelector('.btn-continue');
                if (continueBtn) {
                    continueBtn.setAttribute('data-module', continueModule.moduleId);
                    continueBtn.onclick = () => {
                        if (window.moduleContentManager) {
                            window.moduleContentManager.openModule(continueModule.moduleId);
                        }
                    };
                }
            } else {
                const continueBtn = continueLearningCard.querySelector('.btn-continue');
                if (continueBtn) {
                    continueBtn.onclick = () => {
                        if (window.moduleContentManager) {
                            window.moduleContentManager.openModule('phishing');
                        }
                    };
                }
            }
        } catch (error) {
            console.error('Error updating continue learning section:', error);
        }
    }

    getModuleTitle(moduleId) {
        const moduleTitles = {
            phishing: 'Phishing Awareness',
            passwords: 'Password Security',
            social: 'Social Engineering',
            network: 'Network Security',
            data: 'Data Protection',
            mobile: 'Mobile Security'
        };
        
        return moduleTitles[moduleId] || 'Cybersecurity Module';
    }

    setupThemeToggle() {
        // Prevent multiple initializations
        if (this.themeToggleInitialized) {
            console.log('🎨 Theme toggle already initialized');
            return;
        }

        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) {
            console.error('❌ Theme toggle button not found in HTML');
            return;
        }

        console.log('🎨 Initializing theme toggle...');

        // Remove any existing event listeners
        const newToggle = themeToggle.cloneNode(true);
        themeToggle.parentNode.replaceChild(newToggle, themeToggle);

        // Get initial theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('cybersafe-theme');
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        console.log('📋 Initial theme:', { savedTheme, prefersDark, initialTheme });

        // Apply initial theme
        this.applyTheme(initialTheme);

        // Add SINGLE event listener
        newToggle.addEventListener('click', () => {
            console.log('🎯 Theme toggle clicked');
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            console.log('🔄 Switching theme:', currentTheme, '→', newTheme);
            this.applyTheme(newTheme);
            localStorage.setItem('cybersafe-theme', newTheme);
        });

        this.themeToggleInitialized = true;
        console.log('✅ Theme toggle setup complete');
    }

    applyTheme(theme) {
        console.log('🎯 Applying theme:', theme);
        
        // Remove any existing theme attributes
        document.documentElement.removeAttribute('data-theme');
        
        // Apply new theme
        setTimeout(() => {
            document.documentElement.setAttribute('data-theme', theme);
            this.updateThemeIcon(theme);
            console.log('✅ Theme applied:', theme);
        }, 10);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (!icon) {
            console.error('❌ Theme icon not found');
            return;
        }

        console.log('🔄 Updating theme icon to:', theme);
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            icon.style.color = '#FBBF24';
        } else {
            icon.className = 'fas fa-moon';
            icon.style.color = '#0A1F44';
        }
        
        console.log('✅ Icon updated:', icon.className);
    }

    loadProfileData() {
        console.log('🛡️ Loading profile data...');
        
        if (window.modulesManager) {
            window.modulesManager.loadBadges();
        }
        
        const user = firebase.auth().currentUser;
        if (user && window.firestoreService) {
            this.loadUserProgress();
        }
    }

    async refreshDashboard() {
        console.log('🔄 Refreshing dashboard data...');
        
        try {
            const user = firebase.auth().currentUser;
            if (!user) return;

            await this.loadUserProgress();
            const modulesProgress = await this.getModulesProgress(user.uid);
            this.updateContinueLearningSection(user.uid, modulesProgress);
            
        } catch (error) {
            console.error('❌ Error refreshing dashboard:', error);
        }
    }
}

// Initialize Dashboard Manager
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});