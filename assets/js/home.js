document.addEventListener('DOMContentLoaded', function () {
    const featuredProjectsContainer = document.getElementById('featuredProjectsContainer');
    const latestPostsContainer = document.getElementById('latestPostsContainer');

    // This function creates the HTML for each featured item card
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

    // This function fetches data and populates the containers
    const loadContent = (url, container, count) => {
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                container.innerHTML = ''; // Clear "Loading..." message

                // Sort blog posts by date to get the latest
                if (url.includes('posts.json')) {
                    data.sort((a, b) => new Date(b.date) - new Date(a.date));
                }

                const itemsToShow = data.slice(0, count);

                if (itemsToShow.length === 0) {
                    container.innerHTML = '<p class="loading-message">No items to display.</p>';
                    return;
                }

                itemsToShow.forEach(item => {
                    container.appendChild(createFeaturedCard(item));
                });
            })
            .catch(error => {
                console.error(`Error loading content from ${url}:`, error);
                container.innerHTML = `<p class="loading-message">Could not load content.</p>`;
            });
    };

    // Load the first 3 items from your JSON files
    loadContent('/projects/projects.json', featuredProjectsContainer, 2);
    loadContent('/blog/posts.json', latestPostsContainer, 2);
});