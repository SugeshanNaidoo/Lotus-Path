// Lotus Path - Main JavaScript File

// ===========================
// Mobile Menu Toggle
// ===========================
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('active');
}

// ===========================
// Gallery Lightbox Functionality
// ===========================
const galleryImages = [
    'imgs/gallery/1.png',
    'imgs/gallery/2.png',
    'imgs/gallery/3.png',
    'imgs/gallery/4.png',
    'imgs/gallery/5.png',
    'imgs/gallery/6.png',
    'imgs/gallery/7.png',
    'imgs/gallery/8.png',
    'imgs/gallery/9.png',
    'imgs/gallery/10.png',
    'imgs/gallery/11.png',
    'imgs/gallery/12.png',
    'imgs/gallery/13.png',
    'imgs/gallery/14.png',
    'imgs/gallery/15.png',
    'imgs/gallery/16.png'
];

let currentImageIndex = 0;

function openLightbox(index) {
    currentImageIndex = index;
    const lightboxImg = document.getElementById('lightbox-img');
    const lightbox = document.getElementById('lightbox');
    
    if (lightboxImg && lightbox) {
        lightboxImg.src = galleryImages[index];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg) {
        lightboxImg.src = galleryImages[currentImageIndex];
    }
}

// ===========================
// Contact Form Handling
// ===========================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value || 'Not provided',
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Get submit button
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="icon" viewBox="0 0 24 24" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem; width: 18px; height: 18px; animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75"></path>
                </svg>
                Sending...
            `;
            
            try {
                // Send to Vercel serverless function
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Success
                    showNotification('Thank you for your message! We will get back to you shortly.', 'success');
                    contactForm.reset();
                } else {
                    // Error from server
                    showNotification(result.message || 'There was an error sending your message. Please try again.', 'error');
                }
            } catch (error) {
                // Network or other error
                console.error('Form submission error:', error);
                showNotification('There was an error sending your message. Please try again or contact us directly.', 'error');
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }
}

// ===========================
// Notification System
// ===========================
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <svg class="icon" viewBox="0 0 24 24" style="width: 24px; height: 24px; margin-right: 0.5rem;">
                ${type === 'success' 
                    ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                    : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
                }
            </svg>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===========================
// Event Listeners - Initialize on DOM Load
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize contact form
    initContactForm();
    
    // Lightbox event listeners (only if lightbox exists)
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        // Close lightbox on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});