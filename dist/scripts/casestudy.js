class CaseStudyManager {
    constructor() {
        this.currentCase = null;
        this.caseStudies = {
            equifax: {
                id: 'equifax',
                title: 'The Equifax Data Breach',
                subtitle: '2017 Cyber Attack',
                description: 'One of the largest data breaches in history affecting 147 million people',
                category: 'Data Breach',
                impact: 'Critical',
                date: '2017-09-07',
                duration: '76 days',
                affectedUsers: '147 million',
                financialImpact: '$1.7 billion',
                tags: ['Data Breach', 'Identity Theft', 'Financial Impact', 'Corporate Negligence'],
                timeline: [
                    {
                        date: '2017-03-07',
                        event: 'Vulnerability in Apache Struts framework disclosed',
                        details: 'Apache disclosed a critical vulnerability (CVE-2017-5638) in their Struts framework.'
                    },
                    {
                        date: '2017-05-13',
                        event: 'Initial breach occurred',
                        details: 'Attackers exploited the unpatched Struts vulnerability to gain access.'
                    },
                    {
                        date: '2017-07-29',
                        event: 'Breach discovered',
                        details: 'Equifax security team detected suspicious network traffic.'
                    },
                    {
                        date: '2017-09-07',
                        event: 'Public disclosure',
                        details: 'Equifax publicly announced the data breach.'
                    }
                ],
                keyLessons: [
                    {
                        title: 'Patch Management',
                        description: 'Critical vulnerabilities must be patched promptly. Equifax took over 2 months to patch a known vulnerability.',
                        recommendation: 'Implement automated patch management systems and regular vulnerability assessments.'
                    },
                    {
                        title: 'Security Monitoring',
                        description: 'The breach went undetected for 76 days. Better monitoring could have detected it earlier.',
                        recommendation: 'Deploy advanced intrusion detection systems and conduct regular security audits.'
                    },
                    {
                        title: 'Incident Response',
                        description: "Equifax's response was criticized as slow and inadequate.",
                        recommendation: 'Develop and regularly test incident response plans.'
                    }
                ],
                preventiveMeasures: [
                    'Regular security audits and assessments',
                    'Automated patch management systems',
                    'Enhanced monitoring and alerting',
                    'Employee security awareness training',
                    'Data encryption and access controls',
                    'Incident response planning'
                ],
                impactAreas: {
                    personal: 'Exposed sensitive personal data including SSNs and credit card information',
                    business: 'Major reputation damage and financial losses',
                    industry: 'Led to stricter data protection regulations'
                },
                quiz: [
                    {
                        question: 'What was the main vulnerability that led to the Equifax breach?',
                        options: [
                            'SQL Injection',
                            'Apache Struts Framework vulnerability',
                            'Weak passwords',
                            'Phishing attack'
                        ],
                        correctAnswer: 1,
                        explanation: 'The breach occurred due to an unpatched vulnerability in the Apache Struts framework (CVE-2017-5638).'
                    },
                    {
                        question: 'How long did it take Equifax to detect the breach after the initial intrusion?',
                        options: [
                            '24 hours',
                            '1 week',
                            '76 days',
                            '6 months'
                        ],
                        correctAnswer: 2,
                        explanation: 'The breach went undetected for 76 days, highlighting the importance of continuous security monitoring.'
                    },
                    {
                        question: 'What was the estimated number of consumers affected by the Equifax breach?',
                        options: [
                            '50 million',
                            '100 million',
                            '147 million',
                            '200 million'
                        ],
                        correctAnswer: 2,
                        explanation: 'The breach affected approximately 147 million consumers, making it one of the largest data breaches in history.'
                    }
                ]
            },
            wannacry: {
                id: 'wannacry',
                title: 'WannaCry Ransomware Attack',
                subtitle: '2017 Global Cyber Attack',
                description: 'A worldwide cyberattack by the WannaCry ransomware cryptoworm',
                category: 'Ransomware',
                impact: 'Severe',
                date: '2017-05-12',
                duration: 'Several weeks',
                affectedUsers: '300,000+ computers',
                financialImpact: '$4 billion',
                tags: ['Ransomware', 'Global Impact', 'NHS Attack', 'EternalBlue'],
                timeline: [
                    {
                        date: '2017-03-14',
                        event: 'Microsoft releases security patch',
                        details: 'Microsoft released MS17-010 patch for the EternalBlue vulnerability.'
                    },
                    {
                        date: '2017-05-12',
                        event: 'Initial attack begins',
                        details: 'WannaCry begins spreading globally using EternalBlue exploit.'
                    },
                    {
                        date: '2017-05-13',
                        event: 'Kill switch discovered',
                        details: 'Security researcher Marcus Hutchins discovers kill switch domain.'
                    },
                    {
                        date: '2017-05-15',
                        event: 'Attack peaks',
                        details: 'Maximum number of infections reached, affecting organizations worldwide.'
                    }
                ],
                keyLessons: [
                    {
                        title: 'System Updates',
                        description: 'Many affected systems were running outdated, unpatched versions of Windows.',
                        recommendation: 'Keep all systems updated and patch critical vulnerabilities immediately.'
                    },
                    {
                        title: 'Backup Systems',
                        description: 'Organizations with proper backups recovered more quickly.',
                        recommendation: 'Maintain regular, tested backups isolated from the main network.'
                    },
                    {
                        title: 'Network Segmentation',
                        description: 'The worm spread rapidly through connected networks.',
                        recommendation: 'Implement proper network segmentation and access controls.'
                    }
                ],
                preventiveMeasures: [
                    'Regular system updates and patches',
                    'Offline data backups',
                    'Network segmentation',
                    'End-user security training',
                    'Anti-malware protection',
                    'Incident response planning'
                ],
                impactAreas: {
                    healthcare: 'NHS hospitals had to cancel appointments and operations',
                    business: 'Many organizations lost access to critical data',
                    global: 'Affected organizations in 150+ countries'
                },
                quiz: [
                    {
                        question: 'What vulnerability did WannaCry exploit?',
                        options: [
                            'EternalBlue',
                            'Heartbleed',
                            'Shell Shock',
                            'Log4Shell'
                        ],
                        correctAnswer: 0,
                        explanation: "WannaCry exploited the EternalBlue vulnerability in Microsoft's SMB protocol."
                    },
                    {
                        question: 'What type of malware is WannaCry classified as?',
                        options: [
                            'Spyware',
                            'Ransomware',
                            'Trojan',
                            'Worm'
                        ],
                        correctAnswer: 1,
                        explanation: 'WannaCry is a ransomware cryptoworm that encrypted files and demanded ransom payments in Bitcoin.'
                    },
                    {
                        question: 'How was the WannaCry attack eventually stopped?',
                        options: [
                            'Microsoft released a patch',
                            'A kill switch domain was discovered',
                            'Antivirus software updates',
                            'Bitcoin payments were blocked'
                        ],
                        correctAnswer: 1,
                        explanation: 'Security researcher Marcus Hutchins discovered a kill switch domain that, when registered, stopped the malware from spreading.'
                    }
                ]
            },
            target: {
                id: 'target',
                title: 'Target Data Breach',
                subtitle: '2013 Credit Card Breach',
                description: 'Major retail data breach affecting 41 million consumers',
                category: 'Data Breach',
                impact: 'High',
                date: '2013-11-27',
                duration: '3 weeks',
                affectedUsers: '41 million',
                financialImpact: '$202 million',
                tags: ['POS Malware', 'Credit Card Theft', 'Retail', 'Supply Chain Attack'],
                timeline: [
                    {
                        date: '2013-11-15',
                        event: 'Initial breach',
                        details: 'Attackers gained access through an HVAC contractor'
                    },
                    {
                        date: '2013-11-27',
                        event: 'Malware deployment',
                        details: 'POS malware deployed across store systems'
                    },
                    {
                        date: '2013-12-15',
                        event: 'Breach discovered',
                        details: 'Security firms detect suspicious activity'
                    },
                    {
                        date: '2013-12-19',
                        event: 'Public disclosure',
                        details: 'Target publicly announces the data breach'
                    }
                ],
                keyLessons: [
                    {
                        title: 'Third-Party Security',
                        description: 'The breach occurred through a third-party vendor',
                        recommendation: 'Implement strict vendor security assessments'
                    },
                    {
                        title: 'Network Segmentation',
                        description: 'POS systems were not properly segmented',
                        recommendation: 'Isolate critical systems and implement network segmentation'
                    },
                    {
                        title: 'Detection Response',
                        description: 'Early warning signs were missed',
                        recommendation: 'Improve security monitoring and alert response'
                    }
                ],
                preventiveMeasures: [
                    'Vendor security assessments',
                    'Network segmentation',
                    'Enhanced monitoring',
                    'POS system encryption',
                    'Security awareness training'
                ],
                impactAreas: {
                    consumer: 'Credit card data compromised',
                    business: 'Significant financial and reputation damage',
                    industry: 'Led to improved POS security standards'
                },
                quiz: [
                    {
                        question: 'How did attackers initially gain access to Target\'s network?',
                        options: [
                            'Through a phishing email',
                            'Using stolen employee credentials',
                            'Through an HVAC contractor',
                            'Direct hack of POS systems'
                        ],
                        correctAnswer: 2,
                        explanation: 'The attackers gained initial access through credentials stolen from an HVAC contractor.'
                    },
                    {
                        question: 'What type of data was primarily stolen in the Target breach?',
                        options: [
                            'Employee records',
                            'Credit and debit card information',
                            'Inventory data',
                            'Customer email addresses'
                        ],
                        correctAnswer: 1,
                        explanation: 'The attackers primarily stole credit and debit card information from Target\'s point-of-sale systems.'
                    },
                    {
                        question: 'What was the estimated financial impact of the Target data breach?',
                        options: [
                            '$50 million',
                            '$100 million',
                            '$202 million',
                            '$500 million'
                        ],
                        correctAnswer: 2,
                        explanation: 'The breach cost Target approximately $202 million in various expenses including settlements, technical upgrades, and legal fees.'
                    }
                ]
            }
        };

        this.init();
    }

    init() {
        console.log('🔍 Initializing Case Study Manager...');
        this.setupEventListeners();
        this.loadCaseStudies();
    }

    setupEventListeners() {
        // Setup case study navigation
        document.addEventListener('click', (e) => {
            // Check if click is on the Learn More button or the card itself
            if (e.target.closest('.btn-secondary') || e.target.closest('.case-study-card')) {
                const caseCard = e.target.closest('.case-study-card');
                if (caseCard) {
                    const caseId = caseCard.dataset.caseId;
                    this.openCaseStudy(caseId);
                }
            }
        });
    }

    async loadCaseStudies() {
        console.log('📚 Loading case studies...');
        const container = document.getElementById('caseStudiesList');
        if (!container) return;

        try {
            // Get latest case studies from Firestore
            const firestoreCases = await window.firestoreService.getCaseStudies();
            
            // Merge with local case studies
            const allCases = { ...this.caseStudies };
            firestoreCases.forEach(fireCase => {
                allCases[fireCase.id] = { ...this.caseStudies[fireCase.id], ...fireCase };
            });

            // Create case study cards
            container.innerHTML = Object.values(allCases).map(caseStudy => this.createCaseStudyCard(caseStudy)).join('');

        } catch (error) {
            console.error('Error loading case studies:', error);
            this.showError('Failed to load case studies. Please try again later.');
        }
    }

    createCaseStudyCard(caseStudy) {
        return `
            <div class="case-study-card" data-case-id="${caseStudy.id}">
                <div class="case-header" style="background-image: url(${this.getCaseImage(caseStudy.id)})">
                    <div class="case-overlay">
                        <span class="case-category">${caseStudy.category}</span>
                        <span class="case-impact ${caseStudy.impact.toLowerCase()}">${caseStudy.impact}</span>
                    </div>
                </div>
                <div class="case-content">
                    <h3>${caseStudy.title}</h3>
                    <p class="case-subtitle">${caseStudy.subtitle}</p>
                    <p class="case-description">${caseStudy.description}</p>
                    <div class="case-meta">
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(caseStudy.date)}</span>
                        <span><i class="fas fa-users"></i> ${caseStudy.affectedUsers}</span>
                    </div>
                    <div class="case-tags">
                        ${caseStudy.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="case-footer">
                    <button class="btn-secondary">
                        <i class="fas fa-book-open"></i> Learn More
                    </button>
                </div>
            </div>
        `;
    }

    getCaseImage(caseId) {
        const imageMap = {
            'equifax': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', // Data security image
            'wannacry': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', // Matrix-style cyber image
            'target': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80' // Credit card security image
        };
        
        // Default cybersecurity image if specific case study image isn't found
        return imageMap[caseId] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    async openCaseStudy(caseId) {
        console.log('📖 Opening case study:', caseId);
        const caseStudy = this.caseStudies[caseId];
        if (!caseStudy) return;

        this.currentCase = caseStudy;
        this.showCaseStudyModal(caseStudy);
    }

    showCaseStudyModal(caseStudy) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('caseStudyModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'caseStudyModal';
            modal.className = 'case-study-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="case-study-modal-content">
                <div class="case-study-header">
                    <div class="case-study-title">
                        <h2>${caseStudy.title}</h2>
                        <p>${caseStudy.subtitle}</p>
                    </div>
                    <button class="close-modal">&times;</button>
                </div>
                
                <div class="case-study-body">
                    <div class="case-overview">
                        <div class="overview-stats">
                            <div class="stat">
                                <span class="label">Impact Level</span>
                                <span class="value ${caseStudy.impact.toLowerCase()}">${caseStudy.impact}</span>
                            </div>
                            <div class="stat">
                                <span class="label">Duration</span>
                                <span class="value">${caseStudy.duration}</span>
                            </div>
                            <div class="stat">
                                <span class="label">Affected Users</span>
                                <span class="value">${caseStudy.affectedUsers}</span>
                            </div>
                            <div class="stat">
                                <span class="label">Financial Impact</span>
                                <span class="value">${caseStudy.financialImpact}</span>
                            </div>
                        </div>
                        
                        <div class="case-description">
                            <h3>Incident Overview</h3>
                            <p>${caseStudy.description}</p>
                        </div>
                    </div>

                    <div class="case-timeline">
                        <h3>Incident Timeline</h3>
                        <div class="timeline">
                            ${this.createTimeline(caseStudy.timeline)}
                        </div>
                    </div>

                    <div class="key-lessons">
                        <h3>Key Lessons</h3>
                        <div class="lessons-grid">
                            ${this.createLessonsGrid(caseStudy.keyLessons)}
                        </div>
                    </div>

                    <div class="preventive-measures">
                        <h3>Preventive Measures</h3>
                        <ul class="measures-list">
                            ${caseStudy.preventiveMeasures.map(measure => `
                                <li><i class="fas fa-shield-alt"></i> ${measure}</li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="impact-analysis">
                        <h3>Impact Analysis</h3>
                        <div class="impact-areas">
                            ${Object.entries(caseStudy.impactAreas).map(([area, impact]) => `
                                <div class="impact-area">
                                    <h4>${area.charAt(0).toUpperCase() + area.slice(1)}</h4>
                                    <p>${impact}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="case-quiz">
                        <h3>Knowledge Check</h3>
                        <button class="btn-primary start-quiz">
                            <i class="fas fa-question-circle"></i> Take Quiz
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Show modal
        modal.style.display = 'flex';

        // Add event listeners
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => this.closeCaseStudyModal();

        const quizBtn = modal.querySelector('.start-quiz');
        quizBtn.onclick = () => this.startCaseQuiz(caseStudy.id);

        // Close on outside click
        modal.onclick = (e) => {
            if (e.target === modal) this.closeCaseStudyModal();
        };
    }

    createTimeline(timeline) {
        return timeline.map((event, index) => `
            <div class="timeline-item">
                <div class="timeline-point"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${this.formatDate(event.date)}</div>
                    <h4>${event.event}</h4>
                    <p>${event.details}</p>
                </div>
            </div>
        `).join('');
    }

    createLessonsGrid(lessons) {
        return lessons.map(lesson => `
            <div class="lesson-card">
                <h4>${lesson.title}</h4>
                <p class="lesson-desc">${lesson.description}</p>
                <div class="recommendation">
                    <i class="fas fa-lightbulb"></i>
                    <p>${lesson.recommendation}</p>
                </div>
            </div>
        `).join('');
    }

    closeCaseStudyModal() {
        const modal = document.getElementById('caseStudyModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async startCaseQuiz(caseId) {
        const caseStudy = this.caseStudies[caseId];
        if (!caseStudy || !caseStudy.quiz) return;

        // Remove any existing quiz modal
        const existingModal = document.querySelector('.quiz-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'quiz-modal';
        modal.innerHTML = `
            <div class="quiz-modal-content">
                <div class="quiz-header">
                    <h3>${caseStudy.title} - Knowledge Check</h3>
                    <div class="quiz-progress">Question <span id="currentQuestion">1</span>/<span id="totalQuestions">${caseStudy.quiz.length}</span></div>
                </div>
                <div class="quiz-body"></div>
                <div class="quiz-footer">
                    <button class="btn-secondary" id="prevQuestionBtn" style="display: none;">Previous</button>
                    <button class="btn-primary" id="nextQuestionBtn">Next</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        let currentQuestionIndex = 0;
        const answers = new Array(caseStudy.quiz.length).fill(null);
        const startTime = new Date();

        const updateQuestion = () => {
            const question = caseStudy.quiz[currentQuestionIndex];
            const quizBody = modal.querySelector('.quiz-body');
            document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
            document.getElementById('totalQuestions').textContent = caseStudy.quiz.length;

            quizBody.innerHTML = `
                <div class="quiz-question">
                    <p class="question-text">${question.question}</p>
                    <div class="quiz-options">
                        ${question.options.map((option, index) => `
                            <div class="quiz-option ${answers[currentQuestionIndex] === index ? 'selected' : ''}" data-index="${index}">
                                <div class="option-indicator"></div>
                                <div class="option-text">${option}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Update buttons
            const prevButton = modal.querySelector('#prevQuestionBtn');
            const nextButton = modal.querySelector('#nextQuestionBtn');
            
            if (prevButton && nextButton) {
                prevButton.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
                nextButton.textContent = currentQuestionIndex === caseStudy.quiz.length - 1 ? 'Submit' : 'Next';
            }
        };

        const handleOptionClick = (e) => {
            const option = e.target.closest('.quiz-option');
            if (option) {
                const index = parseInt(option.dataset.index);
                answers[currentQuestionIndex] = index;
                updateQuestion();
            }
        };

        const calculateScore = () => {
            let correct = 0;
            answers.forEach((answer, index) => {
                if (answer === caseStudy.quiz[index].correctAnswer) correct++;
            });
            return Math.round((correct / caseStudy.quiz.length) * 100);
        };

        const submitQuiz = async () => {
            const score = calculateScore();
            const timeSpent = Math.round((new Date() - startTime) / 1000);
            const passed = score >= 70;

            try {
                // Save to Firestore using the specialized case study collection
                await firebase.firestore().collection('caseStudyQuizzes').add({
                    userId: firebase.auth().currentUser.uid,
                    caseStudyId: caseId,
                    title: caseStudy.title,
                    score,
                    passed,
                    completedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    answers: answers.map((answer, index) => ({
                        question: caseStudy.quiz[index].question,
                        selectedAnswer: answer,
                        correctAnswer: caseStudy.quiz[index].correctAnswer,
                        isCorrect: answer === caseStudy.quiz[index].correctAnswer
                    })),
                    timeSpent,
                    category: caseStudy.category,
                    impactLevel: caseStudy.impact
                });

                // Show results
                modal.querySelector('.quiz-modal-content').innerHTML = `
                    <div class="quiz-header ${passed ? 'passed' : 'failed'}">
                        <h3>Quiz Results</h3>
                    </div>
                    <div class="quiz-body">
                        <div class="results-header ${passed ? 'passed' : 'failed'}">
                            <i class="fas fa-${passed ? 'check-circle' : 'times-circle'}"></i>
                            <div class="score-circle">
                                <div class="score-value">${score}%</div>
                                <div class="score-label">${passed ? 'Passed!' : 'Try Again'}</div>
                            </div>
                        </div>
                        <div class="results-summary">
                            ${passed ? 
                                `<div class="success-message">
                                    <i class="fas fa-trophy"></i>
                                    Congratulations! You've successfully completed the case study quiz.
                                </div>` :
                                `<div class="fail-message">
                                    <i class="fas fa-exclamation-circle"></i>
                                    Keep learning! You need 70% to pass the quiz.
                                </div>`
                            }
                        </div>
                        <div class="quiz-footer">
                            <button class="btn-secondary" onclick="document.querySelector('.quiz-modal').remove()">Close</button>
                            ${!passed ? `<button class="btn-primary" onclick="window.caseStudyManager.startCaseQuiz('${caseId}')">Try Again</button>` : ''}
                        </div>
                    </div>
                `;

                // Update dashboard if needed
                if (window.dashboardManager) {
                    window.dashboardManager.refreshDashboard();
                }

            } catch (error) {
                console.error('Error saving quiz results:', error);
                this.showError('Failed to save quiz results. Please try again.');
            }
        };

        // Add event listeners after modal is in DOM
        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Event handler for answer selection
        const quizBody = modal.querySelector('.quiz-body');
        quizBody.addEventListener('click', handleOptionClick);

        // Previous button handler
        const prevButton = modal.querySelector('#prevQuestionBtn');
        prevButton.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                updateQuestion();
            }
        });

        // Next button handler
        const nextButton = modal.querySelector('#nextQuestionBtn');
        nextButton.addEventListener('click', () => {
            console.log('Next button clicked', currentQuestionIndex); // Debug log
            
            if (answers[currentQuestionIndex] === null) {
                this.showError('Please select an answer before continuing.');
                return;
            }

            if (currentQuestionIndex === caseStudy.quiz.length - 1) {
                submitQuiz();
            } else {
                currentQuestionIndex++;
                updateQuestion();
            }
        });

        // Initialize first question
        updateQuestion();
    }

    showSuccess(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    showError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }
}

// Initialize Case Study Manager
window.caseStudyManager = new CaseStudyManager();