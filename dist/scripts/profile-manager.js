class ProfileManager {
    constructor() {
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadUserProfile();
    }

    setupEventListeners() {
        // Download progress report
        const downloadBtn = document.querySelector('.profile-actions button:nth-child(1)');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadProgressReport());
        }

        // Share profile
        const shareBtn = document.querySelector('.profile-actions button:nth-child(2)');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareProfile());
        }

        // FIXED: Use AuthManager's resend verification method
        const verifyEmailBtn = document.getElementById('verifyEmailBtn');
        if (verifyEmailBtn) {
            verifyEmailBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.authManager) {
                    window.authManager.resendVerificationEmail();
                }
            });
        }
    }

    async loadUserProfile() {
        const user = firebase.auth().currentUser;
        if (!user) {
            console.log('No user logged in');
            return;
        }

        try {
            // FIXED: Update email verification status using AuthManager's method
            this.updateEmailVerificationStatus(user);

            await Promise.all([
                this.loadBadges(user.uid),
                this.loadRecentActivity(user.uid),
                this.loadUserStats(user.uid),
                this.loadCertifications(user.uid)
            ]);
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    }

    async loadBadges(uid) {
        try {
            console.log('🏆 Loading badges for user:', uid);
            const badgesGrid = document.getElementById('badgesGrid');
            if (!badgesGrid) return;

            // Get badges from Firestore
            const badgesSnapshot = await firebase.firestore()
                .collection('user_badges')
                .doc(uid)
                .collection('badges')
                .get();

            console.log('📊 Found badges:', badgesSnapshot.docs.length);

            // Define default badges if ModulesManager badges are not available
            const defaultBadges = [
                {
                    id: 'phishing_master',
                    name: 'Phishing Master',
                    description: 'Completed the Phishing Awareness module with excellence',
                    icon: 'fas fa-fish'
                },
                {
                    id: 'password_guru',
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
                    id: 'network_guardian',
                    name: 'Network Guardian',
                    description: 'Mastered network security fundamentals',
                    icon: 'fas fa-wifi'
                },
                {
                    id: 'data_protector',
                    name: 'Data Protection Specialist',
                    description: 'Expert in data security and privacy',
                    icon: 'fas fa-database'
                },
                {
                    id: 'mobile_defender',
                    name: 'Mobile Security Defender',
                    description: 'Mastered mobile security best practices',
                    icon: 'fas fa-mobile-alt'
                }
            ];

            // Get available badges from ModulesManager or use defaults
            const availableBadges = window.modulesManager?.badges || defaultBadges;
            
            const badgesHtml = availableBadges.map(badge => {
                // Look for badge using moduleId instead of badge.id
                const earnedBadge = badgesSnapshot.docs.find(doc => 
                    doc.data().moduleId === badge.id || 
                    doc.id === badge.id || 
                    doc.data().id === badge.id
                );
                const isEarned = !!earnedBadge;
                const earnedDate = earnedBadge ? this.formatDate(earnedBadge.data().earnedAt) : null;

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
            console.log('✅ Badges loaded successfully');
        } catch (error) {
            console.error('❌ Error loading badges:', error);
            badgesGrid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to load badges. Please try again later.</p>
                </div>
            `;
        }
    }

    async loadRecentActivity(uid) {
        try {
            console.log('🔄 Loading recent activity for user:', uid);
            const activityList = document.getElementById('activityList');
            if (!activityList) {
                console.log('❌ Activity list element not found');
                return;
            }

            activityList.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading your recent activities...</p>
                </div>
            `;

            // Get recent activities
            console.log('📥 Fetching activities from Firestore...');
            
            const recentActivities = [];
            let indexError = false;
            
            // Create reference to user's activities collection
            const userActivitiesRef = firebase.firestore()
                .collection('user_activities')
                .doc(uid)
                .collection('activities');

            // Get current activities
            const activitiesSnapshot = await userActivitiesRef
                .orderBy('timestamp', 'desc')
                .limit(5)
                .get();

            const allActivities = [];

            // If we have existing activities, use their timestamps for querying
            const oldestTimestamp = activitiesSnapshot.docs.length > 0 ? 
                activitiesSnapshot.docs[activitiesSnapshot.docs.length - 1].data().timestamp : 
                new Date();

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
                        return {
                            type: 'quiz',
                            title: `Completed ${data.moduleTitle} Quiz`,
                            score: data.score,
                            timestamp: data.completedAt,
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
                        return {
                            type: 'case_study',
                            title: `Completed ${data.title} Case Study`,
                            score: data.score,
                            timestamp: data.completedAt,
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
                        return {
                            type: 'badge',
                            title: `Earned ${data.name} Badge`,
                            timestamp: data.earnedAt,
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

            // Sort activities by timestamp
            recentActivities.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());

            // Keep only the most recent 5 activities
            const latestActivities = recentActivities.slice(0, 5);

            // Update Firestore with the latest 5 activities
            const batch = firebase.firestore().batch();

            // Delete all existing activities
            const existingActivities = await userActivitiesRef.get();
            existingActivities.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            // Add the 5 most recent activities
            latestActivities.forEach((activity, index) => {
                const newActivityRef = userActivitiesRef.doc();
                batch.set(newActivityRef, {
                    ...activity,
                    order: index
                });
            });

            // Commit the batch
            await batch.commit();

            if (latestActivities.length > 0) {
                activityList.innerHTML = latestActivities.map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="${activity.icon}"></i>
                        </div>
                        <div class="activity-info">
                            <p class="activity-title">${activity.title}</p>
                            ${activity.score ? `<span class="activity-score">Score: ${activity.score}%</span>` : ''}
                            <span class="activity-time">${this.formatDate(activity.timestamp)}</span>
                        </div>
                    </div>
                `).join('');
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
        }
    }

    async loadUserStats(uid) {
        try {
            // Get all relevant data
            const [quizResults, caseStudyResults, moduleProgress] = await Promise.all([
                firebase.firestore().collection('quizResults')
                    .where('userId', '==', uid).get(),
                firebase.firestore().collection('caseStudyQuizzes')
                    .where('userId', '==', uid).get(),
                firebase.firestore().collection('user_progress')
                    .doc(uid).collection('modules').get()
            ]);

            // Calculate statistics
            const stats = {
                totalQuizzes: quizResults.size,
                averageScore: this.calculateAverageScore([...quizResults.docs, ...caseStudyResults.docs]),
                completedModules: moduleProgress.docs.filter(doc => doc.data().completed).length,
                totalModules: 6, // Update this based on your total modules
                completedCaseStudies: caseStudyResults.size,
                totalCaseStudies: 3 // Update this based on your total case studies
            };

            // Update UI
            this.updateStatsUI(stats);
            this.updateUserLevel(stats);

        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    }

    async loadCertifications(uid) {
        try {
            const certificationsGrid = document.getElementById('certificationsGrid');
            if (!certificationsGrid) return;

            const certifications = await firebase.firestore()
                .collection('userCertifications')
                .where('userId', '==', uid)
                .orderBy('earnedAt', 'desc')
                .get();

            certificationsGrid.innerHTML = certifications.docs.map(doc => {
                const cert = doc.data();
                return `
                    <div class="certification-card">
                        <div class="certification-header">
                            <div class="certification-icon">
                                <i class="fas fa-certificate"></i>
                            </div>
                            <div class="certification-info">
                                <h4>${cert.name}</h4>
                                <span class="certification-date">${this.formatDate(cert.earnedAt)}</span>
                            </div>
                        </div>
                        <div class="certification-details">
                            <p>${cert.description}</p>
                            <button class="btn-secondary" onclick="window.profileManager.downloadCertificate('${doc.id}')">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                    </div>
                `;
            }).join('') || '<p class="no-certifications">Complete modules to earn certifications</p>';

        } catch (error) {
            console.error('Error loading certifications:', error);
        }
    }

    updateStatsUI(stats) {
        // Update profile stats at the top
        const profileStats = document.querySelector('.profile-stats');
        if (profileStats) {
            const statItems = profileStats.querySelectorAll('.stat-item');
            if (statItems.length >= 3) {
                // Update overall progress
                const overallProgress = Math.round(
                    ((stats.completedModules / stats.totalModules) * 100 +
                    (stats.completedCaseStudies / stats.totalCaseStudies) * 100 +
                    stats.averageScore) / 3
                );
                statItems[0].querySelector('.stat-value').textContent = `${overallProgress}%`;
                
                // Update completed modules
                statItems[2].querySelector('.stat-value').textContent = 
                    `${stats.completedModules}/${stats.totalModules}`;
            }
        }
    }

    updateUserLevel(stats) {
        const totalProgress = (
            (stats.completedModules / stats.totalModules) +
            (stats.completedCaseStudies / stats.totalCaseStudies) +
            (stats.averageScore / 100)
        ) / 3;

        let level = 1;
        let title = 'Cyber Rookie';

        if (totalProgress > 0.8) {
            level = 4;
            title = 'Cyber Master';
        } else if (totalProgress > 0.6) {
            level = 3;
            title = 'Cyber Expert';
        } else if (totalProgress > 0.3) {
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

    calculateAverageScore(results) {
        if (!results.length) return 0;
        const totalScore = results.reduce((sum, doc) => sum + doc.data().score, 0);
        return Math.round(totalScore / results.length);
    }

    formatDate(timestamp) {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    async downloadProgressReport() {
        // Implementation for downloading progress report
        console.log('Downloading progress report...');
        // Add your implementation here
    }

    async shareProfile() {
        // Implementation for sharing profile
        console.log('Sharing profile...');
        // Add your implementation here
    }

    async downloadCertificate(certId) {
        // Implementation for downloading certificate
        console.log('Downloading certificate:', certId);
        // Add your implementation here
    }

    // FIXED: Simplified email verification status update
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

    showSuccess(message) {
        alert(message); // You can replace this with a better UI notification
    }

    showError(message) {
        alert(message); // You can replace this with a better UI notification
    }
}

// Initialize Profile Manager
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});