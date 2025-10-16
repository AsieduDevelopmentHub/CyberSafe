// video-player.js
class VideoPlayerManager {
    constructor() {
        this.players = new Map();
        this.currentVideoId = null;
        this.YouTubeAPIReady = false;
        this.initYouTubeAPI();
    }

    // Updated YouTube Video Configuration with legitimate, verified videos
    videoConfigs = {
        phishing: [
            { 
                id: 'Y7SzFnF6a2I', 
                title: 'What is Phishing? Learn How This Attack Works', 
                description: 'Understanding the basics of phishing attacks and how to recognize them',
                duration: '4:15', 
                provider: 'SANS Institute' 
            },
            { 
                id: 'R12_y2BhKbE', 
                title: 'How to Spot Phishing Emails', 
                description: 'Learn to identify suspicious email characteristics and avoid scams',
                duration: '6:30', 
                provider: 'Google Security' 
            },
            { 
                id: 'o0WY1q6egW0', 
                title: 'Phishing Explained in 6 Minutes', 
                description: 'Comprehensive overview of phishing techniques and prevention',
                duration: '6:12', 
                provider: 'IBM Technology' 
            }
        ],
        passwords: [
            { 
                id: 'KnK9S3xM1k0', 
                title: 'Creating Strong Passwords - Best Practices', 
                description: 'Learn how to create secure passwords that are hard to crack',
                duration: '5:45', 
                provider: 'CyberNews' 
            },
            { 
                id: 'bUFzUl_1Tqs', 
                title: 'Password Security Explained', 
                description: 'Understanding password security and why it matters',
                duration: '7:20', 
                provider: 'Security Journey' 
            },
            { 
                id: 'PfkqHhjc-0c', 
                title: 'How to Use Password Managers', 
                description: 'Complete guide to using password managers effectively',
                duration: '8:15', 
                provider: 'Techlore' 
            }
        ],
        social: [
            { 
                id: 'lc7scxvKQOo', 
                title: 'Social Engineering - How People Hack Humans', 
                description: 'Understanding manipulation tactics used by attackers',
                duration: '9:10', 
                provider: 'Hak5' 
            },
            { 
                id: 'TVv6R1LwM7Y', 
                title: 'Social Engineering Attacks Explained', 
                description: 'Learn about common social engineering techniques',
                duration: '5:45', 
                provider: 'IBM Security' 
            },
            { 
                id: 'm8vL1cMtV_s', 
                title: 'Preventing Social Engineering', 
                description: 'How to protect yourself from social engineering attacks',
                duration: '6:30', 
                provider: 'KnowBe4' 
            }
        ],
        network: [
            { 
                id: 'KX4G49ZrvL0', 
                title: 'VPNs Explained - How VPNs Protect Your Privacy', 
                description: 'Understanding VPN technology and security benefits',
                duration: '8:45', 
                provider: 'NetworkChuck' 
            },
            { 
                id: '4ZAkMS9qTFQ', 
                title: 'Safe Browsing Habits for 2024', 
                description: 'Best practices for secure internet browsing',
                duration: '6:30', 
                provider: 'The PC Security Channel' 
            },
            { 
                id: 'KcY3o7f7h7c', 
                title: 'Home Network Security Basics', 
                description: 'How to secure your home Wi-Fi and network',
                duration: '7:15', 
                provider: 'TechHut' 
            }
        ],
        data: [
            { 
                id: 'yzM6L4v13qA', 
                title: 'Data Protection Principles - GDPR Basics', 
                description: 'Fundamentals of data security and privacy regulations',
                duration: '10:15', 
                provider: 'GDPR Guide' 
            },
            { 
                id: 'KlrX_2erev4', 
                title: 'Personal Data Security in Digital Age', 
                description: 'Protecting your personal information online',
                duration: '7:50', 
                provider: 'Security Now' 
            },
            { 
                id: 'sRk3cZgqJcI', 
                title: 'Data Privacy Tips Everyone Should Know', 
                description: 'Essential tips for protecting your data privacy',
                duration: '5:20', 
                provider: 'All Things Secured' 
            }
        ],
        mobile: [
            { 
                id: 'Mp4nwRgBJ6M', 
                title: 'Mobile Security - Essential Tips', 
                description: 'Essential security practices for mobile devices',
                duration: '9:05', 
                provider: 'ESET' 
            },
            { 
                id: 'WbTC9SfK8D8', 
                title: 'Understanding App Permissions', 
                description: 'How to manage app permissions for better security',
                duration: '8:15', 
                provider: 'Malwarebytes' 
            },
            { 
                id: 'eWVv5s7YtpA', 
                title: 'Smartphone Security Guide', 
                description: 'Complete guide to securing your smartphone',
                duration: '6:45', 
                provider: 'The Cyber Mentor' 
            }
        ]
    };

