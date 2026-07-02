document.addEventListener('DOMContentLoaded', () => {

    // 1. SCROLL ANIMATION (Fade-In Effect)
    const fadeElements = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => { appearOnScroll.observe(el); });

    // 2. ANIMATED COUNTERS (Statistics Section)
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const counterObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;

                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => { counterObserver.observe(counter); });

    // 3. DYNAMIC PHOTO GALLERY GENERATOR & LIGHTBOX ZOOM LOGIC
    const isGalleryPage = document.getElementById('lightbox');
    if (isGalleryPage) {
        const galleriesConfig = [
            { containerId: 'gallery-dxg23', folder: 'DXG_2023', prefix: 'DXG23_', count: 55 },
            { containerId: 'gallery-vda18', folder: 'VDA_2018', prefix: 'VDA18_', count: 48 },
            { containerId: 'gallery-vda19', folder: 'VDA_2019', prefix: 'VDA19_', count: 44 },
            { containerId: 'gallery-vda22', folder: 'VDA_2022', prefix: 'VDA22_', count: 33 },
            { containerId: 'gallery-vdt18', folder: 'VDT_2018', prefix: 'VDT18_', count: 32 },
            { containerId: 'gallery-vdt22', folder: 'VDT_2022', prefix: 'VDT22_', count: 40 }
        ];

        galleriesConfig.forEach(config => {
            const container = document.getElementById(config.containerId);
            if (container) {
                for (let i = 1; i <= config.count; i++) {
                    const img = document.createElement('img');
                    img.src = `./assets/images/${config.folder}/${config.prefix}${i}.jpg`;
                    img.className = 'gallery-img';
                    img.alt = `${config.folder} Image ${i}`;
                    img.loading = 'lazy';
                    container.appendChild(img);
                }
            }
        });

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close-lightbox');
        const prevBtn = document.querySelector('.prev-lightbox');
        const nextBtn = document.querySelector('.next-lightbox');
        const downloadBtn = document.getElementById('download-img');

        let currentGalleryImages = [];
        let currentIndex = 0;

        function updateLightboxImage() {
            if (currentGalleryImages.length > 0) {
                const src = currentGalleryImages[currentIndex].src;
                lightboxImg.src = src;
                if (downloadBtn) {
                    downloadBtn.href = src;
                    downloadBtn.download = src.substring(src.lastIndexOf('/') + 1);
                }
            }
        }

        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-img')) {
                const container = e.target.closest('.gallery-grid');
                if (container) {
                    currentGalleryImages = Array.from(container.querySelectorAll('.gallery-img'));
                    currentIndex = currentGalleryImages.indexOf(e.target);
                } else {
                    currentGalleryImages = [e.target];
                    currentIndex = 0;
                }

                updateLightboxImage();
                lightbox.style.display = 'flex';
            }
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
                updateLightboxImage();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % currentGalleryImages.length;
                updateLightboxImage();
            });
        }

        if (closeBtn) closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) lightbox.style.display = 'none';
            });
        }

        document.addEventListener('keydown', (e) => {
            if (lightbox && lightbox.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    currentIndex = (currentIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
                    updateLightboxImage();
                } else if (e.key === 'ArrowRight') {
                    currentIndex = (currentIndex + 1) % currentGalleryImages.length;
                    updateLightboxImage();
                } else if (e.key === 'Escape') {
                    lightbox.style.display = 'none';
                }
            }
        });
    }

    // 4. GDPR COOKIE BANNER LOGIC
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner) {
        if (!localStorage.getItem('softconf_cookie_consent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1500);
        }

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('softconf_cookie_consent', 'accepted');
                cookieBanner.classList.remove('show');
            });
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                localStorage.setItem('softconf_cookie_consent', 'declined');
                cookieBanner.classList.remove('show');
            });
        }
    }

});