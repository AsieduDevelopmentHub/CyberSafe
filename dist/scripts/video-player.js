// video-player.js
class VideoPlayerManager {
    constructor() {
        this.players = new Map();
        this.currentVideoId = null;
        this.YouTubeAPIReady = false;
        this.videoWatchData = new Map();
        this.watchTimeIntervals = new Map();
        this.progressListeners = new Set();
        this.unsubscribeHandlers = new Map();
        this.initYouTubeAPI();
        this.setupRealTimeListeners();
    }

    // Updated YouTube Video Configuration with verified, embed-friendly videos
    // Updated YouTube Video Configuration with legitimate, embed-friendly videos
videoConfigs = {
    phishing: [
            
        { 
            id: 'Y7zNlEMDmI4', 
            title: 'What is Phishing. Learn How This Attack Works.', 
            description: 'What is Phishing. Learn How This Attack Works.',
            duration: '2:57', 
            provider: 'TECHtalk',
            embedAllowed: true
        },
        { 
            id: 'R12_y2BhKbE', 
            title: 'How to Spot Phishing Emails', 
            description: 'Learn to identify suspicious email characteristics and avoid scams',
            duration: '6:30', 
            provider: 'Google Security',
            embedAllowed: true
        },
        { 
            id: 'XBkzBrXlle0', 
            title: 'Phishing scenarios. Learn How This Attack Works', 
            description: 'Understanding the effects of phishing attacks and how to avoid them',
            duration: '6:48', 
            provider: 'Simplilearn',
            embedAllowed: true
        }
    ],
    passwords: [
        { 
            id: 'CNMKuqb3xFk', 
            title: 'Why is Password Security Important', 
            description: 'Understanding password security and why it matters',
            duration: '1:55', 
            provider: 'Keeper Security',
            embedAllowed: true
        },
        { 
            id: 'Pm9D-h7FqV4', 
            title: 'Creating Strong Passwords - Best Practices', 
            description: 'Learn how to create secure passwords that are hard to crack',
            duration: '4:30', 
            provider: 'CyberSafetySimplified',
            embedAllowed: true
        },
        { 
            id: 'zuvUj7GaZU8', 
            title: 'How to Use Password Managers', 
            description: 'Complete guide to using password managers effectively',
            duration: '9:19', 
            provider: 'Cybernews',
            embedAllowed: true
        }
    ],
    social: [
        { 
            id: 'v7VTJhkJUUY', 
            title: 'Social Engineering Attacks Explained', 
            description: 'Learn about common social engineering techniques',
            duration: '6:56', 
            provider: 'MalwareFox',
            embedAllowed: true
        },
        { 
            id: 'XEtvwzN_xJk', 
            title: 'How to Avoid Social Engineering Attacks', 
            description: 'How to protect yourself from social engineering attacks',
            duration: '2:16', 
            provider: 'Google Help',
            embedAllowed: true
        },
        { 
            id: 'lc7scxvKQOo', 
            title: 'Social Engineering - How People Hack Humans', 
            description: 'Understanding manipulation tactics used by attackers',
            duration: '9:10', 
            provider: 'Garrett Myler',
            embedAllowed: true
        }
    ],
    network: [
        { 
            id: '_-DekqEyAV0', 
            title: 'VPNs Explained - How VPNs Protect Your Privacy', 
            description: 'Understanding VPN technology and security benefits',
            duration: '5:49', 
            provider: 'Simplilearn',
            embedAllowed: true
        },
        { 
            id: 'aO858HyFbKI', 
            title: 'Safe Browsing Habits for 2025', 
            description: 'Best practices for secure internet browsing',
            duration: '4:01', 
            provider: 'Kaspersky',
            embedAllowed: true
        },
        { 
            id: '9GZlVOafYTg', 
            title: 'Firewalls and Network Security Basics', 
            description: 'How to secure yourself on the internet',
            duration: '5:38', 
            provider: 'Simplilearn',
            embedAllowed: true
        }
    ],
    data: [
        { 
            id: 'NpQPBKvYYlc', 
            title: 'Data Protection Principles - GDPR Basics', 
            description: 'Fundamentals of data security and privacy regulations',
            duration: '13:49', 
            provider: 'Xploit Cyber Security',
            embedAllowed: true
        },
        { 
            id: '5epUUK3jqRQ', 
            title: 'Personal Data Security in Digital Age', 
            description: 'Protecting your personal information online',
            duration: '10:07', 
            provider: 'MS Learning',
            embedAllowed: true
        },
        { 
            id: 'p1buq8pAuyE', 
            title: 'Data Privacy Tips Everyone Should Know', 
            description: 'Essential tips for protecting your data privacy',
            duration: '1:09', 
            provider: 'RapidTech Bites',
            embedAllowed: true
        }
    ],
    mobile: [
        { 
            id: '8J8z8ekeYVQ', 
            title: 'Mobile Security - Essential Tips', 
            description: 'Essential security practices for mobile devices',
            duration: '6:69', 
            provider: 'Certo Software',
            embedAllowed: true
        },
        { 
            id: 'NSOJU5nV4v4', 
            title: 'Understanding App Permissions', 
            description: 'How to manage app permissions for better security',
            duration: '2:10', 
            provider: 'ITCubed',
            embedAllowed: true
        },
        { 
            id: 'm_SN1CB3Kts', 
            title: 'Smartphone Security Guide', 
            description: 'Complete guide to securing your smartphone',
            duration: '13:16', 
            provider: 'The Hated One',
            embedAllowed: true
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
            // Load YouTube IFrame API with proper protocol
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            tag.async = true;
            tag.onerror = () => {
                console.error('❌ Failed to load YouTube API');
                this.YouTubeAPIReady = false;
            };
            
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
            const fallbackCheck = setInterval(() => {
                if (!this.YouTubeAPIReady && window.YT && window.YT.Player) {
                    this.YouTubeAPIReady = true;
                    clearInterval(fallbackCheck);
                    console.log('✅ YouTube API loaded via fallback check');
                }
            }, 500);

            // Timeout after 10 seconds
            setTimeout(() => {
                if (!this.YouTubeAPIReady) {
                    clearInterval(fallbackCheck);
                    console.error('❌ YouTube API loading timeout');
                }
            }, 10000);

        } catch (error) {
            console.error('❌ Error loading YouTube API:', error);
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
            
            // NEW: Return focus to module content modal
            this.returnToModuleContent();
        }
    }
    
    returnToModuleContent() {
        console.log('🔄 Returning to module content');
        
        // Ensure module content modal is visible and focused
        const moduleModal = document.getElementById('moduleContentModal');
        if (moduleModal && moduleModal.style.display === 'flex') {
            // Already visible, just bring to focus
            moduleModal.style.zIndex = '1000';
            console.log('✅ Module content modal is active');
        } else {
            // Reopen module modal if it was closed
            if (window.moduleContentManager && window.moduleContentManager.currentModule) {
                console.log('🔄 Reopening module modal for:', window.moduleContentManager.currentModule.id);
                window.moduleContentManager.showModuleModal();
            }
        }
        // Update the video modal z-index to be below module modal when hidden
        const videoModal = document.getElementById('videoModal');
        if (videoModal) {
            videoModal.style.zIndex = '1001'; // Higher when active, lower when hidden
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
            console.log('🔄 Initializing YouTube player with security headers...');
            
     // Get current origin for security headers
            const currentOrigin = window.location.origin || 'https://cybersafe.com' || 'https://asiedudevelopmenthub.github.io/CyberSafe/dist';
            
            const player = new YT.Player(containerId, {
                height: options.height || '360',
                width: options.width || '640',
                videoId: videoId,
                playerVars: {
                    'playsinline': 1,
                    'rel': 0,
                    'modestbranding': 1,
                    'controls': 1,
                    'enablejsapi': 1,
                    'origin': currentOrigin,
                    'widget_referrer': currentOrigin,
                    'fs': 1,
                    'autoplay': 0
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
                    },
                    'onApiChange': (event) => {
                        console.log('🔧 YouTube API change:', event);
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
            2: 'Invalid video ID or video not available',
            5: 'HTML5 player error - Please try another browser',
            100: 'Video not found or has been removed',
            101: 'Embedding not allowed by video owner',
            150: 'Embedding not allowed by video owner'
        };
        
        const message = errorMessages[errorCode] || `YouTube playback error: ${errorCode}`;
        console.error(`❌ Player error for ${videoId}:`, message);
        
        // Show user-friendly error with retry option
        this.showPlayerError(message, videoId);
        reject(new Error(message));
    }

    showPlayerError(message, videoId) {
        const modal = document.getElementById('videoModal');
        if (modal) {
            const playerContainer = modal.querySelector('.video-player-container');
            if (playerContainer) {
                playerContainer.innerHTML = `
                    <div class="player-error">
                        <i class="fas fa-exclamation-triangle fa-2x"></i>
                        <h4>Video Playback Error</h4>
                        <p>${message}</p>
                        <div class="error-actions">
                            <button class="btn-secondary" onclick="videoPlayerManager.retryVideo()">
                                <i class="fas fa-redo"></i> Try Again
                            </button>
                            <button class="btn-primary" onclick="videoPlayerManager.openYouTubeDirect('${videoId}')">
                                <i class="fab fa-youtube"></i> Watch on YouTube
                            </button>
                        </div>
                    </div>
                `;
            }
        }
    }

    // Fallback method to open video directly on YouTube
    openYouTubeDirect(videoId) {
        console.log('🔗 Opening video on YouTube:', videoId);
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
        this.closeVideoModal();
    }

    retryVideo() {
        if (this.currentVideoId) {
            console.log('🔄 Retrying video:', this.currentVideoId);
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
        
        const player = event.target;
        
        switch (event.data) {
            case YT.PlayerState.ENDED:
                // Only track completion if the video was watched properly
                const watchTime = this.videoWatchData.get(videoId)?.watchTime || 0;
                const videoDuration = player.getDuration();
                const watchPercentage = (watchTime / videoDuration) * 100;
                
                console.log(`📊 Watch stats - Time: ${watchTime}s, Duration: ${videoDuration}s, Percentage: ${watchPercentage}%`);
                
                if (watchPercentage >= 85) {  // Require 85% watch time
                    console.log('✅ Video ended with sufficient watch time:', videoId);
                    this.trackVideoCompletion(videoId);
                    this.showCompletionOption();
                } else {
                    console.log('⚠️ Video ended but insufficient watch time:', watchPercentage + '%');
                    this.showInsufficientWatchTimeMessage();
                }
                this.clearVideoWatchData(videoId);
                break;

            case YT.PlayerState.PLAYING:
                // Start tracking watch time and playback rate
                if (!this.videoWatchData.has(videoId)) {
                    this.videoWatchData.set(videoId, {
                        watchTime: 0,
                        lastUpdateTime: Date.now(),
                        buffering: false,
                        playbackRate: player.getPlaybackRate()
                    });
                    this.startWatchTimeTracking(videoId, player);
                }
                this.trackVideoStart(videoId);
                break;

            case YT.PlayerState.PAUSED:
                // Update watch time when paused
                this.updateWatchTime(videoId);
                break;

            case YT.PlayerState.BUFFERING:
                // Mark as buffering to not count this time
                if (this.videoWatchData.has(videoId)) {
                    const data = this.videoWatchData.get(videoId);
                    data.buffering = true;
                    this.videoWatchData.set(videoId, data);
                }
                break;
        }
        
        // Monitor playback rate changes
        const currentRate = player.getPlaybackRate();
        if (this.videoWatchData.has(videoId)) {
            const data = this.videoWatchData.get(videoId);
            if (currentRate !== data.playbackRate) {
                console.log(`⚠️ Playback rate changed: ${data.playbackRate} -> ${currentRate}`);
                if (currentRate > 1) {
                    player.setPlaybackRate(1);
                    this.showPlaybackRateWarning();
                }
                data.playbackRate = currentRate;
                this.videoWatchData.set(videoId, data);
            }
        }
    }

    showCompletionOption() {
        const markCompleteBtn = document.getElementById('markCompleteBtn');
        if (markCompleteBtn) {
            markCompleteBtn.style.display = 'block';
            markCompleteBtn.innerHTML = '<i class="fas fa-check"></i> Mark as Completed';
            markCompleteBtn.classList.remove('completed');
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
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+JHt2aWRlby50aXRsZX08L3RleHQ+PC9zdmc+'">
                        <div class="play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="video-duration">${video.duration}</div>
                        ${!video.embedAllowed ? '<div class="embed-warning" title="May require YouTube.com"><i class="fas fa-external-link-alt"></i></div>' : ''}
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
                <button class="btn-secondary" onclick="videoPlayerManager.retryLoadVideos()">
                    <i class="fas fa-redo"></i> Try Again
                </button>
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
                        <button class="btn-secondary" onclick="videoPlayerManager.openYouTubeDirect('${videoId}')">
                            <i class="fab fa-youtube"></i>
                            Watch on YouTube
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
                this.closeVideoModal();
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
                markCompleteBtn.classList.remove('completed');
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

            // Update YouTube button with current video ID
            const youtubeBtn = modal.querySelector('.btn-secondary[onclick*="openYouTubeDirect"]');
            if (youtubeBtn) {
                youtubeBtn.setAttribute('onclick', `videoPlayerManager.openYouTubeDirect('${videoId}')`);
            }
        }

        // Set video modal above module modal
        modal.style.zIndex = '1001';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const moduleModal = document.getElementById('moduleContentModal');
        if (moduleModal) {
            moduleModal.style.zIndex = '1000';
        }
        
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
                        <p>There was an error loading the video player. This video may have embedding restrictions.</p>
                        <div class="error-actions">
                            <button class="btn-secondary" onclick="videoPlayerManager.retryVideo()">
                                <i class="fas fa-redo"></i> Try Again
                            </button>
                            <button class="btn-primary" onclick="videoPlayerManager.openYouTubeDirect('${videoId}')">
                                <i class="fab fa-youtube"></i> Watch on YouTube
                            </button>
                        </div>
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
            const batch = firebase.firestore().batch();
            
            try {
                const currentModule = window.moduleContentManager?.currentModule;
                if (currentModule) {
                    console.log('🎯 Tracking completion for module:', currentModule.id);
                    
                    // Track video completion in a batch
                    const videoRef = firebase.firestore()
                        .collection('user_progress')
                        .doc(uid)
                        .collection('videos')
                        .doc(videoId);
                    
                    batch.set(videoRef, {
                        videoId,
                        moduleId: currentModule.id,
                        completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        watchTime: this.videoWatchData.get(videoId)?.watchTime || 0
                    });
                    
                    // Calculate and update module progress
                    const moduleProgress = await this.calculateModuleProgress(uid, currentModule.id);
                    console.log('📊 Calculated module progress:', moduleProgress);
                    
                    const progressRef = firebase.firestore()
                        .collection('user_progress')
                        .doc(uid)
                        .collection('modules')
                        .doc(currentModule.id);
                    
                    batch.set(progressRef, {
                        progress: moduleProgress,
                        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                        videosCompleted: firebase.firestore.FieldValue.arrayUnion(videoId),
                        videosWatched: true,
                        moduleId: currentModule.id,
                        userId: uid
                    }, { merge: true });
                    
                    // Commit the batch
                    await batch.commit();
                    console.log(`✅ Module ${currentModule.id} progress updated to: ${moduleProgress}%`);
                    
                    // Update dashboard in real-time
                    if (window.dashboardManager) {
                        window.dashboardManager.refreshDashboard(true); // Force refresh
                    }
                    
                    // Update module content UI
                    if (window.moduleContentManager) {
                        window.moduleContentManager.updateProgressUI(moduleProgress);
                    }
                    
                    // Check quiz unlock status
                    this.checkQuizUnlockStatus(currentModule.id, moduleProgress);
                    
                    // Trigger real-time progress update event
                    this.triggerProgressUpdate(currentModule.id, moduleProgress);
                }
            } catch (error) {
                console.error('❌ Error updating module progress after video:', error);
                // Still update local progress as fallback
                this.updateLocalProgress(currentModule?.id, uid, true);
            }
        }
    }

    // Helper method for local progress
    updateLocalProgress(moduleId, userId, completed) {
        try {
            const localKey = `module_${moduleId}_completed_${userId}`;
            localStorage.setItem(localKey, completed.toString());
            console.log('💾 Local progress updated:', localKey, completed);
        } catch (error) {
            console.error('Error updating local progress:', error);
        }
    }

    async checkQuizUnlockStatus(moduleId, progress) {
        // If progress reaches threshold, quiz becomes available
        if (progress >= 70) {
            console.log('🎉 Quiz unlocked for module:', moduleId);
            // You could show a notification here
        }
    }

    async markVideoComplete(videoId) {
        console.log('🏁 Marking video as complete:', videoId);
        
        if (window.firestoreService && firebase.auth().currentUser) {
            const uid = firebase.auth().currentUser.uid;
            
            try {
                // Update user progress
                await window.firestoreService.trackVideoCompletion(uid, videoId);
                
                // Update completion button
                const markCompleteBtn = document.getElementById('markCompleteBtn');
                if (markCompleteBtn) {
                    markCompleteBtn.innerHTML = '<i class="fas fa-check"></i> Completed!';
                    markCompleteBtn.classList.add('completed');
                    markCompleteBtn.disabled = true;
                }
                
                // Show success message
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
            const markCompleteBtn = document.getElementById('markCompleteBtn');
            if (markCompleteBtn) {
                markCompleteBtn.innerHTML = '<i class="fas fa-check"></i> Completed!';
                markCompleteBtn.classList.add('completed');
                markCompleteBtn.disabled = true;
            }
            this.showCompletionMessage('Video marked as completed! 🎉');
        }
    }

    startWatchTimeTracking(videoId, player) {
        // Clear any existing interval
        if (this.watchTimeIntervals.has(videoId)) {
            clearInterval(this.watchTimeIntervals.get(videoId));
        }

        // Create new interval to update watch time every second
        const interval = setInterval(() => {
            this.updateWatchTime(videoId);
            
            // Check for potential cheating behaviors
            if (player) {
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                const data = this.videoWatchData.get(videoId);
                
                if (data) {
                    // Check for sudden time jumps
                    if (Math.abs(currentTime - data.lastPosition) > 5) {
                        console.log('⚠️ Detected time jump in video');
                        this.handlePotentialCheating(videoId, 'time_jump');
                    }
                    
                    // Update last position
                    data.lastPosition = currentTime;
                    this.videoWatchData.set(videoId, data);
                }
            }
        }, 1000);
        
        this.watchTimeIntervals.set(videoId, interval);
    }

    updateWatchTime(videoId) {
        if (!this.videoWatchData.has(videoId)) return;
        
        const data = this.videoWatchData.get(videoId);
        const now = Date.now();
        
        // Only update watch time if not buffering
        if (!data.buffering) {
            const timeDiff = (now - data.lastUpdateTime) / 1000; // Convert to seconds
            data.watchTime += timeDiff;
        }
        
        data.lastUpdateTime = now;
        data.buffering = false; // Reset buffering state
        this.videoWatchData.set(videoId, data);
    }

    clearVideoWatchData(videoId) {
        this.videoWatchData.delete(videoId);
        if (this.watchTimeIntervals.has(videoId)) {
            clearInterval(this.watchTimeIntervals.get(videoId));
            this.watchTimeIntervals.delete(videoId);
        }
    }

    handlePotentialCheating(videoId, type) {
        console.log(`🚫 Potential cheating detected: ${type}`);
        const data = this.videoWatchData.get(videoId);
        
        if (data) {
            data.cheatingAttempts = (data.cheatingAttempts || 0) + 1;
            if (data.cheatingAttempts >= 3) {
                this.penalizeProgress(videoId);
            }
            this.videoWatchData.set(videoId, data);
        }
    }

    penalizeProgress(videoId) {
        console.log('🚫 Applying progress penalty for cheating attempts');
        // Reset watch time progress
        const data = this.videoWatchData.get(videoId);
        if (data) {
            data.watchTime = 0;
            this.videoWatchData.set(videoId, data);
        }
        this.showCheatPenaltyMessage();
    }

    showPlaybackRateWarning() {
        this.showToast('Please watch the video at normal speed for proper learning.', 'warning');
    }

    showInsufficientWatchTimeMessage() {
        this.showToast('Please watch the complete video to receive credit.', 'warning');
    }

    showCheatPenaltyMessage() {
        this.showToast('Irregular viewing detected. Progress has been reset.', 'error');
    }

    async calculateModuleProgress(uid, moduleId) {
        try {
            // Get current module progress
            const currentProgress = await window.firestoreService.getModuleProgress(uid, moduleId);
            let currentProgressValue = currentProgress ? currentProgress.progress : 0;
            
            console.log('📈 Current progress before calculation:', currentProgressValue);
            
            // Get module videos
            const moduleVideos = this.videoConfigs[moduleId] || [];
            const totalVideos = moduleVideos.length;
            
            if (totalVideos === 0) {
                console.log('⚠️ No videos found for module:', moduleId);
                return currentProgressValue;
            }
            
            // Calculate progress based on video completion (20% per video)
            const completedVideos = currentProgress?.videosCompleted?.length || 0;
            const videoProgress = Math.min(60, completedVideos * 20); // Cap video progress at 60%
            
            // Quiz progress (40% of total)
            const quizScore = currentProgress?.score || 0;
            const quizProgress = (quizScore / 100) * 40; // 40% weight for quiz
            
            // Calculate total progress
            const newProgress = Math.min(100, videoProgress + quizProgress);
            
            console.log(`📊 Progress calculation: Videos(${videoProgress}%) + Quiz(${quizProgress}%) = ${newProgress}%`);
            
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
        this.cleanupRealTimeListeners();
    }

    setupRealTimeListeners() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setupProgressListener(user.uid);
            } else {
                this.cleanupRealTimeListeners();
            }
        });
    }

    setupProgressListener(uid) {
        if (!uid) return;

        // Clean up existing listeners
        this.cleanupRealTimeListeners();

        try {
            // Listen for module progress changes
            const moduleProgressListener = firebase.firestore()
                .collection('user_progress')
                .doc(uid)
                .collection('modules')
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'modified' || change.type === 'added') {
                            const moduleId = change.doc.id;
                            const data = change.doc.data();
                            this.handleProgressUpdate(moduleId, data);
                        }
                    });
                }, (error) => {
                    console.error('Error in module progress listener:', error);
                });

            // Listen for video completion changes
            const videoCompletionListener = firebase.firestore()
                .collection('user_progress')
                .doc(uid)
                .collection('videos')
                .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added') {
                            const data = change.doc.data();
                            this.handleVideoCompletion(data);
                        }
                    });
                }, (error) => {
                    console.error('Error in video completion listener:', error);
                });

            // Store unsubscribe functions
            this.unsubscribeHandlers.set('moduleProgress', moduleProgressListener);
            this.unsubscribeHandlers.set('videoCompletion', videoCompletionListener);
        } catch (error) {
            console.error('Error setting up real-time listeners:', error);
        }
    }

    handleProgressUpdate(moduleId, data) {
        console.log(`📊 Real-time progress update for module ${moduleId}:`, data);
        
        // Update module content UI if it's the current module
        if (window.moduleContentManager?.currentModule?.id === moduleId) {
            window.moduleContentManager.updateProgressUI(data.progress);
        }

        // Update dashboard
        if (window.dashboardManager) {
            window.dashboardManager.refreshDashboard();
        }

        // Notify any registered progress listeners
        this.progressListeners.forEach(listener => {
            try {
                listener(moduleId, data);
            } catch (error) {
                console.error('Error in progress listener:', error);
            }
        });
    }

    handleVideoCompletion(data) {
        console.log('📹 Real-time video completion update:', data);
        
        // Update UI elements that show video completion status
        if (window.moduleContentManager) {
            window.moduleContentManager.updateVideoStatus(data.videoId, true);
        }
    }

    cleanupRealTimeListeners() {
        this.unsubscribeHandlers.forEach((unsubscribe) => {
            try {
                unsubscribe();
            } catch (error) {
                console.warn('Error unsubscribing listener:', error);
            }
        });
        this.unsubscribeHandlers.clear();
    }

    triggerProgressUpdate(moduleId, progress) {
        const event = new CustomEvent('moduleProgressUpdate', {
            detail: { moduleId, progress }
        });
        window.dispatchEvent(event);
    }

    // Register a progress listener
    addProgressListener(callback) {
        this.progressListeners.add(callback);
    }

    // Remove a progress listener
    removeProgressListener(callback) {
        this.progressListeners.delete(callback);
    }

    // Test video embedding (for debugging)
    async testVideoEmbedding(videoId) {
        try {
            const testContainer = document.createElement('div');
            testContainer.style.display = 'none';
            document.body.appendChild(testContainer);
            
            const player = await this.createPlayer(testContainer.id, videoId);
            const isPlayable = player && typeof player.playVideo === 'function';
            
            player.destroy();
            document.body.removeChild(testContainer);
            
            return isPlayable;
        } catch (error) {
            return false;
        }
    }
}

// Initialize Video Player Manager when DOM is ready
document.addEventListener('DOMContentLoaded', function(){
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