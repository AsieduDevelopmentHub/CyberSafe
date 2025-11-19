class ProfileManager {
    constructor() {
        this.realTimeListeners = [];
        this.isLoadingActivities = false;
        this.cache = {};
        this.CACHE_TIMEOUT = 120000; // 2min cache
        this.init();
    }

    // Caching helpers
    getCache(key) {
    // First check in-memory cache
    const entry = this.cache[key];
    if (entry && (Date.now() - entry.ts < this.CACHE_TIMEOUT)) {
        return entry.data;
    }
    // Then try localStorage
    try {
        const lsEntry = localStorage.getItem(key);
        if (lsEntry) {
            const parsed = JSON.parse(lsEntry);
            if (Date.now() - parsed.ts < this.CACHE_TIMEOUT) {
                // Update in-memory cache for faster next access
                this.cache[key] = parsed;
                return parsed.data;
            } else {
                // Expired data, remove it from storage
                localStorage.removeItem(key);
            }
        }
    } catch (e) {
        // localStorage unavailable or JSON parse error, ignore silently
    }
    return null;
}

    setCache(key, data) {
    const entry = { ts: Date.now(), data };
    // Update in-memory cache
    this.cache[key] = entry;
    // Also persist to localStorage
    try {
        localStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
        // localStorage may be full or unavailable; fail gracefully
    }
}
    async init() {
        try {
            this.setupEventListeners();
            await this.loadUserProfile();
            this.setupRealTimeUpdates();
        } catch (e) {
            console.error("Init error:", e);
        }
    }

    setupEventListeners() {
        try {
            const downloadBtn = document.querySelector('.profile-actions button:nth-child(1)');
            if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadProgressReport());

            const shareBtn = document.querySelector('.profile-actions button:nth-child(2)');
            if (shareBtn) shareBtn.addEventListener('click', () => this.shareProfile());

            const verifyEmailBtn = document.getElementById('verifyEmailBtn');
            if (verifyEmailBtn) {
                verifyEmailBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.authManager) window.authManager.resendVerificationEmail();
                });
            }
        } catch (e) {
            console.error("setupEventListeners error:", e);
        }
    }

    setupRealTimeUpdates() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return;

            const userListener = firebase.firestore().collection('users').doc(user.uid)
                .onSnapshot((doc) => {
                    if (doc.exists) this.updateRealTimeProfileData(doc.data());
                }, (error) => {
                    console.error('Real-time profile update error:', error);
                });

            const badgesListener = firebase.firestore().collection('user_badges').doc(user.uid)
                .collection('badges')
                .onSnapshot((snapshot) => {
                    if (!snapshot.empty && snapshot.docChanges().length > 0)
                        this.loadBadges(user.uid);
                }, (error) => {
                    console.error('Real-time badges update error:', error);
                });

            const activitiesListener = firebase.firestore().collection('user_activities').doc(user.uid)
                .collection('activities')
                .onSnapshot((snapshot) => {
                    if (!this.isLoadingActivities && snapshot.docChanges().length > 0) {
                        console.log('🔄 Real-time activity update detected');
                        this.updateActivitiesFromSnapshot(snapshot);
                    }
                }, (error) => {
                    console.error('Real-time activities update error:', error);
                });

            this.realTimeListeners = [userListener, badgesListener, activitiesListener];
        } catch (e) {
            console.error("setupRealTimeUpdates error:", e);
        }
    }

    updateActivitiesFromSnapshot(snapshot) {
        try {
            const activityList = document.getElementById('activityList');
            if (!activityList) return;

            const activities = snapshot.docs.map(doc => {
                const data = doc.data();
                const safeDate = this.formatDate(data.timestamp);
                return `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="${data.icon || 'fas fa-task'}"></i>
                        </div>
                        <div class="activity-info">
                            <p class="activity-title">${data.title}</p>
                            ${data.score ? `<span class="activity-score">Score: ${data.score}%</span>` : ''}
                            <span class="activity-time">${safeDate}</span>
                        </div>
                    </div>
                `;
            }).join('');

            activityList.innerHTML = activities || `
                <div class="empty-state">
                    <i class="fas fa-tasks"></i>
                    <p>Complete quizzes and case studies to see your activity here</p>
                </div>
            `;
        } catch (e) {
            console.error("updateActivitiesFromSnapshot error:", e);
        }
    }

    updateRealTimeProfileData(userData) {
        try {
            const streakElement = document.querySelector('.streak-counter');
            if (streakElement && userData.currentStreak !== undefined)
                streakElement.textContent = userData.currentStreak;

            const progressElement = document.querySelector('.progress-percentage');
            if (progressElement && userData.overallProgress !== undefined)
                progressElement.textContent = `${userData.overallProgress}%`;

            const lastActiveElement = document.querySelector('.last-active');
            if (lastActiveElement && userData.lastActive)
                lastActiveElement.textContent = this.formatRelativeTime(userData.lastActive.toDate());

            const userNameElement = document.querySelector('.user-name');
            if (userNameElement && userData.name)
                userNameElement.textContent = userData.name;
        } catch (e) {
            console.error("updateRealTimeProfileData error:", e);
        }
    }

    async loadUserProfile() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) {
                console.log('No user logged in');
                return;
            }
            this.updateEmailVerificationStatus(user);

            // --- CACHE-FIRST profile loading ---
            let userData = this.getCache('userProfile');
            if (!userData) {
                userData = await window.firestoreService.getUserProfile(user.uid);
                this.setCache('userProfile', userData);
            }
            this.updateRealTimeProfileData(userData || {});

            await Promise.all([
                this.loadBadges(user.uid),
                this.loadRecentActivity(user.uid),
                this.loadCertifications(user.uid)
            ]);
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    }

    async getUserProgressStats(uid) {
        try {
            const [modulesProgress, quizResults, caseStudyResults, badges, streakData] = await Promise.all([
                this.getUserModulesProgress(uid),
                this.getQuizResults(uid),
                this.getCaseStudyResults(uid),
                this.getUserBadges(uid),
                this.getUserStreak(uid)
            ]);
            return await this.calculateComprehensiveStats(
                modulesProgress,
                quizResults,
                caseStudyResults,
                badges,
                streakData
            );
        } catch (error) {
            console.error('Error getting user progress stats:', error);
            return this.getDefaultProgressStats();
        }
    }

    async calculateComprehensiveStats(modulesProgress, quizResults, caseStudyResults, badges, streakData = {}) {
        try {
            const completedModules = modulesProgress.filter(module => module.completed);
            const moduleCompletionRate = modulesProgress.length > 0 ?
                (completedModules.length / 6) * 100 : 0;

            const allScores = [
                ...quizResults.map(quiz => quiz.score || 0),
                ...caseStudyResults.map(caseStudy => caseStudy.score || 0)
            ];
            const averageScore = allScores.length > 0 ?
                Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length) : 0;

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
                moduleCompletionRate: Math.round(moduleCompletionRate),
                modulesProgress: modulesProgress,
                quizResults: quizResults,
                caseStudyResults: caseStudyResults,
                badges: badges
            };
        } catch (e) {
            console.error("calculateComprehensiveStats error:", e);
            return this.getDefaultProgressStats();
        }
    }

    async getUserStreak(uid) {
        try {
            if (!window.firestoreService) return { currentStreak: 1, longestStreak: 1 };

            let cacheStreak = this.getCache('userStreak');
            if (cacheStreak) return cacheStreak;

            const userDoc = await firebase.firestore()
                .collection('users')
                .doc(uid)
                .get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const streak = {
                    currentStreak: userData.currentStreak || 1,
                    longestStreak: userData.longestStreak || 1,
                    lastLogin: userData.lastLogin
                };
                this.setCache('userStreak', streak);
                return streak;
            }
            return { currentStreak: 1, longestStreak: 1 };
        } catch (error) {
            console.error('Error getting user streak:', error);
            return { currentStreak: 1, longestStreak: 1 };
        }
    }

    getDefaultProgressStats() {
        return {
            overallProgress: 0,
            averageScore: 0,
            completedModules: 0,
            totalModules: 6,
            badgesEarned: 0,
            totalBadges: 6,
            currentStreak: 1,
            longestStreak: 1,
            totalQuizzes: 0,
            moduleCompletionRate: 0,
            modulesProgress: [],
            quizResults: [],
            caseStudyResults: [],
            badges: []
        };
    }
    
        async loadBadges(uid) {
        try {
            const badgesGrid = document.getElementById('badgesGrid');
            if (!badgesGrid) return;

            // --- CACHE-FIRST badges loading ---
            let cachedBadges = this.getCache(`badges-${uid}`);
            let badgesSnapshot = null;
            if (!cachedBadges) {
                badgesSnapshot = await firebase.firestore()
                    .collection('user_badges')
                    .doc(uid)
                    .collection('badges')
                    .get();
                cachedBadges = badgesSnapshot.docs.map(doc => doc.data());
                this.setCache(`badges-${uid}`, cachedBadges);
            }

            const defaultBadges = [
                {
                    id: 'phishing_expert',
                    name: 'Phishing Master',
                    description: 'Completed the Phishing Awareness module with excellence',
                    icon: 'fas fa-fish'
                },
                {
                    id: 'passwords_expert',
                    name: 'Password Guru',
                    description: 'Mastered password security best practices',
                    icon: 'fas fa-key'
                },
                {
                    id: 'social_expert',
                    name: 'Social Engineering Expert',
                    description: 'Expert in social engineering defense tactics',
                    icon: 'fas fa-users'
                },
                {
                    id: 'network_expert',
                    name: 'Network Guardian',
                    description: 'Mastered network security fundamentals',
                    icon: 'fas fa-wifi'
                },
                {
                    id: 'data_expert',
                    name: 'Data Protection Specialist',
                    description: 'Expert in data security and privacy',
                    icon: 'fas fa-database'
                },
                {
                    id: 'mobile_expert',
                    name: 'Mobile Security Defender',
                    description: 'Mastered mobile security best practices',
                    icon: 'fas fa-mobile-alt'
                }
            ];

            const availableBadges = window.modulesManager?.badges || defaultBadges;
            const badgesHtml = availableBadges.map(badge => {
                const earnedBadge = (cachedBadges || []).find(data =>
                    data.moduleId === badge.id || data.id === badge.id
                );
                const isEarned = !!earnedBadge;
                const earnedDate = earnedBadge ? this.formatDate(earnedBadge.earnedAt) : null;
                return `
                    <div class="badge-card ${isEarned ? 'earned' : 'locked'}">
                        <div class="badge-icon" style="background: ${isEarned ? 'var(--color-success-light)' : 'var(--color-muted)'}">
                            <i class="${badge.icon}" style="color: ${isEarned ? 'var(--color-success)' : 'var(--color-muted-dark)'}"></i>
                        </div>
                        <div class="badge-info">
                            <h4>${badge.name}</h4>
                            <p>${badge.description}</p>
                            ${isEarned ? `<span class="earned-date">Earned on ${earnedDate}</span>` : 
                             '<span class="locked-message">Complete module to unlock</span>'}
                        </div>
                        ${isEarned ? '<div class="earned-badge"><i class="fas fa-check"></i></div>' : ''}
                    </div>
                `;
            }).join('');

            badgesGrid.innerHTML = badgesHtml || `
                <div class="empty-state">
                    <i class="fas fa-trophy"></i>
                    <p>Complete modules to earn badges</p>
                </div>
            `;
        } catch (error) {
            console.error('Error loading badges:', error);
            const badgesGrid = document.getElementById('badgesGrid');
            if (badgesGrid) {
                badgesGrid.innerHTML = `
                    <div class="error-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Unable to load badges. Please try again later.</p>
                    </div>
                `;
            }
        }
    }

    async loadRecentActivity(uid) {
        this.isLoadingActivities = true;
        try {
            const activityList = document.getElementById('activityList');
            if (!activityList) return;

            activityList.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading your recent activities...</p>
                </div>
            `;

            // --- CACHE-FIRST activities loading ---
            let cachedActivities = this.getCache(`activities-${uid}`);
            let recentActivities = cachedActivities || [];
            let indexError = false;

            if (!cachedActivities) {
                const userActivitiesRef = firebase.firestore()
                    .collection('user_activities')
                    .doc(uid)
                    .collection('activities');
                       // Get current activities
        const activitiesSnapshot = await userActivitiesRef
            .orderBy('timestamp', 'desc')
            .limit(5)
            .get();

        // Try quiz results
        try {
            console.log('🔍 Fetching quiz results...');
            const quizResults = await firebase.firestore()
                .collection('quizResults')
                .where('userId', '==', uid)
                .orderBy('completedAt', 'desc')
                .limit(5)
                .get();
            
            if (quizResults.empty) {
                console.log('ℹ️ No quiz results found');
            } else {
                recentActivities.push(...quizResults.docs.map(doc => {
                    const data = doc.data();
                    console.log('✅ Found quiz:', data.moduleTitle);
                    
                    // FIX: Handle null timestamp
                    const timestamp = data.completedAt || new Date();
                    
                    return {
                        type: 'quiz',
                        title: `Completed ${data.moduleTitle} Quiz`,
                        score: data.score,
                        timestamp: timestamp,
                        icon: 'fas fa-check-circle'
                    };
                }));
                console.log('📊 Quiz results loaded:', quizResults.size);
            }
        } catch (quizError) {
            console.error('❌ Error fetching quiz results:', quizError);
            if (quizError.message.includes('requires an index')) {
                indexError = true;
            }
        }

        // Try case studies
        try {
            console.log('🔍 Fetching case studies...');
            const caseStudyResults = await firebase.firestore()
                .collection('caseStudyQuizzes')
                .where('userId', '==', uid)
                .orderBy('completedAt', 'desc')
                .limit(5)
                .get();
            
            if (caseStudyResults.empty) {
                console.log('ℹ️ No case study results found');
            } else {
                recentActivities.push(...caseStudyResults.docs.map(doc => {
                    const data = doc.data();
                    console.log('✅ Found case study:', data.title);
                    
                    // FIX: Handle null timestamp
                    const timestamp = data.completedAt || new Date();
                    
                    return {
                        type: 'case_study',
                        title: `Completed ${data.title} Case Study`,
                        score: data.score,
                        timestamp: timestamp,
                        icon: 'fas fa-briefcase'
                    };
                }));
                console.log('📊 Case study results loaded:', caseStudyResults.size);
            }
        } catch (caseError) {
            console.error('❌ Error fetching case studies:', caseError);
            if (caseError.message.includes('requires an index')) {
                indexError = true;
            }
        }

        // Try badges
        try {
            console.log('🔍 Fetching badge earnings...');
            const badgeEarnings = await firebase.firestore()
                .collection('user_badges')
                .doc(uid)
                .collection('badges')
                .orderBy('earnedAt', 'desc')
                .limit(5)
                .get();
            
            if (badgeEarnings.empty) {
                console.log('ℹ️ No badge earnings found');
            } else {
                recentActivities.push(...badgeEarnings.docs.map(doc => {
                    const data = doc.data();
                    console.log('✅ Found badge:', data.name);
                    
                    // FIX: Handle null timestamp
                    const timestamp = data.earnedAt || new Date();
                    
                    return {
                        type: 'badge',
                        title: `Earned ${data.name} Badge`,
                        timestamp: timestamp,
                        icon: 'fas fa-trophy'
                    };
                }));
                console.log('📊 Badge earnings loaded:', badgeEarnings.size);
            }
        } catch (badgeError) {
            console.error('❌ Error fetching badges:', badgeError);
        }

        if (indexError) {
            activityList.innerHTML = `
                <div class="info-message">
                    <i class="fas fa-info-circle"></i>
                    <p>Setting up activity tracking... This may take a few minutes.</p>
                </div>
            `;
            return;
        }
                // after fetching, store to cache
                this.setCache(`activities-${uid}`, recentActivities);
            }

            recentActivities.sort((a, b) => {
                const timeA = this.getSafeTimestamp(a.timestamp);
                const timeB = this.getSafeTimestamp(b.timestamp);
                return timeB - timeA;
            });
            const latestActivities = recentActivities.slice(0, 5);

            // UI rendering unchanged
            if (latestActivities.length > 0) {
                activityList.innerHTML = latestActivities.map(activity => {
                    const safeDate = this.formatDate(activity.timestamp);
                    return `
                        <div class="activity-item">
                            <div class="activity-icon"><i class="${activity.icon}"></i></div>
                            <div class="activity-info">
                                <p class="activity-title">${activity.title}</p>
                                ${activity.score ? `<span class="activity-score">Score: ${activity.score}%</span>` : ''}
                                <span class="activity-time">${safeDate}</span>
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                activityList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-tasks"></i>
                        <p>Complete quizzes and case studies to see your activity here</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading recent activity:', error);
            const activityList = document.getElementById('activityList');
            if (activityList) {
                activityList.innerHTML = `
                    <div class="error-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Unable to load activities. Please try again later.</p>
                    </div>
                `;
            }
        } finally {
            setTimeout(() => {
                this.isLoadingActivities = false;
            }, 1000);
        }
    }

    async loadCertifications(uid) {
        try {
            const certificationsGrid = document.getElementById('certificationsGrid');
            if (!certificationsGrid) return;

            let cachedCerts = this.getCache(`certs-${uid}`);
            if (!cachedCerts) {
                const certifications = await firebase.firestore()
                    .collection('userCertifications')
                    .where('userId', '==', uid)
                    .orderBy('earnedAt', 'desc')
                    .get();
                cachedCerts = certifications.docs.map(doc => doc.data());
                this.setCache(`certs-${uid}`, cachedCerts);
            }

            certificationsGrid.innerHTML = cachedCerts.map(cert => {
                return `
                    <div class="certification-card">
                        <div class="certification-header">
                            <div class="certification-icon"><i class="fas fa-certificate"></i></div>
                            <div class="certification-info">
                                <h4>${cert.name}</h4>
                                <span class="certification-date">${this.formatDate(cert.earnedAt)}</span>
                            </div>
                        </div>
                        <div class="certification-details">
                            <p>${cert.description}</p>
                            <button class="btn-secondary" onclick="window.profileManager.downloadCertificate('${cert.id}')">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                    </div>
                `;
            }).join('') || `
                <div class="empty-state">
                    <i class="fas fa-certificate"></i>
                    <p>Complete modules to earn certifications</p>
                </div>
            `;
        } catch (error) {
            console.error('Error loading certifications:', error);
            const certificationsGrid = document.getElementById('certificationsGrid');
            if (certificationsGrid) {
                certificationsGrid.innerHTML = `
                    <div class="error-state">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>Unable to load certifications. Please try again later.</p>
                    </div>
                `;
            }
        }
    }

    // Helper: null-safe timestamp
    getSafeTimestamp(timestamp) {
        if (!timestamp) return new Date();
        if (timestamp.toDate && typeof timestamp.toDate === 'function') return timestamp.toDate();
        if (timestamp instanceof Date) return timestamp;
        if (typeof timestamp === 'string' || typeof timestamp === 'number') return new Date(timestamp);
        console.warn('Invalid timestamp format, using current time:', timestamp);
        return new Date();
    }

    formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    formatRelativeTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return this.formatDate(date);
    }

    async downloadProgressReport() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) {
                this.showError('Please log in to download your progress report');
                return;
            }
            this.showLoading('Generating your progress report...');
            const progressStats = await this.getUserProgressStats(user.uid);
            const userData = await window.firestoreService.getUserProfile(user.uid);
            const pdfContent = this.generatePDFReport({
                user: {
                    name: userData?.name || user.displayName || 'CyberSafe User',
                    email: user.email,
                    joinDate: userData?.createdAt ? this.formatDate(userData.createdAt) : this.formatDate(new Date()),
                    lastActive: userData?.lastActive ? this.formatDate(userData.lastActive) : 'Today'
                },
                progress: {
                    overallProgress: progressStats.overallProgress,
                    completedModules: progressStats.completedModules,
                    totalModules: 6,
                    averageScore: progressStats.averageScore,
                    badgesEarned: progressStats.badgesEarned,
                    certificationsEarned: progressStats.certifications?.length || 0,
                    currentStreak: progressStats.currentStreak,
                    totalLearningTime: userData?.totalLearningTime || '0 hours'
                },
                moduleDetails: progressStats.modulesProgress.map(module => ({
                    module: this.getModuleTitle(module.moduleId),
                    progress: module.progress || 0,
                    completed: module.completed || false,
                    score: module.score || 0,
                    lastUpdated: module.lastUpdated ? this.formatDate(module.lastUpdated) : 'N/A'
                })),
                recentQuizzes: [...progressStats.quizResults, ...progressStats.caseStudyResults]
                    .slice(0, 10)
                    .sort((a, b) => new Date(b.completedAt || b.timestamp) - new Date(a.completedAt || a.timestamp))
                    .map(quiz => ({
                        module: quiz.moduleTitle || quiz.title || 'Unknown Module',
                        score: quiz.score,
                        date: this.formatDate(quiz.completedAt || quiz.timestamp),
                        type: quiz.type || 'Quiz'
                    })),
                earnedBadges: progressStats.badges.slice(0, 10).map(badge => ({
                    name: badge.name,
                    description: badge.description,
                    earnedDate: this.formatDate(badge.earnedAt)
                })),
                certifications: (await this.getUserCertifications(user.uid)).slice(0, 5).map(cert => ({
                    name: cert.name,
                    description: cert.description,
                    earnedDate: this.formatDate(cert.earnedAt)
                })),
                generatedAt: new Date().toLocaleString()
            });
            this.downloadPDF(pdfContent, `cybersafe-report-${new Date().toISOString().split('T')[0]}.pdf`);
            this.showSuccess('PDF progress report downloaded successfully!');
        } catch (error) {
            console.error('Error generating PDF report:', error);
            this.showError('Failed to generate progress report. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    generatePDFReport(reportData) {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>CyberSafe Progress Report</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 40px; 
            color: #333;
            background: linear-gradient(135deg, #0A1F44 0%, #1E3A8A 100%);
            line-height: 1.6;
        }
        .report-container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            max-width: 1000px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #667eea;
            margin: 0;
            font-size: 2.5em;
            font-weight: 700;
        }
        .header .subtitle {
            color: #666;
            font-size: 1.2em;
            margin-top: 10px;
        }
        .generated-date {
            color: #888;
            font-size: 0.9em;
            margin-top: 10px;
        }
        .user-info {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 30px;
            border-left: 5px solid #667eea;
        }
        .user-info h2 {
            color: #667eea;
            margin-top: 0;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            margin: 10px 0;
        }
        .stat-label {
            font-size: 0.9em;
            opacity: 0.9;
        }
        .section {
            margin: 40px 0;
        }
        .section-title {
            color: #667eea;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 1.5em;
            font-weight: 600;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 0.95em;
        }
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
        }
        th {
            background: #667eea;
            color: white;
            font-weight: 600;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .badge-item, .cert-item {
            background: #f8f9fa;
            padding: 15px;
            margin: 10px 0;
            border-radius: 10px;
            border-left: 4px solid #28a745;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #666;
            font-size: 0.9em;
            border-top: 1px solid #e9ecef;
            padding-top: 20px;
        }
        .progress-bar {
            background: #e9ecef;
            border-radius: 10px;
            height: 10px;
            margin: 10px 0;
            overflow: hidden;
        }
        .progress-fill {
            background: linear-gradient(90deg, #667eea, #764ba2);
            height: 100%;
            border-radius: 10px;
            transition: width 0.3s ease;
        }
        .score-excellent { color: #28a745; font-weight: bold; }
        .score-good { color: #ffc107; font-weight: bold; }
        .score-poor { color: #dc3545; font-weight: bold; }
        @media print {
            body { background: linear-gradient(135deg, #0A1F44 0%, #1E3A8A 100%); }
            .progress-fill {
            background: linear-gradient(90deg, #667eea, #764ba2);
            height: 100%;
            border-radius: 10px;
            transition: width 0.3s ease;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
    </style>
</head>
<body>
    <div class="report-container">
        <div class="header">
            <img src="https://cybersafe.auralenx.com/assets/icons/logo.svg" alt="CyberSafe Logo" width="50px" height="50px">
            <h1> CyberSafe Progress Report</h1>
            <div class="subtitle">Comprehensive Learning Analytics & Achievements</div>
            <div class="generated-date">Generated on ${reportData.generatedAt}</div>
        </div>

        <div class="user-info">
            <h2>User Information</h2>
            <p><strong>Name:</strong> ${reportData.user.name}</p>
            <p><strong>Email:</strong> ${reportData.user.email}</p>
            <p><strong>Member Since:</strong> ${reportData.user.joinDate}</p>
            <p><strong>Last Active:</strong> ${reportData.user.lastActive}</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Overall Progress</div>
                <div class="stat-number">${reportData.progress.overallProgress}%</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Completed Modules</div>
                <div class="stat-number">${reportData.progress.completedModules}/${reportData.progress.totalModules}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Average Score</div>
                <div class="stat-number">${reportData.progress.averageScore}%</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Current Streak</div>
                <div class="stat-number">${reportData.progress.currentStreak} days</div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">📊 Module Progress Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Module</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Score</th>
                        <th>Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.moduleDetails.map(module => `
                        <tr>
                            <td><strong>${module.module}</strong></td>
                            <td>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${module.progress}%"></div>
                                </div>
                                ${module.progress}%
                            </td>
                            <td>${module.completed ? '✅ Completed' : '🔄 In Progress'}</td>
                            <td class="${module.score >= 80 ? 'score-excellent' : module.score >= 60 ? 'score-good' : 'score-poor'}">
                                ${module.score}%
                            </td>
                            <td>${module.lastUpdated}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2 class="section-title">🎯 Recent Quiz Performance</h2>
            <table>
                <thead>
                    <tr>
                        <th>Quiz/Case Study</th>
                        <th>Score</th>
                        <th>Date Completed</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.recentQuizzes.map(quiz => `
                        <tr>
                            <td>${quiz.module}</td>
                            <td class="${quiz.score >= 80 ? 'score-excellent' : quiz.score >= 60 ? 'score-good' : 'score-poor'}">
                                ${quiz.score}%
                            </td>
                            <td>${quiz.date}</td>
                            <td>${quiz.type}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2 class="section-title">🏆 Earned Badges (${reportData.earnedBadges.length})</h2>
            ${reportData.earnedBadges.length > 0 ? 
                reportData.earnedBadges.map(badge => `
                    <div class="badge-item">
                        <strong>${badge.name}</strong>
                        <p>${badge.description}</p>
                        <small>Earned on: ${badge.earnedDate}</small>
                    </div>
                `).join('') : 
                '<p>No badges earned yet. Complete modules to earn badges!</p>'
            }
        </div>

        <div class="section">
            <h2 class="section-title">📜 Certifications (${reportData.certifications.length})</h2>
            ${reportData.certifications.length > 0 ? 
                reportData.certifications.map(cert => `
                    <div class="cert-item">
                        <strong>${cert.name}</strong>
                        <p>${cert.description}</p>
                        <small>Awarded on: ${cert.earnedDate}</small>
                    </div>
                `).join('') : 
                '<p>No certifications earned yet. Continue learning to earn certifications!</p>'
            }
        </div>

        <div class="footer">
            <p><strong>CyberSafe - Enterprise Cybersecurity Education Platform</strong></p>
            <p>This report was automatically generated by the CyberSafe system.</p>
            <p style="color: #dc3545; font-weight: bold;">Confidential - For ${reportData.user.name} only</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    downloadPDF(content, filename) {
        // Method 1: Open in new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write(content);
        printWindow.document.close();
        
        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
        }, 500);

        // Method 2: Download as HTML file (can be converted to PDF)
        this.downloadFile(content, filename, 'text/html');
    }

    async shareProfile() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) {
                this.showError('Please log in to share your profile');
                return;
            }

            // Show sharing options
            this.showShareModal(user.uid);

        } catch (error) {
            console.error('Error sharing profile:', error);
            this.showError('Failed to share profile. Please try again.');
        }
    }

    async showShareModal(uid) {
        // Get current progress data using the same method as dashboard
        const progressStats = await this.getUserProgressStats(uid);
        const userData = await window.firestoreService.getUserProfile(uid);

        // Use the accurate progress from dashboard calculation
        const overallProgress = progressStats.overallProgress;
        const completedModules = progressStats.completedModules;
        const badgesEarned = progressStats.badgesEarned;
        const currentStreak = progressStats.currentStreak;

        // Create shareable content with accurate data
        const shareData = {
            title: "My CyberSafe Progress",
            text: `Check out my cybersecurity training progress! I've completed ${overallProgress}% of modules, earned ${badgesEarned} badges, and maintained a ${currentStreak}-day streak. Join me in learning cybersecurity!`,
            url: window.location.origin,
            progress: overallProgress,
            modulesCompleted: completedModules,
            badgesEarned: badgesEarned,
            streak: currentStreak
        };

        // Create modal for share options
        const modalHtml = `
            <div class="share-modal-overlay" id="shareModalOverlay">
                <div class="share-modal">
                    <div class="share-header">
                        <div class="share-header-content">
                            <img src='https://cybersafe.auralenx.com/assets/icons/logo.svg' alt='CyberSafe Logo' width='30px' height='30px'>
                            <h3>Share Your Progress</h3>
                        </div>
                        <button class="close-modal" id="closeShareModal">&times;</button>
                    </div>
                    <div class="share-preview">
                        <div class="progress-share-card">
                            <div class="share-card-header">
                                <h4>${userData?.name || 'CyberSafe User'}'s Progress</h4>
                                <div class="overall-progress">${overallProgress}% Complete</div>
                            </div>
                            <div class="share-stats">
                                <div class="share-stat">
                                    <span class="stat-number">${completedModules}/6</span>
                                    <span class="stat-label">Modules</span>
                                </div>
                                <div class="share-stat">
                                    <span class="stat-number">${badgesEarned}</span>
                                    <span class="stat-label">Badges</span>
                                </div>
                                <div class="share-stat">
                                    <span class="stat-number">${currentStreak}</span>
                                    <span class="stat-label">Day Streak</span>
                                </div>
                            </div>
                            <div class="share-message">
                                "I'm learning cybersecurity with CyberSafe! Join me in building safer digital habits."
                            </div>
                        </div>
                    </div>
                    <div class="share-options">
                        <button class="share-option-btn" data-platform="copy">
                            <i class="fas fa-copy"></i>
                            <span>Copy Link</span>
                        </button>
                        <button class="share-option-btn" data-platform="twitter">
                            <i class="fab fa-twitter"></i>
                            <span>Twitter</span>
                        </button>
                        <button class="share-option-btn" data-platform="linkedin">
                            <i class="fab fa-linkedin"></i>
                            <span>LinkedIn</span>
                        </button>
                        <button class="share-option-btn" data-platform="whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </button>
                        <button class="share-option-btn" data-platform="email">
                            <i class="fas fa-envelope"></i>
                            <span>Email</span>
                        </button>
                    </div>
                    <div class="share-footer">
                        <p>Share your cybersecurity learning journey with others!</p>
                    </div>
                </div>
            </div>
        `;

        // Remove any existing modal first
        const existingModal = document.getElementById('shareModalOverlay');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Add event listeners with proper references
        const overlay = document.getElementById('shareModalOverlay');
        const closeBtn = document.getElementById('closeShareModal');
        const shareBtns = document.querySelectorAll('.share-option-btn');

        // Close modal function
        const closeModal = () => {
            if (overlay) {
                overlay.style.animation = 'modalSlideOut 0.3s ease-in';
                setTimeout(() => {
                    if (overlay && overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            }
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeModal();
                }
            });
        }

        // Add keyboard escape listener
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        shareBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleShareOption(btn.dataset.platform, shareData);
            });
        });

        // Add styles if not already added
        this.addShareModalStyles();
    }

    async handleShareOption(platform, shareData) {
        const shareUrl = `${window.location.origin}?ref=share&user=${firebase.auth().currentUser.uid}`;
        const message = `${shareData.text}\n\n${shareUrl}`;

        try {
            switch (platform) {
                case 'copy':
                    await navigator.clipboard.writeText(message);
                    this.showSuccess('Profile link copied to clipboard! 📋');
                    // Close modal after copy
                    document.querySelector('.share-modal-overlay')?.remove();
                    break;

                case 'twitter':
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
                    window.open(twitterUrl, '_blank', 'width=600,height=400');
                    break;

                case 'linkedin':
                    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                    window.open(linkedinUrl, '_blank', 'width=600,height=400');
                    break;

                case 'whatsapp':
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                    break;

                case 'email':
                    const emailUrl = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(message)}`;
                    window.location.href = emailUrl;
                    break;
            }

            // Track share event
            this.trackShareEvent(platform);
            
        } catch (error) {
            console.error('Error sharing:', error);
            this.showError('Failed to share. Please try again.');
        }
    }

    trackShareEvent(platform) {
        // Track share events in analytics
        if (window.gtag) {
            gtag('event', 'share', {
                method: platform,
                content_type: 'profile',
                content_id: firebase.auth().currentUser?.uid
            });
        }
        
        // Log to console for debugging
        console.log(`Profile shared via ${platform}`);
    }

    addShareModalStyles() {
        if (document.getElementById('share-modal-styles')) return;

        const styles = `
            <style id="share-modal-styles">
                .share-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(10, 31, 68, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    backdrop-filter: blur(5px);
                }
                .share-modal {
                    background: linear-gradient(35deg, #0A1F44 10%, #1E3A8A 80%);
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    animation: modalSlideIn 0.3s ease-out;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                @keyframes modalSlideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes modalSlideOut {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(-50px); opacity: 0; }
                }
                .share-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    position: relative;
                }
                .share-header-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .share-header h3 {
                    margin: 0;
                    color: beige;
                    font-size: 1.5em;
                    font-weight: 600;
                }
                .close-modal {
                    background: rgba(0,0,0,0.3);
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: beige;
                    padding: 5px;
                    border-radius: 50%;
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: absolute;
                    top: -10px;
                    right: -10px;
                }
                .close-modal:hover {
                    background: rgba(255,255,255,0.2);
                    transform: scale(1.1);
                }
                .progress-share-card {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
                    color: white;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .share-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                .share-card-header h4 {
                    margin: 0;
                    font-size: 1.2em;
                    color: white;
                }
                .overall-progress {
                    background: rgba(255,255,255,0.2);
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-weight: bold;
                    font-size: 0.9em;
                    color: white;
                }
                .share-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin: 20px 0;
                }
                .share-stat {
                    text-align: center;
                }
                .stat-number {
                    display: block;
                    font-size: 1.8em;
                    font-weight: bold;
                    color: white;
                }
                .stat-label {
                    font-size: 0.9em;
                    opacity: 0.9;
                    color: rgba(255, 255, 255, 0.8);
                }
                .share-message {
                    font-style: italic;
                    text-align: center;
                    opacity: 0.9;
                    margin-top: 15px;
                    font-size: 0.95em;
                    color: rgba(255, 255, 255, 0.9);
                }
                .share-options {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 10px;
                    margin: 20px 0;
                }
                .share-option-btn {
                    background: rgba(0,0,0,0.2);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                    padding: 15px 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.9em;
                    color: white;
                }
                .share-option-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border-color: rgba(255, 255, 255, 0.5);
                    transform: translateY(-2px);
                }
                .share-option-btn i {
                    font-size: 1.5em;
                    color: beige;
                }
                .share-footer {
                    text-align: center;
                    margin-top: 20px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9em;
                }
                .share-footer p {
                    margin: 0;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Helper methods for data retrieval
    async getUserModulesProgress(uid) {
        try {
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
            console.error('Error getting user modules progress:', error);
            return [];
        }
    }

    async getQuizResults(uid) {
        try {
            const quizResults = await firebase.firestore()
                .collection('quizResults')
                .where('userId', '==', uid)
                .orderBy('completedAt', 'desc')
                .limit(20)
                .get();
            
            return quizResults.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
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
            
            return badgesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting user badges:', error);
            return [];
        }
    }

    async getUserCertifications(uid) {
        try {
            const certsSnapshot = await firebase.firestore()
                .collection('userCertifications')
                .where('userId', '==', uid)
                .get();
            
            return certsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting user certifications:', error);
            return [];
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
        return moduleTitles[moduleId] || moduleId;
    }

    // File download utility
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Certificate download (legacy method - now handled by certificate generator)
    async downloadCertificate(certId) {
        try {
            if (window.certificateGenerator) {
                // Get certificate data from certificate generator
                const certificate = await window.certificateGenerator.getCertificate(certId);
                if (certificate) {
                    await window.certificateGenerator.downloadCertificate(certificate);
                    this.showSuccess('Certificate downloaded successfully!');
                } else {
                    this.showError('Certificate not found');
                }
            } else {
                // Fallback to legacy method
                const user = firebase.auth().currentUser;
                if (!user) {
                    this.showError('Please log in to download certificates');
                    return;
                }

                // Get certificate data
                const certDoc = await firebase.firestore()
                    .collection('userCertifications')
                    .doc(user.uid)
                    .get();

                if (!certDoc.exists) {
                    this.showError('Certificate not found');
                    return;
                }

                const cert = certDoc.data();

                // Create certificate content
                const certificateContent = `
CYBERSAFE CERTIFICATE OF COMPLETION

This certifies that
${user.displayName || user.email}

Has successfully completed
${cert.name}

Description: ${cert.description}
Earned on: ${this.formatDate(cert.earnedAt)}
Certificate ID: ${certId}

CyberSafe - Enterprise Cybersecurity Education
${window.location.origin}
                `.trim();

                this.downloadFile(certificateContent, `cybersafe-certificate-${certId}.txt`, 'text/plain');
                this.showSuccess('Certificate downloaded successfully!');
            }

        } catch (error) {
            console.error('Error downloading certificate:', error);
            this.showError('Failed to download certificate. Please try again.');
        }
    }

    // Email verification status
    updateEmailVerificationStatus(user) {
        const verificationStatus = document.getElementById('emailVerificationStatus');
        const verifyEmailBtn = document.getElementById('verifyEmailBtn');
        
        if (!verificationStatus || !verifyEmailBtn) return;

        if (user.emailVerified) {
            verificationStatus.className = 'verification-badge verified';
            verificationStatus.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span class="status-text">Email verified</span>
            `;
            verifyEmailBtn.style.display = 'none';
        } else {
            verificationStatus.className = 'verification-badge unverified';
            verificationStatus.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span class="status-text">Email not verified</span>
            `;
            verifyEmailBtn.style.display = 'inline-flex';
        }
    }

    // UI Utilities
    showLoading(message = 'Loading...') {
        this.hideLoading();

        const loadingEl = document.createElement('div');
        loadingEl.className = 'global-loading';
        loadingEl.innerHTML = `
            <div class="loading-backdrop">
                <div class="loading-content">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>${message}</p>
                </div>
            </div>
            <style>
                .global-loading {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(5px);
                }
                .loading-content {
                    background: linear-gradient(135deg, #0A1F44 0%, #1E3A8A 100%);
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .loading-content i {
                    font-size: 2em;
                    color: beige;
                    margin-bottom: 15px;
                }
                .loading-content p {
                    margin: 0;
                    color: beige;
                    font-weight: 500;
                }
            </style>
        `;
        document.body.appendChild(loadingEl);
    }

    hideLoading() {
        const existingLoading = document.querySelector('.global-loading');
        if (existingLoading) {
            existingLoading.remove();
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.global-notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `global-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <style>
                .global-notification {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: ${type === 'success' ? 'var(--background)' : type === 'error' ? '#dc3545' : '#17a2b8'};
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 10001;
                    animation: slideInRight 0.3s ease-out;
                    max-width: 400px;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification-content i {
                    font-size: 1.2em;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    cleanupRealTimeListeners() {
        this.realTimeListeners.forEach(unsubscribe => {
            if (unsubscribe && typeof unsubscribe === 'function') {
                unsubscribe();
            }
        });
        this.realTimeListeners = [];
    }
    
    cleanup() {
        this.cleanupRealTimeListeners();
        this.cache = {}; // Clear memory cache
    }
}



    // Update your existing DOMContentLoaded listener
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            window.profileManager = new ProfileManager();
        } else {
            const checkFirebase = setInterval(() => {
                if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                    clearInterval(checkFirebase);
                    window.profileManager = new ProfileManager();
                }
            }, 100);
        }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (window.profileManager) {
            window.profileManager.cleanup();
        }
    });
