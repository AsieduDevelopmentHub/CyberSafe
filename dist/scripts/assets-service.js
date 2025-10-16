class AssetsService {
    constructor() {
        this.images = {
            // Professional cybersecurity images (using Unsplash as source)
            moduleCovers: {
                phishing: 'https://images.unsplash.com/photo-1563013546-68eab06d57d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                passwords: 'https://images.unsplash.com/photo-1596524430615-b46475bafff9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                social: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                network: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                mobile: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            caseStudies: {
                equifax: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                wannacry: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                target: 'https://images.unsplash.com/photo-1563013546-68eab06d57d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
           
        };

        this.loadedImages = new Set();
    }

    getModuleCover(moduleId) {
        return this.images.moduleCovers[moduleId] || this.images.moduleCovers.phishing;
    }

    getCaseStudyImage(caseId) {
        return this.images.caseStudies[caseId] || this.images.caseStudies.equifax;
    }

    

    preloadImages() {
        console.log('Preloading images...');
        
        // Preload module covers
        Object.values(this.images.moduleCovers).forEach(src => {
            this.preloadImage(src);
        });
        
        // Preload case study images
        Object.values(this.images.caseStudies).forEach(src => {
            this.preloadImage(src);
        });
        
        // Preload background images
        Object.values(this.images.backgrounds).forEach(src => {
            this.preloadImage(src);
        });

        console.log('Image preloading completed');
    }

    preloadImage(src) {
        if (this.loadedImages.has(src)) {
            return; // Already loaded
        }

        const img = new Image();
        img.src = src;
        img.onload = () => {
            this.loadedImages.add(src);
            console.log('Image loaded:', src);
        };
        img.onerror = () => {
            console.warn('Failed to load image:', src);
        };
    }

    // Method to set background image for an element
    setBackgroundImage(element, imageType) {
        if (!element) return;
        
        const imageUrl = this.getBackgroundImage(imageType);
        element.style.backgroundImage = `url('${imageUrl}')`;
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
        element.style.backgroundRepeat = 'no-repeat';
    }

    // Method to set module cover for a card
    setModuleCover(cardElement, moduleId) {
        if (!cardElement) return;
        
        const imageUrl = this.getModuleCover(moduleId);
        cardElement.style.backgroundImage = `url('${imageUrl}')`;
        cardElement.style.backgroundSize = 'cover';
        cardElement.style.backgroundPosition = 'center';
        cardElement.style.backgroundRepeat = 'no-repeat';
        
        // Add overlay for better text readability
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.background = 'rgba(10, 31, 68, 0.7)';
        overlay.style.borderRadius = 'inherit';
        
        cardElement.style.position = 'relative';
        cardElement.appendChild(overlay);
        
        // Ensure content stays above overlay
        const content = cardElement.querySelector('.module-info') || cardElement.querySelector('.case-study-header');
        if (content) {
            content.style.position = 'relative';
            content.style.zIndex = '1';
        }
    }

    // Check if image is loaded
    isImageLoaded(src) {
        return this.loadedImages.has(src);
    }

    // Get loading progress
    getLoadingProgress() {
        const totalImages = Object.values(this.images.moduleCovers).length +
                           Object.values(this.images.caseStudies).length +
                           Object.values(this.images.backgrounds).length;
        
        const loadedCount = this.loadedImages.size;
        return totalImages > 0 ? (loadedCount / totalImages) * 100 : 100;
    }

    // Fallback images in case of network issues
    getFallbackImages() {
        return {
            moduleCovers: {
                phishing: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzBBMUY0NCIvPjx0ZXh0IHg9IjI1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZpc2hpbmcgQXdhcmVuZXNzPC90ZXh0Pjwvc3ZnPg==',
                passwords: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0ZGN0YwMCIvPjx0ZXh0IHg9IjI1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBhc3N3b3JkIFNlY3VyaXR5PC90ZXh0Pjwvc3ZnPg=='
            },
            // Add more fallbacks as needed
        };
    }

    // Initialize the service
    init() {
        this.preloadImages();
        
        
        return this;
    }
}

// Initialize Assets Service
window.assetsService = new AssetsService().init();