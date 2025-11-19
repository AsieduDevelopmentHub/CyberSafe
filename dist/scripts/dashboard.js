class DashboardManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.themeToggleInitialized = false;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        console.log('📊 DashboardManager initializing...');
        
        // Setup basic UI components that don't need auth
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupEventListeners();
        
        // 🔥 CRITICAL FIX: Use direct auth state check instead of waiting for app
        this.setupDirectAuthListener();
        
        this.isInitialized = true;
        console.log('✅ DashboardManager initialized');
    }

    // 🔥 NEW: Direct auth state listener
    setupDirectAuthListener() {
        console.log('🔐 DashboardManager setting up direct auth listener...');

        // Check current auth state immediately
        const user = firebase.auth().currentUser;
        if (user) {
            console.log('👤 User already authenticated, loading dashboard data...');
            // Load user progress first, then profile data
            this.loadUserProgress().then(() => {
                this.loadProfileData();
            });
        }

        // Listen for future auth changes
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log('👤 DashboardManager: User authenticated via direct listener');
                // Load user progress first, then profile data
                this.loadUserProgress().then(() => {
                    this.loadProfileData();
                });
            } else {
                console.log('👤 DashboardManager: User signed out via direct listener');
                // Reset dashboard state if needed
            }
        });
    }

    // 🔥 NEW: Public method for CyberSafeApp to call
    onAuthReady(user) {
        console.log('📊 DashboardManager: Auth ready callback received for user:', user.email);
        this.loadUserProgress();
        this.loadProfileData();
    }

    setupEventListeners() {
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

    async switchSection(sectionName) {
        console.log('🔄 Dashboard switching to section:', sectionName);
        
        this.currentSection = sectionName;
        
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));

        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            await this.loadSectionContent(sectionName);
            
            if (sectionName === 'profile' && window.profileManager) {
                await window.profileManager.loadUserProfile();
            }
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
                if (window.caseStudyManager) {
                    window.caseStudyManager.loadCaseStudies();
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
            return null;
        }

        try {
            console.log('📥 Loading user progress for:', user.uid);

            if (window.firestoreService) {
                // Load user profile data
                const userData = await window.firestoreService.getUserProfile(user.uid);
                console.log('📊 User data from Firestore:', userData);

                if (userData) {
                    // Update UI with user data
                    this.updateUserInfoFromFirestore(userData);

                    // Load and update progress UI
                    await this.updateProgressUI(userData);

                    // Update streak data
                    await window.firestoreService.updateUserStreak(user.uid);

                    console.log('✅ User progress loaded successfully');
                    return userData;
                } else {
                    console.log('❌ No user data found in Firestore');
                    return null;
                }
            }
        } catch (error) {
            console.error('❌ Error loading user progress:', error);
            return null;
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
        
        const user = firebase.auth().currentUser;
        if (!user) return;

        try {
            // Get comprehensive progress data
            const [modulesProgress, quizResults, caseStudyResults, badges, streakData] = await Promise.all([
                this.getModulesProgress(user.uid),
                this.getQuizResults(user.uid),
                this.getCaseStudyResults(user.uid),
                this.getUserBadges(user.uid),
                this.getUserStreak(user.uid)
            ]);

            // Calculate accurate statistics
            const stats = await this.calculateComprehensiveStats(
                modulesProgress, 
                quizResults, 
                caseStudyResults, 
                badges,
                streakData
            );

            console.log('📊 Calculated comprehensive stats:', stats);

            // Update progress circle
            this.updateProgressCircle(stats.overallProgress);

            // Update stats cards
            this.updateStatsCards(stats);

            // Update profile stats
            this.updateProfileStats(stats);

            // Update continue learning section
            this.updateContinueLearningSection(user.uid, modulesProgress);

            // Update level and badges
            this.updateUserLevel(stats);
            this.updateBadgeCount(stats.badgesEarned);

        } catch (error) {
            console.error('❌ Error in updateProgressUI:', error);
        }
    }

    async getUserStreak(uid) {
        try {
            if (!window.firestoreService) return { currentStreak: 1, longestStreak: 1 };
            
            const userDoc = await firebase.firestore()
                .collection('users')
                .doc(uid)
                .get();
                
            if (userDoc.exists) {
                const userData = userDoc.data();
                return {
                    currentStreak: userData.currentStreak || 1,
                    longestStreak: userData.longestStreak || 1,
                    lastLogin: userData.lastLogin
                };
            }
            
            return { currentStreak: 1, longestStreak: 1 };
        } catch (error) {
            console.error('Error getting user streak:', error);
            return { currentStreak: 1, longestStreak: 1 };
        }
    }

    async getModulesProgress(uid) {
        try {
            if (!window.firestoreService) return [];
            
            const modulesSnapshot = await firebase.firestore()
                .collection('user_progress')
                .doc(uid)
                .collection('modules')
                .get();
            
            return modulesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting modules progress:', error);
            return [];
        }
    }

    async getQuizResults(uid) {
        try {
            const quizResults = await firebase.firestore()
                .collection('quizResults')
                .where('userId', '==', uid)
                .get();
            
            return quizResults.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Error getting quiz results:', error);
            return [];
        }
    }

    async getCaseStudyResults(uid) {
        try {
            const caseStudyResults = await firebase.firestore()
                .collection('caseStudyQuizzes')
                .where('userId', '==', uid)
                .get();
            
            return caseStudyResults.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Error getting case study results:', error);
            return [];
        }
    }

    async getUserBadges(uid) {
        try {
            const badgesSnapshot = await firebase.firestore()
                .collection('user_badges')
                .doc(uid)
                .collection('badges')
                .get();
            
            return badgesSnapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Error getting user badges:', error);
            return [];
        }
    }

    async calculateComprehensiveStats(modulesProgress, quizResults, caseStudyResults, badges, streakData = {}) {
        // Calculate module completion
        const completedModules = modulesProgress.filter(module => module.completed);
        const moduleCompletionRate = modulesProgress.length > 0 ? 
            (completedModules.length / 6) * 100 : 0;

        // Calculate average quiz score
        const allScores = [
            ...quizResults.map(quiz => quiz.score || 0),
            ...caseStudyResults.map(caseStudy => caseStudy.score || 0)
        ];
        const averageScore = allScores.length > 0 ? 
            Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length) : 0;

        // Calculate overall progress (weighted average)
        const moduleWeight = 0.4;
        const quizWeight = 0.4;  
        const badgeWeight = 0.2;

        const moduleProgress = moduleCompletionRate;
        const quizProgress = averageScore;
        const badgeProgress = Math.min((badges.length / 6) * 100, 100);

        const overallProgress = Math.round(
            (moduleProgress * moduleWeight) +
            (quizProgress * quizWeight) +
            (badgeProgress * badgeWeight)
        );

        // Use actual streak data or default to 1
        const currentStreak = streakData.currentStreak || 1;

        return {
            overallProgress: overallProgress,
            averageScore: averageScore,
            completedModules: completedModules.length,
            totalModules: 6,
            badgesEarned: badges.length,
            totalBadges: 6,
            currentStreak: currentStreak,
            longestStreak: streakData.longestStreak || 1,
            totalQuizzes: quizResults.length + caseStudyResults.length,
            moduleCompletionRate: Math.round(moduleCompletionRate)
        };
    }

    updateProgressCircle(progress) {
        const progressCircle = document.querySelector('.circle-progress');
        if (progressCircle) {
            progressCircle.style.setProperty('--progress', `${progress}%`);
            const percentage = document.querySelector('.percentage');
            if (percentage) {
                percentage.textContent = `${progress}%`;
            }
        }
    }

    updateStatsCards(stats) {
        const statCards = document.querySelectorAll('.stat-card');
        
        if (statCards.length >= 3) {
            // Streak card
            statCards[0].querySelector('.value').textContent = stats.currentStreak;
            statCards[0].querySelector('.label').textContent = 'Day Streak';
            
            // Badges card
            statCards[1].querySelector('.value').textContent = stats.badgesEarned;
            statCards[1].querySelector('.label').textContent = 'Badges Earned';
            
            // Average score card
            statCards[2].querySelector('.value').textContent = `${stats.averageScore}%`;
            statCards[2].querySelector('.label').textContent = 'Avg Score';
        }
    }

    updateProfileStats(stats) {
        const profileStats = document.querySelectorAll('.stat-item');
        if (profileStats.length >= 3) {
            // Overall progress
            profileStats[0].querySelector('.stat-value').textContent = `${stats.overallProgress}%`;
            profileStats[0].querySelector('.stat-label').textContent = 'Overall Progress';
            
            // Current streak
            profileStats[1].querySelector('.stat-value').textContent = stats.currentStreak;
            profileStats[1].querySelector('.stat-label').textContent = 'Day Streak';
            
            // Completed modules
            profileStats[2].querySelector('.stat-value').textContent = `${stats.completedModules}/${stats.totalModules}`;
            profileStats[2].querySelector('.stat-label').textContent = 'Modules Completed';
        }
    }

    updateUserLevel(stats) {
        let level = 1;
        let title = 'Cyber Rookie';

        if (stats.overallProgress >= 80) {
            level = 4;
            title = 'Cyber Master';
        } else if (stats.overallProgress >= 60) {
            level = 3;
            title = 'Cyber Expert';
        } else if (stats.overallProgress >= 30) {
            level = 2;
            title = 'Cyber Apprentice';
        }

        const levelBadge = document.querySelector('.level-badge');
        const levelTitle = document.querySelector('.level-title');
        
        if (levelBadge && levelTitle) {
            levelBadge.textContent = `Level ${level}`;
            levelTitle.textContent = title;
        }
    }

    updateBadgeCount(badgeCount) {
        const badgeElements = document.querySelectorAll('.badge-count, .badge-value');
        badgeElements.forEach(element => {
            if (element.classList.contains('badge-count') || element.classList.contains('badge-value')) {
                element.textContent = badgeCount;
            }
        });
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
                    if (title) title.textContent = this.getModuleTitle(continueModule.moduleId || continueModule.id);
                }
                
                if (progressBar) {
                    progressBar.style.width = `${continueModule.progress || 0}%`;
                }
                
                if (progressText) {
                    progressText.textContent = `${continueModule.progress || 0}% complete`;
                }
                
                const continueBtn = continueLearningCard.querySelector('.btn-continue');
                if (continueBtn) {
                    continueBtn.setAttribute('data-module', continueModule.moduleId || continueModule.id);
                    continueBtn.onclick = () => {
                        if (window.moduleContentManager) {
                            window.moduleContentManager.openModule(continueModule.moduleId || continueModule.id);
                        }
                    };
                }
            } else {
                // If no modules in progress, suggest starting the first one
                const moduleInfo = continueLearningCard.querySelector('.module-info');
                const progressBar = continueLearningCard.querySelector('.progress-fill');
                const progressText = continueLearningCard.querySelector('.module-progress span');
                
                if (moduleInfo) {
                    const title = moduleInfo.querySelector('h4');
                    if (title) title.textContent = 'Phishing Awareness';
                }
                
                if (progressBar) {
                    progressBar.style.width = '0%';
                }
                
                if (progressText) {
                    progressText.textContent = 'Start learning';
                }
                
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

        const newToggle = themeToggle.cloneNode(true);
        themeToggle.parentNode.replaceChild(newToggle, themeToggle);

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('cybersafe-theme');
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        console.log('📋 Initial theme:', { savedTheme, prefersDark, initialTheme });

        this.applyTheme(initialTheme);

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
        
        document.documentElement.removeAttribute('data-theme');
        
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

     async loadProfileData() {
        console.log('🛡️ Loading profile data...');
        
        const user = firebase.auth().currentUser;
        if (!user) {
            console.log('❌ No user logged in');
            return;
        }

        try {
            if (window.modulesManager) {
                await window.modulesManager.loadBadges();
            }

            if (window.profileManager) {
                await window.profileManager.loadUserProfile();
            }

            if (window.firestoreService) {
                await this.loadUserProgress();
            }

        } catch (error) {
            console.error('❌ Error loading profile data:', error);
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