class ModuleContentManager {
    constructor() {
        this.currentModule = null;
        this.modulesContent = {
            phishing: {
                id: 'phishing',
                title: "Phishing Awareness",
                description: "Master email security and learn to identify sophisticated phishing attempts",
                icon: "fas fa-fish",
                color: "#00B8D9",
                category: "Foundation",
                duration: "45 min",
                lessons: 5,
                videos: [
                    { 
                        id: 'Y7zNlEMDmI4', 
                        title: 'What is Phishing - Attack Mechanisms', 
                        description: 'Comprehensive overview of phishing techniques and how they work',
                        duration: '2:57', 
                        provider: 'TECHtalk',
                        embedAllowed: true
                    },
                    { 
                        id: 'R12_y2BhKbE', 
                        title: 'Advanced Phishing Email Analysis', 
                        description: 'Deep dive into identifying sophisticated phishing attempts',
                        duration: '6:30', 
                        provider: 'Google Security',
                        embedAllowed: true
                    },
                    { 
                        id: 'XBkzBrXlle0', 
                        title: 'Real-world Phishing Scenarios', 
                        description: 'Analysis of actual phishing campaigns and prevention strategies',
                        duration: '6:48', 
                        provider: 'Simplilearn',
                        embedAllowed: true
                    }
                ],
                lessonsContent: [
                    {
                        title: "Understanding Phishing Fundamentals",
                        content: `
                            <h3>What is Phishing?</h3>
                            <p>Phishing is a sophisticated cyber attack method that uses social engineering to trick individuals into revealing sensitive information. Attackers craft convincing communications that appear to be from legitimate sources, exploiting human psychology rather than technical vulnerabilities.</p>
                            
                            <h4>Evolution of Phishing Attacks:</h4>
                            <ul>
                                <li><strong>1980s-1990s:</strong> Basic email scams targeting AOL users</li>
                                <li><strong>Early 2000s:</strong> Nigerian prince scams and mass email campaigns</li>
                                <li><strong>2010s:</strong> Targeted spear phishing and business email compromise</li>
                                <li><strong>2020s:</strong> AI-powered phishing and deepfake technology</li>
                            </ul>

                            <h4>Common Phishing Techniques:</h4>
                            <div class="technique-grid">
                                <div class="technique-item">
                                    <i class="fas fa-bullseye"></i>
                                    <strong>Spear Phishing:</strong> Highly targeted attacks on specific individuals
                                </div>
                                <div class="technique-item">
                                    <i class="fas fa-whale"></i>
                                    <strong>Whaling:</strong> Attacks targeting C-level executives and senior management
                                </div>
                                <div class="technique-item">
                                    <i class="fas fa-sms"></i>
                                    <strong>Smishing:</strong> Phishing attacks delivered via SMS/text messages
                                </div>
                                <div class="technique-item">
                                    <i class="fas fa-phone"></i>
                                    <strong>Vishing:</strong> Voice-based phishing using phone calls
                                </div>
                                <div class="technique-item">
                                    <i class="fas fa-qrcode"></i>
                                    <strong>Quishing:</strong> QR code-based phishing attacks
                                </div>
                            </div>

                            <div class="stat-box">
                                <h4>By the Numbers:</h4>
                                <p>• 36% of all data breaches involve phishing (Verizon 2023)</p>
                                <p>• Average cost of phishing attack: $4.91 million (IBM)</p>
                                <p>• 83% of organizations experienced phishing attacks in 2023</p>
                            </div>
                        `
                    },
                    {
                        title: "Advanced Phishing Email Analysis",
                        content: `
                            <h3>Technical Indicators of Phishing Emails</h3>
                            <p>Modern phishing emails use sophisticated techniques to bypass security filters. Understanding these indicators is crucial for effective detection.</p>
                            
                            <h4>Email Header Analysis:</h4>
                            <ul>
                                <li><strong>SPF/DKIM/DMARC Failures:</strong> Check authentication protocols</li>
                                <li><strong>Reply-to Address Mismatch:</strong> Different from sender address</li>
                                <li><strong>X-Headers:</strong> Look for suspicious routing information</li>
                            </ul>

                            <h4>Content Analysis Red Flags:</h4>
                            <div class="warning-grid">
                                <div class="warning-item critical">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <div>
                                        <strong>Urgent Action Required</strong>
                                        <p>Creates artificial time pressure to bypass rational thinking</p>
                                    </div>
                                </div>
                                <div class="warning-item high">
                                    <i class="fas fa-link"></i>
                                    <div>
                                        <strong>URL Obfuscation</strong>
                                        <p>Hidden redirects, URL shorteners, or homograph attacks</p>
                                    </div>
                                </div>
                                <div class="warning-item medium">
                                    <i class="fas fa-paperclip"></i>
                                    <div>
                                        <strong>Unexpected Attachments</strong>
                                        <p>Macro-enabled documents or executable files</p>
                                    </div>
                                </div>
                                <div class="warning-item low">
                                    <i class="fas fa-user"></i>
                                    <div>
                                        <strong>Generic Greetings</strong>
                                        <p>"Dear Customer" instead of personalized addressing</p>
                                    </div>
                                </div>
                            </div>

                            <h4>Practical Exercise:</h4>
                            <div class="exercise-box">
                                <p><strong>Scenario:</strong> You receive an email from "security@paypa1.com" (note the number 1 instead of L) requesting immediate password verification. The link shows "paypal.com" but hovering reveals "paypa1-security.xyz".</p>
                                <p><strong>Analysis Steps:</strong></p>
                                <ol>
                                    <li>Check sender email address carefully</li>
                                    <li>Hover over all links without clicking</li>
                                    <li>Look for spelling errors in domain names</li>
                                    <li>Verify through official app or website</li>
                                </ol>
                            </div>
                        `
                    },
                    {
                        title: "Psychological Manipulation Techniques",
                        content: `
                            <h3>Understanding Social Engineering Psychology</h3>
                            <p>Phishers exploit fundamental psychological principles to manipulate victims. Recognizing these tactics is key to defense.</p>
                            
                            <h4>Key Psychological Principles:</h4>
                            <div class="psychology-grid">
                                <div class="psych-principle">
                                    <h5>Authority Principle</h5>
                                    <p>People tend to obey authority figures. Phishers impersonate executives, IT staff, or government officials.</p>
                                    <div class="example">"This is IT Security - we need your password immediately"</div>
                                </div>
                                <div class="psych-principle">
                                    <h5>Urgency & Scarcity</h5>
                                    <p>Creating time pressure prevents careful consideration and verification.</p>
                                    <div class="example">"Your account will be suspended in 24 hours if you don't act now"</div>
                                </div>
                                <div class="psych-principle">
                                    <h5>Social Proof</h5>
                                    <p>Suggesting others have already complied increases likelihood of action.</p>
                                    <div class="example">"All other department heads have already updated their credentials"</div>
                                </div>
                                <div class="psych-principle">
                                    <h5>Reciprocity</h5>
                                    <p>Offering something first creates obligation to reciprocate.</p>
                                    <div class="example">"We've credited $50 to your account, now please verify your details"</div>
                                </div>
                            </div>

                            <h4>Advanced Manipulation Tactics:</h4>
                            <ul>
                                <li><strong>Pretexting:</strong> Creating false scenarios to obtain information</li>
                                <li><strong>Baiting:</strong> Offering something desirable in exchange for access</li>
                                <li><strong>Quid Pro Quo:</strong> Offering a service in return for information</li>
                                <li><strong>Tailgating:</strong> Following authorized personnel into secure areas</li>
                            </ul>

                            <div class="case-study">
                                <h4>Real Case Study: Business Email Compromise</h4>
                                <p><strong>Incident:</strong> A finance employee received an email from "CEO@company.com" requesting urgent wire transfer for acquisition. The email used the CEO's actual speaking style and referenced recent company events.</p>
                                <p><strong>Outcome:</strong> $1.2 million transferred to criminal account</p>
                                <p><strong>Lessons Learned:</strong> Always verify financial requests through secondary channels, regardless of apparent authenticity.</p>
                            </div>
                        `
                    },
                    {
                        title: "Technical Defense Mechanisms",
                        content: `
                            <h3>Enterprise-Grade Phishing Protection</h3>
                            <p>Implementing layered security controls significantly reduces phishing success rates.</p>
                            
                            <h4>Email Security Controls:</h4>
                            <div class="security-controls">
                                <div class="control-category">
                                    <h5>Preventive Controls</h5>
                                    <ul>
                                        <li><strong>DMARC/DKIM/SPF:</strong> Email authentication protocols</li>
                                        <li><strong>Advanced Threat Protection:</strong> AI-based email filtering</li>
                                        <li><strong>URL Rewriting:</strong> Scan and rewrite suspicious links</li>
                                        <li><strong>Attachment Sandboxing:</strong> Execute attachments in isolated environment</li>
                                    </ul>
                                </div>
                                <div class="control-category">
                                    <h5>Detective Controls</h5>
                                    <ul>
                                        <li><strong>SIEM Integration:</strong> Correlate email events with other logs</li>
                                        <li><strong>User Behavior Analytics:</strong> Detect anomalous activity patterns</li>
                                        <li><strong>Phishing Simulations:</strong> Regular testing and training</li>
                                        <li><strong>Incident Response Playbooks:</strong> Standardized response procedures</li>
                                    </ul>
                                </div>
                            </div>

                            <h4>Multi-Factor Authentication (MFA):</h4>
                            <p>MFA is the single most effective control against credential phishing. Even if passwords are compromised, attackers cannot access accounts without the second factor.</p>
                            
                            <div class="mfa-comparison">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>MFA Type</th>
                                            <th>Security Level</th>
                                            <th>User Experience</th>
                                            <th>Recommendation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>SMS/Text</td>
                                            <td>Medium</td>
                                            <td>Good</td>
                                            <td>Adequate for most users</td>
                                        </tr>
                                        <tr>
                                            <td>Authenticator Apps</td>
                                            <td>High</td>
                                            <td>Excellent</td>
                                            <td>Recommended for all users</td>
                                        </tr>
                                        <tr>
                                            <td>Hardware Tokens</td>
                                            <td>Very High</td>
                                            <td>Fair</td>
                                            <td>For high-value accounts</td>
                                        </tr>
                                        <tr>
                                            <td>Biometric</td>
                                            <td>High</td>
                                            <td>Excellent</td>
                                            <td>Where supported</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h4>Security Awareness Best Practices:</h4>
                            <div class="best-practices">
                                <div class="practice-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Verify unusual requests through secondary channels</span>
                                </div>
                                <div class="practice-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Never reuse passwords across accounts</span>
                                </div>
                                <div class="practice-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Use password managers to avoid typing credentials</span>
                                </div>
                                <div class="practice-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Keep software and browsers updated</span>
                                </div>
                                <div class="practice-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Report suspicious emails to IT security immediately</span>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: "Incident Response & Recovery",
                        content: `
                            <h3>Responding to Phishing Incidents</h3>
                            <p>Even with robust defenses, some phishing attempts may succeed. Having a clear response plan is crucial.</p>
                            
                            <h4>Immediate Response Actions:</h4>
                            <div class="response-steps">
                                <div class="step">
                                    <div class="step-number">1</div>
                                    <div class="step-content">
                                        <strong>Contain the Incident</strong>
                                        <p>Disconnect affected systems from network, reset compromised credentials, revoke session tokens</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">2</div>
                                    <div class="step-content">
                                        <strong>Preserve Evidence</strong>
                                        <p>Save email headers, don't delete anything, take screenshots of suspicious activity</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">3</div>
                                    <div class="step-content">
                                        <strong>Notify Stakeholders</strong>
                                        <p>Inform IT security, management, and potentially affected parties based on data classification</p>
                                    </div>
                                </div>
                                <div class="step">
                                    <div class="step-number">4</div>
                                    <div class="step-content">
                                        <strong>Begin Investigation</strong>
                                        <p>Determine scope of compromise, identify data accessed, trace attacker activities</p>
                                    </div>
                                </div>
                            </div>

                            <h4>Forensic Investigation Techniques:</h4>
                            <ul>
                                <li><strong>Email Header Analysis:</strong> Trace email origin and routing</li>
                                <li><strong>Log Analysis:</strong> Review authentication and access logs</li>
                                <li><strong>Malware Analysis:</strong> Examine any downloaded content</li>
                                <li><strong>Network Traffic Analysis:</strong> Identify command and control communications</li>
                            </ul>

                            <h4>Recovery and Lessons Learned:</h4>
                            <div class="recovery-plan">
                                <div class="recovery-item">
                                    <h5>Communication Plan</h5>
                                    <p>Develop clear messaging for internal and external stakeholders. Be transparent about what happened and what you're doing about it.</p>
                                </div>
                                <div class="recovery-item">
                                    <h5>Security Enhancements</h5>
                                    <p>Implement additional controls based on incident findings. Consider enhanced monitoring or additional authentication requirements.</p>
                                </div>
                                <div class="recovery-item">
                                    <h5>Training Updates</h5>
                                    <p>Incorporate lessons learned into security awareness training. Use actual examples from the incident.</p>
                                </div>
                            </div>

                            <div class="compliance-section">
                                <h4>Regulatory Considerations:</h4>
                                <p>Depending on your industry and location, phishing incidents may trigger regulatory reporting requirements:</p>
                                <ul>
                                    <li><strong>GDPR:</strong> 72-hour notification requirement for data breaches</li>
                                    <li><strong>HIPAA:</strong> Breach notification rule for protected health information</li>
                                    <li><strong>SOX:</strong> Material incidents may require disclosure</li>
                                    <li><strong>State Laws:</strong> Various breach notification requirements</li>
                                </ul>
                            </div>
                        `
                    }
                ],
                quiz: {
                    title: "Phishing Awareness Certification Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "Which psychological principle do phishers exploit when impersonating company executives?",
                            options: [
                                "Reciprocity principle",
                                "Authority principle", 
                                "Social proof principle",
                                "Scarcity principle"
                            ],
                            correctAnswer: 1,
                            explanation: "The authority principle makes people more likely to comply with requests from perceived authority figures like executives."
                        },
                        {
                            id: 2,
                            question: "What is the primary purpose of DMARC email authentication?",
                            options: [
                                "To encrypt email content",
                                "To prevent email spoofing and phishing",
                                "To compress email attachments",
                                "To track email open rates"
                            ],
                            correctAnswer: 1,
                            explanation: "DMARC (Domain-based Message Authentication, Reporting & Conformance) helps prevent email spoofing and phishing by validating sender authenticity."
                        },
                        {
                            id: 3,
                            question: "Which of the following is the strongest indicator of a sophisticated phishing email?",
                            options: [
                                "Spelling errors in the body text",
                                "Generic greeting like 'Dear Customer'",
                                "Slight misspelling in the sender's domain name",
                                "Request for immediate action"
                            ],
                            correctAnswer: 2,
                            explanation: "Domain name misspellings (like 'paypa1.com' instead of 'paypal.com') are strong indicators of phishing, as they're harder to spot than simple spelling errors."
                        },
                        {
                            id: 4,
                            question: "What should be your first action if you accidentally click a phishing link?",
                            options: [
                                "Close the browser tab immediately",
                                "Disconnect from the network and report the incident",
                                "Run antivirus software",
                                "Change your email password"
                            ],
                            correctAnswer: 1,
                            explanation: "Immediately disconnecting from the network prevents potential malware communication and contains the incident, followed by reporting to IT security."
                        },
                        {
                            id: 5,
                            question: "Which multi-factor authentication method provides the highest security level?",
                            options: [
                                "SMS-based codes",
                                "Email-based codes", 
                                "Hardware security keys",
                                "Mobile authenticator apps"
                            ],
                            correctAnswer: 2,
                            explanation: "Hardware security keys (like YubiKey) provide the highest security as they're resistant to phishing and cannot be intercepted remotely."
                        },
                        {
                            id: 6,
                            question: "What does 'whaling' refer to in cybersecurity?",
                            options: [
                                "Phishing attacks targeting general consumers",
                                "Phishing attacks via voice calls",
                                "Phishing attacks targeting senior executives",
                                "Phishing attacks using QR codes"
                            ],
                            correctAnswer: 2,
                            explanation: "Whaling attacks specifically target high-level executives like CEOs and CFOs, using highly personalized social engineering tactics."
                        },
                        {
                            id: 7,
                            question: "Which header should you examine to verify an email's true origin?",
                            options: [
                                "Subject header",
                                "Received headers",
                                "Date header",
                                "Message-ID header"
                            ],
                            correctAnswer: 1,
                            explanation: "The 'Received' headers show the complete path an email took, making it possible to identify the true originating server and detect spoofing."
                        },
                        {
                            id: 8,
                            question: "What is the primary advantage of using a password manager against phishing?",
                            options: [
                                "It generates stronger passwords",
                                "It automatically fills passwords only on legitimate sites",
                                "It encrypts all passwords",
                                "It syncs across devices"
                            ],
                            correctAnswer: 1,
                            explanation: "Password managers only auto-fill credentials on websites they recognize, preventing credential entry on phishing sites even if users are tricked."
                        },
                        {
                            id: 9,
                            question: "Which regulatory requirement typically mandates 72-hour breach notification?",
                            options: [
                                "HIPAA",
                                "GDPR",
                                "PCI DSS",
                                "SOX"
                            ],
                            correctAnswer: 1,
                            explanation: "GDPR (General Data Protection Regulation) requires organizations to report personal data breaches to authorities within 72 hours of discovery."
                        },
                        {
                            id: 10,
                            question: "What is the most effective way to verify a suspicious financial request?",
                            options: [
                                "Reply to the email asking for confirmation",
                                "Call the requester using a known, verified number",
                                "Check the email signature for contact information",
                                "Forward the email to your manager"
                            ],
                            correctAnswer: 1,
                            explanation: "Always use a previously known, verified phone number (not from the suspicious email) to confirm financial requests through a different communication channel."
                        }
                    ],
                    passingScore: 80
                }
            },
            passwords: {
                id: 'passwords',
                title: "Password Security & Management",
                description: "Master modern password security practices and credential management",
                icon: "fas fa-key",
                color: "#FF6F00",
                category: "Foundation",
                duration: "40 min",
                lessons: 5,
                videos: [
                    { 
                        id: 'CNMKuqb3xFk', 
                        title: 'Fundamentals of Password Security', 
                        description: 'Understanding why password security matters in modern cybersecurity',
                        duration: '1:55', 
                        provider: 'Keeper Security',
                        embedAllowed: true
                    },
                    { 
                        id: 'Pm9D-h7FqV4', 
                        title: 'Creating Cryptographically Strong Passwords', 
                        description: 'Advanced techniques for generating and managing secure passwords',
                        duration: '4:30', 
                        provider: 'CyberSafetySimplified',
                        embedAllowed: true
                    },
                    { 
                        id: 'zuvUj7GaZU8', 
                        title: 'Enterprise Password Management Strategies', 
                        description: 'Implementing password managers in organizational environments',
                        duration: '9:19', 
                        provider: 'Cybernews',
                        embedAllowed: true
                    }
                ],
                lessonsContent: [
                    {
                        title: "Password Security Fundamentals",
                        content: `
                            <h3>The Evolution of Password Security</h3>
                            <p>Password security has evolved from simple word-based authentication to complex cryptographic verification. Understanding this evolution helps appreciate modern security requirements.</p>
                            
                            <h4>Historical Context:</h4>
                            <ul>
                                <li><strong>1960s:</strong> CTSS system introduces first passwords</li>
                                <li><strong>1970s:</strong> Unix crypt algorithm hashes passwords</li>
                                <li><strong>1980s:</strong> Dictionary attacks emerge</li>
                                <li><strong>1990s:</strong> Password policies become standardized</li>
                                <li><strong>2000s:</strong> Massive data breaches reveal password weaknesses</li>
                                <li><strong>2010s:</strong> NIST revises password guidelines based on research</li>
                                <li><strong>2020s:</strong> Passwordless authentication gains traction</li>
                            </ul>

                            <h4>Modern Threat Landscape:</h4>
                            <div class="threat-matrix">
                                <div class="threat-item">
                                    <i class="fas fa-bolt"></i>
                                    <strong>Brute Force Attacks:</strong> 8-character passwords cracked in hours
                                </div>
                                <div class="threat-item">
                                    <i class="fas fa-book"></i>
                                    <strong>Dictionary Attacks:</strong> Using common words and patterns
                                </div>
                                <div class="threat-item">
                                    <i class="fas fa-rainbow"></i>
                                    <strong>Rainbow Tables:</strong> Precomputed hash databases
                                </div>
                                <div class="threat-item">
                                    <i class="fas fa-phishing"></i>
                                    <strong>Credential Stuffing:</strong> Reusing breached passwords
                                </div>
                            </div>

                            <div class="stat-box">
                                <h4>Password Security Statistics:</h4>
                                <p>• 81% of hacking-related breaches use stolen or weak passwords</p>
                                <p>• 65% of people reuse passwords across multiple sites</p>
                                <p>• Average user has 100+ passwords to remember</p>
                                <p>• 43% of people have shared passwords with others</p>
                            </div>
                        `
                    },
                    {
                        title: "Creating Strong Passwords",
                        content: `
                            <h3>Modern Password Creation Strategies</h3>
                            <p>Forget everything you've heard about "complex" passwords. Modern research shows length and unpredictability matter more than complexity.</p>
                            
                            <h4>NIST Password Guidelines 2023:</h4>
                            <ul>
                                <li><strong>Minimum 12 characters</strong> (preferably 16+)</li>
                                <li><strong>Avoid complexity requirements</strong> that lead to predictable patterns</li>
                                <li><strong>Screen against known breached passwords</strong></li>
                                <li><strong>No mandatory periodic resets</strong> unless compromise suspected</li>
                                <li><strong>Encourage passphrases</strong> over traditional passwords</li>
                            </ul>

                            <h4>Password Strength Comparison:</h4>
                            <div class="password-comparison">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Password</th>
                                            <th>Strength</th>
                                            <th>Time to Crack</th>
                                            <th>Memorability</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="weak">
                                            <td>P@ssw0rd123!</td>
                                            <td>Weak</td>
                                            <td>3 hours</td>
                                            <td>Medium</td>
                                        </tr>
                                        <tr class="medium">
                                            <td>Blue42$ky!Rain9</td>
                                            <td>Medium</td>
                                            <td>2 months</td>
                                            <td>Low</td>
                                        </tr>
                                        <tr class="strong">
                                            <td>correct-horse-battery-staple</td>
                                            <td>Strong</td>
                                            <td>Centuries</td>
                                            <td>High</td>
                                        </tr>
                                        <tr class="very-strong">
                                            <td>TropicalSunset@Beach2024!</td>
                                            <td>Very Strong</td>
                                            <td>Millennia</td>
                                            <td>High</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h4>Advanced Creation Techniques:</h4>
                            <div class="technique-grid">
                                <div class="technique">
                                    <h5>Diceware Method</h5>
                                    <p>Use physical dice to select random words from a list. Combines 5-6 words for maximum security.</p>
                                    <div class="example">Example: correct-horse-battery-staple-verification</div>
                                </div>
                                <div class="technique">
                                    <h5>Sentence Method</h5>
                                    <p>Create a memorable sentence and use first letters or a pattern.</p>
                                    <div class="example">Example: "My first car was a Honda Civic in 2008!" → MfcwaHCi2008!</div>
                                </div>
                                <div class="technique">
                                    <h5>Keyboard Walking</h5>
                                    <p>Create patterns across keyboard rows without using actual words.</p>
                                    <div class="example">Example: 1qazXSW@3edcVFR$</div>
                                </div>
                            </div>
                        `
                    },
                    // ... Additional lessons for passwords module
                ],
                quiz: {
                    title: "Password Security Certification Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "According to NIST guidelines, what is the recommended minimum password length?",
                            options: [
                                "8 characters",
                                "10 characters", 
                                "12 characters",
                                "16 characters"
                            ],
                            correctAnswer: 2,
                            explanation: "NIST Special Publication 800-63B recommends a minimum of 12 characters for user-chosen passwords."
                        },
                        {
                            id: 2,
                            question: "Which password creation method typically provides the best balance of security and memorability?",
                            options: [
                                "Complex passwords with special characters",
                                "Passphrases using multiple random words",
                                "Pattern-based passwords using keyboard walks",
                                "Personally meaningful words with substitutions"
                            ],
                            correctAnswer: 1,
                            explanation: "Passphrases combining multiple random words provide excellent security while remaining memorable, avoiding the predictable patterns of complex passwords."
                        },
                        // ... 8 more questions for passwords quiz
                    ],
                    passingScore: 80
                }
            },
            social: {
                id: 'social',
                title: "Social Engineering Defense",
                description: "Master psychological manipulation recognition and defense strategies",
                icon: "fas fa-users",
                color: "#10B981",
                category: "Intermediate",
                duration: "50 min",
                lessons: 5,
                // ... comprehensive content for social engineering
                quiz: {
                    title: "Social Engineering Defense Quiz",
                    questions: [
                        // ... 10 professional questions
                    ],
                    passingScore: 80
                }
            },
            network: {
                id: 'network',
                title: "Network Security Fundamentals",
                description: "Comprehensive network protection and secure communication practices",
                icon: "fas fa-wifi",
                color: "#8B5CF6",
                category: "Intermediate",
                duration: "55 min",
                lessons: 5,
                // ... comprehensive content for network security
                quiz: {
                    title: "Network Security Certification Quiz",
                    questions: [
                        // ... 10 professional questions
                    ],
                    passingScore: 80
                }
            },
            data: {
                id: 'data',
                title: "Data Protection & Privacy",
                description: "Advanced data security, encryption, and privacy compliance",
                icon: "fas fa-database",
                color: "#EF4444",
                category: "Advanced",
                duration: "60 min",
                lessons: 5,
                // ... comprehensive content for data protection
                quiz: {
                    title: "Data Protection Professional Quiz",
                    questions: [
                        // ... 10 professional questions
                    ],
                    passingScore: 80
                }
            },
            mobile: {
                id: 'mobile',
                title: "Mobile Security Management",
                description: "Comprehensive mobile device and application security",
                icon: "fas fa-mobile-alt",
                color: "#F59E0B",
                category: "Advanced",
                duration: "45 min",
                lessons: 5,
                // ... comprehensive content for mobile security
                quiz: {
                    title: "Mobile Security Expert Quiz",
                    questions: [
                        // ... 10 professional questions
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

        // Close modal - but don't navigate away, just hide
        closeBtn.addEventListener('click', () => {
            this.hideModuleModal();
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModuleModal();
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
                this.checkQuizAccess();
            });
        }
    }

    hideModuleModal() {
        const modal = document.getElementById('moduleContentModal');
        if (modal) {
            modal.style.display = 'none';
            
            // Clean up video players when modal closes
            if (window.videoPlayerManager) {
                window.videoPlayerManager.closeVideoModal();
            }
            
            // Don't navigate away - stay in modules section
            console.log('📦 Module modal hidden, staying in modules section');
        }
    }

    async checkQuizAccess() {
        if (!this.currentModule) return;
        
        console.log('🔍 Checking quiz access for module:', this.currentModule.id);
        
        const user = firebase.auth().currentUser;
        if (!user) {
            alert('Please log in to access quizzes.');
            return;
        }
        
        try {
            const moduleProgress = await window.firestoreService.getModuleProgress(user.uid, this.currentModule.id);
            const videosCompleted = moduleProgress?.videosCompleted || [];
            const totalVideos = this.currentModule.videos?.length || 0;
            
            console.log('📊 Quiz access check:', {
                videosCompleted: videosCompleted.length,
                totalVideos: totalVideos,
                progress: moduleProgress?.progress || 0
            });
            
            // Allow quiz if at least 70% of videos watched or progress is high
            const completionRatio = totalVideos > 0 ? videosCompleted.length / totalVideos : 0;
            const canAccessQuiz = completionRatio >= 0.7 || (moduleProgress?.progress || 0) >= 70;
            
            if (canAccessQuiz) {
                this.startQuiz();
            } else {
                this.showQuizAccessDenied();
            }
            
        } catch (error) {
            console.error('❌ Error checking quiz access:', error);
            // Fallback: allow quiz but show warning
            if (confirm('Unable to verify video completion. Start quiz anyway?')) {
                this.startQuiz();
            }
        }
    }

    showQuizAccessDenied() {
        const quizTab = document.getElementById('quizTab');
        if (!quizTab) return;
        
        // Update quiz tab content to show access requirements
        quizTab.innerHTML = `
            <div class="quiz-access-denied">
                <div class="access-denied-content">
                    <i class="fas fa-lock fa-3x"></i>
                    <h3>Quiz Locked</h3>
                    <p>Complete at least 70% of the module videos to unlock this quiz.</p>
                    <div class="access-requirements">
                        <div class="requirement">
                            <i class="fas fa-play-circle"></i>
                            <span>Watch module videos</span>
                        </div>
                        <div class="requirement">
                            <i class="fas fa-check-circle"></i>
                            <span>Complete video lessons</span>
                        </div>
                        <div class="requirement">
                            <i class="fas fa-unlock"></i>
                            <span>Quiz will unlock automatically</span>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="window.moduleContentManager.switchTab('videos', document.querySelector('[data-tab=\\'videos\\']'))">
                        <i class="fas fa-arrow-left"></i>
                        Back to Videos
                    </button>
                </div>
            </div>
        `;
        
        // Switch to videos tab to help user complete requirements
        const videosTabButton = document.querySelector('[data-tab="videos"]');
        if (videosTabButton) {
            this.switchTab('videos', videosTabButton);
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