class FirestoreService {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
    }

    // User Management
    async createUserProfile(user, additionalData = {}) {
        try {
            const userRef = this.db.collection('users').doc(user.uid);
            
            // Ensure we have email from either user object or additional data
            const userEmail = user.email || additionalData.email;
            const userName = user.displayName || additionalData.name || 
                            (userEmail ? userEmail.split('@')[0] : 'User');
            
            const userData = {
                uid: user.uid,
                name: userName,
                email: userEmail, // CRITICAL: Always include email
                photoURL: user.photoURL || additionalData.photoURL || 
                         `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0A1F44&color=fff`,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                progress: {
                    overall: 0,
                    completedModules: [],
                    currentStreak: 0,
                    lastActivity: null,
                    totalPoints: 0,
                    level: 1
                }
            };

            // Merge with additional data (excluding duplicates)
            Object.keys(additionalData).forEach(key => {
                if (!userData.hasOwnProperty(key) || key === 'name' || key === 'email') {
                    userData[key] = additionalData[key];
                }
            });

            await userRef.set(userData);
            console.log('✅ User profile created:', userData);
            return userData;
        } catch (error) {
            console.error('❌ Error creating user profile:', error);
            throw error;
        }
    }

    async getUserProfile(uid) {
        try {
            const userDoc = await this.db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                console.log('📄 User profile from Firestore:', userData);
                return userData;
            } else {
                console.log('❌ User profile not found in Firestore for:', uid);
                return null;
            }
        } catch (error) {
            console.error('❌ Error getting user profile:', error);
            return null;
        }
    }

    async updateUserProgress(uid, updateData) {
        try {
            const userRef = this.db.collection('users').doc(uid);
            await userRef.update({
                ...updateData,
                'progress.lastActivity': firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ User progress updated for:', uid);
        } catch (error) {
            console.error('❌ Error updating user progress:', error);
            throw error;
        }
    }

    // Module Progress Tracking
    async saveModuleProgress(uid, moduleId, progressData) {
        try {
            const progressRef = this.db.collection('user_progress').doc(uid).collection('modules').doc(moduleId);
            
            const progressUpdate = {
                moduleId,
                userId: uid,
                progress: progressData.progress,
                completed: progressData.completed || false,
                score: progressData.score || 0,
                timeSpent: progressData.timeSpent || 0,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                ...progressData
            };

            await progressRef.set(progressUpdate, { merge: true });

            // Update overall progress in user document
            await this.updateOverallProgress(uid);
            
            console.log('✅ Module progress saved:', progressUpdate);
            return progressUpdate;
        } catch (error) {
            console.error('❌ Error saving module progress:', error);
            throw error;
        }
    }

    async getModuleProgress(uid, moduleId) {
        try {
            const progressDoc = await this.db.collection('user_progress').doc(uid)
                .collection('modules').doc(moduleId).get();
            return progressDoc.exists ? progressDoc.data() : null;
        } catch (error) {
            console.error('❌ Error getting module progress:', error);
            return null;
        }
    }

    async updateOverallProgress(uid) {
        try {
            const progressSnapshot = await this.db.collection('user_progress').doc(uid)
                .collection('modules').get();
            
            const allProgress = progressSnapshot.docs.map(doc => doc.data());
            const completedModules = allProgress.filter(p => p.completed);
            const overallProgress = allProgress.length > 0 
                ? Math.round((completedModules.length / allProgress.length) * 100)
                : 0;

            const totalPoints = allProgress.reduce((sum, p) => sum + (p.score || 0), 0);
            const level = Math.floor(totalPoints / 100) + 1;

            await this.db.collection('users').doc(uid).update({
                'progress.overall': overallProgress,
                'progress.completedModules': completedModules.map(p => p.moduleId),
                'progress.totalPoints': totalPoints,
                'progress.level': level
            });

            console.log('✅ Overall progress updated:', { overallProgress, completedCount: completedModules.length, totalPoints, level });
            return { overallProgress, completedCount: completedModules.length, totalPoints, level };
        } catch (error) {
            console.error('❌ Error updating overall progress:', error);
            throw error;
        }
    }

    // Badge Management
    async awardBadge(uid, badgeId, badgeData) {
        try {
            const badgeRef = this.db.collection('user_badges').doc(uid).collection('badges').doc(badgeId);
            
            const badge = {
                id: badgeId,
                userId: uid,
                awardedAt: firebase.firestore.FieldValue.serverTimestamp(),
                ...badgeData
            };

            await badgeRef.set(badge);
            console.log('✅ Badge awarded:', badge);
            return badge;
        } catch (error) {
            console.error('❌ Error awarding badge:', error);
            throw error;
        }
    }

    async getUserBadges(uid) {
        try {
            const badgesSnapshot = await this.db.collection('user_badges').doc(uid)
                .collection('badges').get();
            const badges = badgesSnapshot.docs.map(doc => doc.data());
            console.log('🛡️ User badges loaded:', badges.length);
            return badges;
        } catch (error) {
            console.error('❌ Error getting user badges:', error);
            return [];
        }
    }

    // Content Management - Modules & Case Studies
    async getModules() {
        try {
            const modulesSnapshot = await this.db.collection('modules')
                .orderBy('order', 'asc')
                .get();
            return modulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('❌ Error getting modules:', error);
            return [];
        }
    }

    async getCaseStudies() {
        try {
            const casesSnapshot = await this.db.collection('case_studies')
                .orderBy('date', 'desc')
                .get();
            return casesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('❌ Error getting case studies:', error);
            return [];
        }
    }

    // Streak Management
    async updateUserStreak(uid) {
        try {
            const userRef = this.db.collection('users').doc(uid);
            const userDoc = await userRef.get();
            
            if (!userDoc.exists) return 0;
            
            const userData = userDoc.data();
            const today = new Date().toDateString();
            const lastActivity = userData.progress.lastActivity?.toDate();
            const lastActivityDate = lastActivity ? lastActivity.toDateString() : null;
            
            let newStreak = userData.progress.currentStreak || 0;
            
            if (lastActivityDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (lastActivityDate === yesterday.toDateString()) {
                    newStreak += 1;
                } else if (lastActivityDate !== today) {
                    newStreak = 1; // Reset streak if missed a day
                }
            }

            await userRef.update({
                'progress.currentStreak': newStreak,
                'progress.lastActivity': firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('🔥 User streak updated:', newStreak);
            return newStreak;
        } catch (error) {
            console.error('❌ Error updating user streak:', error);
            return 0;
        }
    }

    // Video Progress Tracking
    async trackVideoCompletion(uid, videoId) {
        try {
            const videoProgressRef = this.db.collection('user_progress').doc(uid)
                .collection('videos').doc(videoId);
            
            await videoProgressRef.set({
                videoId,
                userId: uid,
                completed: true,
                completedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log('✅ Video completion tracked:', videoId);
            return true;
        } catch (error) {
            console.error('❌ Error tracking video completion:', error);
            return false;
        }
    }

    // Quiz Analytics
    async saveQuizAnalytics(uid, moduleId, quizData) {
        try {
            const analyticsRef = this.db.collection('quiz_analytics').doc();
            
            await analyticsRef.set({
                userId: uid,
                moduleId,
                ...quizData,
                completedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Quiz analytics saved for module:', moduleId);
            return true;
        } catch (error) {
            console.error('❌ Error saving quiz analytics:', error);
            return false;
        }
    }

    // Update user email specifically (for email fixes)
    async updateUserEmail(uid, email) {
        try {
            const userRef = this.db.collection('users').doc(uid);
            await userRef.update({
                email: email,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ User email updated:', email);
            return true;
        } catch (error) {
            console.error('❌ Error updating user email:', error);
            return false;
        }
    }
    
    // Add this method to your existing firestore-service.js
async getUserProgressSummary(uid) {
    try {
        // Get user profile
        const userDoc = await this.db.collection('users').doc(uid).get();
        if (!userDoc.exists) return null;

        const userData = userDoc.data();
        
        // Get all module progress
        const modulesSnapshot = await this.db.collection('user_progress')
            .doc(uid)
            .collection('modules')
            .get();
        
        const modulesProgress = modulesSnapshot.docs.map(doc => doc.data());
        
        // Calculate statistics
        const completedModules = modulesProgress.filter(module => module.completed);
        const totalScore = completedModules.reduce((sum, module) => sum + (module.score || 0), 0);
        const averageScore = completedModules.length > 0 ? Math.round(totalScore / completedModules.length) : 0;
        
        return {
            user: userData,
            modulesProgress: modulesProgress,
            statistics: {
                totalModules: modulesProgress.length,
                completedModules: completedModules.length,
                completionRate: Math.round((completedModules.length / 6) * 100), // 6 total modules
                averageScore: averageScore,
                currentStreak: userData.progress?.currentStreak || 0,
                totalPoints: userData.progress?.totalPoints || 0
            }
        };
    } catch (error) {
        console.error('Error getting user progress summary:', error);
        return null;
    }
}
}

// Initialize Firestore Service
window.firestoreService = new FirestoreService();