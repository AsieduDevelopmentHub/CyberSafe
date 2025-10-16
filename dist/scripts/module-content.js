class ModuleContentManager {
    constructor() {
        this.currentModule = null;
        this.modulesContent = {
            phishing: {
                id: 'phishing',
                title: "Phishing Awareness",
                description: "Learn to identify and avoid email scams and phishing attempts",
                icon: "fas fa-fish",
                color: "#00B8D9",
                category: "Foundation",
                duration: "30 min",
                lessons: 5,
                videos: [
                    {
                        id: 'Y0y5u0Fh3cM',
                        title: 'What is Phishing?',
                        description: 'Understanding the basics of phishing attacks',
                        duration: '5:30',
                        provider: 'IBM Security'
                    },
                    {
                        id: 'R12_y2BhKbE',
                        title: 'Spot Phishing Emails',
                        description: 'Learn to identify suspicious email characteristics',
                        duration: '7:15',
                        provider: 'KnowBe4'
                    },
                    {
                        id: 'mKxmkaxs1xk',
                        title: 'Real Phishing Examples',
                        description: 'Analysis of actual phishing attempts',
                        duration: '8:45',
                        provider: 'CISA'
                    }
                ],
                lessonsContent: [
                    {
                        title: "Understanding Phishing",
                        content: `
                            <h3>What is Phishing?</h3>
                            <p>Phishing is a cyber attack that uses disguised email as a weapon. The goal is to trick the email recipient into believing that the message is something they want or need — a request from their bank, for instance, or a note from someone in their company — and to click a link or download an attachment.</p>
                            
                            <h4>Common Phishing Techniques:</h4>
                            <ul>
                                <li><strong>Email Phishing:</strong> Mass emails sent to many users</li>
                                <li><strong>Spear Phishing:</strong> Targeted attacks on specific individuals</li>
                                <li><strong>Whaling:</strong> Attacks targeting senior executives</li>
                                <li><strong>Smishing:</strong> Phishing via SMS/text messages</li>
                                <li><strong>Vishing:</strong> Phishing via voice calls</li>
                            </ul>
                            
                            <div class="tip-box">
                                <i class="fas fa-lightbulb"></i>
                                <strong>Pro Tip:</strong> Always verify the sender's email address and look for spelling errors in URLs.
                            </div>
                        `
                    },
                    {
                        title: "Identifying Phishing Emails",
                        content: `
                            <h3>Red Flags to Watch For</h3>
                            <p>Phishing emails often contain telltale signs that can help you identify them before falling victim.</p>
                            
                            <h4>Key Indicators:</h4>
                            <div class="warning-signs">
                                <div class="warning-item">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <div>
                                        <strong>Urgent Language</strong>
                                        <p>Emails creating a sense of urgency or fear</p>
                                    </div>
                                </div>
                                <div class="warning-item">
                                    <i class="fas fa-link"></i>
                                    <div>
                                        <strong>Suspicious Links</strong>
                                        <p>Hover over links to see the actual URL</p>
                                    </div>
                                </div>
                                <div class="warning-item">
                                    <i class="fas fa-paperclip"></i>
                                    <div>
                                        <strong>Unexpected Attachments</strong>
                                        <p>Don't open attachments from unknown senders</p>
                                    </div>
                                </div>
                                <div class="warning-item">
                                    <i class="fas fa-user"></i>
                                    <div>
                                        <strong>Generic Greetings</strong>
                                        <p>Emails starting with "Dear Customer" instead of your name</p>
                                    </div>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: "Protecting Yourself",
                        content: `
                            <h3>Best Practices for Email Security</h3>
                            <p>Implementing these practices can significantly reduce your risk of falling victim to phishing attacks.</p>
                            
                            <h4>Essential Security Measures:</h4>
                            <ul>
                                <li><strong>Enable Two-Factor Authentication:</strong> Adds an extra layer of security</li>
                                <li><strong>Use Email Filtering:</strong> Many email providers have built-in spam and phishing filters</li>
                                <li><strong>Keep Software Updated:</strong> Regular updates include security patches</li>
                                <li><strong>Verify Suspicious Emails:</strong> Contact the organization directly using official channels</li>
                                <li><strong>Educate Your Team:</strong> Security awareness training is crucial for organizations</li>
                            </ul>
                            
                            <div class="tip-box">
                                <i class="fas fa-shield-alt"></i>
                                <strong>Security Reminder:</strong> When in doubt, don't click! It's better to verify than to become a victim.
                            </div>
                        `
                    }
                ],
                quiz: {
                    title: "Phishing Awareness Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "Which of the following is a common characteristic of phishing emails?",
                            options: [
                                "Personalized greeting using your full name",
                                "Urgent request for immediate action",
                                "Official company logos and branding",
                                "Professional grammar and spelling"
                            ],
                            correctAnswer: 1,
                            explanation: "Phishing emails often create a sense of urgency to pressure victims into acting quickly without thinking."
                        },
                        {
                            id: 2,
                            question: "What should you do if you receive a suspicious email from your bank?",
                            options: [
                                "Click the link to verify your account",
                                "Reply with your personal information",
                                "Contact the bank using their official phone number",
                                "Forward it to all your colleagues as a warning"
                            ],
                            correctAnswer: 2,
                            explanation: "Always contact organizations through their official channels, not through links or phone numbers provided in suspicious emails."
                        },
                        {
                            id: 3,
                            question: "What does 'spear phishing' refer to?",
                            options: [
                                "Phishing attacks targeting senior executives",
                                "Phishing attacks via text message",
                                "Highly targeted phishing aimed at specific individuals",
                                "Phishing attacks using voice calls"
                            ],
                            correctAnswer: 2,
                            explanation: "Spear phishing is a targeted form of phishing where attackers research their victims to create personalized, convincing messages."
                        },
                        {
                            id: 4,
                            question: "Which element is safest to hover over to check a link's destination?",
                            options: [
                                "The email sender's name",
                                "Company logos in the email",
                                "Any clickable link or button",
                                "Email attachments"
                            ],
                            correctAnswer: 2,
                            explanation: "Hovering over links reveals the actual URL destination, helping you identify suspicious websites before clicking."
                        },
                        {
                            id: 5,
                            question: "What is the primary goal of most phishing attacks?",
                            options: [
                                "To improve your computer's security",
                                "To steal sensitive information or money",
                                "To test your cybersecurity knowledge",
                                "To advertise legitimate products"
                            ],
                            correctAnswer: 1,
                            explanation: "The main objective of phishing is to obtain sensitive data like login credentials, financial information, or to install malware."
                        }
                    ],
                    passingScore: 80
                }
            },
            passwords: {
                id: 'passwords', // ADD THIS
                title: "Password Security",
                description: "Create strong passwords and manage them securely",
                icon: "fas fa-key",
                color: "#FF6F00",
                category: "Foundation",
                duration: "25 min",
                lessons: 4,
                videos: [
                    {
                        id: 'KnK9S3xM1k0',
                        title: 'Creating Strong Passwords',
                        description: 'Best practices for password creation',
                        duration: '6:45',
                        provider: 'CyberNews'
                    },
                    {
                        id: '7U-RbOKanYs',
                        title: 'Password Manager Guide',
                        description: 'How to use password managers effectively',
                        duration: '8:20',
                        provider: 'Techquickie'
                    }
                ],
                lessonsContent: [
                    {
                        title: "Password Fundamentals",
                        content: `
                            <h3>Why Strong Passwords Matter</h3>
                            <p>Weak passwords are one of the most common security vulnerabilities. Understanding how to create and manage strong passwords is essential for protecting your online accounts.</p>
                            
                            <h4>Characteristics of Strong Passwords:</h4>
                            <ul>
                                <li><strong>Length:</strong> At least 12 characters</li>
                                <li><strong>Complexity:</strong> Mix of uppercase, lowercase, numbers, and symbols</li>
                                <li><strong>Unpredictability:</strong> Avoid common words and patterns</li>
                                <li><strong>Uniqueness:</strong> Different password for each account</li>
                            </ul>
                            
                            <div class="example-box">
                                <strong>Weak Password Examples:</strong> password123, 123456, qwerty<br>
                                <strong>Strong Password Examples:</strong> Blue$ky2024!Winter@Sun, Tr0ub4d0r&3, C0rrectH0rseB@tterySt@ple
                            </div>
                        `
                    }
                ],
                quiz: {
                    title: "Password Security Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "What is the recommended minimum length for a strong password?",
                            options: [
                                "6 characters",
                                "8 characters",
                                "12 characters",
                                "16 characters"
                            ],
                            correctAnswer: 2,
                            explanation: "Modern security standards recommend passwords of at least 12 characters to resist brute-force attacks."
                        },
                        {
                            id: 2,
                            question: "Which of the following is the most secure practice?",
                            options: [
                                "Using the same strong password for multiple accounts",
                                "Writing passwords down in a notebook",
                                "Using a password manager",
                                "Changing passwords every week"
                            ],
                            correctAnswer: 2,
                            explanation: "Password managers help create and store unique, strong passwords for each account without the need to memorize them."
                        }
                    ],
                    passingScore: 80
                }
            },
            social: {
                id: 'social',
                title: "Social Engineering",
                description: "Recognize and defend against manipulation tactics",
                icon: "fas fa-users",
                color: "#10B981",
                category: "Intermediate",
                duration: "35 min",
                lessons: 6,
                videos: [
                    {
                        id: 'lc7scxvKQOo',
                        title: 'Social Engineering Attacks',
                        description: 'Understanding manipulation tactics',
                        duration: '9:10',
                        provider: 'Hak5'
                    },
                    {
                        id: 'VoC1XJ4DKLs',
                        title: 'Human Hacking',
                        description: 'Psychological aspects of social engineering',
                        duration: '11:25',
                        provider: 'Black Hat'
                    }
                ],
                lessonsContent: [
                    {
                        title: "Understanding Social Engineering",
                        content: `
                            <h3>What is Social Engineering?</h3>
                            <p>Social engineering is the psychological manipulation of people into performing actions or divulging confidential information.</p>
                        `
                    }
                ],
                quiz: {
                    title: "Social Engineering Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "What is the main goal of social engineering?",
                            options: [
                                "To improve social skills",
                                "To manipulate people into revealing information",
                                "To engineer better social media platforms",
                                "To study social behavior"
                            ],
                            correctAnswer: 1,
                            explanation: "Social engineering aims to manipulate individuals into divulging confidential or personal information."
                        }
                    ],
                    passingScore: 80
                }
            },
            network: {
                id: 'network',
                title: "Network Security",
                description: "Safe browsing practices and VPN usage",
                icon: "fas fa-wifi",
                color: "#8B5CF6",
                category: "Intermediate",
                duration: "40 min",
                lessons: 5,
                videos: [
                    {
                        id: 'KX4G49ZrvL0',
                        title: 'VPN Security Basics',
                        description: 'Understanding VPN technology and security',
                        duration: '8:45',
                        provider: 'NetworkChuck'
                    },
                    {
                        id: '4ZAkMS9qTFQ',
                        title: 'Safe Browsing Habits',
                        description: 'Best practices for secure internet browsing',
                        duration: '6:30',
                        provider: 'The PC Security Channel'
                    }
                ],
                lessonsContent: [
                    {
                        title: "Network Security Fundamentals",
                        content: `
                            <h3>Network Security Basics</h3>
                            <p>Understanding how to protect your network and online activities.</p>
                        `
                    }
                ],
                quiz: {
                    title: "Network Security Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "What does VPN stand for?",
                            options: [
                                "Virtual Private Network",
                                "Very Protected Network",
                                "Virtual Public Network",
                                "Verified Private Network"
                            ],
                            correctAnswer: 0,
                            explanation: "VPN stands for Virtual Private Network, which creates a secure connection over the internet."
                        }
                    ],
                    passingScore: 80
                }
            },
            data: {
                id: 'data',
                title: "Data Protection",
                description: "Secure your personal information online",
                icon: "fas fa-database",
                color: "#EF4444",
                category: "Advanced",
                duration: "45 min",
                lessons: 6,
                videos: [
                    {
                        id: 'yzM6L4v13qA',
                        title: 'Data Protection Principles',
                        description: 'Fundamentals of data security and privacy',
                        duration: '10:15',
                        provider: 'GDPR Guide'
                    },
                    {
                        id: 'KlrX_2erev4',
                        title: 'Personal Data Security',
                        description: 'Protecting your personal information online',
                        duration: '7:50',
                        provider: 'Security Now'
                    }
                ],
                lessonsContent: [
                    {
                        title: "Data Protection Basics",
                        content: `
                            <h3>Protecting Your Data</h3>
                            <p>Learn how to secure your personal and sensitive information.</p>
                        `
                    }
                ],
                quiz: {
                    title: "Data Protection Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "What is the primary purpose of data protection?",
                            options: [
                                "To make data processing faster",
                                "To prevent unauthorized access to sensitive information",
                                "To increase data storage capacity",
                                "To share data more easily"
                            ],
                            correctAnswer: 1,
                            explanation: "Data protection aims to prevent unauthorized access, use, or disclosure of sensitive information."
                        }
                    ],
                    passingScore: 80
                }
            },
            mobile: {
                id: 'mobile',
                title: "Mobile Security",
                description: "App permissions and device safety",
                icon: "fas fa-mobile-alt",
                color: "#F59E0B",
                category: "Advanced",
                duration: "30 min",
                lessons: 4,
                videos: [
                    {
                        id: 'Mp4nwRgBJ6M',
                        title: 'Mobile Security Tips',
                        description: 'Essential security practices for mobile devices',
                        duration: '9:05',
                        provider: 'ESET'
                    },
                    {
                        id: 'WbTC9SfK8D8',
                        title: 'App Permissions Guide',
                        description: 'Understanding and managing app permissions',
                        duration: '8:15',
                        provider: 'Malwarebytes'
                    }
                ],
                lessonsContent: [
                    {
                        title: "Mobile Security Fundamentals",
                        content: `
                            <h3>Securing Your Mobile Devices</h3>
                            <p>Best practices for keeping your smartphones and tablets secure.</p>
                        `
                    }
                ],
                quiz: {
                    title: "Mobile Security Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "Why should you review app permissions?",
                            options: [
                                "To make apps run faster",
                                "To ensure apps only access necessary data",
                                "To increase app storage",
                                "To share permissions with other apps"
                            ],
                            correctAnswer: 1,
                            explanation: "Reviewing app permissions helps ensure apps only access the data they need to function, protecting your privacy."
                        }
                    ],
                    passingScore: 80
                }
            }
        };
    }

    async openModule(moduleId) {
        console.log('🎯 Opening module:', moduleId);
        
        this.currentModule = this.modulesContent[moduleId];
        if (!this.currentModule) {
            console.error('❌ Module not found:', moduleId);
            return;
        }

        console.log('📚 Current module set:', this.currentModule.id, this.currentModule.title);

        // Initialize module progress if it doesn't exist
        await this.initializeModuleProgress(moduleId);

        this.showModuleModal();
        this.loadModuleContent();
    }

    showModuleModal() {
        const modal = document.getElementById('moduleContentModal');
        const icon = document.getElementById('modalModuleIcon');
        const title = document.getElementById('modalModuleTitle');
        const desc = document.getElementById('modalModuleDesc');

        if (!modal || !icon || !title || !desc) {
            console.error('❌ Module modal elements not found');
            return;
        }

        // Set module header info
        icon.innerHTML = `<i class="${this.currentModule.icon}"></i>`;
        icon.style.background = `linear-gradient(135deg, ${this.currentModule.color}, ${this.lightenColor(this.currentModule.color, 20)})`;
        title.textContent = this.currentModule.title;
        desc.textContent = this.currentModule.description;

        // Show modal
        modal.style.display = 'flex';

        // Add event listeners
        this.setupModalEvents();
        
        console.log('✅ Module modal shown for:', this.currentModule.id);
    }

    setupModalEvents() {
        const modal = document.getElementById('moduleContentModal');
        const closeBtn = document.querySelector('.close-module-modal');
        const tabButtons = document.querySelectorAll('.tab-button');

        if (!modal || !closeBtn) return;

        // Close modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            // Clean up video players when modal closes
            if (window.videoPlayerManager) {
                window.videoPlayerManager.closeVideoModal();
            }
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                if (window.videoPlayerManager) {
                    window.videoPlayerManager.closeVideoModal();
                }
            }
        });

        // Tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName, button);
            });
        });

        // Start quiz button
        const startQuizBtn = document.getElementById('startQuizBtn');
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', () => {
                this.startQuiz();
            });
        }
    }

    switchTab(tabName, clickedButton) {
        console.log('🔄 Switching to tab:', tabName, 'for module:', this.currentModule?.id);
        
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        clickedButton.classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        const targetTab = document.getElementById(tabName + 'Tab');
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Load tab-specific content
        switch(tabName) {
            case 'videos':
                this.loadVideosTab();
                break;
            case 'lessons':
                this.loadLessonsTab();
                break;
            case 'quiz':
                this.loadQuizTab();
                break;
        }
    }

    loadVideosTab() {
        console.log('🎬 Loading videos tab for module:', this.currentModule?.id);
        
        if (!this.currentModule) {
            console.error('❌ No current module set for videos tab');
            return;
        }

        if (window.videoPlayerManager) {
            // Ensure YouTube API is initialized
            window.videoPlayerManager.initYouTubeAPI();
            
            // Load the videos for the current module
            window.videoPlayerManager.loadModuleVideos(this.currentModule.id);
            
            console.log('✅ Videos tab loaded for module:', this.currentModule.id);
        } else {
            console.error('❌ VideoPlayerManager not available');
            this.showVideosFallback();
        }
    }

    showVideosFallback() {
        const videosGrid = document.getElementById('videosGrid');
        if (!videosGrid) return;
        
        videosGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Videos Not Available</h4>
                <p>Unable to load videos at the moment. Please try again later.</p>
            </div>
        `;
    }

    loadLessonsTab() {
        const lessonsContent = document.getElementById('lessonsContent');
        if (!lessonsContent) return;

        if (this.currentModule.lessonsContent && this.currentModule.lessonsContent.length > 0) {
            lessonsContent.innerHTML = this.currentModule.lessonsContent.map((lesson, index) => `
                <div class="lesson-item">
                    <div class="lesson-header">
                        <h3>${lesson.title}</h3>
                        <span class="lesson-number">Lesson ${index + 1}</span>
                    </div>
                    <div class="lesson-body">
                        ${lesson.content}
                    </div>
                </div>
            `).join('');
        } else {
            lessonsContent.innerHTML = `
                <div class="lesson-item">
                    <div class="lesson-header">
                        <h3>Coming Soon</h3>
                    </div>
                    <div class="lesson-body">
                        <p>Detailed lessons for this module are currently being developed. Check back soon for comprehensive learning materials!</p>
                    </div>
                </div>
            `;
        }
    }

    loadQuizTab() {
        // Quiz tab content is static in HTML
        console.log('📝 Loading quiz tab for module:', this.currentModule?.id);
    }

    startQuiz() {
        if (!this.currentModule || !this.currentModule.quiz) {
            alert('Quiz not available for this module yet.');
            return;
        }

        if (window.quizManager) {
            window.quizManager.startQuiz(this.currentModule.id, this.currentModule.quiz);
        }
    }

    async initializeModuleProgress(moduleId) {
        const user = firebase.auth().currentUser;
        if (!user || !window.firestoreService) return;

        try {
            const currentProgress = await window.firestoreService.getModuleProgress(user.uid, moduleId);
            
            // If no progress exists, initialize with 0%
            if (!currentProgress) {
                await window.firestoreService.saveModuleProgress(user.uid, moduleId, {
                    progress: 0,
                    completed: false,
                    score: 0,
                    lastUpdated: new Date()
                });
                console.log(`✅ Initialized progress for module: ${moduleId}`);
            }
        } catch (error) {
            console.error('❌ Error initializing module progress:', error);
        }
    }

    loadModuleContent() {
        console.log('📚 Loading module content for:', this.currentModule?.id);
        this.loadVideosTab(); // Load videos by default since it's the active tab
        this.loadLessonsTab();
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

    // Get all available module IDs
    getAvailableModules() {
        return Object.keys(this.modulesContent);
    }

    // Check if module exists
    moduleExists(moduleId) {
        return this.modulesContent.hasOwnProperty(moduleId);
    }
}

// Initialize Module Content Manager
window.moduleContentManager = new ModuleContentManager();