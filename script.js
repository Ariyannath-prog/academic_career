  document.addEventListener('DOMContentLoaded', function() {
            // Tab switching functionality
            const tabs = document.querySelectorAll('.tab');
            const sections = document.querySelectorAll('.content-section');
            
            function switchTab(targetId) {
                tabs.forEach(tab => tab.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                
                document.querySelector(`.tab[data-target="${targetId}"]`).classList.add('active');
                document.getElementById(targetId).classList.add('active');
                
                window.location.hash = targetId;
                
                // Scroll to top of section
                document.getElementById(targetId).scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const targetId = this.getAttribute('data-target');
                    switchTab(targetId);
                });
            });
            
            // Check URL hash on page load
            if (window.location.hash) {
                const targetId = window.location.hash.substring(1);
                if (document.getElementById(targetId)) {
                    setTimeout(() => switchTab(targetId), 100);
                }
            }
            
            // Mobile menu toggle
            const mobileToggle = document.getElementById('mobileToggle');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('overlay');
            const mainContent = document.getElementById('mainContent');
            
            if (mobileToggle) {
                mobileToggle.addEventListener('click', function() {
                    sidebar.classList.toggle('active');
                    overlay.classList.toggle('active');
                    this.innerHTML = sidebar.classList.contains('active') ? 
                        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
                });
                
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                });
                
                // Close sidebar when clicking on a link (for mobile)
                const sidebarLinks = sidebar.querySelectorAll('a');
                sidebarLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        if (window.innerWidth <= 992) {
                            sidebar.classList.remove('active');
                            overlay.classList.remove('active');
                            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    });
                });
            }
            
            // Back to top button
            const backToTop = document.getElementById('backToTop');
            
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
            
            // Photography filter functionality
            const photoFilters = document.querySelectorAll('.photo-filter');
            const photoItems = document.querySelectorAll('.photo-item');
            
            photoFilters.forEach(filter => {
                filter.addEventListener('click', function() {
                    const filterValue = this.getAttribute('data-filter');
                    
                    // Update active filter
                    photoFilters.forEach(f => f.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Filter photos
                    photoItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 10);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
            
            // Interactive contact links
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
                        } else {
                            showNotification(`This link would take you to: ${linkText}`);
                        }
                    }
                });
            });
            
            // Notification function
            function showNotification(message) {
                // Create notification element
                const notification = document.createElement('div');
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
                
                // Add keyframe animations for notification
                if (!document.querySelector('#notification-styles')) {
                    const style = document.createElement('style');
                    style.id = 'notification-styles';
                    style.textContent = `
                        @keyframes slideIn {
                            from { transform: translateX(100%); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                        @keyframes slideOut {
                            from { transform: translateX(0); opacity: 1; }
                            to { transform: translateX(100%); opacity: 0; }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
            
            // Add hover effects to interactive elements
            const interactiveElements = document.querySelectorAll('.publication-item, .course-item, .portfolio-item, .highlight-box, .metric-card, .photo-item');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', function() {
                    this.style.transition = 'var(--transition)';
                });
            });
            
            // Initialize with a smooth entrance animation
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
            
            // Add active state to current section based on scroll
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.3
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        const correspondingTab = document.querySelector(`.tab[data-target="${id}"]`);
                        if (correspondingTab && !correspondingTab.classList.contains('active')) {
                            tabs.forEach(tab => tab.classList.remove('active'));
                            correspondingTab.classList.add('active');
                        }
                    }
                });
            }, observerOptions);
            
            // Observe all content sections
            sections.forEach(section => {
                observer.observe(section);
            });
        });