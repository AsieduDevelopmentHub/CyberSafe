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
                lessons: 3,
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
                            </div>
                        `
                    },
                    {
                        title: "Protection & Response Strategies",
                        content: `
                            <h3>Multi-Layered Defense Approach</h3>
                            <p>Implementing layered security controls significantly reduces phishing success rates.</p>
                            
                            <h4>Technical Controls:</h4>
                            <ul>
                                <li><strong>Email Filtering:</strong> Advanced threat protection systems</li>
                                <li><strong>Multi-Factor Authentication:</strong> Critical for account protection</li>
                                <li><strong>Web Filtering:</strong> Block known malicious websites</li>
                            </ul>

                            <h4>Human Controls:</h4>
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
                                    <span>Report suspicious emails immediately</span>
                                </div>
                            </div>
                        `
                    }
                ],
                quiz: {
                    title: "Phishing Awareness Quiz",
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
                        }
                    ],
                    passingScore: 80
                }
            },
            passwords: {
                id: 'passwords',
                title: "Password Security",
                description: "Create strong passwords and manage them securely using modern best practices",
                icon: "fas fa-key",
                color: "#FF6F00",
                category: "Foundation",
                duration: "35 min",
                lessons: 3,
                videos: [
                    { 
                        id: 'CNMKuqb3xFk', 
                        title: 'Why Password Security Matters', 
                        description: 'Understanding the critical importance of password security in modern cybersecurity',
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
                        title: 'Password Managers Complete Guide', 
                        description: 'Comprehensive guide to using password managers effectively and securely',
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
                                <li><strong>2000s:</strong> Massive data breaches reveal password weaknesses</li>
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
                            </div>

                            <div class="stat-box">
                                <h4>Password Security Statistics:</h4>
                                <p>• 81% of hacking-related breaches use stolen or weak passwords</p>
                                <p>• 65% of people reuse passwords across multiple sites</p>
                                <p>• Average user has 100+ passwords to remember</p>
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
                            </ul>

                            <h4>Password Creation Techniques:</h4>
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
                            </div>
                        `
                    },
                    {
                        title: "Password Management Solutions",
                        content: `
                            <h3>Enterprise Password Management</h3>
                            <p>Password managers are essential tools for modern password security, providing both convenience and enhanced protection.</p>
                            
                            <h4>Benefits of Password Managers:</h4>
                            <ul>
                                <li><strong>Generate Strong Passwords:</strong> Create unique, complex passwords for each account</li>
                                <li><strong>Auto-fill Protection:</strong> Only fill credentials on legitimate sites</li>
                                <li><strong>Breach Monitoring:</strong> Alert when passwords appear in data breaches</li>
                                <li><strong>Secure Sharing:</strong> Safely share passwords with family or team members</li>
                            </ul>

                            <h4>Choosing a Password Manager:</h4>
                            <div class="comparison-grid">
                                <div class="feature-item">
                                    <strong>Zero-Knowledge Architecture</strong>
                                    <p>Your master password never leaves your device</p>
                                </div>
                                <div class="feature-item">
                                    <strong>End-to-End Encryption</strong>
                                    <p>All data encrypted before leaving your device</p>
                                </div>
                                <div class="feature-item">
                                    <strong>Two-Factor Authentication</strong>
                                    <p>Additional security layer for your vault</p>
                                </div>
                            </div>
                        `
                    }
                ],
                quiz: {
                    title: "Password Security Quiz",
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
                            explanation: "Passphrases combining multiple random words provide excellent security while remaining memorable, avoiding predictable patterns of complex passwords."
                        },
                        {
                            id: 3,
                            question: "What is the primary security advantage of using a password manager?",
                            options: [
                                "It automatically changes your passwords weekly",
                                "It prevents you from needing to remember any passwords",
                                "It allows using unique strong passwords for every account",
                                "It encrypts all your internet traffic"
                            ],
                            correctAnswer: 2,
                            explanation: "The key security benefit is enabling unique, strong passwords for every account without the memory burden, preventing credential stuffing attacks."
                        },
                        {
                            id: 4,
                            question: "Why has NIST recommended against mandatory password changes?",
                            options: [
                                "Passwords don't need to be changed if they're strong",
                                "Frequent changes lead to predictable password patterns",
                                "Modern encryption makes password changes unnecessary",
                                "Users should decide when to change their passwords"
                            ],
                            correctAnswer: 1,
                            explanation: "Research shows frequent mandatory changes cause users to create predictable patterns (Password1, Password2, etc.), reducing security."
                        },
                        {
                            id: 5,
                            question: "What is 'credential stuffing' in cybersecurity?",
                            options: [
                                "Adding extra characters to make passwords longer",
                                "Using breached passwords to attack other accounts",
                                "Filling password forms with random characters",
                                "Storing multiple passwords for the same account"
                            ],
                            correctAnswer: 1,
                            explanation: "Credential stuffing attacks use username/password pairs from previous breaches to attempt login on other services where people reuse credentials."
                        },
                        {
                            id: 6,
                            question: "Which feature is most critical when choosing a password manager?",
                            options: [
                                "Cloud synchronization across devices",
                                "Zero-knowledge architecture",
                                "Built-in password generator",
                                "Family sharing capabilities"
                            ],
                            correctAnswer: 1,
                            explanation: "Zero-knowledge architecture ensures the service provider cannot access your passwords, as encryption/decryption happens only on your device."
                        }
                    ],
                    passingScore: 80
                }
            },
            social: {
                id: 'social',
                title: "Social Engineering Defense",
                description: "Recognize and defend against psychological manipulation tactics used by attackers",
                icon: "fas fa-users",
                color: "#10B981",
                category: "Intermediate",
                duration: "40 min",
                lessons: 3,
                videos: [
                    { 
                        id: 'v7VTJhkJUUY', 
                        title: 'Social Engineering Attacks Explained', 
                        description: 'Learn about common social engineering techniques and real-world examples',
                        duration: '6:56', 
                        provider: 'MalwareFox',
                        embedAllowed: true
                    },
                    { 
                        id: 'XEtvwzN_xJk', 
                        title: 'How to Avoid Social Engineering Attacks', 
                        description: 'Practical strategies to protect yourself from social engineering',
                        duration: '2:16', 
                        provider: 'Google Help',
                        embedAllowed: true
                    },
                    { 
                        id: 'lc7scxvKQOo', 
                        title: 'Social Engineering - Human Hacking', 
                        description: 'Understanding manipulation tactics and psychological principles used by attackers',
                        duration: '9:10', 
                        provider: 'Garrett Myler',
                        embedAllowed: true
                    }
                ],
                lessonsContent: [
                    {
                        title: "Understanding Social Engineering",
                        content: `
                            <h3>What is Social Engineering?</h3>
                            <p>Social engineering is the psychological manipulation of people into performing actions or divulging confidential information. Unlike traditional hacking that targets technical vulnerabilities, social engineering targets human psychology.</p>
                            
                            <h4>Common Social Engineering Attacks:</h4>
                            <ul>
                                <li><strong>Pretexting:</strong> Creating false scenarios to obtain information</li>
                                <li><strong>Baiting:</strong> Offering something desirable in exchange for access</li>
                                <li><strong>Quid Pro Quo:</strong> Offering a service in return for information</li>
                                <li><strong>Tailgating:</strong> Following authorized personnel into secure areas</li>
                            </ul>

                            <h4>Psychological Principles Exploited:</h4>
                            <div class="psychology-grid">
                                <div class="psych-principle">
                                    <h5>Authority Principle</h5>
                                    <p>People tend to obey authority figures without question</p>
                                </div>
                                <div class="psych-principle">
                                    <h5>Urgency & Scarcity</h5>
                                    <p>Creating time pressure prevents careful consideration</p>
                                </div>
                                <div class="psych-principle">
                                    <h5>Social Proof</h5>
                                    <p>Suggesting others have complied increases likelihood of action</p>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: "Recognizing Manipulation Tactics",
                        content: `
                            <h3>Identifying Social Engineering Attempts</h3>
                            <p>Successful social engineering defense requires recognizing the subtle signs of manipulation in various contexts.</p>
                            
                            <h4>Common Manipulation Tactics:</h4>
                            <div class="tactics-grid">
                                <div class="tactic-item">
                                    <i class="fas fa-clock"></i>
                                    <strong>Creating Urgency</strong>
                                    <p>"This must be done immediately or your account will be closed"</p>
                                </div>
                                <div class="tactic-item">
                                    <i class="fas fa-gift"></i>
                                    <strong>Offering Incentives</strong>
                                    <p>"We'll give you a $50 credit if you verify your account now"</p>
                                </div>
                                <div class="tactic-item">
                                    <i class="fas fa-users"></i>
                                    <strong>Using Social Proof</strong>
                                    <p>"All other team members have already completed this"</p>
                                </div>
                            </div>

                            <h4>Real-World Scenarios:</h4>
                            <div class="scenario-box">
                                <strong>Vishing Attack:</strong> Caller claims to be from "Microsoft Support" reporting viruses on your computer and requests remote access to "fix" the issue.
                            </div>
                            <div class="scenario-box">
                                <strong>Baiting Scenario:</strong> USB drives labeled "Confidential" or "Salary Information" left in parking lots or restrooms.
                            </div>
                        `
                    },
                    {
                        title: "Defense Strategies & Best Practices",
                        content: `
                            <h3>Building Social Engineering Resilience</h3>
                            <p>Effective defense against social engineering requires both technical controls and human awareness.</p>
                            
                            <h4>Organizational Defenses:</h4>
                            <ul>
                                <li><strong>Security Awareness Training:</strong> Regular, engaging training sessions</li>
                                <li><strong>Clear Security Policies:</strong> Well-defined procedures for verification</li>
                                <li><strong>Incident Reporting:</strong> Easy-to-use reporting mechanisms</li>
                                <li><strong>Physical Security:</strong> Access controls and visitor management</li>
                            </ul>

                            <h4>Personal Defense Techniques:</h4>
                            <div class="defense-grid">
                                <div class="defense-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Verify identity through independent channels</span>
                                </div>
                                <div class="defense-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Question urgency and too-good-to-be-true offers</span>
                                </div>
                                <div class="defense-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Implement the "need to know" principle</span>
                                </div>
                            </div>
                        `
                    }
                ],
                quiz: {
                    title: "Social Engineering Defense Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "What is the main goal of social engineering attacks?",
                            options: [
                                "To damage computer hardware",
                                "To manipulate people into revealing information",
                                "To spread computer viruses",
                                "To test network security"
                            ],
                            correctAnswer: 1,
                            explanation: "Social engineering aims to manipulate individuals into divulging confidential information or performing actions that compromise security."
                        },
                        {
                            id: 2,
                            question: "Which psychological principle involves people following instructions from perceived authority figures?",
                            options: [
                                "Reciprocity principle",
                                "Authority principle",
                                "Social proof principle",
                                "Scarcity principle"
                            ],
                            correctAnswer: 1,
                            explanation: "The authority principle makes people more likely to comply with requests from individuals they perceive as having authority or expertise."
                        },
                        {
                            id: 3,
                            question: "What is 'pretexting' in social engineering?",
                            options: [
                                "Creating fake websites that look legitimate",
                                "Using a fabricated scenario to obtain information",
                                "Sending mass emails to many potential victims",
                                "Installing malware through email attachments"
                            ],
                            correctAnswer: 1,
                            explanation: "Pretexting involves creating a false identity or scenario to establish legitimacy and trick victims into providing information or access."
                        },
                        {
                            id: 4,
                            question: "Which of the following is the best defense against social engineering?",
                            options: [
                                "Using complex passwords",
                                "Verifying requests through independent channels",
                                "Installing antivirus software",
                                "Using a VPN service"
                            ],
                            correctAnswer: 1,
                            explanation: "Verifying unusual requests through known, independent contact methods is the most effective defense against social engineering attempts."
                        },
                        {
                            id: 5,
                            question: "What is 'tailgating' in physical social engineering?",
                            options: [
                                "Sending follow-up emails after initial contact",
                                "Following someone through a secure entrance",
                                "Monitoring social media for personal information",
                                "Creating fake social media profiles"
                            ],
                            correctAnswer: 1,
                            explanation: "Tailgating involves following an authorized person through a secure entrance without proper authentication."
                        },
                        {
                            id: 6,
                            question: "Why do social engineers often create a sense of urgency?",
                            options: [
                                "To make the attack more exciting",
                                "To pressure victims into acting without thinking",
                                "To demonstrate their technical skills",
                                "To test how people handle stress"
                            ],
                            correctAnswer: 1,
                            explanation: "Creating urgency prevents victims from carefully considering the situation and conducting proper verification, increasing the attack's success rate."
                        }
                    ],
                    passingScore: 80
                }
            },
            network: {
                id: 'network',
                title: "Network Security Fundamentals",
                description: "Secure your network connections and understand safe browsing practices",
                icon: "fas fa-wifi",
                color: "#8B5CF6",
                category: "Intermediate",
                duration: "45 min",
                lessons: 3,
                videos: [
                    { 
                        id: '_-DekqEyAV0', 
                        title: 'VPNs Explained - Privacy & Security', 
                        description: 'Comprehensive understanding of VPN technology and security benefits',
                        duration: '5:49', 
                        provider: 'Simplilearn',
                        embedAllowed: true
                    },
                    { 
                        id: 'aO858HyFbKI', 
                        title: 'Safe Browsing Habits for 2025', 
                        description: 'Latest best practices for secure internet browsing and threat avoidance',
                        duration: '4:01', 
                        provider: 'Kaspersky',
                        embedAllowed: true
                    },
                    { 
                        id: '9GZlVOafYTg', 
                        title: 'Firewalls and Network Security Basics', 
                        description: 'Understanding firewalls and essential network protection mechanisms',
                        duration: '5:38', 
                        provider: 'Simplilearn',
                        embedAllowed: true
                    }
                ],
                lessonsContent: [
                    {
                        title: "Network Security Basics",
                        content: `
                            <h3>Understanding Network Threats</h3>
                            <p>Network security involves implementing measures to protect the usability, reliability, integrity, and safety of network and data.</p>
                            
                            <h4>Common Network Threats:</h4>
                            <ul>
                                <li><strong>Man-in-the-Middle Attacks:</strong> Intercepting communications between two parties</li>
                                <li><strong>DNS Spoofing:</strong> Redirecting traffic to malicious websites</li>
                                <li><strong>Packet Sniffing:</strong> Capturing and analyzing network traffic</li>
                                <li><strong>Rogue Access Points:</strong> Unauthorized wireless access points</li>
                            </ul>

                            <h4>Essential Network Security Components:</h4>
                            <div class="component-grid">
                                <div class="component-item">
                                    <i class="fas fa-shield-alt"></i>
                                    <strong>Firewalls</strong>
                                    <p>Monitor and control incoming and outgoing network traffic</p>
                                </div>
                                <div class="component-item">
                                    <i class="fas fa-user-shield"></i>
                                    <strong>VPNs</strong>
                                    <p>Create secure encrypted connections over public networks</p>
                                </div>
                                <div class="component-item">
                                    <i class="fas fa-lock"></i>
                                    <strong>Encryption</strong>
                                    <p>Protect data in transit from interception</p>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: "Secure Browsing Practices",
                        content: `
                            <h3>Safe Internet Usage Guidelines</h3>
                            <p>Adopting secure browsing habits is crucial for protecting against online threats and maintaining privacy.</p>
                            
                            <h4>Browser Security Features:</h4>
                            <ul>
                                <li><strong>HTTPS Everywhere:</strong> Ensure encrypted connections to websites</li>
                                <li><strong>Privacy Extensions:</strong> Use ad-blockers and privacy tools</li>
                                <li><strong>Regular Updates:</strong> Keep browsers and plugins current</li>
                                <li><strong>Cookie Management:</strong> Control tracking and third-party cookies</li>
                            </ul>

                            <h4>Safe Browsing Habits:</h4>
                            <div class="habits-grid">
                                <div class="habit-item">
                                    <i class="fas fa-check"></i>
                                    <span>Verify website security certificates</span>
                                </div>
                                <div class="habit-item">
                                    <i class="fas fa-check"></i>
                                    <span>Avoid public Wi-Fi for sensitive activities</span>
                                </div>
                                <div class="habit-item">
                                    <i class="fas fa-check"></i>
                                    <span>Use incognito mode for private browsing</span>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: "VPN & Encryption Technologies",
                        content: `
                            <h3>Virtual Private Networks Explained</h3>
                            <p>VPNs create secure, encrypted tunnels for internet traffic, protecting data from interception and maintaining privacy.</p>
                            
                            <h4>How VPNs Work:</h4>
                            <ul>
                                <li><strong>Encryption:</strong> Scrambles data so it's unreadable to interceptors</li>
                                <li><strong>Tunneling:</strong> Creates secure pathways through public networks</li>
                                <li><strong>IP Masking:</strong> Hides your real IP address and location</li>
                                <li><strong>Kill Switch:</strong> Automatically disconnects if VPN fails</li>
                            </ul>

                            <h4>Choosing a VPN Service:</h4>
                            <div class="vpn-criteria">
                                <div class="criterion">
                                    <strong>No-Logs Policy</strong>
                                    <p>Provider doesn't store your activity data</p>
                                </div>
                                <div class="criterion">
                                    <strong>Strong Encryption</strong>
                                    <p>Uses military-grade encryption protocols</p>
                                </div>
                                <div class="criterion">
                                    <strong>Server Locations</strong>
                                    <p>Multiple geographic options for better performance</p>
                                </div>
                            </div>
                        `
                    }
                ],
                quiz: {
                    title: "Network Security Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "What does VPN stand for and what is its primary purpose?",
                            options: [
                                "Virtual Private Network - to hide internet activity from ISP",
                                "Very Protected Network - to increase internet speed",
                                "Virtual Public Network - to share files securely",
                                "Verified Private Network - to block malicious websites"
                            ],
                            correctAnswer: 0,
                            explanation: "VPN stands for Virtual Private Network, and its primary purpose is to create an encrypted tunnel that hides your internet activity from your ISP and other observers."
                        },
                        {
                            id: 2,
                            question: "What is the main security risk of using public Wi-Fi networks?",
                            options: [
                                "Slower internet speeds",
                                "Man-in-the-middle attacks and data interception",
                                "Automatic connection to malicious networks",
                                "Increased battery consumption"
                            ],
                            correctAnswer: 1,
                            explanation: "Public Wi-Fi networks are vulnerable to man-in-the-middle attacks where attackers can intercept unencrypted data transmissions."
                        },
                        {
                            id: 3,
                            question: "What should you look for in a website's address bar to ensure a secure connection?",
                            options: [
                                "A green background color",
                                "The text 'Secure' displayed",
                                "A padlock icon and HTTPS protocol",
                                "The website owner's name"
                            ],
                            correctAnswer: 2,
                            explanation: "The padlock icon and HTTPS (instead of HTTP) indicate the connection is encrypted and secure against eavesdropping."
                        },
                        {
                            id: 4,
                            question: "What is the primary function of a firewall in network security?",
                            options: [
                                "To detect and remove viruses",
                                "To monitor and control network traffic",
                                "To encrypt data transmissions",
                                "To block spam emails"
                            ],
                            correctAnswer: 1,
                            explanation: "Firewalls monitor incoming and outgoing network traffic and decide whether to allow or block specific traffic based on security rules."
                        },
                        {
                            id: 5,
                            question: "Why is it important to keep your router's firmware updated?",
                            options: [
                                "To get new features and better Wi-Fi range",
                                "To patch security vulnerabilities and protect your network",
                                "To improve internet service provider compatibility",
                                "To reduce electricity consumption"
                            ],
                            correctAnswer: 1,
                            explanation: "Router firmware updates often include critical security patches that protect against newly discovered vulnerabilities that attackers could exploit."
                        },
                        {
                            id: 6,
                            question: "What does a 'kill switch' feature do in a VPN?",
                            options: [
                                "Turns off the VPN when not needed to save bandwidth",
                                "Automatically disconnects the internet if VPN connection drops",
                                "Blocks specific websites from being accessed",
                                "Shuts down the computer if malware is detected"
                            ],
                            correctAnswer: 1,
                            explanation: "A VPN kill switch automatically disconnects your device from the internet if the VPN connection fails, preventing data leaks."
                        }
                    ],
                    passingScore: 80
                }
            },
            data: {
                id: 'data',
                title: "Data Protection & Privacy",
                description: "Secure your personal information and understand data privacy regulations",
                icon: "fas fa-database",
                color: "#EF4444",
                category: "Advanced",
                duration: "50 min",
                lessons: 3,
                videos: [
                    { 
                        id: 'NpQPBKvYYlc', 
                        title: 'Data Protection Principles - GDPR Basics', 
                        description: 'Understanding data security fundamentals and privacy regulations',
                        duration: '13:49', 
                        provider: 'Xploit Cyber Security',
                        embedAllowed: true
                    },
                    { 
                        id: '5epUUK3jqRQ', 
                        title: 'Personal Data Security in Digital Age', 
                        description: 'Strategies for protecting personal information in modern digital environments',
                        duration: '10:07', 
                        provider: 'MS Learning',
                        embedAllowed: true
                    },
                    { 
                        id: 'p1buq8pAuyE', 
                        title: 'Data Privacy Tips Everyone Should Know', 
                        description: 'Essential practices for maintaining data privacy and security',
                        duration: '1:09', 
                        provider: 'RapidTech Bites',
                        embedAllowed: true
                    }
                ],
                lessonsContent: [
                    {
                        title: "Data Protection Fundamentals",
                        content: `
                            <h3>Understanding Data Classification</h3>
                            <p>Data protection begins with understanding what data you have and its sensitivity level. Proper classification enables appropriate security measures.</p>
                            
                            <h4>Data Classification Levels:</h4>
                            <ul>
                                <li><strong>Public:</strong> Information available to anyone (website content, marketing materials)</li>
                                <li><strong>Internal:</strong> Company-only information (policies, procedures)</li>
                                <li><strong>Confidential:</strong> Sensitive business information (financial data, strategic plans)</li>
                                <li><strong>Restricted:</strong> Highly sensitive data (personal identifiers, health records)</li>
                            </ul>

                            <h4>Data Protection Principles:</h4>
                            <div class="principles-grid">
                                <div class="principle-item">
                                    <i class="fas fa-user-shield"></i>
                                    <strong>Confidentiality</strong>
                                    <p>Protecting data from unauthorized access</p>
                                </div>
                                <div class="principle-item">
                                    <i class="fas fa-check-circle"></i>
                                    <strong>Integrity</strong>
                                    <p>Ensuring data accuracy and completeness</p>
                                </div>
                                <div class="principle-item">
                                    <i class="fas fa-unlock"></i>
                                    <strong>Availability</strong>
                                    <p>Ensuring authorized access when needed</p>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: "Privacy Regulations & Compliance",
                        content: `
                            <h3>Global Data Privacy Regulations</h3>
                            <p>Understanding major data protection laws is essential for compliance and avoiding significant penalties.</p>
                            
                            <h4>Key Regulations:</h4>
                            <ul>
                                <li><strong>GDPR (General Data Protection Regulation):</strong> European Union regulation with global impact</li>
                                <li><strong>CCPA (California Consumer Privacy Act):</strong> California's comprehensive privacy law</li>
                                <li><strong>HIPAA (Health Insurance Portability and Accountability Act):</strong> US healthcare data protection</li>
                                <li><strong>PIPEDA (Personal Information Protection and Electronic Documents Act):</strong> Canadian privacy law</li>
                            </ul>

                            <h4>Individual Rights Under GDPR:</h4>
                            <div class="rights-grid">
                                <div class="right-item">
                                    <i class="fas fa-eye"></i>
                                    <strong>Right to Access</strong>
                                    <p>Know what data is collected about you</p>
                                </div>
                                <div class="right-item">
                                    <i class="fas fa-eraser"></i>
                                    <strong>Right to Erasure</strong>
                                    <p>Request deletion of your personal data</p>
                                </div>
                                <div class="right-item">
                                    <i class="fas fa-ban"></i>
                                    <strong>Right to Object</strong>
                                    <p>Opt-out of data processing</p>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: "Practical Data Protection Strategies",
                        content: `
                            <h3>Implementing Data Security Measures</h3>
                            <p>Effective data protection requires both technical controls and organizational policies.</p>
                            
                            <h4>Technical Controls:</h4>
                            <ul>
                                <li><strong>Encryption:</strong> Protect data at rest and in transit</li>
                                <li><strong>Access Controls:</strong> Role-based permissions and least privilege</li>
                                <li><strong>Data Loss Prevention (DLP):</strong> Monitor and prevent data exfiltration</li>
                                <li><strong>Backup and Recovery:</strong> Regular backups and tested recovery procedures</li>
                            </ul>

                            <h4>Organizational Measures:</h4>
                            <div class="measures-grid">
                                <div class="measure-item">
                                    <i class="fas fa-file-contract"></i>
                                    <strong>Data Processing Agreements</strong>
                                    <p>Contracts with third parties handling your data</p>
                                </div>
                                <div class="measure-item">
                                    <i class="fas fa-user-graduate"></i>
                                    <strong>Employee Training</strong>
                                    <p>Regular security awareness education</p>
                                </div>
                                <div class="measure-item">
                                    <i class="fas fa-clipboard-list"></i>
                                    <strong>Incident Response Plans</strong>
                                    <p>Prepared procedures for data breaches</p>
                                </div>
                            </div>
                        `
                    }
                ],
                quiz: {
                    title: "Data Protection Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "What are the three core principles of data protection known as the CIA triad?",
                            options: [
                                "Confidentiality, Integrity, Availability",
                                "Confidentiality, Insurance, Authentication",
                                "Control, Integrity, Access",
                                "Confidentiality, Identification, Authorization"
                            ],
                            correctAnswer: 0,
                            explanation: "The CIA triad represents Confidentiality (protecting data from unauthorized access), Integrity (ensuring data accuracy), and Availability (ensuring authorized access)."
                        },
                        {
                            id: 2,
                            question: "What is the primary purpose of the GDPR (General Data Protection Regulation)?",
                            options: [
                                "To standardize data protection laws across Europe",
                                "To require encryption of all personal data",
                                "To ban data collection by companies",
                                "To make data protection optional for businesses"
                            ],
                            correctAnswer: 0,
                            explanation: "GDPR harmonizes data privacy laws across Europe and gives individuals control over their personal data while imposing strict rules on organizations."
                        },
                        {
                            id: 3,
                            question: "What does 'data minimization' mean in data protection?",
                            options: [
                                "Using the smallest possible data storage solutions",
                                "Collecting only the data necessary for specific purposes",
                                "Reducing data quality to save storage space",
                                "Deleting all data after 30 days"
                            ],
                            correctAnswer: 1,
                            explanation: "Data minimization means organizations should only collect and process personal data that is necessary for specific, explicit, and legitimate purposes."
                        },
                        {
                            id: 4,
                            question: "What is a Data Protection Impact Assessment (DPIA)?",
                            options: [
                                "A test to measure data storage capacity",
                                "A process to identify and reduce data protection risks",
                                "An audit of data backup procedures",
                                "A survey of customer data preferences"
                            ],
                            correctAnswer: 1,
                            explanation: "A DPIA is a process designed to help organizations systematically analyze, identify, and minimize data protection risks of a project or system."
                        },
                        {
                            id: 5,
                            question: "What is the 'right to be forgotten' under GDPR?",
                            options: [
                                "The right to have personal data deleted under certain circumstances",
                                "The right to anonymously browse the internet",
                                "The right to opt-out of all data collection",
                                "The right to use pseudonyms online"
                            ],
                            correctAnswer: 0,
                            explanation: "The right to be forgotten allows individuals to request the deletion of their personal data when it's no longer necessary or if they withdraw consent."
                        },
                        {
                            id: 6,
                            question: "What is the main purpose of data encryption?",
                            options: [
                                "To make data transmission faster",
                                "To convert data into unreadable format without proper key",
                                "To compress data for efficient storage",
                                "To organize data in structured formats"
                            ],
                            correctAnswer: 1,
                            explanation: "Encryption converts data into an unreadable format (ciphertext) that can only be decrypted with the proper key, protecting it from unauthorized access."
                        }
                    ],
                    passingScore: 80
                }
            },
            mobile: {
                id: 'mobile',
                title: "Mobile Security Management",
                description: "Secure your mobile devices and understand app security best practices",
                icon: "fas fa-mobile-alt",
                color: "#F59E0B",
                category: "Advanced",
                duration: "40 min",
                lessons: 3,
                videos: [
                    { 
                        id: '8J8z8ekeYVQ', 
                        title: 'Mobile Security - Essential Protection Tips', 
                        description: 'Critical security practices for protecting smartphones and tablets',
                        duration: '6:09', 
                        provider: 'Certo Software',
                        embedAllowed: true
                    },
                    { 
                        id: 'NSOJU5nV4v4', 
                        title: 'Understanding App Permissions & Security', 
                        description: 'How to manage app permissions for optimal security and privacy',
                        duration: '2:10', 
                        provider: 'ITCubed',
                        embedAllowed: true
                    },
                    { 
                        id: 'm_SN1CB3Kts', 
                        title: 'Smartphone Security Complete Guide', 
                        description: 'Comprehensive guide to securing mobile devices against modern threats',
                        duration: '13:16', 
                        provider: 'The Hated One',
                        embedAllowed: true
                    }
                ],
                lessonsContent: [
                    {
                        title: "Mobile Security Fundamentals",
                        content: `
                            <h3>Understanding Mobile Threat Landscape</h3>
                            <p>Mobile devices face unique security challenges due to their portability, constant connectivity, and extensive personal data storage.</p>
                            
                            <h4>Common Mobile Threats:</h4>
                            <ul>
                                <li><strong>Malicious Apps:</strong> Apps designed to steal data or damage devices</li>
                                <li><strong>Network Spoofing:</strong> Fake Wi-Fi networks that intercept data</li>
                                <li><strong>Phishing Attacks:</strong> SMS and messaging-based social engineering</li>
                                <li><strong>Device Theft/Loss:</strong> Physical access to unprotected devices</li>
                            </ul>

                            <h4>Mobile Security Statistics:</h4>
                            <div class="stat-box">
                                <p>• 98% of mobile malware targets Android devices</p>
                                <p>• 1 in 36 mobile devices have high-risk apps installed</p>
                                <p>• Mobile banking trojans increased by 80% in 2023</p>
                                <p>• 60% of digital fraud now originates from mobile devices</p>
                            </div>
                        `
                    },
                    {
                        title: "App Security & Permissions Management",
                        content: `
                            <h3>Managing App Permissions Effectively</h3>
                            <p>Understanding and controlling app permissions is crucial for protecting your privacy and security on mobile devices.</p>
                            
                            <h4>Critical App Permissions to Monitor:</h4>
                            <ul>
                                <li><strong>Location Services:</strong> Only allow when app functionality requires it</li>
                                <li><strong>Camera & Microphone:</strong> Grant access only to trusted apps</li>
                                <li><strong>Contacts & Messages:</strong> Be extremely selective with these permissions</li>
                                <li><strong>Storage Access:</strong> Control which apps can read/write to device storage</li>
                            </ul>

                            <h4>App Security Best Practices:</h4>
                            <div class="app-security-grid">
                                <div class="practice-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Download apps only from official stores</span>
                                </div>
                                <div class="practice-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Read app reviews and check developer credibility</span>
                                </div>
                                <div class="practice-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Regularly review and update app permissions</span>
                                </div>
                            </div>
                        `
                    },
                    {
                        title: "Advanced Mobile Protection Strategies",
                        content: `
                            <h3>Enterprise Mobile Device Management</h3>
                            <p>For organizations, managing mobile security requires comprehensive strategies and tools.</p>
                            
                            <h4>Mobile Device Management (MDM) Features:</h4>
                            <ul>
                                <li><strong>Remote Wipe:</strong> Erase device data if lost or stolen</li>
                                <li><strong>App Whitelisting/Blacklisting:</strong> Control which apps can be installed</li>
                                <li><strong>Policy Enforcement:</strong> Require passwords, encryption, and other security measures</li>
                                <li><strong>Containerization:</strong> Separate work and personal data on devices</li>
                            </ul>

                            <h4>Personal Mobile Security Checklist:</h4>
                            <div class="checklist-grid">
                                <div class="checklist-item">
                                    <input type="checkbox" checked disabled>
                                    <span>Enable device encryption</span>
                                </div>
                                <div class="checklist-item">
                                    <input type="checkbox" checked disabled>
                                    <span>Use strong authentication (biometrics + PIN)</span>
                                </div>
                                <div class="checklist-item">
                                    <input type="checkbox" checked disabled>
                                    <span>Keep operating system and apps updated</span>
                                </div>
                                <div class="checklist-item">
                                    <input type="checkbox" checked disabled>
                                    <span>Use VPN on public Wi-Fi networks</span>
                                </div>
                                <div class="checklist-item">
                                    <input type="checkbox" checked disabled>
                                    <span>Enable remote find and wipe capabilities</span>
                                </div>
                            </div>
                        `
                    }
                ],
                quiz: {
                    title: "Mobile Security Quiz",
                    questions: [
                        {
                            id: 1,
                            question: "Why should you be cautious about granting location permissions to mobile apps?",
                            options: [
                                "It drains battery life significantly",
                                "It can reveal your physical movements and patterns",
                                "It slows down app performance",
                                "It uses excessive mobile data"
                            ],
                            correctAnswer: 1,
                            explanation: "Location permissions can track your physical movements, daily routines, and sensitive locations like home and workplace, creating privacy and security risks."
                        },
                        {
                            id: 2,
                            question: "What is the primary security risk of using public Wi-Fi networks on mobile devices?",
                            options: [
                                "Automatic connection to malicious networks",
                                "Man-in-the-middle attacks and data interception",
                                "Permanent damage to device hardware",
                                "Automatic installation of malicious apps"
                            ],
                            correctAnswer: 1,
                            explanation: "Public Wi-Fi networks are often unsecured, allowing attackers to intercept unencrypted data transmissions and potentially steal sensitive information."
                        },
                        {
                            id: 3,
                            question: "What should you do before installing a new app on your mobile device?",
                            options: [
                                "Check if friends have installed it",
                                "Read reviews and check app permissions",
                                "Test it on a different device first",
                                "Clear storage space for the new app"
                            ],
                            correctAnswer: 1,
                            explanation: "Always review app permissions and read user reviews to understand what data the app accesses and whether it's trustworthy before installation."
                        },
                        {
                            id: 4,
                            question: "What is 'containerization' in mobile security?",
                            options: [
                                "Storing apps in separate folders for organization",
                                "Isolating work data from personal data on devices",
                                "Compressing app data to save storage space",
                                "Grouping similar apps together for easy access"
                            ],
                            correctAnswer: 1,
                            explanation: "Containerization creates secure, isolated environments for work data, allowing organizations to protect corporate information while respecting personal privacy."
                        },
                        {
                            id: 5,
                            question: "Why is it important to keep your mobile operating system updated?",
                            options: [
                                "To get new features and better performance",
                                "To receive critical security patches for vulnerabilities",
                                "To maintain app store access and functionality",
                                "To ensure compatibility with all accessories"
                            ],
                            correctAnswer: 1,
                            explanation: "OS updates often include critical security patches that fix vulnerabilities that attackers could exploit to compromise your device and data."
                        },
                        {
                            id: 6,
                            question: "What is the most secure authentication method for mobile devices?",
                            options: [
                                "4-digit PIN code",
                                "Pattern lock",
                                "Biometrics combined with strong passcode",
                                "Facial recognition alone"
                            ],
                            correctAnswer: 2,
                            explanation: "Multi-factor authentication using biometrics (fingerprint/face) combined with a strong passcode provides the highest security level for mobile devices."
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
        if (!this.currentModule) {
            console.error('❌ No current module selected');
            return;
        }
        
        console.log('🔍 Checking quiz access for module:', this.currentModule.id);
        
        const user = firebase.auth().currentUser;
        if (!user) {
            alert('Please log in to access quizzes.');
            return;
        }
        
        try {
            // Get module progress from Firestore
            const moduleProgress = await window.firestoreService.getModuleProgress(user.uid, this.currentModule.id);
            console.log('📊 Module progress data:', moduleProgress);

            // For fault tolerance, use progress from any available data source
            const videosCompleted = moduleProgress?.videosCompleted || [];
            const totalVideos = this.currentModule.videos?.length || 0;
            const currentProgress = moduleProgress?.progress || 0;

            // Calculate completion percentage from available metrics
            const videoCompletion = (videosCompleted.length / totalVideos) * 100;
            
            console.log('🎯 Access check details:', {
                videosCompleted: videosCompleted.length,
                totalVideos,
                videoCompletion: videoCompletion.toFixed(1) + '%',
                currentProgress: currentProgress.toFixed(1) + '%'
            });

            // Unified access check: Require 50% completion from any metric
            const canAccessQuiz = videoCompletion >= 50 || currentProgress >= 50 || moduleProgress?.videosWatched === true;
            
            console.log('🔓 Quiz access decision:', {
                videoCompletion: videoCompletion >= 50,
                progressBased: currentProgress >= 50,
                watchedFlag: moduleProgress?.videosWatched === true,
                finalDecision: canAccessQuiz
            });
            
            if (canAccessQuiz) {
                console.log('✅ Quiz access granted, starting quiz...');
                this.startQuiz();
            } else {
                console.log('❌ Quiz access denied, showing message');
                this.showQuizAccessDenied();
            }
            
        } catch (error) {
            console.error('❌ Error checking quiz access:', error);
            // Fallback with more lenient offline access
            const fallbackAccess = await this.checkLocalProgress();
            if (fallbackAccess) {
                console.log('⚠️ Using offline fallback access');
                if (confirm('Unable to verify online completion. You can start the quiz now, but your progress may not be saved properly. Continue anyway?')) {
                    this.startQuiz();
                }
            } else {
                this.showQuizAccessDenied();
            }
        }
    }

    async checkLocalProgress() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) return false;
            
            // Check if we have local storage indicating completion
            const localKey = `module_${this.currentModule.id}_completed_${user.uid}`;
            const localCompletion = localStorage.getItem(localKey);
            
            if (localCompletion === 'true') {
                console.log('📱 Found local completion record');
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error checking local progress:', error);
            return false;
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
                    <h3>Quiz Not Yet Available</h3>
                    <p>Complete at least 50% of the module to unlock the quiz:</p>
                    <div class="access-requirements">
                        <div class="requirement">
                            <i class="fas fa-play-circle"></i>
                            <span>Watch the module videos</span>
                        </div>
                        <div class="requirement">
                            <i class="fas fa-book"></i>
                            <span>Review lesson materials</span>
                        </div>
                        <div class="requirement">
                            <i class="fas fa-check-circle"></i>
                            <span>Track your progress automatically</span>
                        </div>
                    </div>
                    <div class="access-tip">
                        <i class="fas fa-lightbulb"></i>
                        <p>Tip: You can track your progress by watching videos and completing lessons. Your progress saves automatically.</p>
                    </div>
                    <button class="btn-primary" onclick="window.moduleContentManager.switchTab('videos', document.querySelector('[data-tab=\\'videos\\']'))">
                        <i class="fas fa-play-circle"></i>
                        Start Learning
                    </button>
                </div>
            </div>
        `;
        
        // Switch to videos tab to help user get started
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