// assets/js/toc.js
document.addEventListener('DOMContentLoaded', function () {
    const tocContainer = document.getElementById('tableOfContentsContainer');
    const articleContent = document.getElementById('mainArticleContent'); // Target the specific content area

    if (!tocContainer || !articleContent) {
        // console.warn('Table of Contents container or article content not found.');
        return;
    }

    // Select headings you want in the ToC (e.g., h2, h3)
    // Query within the specific articleContent to avoid picking up sidebar titles
    const headings = articleContent.querySelectorAll('h2, h3');

    if (headings.length === 0) {
        // tocContainer.innerHTML = '<p class="toc-empty-message">No sections found for ToC.</p>';
        return; // No need to display ToC if no headings
    }

    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    headings.forEach((heading, index) => {
        // Ensure heading has an ID, generate one if not (though manual IDs are better)
        if (!heading.id) {
            heading.id = `toc-heading-${index}`;
        }

        const listItem = document.createElement('li');
        listItem.className = `toc-item toc-level-${heading.tagName.toLowerCase()}`; // e.g., toc-level-h2

        const link = document.createElement('a');
        link.className = 'toc-link';
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.trim();

        // Smooth scroll behavior
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.getElementById(this.getAttribute('href').substring(1));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Align to top, can also use 'center'
                });
                // Optional: Update URL hash without page jump after smooth scroll
                // history.pushState(null, null, this.getAttribute('href'));
            }
        });

        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });

    tocContainer.appendChild(tocList);

    // Optional: Active link highlighting on scroll (more advanced)
    // This is a basic version. For robust active highlighting, Intersection Observer is better.
    const tocLinks = tocContainer.querySelectorAll('.toc-link');
    let activeLink = null;

    function highlightActiveLink() {
        let closestHeadingInfo = { id: null, top: Infinity };

        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            // Consider a heading active if its top is at or above a certain threshold (e.g., 1/4 of viewport height)
            // and it's the closest such heading to that threshold.
            if (rect.top >= 0 && rect.top < (window.innerHeight / 2)) { // Adjust threshold as needed
                if (rect.top < closestHeadingInfo.top) {
                    closestHeadingInfo = { id: heading.id, top: rect.top };
                }
            }
        });

        // If no heading is "active" by the above criteria (e.g. scrolled past all),
        // find the one whose bottom is closest to the top of the viewport (last visible one)
        if (!closestHeadingInfo.id && headings.length > 0) {
            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings[i];
                const rect = heading.getBoundingClientRect();
                if (rect.top < (window.innerHeight / 4)) { // If top of heading is above threshold
                    closestHeadingInfo.id = heading.id;
                    break;
                }
            }
        }


        if (activeLink) {
            activeLink.classList.remove('active');
        }

        if (closestHeadingInfo.id) {
            const newActiveLink = tocContainer.querySelector(`.toc-link[href="#${closestHeadingInfo.id}"]`);
            if (newActiveLink) {
                newActiveLink.classList.add('active');
                activeLink = newActiveLink;
            }
        } else if (tocLinks.length > 0 && !activeLink) {
            // Default to first link if nothing else is active initially
            // tocLinks[0].classList.add('active');
            // activeLink = tocLinks[0];
        }
    }

    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink(); // Initial call
});