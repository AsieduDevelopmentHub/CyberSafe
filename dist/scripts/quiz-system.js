class QuizManager {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.quizResults = null;
    }

    startQuiz(moduleId, quizData) {
        this.currentQuiz = quizData;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.quizResults = null;

        this.showQuizModal();
        this.loadQuestion(0);
    }

    showQuizModal() {
        const modal = document.getElementById('quizModal');
        const title = document.getElementById('quizModuleTitle');
        
        if (modal && title) {
            title.textContent = this.currentQuiz.title;
            modal.style.display = 'flex';
            this.setupQuizEvents();
        }
    }

    setupQuizEvents() {
        // Get quiz elements
        const modal = document.getElementById('quizModal');
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const submitBtn = document.getElementById('submitQuiz');

        // Store bound event handlers as properties to ensure they're the same instance
        this.handlePrevClick = this.handlePrevClick || this.previousQuestion.bind(this);
        this.handleNextClick = this.handleNextClick || this.nextQuestion.bind(this);
        this.handleSubmitClick = this.handleSubmitClick || this.submitQuiz.bind(this);
        this.handleModalClick = this.handleModalClick || ((e) => {
            if (e.target === modal) {
                this.closeQuiz();
            }
        });

        // First remove any existing listeners
        prevBtn?.removeEventListener('click', this.handlePrevClick);
        nextBtn?.removeEventListener('click', this.handleNextClick);
        submitBtn?.removeEventListener('click', this.handleSubmitClick);
        modal?.removeEventListener('click', this.handleModalClick);

        // Add fresh event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', this.handlePrevClick);
            console.log('▶️ Previous button handler attached');
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', this.handleNextClick);
            console.log('▶️ Next button handler attached');
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', this.handleSubmitClick);
            console.log('▶️ Submit button handler attached');
        }

        if (modal) {
            modal.addEventListener('click', this.handleModalClick);
        }
    }

    loadQuestion(questionIndex) {
        console.log('📝 Loading question:', questionIndex + 1);
        
        const question = this.currentQuiz.questions[questionIndex];
        const container = document.getElementById('quizQuestionContainer');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const totalQuestionsSpan = document.getElementById('totalQuestions');
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const submitBtn = document.getElementById('submitQuiz');
        const progressBar = document.getElementById('quizProgress');

        if (!container || !question) {
            console.error('❌ Could not find question container or question data');
            return;
        }

        // Update question counter
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = questionIndex + 1;
        }
        if (totalQuestionsSpan) {
            totalQuestionsSpan.textContent = this.currentQuiz.questions.length;
        }

        // Update progress bar if it exists
        if (progressBar) {
            const progress = ((questionIndex + 1) / this.currentQuiz.questions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Configure navigation buttons
        if (prevBtn) {
            prevBtn.disabled = questionIndex === 0;
            prevBtn.style.visibility = questionIndex === 0 ? 'hidden' : 'visible';
        }
        
        if (nextBtn && submitBtn) {
            const isLastQuestion = questionIndex === this.currentQuiz.questions.length - 1;
            
            // Toggle button visibility
            nextBtn.style.display = isLastQuestion ? 'none' : 'flex';
            submitBtn.style.display = isLastQuestion ? 'flex' : 'none';
            
            // Update button states
            nextBtn.disabled = false;
            submitBtn.disabled = false;
        }

        console.log(`▶️ Navigation updated: Q${questionIndex + 1}/${this.currentQuiz.questions.length}`);

        // Render question
        container.innerHTML = `
            <div class="quiz-question">
                <div class="question-text">${question.question}</div>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <div class="quiz-option ${this.userAnswers[questionIndex] === index ? 'selected' : ''}" 
                             data-option="${index}">
                            <div class="option-indicator"></div>
                            <div class="option-text">${option}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add option selection handlers
        container.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectOption(questionIndex, parseInt(option.getAttribute('data-option')));
            });
        });
    }

    selectOption(questionIndex, optionIndex) {
        this.userAnswers[questionIndex] = optionIndex;
        this.loadQuestion(questionIndex); // Reload to update UI
    }

    previousQuestion() {
        try {
            if (this.currentQuestionIndex <= 0) {
                console.log('⚠️ Already at first question');
                return;
            }

            console.log(`⬅️ Moving from Q${this.currentQuestionIndex + 1} to Q${this.currentQuestionIndex}`);
            this.currentQuestionIndex--;
            this.loadQuestion(this.currentQuestionIndex);
        } catch (error) {
            console.error('❌ Error navigating to previous question:', error);
        }
    }

    nextQuestion() {
        try {
            const totalQuestions = this.currentQuiz.questions.length;
            
            if (this.currentQuestionIndex >= totalQuestions - 1) {
                console.log('⚠️ Already at last question');
                return;
            }

            console.log(`➡️ Moving from Q${this.currentQuestionIndex + 1} to Q${this.currentQuestionIndex + 2}`);
            this.currentQuestionIndex++;
            this.loadQuestion(this.currentQuestionIndex);
        } catch (error) {
            console.error('❌ Error navigating to next question:', error);
        }
    }

    async submitQuiz() {
        try {
            // 1. Check authentication and network status
            if (!firebase.auth().currentUser) {
                throw new Error('Authentication required. Please log in to submit your quiz.');
            }

            if (!navigator.onLine) {
                throw new Error('No internet connection. Please check your connection and try again.');
            }

            // 2. Validate quiz state
            if (!this.currentQuiz?.questions) {
                throw new Error('Quiz data is invalid. Please restart the quiz.');
            }

            // 3. Show loading state on submit button
            const submitBtn = document.getElementById('submitQuiz');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            }

            try {
                // 4. Validate answers
                const unansweredQuestions = [];
                for (let i = 0; i < this.currentQuiz.questions.length; i++) {
                    if (this.userAnswers[i] === undefined) {
                        unansweredQuestions.push(i + 1);
                    }
                }

                if (unansweredQuestions.length > 0) {
                    const message = unansweredQuestions.length === 1 
                        ? `Please answer question ${unansweredQuestions[0]} before submitting.`
                        : `Please answer questions ${unansweredQuestions.join(', ')} before submitting.`;
                    throw new Error(message);
                }

                // 5. Calculate and save results
                console.log('📊 Calculating quiz results...');
                this.quizResults = this.calculateResults();

                // 6. Save with retry mechanism
                let saveAttempts = 0;
                const maxAttempts = 3;
                let lastError = null;

                while (saveAttempts < maxAttempts) {
                    try {
                        await this.saveQuizResults();
                        console.log('✅ Quiz results saved successfully');
                        break;
                    } catch (error) {
                        saveAttempts++;
                        lastError = error;
                        console.error(`Save attempt ${saveAttempts} failed:`, error);
                        if (saveAttempts === maxAttempts) {
                            throw new Error('Failed to save quiz results: ' + error.message);
                        }
                        // Wait with exponential backoff
                        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, saveAttempts)));
                    }
                }

                // 7. Show results and log completion
                this.showQuizResults();
                this.logQuizCompletion().catch(error => {
                    console.error('Non-critical: Analytics logging failed:', error);
                });

            } finally {
                // Always reset submit button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Submit Quiz';
                }
            }

        } catch (error) {
            console.error('❌ Error during quiz submission:', error);
            
            // Format user-friendly error message
            let errorMessage = 'There was a problem submitting your quiz. ';
            if (error.message.includes('Please answer question')) {
                // For unanswered questions, show the original message
                errorMessage = error.message;
                // Navigate to first unanswered question
                const questionNum = parseInt(error.message.match(/question (\d+)/)?.[1]);
                if (questionNum) {
                    this.currentQuestionIndex = questionNum - 1;
                    this.loadQuestion(this.currentQuestionIndex);
                }
            } else if (error.message.includes('logged in') || error.message.includes('Authentication')) {
                errorMessage += 'Please make sure you are logged in and try again.';
            } else if (error.message.includes('connection')) {
                errorMessage += 'Please check your internet connection and try again.';
            } else if (error.code === 'permission-denied') {
                errorMessage += 'Access denied. Please log out and log back in.';
            } else {
                errorMessage += 'Please try again. If the problem persists, contact support.';
            }
            
            alert(errorMessage);
        }
    }

    calculateResults() {
        let correctAnswers = 0;
        const results = [];

        this.currentQuiz.questions.forEach((question, index) => {
            const isCorrect = this.userAnswers[index] === question.correctAnswer;
            if (isCorrect) correctAnswers++;

            results.push({
                question: question.question,
                userAnswer: question.options[this.userAnswers[index]],
                correctAnswer: question.options[question.correctAnswer],
                isCorrect: isCorrect,
                explanation: question.explanation
            });
        });

        const score = Math.round((correctAnswers / this.currentQuiz.questions.length) * 100);
        const passed = score >= this.currentQuiz.passingScore;

        return {
            score,
            passed,
            correctAnswers,
            totalQuestions: this.currentQuiz.questions.length,
            results
        };
    }

    async saveQuizResults() {
        // 1. Validate authentication state
        const auth = firebase.auth();
        if (!auth.currentUser) {
            console.error('❌ No user logged in');
            throw new Error('Authentication required. Please log in to submit your quiz.');
        }

        // 2. Verify Firestore service
        if (!window.firestoreService) {
            console.error('❌ Firestore service not available');
            throw new Error('Service unavailable. Please refresh the page and try again.');
        }

        // 3. Get and validate user ID
        const uid = auth.currentUser.uid;
        if (!uid) {
            console.error('❌ Invalid user ID');
            throw new Error('Invalid user session. Please log out and log back in.');
        }

        // 4. Get and validate module ID
        const moduleId = window.moduleContentManager?.currentModule?.id;
        if (!moduleId) {
            console.error('❌ Invalid module ID');
            throw new Error('Module data is invalid. Please restart the quiz.');
        }

        // 5. Log attempt details
        console.log('🔐 Saving quiz with auth:', {
            uid,
            moduleId,
            isAuthenticated: !!auth.currentUser,
            authTime: auth.currentUser.metadata.lastSignInTime
        });

        try {
            console.log('🎯 Saving quiz results for module:', moduleId);

            // 1. Check network connectivity
            if (!navigator.onLine) {
                throw new Error('No internet connection. Please check your connection and try again.');
            }

            // 2. Check Firestore connection
            try {
                await firebase.firestore().collection('users').doc(uid).get();
            } catch (error) {
                throw new Error('Cannot connect to database. Please check your connection and try again.');
            }

            // 3. Use a Firestore batch for atomic updates
            const batch = firebase.firestore().batch();

            // Update module progress
            const moduleProgress = this.quizResults.passed ? 100 : Math.max(50, await this.getCurrentProgress(uid, moduleId));
            const moduleRef = firebase.firestore().collection('user_progress').doc(uid)
                .collection('modules').doc(moduleId);
            
            console.log('📊 Updating module progress:', {
                moduleId,
                progress: moduleProgress,
                score: this.quizResults.score,
                passed: this.quizResults.passed
            });

            // Module update
            batch.set(moduleRef, {
                progress: moduleProgress,
                completed: this.quizResults.passed,
                score: this.quizResults.score,
                quizCompleted: true,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                lastQuizAttempt: {
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    score: this.quizResults.score,
                    passed: this.quizResults.passed
                }
            }, { merge: true });

            // Save detailed quiz results
            const quizResultsRef = moduleRef.collection('quizResults').doc();
            batch.set(quizResultsRef, {
                score: this.quizResults.score,
                correctAnswers: this.quizResults.correctAnswers,
                totalQuestions: this.quizResults.totalQuestions,
                passed: this.quizResults.passed,
                userAnswers: this.userAnswers,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                moduleId, // Add moduleId for easier querying
                userId: uid // Add userId for security rules
            });

            // Update user profile
            const userRef = firebase.firestore().collection('users').doc(uid);
            batch.set(userRef, {
                lastActive: firebase.firestore.FieldValue.serverTimestamp(),
                lastModuleId: moduleId,
                [`moduleScores.${moduleId}`]: this.quizResults.score,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            // Verify write permissions before committing
            try {
                // Test write permission with a small transaction
                const testRef = firebase.firestore().collection('users').doc(uid);
                await firebase.firestore().runTransaction(async (transaction) => {
                    const doc = await transaction.get(testRef);
                    if (!doc.exists) {
                        // Create user document if it doesn't exist
                        transaction.set(testRef, {
                            lastActive: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                    return true;
                });

                // If permission test passes, execute the main updates
                await batch.commit();
                console.log('✅ Quiz results saved successfully');

                // Handle post-save actions
                if (this.quizResults.passed) {
                    try {
                        // Award badge
                        const badgeData = {
                            name: `${window.moduleContentManager.currentModule.title} Expert`,
                            description: `Scored ${this.quizResults.score}% on ${window.moduleContentManager.currentModule.title} quiz`,
                            type: 'module_completion',
                            moduleId: moduleId,
                            score: this.quizResults.score,
                            awardedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            userId: uid // Add user ID for security rules
                        };

                        await window.firestoreService.awardBadge(uid, `${moduleId}_expert`, badgeData);
                        console.log('🏆 Badge awarded successfully');

                        // Generate certificate
                        if (window.certificateGenerator && window.moduleContentManager.currentModule) {
                            try {
                                const user = firebase.auth().currentUser;
                                if (user) {
                                    const userData = await window.firestoreService.getUserProfile(user.uid);
                                    if (userData) {
                                        await window.certificateGenerator.generateCertificate(
                                            userData,
                                            window.moduleContentManager.currentModule,
                                            this.quizResults
                                        );
                                        console.log('🎓 Certificate generated successfully');
                                    }
                                }
                            } catch (certError) {
                                console.error('⚠️ Certificate generation failed:', certError);
                                // Don't throw error as quiz results are saved
                            }
                        }

                    } catch (error) {
                        console.error('⚠️ Badge award failed but quiz results were saved:', error);
                        // Don't throw error as quiz results are saved
                    }
                }

                // Update streak and refresh UI
                try {
                    await window.firestoreService.updateUserStreak(uid);
                    if (window.dashboardManager) {
                        window.dashboardManager.refreshDashboard();
                    }
                } catch (error) {
                    console.error('⚠️ Non-critical update failed:', error);
                    // Don't throw as these are non-critical updates
                }
            } catch (error) {
                throw error; // Re-throw the error for the outer try-catch to handle
            }

        } catch (error) {
            console.error('❌ Error saving quiz results:', error);
            
            // Show user-friendly error message based on error type
            if (error.code === 'permission-denied') {
                throw new Error('Access denied. Please check if you are properly logged in.');
            } else if (error.code === 'unavailable') {
                throw new Error('Service temporarily unavailable. Please try again in a few minutes.');
            } else {
                throw new Error(`Failed to save quiz results: ${error.message || 'Unknown error occurred'}`);
            }
        }
    }

    async getCurrentProgress(uid, moduleId) {
        try {
            // 1. Validate parameters
            if (!uid || !moduleId) {
                console.error('❌ Invalid parameters for getCurrentProgress:', { uid, moduleId });
                return 0;
            }

            // 2. Check authentication state
            const auth = firebase.auth();
            if (!auth.currentUser || auth.currentUser.uid !== uid) {
                console.error('❌ User authentication mismatch');
                throw new Error('Authentication required');
            }

            // 3. Get progress from the correct path matching security rules
            const db = firebase.firestore();
            const moduleDoc = await db.collection('user_progress').doc(uid)
                .collection('modules').doc(moduleId)
                .get();

            // 4. Log progress retrieval
            console.log('📊 Retrieved module progress:', {
                moduleId,
                exists: moduleDoc.exists,
                progress: moduleDoc.exists ? moduleDoc.data()?.progress : 0
            });

            return moduleDoc.exists ? (moduleDoc.data()?.progress || 0) : 0;

        } catch (error) {
            console.error('❌ Error getting current progress:', error);
            if (error.code === 'permission-denied') {
                throw new Error('Access denied. Please check your login status.');
            }
            // Return 0 for other errors to allow quiz submission
            return 0;
        }
    }


    showQuizResults() {
        const container = document.getElementById('quizQuestionContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="quiz-results">
                <div class="results-header ${this.quizResults.passed ? 'passed' : 'failed'}">
                    <i class="fas fa-${this.quizResults.passed ? 'trophy' : 'redo'}"></i>
                    <h3>${this.quizResults.passed ? 'Quiz Passed!' : 'Quiz Failed'}</h3>
                    <div class="score-circle">
                        <div class="score-value">${this.quizResults.score}%</div>
                        <div class="score-label">Score</div>
                    </div>
                </div>
                
                <div class="results-summary">
                    <p>You got <strong>${this.quizResults.correctAnswers}</strong> out of <strong>${this.quizResults.totalQuestions}</strong> questions correct.</p>
                    ${this.quizResults.passed ? 
                        '<div class="success-message"><i class="fas fa-check"></i> Congratulations! You earned a badge.</div>' :
                        `<div class="fail-message"><i class="fas fa-redo"></i> You need ${this.currentQuiz.passingScore}% to pass. Try again!</div>`
                    }
                </div>

                <div class="results-details">
                    <h4>Question Review:</h4>
                    ${this.quizResults.results.map((result, index) => `
                        <div class="result-item ${result.isCorrect ? 'correct' : 'incorrect'}">
                            <div class="result-question">
                                <strong>Q${index + 1}:</strong> ${result.question}
                            </div>
                            <div class="result-answer">
                                <span class="answer-label">Your answer:</span>
                                <span class="user-answer">${result.userAnswer}</span>
                            </div>
                            ${!result.isCorrect ? `
                                <div class="result-answer">
                                    <span class="answer-label">Correct answer:</span>
                                    <span class="correct-answer">${result.correctAnswer}</span>
                                </div>
                            ` : ''}
                            <div class="result-explanation">
                                <i class="fas fa-lightbulb"></i>
                                ${result.explanation}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="results-actions">
                    <button id="closeQuiz" class="btn-primary">
                        <i class="fas fa-check"></i> Continue Learning
                    </button>
                    ${!this.quizResults.passed ? `
                        <button id="retryQuiz" class="btn-secondary">
                            <i class="fas fa-redo"></i> Try Again
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        // Add event listeners for results actions
        const closeBtn = document.getElementById('closeQuiz');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeQuiz();
            });
        }

        if (!this.quizResults.passed) {
            const retryBtn = document.getElementById('retryQuiz');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    this.retryQuiz();
                });
            }
        }
    }

    retryQuiz() {
        this.startQuiz(this.currentQuiz.moduleId, this.currentQuiz);
    }

    closeQuiz() {
        const modal = document.getElementById('quizModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Refresh module progress in background
        if (firebase.auth().currentUser && window.firestoreService) {
            window.firestoreService.updateOverallProgress(firebase.auth().currentUser.uid);
        }
    }
    async logQuizCompletion() {
        if (!firebase.auth().currentUser) return;

        try {
            const analyticsData = {
                moduleId: window.moduleContentManager.currentModule.id,
                score: this.quizResults.score,
                passed: this.quizResults.passed,
                totalQuestions: this.quizResults.totalQuestions,
                correctAnswers: this.quizResults.correctAnswers,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Log to analytics collection
            await firebase.firestore().collection('analytics').doc('quizzes').collection('attempts')
                .add(analyticsData);

        } catch (error) {
            console.error('Error logging quiz analytics:', error);
            // Non-critical error, don't alert user
        }
    }
}

// Initialize Quiz Manager
window.quizManager = new QuizManager();