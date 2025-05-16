// assets/js/blog.js
document.addEventListener('DOMContentLoaded', function () {
    const blogPostListContainer = document.getElementById('blogPostListContainer');
    // Check if the container exists before trying to querySelector on it
    if (!blogPostListContainer) {
        console.error('Error: blogPostListContainer element not found.');
        return;
    }
    const loadingMessage = blogPostListContainer.querySelector('.loading-message');

    // Adjust the path to your blog-posts.json file as needed
    // This path is relative to the HTML file loading this script (blog/blog.html)
    const jsonPath = 'posts.json'; // This should correctly point to /blog/posts.json

    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} while fetching ${jsonPath}`);
            }
            return response.json();
        })
        .then(posts => {
            if (loadingMessage) {
                loadingMessage.remove(); // Remove "Loading entries..." message
            }

            if (!posts || posts.length === 0) {
                const noPostsMessage = document.createElement('p');
                noPostsMessage.textContent = 'No blog posts yet. Stay tuned!';
                noPostsMessage.className = 'no-posts-message'; // For potential styling
                blogPostListContainer.appendChild(noPostsMessage);
                return;
            }

            // Sort posts by date, newest first
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            posts.forEach(post => {
                const postEntry = document.createElement('article');
                postEntry.className = 'blog-post-entry';

                const meta = document.createElement('p');
                meta.className = 'post-meta';

                // --- DATE FIX ---
                // Create a Date object. The input "YYYY-MM-DD" is treated as UTC.
                const postDate = new Date(post.date);

                // Format the date using toLocaleDateString, but specify UTC as the timezone
                // for formatting. This ensures the day, month, and year are from the UTC date,
                // effectively preventing the local timezone from shifting it to the previous day.
                const formattedDate = postDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'UTC' // Key change: Interpret and display the date components as UTC
                });
                // --- END DATE FIX ---

                meta.textContent = `${formattedDate}${post.readTime ? ` • ${post.readTime}` : ''}`;

                const titleLink = document.createElement('a');
                // Ensure post.link is relative to the blog page, or an absolute path
                // If blog.html is in /blog/ and posts are in /blog/posts/, then "posts/..." is correct.
                titleLink.href = post.link;
                titleLink.className = 'post-title';

                const titleHeader = document.createElement('h2');
                titleHeader.textContent = post.title;
                titleLink.appendChild(titleHeader);

                const description = document.createElement('p');
                description.className = 'post-description';
                description.textContent = post.description; // Ensure your JSON has 'description'

                postEntry.appendChild(meta);
                postEntry.appendChild(titleLink);
                postEntry.appendChild(description);

                blogPostListContainer.appendChild(postEntry);
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing blog posts:', error);
            if (loadingMessage) {
                loadingMessage.textContent = 'Could not load blog posts. Please try again later.';
                loadingMessage.style.color = 'var(--accent-primary)';
            } else {
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'Could not load blog posts. Please try again later.';
                errorMessage.style.color = 'var(--accent-primary)';
                blogPostListContainer.appendChild(errorMessage);
            }
        });
});
