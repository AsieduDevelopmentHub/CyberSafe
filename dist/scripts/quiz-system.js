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
        const modal = document.getElementById('quizModal');
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const submitBtn = document.getElementById('submitQuiz');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitQuiz());
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeQuiz();
                }
            });
        }
    }

    loadQuestion(questionIndex) {
        const question = this.currentQuiz.questions[questionIndex];
        const container = document.getElementById('quizQuestionContainer');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const totalQuestionsSpan = document.getElementById('totalQuestions');
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const submitBtn = document.getElementById('submitQuiz');

        if (!container || !question) return;

        // Update progress
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = questionIndex + 1;
        }
        if (totalQuestionsSpan) {
            totalQuestionsSpan.textContent = this.currentQuiz.questions.length;
        }

        // Update navigation buttons
        if (prevBtn) {
            prevBtn.disabled = questionIndex === 0;
        }
        
        if (nextBtn && submitBtn) {
            if (questionIndex === this.currentQuiz.questions.length - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'flex';
            } else {
                nextBtn.style.display = 'flex';
                submitBtn.style.display = 'none';
            }
        }

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
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadQuestion(this.currentQuestionIndex);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion(this.currentQuestionIndex);
        }
    }

    async submitQuiz() {
        if (this.userAnswers.length !== this.currentQuiz.questions.length) {
            alert('Please answer all questions before submitting.');
            return;
        }

        this.quizResults = this.calculateResults();
        await this.saveQuizResults();
        this.showQuizResults();
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

    // In scripts/quiz-system.js - Update the saveQuizResults method
async saveQuizResults() {
    if (!window.firestoreService || !firebase.auth().currentUser) return;

    const uid = firebase.auth().currentUser.uid;
    const moduleId = window.moduleContentManager.currentModule.id;

    try {
        // Calculate module progress based on quiz completion
        const moduleProgress = this.quizResults.passed ? 100 : 50; // 50% if failed but attempted
        
        // Save quiz results with updated progress
        await window.firestoreService.saveModuleProgress(uid, moduleId, {
            progress: moduleProgress,
            completed: this.quizResults.passed,
            score: this.quizResults.score,
            quizCompleted: true,
            lastUpdated: new Date()
        });

        // Award badge if passed
        if (this.quizResults.passed) {
            await window.firestoreService.awardBadge(uid, `${moduleId}_expert`, {
                name: `${window.moduleContentManager.currentModule.title} Expert`,
                description: `Scored ${this.quizResults.score}% on ${window.moduleContentManager.currentModule.title} quiz`,
                type: 'module_completion',
                moduleId: moduleId,
                score: this.quizResults.score
            });
        }

        // Update user streak
        await window.firestoreService.updateUserStreak(uid);

        // Save quiz analytics
        await window.firestoreService.saveQuizAnalytics(uid, moduleId, {
            score: this.quizResults.score,
            correctAnswers: this.quizResults.correctAnswers,
            totalQuestions: this.quizResults.totalQuestions,
            passed: this.quizResults.passed,
            userAnswers: this.userAnswers
        });

        console.log(`✅ Module ${moduleId} progress updated to: ${moduleProgress}%`);

    } catch (error) {
        console.error('Error saving quiz results:', error);
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
    
    // In scripts/quiz-system.js - Add this after saving quiz results
async submitQuiz() {
    if (this.userAnswers.length !== this.currentQuiz.questions.length) {
        alert('Please answer all questions before submitting.');
        return;
    }

    this.quizResults = this.calculateResults();
    await this.saveQuizResults();
    this.showQuizResults();
    
    // Refresh dashboard data after quiz completion
    if (window.dashboardManager) {
        setTimeout(() => {
            window.dashboardManager.refreshDashboard();
        }, 1000);
    }
}
}

// Initialize Quiz Manager
window.quizManager = new QuizManager();