    initYouTubeAPI() {
        console.log('🎬 Initializing YouTube API...');
        
        // Check if YouTube API is already loaded
        if (window.YT && window.YT.Player) {
            this.YouTubeAPIReady = true;
            console.log('✅ YouTube API already loaded');
            return;
        }

        // Check if script is already loading
        if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            console.log('📥 YouTube API script already loading...');
            return;
        }

        try {
            // Load YouTube IFrame API
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            tag.async = true;
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            // Setup callback when API is ready
            window.onYouTubeIframeAPIReady = () => {
                this.YouTubeAPIReady = true;
                console.log('✅ YouTube IFrame API ready');
                
                // Notify any waiting components
                if (window.moduleContentManager) {
                    window.moduleContentManager.YouTubeAPIReady = true;
                }
            };

            // Fallback: Check periodically if API loaded
            setTimeout(() => {
                if (!this.YouTubeAPIReady && window.YT && window.YT.Player) {
                    this.YouTubeAPIReady = true;
                    console.log('✅ YouTube API loaded via fallback check');
                }
            }, 2000);

        } catch (error) {
            console.error('❌ Error loading YouTube API:', error);
        }
    }

    createPlayer(containerId, videoId, options = {}) {
        return new Promise((resolve, reject) => {
            console.log('🎮 Creating YouTube player for:', videoId);
            
            // Check if container exists
            const container = document.getElementById(containerId);
            if (!container) {
                console.error('❌ Player container not found:', containerId);
                reject(new Error('Player container not found'));
                return;
            }

            // Clear any existing content
            container.innerHTML = '';

            if (!this.YouTubeAPIReady) {
                console.warn('⚠️ YouTube API not ready, waiting...');
                
                // Wait for API to be ready with timeout
                const waitForAPI = setInterval(() => {
                    if (this.YouTubeAPIReady) {
                        clearInterval(waitForAPI);
                        this.initializePlayer(containerId, videoId, options, resolve, reject);
                    }
                }, 100);

                // Timeout after 10 seconds
                setTimeout(() => {
                    if (!this.YouTubeAPIReady) {
                        clearInterval(waitForAPI);
                        reject(new Error('YouTube API loading timeout'));
                    }
                }, 10000);
                
                return;
            }

            this.initializePlayer(containerId, videoId, options, resolve, reject);
        });
    }

    initializePlayer(containerId, videoId, options, resolve, reject) {
        try {
            console.log('🔄 Initializing YouTube player...');
            
            const player = new YT.Player(containerId, {
                height: options.height || '360',
                width: options.width || '640',
                videoId: videoId,
                playerVars: {
                    'playsinline': 1,
                    'rel': 0,
                    'modestbranding': 1,
                    'showinfo': 0,
                    'controls': 1,
                    'enablejsapi': 1,
                    'origin': window.location.origin
                },
                events: {
                    'onReady': (event) => {
                        console.log('✅ YouTube player ready for video:', videoId);
                        this.players.set(containerId, event.target);
                        resolve(event.target);
                    },
                    'onStateChange': (event) => {
                        this.onPlayerStateChange(event, videoId);
                    },
                    'onError': (event) => {
                        console.error('❌ YouTube Player Error:', event.data, 'for video:', videoId);
                        this.handlePlayerError(event.data, videoId, reject);
                    }
                }
            });

            // Store player reference immediately
            this.players.set(containerId, player);

        } catch (error) {
            console.error('❌ Error creating YouTube player:', error);
            reject(error);
        }
    }

    handlePlayerError(errorCode, videoId, reject) {
        const errorMessages = {
            2: 'Invalid video ID',
            5: 'HTML5 player error',
            100: 'Video not found',
            101: 'Embedding not allowed',
            150: 'Embedding not allowed'
        };
        
        const message = errorMessages[errorCode] || `YouTube error: ${errorCode}`;
        console.error(`❌ Player error for ${videoId}:`, message);
        
        // Show user-friendly error
        this.showPlayerError(message);
        reject(new Error(message));
    }

    showPlayerError(message) {
        const modal = document.getElementById('videoModal');
        if (modal) {
            const playerContainer = modal.querySelector('.video-player-container');
            if (playerContainer) {
                playerContainer.innerHTML = `
                    <div class="player-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h4>Video Playback Error</h4>
                        <p>${message}</p>
                        <button class="btn-secondary" onclick="videoPlayerManager.retryVideo()">Try Again</button>
                    </div>
                `;
            }
        }
    }

    retryVideo() {
        if (this.currentVideoId) {
            this.initVideoPlayer(this.currentVideoId);
        }
    }

    onPlayerStateChange(event, videoId) {
        const states = {
            '-1': 'unstarted',
            '0': 'ended',
            '1': 'playing',
            '2': 'paused',
            '3': 'buffering',
            '5': 'video cued'
        };
        
        console.log('🎬 Player state changed:', states[event.data], 'for video:', videoId);
        
        if (event.data === YT.PlayerState.ENDED) {
            console.log('✅ Video ended, tracking completion:', videoId);
            this.trackVideoCompletion(videoId);
            
            // Auto-show completion option
            this.showCompletionOption();
        } else if (event.data === YT.PlayerState.PLAYING) {
            this.trackVideoStart(videoId);
        }
    }

    showCompletionOption() {
        const markCompleteBtn = document.getElementById('markCompleteBtn');
        if (markCompleteBtn) {
            markCompleteBtn.style.display = 'block';
            markCompleteBtn.innerHTML = '<i class="fas fa-check"></i> Mark as Completed';
        }
    }

    async loadModuleVideos(moduleId) {
        console.log('🎬 Loading videos for module:', moduleId);
        
        if (!moduleId) {
            console.error('❌ No moduleId provided to loadModuleVideos');
            this.showNoVideosMessage('Module not specified');
            return;
        }

        const videos = this.videoConfigs[moduleId] || [];
        const videoContainer = document.getElementById('videosGrid');
        
        if (!videoContainer) {
            console.error('❌ videosGrid container not found');
            return;
        }

        console.log('📹 Found videos for module', moduleId + ':', videos.length);

        if (videos.length === 0) {
            this.showNoVideosMessage(`No videos available for ${this.formatModuleName(moduleId)}`);
            return;
        }

        try {
            // Create video grid HTML
            videoContainer.innerHTML = videos.map((video, index) => `
                <div class="video-item" data-video-id="${video.id}" data-video-index="${index}">
                    <div class="video-thumbnail">
                        <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" 
                             alt="${video.title}" 
                             loading="lazy" 
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iIzBBMUY0NCIvPjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+JHt2aWRlby50aXRsZX08L3RleHQ+PC9zdmc+'">
                        <div class="play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="video-duration">${video.duration}</div>
                    </div>
                    <div class="video-info">
                        <h4>${video.title}</h4>
                        <p class="video-provider">
                            <i class="fas fa-user-tie"></i> ${video.provider}
                        </p>
                        <p class="video-description">${video.description}</p>
                        <div class="video-meta">
                            <span class="video-duration-badge">
                                <i class="fas fa-clock"></i> ${video.duration}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('');

            console.log('✅ Videos HTML generated for', videos.length, 'videos');

            // Add click handlers to video items
            videoContainer.querySelectorAll('.video-item').forEach((item) => {
                item.addEventListener('click', (e) => {
                    const videoId = item.getAttribute('data-video-id');
                    const videoIndex = parseInt(item.getAttribute('data-video-index'));
                    const video = videos[videoIndex];
                    
                    console.log('🎯 Clicked video:', video.title, videoId);
                    this.playVideo(videoId, video.title);
                });
            });

            console.log('✅ Video click handlers attached');

        } catch (error) {
            console.error('❌ Error loading videos:', error);
            this.showErrorMessage('Error loading video content. Please try again.');
        }
    }

    formatModuleName(moduleId) {
        const names = {
            phishing: 'Phishing Awareness',
            passwords: 'Password Security',
            social: 'Social Engineering',
            network: 'Network Security',
            data: 'Data Protection',
            mobile: 'Mobile Security'
        };
        return names[moduleId] || moduleId;
    }

    showNoVideosMessage(message) {
        const videoContainer = document.getElementById('videosGrid');
        if (!videoContainer) return;
        
        videoContainer.innerHTML = `
            <div class="no-videos-message">
                <i class="fas fa-film fa-3x"></i>
                <h4>No Videos Available</h4>
                <p>${message}</p>
                <p class="text-muted">Check back later for new content.</p>
            </div>
        `;
    }

    showErrorMessage(message) {
        const videoContainer = document.getElementById('videosGrid');
        if (!videoContainer) return;
        
        videoContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle fa-2x"></i>
                <h4>Error Loading Videos</h4>
                <p>${message}</p>
                <button class="btn-secondary" onclick="videoPlayerManager.retryLoadVideos()">Try Again</button>
            </div>
        `;
    }

    retryLoadVideos() {
        const currentModule = window.moduleContentManager?.currentModule;
        if (currentModule) {
            this.loadModuleVideos(currentModule.id);
        }
    }

    async playVideo(videoId, title) {
        console.log('▶️ Playing video:', videoId, title);
        this.currentVideoId = videoId;
        
        // Create or show video modal
        this.showVideoModal(videoId, title);
        
        // Track video start
        this.trackVideoStart(videoId);
    }

    showVideoModal(videoId, title) {
        let modal = document.getElementById('videoModal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'videoModal';
            modal.className = 'video-modal';
            modal.innerHTML = `
                <div class="video-modal-content">
                    <div class="video-modal-header">
                        <h3>${this.escapeHtml(title)}</h3>
                        <button class="close-modal" aria-label="Close video">&times;</button>
                    </div>
                    <div class="video-player-container">
                        <div class="player-loading">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Loading video player...</p>
                        </div>
                        <div id="ytPlayer"></div>
                    </div>
                    <div class="video-actions">
                        <button class="btn-primary" id="markCompleteBtn" style="display: none;">
                            <i class="fas fa-check"></i>
                            Mark as Completed
                        </button>
                        <button class="btn-secondary" onclick="videoPlayerManager.closeVideoModal()">
                            <i class="fas fa-times"></i>
                            Close
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close modal handlers
            modal.querySelector('.close-modal').addEventListener('click', () => {
                this.closeVideoModal();
            });

            // Mark complete handler
            modal.querySelector('#markCompleteBtn').addEventListener('click', () => {
                this.markVideoComplete(videoId);
            });

            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeVideoModal();
                }
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'flex') {
                    this.closeVideoModal();
                }
            });

        } else {
            // Update title for existing modal
            const titleElement = modal.querySelector('h3');
            if (titleElement) {
                titleElement.textContent = title;
            }
            
            // Reset completion button
            const markCompleteBtn = modal.querySelector('#markCompleteBtn');
            if (markCompleteBtn) {
                markCompleteBtn.style.display = 'none';
            }
            
            // Show loading state
            const playerContainer = modal.querySelector('.video-player-container');
            if (playerContainer) {
                playerContainer.innerHTML = `
                    <div class="player-loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Loading video player...</p>
                    </div>
                    <div id="ytPlayer"></div>
                `;
            }
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Initialize YouTube player
        this.initVideoPlayer(videoId);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async initVideoPlayer(videoId) {
        try {
            console.log('🎮 Initializing YouTube player for video:', videoId);
            
            // Ensure DOM is updated
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const player = await this.createPlayer('ytPlayer', videoId, {
                height: '100%',
                width: '100%'
            });
            
            console.log('✅ YouTube player initialized successfully');
            
            // Hide loading state
            const loadingElement = document.querySelector('.player-loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize YouTube player:', error);
            
            // Show error state
            const playerContainer = document.querySelector('.video-player-container');
            if (playerContainer) {
                playerContainer.innerHTML = `
                    <div class="player-error">
                        <i class="fas fa-exclamation-triangle fa-2x"></i>
                        <h4>Failed to Load Video</h4>
                        <p>There was an error loading the video player. Please try again.</p>
                        <button class="btn-secondary" onclick="videoPlayerManager.retryVideo()">
                            <i class="fas fa-redo"></i> Try Again
                        </button>
                    </div>
                `;
            }
        }
    }

    closeVideoModal() {
        console.log('🔒 Closing video modal');
        const modal = document.getElementById('videoModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
            
            // Stop any playing video
            const player = this.players.get('ytPlayer');
            if (player && player.stopVideo) {
                player.stopVideo();
            }
        }
    }

    trackVideoStart(videoId) {
        console.log('📊 Tracking video start:', videoId);
        
        // Analytics: Track video start
        if (window.firestoreService && firebase.auth().currentUser) {
            try {
                const analyticsData = {
                    videoId,
                    timestamp: new Date(),
                    userId: firebase.auth().currentUser.uid,
                    type: 'video_start',
                    module: window.moduleContentManager?.currentModule?.id
                };
                console.log('Video started:', analyticsData);
                
                // You can send this to your analytics service here
            } catch (error) {
                console.error('❌ Error tracking video start:', error);
            }
        }
    }

    async trackVideoCompletion(videoId) {
        console.log('✅ Tracking video completion:', videoId);
        
        if (window.firestoreService && firebase.auth().currentUser) {
            const uid = firebase.auth().currentUser.uid;
            
            try {
                // Get current module progress
                const currentModule = window.moduleContentManager?.currentModule;
                if (currentModule) {
                    const moduleProgress = await this.calculateModuleProgress(uid, currentModule.id);
                    
                    // Update module progress based on video completion
                    await window.firestoreService.saveModuleProgress(uid, currentModule.id, {
                        progress: moduleProgress,
                        lastUpdated: new Date(),
                        videosCompleted: firebase.firestore.FieldValue.arrayUnion(videoId)
                    });
                    
                    console.log(`✅ Module ${currentModule.id} progress updated to: ${moduleProgress}% after video completion`);
                }
            } catch (error) {
                console.error('❌ Error updating module progress after video:', error);
            }
        }
    }

    async markVideoComplete(videoId) {
        console.log('🏁 Marking video as complete:', videoId);
        
        if (window.firestoreService && firebase.auth().currentUser) {
            const uid = firebase.auth().currentUser.uid;
            
            try {
                // Update user progress
                await window.firestoreService.trackVideoCompletion(uid, videoId);
                
                // Close modal and show success message
                this.closeVideoModal();
                this.showCompletionMessage('Video marked as completed! 🎉');
                
                // Update user streak
                await window.firestoreService.updateUserStreak(uid);
                
                // Refresh dashboard data
                if (window.dashboardManager) {
                    setTimeout(() => {
                        window.dashboardManager.refreshDashboard();
                    }, 1000);
                }
                
            } catch (error) {
                console.error('❌ Error marking video complete:', error);
                this.showError('Failed to mark video as completed. Please try again.');
            }
        } else {
            // Fallback for non-authenticated users
            this.closeVideoModal();
            this.showCompletionMessage('Video marked as completed! 🎉');
        }
    }

    async calculateModuleProgress(uid, moduleId) {
        try {
            // Get current module progress
            const currentProgress = await window.firestoreService.getModuleProgress(uid, moduleId);
            let currentProgressValue = currentProgress ? currentProgress.progress : 0;
            
            // Add video completion progress (each video adds progress based on total videos)
            const totalVideos = this.videoConfigs[moduleId]?.length || 1;
            const videoProgressIncrement = Math.min(30, Math.floor(100 / totalVideos));
            const newProgress = Math.min(100, currentProgressValue + videoProgressIncrement);
            
            console.log(`📊 Module progress: ${currentProgressValue}% → ${newProgress}%`);
            return newProgress;
            
        } catch (error) {
            console.error('❌ Error calculating module progress:', error);
            return 0;
        }
    }

    showCompletionMessage(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.completion-toast');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `completion-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Utility method to get videos for a module
    getModuleVideos(moduleId) {
        return this.videoConfigs[moduleId] || [];
    }

    // Check if a video exists
    isValidVideo(videoId) {
        return Object.values(this.videoConfigs)
            .flat()
            .some(video => video.id === videoId);
    }

    // Clean up players when needed
    destroyPlayer(playerId) {
        const player = this.players.get(playerId);
        if (player) {
            try {
                player.destroy();
            } catch (error) {
                console.warn('⚠️ Error destroying player:', error);
            }
            this.players.delete(playerId);
        }
    }

    // Clean up all players
    destroyAllPlayers() {
        this.players.forEach((player, playerId) => {
            try {
                player.destroy();
            } catch (error) {
                console.warn('⚠️ Error destroying player:', playerId, error);
            }
        });
        this.players.clear();
    }
}

// Initialize Video Player Manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.videoPlayerManager = new VideoPlayerManager();
    console.log('🎬 Video Player Manager initialized');
});

// Fallback initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!window.videoPlayerManager) {
            window.videoPlayerManager = new VideoPlayerManager();
        }
    });
} else {
    window.videoPlayerManager = new VideoPlayerManager();
}