        class TypeWriter {
            constructor(element, text, options = {}) {
                this.element = element;
                this.text = text;
                this.loopDelay = options.loopDelay || 2000;
                this.typingSpeed = options.typingSpeed || 100;
                this.erasingSpeed = options.erasingSpeed || 50;
                this.currentText = 'P';
                this.isDeleting = false;
                this.element.textContent = 'P'; // Start with P
                this.loop();
            }

            type() {
                const fullText = this.text;
                
                if (this.isDeleting) {
                    // Only delete until 'P' remains
                    if (this.currentText.length > 1) {
                        this.currentText = this.currentText.substring(0, this.currentText.length - 1);
                    } else {
                        this.isDeleting = false;
                    }
                } else {
                    // Add character if we haven't completed the word
                    if (this.currentText.length < fullText.length) {
                        this.currentText = fullText.substring(0, this.currentText.length + 1);
                    }
                }

                // Update element text
                this.element.textContent = this.currentText;

                // Typing speed
                let typeSpeed = this.isDeleting ? this.erasingSpeed : this.typingSpeed;

                // If word is complete
                if (!this.isDeleting && this.currentText === fullText) {
                    // Make pause at end
                    typeSpeed = this.loopDelay;
                    // Set delete to true
                    this.isDeleting = true;
                } else if (this.isDeleting && this.currentText === 'P') {
                    // When we reach 'P', pause briefly before starting to type again
                    typeSpeed = 500;
                }

                setTimeout(() => this.type(), typeSpeed);
            }

            loop() {
                this.type();
            }
        }

        // Initialize TypeWriter when the page loads
        window.addEventListener('load', function() {
            const typewriter = document.getElementById('typewriter');
            new TypeWriter(typewriter, 'Pratik Mane', {
                typingSpeed: 150,
                erasingSpeed: 100,
                loopDelay: 2000
            });

            // Add smooth scrolling for navigation buttons
            const navButtons = document.querySelectorAll('a[href^="#"]');
            navButtons.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        // Use Lenis for smoother scrolling
                        lenis.scrollTo(targetSection, {
                            offset: 0,
                            duration: 1.2,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                        });
                    }
                });
            });

            // Initialize GSAP ScrollTrigger
            gsap.registerPlugin(ScrollTrigger);

            // About section animations
            const aboutSection = gsap.timeline({
                scrollTrigger: {
                    trigger: "#about",
                    start: "top 80%",
                    end: "top 20%",
                    toggleActions: "play none none none"
                }
            });

            aboutSection
                .from(".section-title", {
                    y: 50,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.out"
                })
                .from(".title-underline", {
                    width: 0,
                    duration: 0.5,
                    ease: "power3.inOut"
                })
                .from(".about-img", {
                    x: -50,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power3.out"
                })
                .from(".img-overlay", {
                    x: "100%",
                    duration: 0.3,
                    ease: "power3.inOut"
                })
                .from(".about-text h3", {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out"
                })
                .from(".text-content p", {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.2,
                    ease: "power3.out"
                });
                
            // Skills marquee animation with GSAP
            function setupMarquee() {
                // Kill any existing animations
                gsap.killTweensOf(".marquee-content");
                
                const marqueeSpeed = 20; // Seconds to complete one loop (lower = faster)
                
                gsap.to(".marquee-content", {
                    x: "-100%",
                    duration: marqueeSpeed,
                    ease: "none",
                    repeat: -1,
                    repeatRefresh: true
                });
                
                // Add hover effect to pause animation
                const skillItems = document.querySelectorAll('.skill-item');
                
                skillItems.forEach(item => {
                    item.addEventListener('mouseenter', function() {
                        gsap.to(".marquee-content", {
                            timeScale: 0.2, // Slow down animation
                            duration: 0.3
                        });
                    });
                    
                    item.addEventListener('mouseleave', function() {
                        gsap.to(".marquee-content", {
                            timeScale: 1, // Resume normal speed
                            duration: 0.3
                        });
                    });
                });
            }
            
            function setupProjects() {
                const tabs = document.querySelectorAll('.showcase-tab');
                const projectCards = document.querySelectorAll('.project-card');
                
                tabs.forEach(tab => {
                    tab.addEventListener('click', function() {
                        tabs.forEach(t => t.classList.remove('active'));
                        
                        this.classList.add('active');
                        
                        const category = this.getAttribute('data-tab');
                        
                        // Create GSAP timeline for smooth transitions
                        const tl = gsap.timeline();
                        
                        // First fade out all cards
                        tl.to(projectCards, {
                            opacity: 0,
                            y: 20,
                            duration: 0.3,
                            stagger: 0.05,
                            ease: "power2.out",
                            onComplete: () => {
                                // Then filter and show only relevant cards
                                projectCards.forEach(card => {
                                    const cardCategory = card.getAttribute('data-category');
                                    if (category === 'all' || category === cardCategory) {
                                        card.style.display = 'flex';
                                    } else {
                                        card.style.display = 'none';
                                    }
                                });
                                
                                // Fade cards back in
                                gsap.to(projectCards, {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.5,
                                    stagger: 0.1,
                                    ease: "power2.out"
                                });
                            }
                        });
                    });
                });
                
                // Gallery modal functionality
                const galleryViewBtns = document.querySelectorAll('.gallery-view-btn');
                const galleryModal = document.querySelector('.gallery-modal');
                // const galleryClose = document.querySelector('.gallery-close');
                const galleryCancel = document.querySelector('.gallery-cancel');
                const galleryFullImg = document.querySelector('.gallery-full-img');
                const galleryThumbs = document.querySelectorAll('.gallery-thumb');
                const prevBtn = document.querySelector('.gallery-nav.prev');
                const nextBtn = document.querySelector('.gallery-nav.next');
                
                let currentImageIndex = 0;
                
                // Open gallery modal
                galleryViewBtns.forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        galleryModal.classList.add('open');
                        currentImageIndex = 0;
                        updateGalleryImage();
                        
                        // Animate modal opening
                        gsap.fromTo(galleryModal, 
                            { opacity: 0 }, 
                            { opacity: 1, duration: 0.3 }
                        );
                    });
                });
                
                
                // Add functionality for cancel button
                galleryCancel.addEventListener('click', function() {
                    console.log('Cancel button clicked');
                    gsap.to(galleryModal, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            galleryModal.classList.remove('open');
                        }
                    });
                });
                
                // Navigation in gallery
                prevBtn.addEventListener('click', function() {
                    currentImageIndex--;
                    if (currentImageIndex < 0) {
                        currentImageIndex = galleryThumbs.length - 1;
                    }
                    updateGalleryImage();
                });
                
                nextBtn.addEventListener('click', function() {
                    currentImageIndex++;
                    if (currentImageIndex >= galleryThumbs.length) {
                        currentImageIndex = 0;
                    }
                    updateGalleryImage();
                });
                
                // Thumbnail click
                galleryThumbs.forEach((thumb, index) => {
                    thumb.addEventListener('click', function() {
                        currentImageIndex = index;
                        updateGalleryImage();
                    });
                });
                
                // Update gallery image
                function updateGalleryImage() {
                    const newSrc = galleryThumbs[currentImageIndex].getAttribute('data-src');
                    
                    // Remove active class from all thumbnails
                    galleryThumbs.forEach(thumb => thumb.classList.remove('active'));
                    
                    // Add active class to current thumbnail
                    galleryThumbs[currentImageIndex].classList.add('active');
                    
                    // Animate image change
                    gsap.to(galleryFullImg, {
                        opacity: 0,
                        duration: 0.2,
                        onComplete: () => {
                            galleryFullImg.src = newSrc;
                            gsap.to(galleryFullImg, {
                                opacity: 1,
                                duration: 0.2
                            });
                        }
                    });
                }
                
                // Setup project animations
                gsap.from(".project-card", {
                    scrollTrigger: {
                        trigger: ".projects-grid",
                        start: "top 80%"
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out"
                });
            }
            
            setupMarquee();
            setupProjects();
            
            // Contact section animations
            gsap.set("#contact .section-title", { opacity: 0, y: 50 });
            gsap.set("#contact .title-underline", { opacity: 0, width: 0 });
            gsap.set(".contact-info", { opacity: 0, x: -50 });
            gsap.set(".contact-item", { opacity: 0, y: 30 });
            gsap.set(".social-links a", { opacity: 0, y: 20 });
            gsap.set(".contact-form", { opacity: 0, x: 50 });
            gsap.set(".form-group", { opacity: 0, y: 20 });
            gsap.set(".submit-btn", { opacity: 0, y: 20 });
            
            ScrollTrigger.create({
                trigger: "#contact",
                start: "top 80%",
                onEnter: () => {
                    gsap.to("#contact .section-title", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
                    gsap.to("#contact .title-underline", { opacity: 1, width: "60px", duration: 0.5, ease: "power3.inOut", delay: 0.1 });
                    gsap.to(".contact-info", { opacity: 1, x: 0, duration: 0.5, ease: "power3.out", delay: 0.2 });
                    
                    const contactItems = gsap.utils.toArray(".contact-item");
                    contactItems.forEach((item, i) => {
                        gsap.to(item, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.3 + (i * 0.1) });
                    });
                    
                    const socialLinks = gsap.utils.toArray(".social-links a");
                    socialLinks.forEach((link, i) => {
                        gsap.to(link, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", delay: 0.6 + (i * 0.1) });
                    });
                    
                    gsap.to(".contact-form", { opacity: 1, x: 0, duration: 0.5, ease: "power3.out", delay: 0.7 });
                    
                    const formGroups = gsap.utils.toArray(".form-group");
                    formGroups.forEach((group, i) => {
                        gsap.to(group, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.8 + (i * 0.1) });
                    });
                    
                    gsap.to(".submit-btn", { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", delay: 1.2 });
                }
            });
        });

        // Email sending function
        function sendEmail(event) {
            event.preventDefault();
            
            const formStatus = document.getElementById('form-status');
            const submitBtn = document.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            
            // Change button text and disable it
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Prepare template parameters for EmailJS
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_email: 'p7028410236@gmail.com'
            };
            
            // Send email using EmailJS
            // Replace 'your_service_id' and 'your_template_id' with your actual EmailJS service and template IDs
            emailjs.send('your_service_id', 'your_template_id', templateParams)
                .then(function(response) {
                    // Success handling
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.style.display = 'block';
                    
                    // Reset form
                    document.getElementById('contact-form').reset();
                    
                    // Reset button state
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                }, function(error) {
                    // Error handling
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Failed to send message. Please try again.';
                    formStatus.style.display = 'block';
                    
                    // Reset button state
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
            
            return false;
        }
