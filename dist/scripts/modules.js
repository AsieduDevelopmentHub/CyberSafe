class ModulesManager {
    constructor() {
        this.modules = [
            {
                id: 'phishing',
                title: 'Phishing Awareness',
                description: 'Learn to identify and avoid email scams and phishing attempts',
                icon: 'fas fa-fish',
                progress: 0, // Will be updated from Firestore
                duration: '30 min',
                lessons: 5,
                category: 'Foundation',
                color: '#00B8D9'
            },
            {
                id: 'passwords',
                title: 'Password Security',
                description: 'Create strong passwords and manage them securely',
                icon: 'fas fa-key',
                progress: 0, // Will be updated from Firestore
                duration: '25 min',
                lessons: 4,
                category: 'Foundation',
                color: '#FF6F00'
            },
            {
                id: 'social',
                title: 'Social Engineering',
                description: 'Recognize and defend against manipulation tactics',
                icon: 'fas fa-users',
                progress: 0, // Will be updated from Firestore
                duration: '35 min',
                lessons: 6,
                category: 'Intermediate',
                color: '#10B981'
            },
            {
                id: 'network',
                title: 'Network Security',
                description: 'Safe browsing practices and VPN usage',
                icon: 'fas fa-wifi',
                progress: 0, // Will be updated from Firestore
                duration: '40 min',
                lessons: 5,
                category: 'Intermediate',
                color: '#8B5CF6'
            },
            {
                id: 'data',
                title: 'Data Protection',
                description: 'Secure your personal information online',
                icon: 'fas fa-database',
                progress: 0, // Will be updated from Firestore
                duration: '45 min',
                lessons: 6,
                category: 'Advanced',
                color: '#EF4444'
            },
            {
                id: 'mobile',
                title: 'Mobile Security',
                description: 'App permissions and device safety',
                icon: 'fas fa-mobile-alt',
                progress: 0, // Will be updated from Firestore
                duration: '30 min',
                lessons: 4,
                category: 'Advanced',
                color: '#F59E0B'
            }
        ];

        this.caseStudies = [
            {
                id: 'equifax',
                title: 'Equifax Data Breach',
                description: 'Analysis of the 2017 Equifax data breach that exposed 147 million records',
                icon: 'fas fa-chart-line',
                duration: '15 min',
                lessons: 'Data exposure, response failures'
            },
            {
                id: 'wannacry',
                title: 'WannaCry Ransomware',
                description: 'Global ransomware attack that affected 150 countries in 2017',
                icon: 'fas fa-virus',
                duration: '20 min',
                lessons: 'Patch management, backup strategies'
            },
            {
                id: 'target',
                title: 'Target Breach',
                description: '2013 retail breach through third-party vendor access',
                icon: 'fas fa-shopping-cart',
                duration: '18 min',
                lessons: 'Third-party risk, network segmentation'
            }
        ];

        this.badges = [
            {
                id: 'quick_learner',
                name: 'Quick Learner',
                description: 'Complete a module in one sitting',
                icon: 'fas fa-bolt',
                earned: false
            },
            {
                id: 'phishing_expert',
                name: 'Phishing Expert',
                description: 'Score 100% on Phishing Awareness quiz',
                icon: 'fas fa-fish',
                earned: false
            },
            {
                id: 'streak_starter',
                name: 'Streak Starter',
                description: 'Maintain a 3-day learning streak',
                icon: 'fas fa-fire',
                earned: false
            },
            {
                id: 'password_master',
                name: 'Password Master',
                description: 'Complete Password Security module',
                icon: 'fas fa-key',
                earned: false
            },
            {
                id: 'case_analyst',
                name: 'Case Analyst',
                description: 'Complete 3 case studies',
                icon: 'fas fa-briefcase',
                earned: false
            },
            {
                id: 'security_pro',
                name: 'Security Pro',
                description: 'Complete all foundation modules',
                icon: 'fas fa-shield-alt',
                earned: false
            }
        ];
    }

    async loadModules() {
        const modulesList = document.getElementById('modulesList');
        if (!modulesList) return;

        try {
            // Get real progress data from Firestore
            await this.updateModulesWithRealProgress();
            
            modulesList.innerHTML = this.modules.map(module => this.createModuleElement(module)).join('');

            // Add click events to module cards
            modulesList.querySelectorAll('.module-card').forEach((card, index) => {
                const moduleId = this.modules[index].id;
                const continueBtn = card.querySelector('.btn-continue');
                if (continueBtn) {
                    continueBtn.addEventListener('click', () => {
                        if (window.moduleContentManager) {
                            window.moduleContentManager.openModule(moduleId);
                        }
                    });
                }
            });
            this.setupFeaturedModulesEvents();

            console.log('✅ Modules loaded with real progress data');
        } catch (error) {
            console.error('❌ Error loading modules:', error);
            // Fallback to static data if Firestore fails
            modulesList.innerHTML = this.modules.map(module => this.createModuleElement(module)).join('');
        }
    }

    async updateModulesWithRealProgress() {
        const user = firebase.auth().currentUser;
        if (!user || !window.firestoreService) {
            console.log('👤 No user logged in, using default progress');
            return;
        }

        try {
            console.log('📊 Fetching real module progress from Firestore...');
            
            // Get all module progress from Firestore
            const modulesProgress = await this.getUserModulesProgress(user.uid);
            
            // Update each module with real progress
            this.modules.forEach(module => {
                const moduleProgress = modulesProgress.find(mp => mp.moduleId === module.id);
                if (moduleProgress) {
                    module.progress = moduleProgress.progress || 0;
                    module.completed = moduleProgress.completed || false;
                    module.score = moduleProgress.score || 0;
                    console.log(`✅ ${module.title}: ${module.progress}% progress`);
                } else {
                    module.progress = 0;
                    module.completed = false;
                    module.score = 0;
                    console.log(`❌ ${module.title}: No progress data found`);
                }
            });

            // Update badges based on real progress
            await this.updateBadgesWithRealProgress(user.uid);

        } catch (error) {
            console.error('❌ Error updating modules with real progress:', error);
        }
    }

    async getUserModulesProgress(uid) {
        try {
            const modulesSnapshot = await firebase.firestore()
                .collection('user_progress')
                .doc(uid)
                .collection('modules')
                .get();
            
            const modulesProgress = modulesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    moduleId: data.moduleId,
                    progress: data.progress || 0,
                    completed: data.completed || false,
                    score: data.score || 0,
                    lastUpdated: data.lastUpdated
                };
            });

            console.log('📈 Module progress from Firestore:', modulesProgress);
            return modulesProgress;
        } catch (error) {
            console.error('Error getting user modules progress:', error);
            return [];
        }
    }

    async updateBadgesWithRealProgress(uid) {
        try {
            const userBadges = await window.firestoreService.getUserBadges(uid);
            
            // Update badge earned status based on Firestore data
            this.badges.forEach(badge => {
                const userHasBadge = userBadges.some(userBadge => userBadge.id === badge.id);
                badge.earned = userHasBadge;
            });

            console.log('🛡️ Badges updated with real data:', this.badges.filter(b => b.earned).length + ' earned');
        } catch (error) {
            console.error('Error updating badges:', error);
        }
    }
    
    // Add this method to your ModulesManager class in modules.js
