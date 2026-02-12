// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully');
    
    // Mobile menu toggle functionality
    const mobileToggle = document.getElementById('mobileToggle');
    const overlay = document.getElementById('overlay');
    const navDrawer = document.querySelector('.nav-drawer');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            if (navDrawer) {
                navDrawer.classList.toggle('active');
            }
            if (overlay) {
                overlay.classList.toggle('active');
            }
            this.innerHTML = (navDrawer && navDrawer.classList.contains('active')) ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        if (overlay) {
            overlay.addEventListener('click', function() {
                if (navDrawer) {
                    navDrawer.classList.remove('active');
                }
                this.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        }
        
        // Close drawer when clicking on a link (for mobile)
        const navLinks = document.querySelectorAll('.nav-drawer .tab');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 992) {
                    if (navDrawer) {
                        navDrawer.classList.remove('active');
                    }
                    if (overlay) {
                        overlay.classList.remove('active');
                    }
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }
    
    // Back to top button functionality
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Photography filter functionality
    const photoFilters = document.querySelectorAll('.photo-filter');
    const photoItems = document.querySelectorAll('.photo-item');
    
    if (photoFilters.length > 0 && photoItems.length > 0) {
        photoFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active filter
                photoFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                // Filter photos with smooth animation
                photoItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        // Show item
                        item.style.display = 'block';
                        // Trigger reflow for animation
                        void item.offsetWidth;
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    } else {
                        // Hide item with animation
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        // Hide after animation completes
                        setTimeout(() => {
                            if (item.style.opacity === '0') {
                                item.style.display = 'none';
                            }
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Interactive contact links notification
    const contactLinks = document.querySelectorAll('.contact-list a');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                const linkText = this.textContent;
                showNotification(`This link would normally take you to: ${linkText}`);
            }
        });
    });
    
    // Publication links interaction
    const pubLinks = document.querySelectorAll('.pub-links a');
    pubLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                const linkText = this.textContent;
                const icon = this.querySelector('i')?.className || '';
                
                if (icon.includes('file-pdf')) {
                    showNotification('This would open a PDF of the publication');
                } else if (icon.includes('video')) {
                    showNotification('This would play the recording or demo');
                } else if (icon.includes('github')) {
                    showNotification('This would take you to the GitHub repository');
                } else if (icon.includes('book-open')) {
                    showNotification('This would open the blog article');
                } else if (icon.includes('external-link-alt')) {
                    showNotification('This would open the demo/project page');
                } else {
                    showNotification(`This link would take you to: ${linkText}`);
                }
            }
        });
    });
    
    // Notification function
    function showNotification(message) {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: var(--border-radius);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 500;
            max-width: 300px;
            animation: slideIn 0.3s ease;
            font-family: 'Inter', sans-serif;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.publication-item, .course-item, .portfolio-item, .highlight-box, .metric-card, .photo-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transition = 'var(--transition)';
        });
    });
    
    // Smooth page load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Current page indicator for navigation
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.tab');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === 'index.html' && linkHref === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Set active nav link on page load
    setActiveNavLink();
    
    // Load footer dynamically if footer-container exists
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Footer not found');
                }
                return response.text();
            })
            .then(data => {
                footerContainer.innerHTML = data;
                console.log('Footer loaded successfully');
                
                // Re-initialize any interactive elements in the footer
                const footerSocialLinks = document.querySelectorAll('.footer-social a');
                footerSocialLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        if (this.getAttribute('href') === '#') {
                            e.preventDefault();
                            showNotification('Social media link would open in a new tab');
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                // Create a simple footer if the file doesn't exist
                footerContainer.innerHTML = `
                    <footer class="site-footer">
                        <div class="footer-bottom">
                            <p>© 2025 Dr. Paraj | IIT Guwahati. All rights reserved.</p>
                        </div>
                    </footer>
                `;
            });
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal page anchors
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add animation to metric cards on scroll
    function animateMetricCards() {
        const metricCards = document.querySelectorAll('.metric-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }
            });
        }, {
            threshold: 0.1
        });
        
        metricCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }
    
    // Initialize metric card animations
    animateMetricCards();
    
    // Add image loading animation
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading class
        img.classList.add('img-loading');
        
        // When image loads, remove loading class
        img.addEventListener('load', function() {
            this.classList.remove('img-loading');
            this.classList.add('img-loaded');
        });
        
        // If image fails to load, show error state
        img.addEventListener('error', function() {
            this.classList.remove('img-loading');
            this.classList.add('img-error');
            this.alt = 'Image failed to load';
        });
    });
    
    // Add CSS for image loading states
    const imageLoadingStyles = document.createElement('style');
    imageLoadingStyles.textContent = `
        .img-loading {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        .img-loaded {
            animation: fadeIn 0.5s ease;
        }
        
        .img-error {
            background-color: #fee;
            border: 2px dashed #e53e3e;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #e53e3e;
            font-weight: bold;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(imageLoadingStyles);
});

// Add window resize handler for responsive behavior
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const mobileToggle = document.getElementById('mobileToggle');
    
    // If window is resized to desktop size, ensure sidebar is visible
    if (window.innerWidth > 992 && sidebar && overlay && mobileToggle) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Handle page visibility change for better performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page is now hidden');
    } else {
        console.log('Page is now visible');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const mobileToggle = document.getElementById('mobileToggle');
        
        if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
    
    // Home key scrolls to top
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // End key scrolls to bottom
    if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    // Observe images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}