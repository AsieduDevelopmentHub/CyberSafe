class ModulesManager {
    constructor() {
        this.modules = [
            {
                id: 'phishing',
                title: 'Phishing Awareness',
                description: 'Learn to identify and avoid email scams and phishing attempts',
                icon: 'fas fa-fish',
                progress: 0,
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
                progress: 0,
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
                progress: 0,
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
                progress: 0,
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
                progress: 0,
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
                progress: 0,
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
                description: 'Complete a module in under 24 hours',
                icon: 'fas fa-bolt',
                earned: false,
                criteria: 'complete_module_fast'
            },
            {
                id: 'phishing_expert',
                name: 'Phishing Expert',
                description: 'Score 100% on Phishing Awareness quiz',
                icon: 'fas fa-fish',
                earned: false,
                criteria: 'perfect_quiz_score'
            },
            {
                id: 'streak_starter',
                name: 'Streak Starter',
                description: 'Maintain a 3-day learning streak',
                icon: 'fas fa-fire',
                earned: false,
                criteria: 'learning_streak'
            },
            {
                id: 'passwords_expert',
                name: 'Password Master',
                description: 'Complete Password Security module',
                icon: 'fas fa-key',
                earned: false,
                criteria: 'module_completion'
            },
            {
                id: 'case_analyst',
                name: 'Case Analyst',
                description: 'Complete 3 case studies',
                icon: 'fas fa-briefcase',
                earned: false,
                criteria: 'case_study_completion'
            },
            {
                id: 'security_pro',
                name: 'Security Pro',
                description: 'Complete all foundation modules',
                icon: 'fas fa-shield-alt',
                earned: false,
                criteria: 'foundation_completion'
            },
            {
                id: 'social_expert',
                name: 'Social Engineering Expert',
                description: 'Complete Social Engineering module',
                icon: 'fas fa-users',
                earned: false,
                criteria: 'module_completion'
            },
            {
                id: 'network_expert',
                name: 'Network Guardian',
                description: 'Complete Network Security module',
                icon: 'fas fa-wifi',
                earned: false,
                criteria: 'module_completion'
            },
            {
                id: 'data_expert',
                name: 'Data Protection Specialist',
                description: 'Complete Data Protection module',
                icon: 'fas fa-database',
                earned: false,
                criteria: 'module_completion'
            },
            {
                id: 'mobile_expert',
                name: 'Mobile Security Defender',
                description: 'Complete Mobile Security module',
                icon: 'fas fa-mobile-alt',
                earned: false,
                criteria: 'module_completion'
            },
            {
                id: 'early_bird',
                name: 'Early Bird',
                description: 'Complete your first module',
                icon: 'fas fa-feather',
                earned: false,
                criteria: 'first_module'
            },
            {
                id: 'quiz_champion',
                name: 'Quiz Champion',
                description: 'Score 90% or higher on 5 quizzes',
                icon: 'fas fa-trophy',
                earned: false,
                criteria: 'quiz_master'
            },
            {
                id: 'dedicated_learner',
                name: 'Dedicated Learner',
                description: 'Complete 10 learning sessions',
                icon: 'fas fa-graduation-cap',
                earned: false,
                criteria: 'learning_sessions'
            },
            {
                id: 'speed_racer',
                name: 'Speed Racer',
                description: 'Complete a quiz in under 2 minutes',
                icon: 'fas fa-stopwatch',
                earned: false,
                criteria: 'fast_quiz'
            },
            {
                id: 'perfectionist',
                name: 'Perfectionist',
                description: 'Get perfect scores on 3 different modules',
                icon: 'fas fa-star',
                earned: false,
                criteria: 'multiple_perfect_scores'
            }
        ];
    }

    async loadModules() {
        const modulesList = document.getElementById('modulesList');
        if (!modulesList) return;

        try {
            await this.updateModulesWithRealProgress();
            
            modulesList.innerHTML = this.modules.map(module => this.createModuleElement(module)).join('');

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
            
            const modulesProgress = await this.getUserModulesProgress(user.uid);
            
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
            
            // Check for new badges based on user activity
            await this.checkAndAwardBadges(uid);
            
            // Update badge earned status
            this.badges.forEach(badge => {
                const userHasBadge = userBadges.some(userBadge => userBadge.id === badge.id);
                badge.earned = userHasBadge;
            });

            console.log('🛡️ Badges updated with real data:', this.badges.filter(b => b.earned).length + ' earned');
        } catch (error) {
            console.error('Error updating badges:', error);
        }
    }

    // Check and award badges based on user activity
    async checkAndAwardBadges(uid) {
        try {
            console.log('🎯 Checking for new badges...');
            
            const [
                modulesProgress, 
                quizResults, 
                caseStudyResults, 
                learningSessions,
                userProfile
            ] = await Promise.all([
                this.getUserModulesProgress(uid),
                this.getQuizResults(uid),
                this.getCaseStudyResults(uid),
                this.getLearningSessions(uid),
                window.firestoreService.getUserProfile(uid)
            ]);

            const badgesToAward = [];

            // Check each badge criteria
            for (const badge of this.badges) {
                if (!badge.earned) {
                    const shouldAward = await this.checkBadgeCriteria(badge, {
                        modulesProgress,
                        quizResults,
                        caseStudyResults,
                        learningSessions,
                        userProfile
                    });
                    
                    if (shouldAward) {
                        badgesToAward.push(badge);
                    }
                }
            }

            // Award new badges
            for (const badge of badgesToAward) {
                await this.awardBadge(uid, badge);
                console.log(`🎉 Awarded badge: ${badge.name}`);
            }

        } catch (error) {
            console.error('Error checking badges:', error);
        }
    }

    // Check specific badge criteria
    async checkBadgeCriteria(badge, userData) {
        const { modulesProgress, quizResults, caseStudyResults, learningSessions, userProfile } = userData;

        switch (badge.criteria) {
            case 'first_module':
                return modulesProgress.some(module => module.completed);

            case 'module_completion':
                const targetModule = badge.id.replace('_expert', '').replace('_defender', '').replace('_specialist', '');
                return modulesProgress.some(module => 
                    module.moduleId === targetModule && module.completed
                );

            case 'perfect_quiz_score':
                return quizResults.some(quiz => 
                    quiz.moduleId === 'phishing' && quiz.score === 100
                );

            case 'complete_module_fast':
                // Check if any module was completed in under 24 hours
                const fastCompletions = modulesProgress.filter(module => {
                    if (!module.completed || !module.lastUpdated) return false;
                    const startTime = module.lastUpdated.toDate();
                    const endTime = new Date();
                    const hoursDiff = (endTime - startTime) / (1000 * 60 * 60);
                    return hoursDiff <= 24;
                });
                return fastCompletions.length > 0;

            case 'learning_streak':
                return (userProfile?.currentStreak || 0) >= 3;

            case 'case_study_completion':
                return caseStudyResults.length >= 3;

            case 'foundation_completion':
                const foundationModules = ['phishing', 'passwords'];
                return foundationModules.every(moduleId =>
                    modulesProgress.some(module => module.moduleId === moduleId && module.completed)
                );

            case 'quiz_master':
                const highScoreQuizzes = quizResults.filter(quiz => quiz.score >= 90);
                return highScoreQuizzes.length >= 5;

            case 'learning_sessions':
                return learningSessions.length >= 10;

            case 'fast_quiz':
                return quizResults.some(quiz => 
                    quiz.completionTime && quiz.completionTime <= 120 // 2 minutes in seconds
                );

            case 'multiple_perfect_scores':
                const perfectModules = new Set(
                    quizResults
                        .filter(quiz => quiz.score === 100)
                        .map(quiz => quiz.moduleId)
                );
                return perfectModules.size >= 3;

            default:
                return false;
        }
    }

    // Award badge to user
    async awardBadge(uid, badge) {
        try {
            const badgeData = {
                id: badge.id,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                earnedAt: firebase.firestore.FieldValue.serverTimestamp(),
                moduleId: this.getModuleIdFromBadge(badge.id)
            };

            await firebase.firestore()
                .collection('user_badges')
                .doc(uid)
                .collection('badges')
                .doc(badge.id)
                .set(badgeData);

            // Update local badge status
            badge.earned = true;

            console.log(`✅ Badge awarded: ${badge.name}`);

        } catch (error) {
            console.error('Error awarding badge:', error);
        }
    }

    // Get module ID from badge ID
    getModuleIdFromBadge(badgeId) {
        const moduleMap = {
            'phishing_expert': 'phishing',
            'passwords_expert': 'passwords',
            'social_expert': 'social',
            'network_expert': 'network',
            'data_expert': 'data',
            'mobile_expert': 'mobile'
        };
        return moduleMap[badgeId] || null;
    }

    // Get quiz results
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

    // Get case study results
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

    // Get learning sessions
    async getLearningSessions(uid) {
        try {
            const learningSessions = await firebase.firestore()
                .collection('user_activities')
                .doc(uid)
                .collection('activities')
                .where('type', 'in', ['video_watch', 'quiz_complete', 'module_start'])
                .get();
            
            return learningSessions.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Error getting learning sessions:', error);
            return [];
        }
    }
    
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

    async refreshModules() {
        console.log('🔄 Refreshing modules with latest progress...');
        await this.updateModulesWithRealProgress();
        
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