setupFeaturedModulesEvents() {
    const featuredModulesGrid = document.querySelector('.modules-grid');
    if (!featuredModulesGrid) return;

    featuredModulesGrid.addEventListener('click', (e) => {
        const moduleItem = e.target.closest('.module-item');
        if (moduleItem && window.moduleContentManager) {
            const moduleId = moduleItem.getAttribute('data-module');
            console.log('🎯 Featured module clicked:', moduleId);
            window.moduleContentManager.openModule(moduleId);
        }
    });
    
    console.log('✅ Featured modules events setup');
}

    createModuleElement(module) {
        const isActive = module.progress > 0;
        const continueIcon = module.progress > 0 ? 'play' : 'lock';
        const continueText = module.progress > 0 ? 'Continue' : 'Start';
        
        return `
            <div class="section-card module-card ${isActive ? 'active-module' : ''}">
                <div class="module-icon" style="background: linear-gradient(135deg, ${module.color}, ${this.lightenColor(module.color, 20)})">
                    <i class="${module.icon}"></i>
                </div>
                <div class="module-info">
                    <div class="module-header">
                        <h4>${module.title}</h4>
                        <span class="module-category">${module.category}</span>
                    </div>
                    <p>${module.description}</p>
                    <div class="module-meta">
                        <span><i class="fas fa-clock"></i> ${module.duration}</span>
                        <span><i class="fas fa-book"></i> ${module.lessons} lessons</span>
                    </div>
                    <div class="module-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${module.progress}%"></div>
                        </div>
                        <span>${module.progress}% complete</span>
                    </div>
                </div>
                <button class="btn-continue" data-module="${module.id}" title="${continueText} ${module.title}">
                    <i class="fas fa-${continueIcon}"></i>
                </button>
            </div>
        `;
    }

    // loadCaseStudies() {
    //     const caseStudiesList = document.getElementById('caseStudiesList');
    //     if (!caseStudiesList) return;

    //     caseStudiesList.innerHTML = this.caseStudies.map(study => this.createCaseStudyElement(study)).join('');
    // }

    // createCaseStudyElement(study) {
    //     return `
    //         <div class="section-card case-study-card">
    //             <div class="case-study-header">
    //                 <div class="case-study-icon">
    //                     <i class="${study.icon}"></i>
    //                 </div>
    //                 <div>
    //                     <h4>${study.title}</h4>
    //                     <p>${study.description}</p>
    //                 </div>
    //             </div>
    //             <div class="case-study-meta">
    //                 <span><i class="fas fa-clock"></i> ${study.duration}</span>
    //                 <span><i class="fas fa-graduation-cap"></i> ${study.lessons}</span>
    //             </div>
    //             <button class="btn-primary">
    //                 <span>Start Case Study</span>
    //                 <i class="fas fa-arrow-right"></i>
    //             </button>
    //         </div>
    //     `;
    // }

    loadBadges() {
        const badgesGrid = document.getElementById('badgesGrid');
        if (!badgesGrid) return;

        badgesGrid.innerHTML = this.badges.map(badge => this.createBadgeElement(badge)).join('');
    }

    createBadgeElement(badge) {
        return `
            <div class="badge-item ${badge.earned ? 'earned' : ''}">
                <div class="badge-icon">
                    <i class="${badge.icon}"></i>
                </div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-desc">${badge.description}</div>
            </div>
        `;
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }

    // Method to refresh modules with latest progress
    async refreshModules() {
        console.log('🔄 Refreshing modules with latest progress...');
        await this.updateModulesWithRealProgress();
        
        // Update the modules list if it's currently visible
        const modulesList = document.getElementById('modulesList');
        if (modulesList && modulesList.innerHTML) {
            modulesList.innerHTML = this.modules.map(module => this.createModuleElement(module)).join('');
        }
    }
}

// Initialize Modules Manager
document.addEventListener('DOMContentLoaded', () => {
    window.modulesManager = new ModulesManager();
});