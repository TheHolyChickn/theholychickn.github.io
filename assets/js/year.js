document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Smooth scroll for CTA button
    const ctaButton = document.querySelector('.cta-button[href^="#"]');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Aligns the top of the target element to the top of the viewport
                });
            }
        });
    }

    // Log for fun
    console.log("wtf");
});