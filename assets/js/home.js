document.addEventListener('DOMContentLoaded', function () {
    const featuredProjectsContainer = document.getElementById('featuredProjectsContainer');
    const latestPostsContainer = document.getElementById('latestPostsContainer');

    const createFeaturedCard = (item) => {
        const cardLink = document.createElement('a');
        cardLink.href = item.link;
        cardLink.className = 'featured-card';

        const title = document.createElement('h3');
        title.className = 'featured-card-title';
        title.textContent = item.title;

        const description = document.createElement('p');
        description.className = 'featured-card-description';
        description.textContent = item.description;

        cardLink.appendChild(title);
        cardLink.appendChild(description);

        return cardLink;
    };

    const loadContent = (url, container, count) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                container.innerHTML = ''; // Clear "Loading..." message

                // Sort blog posts by date, newest first
                if (url.includes('posts.json')) {
                    data.sort((a, b) => new Date(b.date) - new Date(a.date));
                }

                const itemsToShow = data.slice(0, count);

                if (itemsToShow.length === 0) {
                    container.innerHTML = '<p class="error-message">No items to display.</p>';
                    return;
                }

                itemsToShow.forEach(item => {
                    const card = createFeaturedCard(item);
                    container.appendChild(card);
                });
            })
            .catch(error => {
                console.error(`Error fetching from ${url}:`, error);
                container.innerHTML = `<p class="error-message">Could not load content.</p>`;
            });
    };

    // Assumes /projects/projects.json exists from our previous work
    loadContent('/projects/projects.json', featuredProjectsContainer, 3);

    // Assumes /blog/posts.json exists from your blog setup
    loadContent('/blog/posts.json', latestPostsContainer, 3);
});