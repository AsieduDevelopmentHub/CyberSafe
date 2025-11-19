class CertificateGenerator {
    constructor() {
        this.certificates = [];
        this.init();
    }

    init() {
        console.log('🎓 Certificate Generator initialized');
        // Load jsPDF if not already loaded
        this.loadJSPDF();
    }

    async loadJSPDF() {
        if (typeof jspdf === 'undefined') {
            console.log('📚 Loading jsPDF library...');
            // Load jsPDF dynamically
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => console.log('✅ jsPDF loaded successfully');
            script.onerror = () => console.warn('⚠️ jsPDF failed to load, PDF download disabled');
            document.head.appendChild(script);
        }
    }

    async generateCertificate(userData, moduleData, quizResults) {
        try {
            console.log('🎯 Generating certificate for:', {
                user: userData.name,
                module: moduleData.title,
                score: quizResults.score
            });

            const certificateData = {
                id: this.generateCertificateId(),
                userId: userData.uid,
                userName: userData.name,
                userEmail: userData.email,
                moduleId: moduleData.id,
                moduleName: moduleData.title,
                score: quizResults.score,
                completionDate: new Date(),
                certificateUrl: null, // Will be set if we implement image storage later
                issuedBy: 'CyberSafe',
                validUntil: null, // Certificates don't expire
                metadata: {
                    quizResults: quizResults,
                    moduleData: moduleData,
                    generatedAt: new Date(),
                    version: '1.0'
                }
            };

            // Store certificate in Firestore
            await this.saveCertificate(certificateData);

            // Add to local certificates array
            this.certificates.push(certificateData);

            console.log('✅ Certificate generated and saved:', certificateData.id);
            return certificateData;

        } catch (error) {
            console.error('❌ Error generating certificate:', error);
            throw error;
        }
    }

    generateCertificateId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `CERT-${timestamp}-${random}`.toUpperCase();
    }

    async saveCertificate(certificateData) {
        try {
            if (!window.firestoreService) {
                throw new Error('Firestore service not available');
            }

            const certificateRef = window.firestoreService.db
                .collection('certificates')
                .doc(certificateData.id);

            await certificateRef.set({
                ...certificateData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('💾 Certificate saved to Firestore:', certificateData.id);
            return certificateData;

        } catch (error) {
            console.error('❌ Error saving certificate:', error);
            throw error;
        }
    }

    async getUserCertificates(uid) {
        try {
            if (!window.firestoreService) return [];

            const certificatesSnapshot = await window.firestoreService.db
                .collection('certificates')
                .where('userId', '==', uid)
                .orderBy('completionDate', 'desc')
                .get();

            const certificates = certificatesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log('📜 Loaded user certificates:', certificates.length);
            return certificates;

        } catch (error) {
            console.error('❌ Error loading certificates:', error);
            return [];
        }
    }

    async downloadCertificate(certificateData) {
        try {
            console.log('📥 Downloading certificate:', certificateData.id);

            // Create certificate canvas
            const canvas = await this.createCertificateCanvas(certificateData);
            const imageData = canvas.toDataURL('image/png');

            // Create PDF if jsPDF is available
            if (typeof jspdf !== 'undefined') {
                const { jsPDF } = jspdf;
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4'
                });

                // Calculate dimensions to fit A4 landscape
                const imgWidth = 297; // A4 width in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // Center the certificate on the page
                const x = 0;
                const y = (210 - imgHeight) / 2; // Center vertically on A4 height

                pdf.addImage(imageData, 'PNG', x, y, imgWidth, imgHeight);
                pdf.save(`${certificateData.moduleName.replace(/\s+/g, '_')}_Certificate.pdf`);

                console.log('✅ Certificate PDF downloaded');
            } else {
                // Fallback: download as image
                const link = document.createElement('a');
                link.download = `${certificateData.moduleName.replace(/\s+/g, '_')}_Certificate.png`;
                link.href = imageData;
                link.click();
                console.log('✅ Certificate image downloaded (PDF not available)');
            }

        } catch (error) {
            console.error('❌ Error downloading certificate:', error);
            alert('Failed to download certificate. Please try again.');
        }
    }

    async createCertificateCanvas(certificateData) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size for high-quality certificate
            canvas.width = 1200;
            canvas.height = 800;

            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0A1F44');
            gradient.addColorStop(1, '#1E3A8A');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add decorative border
            ctx.strokeStyle = '#00B8D9';
            ctx.lineWidth = 8;
            ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

            // Inner border
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

            // Certificate title
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 48px Inter, Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 150);

            // Subtitle
            ctx.font = 'italic 24px Inter, Arial, sans-serif';
            ctx.fillStyle = '#00B8D9';
            ctx.fillText('CyberSafe Cybersecurity Training Program', canvas.width / 2, 190);

            // Main content
            ctx.font = 'bold 32px Inter, Arial, sans-serif';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('This is to certify that', canvas.width / 2, 280);

            // User name (larger and highlighted)
            ctx.font = 'bold 48px Inter, Arial, sans-serif';
            ctx.fillStyle = '#FFD700';
            ctx.fillText(certificateData.userName, canvas.width / 2, 340);

            // Completion text
            ctx.font = 'bold 28px Inter, Arial, sans-serif';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('has successfully completed the module', canvas.width / 2, 400);

            // Module name
            ctx.font = 'bold 36px Inter, Arial, sans-serif';
            ctx.fillStyle = '#00B8D9';
            ctx.fillText(certificateData.moduleName, canvas.width / 2, 450);

            // Score
            ctx.font = 'bold 24px Inter, Arial, sans-serif';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`with a score of ${certificateData.score}%`, canvas.width / 2, 490);

            // Date
            const completionDate = new Date(certificateData.completionDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            ctx.font = 'italic 20px Inter, Arial, sans-serif';
            ctx.fillStyle = '#CCCCCC';
            ctx.fillText(`Completed on ${completionDate}`, canvas.width / 2, 540);

            // Certificate ID
            ctx.font = '14px Inter, Arial, sans-serif';
            ctx.fillStyle = '#888888';
            ctx.fillText(`Certificate ID: ${certificateData.id}`, canvas.width / 2, 580);

            // Issuer
            ctx.font = 'bold 18px Inter, Arial, sans-serif';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('Issued by CyberSafe', canvas.width / 2, 650);

            // Website
            ctx.font = '16px Inter, Arial, sans-serif';
            ctx.fillStyle = '#00B8D9';
            ctx.fillText('cybersafe.auralenx.com', canvas.width / 2, 680);

            // Add some decorative elements
            this.addDecorativeElements(ctx, canvas.width, canvas.height);

            resolve(canvas);
        });
    }

    addDecorativeElements(ctx, width, height) {
        // Add corner decorations
        ctx.strokeStyle = '#00B8D9';
        ctx.lineWidth = 3;

        // Top-left corner
        ctx.beginPath();
        ctx.moveTo(80, 80);
        ctx.lineTo(120, 80);
        ctx.lineTo(120, 120);
        ctx.stroke();

        // Top-right corner
        ctx.beginPath();
        ctx.moveTo(width - 80, 80);
        ctx.lineTo(width - 120, 80);
        ctx.lineTo(width - 120, 120);
        ctx.stroke();

        // Bottom-left corner
        ctx.beginPath();
        ctx.moveTo(80, height - 80);
        ctx.lineTo(120, height - 80);
        ctx.lineTo(120, height - 120);
        ctx.stroke();

        // Bottom-right corner
        ctx.beginPath();
        ctx.moveTo(width - 80, height - 80);
        ctx.lineTo(width - 120, height - 80);
        ctx.lineTo(width - 120, height - 120);
        ctx.stroke();
    }

    // Get certificate by ID
    async getCertificate(certificateId) {
        try {
            if (!window.firestoreService) return null;

            const certificateDoc = await window.firestoreService.db
                .collection('certificates')
                .doc(certificateId)
                .get();

            if (certificateDoc.exists) {
                return {
                    id: certificateDoc.id,
                    ...certificateDoc.data()
                };
            }

            return null;
        } catch (error) {
            console.error('❌ Error getting certificate:', error);
            return null;
        }
    }

    // Validate certificate (for future verification features)
    async validateCertificate(certificateId) {
        try {
            const certificate = await this.getCertificate(certificateId);
            if (!certificate) return false;

            // Basic validation - check if certificate exists and has required fields
            const requiredFields = ['userId', 'moduleId', 'score', 'completionDate'];
            return requiredFields.every(field => certificate.hasOwnProperty(field));
        } catch (error) {
            console.error('❌ Error validating certificate:', error);
            return false;
        }
    }
}

// Initialize Certificate Generator
window.certificateGenerator = new CertificateGenerator();
