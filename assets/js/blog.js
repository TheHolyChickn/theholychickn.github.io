document.addEventListener('DOMContentLoaded', function () {
    const blogPostListContainer = document.getElementById('blogPostListContainer');
    const loadingMessage = blogPostListContainer.querySelector('.loading-message');

    // Adjust the path to your blog-posts.json file as needed
    const jsonPath = 'posts.json'; // Assuming it's in the root

    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(posts => {
            if (loadingMessage) {
                loadingMessage.remove(); // Remove "Loading entries..." message
            }

            if (posts.length === 0) {
                const noPostsMessage = document.createElement('p');
                noPostsMessage.textContent = 'No blog posts yet. Stay tuned!';
                noPostsMessage.className = 'no-posts-message'; // For potential styling
                blogPostListContainer.appendChild(noPostsMessage);
                return;
            }

            // Sort posts by date, newest first (optional, but good practice)
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            posts.forEach(post => {
                const postEntry = document.createElement('article');
                postEntry.className = 'blog-post-entry';

                const meta = document.createElement('p');
                meta.className = 'post-meta';
                // Format date nicely (optional, could use a library for more complex formatting)
                const postDate = new Date(post.date);
                const formattedDate = postDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                meta.textContent = `${formattedDate}${post.readTime ? ` • ${post.readTime}` : ''}`;

                const titleLink = document.createElement('a');
                titleLink.href = post.link;
                titleLink.className = 'post-title';
                // Create h2 inside link for better semantics and styling control
                const titleHeader = document.createElement('h2');
                titleHeader.textContent = post.title;
                titleLink.appendChild(titleHeader);
                // Apply hover color change directly via CSS for .post-title:hover

                const description = document.createElement('p');
                description.className = 'post-description';
                description.textContent = post.description;

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
                loadingMessage.style.color = 'var(--accent-primary)'; // Or a distinct error color
            } else {
                const errorMessage = document.createElement('p');
                errorMessage.textContent = 'Could not load blog posts. Please try again later.';
                errorMessage.style.color = 'var(--accent-primary)';
                blogPostListContainer.appendChild(errorMessage);
            }
        });
});